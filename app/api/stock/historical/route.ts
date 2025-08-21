import { type NextRequest, NextResponse } from "next/server"

const ALPHA_VANTAGE_API_KEY = process.env.ALPHA_VANTAGE_API_KEY
const BASE_URL = "https://www.alphavantage.co/query"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const symbol = searchParams.get("symbol")
  const interval = searchParams.get("interval") || "daily"
  const outputsize = searchParams.get("outputsize")
  const month = searchParams.get("month")

  if (!ALPHA_VANTAGE_API_KEY) {
    return NextResponse.json({ error: "ALPHA_VANTAGE_API_KEY não configurada" }, { status: 500 })
  }

  if (!symbol) {
    return NextResponse.json({ error: "Símbolo da ação é obrigatório" }, { status: 400 })
  }

  try {
    let functionType = "TIME_SERIES_DAILY"
    const intradayIntervals = ["1min", "5min", "15min", "30min", "60min"]
    const isIntraday = intradayIntervals.includes(interval)
    if (isIntraday) functionType = "TIME_SERIES_INTRADAY"
    if (interval === "weekly") functionType = "TIME_SERIES_WEEKLY"
    if (interval === "monthly") functionType = "TIME_SERIES_MONTHLY"

    let url = `${BASE_URL}?function=${functionType}&symbol=${encodeURIComponent(symbol as string)}&apikey=${ALPHA_VANTAGE_API_KEY}`
    if (isIntraday) {
      url += `&interval=${encodeURIComponent(interval)}`
      if (outputsize) url += `&outputsize=${encodeURIComponent(outputsize)}`
      if (month) url += `&month=${encodeURIComponent(month)}`
    }
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

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
    console.error("Historical stock API error:", error)
    return NextResponse.json({ error: "Erro ao buscar dados históricos da ação" }, { status: 500 })
  }
}
