import { API_CONFIG } from "./chat-config";

// ============================================================================
// CHAT UTILITY FUNCTIONS
// ============================================================================

export const createApiUrl = (endpoint: string, params: Record<string, string> = {}) => {
  const url = new URL(`${API_CONFIG.BASE_URL}${endpoint}`);
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, value);
  });
  return url.toString();
};

export const findLastUserMessage = (messages: any[]) => {
  return Array.isArray(messages)
    ? [...messages]
        .reverse()
        .find((m: any) => m?.role === "user" && typeof m?.content === "string")
    : undefined;
};
