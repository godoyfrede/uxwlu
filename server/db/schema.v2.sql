-- ==========================================================================
-- Lu Writer — schema de persistência (v2)  [NÃO usado ainda]
-- Postgres. Roda quando o feedback loop for ligado. Já preparado para RAG
-- (Fase 4) com pgvector no MESMO banco.
-- ==========================================================================

-- 1) Interações + feedback (captura aceito/editado/rejeitado)
CREATE TABLE IF NOT EXISTS interactions (
  id           BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  task         TEXT NOT NULL,                    -- review | generate | explain | analyze
  input        JSONB NOT NULL,                   -- pedido do usuário
  output       JSONB NOT NULL,                   -- resposta do modelo
  action       TEXT CHECK (action IN ('aceito','editado','rejeitado')),
  final_text   TEXT,                             -- versão final (se editada) -> vira "microcopy aprovada"
  rating       SMALLINT,
  chunk_ids    TEXT[]                            -- quais chunks embasaram a resposta
);
CREATE INDEX IF NOT EXISTS idx_interactions_task   ON interactions (task);
CREATE INDEX IF NOT EXISTS idx_interactions_action ON interactions (action);

-- 2) RAG vetorial (Fase 4) — requer a extensão pgvector
-- CREATE EXTENSION IF NOT EXISTS vector;
-- CREATE TABLE IF NOT EXISTS kb_chunks (
--   id         TEXT PRIMARY KEY,                 -- mesmo id do knowledgeChunker
--   tipo       TEXT NOT NULL,
--   categoria  TEXT,
--   pilar      TEXT,
--   fonte      TEXT,
--   titulo     TEXT NOT NULL,
--   texto      TEXT NOT NULL,
--   embedding  vector(768)                       -- dimensão do modelo de embedding escolhido
-- );
-- CREATE INDEX IF NOT EXISTS idx_kb_chunks_embedding
--   ON kb_chunks USING hnsw (embedding vector_cosine_ops);
