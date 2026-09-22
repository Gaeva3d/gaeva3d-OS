import { STATUS_TO_DB, PRIORITY_TO_DB, PAYMENT_TO_DB } from "./supabase-mappers.ts";
import {
  STATUS_LABELS,
  PRIORITY_LABELS,
  PAYMENT_LABELS,
  type AuditLog,
  type Order,
} from "./types.ts";

export type DashboardPeriod = "dia" | "mes" | "ano";
export const OPERATION_TIME_ZONE = "America/Sao_Paulo";

export function operationDate(value: string | Date = new Date()): string {
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: OPERATION_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const part = (type: string) => parts.find((entry) => entry.type === type)?.value ?? "";
  return `${part("year")}-${part("month")}-${part("day")}`;
}

export function dashboardRange(period: DashboardPeriod, anchor: string) {
  const date = new Date(`${anchor}T12:00:00Z`);
  if (Number.isNaN(date.getTime())) return dashboardRange(period, operationDate());
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth();
  const day = date.getUTCDate();
  const start =
    period === "ano"
      ? new Date(Date.UTC(year, 0, 1))
      : period === "mes"
        ? new Date(Date.UTC(year, month, 1))
        : new Date(Date.UTC(year, month, day));
  const end =
    period === "ano"
      ? new Date(Date.UTC(year + 1, 0, 1))
      : period === "mes"
        ? new Date(Date.UTC(year, month + 1, 1))
        : new Date(Date.UTC(year, month, day + 1));
  return { start: start.toISOString().slice(0, 10), end: end.toISOString().slice(0, 10) };
}

export function inDateRange(value: string, start?: string, end?: string) {
  const date = operationDate(value);
  return Boolean(date) && (!start || date >= start) && (!end || date < end);
}

export function rangeLastDay(end?: string) {
  if (!end) return undefined;
  const date = new Date(`${end}T12:00:00Z`);
  if (Number.isNaN(date.getTime())) return undefined;
  date.setUTCDate(date.getUTCDate() - 1);
  return date.toISOString().slice(0, 10);
}

export function formatActivityTime(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "Data indisponível"
    : date.toLocaleString("pt-BR", {
        timeZone: OPERATION_TIME_ZONE,
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
}

function auditRecord(value: string | null): Record<string, unknown> {
  if (!value) return {};
  try {
    const parsed: unknown = JSON.parse(value);
    return parsed && typeof parsed === "object" && !Array.isArray(parsed)
      ? (parsed as Record<string, unknown>)
      : {};
  } catch {
    return {};
  }
}

const ENTITY_LABELS: Record<string, string> = {
  orders: "o pedido",
  customers: "o cliente",
  order_items: "o item",
  order_files: "o arquivo",
  order_assignments: "a atribuição",
  approvals: "a aprovação",
  printers: "a impressora",
  team_members: "o integrante",
  production_jobs: "o trabalho de produção",
  production_events: "o apontamento",
  profiles: "o perfil",
};

const FIELD_LABELS: Record<string, string> = {
  status: "status",
  priority: "prioridade",
  promised_at: "prazo",
  event_date: "data do evento",
  assigned_to: "responsável",
  initial_printer_id: "impressora",
  project_name: "nome",
  category: "categoria",
  total_value: "valor",
  deposit_value: "entrada",
  payment_status: "pagamento",
  briefing_description: "descrição",
  mandatory_requirements: "referências",
  commercial_notes: "observações comerciais",
  internal_notes: "observações internas",
  block_reason: "motivo do bloqueio",
  urgency_reason: "motivo da urgência",
  quantity: "quantidade",
  dimensions: "dimensões",
  finishing: "acabamento",
  name: "nome",
  phone: "telefone",
  email: "e-mail",
  notes: "observações",
  role: "permissão",
  access_role: "permissão",
  is_active: "ativação",
};

const STATUS_TEXT = Object.fromEntries(
  Object.entries(STATUS_TO_DB).map(([key, value]) => [
    value,
    STATUS_LABELS[key as keyof typeof STATUS_LABELS],
  ]),
);
const PRIORITY_TEXT = Object.fromEntries(
  Object.entries(PRIORITY_TO_DB).map(([key, value]) => [
    value,
    PRIORITY_LABELS[key as keyof typeof PRIORITY_LABELS],
  ]),
);
const PAYMENT_TEXT = Object.fromEntries(
  Object.entries(PAYMENT_TO_DB).map(([key, value]) => [
    value,
    PAYMENT_LABELS[key as keyof typeof PAYMENT_LABELS],
  ]),
);

export function describeActivity(entry: AuditLog, orders: Pick<Order, "id" | "code">[]) {
  const before = auditRecord(entry.old_value);
  const after = auditRecord(entry.new_value);
  const row = Object.keys(after).length ? after : before;
  const rawOrderId = entry.entity === "orders" ? entry.entity_id : row["order_id"];
  const order = orders.find((item) => item.id === rawOrderId);
  const label = row["code"] ?? row["file_name"] ?? row["name"] ?? row["full_name"];
  const name = typeof label === "string" && label.trim() ? label.trim() : "";
  const subject = `${ENTITY_LABELS[entry.entity] ?? "o registro"}${name ? ` ${name}` : ""}`;
  const suffix = entry.entity !== "orders" && order ? ` do pedido ${order.code}` : "";
  const action = entry.field.toUpperCase();
  let text: string;
  if (action === "INSERT") text = `cadastrou ${subject}${suffix}`;
  else if (action === "DELETE" || (!before["deleted_at"] && after["deleted_at"]))
    text = `removeu ${subject}${suffix}`;
  else {
    const changed = Object.keys(FIELD_LABELS).filter(
      (field) =>
        Object.hasOwn(after, field) &&
        JSON.stringify(before[field]) !== JSON.stringify(after[field]),
    );
    const field = changed[0];
    const labels =
      field === "status" && entry.entity === "orders"
        ? STATUS_TEXT
        : field === "priority"
          ? PRIORITY_TEXT
          : field === "payment_status"
            ? PAYMENT_TEXT
            : null;
    const from = field && labels ? labels[String(before[field])] : undefined;
    const to = field && labels ? labels[String(after[field])] : undefined;
    text =
      changed.length === 1 && field && to
        ? `atualizou ${subject}${suffix}: ${FIELD_LABELS[field]}${from ? ` de ${from}` : ""} para ${to}`
        : `atualizou ${subject}${suffix}${
            changed.length
              ? ` (${changed
                  .slice(0, 3)
                  .map((key) => FIELD_LABELS[key])
                  .join(", ")}${changed.length > 3 ? " e outros dados" : ""})`
              : ""
          }`;
  }
  return { text, orderId: order?.id ?? null };
}

/** Intervalo imediatamente anterior ao período selecionado, para comparação. */
export function previousDashboardRange(period: DashboardPeriod, anchor: string) {
  const date = new Date(`${anchor}T12:00:00Z`);
  if (Number.isNaN(date.getTime())) return previousDashboardRange(period, operationDate());
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth();
  const day = date.getUTCDate();
  const previousAnchor =
    period === "ano"
      ? new Date(Date.UTC(year - 1, 0, 1))
      : period === "mes"
        ? new Date(Date.UTC(year, month - 1, 1))
        : new Date(Date.UTC(year, month, day - 1));
  return dashboardRange(period, previousAnchor.toISOString().slice(0, 10));
}
