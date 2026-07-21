import OpenAI from "openai";
import { config } from "../config";
import { log } from "../logger";

/**
 * embeddings.service — gera vetores de embedding via cliente compatível com
 * a API OpenAI, apontando por padrão para o mesmo endpoint/chave do LLM
 * (endpoint interno Magalu). Usado tanto no build offline do índice quanto
 * na hora da consulta.
 */

let embClient: OpenAI | null = null;

function getEmbeddingClient(): OpenAI {
  if (!embClient) {
    embClient = new OpenAI({
      apiKey: config.llm.apiKey,
      baseURL: config.llm.embeddingBaseURL || config.llm.baseURL,
    });
  }
  return embClient;
}

/** Embeda uma lista de textos (em lotes). Preserva a ordem de entrada. */
export async function embedTexts(texts: string[]): Promise<number[][]> {
  const client = getEmbeddingClient();
  const out: number[][] = new Array(texts.length);
  const BATCH = 64;
  for (let i = 0; i < texts.length; i += BATCH) {
    const batch = texts.slice(i, i + BATCH);
    const res = await client.embeddings.create({
      model: config.llm.embeddingModel,
      input: batch,
    });
    for (const d of res.data) {
      out[i + d.index] = d.embedding as number[];
    }
  }
  return out;
}

/** Embeda uma única consulta. */
export async function embedQuery(text: string): Promise<number[]> {
  const [vec] = await embedTexts([text]);
  return vec;
}

export function embeddingsConfigSummary() {
  const summary = {
    model: config.llm.embeddingModel,
    baseURL: config.llm.embeddingBaseURL || config.llm.baseURL,
  };
  log.info("embeddings.config", summary);
  return summary;
}
