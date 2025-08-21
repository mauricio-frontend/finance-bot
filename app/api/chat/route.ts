import { generateText } from "ai";
import { cohere } from "@ai-sdk/cohere";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    console.log("[v0] API Chat - Mensagens recebidas:", messages?.length || 0);
    console.log(
      "[v0] API Chat - COHERE_API_KEY configurada:",
      !!process.env.COHERE_API_KEY
    );

    if (!process.env.COHERE_API_KEY) {
      console.log("[v0] API Chat - Erro: COHERE_API_KEY não configurada");
      return new Response(
        JSON.stringify({
          error:
            "COHERE_API_KEY não configurada. Por favor, adicione sua chave da API Cohere nas variáveis de ambiente.",
        }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    console.log("[v0] API Chat - Iniciando generateText...");

    const result = await generateText({
      model: cohere("command-r-plus"),
      messages,
      system: `Você é um assistente financeiro especializado em análise de tendências de bolsa de valores e mercado financeiro. 
      
      Suas responsabilidades incluem:
      - Analisar tendências de ações e mercados
      - Explicar conceitos financeiros de forma clara
      - Fornecer insights sobre dados de mercado
      - Responder perguntas sobre investimentos e economia
      - Usar ferramentas disponíveis para buscar dados atuais e históricos quando mencionados símbolos de ações
      
      Ferramentas disponíveis e como usá-las:
      - getGlobalQuote: use para obter a cotação atual (function=GLOBAL_QUOTE)
      - getTimeSeries: use para histórico (intervalos: daily, weekly, monthly, 1min, 5min, 15min, 30min, 60min)
      - searchTicker: use quando o usuário fornecer um nome de empresa e não o ticker
      - getCompanyOverview: use para dados fundamentais (visão geral/overview)
      - getStockQuote: alternativa simples para apenas preço atual
      
      Sempre seja preciso, profissional e baseie suas respostas em dados quando possível.
      Se uma ferramenta não estiver disponível ou falhar, responda mesmo assim com base no seu conhecimento e deixe claro a limitação.
      Sempre produza uma resposta útil e acionável.
      Responda em português brasileiro.`,
      temperature: 0.7,
      tools: {
        getStockQuote: {
          description: "Busca cotação atual de uma ação pelo símbolo",
          inputSchema: z.object({
            symbol: z
              .string()
              .min(1)
              .describe("Símbolo da ação (ex: AAPL, GOOGL, TSLA)"),
          }),
          execute: async ({ symbol }: { symbol: string }) => {
            try {
              console.log("[v0] API Chat - Buscando cotação para:", symbol);
              const baseUrl =
                process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
              const response = await fetch(
                `${baseUrl}/api/stock?symbol=${symbol}`
              );
              const data = await response.json();
              console.log("[v0] API Chat - Cotação obtida:", data);
              return data;
            } catch (error) {
              console.error("[v0] API Chat - Erro ao buscar cotação:", error);
              return { error: "Não foi possível obter a cotação no momento" };
            }
          },
        },
        getGlobalQuote: {
          description: "Retorna a cotação atual via GLOBAL_QUOTE",
          inputSchema: z.object({
            symbol: z.string().min(1).describe("Símbolo da ação (ex: AAPL)"),
          }),
          execute: async ({ symbol }: { symbol: string }) => {
            try {
              const baseUrl =
                process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
              const response = await fetch(
                `${baseUrl}/api/stock?function=GLOBAL_QUOTE&symbol=${encodeURIComponent(
                  symbol
                )}`
              );
              return await response.json();
            } catch (error) {
              console.error("[v0] API Chat - Erro getGlobalQuote:", error);
              return { error: "Falha ao obter GLOBAL_QUOTE" };
            }
          },
        },
        getTimeSeries: {
          description:
            "Retorna séries históricas. Intervalos suportados: daily, weekly, monthly, 1min, 5min, 15min, 30min, 60min.",
          inputSchema: z.object({
            symbol: z.string().min(1).describe("Símbolo da ação (ex: AAPL)"),
            interval: z
              .enum([
                "daily",
                "weekly",
                "monthly",
                "1min",
                "5min",
                "15min",
                "30min",
                "60min",
              ])
              .describe("Intervalo de tempo"),
            outputsize: z.enum(["compact", "full"]).optional(),
            month: z
              .string()
              .regex(/^\d{4}-\d{2}$/)
              .describe("YYYY-MM, apenas para intraday")
              .optional(),
          }),
          execute: async ({
            symbol,
            interval,
            outputsize,
            month,
          }: {
            symbol: string;
            interval: string;
            outputsize?: "compact" | "full";
            month?: string;
          }) => {
            try {
              const baseUrl =
                process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
              let url = `${baseUrl}/api/stock/historical?symbol=${encodeURIComponent(
                symbol
              )}&interval=${encodeURIComponent(interval)}`;
              if (outputsize) url += `&outputsize=${outputsize}`;
              if (month) url += `&month=${encodeURIComponent(month)}`;
              const response = await fetch(url);
              return await response.json();
            } catch (error) {
              console.error("[v0] API Chat - Erro getTimeSeries:", error);
              return { error: "Falha ao obter séries históricas" };
            }
          },
        },
        searchTicker: {
          description:
            "Pesquisa tickers por palavras-chave (nome de empresa, etc.)",
          inputSchema: z.object({
            keywords: z
              .string()
              .min(2)
              .describe("Palavras-chave para busca, ex: 'Tesla'"),
          }),
          execute: async ({ keywords }: { keywords: string }) => {
            try {
              const baseUrl =
                process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
              const response = await fetch(
                `${baseUrl}/api/stock?function=SYMBOL_SEARCH&keywords=${encodeURIComponent(
                  keywords
                )}`
              );
              return await response.json();
            } catch (error) {
              console.error("[v0] API Chat - Erro searchTicker:", error);
              return { error: "Falha ao pesquisar tickers" };
            }
          },
        },
        getCompanyOverview: {
          description:
            "Obtém overview (dados fundamentais) da empresa pelo ticker",
          inputSchema: z.object({
            symbol: z.string().min(1).describe("Símbolo da ação (ex: AAPL)"),
          }),
          execute: async ({ symbol }: { symbol: string }) => {
            try {
              const baseUrl =
                process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
              const response = await fetch(
                `${baseUrl}/api/stock?function=OVERVIEW&symbol=${encodeURIComponent(
                  symbol
                )}`
              );
              return await response.json();
            } catch (error) {
              console.error("[v0] API Chat - Erro getCompanyOverview:", error);
              return { error: "Falha ao obter overview da empresa" };
            }
          },
        },
      },
    });

    // Debug: understand why text may be empty
    try {
      const r: any = result as any;
      console.log("[v0] API Chat - result debug:", {
        hasText: !!result.text,
        textLen: (result.text || "").length,
        hasToolResults: Array.isArray(r?.toolResults),
        toolResultsLen: Array.isArray(r?.toolResults) ? r.toolResults.length : 0,
        finishReason: r?.finishReason,
      });
    } catch {}

    const rawText = (result.text || "").trim();
    let finalText = rawText;

    if (!finalText) {
      const toolResults = (result as any)?.toolResults;
      const firstToolResult = Array.isArray(toolResults)
        ? toolResults[0]
        : undefined;
      const toolPayload = firstToolResult?.result;
      if (toolPayload) {
        finalText =
          typeof toolPayload === "string"
            ? toolPayload
            : JSON.stringify(toolPayload);
      }
    }

    // Attempt to read tool outputs from steps array if available
    if (!finalText) {
      try {
        const steps = (result as any)?.steps;
        if (Array.isArray(steps)) {
          const toolResultStep = steps.find(
            (s: any) => s?.type === "tool-result" && s?.result != null,
          );
          const payload = toolResultStep?.result;
          if (payload) {
            finalText =
              typeof payload === "string" ? payload : JSON.stringify(payload);
          }
        }
      } catch {}
    }

    // Second attempt: force a plain answer without tools
    if (!finalText) {
      try {
        const lastUser = Array.isArray(messages)
          ? [...messages]
              .reverse()
              .find(
                (m: any) => m?.role === "user" && typeof m?.content === "string"
              )
          : undefined;
        const prompt = lastUser?.content
          ? `Pergunta: ${lastUser.content}\nResponda de forma clara e objetiva.`
          : `Explique brevemente a situação do mercado hoje.`;

        const fallback = await generateText({
          model: cohere("command-r-plus"),
          prompt,
          system:
            "Você é um assistente financeiro útil. Responda diretamente e de forma concisa sem depender de ferramentas.",
          temperature: 0.5,
        });
        finalText = (fallback.text || "").trim();
        console.log("[v0] API Chat - usado fallback sem ferramentas?", !!finalText);
      } catch (e) {
        console.error("[v0] API Chat - erro no fallback sem ferramentas:", e);
      }
    }

    if (!finalText) {
      const lastUser = Array.isArray(messages)
        ? [...messages]
            .reverse()
            .find(
              (m: any) => m?.role === "user" && typeof m?.content === "string"
            )
        : undefined;
      const hint = process.env.ALPHA_VANTAGE_API_KEY
        ? ""
        : " Observação: a API de cotações pode não estar configurada (ALPHA_VANTAGE_API_KEY ausente).";
      finalText = `Não consegui gerar uma resposta completa agora.${hint} Vou tentar ajudar mesmo assim.
Pergunta do usuário: ${lastUser?.content ?? "(indisponível)"}`;
    }

    // Third attempt: try a different Cohere model in case command-r-plus is constrained
    if (!finalText) {
      try {
        const lastUser = Array.isArray(messages)
          ? [...messages]
              .reverse()
              .find(
                (m: any) => m?.role === "user" && typeof m?.content === "string"
              )
          : undefined;
        const prompt = lastUser?.content
          ? `Pergunta: ${lastUser.content}\nResponda de forma clara e objetiva.`
          : `Explique brevemente a situação do mercado hoje.`;

        const alt = await generateText({
          model: cohere("command-r"),
          prompt,
          system:
            "Você é um assistente financeiro útil. Responda diretamente e de forma concisa sem depender de ferramentas.",
          temperature: 0.5,
        });
        const altText = (alt.text || "").trim();
        if (altText) {
          finalText = altText;
          console.log("[v0] API Chat - usado modelo alternativo command-r");
        }
      } catch (e) {
        console.error("[v0] API Chat - erro no modelo alternativo:", e);
      }
    }

    console.log("[v0] API Chat - Texto final a retornar vazio?", !finalText);

    return new Response(
      JSON.stringify({
        message: finalText,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("[v0] API Chat - Erro detalhado:", error);
    const errMessage = error instanceof Error ? error.message : String(error);
    const errStack = error instanceof Error ? error.stack : undefined;
    console.error("[v0] API Chat - Erro message:", errMessage);
    console.error("[v0] API Chat - Erro stack:", errStack);

    return new Response(
      JSON.stringify({
        error: "Erro interno do servidor",
        details: errMessage || "Erro desconhecido",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
