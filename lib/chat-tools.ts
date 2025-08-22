import { createApiUrl } from "./chat-utils";
import { LOG_MESSAGES, ERROR_MESSAGES } from "./chat-messages";

// ============================================================================
// CHAT TOOL EXECUTORS
// ============================================================================

export const toolExecutors = {
  getStockQuote: async ({ symbol }: { symbol: string }) => {
    try {
      console.log(LOG_MESSAGES.QUOTE_FETCH_START(symbol));
      const response = await fetch(createApiUrl("/api/stock", { symbol }));
      const data = await response.json();
      console.log(LOG_MESSAGES.QUOTE_FETCH_SUCCESS(data));
      return data;
    } catch (error) {
      console.error(LOG_MESSAGES.QUOTE_FETCH_ERROR(error));
      return { error: ERROR_MESSAGES.QUOTE_FETCH_ERROR };
    }
  },

  getGlobalQuote: async ({ symbol }: { symbol: string }) => {
    try {
      const response = await fetch(
        createApiUrl("/api/stock", { 
          function: "GLOBAL_QUOTE", 
          symbol: encodeURIComponent(symbol) 
        })
      );
      return await response.json();
    } catch (error) {
      console.error(LOG_MESSAGES.TOOL_ERROR("getGlobalQuote", error));
      return { error: ERROR_MESSAGES.GLOBAL_QUOTE_ERROR };
    }
  },

  getTimeSeries: async ({
    symbol,
    interval,
    outputsize,
    month,
  }: {
    symbol: string;
    interval: string;
    outputsize?: "compact" | "full";
    month?: string;
  }) => {
    try {
      const params: Record<string, string> = {
        symbol: encodeURIComponent(symbol),
        interval: encodeURIComponent(interval),
      };
      if (outputsize) params.outputsize = outputsize;
      if (month) params.month = encodeURIComponent(month);
      
      const response = await fetch(createApiUrl("/api/stock/historical", params));
      return await response.json();
    } catch (error) {
      console.error(LOG_MESSAGES.TOOL_ERROR("getTimeSeries", error));
      return { error: ERROR_MESSAGES.TIME_SERIES_ERROR };
    }
  },

  searchTicker: async ({ keywords }: { keywords: string }) => {
    try {
      const response = await fetch(
        createApiUrl("/api/stock", {
          function: "SYMBOL_SEARCH",
          keywords: encodeURIComponent(keywords),
        })
      );
      return await response.json();
    } catch (error) {
      console.error(LOG_MESSAGES.TOOL_ERROR("searchTicker", error));
      return { error: ERROR_MESSAGES.TICKER_SEARCH_ERROR };
    }
  },

  getCompanyOverview: async ({ symbol }: { symbol: string }) => {
    try {
      const response = await fetch(
        createApiUrl("/api/stock", {
          function: "OVERVIEW",
          symbol: encodeURIComponent(symbol),
        })
      );
      return await response.json();
    } catch (error) {
      console.error(LOG_MESSAGES.TOOL_ERROR("getCompanyOverview", error));
      return { error: ERROR_MESSAGES.COMPANY_OVERVIEW_ERROR };
    }
  },
};
