import { generateText } from "ai"
import { cohere } from "@ai-sdk/cohere"

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()

    console.log("[v0] API Chat - Mensagens recebidas:", messages?.length || 0)
    console.log("[v0] API Chat - COHERE_API_KEY configurada:", !!process.env.COHERE_API_KEY)

    if (!process.env.COHERE_API_KEY) {
      console.log("[v0] API Chat - Erro: COHERE_API_KEY não configurada")
      return new Response(
        JSON.stringify({
          error:
            "COHERE_API_KEY não configurada. Por favor, adicione sua chave da API Cohere nas variáveis de ambiente.",
        }),
        { status: 500, headers: { "Content-Type": "application/json" } },
      )
    }

    console.log("[v0] API Chat - Iniciando generateText...")

    const result = await generateText({
      model: cohere("command-r-plus"),
      messages,
      system: `Você é um assistente financeiro especializado em análise de tendências de bolsa de valores e mercado financeiro. 
      
      Suas responsabilidades incluem:
      - Analisar tendências de ações e mercados
      - Explicar conceitos financeiros de forma clara
      - Fornecer insights sobre dados de mercado
      - Responder perguntas sobre investimentos e economia
      - Usar ferramentas disponíveis para buscar cotações atuais quando mencionados símbolos de ações
      
      Quando o usuário mencionar símbolos de ações (como AAPL, GOOGL, TSLA, etc.), use a ferramenta getStockQuote para obter dados atuais.
      
      Sempre seja preciso, profissional e baseie suas respostas em dados quando possível.
      Responda em português brasileiro.`,
      temperature: 0.7,
      maxTokens: 1000,
      tools: {
        getStockQuote: {
          description: "Busca cotação atual de uma ação pelo símbolo",
          parameters: {
            type: "object",
            properties: {
              symbol: {
                type: "string",
                description: "Símbolo da ação (ex: AAPL, GOOGL, TSLA)",
              },
            },
            required: ["symbol"],
          },
          execute: async ({ symbol }: { symbol: string }) => {
            try {
              console.log("[v0] API Chat - Buscando cotação para:", symbol)
              const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
              const response = await fetch(`${baseUrl}/api/stock?symbol=${symbol}`)
              const data = await response.json()
              console.log("[v0] API Chat - Cotação obtida:", data)
              return data
            } catch (error) {
              console.error("[v0] API Chat - Erro ao buscar cotação:", error)
              return { error: "Não foi possível obter a cotação no momento" }
            }
          },
        },
      },
    })

    console.log("[v0] API Chat - Texto gerado com sucesso:", !!result.text)

    return new Response(
      JSON.stringify({
        message: result.text,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    )
  } catch (error) {
    console.error("[v0] API Chat - Erro detalhado:", error)
    console.error("[v0] API Chat - Erro message:", error?.message)
    console.error("[v0] API Chat - Erro stack:", error?.stack)

    return new Response(
      JSON.stringify({
        error: "Erro interno do servidor",
        details: error?.message || "Erro desconhecido",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    )
  }
}
