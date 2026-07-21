/**
 * build-embeddings — INGESTÃO OFFLINE do RAG.
 * Roda quando a base de conhecimento (.md) muda. Fatia a base em chunks,
 * gera os embeddings pelo endpoint configurado e grava o índice em
 * src/knowledge_base/kb_index.json.
 *
 *   npm run embeddings
 *
 * Rode este comando no build/deploy (antes de subir a aplicação) para que a
 * recuperação semântica funcione em produção. Sem o índice, a app cai
 * automaticamente na recuperação por palavra-chave (nada quebra).
 */
import fs from "fs";
import { getChunks } from "../src/ai/knowledgeProvider";
import { embedTexts, embeddingsConfigSummary } from "../server/services/embeddings.service";
import { DEFAULT_INDEX_PATH, type IndexEntry } from "../server/services/vectorIndex";

async function main() {
  const cfg = embeddingsConfigSummary();
  console.log(`[embeddings] modelo=${cfg.model} baseURL=${cfg.baseURL}`);

  const chunks = getChunks();
  console.log(`[embeddings] ${chunks.length} chunks a embedar...`);

  const vectors = await embedTexts(chunks.map((c) => c.texto));

  const entries: IndexEntry[] = chunks.map((c, i) => ({
    id: c.id,
    tipo: c.tipo,
    categoria: c.categoria,
    pilar: c.pilar,
    fonte: c.fonte,
    titulo: c.titulo,
    texto: c.texto,
    embedding: vectors[i],
  }));

  fs.writeFileSync(DEFAULT_INDEX_PATH, JSON.stringify(entries));
  const dim = vectors[0]?.length ?? 0;
  console.log(`[embeddings] índice gravado: ${DEFAULT_INDEX_PATH}`);
  console.log(`[embeddings] ${entries.length} vetores · dimensão ${dim}`);
}

main().catch((err) => {
  console.error("[embeddings] falhou:", err?.message ?? err);
  process.exit(1);
});
