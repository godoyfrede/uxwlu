import dotenv from "dotenv";

dotenv.config();

/**
 * Lê uma variável de ambiente obrigatória.
 * Se estiver ausente, a aplicação falha no boot com uma mensagem clara
 * em vez de rodar com um valor padrão inseguro.
 */
function required(name: string): string {
  const value = process.env[name];
  if (!value || value.trim() === "") {
    throw new Error(
      `Variável de ambiente obrigatória ausente: ${name}. ` +
      `Defina-a no arquivo .env (veja .env.example).`
    );
  }
  return value;
}

function optional(name: string, fallback: string): string {
  const value = process.env[name];
  return value && value.trim() !== "" ? value : fallback;
}

export const config = {
  llm: {
    // Segredo — nunca tem valor padrão no código.
    apiKey: required("GEMINI_API_KEY"),
    // Endpoint compatível com a API OpenAI (padrão: inferência interna Magalu).
    baseURL: optional("LLM_BASE_URL", "https://api.inferencia.llm.mglu.io/v1"),
    model: optional("LLM_MODEL", "google-gemma-4-e4b-it"),
    visionModel: optional("LLM_VISION_MODEL", "google-gemma-4-e4b-it"),
    // strict:true no json_schema. Padrão FALSE: o endpoint interno de
    // inferência pode não suportar strict outputs. Ligue (="true") só depois
    // de confirmar suporte — a validação em runtime já protege de qualquer forma.
    strictSchema: optional("LLM_STRICT_SCHEMA", "false") === "true",
    // Embeddings (Fase 4 — RAG). Por padrão usa o mesmo endpoint/chave do LLM.
    // Ajuste LLM_EMBEDDING_MODEL para o nome do modelo de embedding que o
    // endpoint interno expõe. LLM_EMBEDDING_URL só é necessário se for outro host.
    embeddingModel: optional("LLM_EMBEDDING_MODEL", "embeddinggemma"),
    embeddingBaseURL: optional("LLM_EMBEDDING_URL", ""),
  },
  rag: {
    // "full"     = injeta toda a base (comportamento padrão, ideal p/ base pequena).
    // "semantic" = injeta só os top-k chunks recuperados por embedding (Fase 4).
    // Ligue "semantic" DEPOIS de rodar `npm run embeddings`.
    mode: optional("RAG_MODE", "full"),
    topK: Number(optional("RAG_TOP_K", "6")),
  },
  server: {
    port: Number(optional("PORT", "3000")),
    appUrl: optional("APP_URL", ""),
  },
} as const;
