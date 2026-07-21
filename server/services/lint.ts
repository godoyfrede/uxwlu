/**
 * lint — filtro determinístico de grafia, ANTES de chamar o modelo.
 * É o "filtro de linguagem" citado na Documentação (seção 6): pega os erros
 * óbvios e recorrentes (Pix, OFF, MagaluPay, Magalog, atribuição de IA) sem
 * gastar uma chamada de LLM. Regras de ALTA PRECISÃO — só sinaliza o que é
 * inequívoco na base (exceções e inconsistências reais do dataset).
 *
 * NÃO inclui casos dependentes de contexto (ex.: "Frete Grátis" vs
 * "Frete grátis"), que precisam do julgamento do modelo.
 */

export interface LintFinding {
  termo: string;
  problema: string;
  sugestao: string;
  fonte: string;
}

interface Rule {
  pattern: RegExp;
  problema: string;
  sugestao: string;
  fonte: string;
}

const RULES: Rule[] = [
  {
    pattern: /\bPIX\b/g,
    problema: "'PIX' em caixa alta.",
    sugestao: "Use 'Pix' (grafia do Banco Central), só a inicial maiúscula.",
    fonte: "deck/glossário",
  },
  {
    pattern: /\bno pix\b/g,
    problema: "'pix' em minúscula (inconsistência real INC-01).",
    sugestao: "Use 'no Pix' com inicial maiúscula, inclusive entre parênteses.",
    fonte: "site (INC-01)",
  },
  {
    pattern: /\bMagalu Pay\b/g,
    problema: "'Magalu Pay' separado.",
    sugestao: "A grafia oficial é 'MagaluPay' (junto, camelCase).",
    fonte: "glossário",
  },
  {
    pattern: /\bMAGALOG\b/g,
    problema: "'MAGALOG' em caixa alta.",
    sugestao: "Use a grafia oficial 'Magalog' (só a inicial).",
    fonte: "glossário",
  },
  {
    pattern: /(\d+%|R\$\s?\d[\d.,]*)\s+off\b/gi,
    problema: "'off' fora de caixa alta em contexto de desconto.",
    sugestao: "Use 'OFF' em caixa alta (ex.: '10% OFF', 'Cupom R$ 30 OFF').",
    fonte: "deck (tag/cupom)",
  },
  {
    pattern: /intelig[êe]ncia artificial/gi,
    problema: "Atribuição genérica a 'inteligência artificial'.",
    sugestao: "Atribua à persona: 'pela Lu' / 'da Lu'.",
    fonte: "site (conteudo_ia_lu)",
  },
];

export function lintCopy(text: string): LintFinding[] {
  if (!text) return [];
  const findings: LintFinding[] = [];
  const seen = new Set<string>();
  for (const rule of RULES) {
    const matches = text.match(rule.pattern);
    if (!matches) continue;
    for (const m of matches) {
      const key = `${rule.problema}::${m}`;
      if (seen.has(key)) continue;
      seen.add(key);
      findings.push({
        termo: m,
        problema: rule.problema,
        sugestao: rule.sugestao,
        fonte: rule.fonte,
      });
    }
  }
  return findings;
}
