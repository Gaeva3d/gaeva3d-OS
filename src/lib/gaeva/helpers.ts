import type { DeadlineRisk, Order, OrderStatus, Priority } from "./types";
import { operationDate } from "./dashboard-helpers.ts";

export function uuid(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `id-${Math.random().toString(36).slice(2)}-${Date.now()}`;
}

export function nowISO(): string {
  return new Date().toISOString();
}

export function startOfToday(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

export function daysUntil(dateISO?: string | null): number | null {
  if (!dateISO) return null;
  const target = Date.parse(`${operationDate(dateISO)}T00:00:00Z`);
  const today = Date.parse(`${operationDate()}T00:00:00Z`);
  return Number.isFinite(target) ? Math.round((target - today) / 86_400_000) : null;
}

const CLOSED: OrderStatus[] = ["concluido", "cancelado"];

export function isClosed(order: Order): boolean {
  return CLOSED.includes(order.status);
}

/** Machine assignment is relevant in the printing queue, not during commercial intake/design. */
export function needsPrinter(order: Pick<Order, "status" | "printer_id">): boolean {
  return (
    !order.printer_id &&
    ["aprovado_produzir", "fila_impressao", "imprimindo"].includes(order.status)
  );
}

export function isLate(order: Order): boolean {
  if (isClosed(order)) return false;
  const d = daysUntil(order.due_date);
  return d !== null && d < 0;
}

export function deadlineRisk(order: Order): DeadlineRisk {
  if (isClosed(order)) return "saudavel";
  const d = daysUntil(order.due_date);
  if (d === null) return "saudavel";
  if (d < 0) return "atrasado";
  if (d <= 1) return "risco";
  if (d <= 3) return "atencao";
  return "saudavel";
}

export const RISK_LABELS: Record<DeadlineRisk, string> = {
  saudavel: "Saudável",
  atencao: "Atenção",
  risco: "Risco",
  atrasado: "Atrasado",
};

export function isUrgent(order: Order): boolean {
  return order.priority === "urgente" || order.priority === "critica";
}

export function eventAtRisk(order: Order): boolean {
  const d = daysUntil(order.event_date);
  return d !== null && d >= 0 && d <= 7 && !isClosed(order);
}

const PRIORITY_WEIGHT: Record<Priority, number> = {
  critica: 0,
  urgente: 1,
  alta: 2,
  normal: 3,
};

/** Ordena por atraso, urgência, bloqueio e prazo próximo. */
export function attentionScore(order: Order): number {
  let score = 0;
  if (isLate(order)) score -= 1000;
  score += PRIORITY_WEIGHT[order.priority] * 100;
  if (order.status === "bloqueado") score -= 500;
  score += Math.min(daysUntil(order.due_date) ?? 99, 99);
  return score;
}

export function requiresApproval(status: OrderStatus): boolean {
  return status === "aprovado_produzir" || status === "fila_impressao" || status === "imprimindo";
}

/** Regra: só entra em fila/impressão com aprovação do cliente registrada. */
export function canMoveTo(order: Order, status: OrderStatus): { ok: boolean; reason?: string } {
  if (requiresApproval(status) && !order.approval_registered) {
    return {
      ok: false,
      reason: "É necessário registrar a aprovação do cliente antes de enviar para impressão.",
    };
  }
  return { ok: true };
}

export function formatDate(dateISO?: string | null): string {
  if (!dateISO) return "—";
  return new Date(dateISO).toLocaleDateString("pt-BR", { timeZone: "UTC" });
}

export function formatDateTime(dateISO?: string | null): string {
  if (!dateISO) return "—";
  return new Date(dateISO).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatCurrency(value: number): string {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function maskPhone(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 2) return digits.replace(/(\d{0,2})/, "($1");
  if (digits.length <= 6) return digits.replace(/(\d{2})(\d+)/, "($1) $2");
  if (digits.length <= 10) return digits.replace(/(\d{2})(\d{4})(\d+)/, "($1) $2-$3");
  return digits.replace(/(\d{2})(\d{5})(\d+)/, "($1) $2-$3");
}

export function whatsappLink(phone: string, message?: string): string {
  const digits = phone.replace(/\D/g, "");
  const full = digits.startsWith("55") ? digits : `55${digits}`;
  const text = message ? `?text=${encodeURIComponent(message)}` : "";
  return `https://wa.me/${full}${text}`;
}

export function nextOrderCode(existing: string[]): string {
  const year = new Date().getFullYear();
  const prefix = `GAE-${year}-`;
  const max = existing
    .filter((c) => c.startsWith(prefix))
    .reduce((acc, c) => Math.max(acc, Number(c.slice(prefix.length)) || 0), 0);
  return `${prefix}${String(max + 1).padStart(4, "0")}`;
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export function initials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase() ?? "")
    .join("");
}
