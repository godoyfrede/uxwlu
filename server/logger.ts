/**
 * Logger estruturado — emite uma linha JSON por evento, no lugar de
 * console.log solto. Fácil de coletar em produção (Cloud Run / Datadog).
 * É o embrião da observabilidade citada na Documentação (seção 6).
 */

type Level = "info" | "warn" | "error";

function emit(level: Level, event: string, data: Record<string, unknown> = {}) {
  const line = JSON.stringify({
    ts: new Date().toISOString(),
    level,
    event,
    ...data,
  });
  if (level === "error") console.error(line);
  else console.log(line);
}

export const log = {
  info: (event: string, data?: Record<string, unknown>) => emit("info", event, data),
  warn: (event: string, data?: Record<string, unknown>) => emit("warn", event, data),
  error: (event: string, data?: Record<string, unknown>) => emit("error", event, data),
};
