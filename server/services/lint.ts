/**
 * lint — filtro determinístico de linguagem, ANTES de chamar o modelo.
 * Cobre três frentes, todas de ALTA PRECISÃO (só sinaliza o inequívoco):
 *   - grafia:      Pix, OFF, MagaluPay, Magalog, atribuição de IA
 *   - inclusiva:   linguagem centrada na pessoa, neutra (Content System)
 *   - antirracista: termos e expressões a evitar (guia vivo do Content System)
 *
 * NÃO inclui casos dependentes de contexto (ex.: "Frete Grátis" vs "Frete grátis",
 * ou a cor "preta"/"branca" de um produto). As regras de cor só disparam em
 * EXPRESSÕES multipalavra, para não confundir com cor de produto.
 */

export type LintCategoria = "grafia" | "inclusiva" | "antirracista";

export interface LintFinding {
  termo: string;
  categoria: LintCategoria;
  problema: string;
  sugestao: string;
  fonte: string;
}

interface Rule {
  pattern: RegExp;
  categoria: LintCategoria;
  problema: string;
  sugestao: string;
  fonte: string;
}

const RULES: Rule[] = [
  // ---------------- grafia ----------------
  { pattern: /\bPIX\b/g, categoria: "grafia",
    problema: "'PIX' em caixa alta.",
    sugestao: "Use 'Pix' (Banco Central), só a inicial maiúscula.", fonte: "deck/glossário" },
  { pattern: /\bno pix\b/g, categoria: "grafia",
    problema: "'pix' em minúscula (INC-01).",
    sugestao: "Use 'no Pix' com inicial maiúscula, inclusive entre parênteses.", fonte: "site (INC-01)" },
  { pattern: /\bMagalu Pay\b/g, categoria: "grafia",
    problema: "'Magalu Pay' separado.",
    sugestao: "A grafia oficial é 'MagaluPay' (junto, camelCase).", fonte: "glossário" },
  { pattern: /\bMAGALOG\b/g, categoria: "grafia",
    problema: "'MAGALOG' em caixa alta.",
    sugestao: "Use 'Magalog' (só a inicial).", fonte: "glossário" },
  { pattern: /(\d+%|R\$\s?\d[\d.,]*)\s+off\b/gi, categoria: "grafia",
    problema: "'off' fora de caixa alta em contexto de desconto.",
    sugestao: "Use 'OFF' em caixa alta (ex.: '10% OFF').", fonte: "deck (tag/cupom)" },
  { pattern: /intelig[êe]ncia artificial/gi, categoria: "grafia",
    problema: "Atribuição genérica a 'inteligência artificial'.",
    sugestao: "Atribua à persona: 'pela Lu' / 'da Lu'.", fonte: "site (conteudo_ia_lu)" },

  // ---------------- inclusiva ----------------
  { pattern: /\bdeficientes?\b/gi, categoria: "inclusiva",
    problema: "'deficiente' como substantivo.",
    sugestao: "Use 'pessoa com deficiência'; para recursos, 'acessível para todos'.", fonte: "diretrizes (inclusão)" },
  { pattern: /portador(?:es|as)?\s+de\s+necessidades\s+especiais/gi, categoria: "inclusiva",
    problema: "'portador de necessidades especiais'.",
    sugestao: "Use 'pessoa com deficiência' / 'recursos de acessibilidade para todos'.", fonte: "diretrizes (inclusão)" },
  { pattern: /\b(?:seja\s+)?bem-vind[oa]s?\b/gi, categoria: "inclusiva",
    problema: "'Bem-vindo' (masculino genérico).",
    sugestao: "Use 'Boas-vindas' (ex.: 'Boas-vindas ao Magalu!').", fonte: "diretrizes (neutra)" },
  { pattern: /\bprezad[oa]s?\b/gi, categoria: "inclusiva",
    problema: "'Prezado' — tratamento formal e generificado.",
    sugestao: "Prefira 'Olá! Tudo bem?'.", fonte: "diretrizes (neutra)" },
  { pattern: /\bcaro\s+(?:cliente|comprador|usuário|vendedor)\b/gi, categoria: "inclusiva",
    problema: "'Caro [cliente/comprador]' — formal e generificado.",
    sugestao: "Fale direto: 'Olá!' / use o nome quando houver.", fonte: "diretrizes (neutra)" },

  // ---------------- antirracista ----------------
  { pattern: /\bdenegrir\b/gi, categoria: "antirracista",
    problema: "'denegrir' associa difamar a 'tornar negro'.",
    sugestao: "Use 'falar mal', 'difamar', 'manchar a reputação'.", fonte: "diretrizes (antirracista)" },
  { pattern: /a\s+coisa\s+t[áa]\s+preta/gi, categoria: "antirracista",
    problema: "Associa situação difícil à cor preta.",
    sugestao: "Use 'a situação está difícil', 'a coisa complicou'.", fonte: "diretrizes (antirracista)" },
  { pattern: /\blista\s+negra\b/gi, categoria: "antirracista",
    problema: "'lista negra' usa 'preto' como proibido/punitivo.",
    sugestao: "Use 'lista de bloqueados' / 'lista de restrições'.", fonte: "diretrizes (antirracista)" },
  { pattern: /\bmercado\s+negro\b/gi, categoria: "antirracista",
    problema: "'mercado negro' associa 'negro' a ilegal.",
    sugestao: "Use 'mercado clandestino' / 'mercado ilegal'.", fonte: "diretrizes (antirracista)" },
  { pattern: /\binveja\s+branca\b/gi, categoria: "antirracista",
    problema: "'inveja branca' reforça a dicotomia branco=bom / preto=ruim.",
    sugestao: "Use 'admiração' / 'que invejinha boa'.", fonte: "diretrizes (antirracista)" },
  { pattern: /\bmulat[oa]s?\b/gi, categoria: "antirracista",
    problema: "'mulato(a)' tem origem pejorativa ('mula').",
    sugestao: "Use 'pessoa negra' / 'pessoa parda'.", fonte: "diretrizes (antirracista)" },
  { pattern: /cor\s+do\s+pecado/gi, categoria: "antirracista",
    problema: "'cor do pecado' hipersexualiza a mulher negra.",
    sugestao: "Evite adjetivar o tom de pele; use 'pessoa negra' se necessário.", fonte: "diretrizes (antirracista)" },
  { pattern: /servi[çc]o\s+de\s+preto/gi, categoria: "antirracista",
    problema: "'serviço de preto' associa pessoas negras a trabalho malfeito.",
    sugestao: "Use 'trabalho malfeito' / 'serviço de má qualidade'.", fonte: "diretrizes (antirracista)" },
  { pattern: /samba\s+do\s+crioulo\s+doido/gi, categoria: "antirracista",
    problema: "'crioulo' é pejorativo; a expressão usa a ofensa.",
    sugestao: "Use 'confusão', 'bagunça', 'que doideira'.", fonte: "diretrizes (antirracista)" },
  { pattern: /\bmeia[-\s]tigela\b/gi, categoria: "antirracista",
    problema: "'meia-tigela' remete à fome imposta a pessoas escravizadas.",
    sugestao: "Use 'medíocre', 'de baixa qualidade', 'mediano'.", fonte: "diretrizes (antirracista)" },
  { pattern: /\bjudia(?:r|ria)\b/gi, categoria: "antirracista",
    problema: "'judiar/judiaria' é expressão antissemita.",
    sugestao: "Use 'maltratar', 'atormentar', 'que maldade'.", fonte: "diretrizes (antirracista)" },
  { pattern: /magia\s+branca/gi, categoria: "antirracista",
    problema: "'magia branca' (em contexto de funcionalidade) reforça branco=bom.",
    sugestao: "Reavalie o uso fora de nome próprio/produto.", fonte: "diretrizes (antirracista)" },
];

export function lintCopy(text: string): LintFinding[] {
  if (!text) return [];
  const findings: LintFinding[] = [];
  const seen = new Set<string>();
  for (const rule of RULES) {
    const matches = text.match(rule.pattern);
    if (!matches) continue;
    for (const m of matches) {
      const key = `${rule.problema}::${m.toLowerCase()}`;
      if (seen.has(key)) continue;
      seen.add(key);
      findings.push({
        termo: m,
        categoria: rule.categoria,
        problema: rule.problema,
        sugestao: rule.sugestao,
        fonte: rule.fonte,
      });
    }
  }
  return findings;
}
