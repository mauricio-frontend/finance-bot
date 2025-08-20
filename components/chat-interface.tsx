"use client"
import { useChat } from "@ai-sdk/react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, TrendingUp, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function ChatInterface() {
  const { messages, input, handleInputChange, handleSubmit, isLoading, error } = useChat({
    api: "/api/chat",
    initialMessages: [
      {
        id: "1",
        role: "assistant",
        content:
          "Olá! Sou seu assistente financeiro especializado em análise de tendências de bolsa. Posso ajudá-lo a analisar ações, entender movimentos do mercado e explicar conceitos financeiros. Como posso ajudá-lo hoje?",
      },
    ],
  })

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="h-[600px] flex flex-col">
        {/* Error Alert */}
        {error && (
          <div className="p-4 border-b">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {error.message?.includes("COHERE_API_KEY")
                  ? "Chave da API Cohere não configurada. Adicione COHERE_API_KEY nas variáveis de ambiente."
                  : "Erro ao processar sua mensagem. Tente novamente."}
              </AlertDescription>
            </Alert>
          </div>
        )}

        {/* Chat Messages */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] rounded-lg px-4 py-2 chat-message ${
                  message.role === "user" ? "bg-primary text-primary-foreground" : "bg-card border shadow-sm"
                }`}
              >
                {message.role === "assistant" && (
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium text-primary">FinanceBot</span>
                  </div>
                )}
                <div className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</div>
                <span className="text-xs opacity-70 mt-1 block">
                  {new Date(message.createdAt || Date.now()).toLocaleTimeString("pt-BR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          ))}

          {/* Loading indicator */}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-card border shadow-sm rounded-lg px-4 py-2 max-w-[80%]">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium text-primary">FinanceBot</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-primary rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-primary rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Form */}
        <div className="border-t p-4">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              value={input}
              onChange={handleInputChange}
              placeholder="Pergunte sobre tendências de ações, análises de mercado, conceitos financeiros..."
              className="flex-1"
              disabled={isLoading}
            />
            <Button type="submit" disabled={isLoading || !input?.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
          <p className="text-xs text-muted-foreground mt-2">
            💡 Experimente perguntar: "Como está o mercado hoje?" ou "Explique o que são dividendos"
          </p>
        </div>
      </Card>
    </div>
  )
}
