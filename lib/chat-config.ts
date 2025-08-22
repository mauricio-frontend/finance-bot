// ============================================================================
// CHAT API CONFIGURATION
// ============================================================================

export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
  COHERE_API_KEY: process.env.COHERE_API_KEY,
  ALPHA_VANTAGE_API_KEY: process.env.ALPHA_VANTAGE_API_KEY,
} as const;

export const COHERE_MODELS = {
  // Modelo principal - mais atualizado e robusto
  PRIMARY: "command-r-plus",
  
  // Fallback - modelo alternativo estável
  FALLBACK: "command-r",
  
  // Modelos alternativos para diferentes cenários
  LIGHT: "command-light", // Mais rápido, dados atualizados
  NIGHTLY: "command-nightly", // Versão experimental mais recente
  
  // Modelos específicos para análise financeira
  FINANCIAL: "command-r-plus", // Melhor para análise financeira
  REAL_TIME: "command-r-plus", // Melhor para dados em tempo real
} as const;

export const GENERATION_CONFIG = {
  TEMPERATURE: 0.7,
  FALLBACK_TEMPERATURE: 0.5,
  // Configurações específicas para dados financeiros
  FINANCIAL_TEMPERATURE: 0.3, // Mais conservador para dados financeiros
  REAL_TIME_TEMPERATURE: 0.4, // Balanceado para dados em tempo real
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

// Configurações para diferentes tipos de dados financeiros
export const FINANCIAL_DATA_CONFIG = {
  // Alpha Vantage (atual)
  ALPHA_VANTAGE: {
    name: "Alpha Vantage",
    updateFrequency: "1-5 minutos",
    dataQuality: "Boa",
    rateLimit: "5 calls/min (free), 500 calls/min (premium)",
    coverage: "Global",
  },
  
  // Alternativas recomendadas
  YAHOO_FINANCE: {
    name: "Yahoo Finance",
    updateFrequency: "Tempo real",
    dataQuality: "Excelente",
    rateLimit: "Sem limite significativo",
    coverage: "Global",
  },
  
  IEX_CLOUD: {
    name: "IEX Cloud",
    updateFrequency: "Tempo real",
    dataQuality: "Excelente",
    rateLimit: "Depende do plano",
    coverage: "Global",
  },
  
  POLYGON: {
    name: "Polygon.io",
    updateFrequency: "Tempo real",
    dataQuality: "Premium",
    rateLimit: "Depende do plano",
    coverage: "Global",
  },
} as const;
