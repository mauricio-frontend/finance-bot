export interface StockQuote {
  symbol: string
  price: string
  change: string
  changePercent: string
  high: string
  low: string
  open: string
  previousClose: string
  volume: string
}

export interface HistoricalData {
  date: string
  open: number
  high: number
  low: number
  close: number
  volume: number
}

export class StockService {
  static async getQuote(symbol: string): Promise<StockQuote | null> {
    try {
      const response = await fetch(`/api/stock?symbol=${symbol}&function=GLOBAL_QUOTE`)

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Erro ao buscar cotação")
      }

      const data = await response.json()
      const quote = data["Global Quote"]

      if (!quote) {
        throw new Error("Dados de cotação não encontrados")
      }

      return {
        symbol: quote["01. symbol"],
        price: quote["05. price"],
        change: quote["09. change"],
        changePercent: quote["10. change percent"].replace(/[%()]/g, ""),
        high: quote["03. high"],
        low: quote["04. low"],
        open: quote["02. open"],
        previousClose: quote["08. previous close"],
        volume: quote["06. volume"],
      }
    } catch (error) {
      console.error("Error fetching stock quote:", error)
      return null
    }
  }

  static async getHistoricalData(
    symbol: string,
    interval: "daily" | "weekly" | "monthly" = "daily",
  ): Promise<HistoricalData[]> {
    try {
      const response = await fetch(`/api/stock/historical?symbol=${symbol}&interval=${interval}`)

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Erro ao buscar dados históricos")
      }

      const data = await response.json()

      let timeSeriesKey = "Time Series (Daily)"
      if (interval === "weekly") timeSeriesKey = "Weekly Time Series"
      if (interval === "monthly") timeSeriesKey = "Monthly Time Series"

      const timeSeries = data[timeSeriesKey]

      if (!timeSeries) {
        throw new Error("Dados históricos não encontrados")
      }

      return Object.entries(timeSeries)
        .slice(0, 30) // Last 30 data points
        .map(([date, values]: [string, any]) => ({
          date,
          open: Number.parseFloat(values["1. open"]),
          high: Number.parseFloat(values["2. high"]),
          low: Number.parseFloat(values["3. low"]),
          close: Number.parseFloat(values["4. close"]),
          volume: Number.parseInt(values["5. volume"]),
        }))
        .reverse() // Chronological order
    } catch (error) {
      console.error("Error fetching historical data:", error)
      return []
    }
  }

  static formatCurrency(value: string | number): string {
    const num = typeof value === "string" ? Number.parseFloat(value) : value
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "USD",
    }).format(num)
  }

  static formatPercent(value: string | number): string {
    const num = typeof value === "string" ? Number.parseFloat(value) : value
    return `${num >= 0 ? "+" : ""}${num.toFixed(2)}%`
  }
}
