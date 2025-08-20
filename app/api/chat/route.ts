import { streamText, tool } from "ai"
import { cohere } from "@ai-sdk/cohere"
import { z } from "zod"

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()

    if (!process.env.COHERE_API_KEY) {
      return new Response(
        JSON.stringify({
          error:
            "COHERE_API_KEY não configurada. Por favor, adicione sua chave da API Cohere nas variáveis de ambiente.",
        }),
        { status: 500, headers: { "Content-Type": "application/json" } },
      )
    }

    const result = await streamText({
      model: cohere("command-r-plus"),
      messages,
      system: `Você é um assistente financeiro especializado em análise de tendências de bolsa de valores e mercado financeiro. 
      
      Suas responsabilidades incluem:
      - Analisar tendências de ações e mercados
      - Explicar conceitos financeiros de forma clara
      - Fornecer insights sobre dados de mercado
      - Responder perguntas sobre investimentos e economia
      
      Quando o usuário perguntar sobre uma ação específica, use a ferramenta getStockQuote para obter dados em tempo real.
      Sempre seja preciso, profissional e baseie suas respostas em dados quando possível.
      Responda em português brasileiro.`,
      temperature: 0.7,
      maxTokens: 1000,
      tools: {
        getStockQuote: tool({
          description: "Obter cotação atual de uma ação pelo símbolo (ex: AAPL, GOOGL, TSLA)",
          parameters: z.object({
            symbol: z.string().describe("Símbolo da ação (ex: AAPL, GOOGL, TSLA)"),
          }),
          execute: async ({ symbol }) => {
            try {
              const response = await fetch(
                `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/stock?symbol=${symbol}&function=GLOBAL_QUOTE`,
              )

              if (!response.ok) {
                return { error: "Erro ao buscar dados da ação" }
              }

              const data = await response.json()
              const quote = data["Global Quote"]

              if (!quote) {
                return { error: "Ação não encontrada" }
              }

              return {
                symbol: quote["01. symbol"],
                price: quote["05. price"],
                change: quote["09. change"],
                changePercent: quote["10. change percent"],
                high: quote["03. high"],
                low: quote["04. low"],
                open: quote["02. open"],
                previousClose: quote["08. previous close"],
                volume: quote["06. volume"],
              }
            } catch (error) {
              return { error: "Erro ao buscar cotação da ação" }
            }
          },
        }),
      },
    })

    return result.toDataStreamResponse()
  } catch (error) {
    console.error("Chat API error:", error)
    return new Response(JSON.stringify({ error: "Erro interno do servidor" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
