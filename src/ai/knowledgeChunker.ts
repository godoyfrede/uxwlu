/**
 * knowledgeChunker — transforma os arquivos .md da base de conhecimento
 * em blocos ("chunks") com metadados, derivando tudo da estrutura que já
 * existe nos arquivos. Assim os .md continuam sendo a ÚNICA fonte de verdade
 * (você edita só eles) e os chunks ficam prontos para vetorização futura.
 *
 * Função pura: recebe o conteúdo dos arquivos como string e devolve os chunks.
 * Não lê disco — quem lê é o knowledgeProvider.
 */

export type ChunkTipo =
  | "tom"
  | "regra_capitalizacao"
  | "de_para"
  | "inconsistencia"
  | "glossario"
  | "glossario_marca"
  | "situacao"
  | "diretriz";

export interface KnowledgeChunk {
  /** id estável, usado como chave para embeddings/citação. */
  id: string;
  tipo: ChunkTipo;
  titulo: string;
  /** texto integral do bloco — é isto que será embedado na v-RAG. */
  texto: string;
  categoria?: string;
  pilar?: string;
  fonte?: string;
  padrao?: string;
  /** intenção/situação (biblioteca de situações), além da categoria. */
  situacao?: string;
}

function slug(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/** Remove um bloco de frontmatter YAML (--- ... ---) do topo, se houver. */
function stripFrontmatter(md: string): string {
  return md.replace(/^﻿?---\n[\s\S]*?\n---\n/, "");
}

/** Quebra o dataset em seções de nível "## ". */
function splitSections(md: string): Record<string, string> {
  const sections: Record<string, string> = {};
  let cur = "__pre__";
  let buf: string[] = [];
  for (const line of md.split("\n")) {
    const m = line.match(/^##\s+(.+)$/);
    if (m) {
      sections[cur] = buf.join("\n");
      cur = m[1].trim();
      buf = [];
    } else {
      buf.push(line);
    }
  }
  sections[cur] = buf.join("\n");
  return sections;
}

const TERM_RE = /^([A-Za-zÀ-ÿ][^:\n]{1,60}):\s/;

export function parseKnowledge(datasetMd: string, glossaryMd: string): KnowledgeChunk[] {
  const chunks: KnowledgeChunk[] = [];
  const dataset = stripFrontmatter(datasetMd);
  const glossary = stripFrontmatter(glossaryMd);
  const sections = splitSections(dataset);
  const findSection = (n: number) =>
    Object.keys(sections).find((k) => new RegExp(`^${n}\\.`).test(k));

  // 1) Tom de voz — os pilares (## 1)
  const toneKey = findSection(1);
  if (toneKey) {
    for (const block of sections[toneKey].split(/\n### /).slice(1)) {
      const head = block.split("\n")[0];
      const name = head.split("·")[0].trim();
      if (!name || /linguagem da Lu/i.test(head)) {
        chunks.push({
          id: "tom-linguagem-lu",
          tipo: "tom",
          pilar: "Digital que impulsiona",
          fonte: "brandbook",
          titulo: head.trim(),
          texto: ("### " + block).trim(),
        });
        continue;
      }
      chunks.push({
        id: "tom-" + slug(name),
        tipo: "tom",
        pilar: name,
        fonte: "brandbook",
        titulo: name,
        texto: ("### " + block).trim(),
      });
    }
  }

  // 2) Regras de capitalização por categoria (## 2)
  const capKey = findSection(2);
  if (capKey) {
    for (const block of sections[capKey].split(/\n### /).slice(1)) {
      const firstLine = block.split("\n")[0];
      const titulo = firstLine.replace(/·.*$/, "").trim();
      const meta = block.match(
        /`([a-z_]+)`\s*·\s*\*\*Padrão:\*\*\s*(.+?)\s*·\s*\*\*Tom:\*\*\s*(.+)/
      );
      if (!meta) continue; // ignora blocos sem a linha de metadados (ex.: tabela-índice)
      const [, categoria, padrao, pilarRaw] = meta;
      const pilar = pilarRaw.replace(/·.*$/, "").trim();
      const fonte = /observado no site/i.test(firstLine) ? "site" : "deck";
      chunks.push({
        id: "regra-" + categoria.replace(/_/g, "-"),
        tipo: "regra_capitalizacao",
        categoria,
        pilar,
        fonte,
        padrao: padrao.trim(),
        titulo,
        texto: ("### " + block).trim(),
      });
    }
  }

  // 3) Biblioteca De / Para (## 3)
  const dpKey = findSection(3);
  if (dpKey) {
    chunks.push({
      id: "biblioteca-de-para",
      tipo: "de_para",
      fonte: "misto",
      titulo: "Biblioteca De / Para",
      texto: sections[dpKey].trim(),
    });
  }

  // 4) Inconsistências reais observadas no site (## 4)
  const incKey = findSection(4);
  if (incKey) {
    chunks.push({
      id: "inconsistencias-site",
      tipo: "inconsistencia",
      fonte: "site",
      titulo: "Inconsistências reais observadas no site",
      texto: sections[incKey].trim(),
    });
  }

  // 5) Glossário — um chunk por termo, juntando definições multi-linha
  let cur: KnowledgeChunk | null = null;
  let started = false;
  for (const para of glossary.split(/\n\s*\n/)) {
    const t = para.trim();
    if (!t) continue;
    const m = t.match(TERM_RE);
    if (m) {
      started = true;
      cur = {
        id: "glossario-" + slug(m[1].trim()),
        tipo: "glossario",
        categoria: "glossario_financeiro",
        fonte: "glossario",
        titulo: m[1].trim(),
        texto: t,
      };
      chunks.push(cur);
    } else if (started && cur) {
      cur.texto += "\n\n" + t; // continuação (sub-bullets) do termo anterior
    }
  }

  return chunks;
}

function normalize(s: string): string {
  return s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
}

/**
 * Recuperação por palavra-chave (BM25-lite). É o "poor-man's RAG" que já
 * funciona hoje sem embeddings. Na Fase 4, troca-se APENAS a função de score
 * por similaridade de cosseno sobre vetores — a assinatura permanece igual.
 */
export function retrieve(
  chunks: KnowledgeChunk[],
  query: string,
  k = 6
): KnowledgeChunk[] {
  const q = normalize(query);
  const terms = Array.from(
    new Set(q.split(/[^a-z0-9]+/).filter((t) => t.length > 2))
  );
  if (terms.length === 0) return chunks.slice(0, k);

  const scored = chunks
    .map((c) => {
      const titulo = normalize(c.titulo);
      const body = normalize(c.texto);
      const categoria = c.categoria ? normalize(c.categoria) : "";
      const pilar = c.pilar ? normalize(c.pilar) : "";
      let score = 0;
      for (const t of terms) {
        if (titulo.includes(t)) score += 5;
        if (categoria.includes(t)) score += 4;
        if (pilar.includes(t)) score += 2;
        const occ = body.split(t).length - 1;
        score += Math.min(occ, 3);
      }
      return { chunk: c, score };
    })
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, k).map((s) => s.chunk);
}

/** Formata chunks recuperados para injeção no prompt, com cabeçalho de metadados. */
export function formatChunks(chunks: KnowledgeChunk[]): string {
  return chunks
    .map((c) => {
      const meta = [
        `id: ${c.id}`,
        c.categoria ? `categoria: ${c.categoria}` : null,
        c.pilar ? `pilar: ${c.pilar}` : null,
        c.fonte ? `fonte: ${c.fonte}` : null,
      ]
        .filter(Boolean)
        .join(" · ");
      return `--- [${meta}] ---\n${c.texto}`;
    })
    .join("\n\n");
}

// ===========================================================================
// Parsers para os arquivos de tabela (glossário de marca, situações) e para
// as diretrizes (por seção). Ignoram linhas de placeholder (⟨...⟩) e vazias.
// ===========================================================================

function splitRow(line: string): string[] {
  return line.trim().replace(/^\|/, "").replace(/\|\s*$/, "").split("|").map((c) => c.trim());
}

function isPlaceholderRow(cells: string[]): boolean {
  const joined = cells.join("").trim();
  if (!joined) return true;
  if (cells.some((c) => c.includes("⟨"))) return true;
  return false;
}

interface ParsedTable {
  headers: string[];
  rows: string[][];
}

function parseMarkdownTables(md: string): ParsedTable[] {
  const lines = stripFrontmatter(md).split("\n");
  const tables: ParsedTable[] = [];
  let i = 0;
  while (i < lines.length) {
    const isRow = /^\s*\|/.test(lines[i]);
    const nextIsSep =
      i + 1 < lines.length && /^\s*\|?[\s:|-]*-[\s:|-]*\|/.test(lines[i + 1]);
    if (isRow && nextIsSep) {
      const headers = splitRow(lines[i]);
      i += 2;
      const rows: string[][] = [];
      while (i < lines.length && /^\s*\|/.test(lines[i])) {
        rows.push(splitRow(lines[i]));
        i++;
      }
      tables.push({ headers, rows });
    } else {
      i++;
    }
  }
  return tables;
}

/** Glossário de marca: um chunk por termo. */
export function parseGlossarioMarca(md: string): KnowledgeChunk[] {
  const tables = parseMarkdownTables(md);
  const t = tables.find((x) => x.headers.some((h) => /termo/i.test(h))) || tables[0];
  if (!t) return [];
  const chunks: KnowledgeChunk[] = [];
  for (const row of t.rows) {
    if (isPlaceholderRow(row)) continue;
    const [termo, tipo, ok, evite, quando, fonte] = row;
    if (!termo) continue;
    chunks.push({
      id: "gmarca-" + slug(termo),
      tipo: "glossario_marca",
      categoria: tipo || undefined,
      fonte: fonte || undefined,
      titulo: termo,
      texto: `${termo}${tipo ? " (" + tipo + ")" : ""}. Grafia correta: ${ok}. Evite: ${evite}. Quando usar: ${quando}.`,
    });
  }
  return chunks;
}

/** Biblioteca de situações: um chunk por situação/intenção. */
export function parseSituacoes(md: string): KnowledgeChunk[] {
  const tables = parseMarkdownTables(md);
  const t = tables.find((x) => x.headers.some((h) => /situa/i.test(h))) || tables[0];
  if (!t) return [];
  const chunks: KnowledgeChunk[] = [];
  for (const row of t.rows) {
    if (isPlaceholderRow(row)) continue;
    const [situacao, categoria, pilar, variacoes, evite, obs, fonte] = row;
    if (!situacao) continue;
    chunks.push({
      id: "situacao-" + slug(situacao),
      tipo: "situacao",
      situacao,
      categoria: categoria || undefined,
      pilar: pilar || undefined,
      fonte: fonte || undefined,
      titulo: situacao,
      texto: `Situação: ${situacao}${pilar ? " (pilar: " + pilar + ")" : ""}. Use: ${variacoes}. Evite: ${evite}.${obs ? " " + obs : ""}`,
    });
  }
  return chunks;
}

/** Diretrizes de conteúdo: um chunk por seção de nível ##. */
export function parseDiretrizes(md: string): KnowledgeChunk[] {
  const body = stripFrontmatter(md);
  const chunks: KnowledgeChunk[] = [];
  for (const part of body.split(/\n## /).slice(1)) {
    const heading = part.split("\n")[0].trim();
    if (!heading) continue;
    chunks.push({
      id: "diretriz-" + slug(heading),
      tipo: "diretriz",
      fonte: "content_system",
      titulo: heading.replace(/^\d+\.\s*/, ""),
      texto: ("## " + part).trim(),
    });
  }
  return chunks;
}
