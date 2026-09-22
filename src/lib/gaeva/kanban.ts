import type { Tables } from "../../integrations/supabase/types";
import type { OrderStatus, Role } from "./types";
import { operationDate } from "./dashboard-helpers.ts";
import { STATUS_TO_DB } from "./supabase-mappers.ts";

export const STAGES = [
  { id: "new", label: "Novos pedidos", status: "recebido", next: "Assumir pedido" },
  {
    id: "confirmation",
    label: "Confirmação",
    status: "briefing_pendente",
    next: "Confirmar informações",
  },
  { id: "design", label: "Designer 3D", status: "em_modelagem", next: "Enviar para aprovação" },
  {
    id: "approval",
    label: "Aprovação",
    status: "aguardando_aprovacao",
    next: "Registrar retorno do cliente",
  },
  { id: "printing", label: "Impressão", status: "fila_impressao", next: "Concluir impressão" },
  { id: "ready", label: "Pedido pronto", status: "acabamento", next: "Conferir e embalar" },
  { id: "shipping", label: "Postagem", status: "expedicao", next: "Registrar postagem" },
  { id: "completed", label: "Finalizados", status: "concluido", next: "Consultar histórico" },
] as const;
export type Stage = (typeof STAGES)[number]["id"];
export type OperationalOrder = Pick<
  Tables<"order_operational_summary">,
  | "id"
  | "code"
  | "customer_id"
  | "category"
  | "project_name"
  | "quantity"
  | "status"
  | "priority"
  | "promised_at"
  | "event_date"
  | "total_value"
  | "payment_status"
  | "assigned_to"
  | "initial_printer_id"
  | "created_by"
  | "created_at"
  | "updated_at"
  | "deleted_at"
  | "block_reason"
  | "briefing_complete"
  | "urgency_reason"
  | "shipped_at"
  | "tracking_code"
  | "customer_name"
  | "customer_phone"
  | "city"
  | "state"
  | "seller_name"
  | "owner_name"
  | "designer_id"
  | "designer_name"
  | "stage"
  | "stage_entered_at"
  | "revision_count"
  | "approval_version"
  | "approval_status"
  | "approval_sent_at"
  | "job_status"
  | "print_failure_reason"
  | "modeling_started_at"
  | "thumbnail_path"
  | "thumbnail_bucket"
>;
export type QuickFilter = "all" | "mine" | "late" | "today" | "urgent";
export interface BoardFilters {
  query: string;
  quick: QuickFilter;
  owner: string;
  designer: string;
  seller: string;
  product: string;
  priority: string;
  stage: string;
  deadline: string;
  from: string;
  to: string;
}
export const EMPTY_FILTERS: BoardFilters = {
  query: "",
  quick: "all",
  owner: "",
  designer: "",
  seller: "",
  product: "",
  priority: "",
  stage: "",
  deadline: "",
  from: "",
  to: "",
};
export const STATUS_STAGE: Record<string, Stage | null> = {
  received: "new",
  briefing_pending: "confirmation",
  modeling: "design",
  internal_review: "design",
  awaiting_customer_approval: "approval",
  approved_for_production: "printing",
  print_queue: "printing",
  printing: "printing",
  finishing: "ready",
  quality_control: "ready",
  packaging: "ready",
  shipping: "shipping",
  completed: "completed",
  blocked: null,
  cancelled: null,
};
export function stageForStatus(status: OrderStatus) {
  return STATUS_STAGE[STATUS_TO_DB[status]] ?? null;
}
export function daysToDeadline(order: Pick<OperationalOrder, "promised_at">, now = new Date()) {
  return Math.round(
    (Date.parse(`${order.promised_at}T00:00:00Z`) - Date.parse(`${operationDate(now)}T00:00:00Z`)) /
      86400000,
  );
}
export function isOverdue(order: OperationalOrder, now = new Date()) {
  return !["completed", "cancelled"].includes(order.status) && daysToDeadline(order, now) < 0;
}
export function elapsed(since: string | null, now = new Date()) {
  if (!since) return "Não registrado";
  const minutes = Math.max(0, Math.floor((now.getTime() - Date.parse(since)) / 60000));
  if (!Number.isFinite(minutes)) return "Não registrado";
  if (minutes < 60) return `${minutes} min`;
  if (minutes < 1440) return `${Math.floor(minutes / 60)}h`;
  const days = Math.floor(minutes / 1440);
  return `${days} ${days === 1 ? "dia" : "dias"}`;
}
export function exceedsStageSla(
  order: OperationalOrder,
  limits: Partial<Record<Stage, number>>,
  now = new Date(),
) {
  const hours = limits[order.stage as Stage];
  return hours != null && now.getTime() - Date.parse(order.stage_entered_at) > hours * 3600000;
}
export function compareOperationalOrders(
  a: OperationalOrder,
  b: OperationalOrder,
  now = new Date(),
) {
  const urgent = (o: OperationalOrder) => ["urgent", "critical"].includes(o.priority);
  return (
    Number(isOverdue(b, now)) - Number(isOverdue(a, now)) ||
    Number(urgent(b)) - Number(urgent(a)) ||
    Number(daysToDeadline(b, now) <= 3) - Number(daysToDeadline(a, now) <= 3) ||
    Number(b.priority === "high") - Number(a.priority === "high") ||
    Date.parse(a.stage_entered_at) - Date.parse(b.stage_entered_at) ||
    a.id.localeCompare(b.id)
  );
}
export function needsMyAction(
  order: OperationalOrder,
  role: Role,
  userId: string,
  memberId: string,
) {
  if (["completed", "cancelled"].includes(order.status)) return false;
  if (role === "admin") return true;
  if (role === "designer") return order.designer_id === memberId && order.stage === "design";
  if (role === "comercial")
    return order.created_by === userId && (order.stage === "approval" || !!order.block_reason);
  return (
    role === "producao" &&
    order.assigned_to === memberId &&
    ["confirmation", "printing", "ready", "shipping"].includes(order.stage)
  );
}
const normalize = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
export function matchesBoardFilters(
  order: OperationalOrder,
  f: BoardFilters,
  identity: { role: Role; userId: string; memberId: string },
  now = new Date(),
) {
  const q = normalize(f.query.trim());
  const digits = f.query.replace(/\D/g, "");
  if (
    q &&
    !normalize(
      [order.code, order.project_name, order.customer_name, order.customer_phone].join(" "),
    ).includes(q) &&
    !(digits.length >= 3 && order.customer_phone.replace(/\D/g, "").includes(digits))
  )
    return false;
  if (f.quick === "mine") {
    // Designers also follow their pending approvals, without gaining approval actions.
    const followingApproval =
      identity.role === "designer" &&
      order.designer_id === identity.memberId &&
      order.stage === "approval" &&
      !["completed", "cancelled"].includes(order.status);
    if (
      !followingApproval &&
      !needsMyAction(order, identity.role, identity.userId, identity.memberId)
    )
      return false;
  }
  if (f.quick === "late" && !isOverdue(order, now)) return false;
  if (f.quick === "today" && (order.status === "completed" || daysToDeadline(order, now) !== 0))
    return false;
  if (f.quick === "urgent" && !["urgent", "critical"].includes(order.priority)) return false;
  if (
    (f.owner && order.assigned_to !== f.owner) ||
    (f.designer && order.designer_id !== f.designer) ||
    (f.seller && order.created_by !== f.seller)
  )
    return false;
  if ((f.product && order.category !== f.product) || (f.stage && order.stage !== f.stage))
    return false;
  if (
    f.priority &&
    (f.priority === "urgent"
      ? !["urgent", "critical"].includes(order.priority)
      : order.priority !== f.priority)
  )
    return false;
  const d = daysToDeadline(order, now);
  if (
    (f.deadline === "late" && !isOverdue(order, now)) ||
    (f.deadline === "today" && d !== 0) ||
    (f.deadline === "week" && (d < 0 || d > 7))
  )
    return false;
  const sold = operationDate(order.created_at);
  return (!f.from || sold >= f.from) && (!f.to || sold <= f.to);
}
export function isNormalMove(from: string, to: string) {
  const index = STAGES.findIndex((s) => s.id === from);
  return STAGES[index + 1]?.id === to || (from === "approval" && to === "design");
}
export function allowedDestinations(
  order: OperationalOrder,
  role: Role,
  memberId: string,
): Stage[] {
  if (role === "admin") return STAGES.map((s) => s.id).filter((s) => s !== order.stage);
  if (role === "designer")
    return order.stage === "design" && order.designer_id === memberId ? ["approval"] : [];
  if (role === "comercial") return order.stage === "approval" ? ["design", "printing"] : [];
  if (role === "producao") {
    const i = STAGES.findIndex((s) => s.id === order.stage);
    return order.stage !== "approval" && STAGES[i + 1] ? [STAGES[i + 1]!.id] : [];
  }
  return [];
}
export function substatus(order: OperationalOrder) {
  if (order.status === "blocked") return `Bloqueado: ${order.block_reason ?? "ver histórico"}`;
  if (order.stage === "confirmation" && order.block_reason) return "Aguardando cliente";
  if (order.stage === "design")
    return !order.designer_id
      ? "Aguardando designer"
      : order.modeling_started_at
        ? "Em modelagem"
        : order.revision_count
          ? "Alteração solicitada"
          : "Aguardando início";
  if (order.stage === "approval") return "Aguardando cliente";
  if (order.stage === "printing")
    return order.job_status === "failed"
      ? "Falha • aguardando reimpressão"
      : order.status === "printing"
        ? "Imprimindo"
        : "Na fila";
  if (order.stage === "ready")
    return order.status === "packaging" ? "Aguardando embalagem" : "Aguardando conferência";
  if (order.stage === "shipping") return order.shipped_at ? "Postado" : "Aguardando postagem";
  return STAGES.find((s) => s.id === order.stage)?.next ?? "Ver pedido";
}
