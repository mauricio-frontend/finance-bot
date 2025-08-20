import { ChatInterface } from "@/components/chat-interface"

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">FinanceBot</h1>
          <p className="text-muted-foreground text-lg">
            Seu assistente inteligente para análise de tendências de bolsa
          </p>
        </header>
        <ChatInterface />
      </div>
    </main>
  )
}
