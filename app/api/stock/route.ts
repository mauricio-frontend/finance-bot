import { type NextRequest, NextResponse } from "next/server"

const ALPHA_VANTAGE_API_KEY = process.env.ALPHA_VANTAGE_API_KEY
const BASE_URL = "https://www.alphavantage.co/query"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const symbol = searchParams.get("symbol")
  const function_type = searchParams.get("function") || "GLOBAL_QUOTE"

  if (!ALPHA_VANTAGE_API_KEY) {
    return NextResponse.json({ error: "ALPHA_VANTAGE_API_KEY não configurada" }, { status: 500 })
  }

  if (!symbol) {
    return NextResponse.json({ error: "Símbolo da ação é obrigatório" }, { status: 400 })
  }

  try {
    const url = `${BASE_URL}?function=${function_type}&symbol=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    // Check for API error messages
    if (data["Error Message"]) {
      return NextResponse.json({ error: "Símbolo de ação inválido" }, { status: 400 })
    }

    if (data["Note"]) {
      return NextResponse.json(
        { error: "Limite de requisições da API atingido. Tente novamente em 1 minuto." },
        { status: 429 },
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Stock API error:", error)
    return NextResponse.json({ error: "Erro ao buscar dados da ação" }, { status: 500 })
  }
}
