import { Request, Response } from "express";
import { generate, analyzeImage, resolveSystemInstruction, Schema } from "../services/ai.service";

const Type = {
  OBJECT: "object",
  STRING: "string",
  ARRAY: "array",
  BOOLEAN: "boolean"
};

const q = (parts: Array<string | undefined>) => parts.filter(Boolean).join(" · ");

export async function reviewText(req: Request, res: Response) {
  try {
    const { text, category, context, tone } = req.body;
    
    const prompt = `Analise o seguinte texto: "${text}".
Categoria informada: ${category || "Não especificada"}.
Contexto: ${context || "Nenhum"}.
Tom de voz preferido: ${tone || "auto"}.
Instruções:
- Se o texto for legado/corporativo/muito formal, aja como a função "Normalizar": traduza-o para o tom do Magalu (mais humano, acessível, em movimento ou incrível).
- Verifique se a capitalização está correta para a categoria informada ou deduzida.
- Identifique se é uma copy crítica (checkout, pagamento, erro, jurídico).
- Formule problemas encontrados, justificativa baseada na regra, e uma sugestão corrigida.
- Especifique o veredito (Conforme, Ajustar, Não conforme).
- Especifique a fonte exata e a categoria/pilar usados.`;
    
    const schema: Schema = {
      type: Type.OBJECT,
      properties: {
        verdict: { type: Type.STRING, description: "Conforme, Ajustar, ou Não conforme" },
        category: { type: Type.STRING },
        pilar: { type: Type.STRING },
        problems: { type: Type.ARRAY, items: { type: Type.STRING } },
        suggestion: { type: Type.STRING },
        justification: { type: Type.STRING },
        source: { type: Type.STRING, description: "Ex: deck, brandbook, ou site" },
        isCritical: { type: Type.BOOLEAN, description: "Verdadeiro se for checkout, pagamento, erro ou jurídico." }
      },
      required: ["verdict", "category", "pilar", "problems", "suggestion", "justification", "source", "isCritical"]
    };

    const systemInstruction = await resolveSystemInstruction(q([text, category, context]));
    const result = await generate(prompt, schema, { task: "review", systemInstruction });
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

export async function generateText(req: Request, res: Response) {
  try {
    const { intention, category, context, variations, tone } = req.body;
    
    const prompt = `Gere textos de UX Writing para a seguinte intenção: "${intention}".\nCategoria: ${category}.\nContexto: ${context || "Nenhum"}.\nTom de voz preferido: ${tone || "auto"}.\nQuantidade solicitada: ${variations}.\nInstruções:\n- Gere o número exato de variações solicitadas.\n- Aplique o tom de voz Magalu apropriado (Pilar) para o contexto/categoria.\n- Escolha a melhor variação e marque isRecommended como true para ela, fornecendo o motivo.\n- Certifique-se de que a capitalização segue rigorosamente a regra da categoria.\n- Inclua a fonte base usada.`;
    
    const schema: Schema = {
      type: Type.OBJECT,
      properties: {
        variations: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              text: { type: Type.STRING },
              isRecommended: { type: Type.BOOLEAN },
              reason: { type: Type.STRING },
              category: { type: Type.STRING },
              pilar: { type: Type.STRING },
              source: { type: Type.STRING }
            },
            required: ["text", "isRecommended", "reason", "category", "pilar", "source"]
          }
        }
      },
      required: ["variations"]
    };

    const systemInstruction = await resolveSystemInstruction(q([intention, category, context]));
    const result = await generate(prompt, schema, { task: "generate", systemInstruction });
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

export async function explainRule(req: Request, res: Response) {
  try {
    const { question } = req.body;
    
    const prompt = `Responda à seguinte pergunta sobre as regras de UX Writing do Magalu:\nPergunta: "${question}"\nInstruções:\n- Responda de forma didática e curta, como um professor ou guia (tom da Lu).\n- Cite a regra exata e o pilar de tom de voz (se aplicável).\n- Forneça um exemplo correto (✅) e um incorreto (❌).\n- Especifique a fonte exata (deck, brandbook ou site).`;
    
    const schema: Schema = {
      type: Type.OBJECT,
      properties: {
        answer: { type: Type.STRING },
        rule: { type: Type.STRING },
        pilar: { type: Type.STRING },
        exampleGood: { type: Type.STRING },
        exampleBad: { type: Type.STRING },
        source: { type: Type.STRING }
      },
      required: ["answer", "rule", "pilar", "exampleGood", "exampleBad", "source"]
    };

    const systemInstruction = await resolveSystemInstruction(question);
    const result = await generate(prompt, schema, { task: "explain", systemInstruction });
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

export async function analyzeScreen(req: Request, res: Response) {
  try {
    const { image, context } = req.body; 
    
    const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
    const mimeType = image.match(/^data:(image\/\w+);base64,/)?.[1] || "image/png";
    
    const prompt = `Analise o texto contido neste print de tela.\nContexto fornecido pelo usuário (Que tela é esta?): "${context}".\nInstruções:\n- Verifique se a imagem possui baixa legibilidade. Se os textos estiverem ilegíveis ou difíceis de ler, marque readabilityWarning como true.\n- Extraia os textos relevantes da interface mostrada.\n- Para cada texto extraído, classifique a categoria (ex: CTA, Preço, Tag, etc.).\n- Identifique a região aproximada do texto na tela: "Topo", "Corpo" ou "Rodapé".\n- Verifique o status (Conforme, Ajustar, Não conforme) de acordo com as regras de capitalização e tom de voz Magalu.\n- Se não estiver conforme, sugira a correção e aponte a regra/fonte.\n- Se faltar contexto para classificar algo, defina o status como "Ajustar" e sugira a correção.`;
    
    const schema: Schema = {
      type: Type.OBJECT,
      properties: {
        readabilityWarning: { type: Type.BOOLEAN, description: "True se a imagem tiver baixa legibilidade" },
        findings: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              text: { type: Type.STRING },
              region: { type: Type.STRING, description: "Topo, Corpo ou Rodapé" },
              category: { type: Type.STRING },
              status: { type: Type.STRING, description: "Conforme, Ajustar, ou Não conforme" },
              suggestion: { type: Type.STRING },
              ruleSource: { type: Type.STRING }
            },
            required: ["text", "region", "category", "status", "ruleSource"]
          }
        }
      },
      required: ["readabilityWarning", "findings"]
    };

    // Na análise de tela, a query semântica vem do contexto informado (que tela é).
    // Sem contexto, resolveSystemInstruction retorna undefined -> injeção completa,
    // que é o ideal para varrer uma tela inteira com muitas categorias de texto.
    const systemInstruction = await resolveSystemInstruction(context);
    const result = await analyzeImage(prompt, schema, base64Data, mimeType, { task: "analyze", systemInstruction });
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}
