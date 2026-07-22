# Changelog — Lu Writer

Evolução incremental do copiloto de UX Writing. Cada fase foi aplicada sobre
a base existente, sem reescrever o que já funcionava.

## [1.2.0] — 2026-07-22

Reforço da base de conhecimento e do filtro de linguagem.

### Base de conhecimento
- Novos arquivos em `src/knowledge_base/`:
  - `magalu_glossario_marca.md` — grafia oficial de termos, marcas, selos, pagamentos e léxico (42 termos).
  - `magalu_situacoes.md` — biblioteca de copy por intenção/situação (46 casos).
  - `magalu_diretrizes_conteudo.md` — acessibilidade, inclusão, linguagem simples, antirracista e neutra (Content System, transcrição oficial).
- `knowledgeChunker.ts` ganhou parsers para tabelas (glossário de marca, situações) e por seção (diretrizes), ignorando linhas de placeholder. Novo campo de metadado `situação`. Total: **138 chunks** (antes 44).
- A injeção completa (`RAG_MODE=full`) passou a incluir o glossário de marca e as diretrizes (~16k tokens). A biblioteca de situações fica **fora** da injeção completa — entra pela recuperação semântica.
- Planilha `docs/magalu_base_conhecimento_template.xlsx` para o time popular novos casos.

### Filtro de linguagem (lint)
- `lint.ts` expandido de 6 para ~26 regras, agora em 3 categorias: `grafia`,
  `inclusiva` e `antirracista` — cada achado traz a alternativa sugerida e a fonte.
- Regras de cor disparam só em EXPRESSÕES (ex.: "lista negra"), nunca em cor de
  produto ("camiseta preta").

---

## [1.1.0] — 2026-07-21

Modernização em 4 fases + fiação da recuperação semântica.

### Fase 1 — Segurança & limpeza
- **Removida a API key hardcoded** que existia como fallback em `ai.service.ts`
  (e também em arquivos de scratch). A chave agora vem exclusivamente de
  `GEMINI_API_KEY`, validada no boot por `server/config.ts` — a app falha com
  mensagem clara se faltar, em vez de rodar com um valor inseguro.
- Novo `server/config.ts`: configuração central (chave, endpoint, modelos)
  lida do ambiente, com padrões seguros.
- `.env.example` documentado; `README.md` alinhado ao stack real
  (SDK `openai` contra o endpoint interno + `google-gemma-4-e4b-it`).
- Removidos arquivos de scratch não usados pelo app.

> ⚠️ **Ação necessária:** a chave que estava versionada deve ser considerada
> comprometida — **rotacione-a** no painel do Magalu.

### Fase 3 — Base pré-formatada para RAG
- Novo `src/ai/knowledgeChunker.ts`: fatia a base de conhecimento em blocos
  ("chunks") com metadados (`id`, `tipo`, `categoria`, `pilar`, `fonte`),
  derivando tudo da estrutura que já existe nos `.md`. **Fonte de verdade
  única:** você continua editando só os `.md`.
- `knowledgeProvider.ts` ganhou `getChunks()`, `retrieve(query, k)`
  (recuperação por palavra-chave) e `buildGroundedInstruction()`.
- 44 chunks: 18 regras de capitalização, 5 de tom de voz, 19 termos de
  glossário, biblioteca De/Para e inconsistências.

### Fase 5 — Robustez
- Novo `server/logger.ts`: log estruturado (JSON por evento) no lugar de
  `console.log` solto.
- `ai.service.ts` passou a **validar a saída** do modelo em runtime (JSON
  válido + campos obrigatórios), independente de o endpoint suportar
  `strict` outputs. Toggle `LLM_STRICT_SCHEMA` (padrão `false`).
- Novo `server/services/lint.ts` + `POST /api/lint`: filtro determinístico de
  grafia (Pix, OFF, MagaluPay, Magalog, atribuição de IA) **sem chamar o LLM**.
- Seams da v2 (persistência/feedback) prontas: `feedback.service.ts` (no-op
  que loga), `POST /api/feedback` e `server/db/schema.v2.sql`.

### Fase 4 — RAG real (embeddings + índice vetorial)
- Novo `server/services/embeddings.service.ts`: gera embeddings via cliente
  compatível com OpenAI (mesmo endpoint/chave do LLM por padrão).
- Novo `server/services/vectorIndex.ts`: índice local em arquivo com busca por
  similaridade de cosseno em memória. Troca-se por pgvector no futuro sem
  mexer no resto.
- Novo `scripts/build-embeddings.ts` (`npm run embeddings`): ingestão offline
  que embeda os chunks e grava `src/knowledge_base/kb_index.json`.
- `knowledgeProvider.ts`: `retrieveSemantic()` e
  `buildGroundedInstructionSemantic()`, com **fallback automático** para a
  recuperação por palavra-chave se o índice não existir ou o embedding falhar.

### Fiação da recuperação semântica
- `ai.service.ts`: `generate()`/`analyzeImage()` aceitam um `systemInstruction`
  de fora; novo `resolveSystemInstruction(query)`.
- Os 4 modos (`review`, `generate`, `explain`, `analyze`) montam uma query do
  input do usuário e escolhem a instrução conforme **`RAG_MODE`**.
- `RAG_MODE=full` (padrão) preserva exatamente o comportamento anterior
  (injeção completa). `RAG_MODE=semantic` injeta só os top-k recuperados.

---

## Como ativar o RAG semântico

1. Defina `LLM_EMBEDDING_MODEL` no `.env` com o nome real do modelo de
   embedding exposto pelo endpoint.
2. Rode `npm run embeddings` para gerar o índice (repita quando os `.md`
   mudarem; inclua no build/deploy).
3. Defina `RAG_MODE=semantic` no `.env`.

Sem esses passos, a aplicação roda em `full` como antes. Mesmo em `semantic`
sem índice, o fallback por palavra-chave garante que nada quebre.

## Notas de migração
- Rode `npm install` (nova dependência de runtime `openai`; `tsx` para o script
  de embeddings).
- Crie o `.env` a partir do `.env.example`.
- **Rotacione a `GEMINI_API_KEY`** exposta anteriormente.
