// ============================================================================
// CHAT MESSAGES
// ============================================================================

export const ERROR_MESSAGES = {
  COHERE_API_KEY_MISSING: "COHERE_API_KEY não configurada. Por favor, adicione sua chave da API Cohere nas variáveis de ambiente.",
  QUOTE_FETCH_ERROR: "Não foi possível obter a cotação no momento",
  GLOBAL_QUOTE_ERROR: "Falha ao obter GLOBAL_QUOTE",
  TIME_SERIES_ERROR: "Falha ao obter séries históricas",
  TICKER_SEARCH_ERROR: "Falha ao pesquisar tickers",
  COMPANY_OVERVIEW_ERROR: "Falha ao obter overview da empresa",
  INTERNAL_SERVER_ERROR: "Erro interno do servidor",
  UNKNOWN_ERROR: "Erro desconhecido",
} as const;

const API_CHAT_PREFIX = "[v0] API Chat";

export const LOG_MESSAGES = {
  API_CHAT_PREFIX,
  MESSAGES_RECEIVED: (count: number) => `${API_CHAT_PREFIX} - Mensagens recebidas: ${count}`,
  COHERE_KEY_CONFIGURED: (configured: boolean) => `${API_CHAT_PREFIX} - COHERE_API_KEY configurada: ${configured}`,
  COHERE_KEY_ERROR: `${API_CHAT_PREFIX} - Erro: COHERE_API_KEY não configurada`,
  GENERATE_TEXT_START: `${API_CHAT_PREFIX} - Iniciando generateText...`,
  QUOTE_FETCH_START: (symbol: string) => `${API_CHAT_PREFIX} - Buscando cotação para: ${symbol}`,
  QUOTE_FETCH_SUCCESS: (data: any) => `${API_CHAT_PREFIX} - Cotação obtida: ${JSON.stringify(data)}`,
  QUOTE_FETCH_ERROR: (error: any) => `${API_CHAT_PREFIX} - Erro ao buscar cotação: ${error}`,
  TOOL_ERROR: (toolName: string, error: any) => `${API_CHAT_PREFIX} - Erro ${toolName}: ${error}`,
  FALLBACK_USED: (used: boolean) => `${API_CHAT_PREFIX} - usado fallback sem ferramentas? ${used}`,
  FALLBACK_ERROR: (error: any) => `${API_CHAT_PREFIX} - erro no fallback sem ferramentas: ${error}`,
  ALTERNATIVE_MODEL_USED: `${API_CHAT_PREFIX} - usado modelo alternativo command-r`,
  ALTERNATIVE_MODEL_ERROR: (error: any) => `${API_CHAT_PREFIX} - erro no modelo alternativo: ${error}`,
  FINAL_TEXT_EMPTY: (empty: boolean) => `${API_CHAT_PREFIX} - Texto final a retornar vazio? ${empty}`,
  DETAILED_ERROR: (error: any) => `${API_CHAT_PREFIX} - Erro detalhado: ${error}`,
  ERROR_MESSAGE: (message: string) => `${API_CHAT_PREFIX} - Erro message: ${message}`,
  ERROR_STACK: (stack: string) => `${API_CHAT_PREFIX} - Erro stack: ${stack}`,
} as const;
