import { z } from "zod";
import { TIME_SERIES_INTERVALS } from "./chat-config";

// ============================================================================
// CHAT TOOL SCHEMAS
// ============================================================================

export const TOOL_SCHEMAS = {
  SYMBOL: z.string().min(1).describe("Símbolo da ação (ex: AAPL, GOOGL, TSLA)"),
  KEYWORDS: z.string().min(2).describe("Palavras-chave para busca, ex: 'Tesla'"),
  INTERVAL: z.enum(TIME_SERIES_INTERVALS).describe("Intervalo de tempo"),
  OUTPUT_SIZE: z.enum(["compact", "full"]).optional(),
  MONTH: z.string().regex(/^\d{4}-\d{2}$/).describe("YYYY-MM, apenas para intraday").optional(),
} as const;
