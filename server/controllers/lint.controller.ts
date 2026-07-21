import { Request, Response } from "express";
import { lintCopy } from "../services/lint";
import { log } from "../logger";

/**
 * POST /api/lint  { text }
 * Filtro determinístico (sem LLM). Ideal para pré-checar antes de enviar
 * pro modelo, ou para feedback instantâneo enquanto o usuário digita.
 */
export function lintText(req: Request, res: Response) {
  try {
    const { text } = req.body;
    const findings = lintCopy(String(text ?? ""));
    log.info("lint.done", { count: findings.length });
    res.json({ findings });
  } catch (err: any) {
    log.error("lint.error", { message: err?.message });
    res.status(500).json({ error: err.message });
  }
}
