/**
 * feedback.service — SEAM para a v2 (persistência + feedback loop).
 *
 * Hoje NÃO há banco: a implementação padrão só registra no logger, então
 * nada quebra e nada é perdido silenciosamente. Quando a v2 chegar, basta
 * criar uma implementação de FeedbackRepository que grava no Postgres
 * (schema em server/db/schema.v2.sql) e trocá-la em getFeedbackRepository().
 * A assinatura permanece a mesma para os controllers.
 */
import { log } from "../logger";

export type FeedbackAction = "aceito" | "editado" | "rejeitado";

export interface InteractionRecord {
  task: string;                 // review | generate | explain | analyze
  input: unknown;               // o que o usuário pediu
  output: unknown;              // o JSON que o modelo devolveu
  action?: FeedbackAction;      // o que o usuário fez com a resposta
  finalText?: string;           // versão final (se editou)
  rating?: number;              // opcional (ex.: 1–5)
  chunkIds?: string[];          // quais chunks embasaram (para a Fase 4)
  createdAt: string;
}

export interface FeedbackRepository {
  save(record: InteractionRecord): Promise<void>;
}

/** Implementação atual: no-op observável. Não persiste, apenas loga. */
class LoggingFeedbackRepository implements FeedbackRepository {
  async save(record: InteractionRecord): Promise<void> {
    log.info("feedback.captured", {
      task: record.task,
      action: record.action ?? null,
      rating: record.rating ?? null,
      persisted: false, // vira true quando o Postgres entrar na v2
    });
  }
}

let repo: FeedbackRepository | null = null;

export function getFeedbackRepository(): FeedbackRepository {
  // v2: retornar aqui um PostgresFeedbackRepository.
  if (!repo) repo = new LoggingFeedbackRepository();
  return repo;
}
