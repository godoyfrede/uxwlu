# 🪄 Lu Writer - Copiloto de UX Writing · Magalu

Um assistente inteligente (Full-Stack) construído para apoiar as equipes de Design, Produto e Engenharia do **Magalu** na criação, revisão e padronização de copies e textos de interface, garantindo o uso correto do tom de voz e das regras do *Brandbook*.

---

## 🎯 O que é o projeto?

A **Lu Writer** utiliza um modelo de linguagem (LLM) para atuar como um copiloto especialista nas regras de UX Writing do Magalu. A aplicação permite garantir que a comunicação em todas as jornadas do ecossistema Magalu (app, site, checkout, etc.) seja fluida, humana, inclusiva e normatizada. 

## 🚀 Funcionalidades (Modos)

O projeto é dividido em 4 ferramentas principais:

*   **✍️ Revisar e Validar:** O usuário insere uma copy (e opcionalmente sua categoria e contexto). A IA julga se o texto está *Conforme*, *Ajustar* ou *Não conforme*. A ferramenta aponta problemas, traz as regras como justificativa e sugere uma versão corrigida. Também emite um alerta se for uma **copy crítica** (checkout, pagamentos, erros, jurídico).
*   **✨ Gerar:** Ao informar uma intenção (ex: "Avisar que o produto esgotou"), a ferramenta gera diversas variações de texto, sinaliza a opção mais recomendada e aplica automaticamente o pilar correto do tom de voz Magalu.
*   **📚 Explicar Regras:** Um chat de tira-dúvidas operando no tom didático da Lu. Responde a perguntas sobre o guia de redação sempre apresentando a regra e um modelo prático do que fazer (✅) e do que evitar (❌).
*   **🖼️ Analisar Tela:** Inspeção de Qualidade Visual. O usuário faz o upload (ou cola) o *print* de uma tela. A IA extrai todos os textos estruturalmente (Topo, Corpo, Rodapé), avalia a legibilidade geral e julga cada fragmento de texto encontrado contra o guia de UX Writing.

### 🌟 Destaques de UX/UI
*   **Histórico Inteligente:** Todas as interações da sessão ficam salvas em um painel lateral, que pode ser favoritado (*pin*).
*   **Feedback em Tempo Real:** Animações e progressões detalhadas mostram as etapas de raciocínio da IA durante a leitura de imagens longas.
*   **Auto-Tone:** Detecção automática do melhor tom de voz (Ex: "Para todo mundo", "Sempre em movimento", etc.) baseada no contexto.

---

## 🛠️ Stack Tecnológica

O projeto adota uma arquitetura Full-Stack servida e empacotada de maneira unificada:

**Frontend (Client-side)**
*   [React 18](https://react.dev/)
*   [TypeScript](https://www.typescriptlang.org/)
*   [Tailwind CSS](https://tailwindcss.com/) (Estilização baseada em utilitários)
*   [Lucide React](https://lucide.dev/) (Ícones)
*   [Vite](https://vitejs.dev/) (Build tool)

**Backend (Server-side)**
*   [Node.js](https://nodejs.org/) & [Express](https://expressjs.com/)
*   [OpenAI SDK (`openai`)](https://github.com/openai/openai-node) — cliente compatível com a API OpenAI, apontando para o endpoint de inferência interno do Magalu (`LLM_BASE_URL`)
*   Modelo: `google-gemma-4-e4b-it` (usado tanto para texto quanto para visão/análise de imagem)
*   [ESBuild](https://esbuild.github.io/) (Para empacotar o servidor backend no build de produção)

---

## 📂 Estrutura do Projeto

```text
├── src/                       # Frontend (React) + base de conhecimento
│   ├── components/            # Interface (Layout, os 4 modos, etc.)
│   ├── ai/
│   │   ├── knowledgeChunker.ts   # Fatia a base em chunks com metadados
│   │   └── knowledgeProvider.ts  # Injeção completa | keyword | semântica
│   ├── knowledge_base/       # Fonte de verdade (.md) + índice de embeddings
│   ├── App.tsx
│   └── HistoryContext.tsx
├── server/                    # Backend (Node.js/Express)
│   ├── config.ts             # Configuração central (env, fail-loud)
│   ├── logger.ts             # Log estruturado (JSON)
│   ├── controllers/          # ai · lint · feedback · figma
│   ├── services/             # ai · embeddings · vectorIndex · lint · feedback
│   ├── db/schema.v2.sql      # Persistência (v2, ainda não usada)
│   └── routes/               # /api/*
├── scripts/
│   └── build-embeddings.ts   # Ingestão offline do RAG (npm run embeddings)
├── server.ts                 # Ponto de entrada do Express
└── package.json
```

---

## ⚙️ Instalação e Execução Local

### Pré-requisitos
*   [Node.js](https://nodejs.org/) (Versão 18+ recomendada)
*   Chave de API do Gemini (Google AI Studio)

### Passos

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/godoyfrede/uxwlu.git
   cd uxwlu
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente:**
   Crie um arquivo `.env` na raiz do projeto contendo sua chave do Gemini:
   ```env
   GEMINI_API_KEY=sua_chave_aqui_gerada_no_google_ai_studio
   ```
   *(Nota: Existe um `.env.example` na raiz do projeto como modelo).*

4. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```
   O servidor subirá (geralmente em `http://localhost:3000` ou outra porta definida) inicializando o Vite e o backend simultaneamente.

---

## 🚀 Build e Produção

Para rodar o projeto em um ambiente de produção (ex: Google Cloud Run, Heroku, Render, AWS):

1. **Gere a build de produção:**
   ```bash
   npm run build
   ```
   *Isso irá compilar o React para a pasta `/dist` e gerar o `dist/server.cjs`.*

2. **Inicie o servidor de produção:**
   ```bash
   npm start
   ```

O Express irá subir, servir os arquivos estáticos do frontend e habilitar os *endpoints* da `/api/`.

---

## 🔒 Segurança de Chaves

A aplicação foi estruturada usando o modelo **BFF (Backend For Frontend)**.
Toda a comunicação com a API do Google Gemini acontece **estritamente no servidor** (`/server/controllers`). 
A chave `GEMINI_API_KEY` jamais é enviada ao navegador do cliente, garantindo segurança na exposição das credenciais da aplicação.

---

## 🧠 Base de conhecimento & RAG

A fonte de verdade são os arquivos em `src/knowledge_base/` (`.md`). Você edita
só eles. O `knowledgeChunker.ts` os fatia automaticamente em blocos com
metadados (`categoria`, `pilar`, `fonte`), prontos para recuperação.

Há dois modos de alimentar o contexto do modelo, controlados por `RAG_MODE`:

*   **`full`** (padrão): injeta toda a base no prompt. Simples e ideal enquanto
    a base couber no contexto do modelo.
*   **`semantic`**: injeta só os *top-k* blocos relevantes, recuperados por
    embedding. Recomendado quando a base crescer.

**Ativando o modo semântico:**
```bash
# 1. Defina o modelo de embedding no .env (LLM_EMBEDDING_MODEL)
# 2. Gere o índice vetorial (repita quando a base .md mudar):
npm run embeddings
# 3. No .env: RAG_MODE=semantic
```
Se o índice não existir, a recuperação cai automaticamente no modo por
palavra-chave — nada quebra.

## 🔧 Variáveis de ambiente

Veja `.env.example` para a lista completa. Principais:

| Variável | Padrão | Descrição |
|---|---|---|
| `GEMINI_API_KEY` | — (obrigatória) | Chave da API de inferência. |
| `LLM_BASE_URL` | endpoint interno | Host compatível com a API OpenAI. |
| `LLM_MODEL` / `LLM_VISION_MODEL` | `google-gemma-4-e4b-it` | Modelos de texto e visão. |
| `LLM_EMBEDDING_MODEL` | `embeddinggemma` | Modelo de embedding (ajuste ao endpoint). |
| `LLM_STRICT_SCHEMA` | `false` | Liga `strict` no json_schema (se suportado). |
| `RAG_MODE` | `full` | `full` ou `semantic`. |
| `RAG_TOP_K` | `6` | Nº de blocos recuperados no modo semântico. |

## 🔌 Endpoints da API

| Método | Rota | Descrição |
|---|---|---|
| POST | `/api/review` | Revisar/validar uma copy. |
| POST | `/api/generate` | Gerar variações a partir de uma intenção. |
| POST | `/api/explain` | Explicar uma regra (didático). |
| POST | `/api/analyze` | Analisar o texto de um print de tela. |
| POST | `/api/lint` | Filtro determinístico de grafia (sem LLM). |
| POST | `/api/feedback` | Registra aceito/editado/rejeitado (seam v2). |
| POST | `/api/figma/image` | Baixa um frame do Figma como imagem. |

## 📦 Scripts

| Comando | O que faz |
|---|---|
| `npm run dev` | Sobe Vite + backend em desenvolvimento. |
| `npm run build` | Build de produção (frontend + `dist/server.cjs`). |
| `npm start` | Sobe o servidor de produção. |
| `npm run embeddings` | Gera o índice vetorial do RAG. |
| `npm run lint` | Type-check (`tsc --noEmit`). |

> Histórico completo de mudanças em [`CHANGELOG.md`](./CHANGELOG.md).

## 📝 Licença

Desenvolvido para auxiliar nas rotinas de engenharia, produto e design corporativas. O uso do nome, identidade visual e regras do "Magalu" ou "Lu" nesta interface é estritamente representativo/educacional para o contexto do projeto.
