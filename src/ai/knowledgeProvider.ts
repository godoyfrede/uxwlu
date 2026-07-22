import fs from "fs";
import path from "path";
import {
  parseKnowledge,
  parseGlossarioMarca,
  parseSituacoes,
  parseDiretrizes,
  retrieve as retrieveChunks,
  formatChunks,
  type KnowledgeChunk,
} from "./knowledgeChunker";
import { embedQuery } from "../../server/services/embeddings.service";
import { loadIndex, search, type IndexEntry } from "../../server/services/vectorIndex";
import { log } from "../../server/logger";

const KB_DIR = path.join(process.cwd(), "src/knowledge_base");

function readKB(file: string, fallback = ""): string {
  try {
    return fs.readFileSync(path.join(KB_DIR, file), "utf8");
  } catch (err) {
    console.error(`Falha ao carregar ${file}`, err);
    return fallback;
  }
}

export function getSystemPrompt(): string {
  return readKB(
    "lu_writer_system_prompt.md",
    "Você é a Lu Writer, um copiloto de UX Writing interno do e-commerce Magalu."
  );
}

export function getDataset(): string {
  return readKB("magalu_content_writing_dataset.md");
}

export function getGlossary(): string {
  return readKB("magalu_glossario.md");
}

export function getGlossarioMarca(): string {
  return readKB("magalu_glossario_marca.md");
}

export function getSituacoes(): string {
  return readKB("magalu_situacoes.md");
}

export function getDiretrizes(): string {
  return readKB("magalu_diretrizes_conteudo.md");
}

// --- Chunks (RAG-ready) -----------------------------------------------------

let chunkCache: KnowledgeChunk[] | null = null;

/** Base de conhecimento fatiada em blocos com metadados. Cacheado em memória. */
export function getChunks(): KnowledgeChunk[] {
  if (!chunkCache) {
    chunkCache = [
      ...parseKnowledge(getDataset(), getGlossary()),
      ...parseGlossarioMarca(getGlossarioMarca()),
      ...parseSituacoes(getSituacoes()),
      ...parseDiretrizes(getDiretrizes()),
    ];
  }
  return chunkCache;
}

/** Limpa o cache (útil se os .md forem editados em runtime). */
export function invalidateChunkCache(): void {
  chunkCache = null;
}

/** Recupera os k blocos mais relevantes por PALAVRA-CHAVE (sem embeddings). */
export function retrieve(query: string, k = 6): KnowledgeChunk[] {
  return retrieveChunks(getChunks(), query, k);
}

// --- Recuperação semântica (Fase 4 — embeddings) ----------------------------

function entryToChunk(e: IndexEntry): KnowledgeChunk {
  const { embedding, ...rest } = e;
  return rest as KnowledgeChunk;
}

/**
 * Recupera os k blocos mais relevantes por SIMILARIDADE SEMÂNTICA.
 * Requer o índice construído (npm run embeddings). Se o índice não existir
 * ou o embedding falhar, cai graciosamente na recuperação por palavra-chave.
 */
export async function retrieveSemantic(query: string, k = 6): Promise<KnowledgeChunk[]> {
  const entries = loadIndex();
  if (!entries) {
    log.warn("retrieve.fallback_keyword", { reason: "index_missing" });
    return retrieve(query, k);
  }
  try {
    const queryVec = await embedQuery(query);
    return search(entries, queryVec, k).map((h) => entryToChunk(h.entry));
  } catch (err: any) {
    log.warn("retrieve.fallback_keyword", { reason: "embed_error", message: err?.message });
    return retrieve(query, k);
  }
}

// --- Montagem de instruções -------------------------------------------------

const GROUNDING_NOTE =
  "Importante: Responda SEMPRE fundamentado nestes arquivos, NUNCA no seu " +
  "conhecimento geral. Grounding com Google Search está desligado. A precedência " +
  "é: deck/brandbook > site > derivado. Citar sempre a FONTE e aplicar os modos " +
  "descritos no System Prompt.";

/**
 * Injeção COMPLETA (comportamento atual, mantido por compatibilidade).
 * Concatena todo o dataset + glossário no system prompt. Simples e adequado
 * enquanto a base couber no contexto do modelo.
 */
export function buildSystemInstruction(): string {
  const prompt = getSystemPrompt();
  const dataset = getDataset();
  const glossary = getGlossary();
  const glossarioMarca = getGlossarioMarca();
  const diretrizes = getDiretrizes();

  // Nota: a biblioteca de SITUAÇÕES fica fora da injeção completa (é grande e
  // orientada a exemplos) — ela entra pela recuperação semântica (RAG_MODE=semantic).
  return (
    `${prompt}\n\n=== BASE DE CONHECIMENTO ===\n\n${dataset}` +
    `\n\n=== GLOSSÁRIO (financeiro) ===\n\n${glossary}` +
    `\n\n=== GLOSSÁRIO DE MARCA ===\n\n${glossarioMarca}` +
    `\n\n=== DIRETRIZES DE CONTEÚDO ===\n\n${diretrizes}` +
    `\n\n${GROUNDING_NOTE}`
  );
}

/**
 * Injeção RECUPERADA por PALAVRA-CHAVE (opt-in, síncrona, sem embeddings).
 */
export function buildGroundedInstruction(query: string, k = 6): string {
  const prompt = getSystemPrompt();
  const contexto = formatChunks(retrieve(query, k));
  return `${prompt}\n\n=== CONTEXTO RECUPERADO (top ${k}) ===\n\n${contexto}\n\n${GROUNDING_NOTE}`;
}

/**
 * Injeção RECUPERADA por SIMILARIDADE SEMÂNTICA (Fase 4).
 * Este é o caminho recomendado quando a base crescer. Nos controllers,
 * troque buildSystemInstruction() por `await buildGroundedInstructionSemantic(query)`.
 */
export async function buildGroundedInstructionSemantic(query: string, k = 6): Promise<string> {
  const prompt = getSystemPrompt();
  const contexto = formatChunks(await retrieveSemantic(query, k));
  return `${prompt}\n\n=== CONTEXTO RECUPERADO (top ${k}, semântico) ===\n\n${contexto}\n\n${GROUNDING_NOTE}`;
}

export type { KnowledgeChunk };
