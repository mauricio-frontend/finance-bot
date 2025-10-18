# FinanceBot 🤖💹

**Seu assistente inteligente para análise de tendências de bolsa de valores**

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/mmadrugadeazevedos-projects/v0-next-js-chatbot-cohere)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.app-black?style=for-the-badge)](https://v0.app/chat/projects/M1MhvXYBcz7)
[![Live Demo](https://img.shields.io/badge/Live%20Demo-FinanceBot-blue?style=for-the-badge)](https://my-finance-bot.vercel.app/)

## 🌟 Visão Geral

O FinanceBot é um assistente financeiro inteligente especializado em análise de tendências de bolsa de valores e mercado financeiro. Desenvolvido com tecnologias modernas, ele combina a inteligência artificial do Cohere com dados em tempo real do Alpha Vantage para fornecer insights valiosos sobre o mercado financeiro.

### 🚀 **Acesse o FinanceBot**
**[https://my-finance-bot.vercel.app/](https://my-finance-bot.vercel.app/)**

## ✨ Funcionalidades Principais

### 📊 **Análise de Ações**
- **Cotações em Tempo Real**: Obtenha preços atuais de ações
- **Dados Históricos**: Acesse séries temporais (diárias, semanais, mensais, intraday)
- **Visão Geral da Empresa**: Dados fundamentais e informações corporativas
- **Busca de Tickers**: Encontre símbolos de ações por nome da empresa

### 🤖 **Assistente Inteligente**
- **Análise de Tendências**: Compreenda movimentos do mercado
- **Explicações Financeiras**: Conceitos explicados de forma clara
- **Insights Personalizados**: Respostas baseadas em dados reais
- **Interface Conversacional**: Interação natural em português brasileiro

### 🔧 **Ferramentas Disponíveis**
- `getStockQuote`: Cotação atual simples
- `getGlobalQuote`: Dados completos via GLOBAL_QUOTE
- `getTimeSeries`: Histórico com múltiplos intervalos
- `searchTicker`: Busca por palavras-chave
- `getCompanyOverview`: Dados fundamentais da empresa

## 🛠️ Tecnologias Utilizadas

### **Frontend**
- **Next.js 14**: Framework React com App Router
- **TypeScript**: Tipagem estática para maior confiabilidade
- **Tailwind CSS**: Estilização moderna e responsiva
- **shadcn/ui**: Componentes de interface elegantes

### **Backend & APIs**
- **Cohere AI**: Modelo `command-r-plus-08-2024` para processamento de linguagem natural
- **Alpha Vantage**: Dados financeiros em tempo real
- **Next.js API Routes**: Endpoints para integração das APIs

### **Ferramentas de Desenvolvimento**
- **Zod**: Validação de schemas
- **AI SDK**: Integração com modelos de IA
- **Vercel**: Deploy e hospedagem

## 🚀 Como Usar

### **Para Usuários Finais**

1. **Acesse o FinanceBot**: Vá para [https://my-finance-bot.vercel.app/](https://my-finance-bot.vercel.app/)

2. **Faça suas perguntas**:
   - "Como está o mercado hoje?"
   - "Qual a cotação da AAPL?"
   - "Explique o que são dividendos"
   - "Mostre o histórico da TSLA dos últimos 30 dias"
   - "Busque informações sobre a Tesla"

3. **Receba insights**: O bot fornecerá análises baseadas em dados reais do mercado

### **Exemplos de Perguntas**

```
💡 Perguntas que você pode fazer:

📈 Análise de Mercado:
• "Como está o mercado hoje?"
• "Qual a tendência da bolsa brasileira?"
• "Explique o que está acontecendo com as tech stocks"

💰 Cotações e Dados:
• "Qual o preço da Apple?"
• "Mostre a cotação da GOOGL"
• "Dados da Tesla"

📊 Análise Histórica:
• "Histórico da AAPL dos últimos 30 dias"
• "Série temporal da TSLA semanal"
• "Dados mensais da Microsoft"

🏢 Informações Empresariais:
• "Dados fundamentais da Apple"
• "Overview da Tesla"
• "Informações sobre a Microsoft"

📚 Conceitos Financeiros:
• "O que são dividendos?"
• "Explique o que é P/E ratio"
• "Como funciona o mercado de ações?"
```

## 🔧 Configuração para Desenvolvedores

### **Pré-requisitos**
- Node.js 18+
- pnpm (recomendado) ou npm
- Contas nas APIs:
  - [Cohere AI](https://cohere.ai/)
  - [Alpha Vantage](https://www.alphavantage.co/)

### **Instalação**

1. **Clone o repositório**:
```bash
git clone <repository-url>
cd finance-bot
```

2. **Instale as dependências**:
```bash
pnpm install
```

3. **Configure as variáveis de ambiente**:
```bash
# .env.local
COHERE_API_KEY=sua_chave_cohere_aqui
ALPHA_VANTAGE_API_KEY=sua_chave_alphavantage_aqui
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

4. **Execute o projeto**:
```bash
pnpm dev
```

### **Estrutura do Projeto**

```
finance-bot/
├── app/
│   ├── api/
│   │   ├── chat/route.ts          # API principal do chat
│   │   └── stock/                 # APIs de dados financeiros
│   ├── layout.tsx                 # Layout principal
│   └── page.tsx                   # Página inicial
├── components/
│   ├── chat-interface.tsx         # Interface do chat
│   └── ui/                        # Componentes de interface
├── lib/
│   ├── chat/                      # Módulos organizados do chat
│   │   ├── index.ts               # Ponto único de importação
│   │   ├── chat-config.ts         # Configurações
│   │   ├── chat-prompts.ts        # Prompts do sistema
│   │   ├── chat-schemas.ts        # Schemas de validação
│   │   ├── chat-messages.ts       # Mensagens de erro/log
│   │   ├── chat-utils.ts          # Funções utilitárias
│   │   └── chat-tools.ts          # Executores de ferramentas
│   ├── stock-service.ts           # Serviço de dados financeiros
│   └── utils.ts                   # Utilitários gerais
└── README.md
```

## 📈 APIs Integradas

### **Cohere AI**
- **Modelo**: `command-r-plus`
- **Função**: Processamento de linguagem natural e geração de respostas
- **Recursos**: Análise contextual, compreensão de perguntas financeiras

### **Alpha Vantage**
- **Função**: Dados financeiros em tempo real
- **Endpoints Utilizados**:
  - `GLOBAL_QUOTE`: Cotações atuais
  - `TIME_SERIES`: Dados históricos
  - `SYMBOL_SEARCH`: Busca de símbolos
  - `OVERVIEW`: Dados fundamentais

## 🎯 Benefícios para o Usuário

### **Para Investidores**
- Acesso rápido a dados de mercado
- Análises contextualizadas
- Explicações de conceitos financeiros
- Interface intuitiva e responsiva

### **Para Estudantes**
- Aprendizado sobre mercado financeiro
- Explicações claras de conceitos
- Dados reais para estudos

### **Para Profissionais**
- Ferramenta de pesquisa rápida
- Análises para relatórios
- Acesso a dados fundamentais

## 🔄 Deploy e Manutenção

### **Deploy Automático**
- **Vercel**: Deploy automático via GitHub
- **v0.app**: Sincronização com interface visual
- **Monitoramento**: Logs e métricas em tempo real

### **Atualizações**
- Sincronização automática com v0.app
- Deploy contínuo via Vercel
- Manutenção simplificada

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 🔗 Links Úteis

- **[FinanceBot Live](https://my-finance-bot.vercel.app/)**
- **[Cohere AI](https://cohere.ai/)**
- **[Alpha Vantage](https://www.alphavantage.co/)**

---

**Desenvolvido com ❤️ usando Next.js, Cohere AI e Alpha Vantage**
