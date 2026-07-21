import { Request, Response } from "express";
import { getFeedbackRepository, type InteractionRecord } from "../services/feedback.service";
import { log } from "../logger";

/**
 * POST /api/feedback  { task, input, output, action?, finalText?, rating?, chunkIds? }
 * SEAM v2: hoje só registra no logger (não persiste). Quando o Postgres
 * entrar, o mesmo endpoint passa a gravar sem mudar o contrato com o frontend.
 */
export async function submitFeedback(req: Request, res: Response) {
  try {
    const { task, input, output, action, finalText, rating, chunkIds } = req.body;
    if (!task) return res.status(400).json({ error: "campo 'task' é obrigatório." });

    const record: InteractionRecord = {
      task,
      input,
      output,
      action,
      finalText,
      rating,
      chunkIds,
      createdAt: new Date().toISOString(),
    };
    await getFeedbackRepository().save(record);
    res.json({ ok: true });
  } catch (err: any) {
    log.error("feedback.error", { message: err?.message });
    res.status(500).json({ error: err.message });
  }
}
