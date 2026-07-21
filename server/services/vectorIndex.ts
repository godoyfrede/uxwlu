import fs from "fs";
import path from "path";
import { log } from "../logger";

/**
 * vectorIndex — índice vetorial local, em arquivo JSON, com busca por cosseno
 * em memória. Simples e sem infra; suficiente até alguns milhares de chunks.
 * Quando escalar, troca-se ESTE módulo por pgvector mantendo a assinatura de
 * search() — o resto do código (knowledgeProvider) não muda.
 */

/** Similaridade de cosseno entre dois vetores. Função pura. */
export function cosineSimilarity(a: number[], b: number[]): number {
  const n = Math.min(a.length, b.length);
  let dot = 0;
  let na = 0;
  let nb = 0;
  for (let i = 0; i < n; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  if (na === 0 || nb === 0) return 0;
  return dot / (Math.sqrt(na) * Math.sqrt(nb));
}

export interface IndexEntry {
  id: string;
  tipo: string;
  categoria?: string;
  pilar?: string;
  fonte?: string;
  titulo: string;
  texto: string;
  embedding: number[];
}

export interface ScoredEntry {
  entry: IndexEntry;
  score: number;
}

export const DEFAULT_INDEX_PATH = path.join(
  process.cwd(),
  "src/knowledge_base/kb_index.json"
);

let cache: { path: string; entries: IndexEntry[] } | null = null;

/** Carrega o índice do disco (cacheado). Retorna null se não existir. */
export function loadIndex(file: string = DEFAULT_INDEX_PATH): IndexEntry[] | null {
  if (cache && cache.path === file) return cache.entries;
  try {
    const raw = fs.readFileSync(file, "utf8");
    const entries = JSON.parse(raw) as IndexEntry[];
    cache = { path: file, entries };
    log.info("vectorIndex.loaded", { file, count: entries.length });
    return entries;
  } catch {
    log.warn("vectorIndex.missing", { file });
    return null;
  }
}

export function invalidateIndexCache(): void {
  cache = null;
}

/** Top-k por similaridade de cosseno. Função pura sobre os entries dados. */
export function search(
  entries: IndexEntry[],
  queryVec: number[],
  k = 6
): ScoredEntry[] {
  return entries
    .map((entry) => ({ entry, score: cosineSimilarity(queryVec, entry.embedding) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, k);
}
