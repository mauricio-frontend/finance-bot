import { generateText } from "ai";
import { cohere } from "@ai-sdk/cohere";
import { z } from "zod";

// Import organized modules
import {
  API_CONFIG,
  COHERE_MODELS,
  GENERATION_CONFIG,
  SYSTEM_PROMPTS,
  createFallbackPrompt,
  TOOL_SCHEMAS,
  ERROR_MESSAGES,
  LOG_MESSAGES,
  createApiUrl,
  findLastUserMessage,
  toolExecutors,
} from "@/lib/chat";

// ============================================================================
// MAIN API ROUTE
// ============================================================================

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    console.log(LOG_MESSAGES.MESSAGES_RECEIVED(messages?.length || 0));
    console.log(LOG_MESSAGES.COHERE_KEY_CONFIGURED(!!API_CONFIG.COHERE_API_KEY));

    if (!API_CONFIG.COHERE_API_KEY) {
      console.log(LOG_MESSAGES.COHERE_KEY_ERROR);
      return new Response(
        JSON.stringify({
          error: ERROR_MESSAGES.COHERE_API_KEY_MISSING,
        }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    console.log(LOG_MESSAGES.GENERATE_TEXT_START);

    const result = await generateText({
      model: cohere(COHERE_MODELS.PRIMARY),
      messages,
      system: SYSTEM_PROMPTS.MAIN,
      temperature: GENERATION_CONFIG.TEMPERATURE,
      tools: {
        getStockQuote: {
          description: "Busca cotação atual de uma ação pelo símbolo",
          inputSchema: z.object({
            symbol: TOOL_SCHEMAS.SYMBOL,
          }),
          execute: toolExecutors.getStockQuote,
        },
        getGlobalQuote: {
          description: "Retorna a cotação atual via GLOBAL_QUOTE",
          inputSchema: z.object({
            symbol: TOOL_SCHEMAS.SYMBOL,
          }),
          execute: toolExecutors.getGlobalQuote,
        },
        getTimeSeries: {
          description:
            "Retorna séries históricas. Intervalos suportados: daily, weekly, monthly, 1min, 5min, 15min, 30min, 60min.",
          inputSchema: z.object({
            symbol: TOOL_SCHEMAS.SYMBOL,
            interval: TOOL_SCHEMAS.INTERVAL,
            outputsize: TOOL_SCHEMAS.OUTPUT_SIZE,
            month: TOOL_SCHEMAS.MONTH,
          }),
          execute: toolExecutors.getTimeSeries,
        },
        searchTicker: {
          description:
            "Pesquisa tickers por palavras-chave (nome de empresa, etc.)",
          inputSchema: z.object({
            keywords: TOOL_SCHEMAS.KEYWORDS,
          }),
          execute: toolExecutors.searchTicker,
        },
        getCompanyOverview: {
          description:
            "Obtém overview (dados fundamentais) da empresa pelo ticker",
          inputSchema: z.object({
            symbol: TOOL_SCHEMAS.SYMBOL,
          }),
          execute: toolExecutors.getCompanyOverview,
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
        const lastUser = findLastUserMessage(messages);
        const prompt = createFallbackPrompt(lastUser?.content);

        const fallback = await generateText({
          model: cohere(COHERE_MODELS.PRIMARY),
          prompt,
          system: SYSTEM_PROMPTS.FALLBACK,
          temperature: GENERATION_CONFIG.FALLBACK_TEMPERATURE,
        });
        finalText = (fallback.text || "").trim();
        console.log(LOG_MESSAGES.FALLBACK_USED(!!finalText));
      } catch (e) {
        console.error(LOG_MESSAGES.FALLBACK_ERROR(e));
      }
    }

    if (!finalText) {
      const lastUser = findLastUserMessage(messages);
      const hint = API_CONFIG.ALPHA_VANTAGE_API_KEY
        ? ""
        : " Observação: a API de cotações pode não estar configurada (ALPHA_VANTAGE_API_KEY ausente).";
      finalText = `Não consegui gerar uma resposta completa agora.${hint} Vou tentar ajudar mesmo assim.
Pergunta do usuário: ${lastUser?.content ?? "(indisponível)"}`;
    }

    // Third attempt: try a different Cohere model in case command-r-plus-08-2024 is constrained
    if (!finalText) {
      try {
        const lastUser = findLastUserMessage(messages);
        const prompt = createFallbackPrompt(lastUser?.content);

        const alt = await generateText({
          model: cohere(COHERE_MODELS.FALLBACK),
          prompt,
          system: SYSTEM_PROMPTS.FALLBACK,
          temperature: GENERATION_CONFIG.FALLBACK_TEMPERATURE,
        });
        const altText = (alt.text || "").trim();
        if (altText) {
          finalText = altText;
          console.log(LOG_MESSAGES.ALTERNATIVE_MODEL_USED);
        }
      } catch (e) {
        console.error(LOG_MESSAGES.ALTERNATIVE_MODEL_ERROR(e));
      }
    }

    console.log(LOG_MESSAGES.FINAL_TEXT_EMPTY(!finalText));

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
    console.error(LOG_MESSAGES.DETAILED_ERROR(error));
    const errMessage = error instanceof Error ? error.message : String(error);
    const errStack = error instanceof Error ? error.stack : undefined;
    console.error(LOG_MESSAGES.ERROR_MESSAGE(errMessage));
    console.error(LOG_MESSAGES.ERROR_STACK(errStack || ""));

    return new Response(
      JSON.stringify({
        error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
        details: errMessage || ERROR_MESSAGES.UNKNOWN_ERROR,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
