// ============================================================================
// CHAT API CONFIGURATION
// ============================================================================

export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
  COHERE_API_KEY: process.env.COHERE_API_KEY,
  ALPHA_VANTAGE_API_KEY: process.env.ALPHA_VANTAGE_API_KEY,
} as const;

export const COHERE_MODELS = {
  PRIMARY: "command-r-plus",
  FALLBACK: "command-r",
} as const;

export const GENERATION_CONFIG = {
  TEMPERATURE: 0.7,
  FALLBACK_TEMPERATURE: 0.5,
} as const;

export const TIME_SERIES_INTERVALS = [
  "daily",
  "weekly", 
  "monthly",
  "1min",
  "5min",
  "15min",
  "30min",
  "60min",
] as const;
