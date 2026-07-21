import OpenAI from "openai";
import { config } from "../config";
import { log } from "../logger";
import {
  buildSystemInstruction,
  buildGroundedInstructionSemantic,
} from "../../src/ai/knowledgeProvider";

const Type = {
  OBJECT: "object",
  STRING: "string",
  ARRAY: "array",
  BOOLEAN: "boolean"
};

export type Schema = any;

// Modelos vindos da configuração central (env-driven, com padrão seguro).
export const MODEL = config.llm.model;
export const VISION_MODEL = config.llm.visionModel;

let aiClient: OpenAI | null = null;

export function getAIClient(): OpenAI {
  if (!aiClient) {
    // A chave vem exclusivamente de config.llm.apiKey, que já valida
    // a presença da GEMINI_API_KEY no boot. Sem fallback hardcoded.
    aiClient = new OpenAI({
      apiKey: config.llm.apiKey,
      baseURL: config.llm.baseURL
    });
  }
  return aiClient;
}

/**
 * Decide a instrução de sistema conforme RAG_MODE:
 * - "full"     -> undefined (o generate/analyze usa a injeção COMPLETA).
 * - "semantic" -> instrução com apenas os top-k chunks recuperados por embedding.
 * Query vazia ou modo full retornam undefined (mantém injeção completa).
 */
export async function resolveSystemInstruction(query: string): Promise<string | undefined> {
  if (config.rag.mode !== "semantic" || !query || !query.trim()) return undefined;
  return buildGroundedInstructionSemantic(query, config.rag.topK);
}

interface GenerateOpts {
  model?: string;
  task?: string;
  systemInstruction?: string;
}

function responseFormat(schema: Schema) {
  return {
    type: "json_schema" as const,
    json_schema: {
      name: "schema",
      schema,
      strict: config.llm.strictSchema
    }
  };
}

/** Faz o parse do JSON e valida os campos obrigatórios do schema. */
function parseAndValidate(raw: string | null, schema: Schema, task: string) {
  let data: any;
  try {
    data = JSON.parse(raw || "{}");
  } catch {
    log.error("llm.parse_error", { task, raw: (raw || "").slice(0, 300) });
    throw new Error("O modelo não retornou um JSON válido.");
  }
  const required: string[] = Array.isArray(schema?.required) ? schema.required : [];
  const missing = required.filter((k) => data[k] === undefined || data[k] === null);
  if (missing.length > 0) {
    log.warn("llm.schema_incomplete", { task, missing });
    throw new Error(`Resposta do modelo incompleta. Campos ausentes: ${missing.join(", ")}.`);
  }
  return data;
}

export async function generate(prompt: string, schema: Schema, opts: GenerateOpts = {}) {
  const model = opts.model ?? MODEL;
  const task = opts.task ?? "generate";
  const startedAt = Date.now();
  try {
    const ai = getAIClient();
    const systemInstruction = opts.systemInstruction ?? buildSystemInstruction();

    const response = await ai.chat.completions.create({
      model,
      messages: [
        { role: "system", content: systemInstruction },
        { role: "user", content: prompt }
      ],
      response_format: responseFormat(schema),
      temperature: 0.1,
    });

    const data = parseAndValidate(response.choices[0].message.content, schema, task);
    log.info("llm.ok", { task, model, mode: config.rag.mode, latencyMs: Date.now() - startedAt });
    return data;
  } catch (error: any) {
    log.error("llm.error", { task, model, latencyMs: Date.now() - startedAt, message: error?.message });
    throw new Error("Failed to generate content with the LLM.");
  }
}

interface AnalyzeOpts {
  task?: string;
  systemInstruction?: string;
}

export async function analyzeImage(
  prompt: string,
  schema: Schema,
  base64Data: string,
  mimeType: string,
  opts: AnalyzeOpts = {}
) {
  const task = opts.task ?? "analyze";
  const startedAt = Date.now();
  try {
    const ai = getAIClient();
    const systemInstruction = opts.systemInstruction ?? buildSystemInstruction();

    const response = await ai.chat.completions.create({
      model: VISION_MODEL,
      messages: [
        { role: "system", content: systemInstruction },
        { role: "user", content: [
            { type: "text", text: prompt },
            { type: "image_url", image_url: { url: `data:${mimeType};base64,${base64Data}` } }
          ]
        }
      ],
      response_format: responseFormat(schema),
      temperature: 0.1,
    });

    const data = parseAndValidate(response.choices[0].message.content, schema, task);
    log.info("llm.ok", { task, model: VISION_MODEL, mode: config.rag.mode, latencyMs: Date.now() - startedAt });
    return data;
  } catch (error: any) {
    log.error("llm.error", { task, model: VISION_MODEL, latencyMs: Date.now() - startedAt, message: error?.message });
    throw new Error("Failed to analyze image with the LLM.");
  }
}
