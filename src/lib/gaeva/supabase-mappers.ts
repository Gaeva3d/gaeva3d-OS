import type { Tables } from "@/integrations/supabase/types";

import type {
  Approval,
  AuditLog,
  Customer,
  FileCategory,
  Order,
  OrderFile,
  OrderItem,
  OrderStatus,
  PaymentStatus,
  Printer,
  PrinterStatus,
  Priority,
  ProductCategory,
  ProductionEvent,
  ProductionJob,
  Role,
  TeamMember,
} from "./types";

export type DbApproval = Tables<"approvals">;
export type DbAudit = Tables<"audit_logs">;
export type DbCustomer = Tables<"customers">;
export type DbOrder = Tables<"orders">;
export type DbOrderFile = Tables<"order_files">;
export type DbOrderItem = Tables<"order_items">;
export type DbPrinter = Tables<"printers">;
export type DbProductionEvent = Tables<"production_events">;
export type DbProductionJob = Tables<"production_jobs">;
export type DbProfile = Tables<"profiles">;
export type DbTeamMember = Tables<"team_members">;

const ROLE_FROM_DB = {
  admin: "admin",
  commercial: "comercial",
  production: "producao",
  designer: "designer",
  viewer: "visualizacao",
} as const satisfies Record<DbProfile["role"], Role>;

export const ROLE_TO_DB = {
  admin: "admin",
  comercial: "commercial",
  producao: "production",
  designer: "designer",
  visualizacao: "viewer",
} as const;

const STATUS_FROM_DB: Record<DbOrder["status"], OrderStatus> = {
  received: "recebido",
  briefing_pending: "briefing_pendente",
  modeling: "em_modelagem",
  internal_review: "revisao_interna",
  awaiting_customer_approval: "aguardando_aprovacao",
  approved_for_production: "aprovado_produzir",
  print_queue: "fila_impressao",
  printing: "imprimindo",
  finishing: "acabamento",
  quality_control: "controle_qualidade",
  packaging: "embalagem",
  shipping: "expedicao",
  completed: "concluido",
  blocked: "bloqueado",
  cancelled: "cancelado",
};

export const STATUS_TO_DB = Object.fromEntries(
  Object.entries(STATUS_FROM_DB).map(([key, value]) => [value, key]),
) as Record<OrderStatus, DbOrder["status"]>;

const PRIORITY_FROM_DB: Record<DbOrder["priority"], Priority> = {
  normal: "normal",
  high: "alta",
  urgent: "urgente",
  critical: "critica",
};

export const PRIORITY_TO_DB = Object.fromEntries(
  Object.entries(PRIORITY_FROM_DB).map(([key, value]) => [value, key]),
) as Record<Priority, DbOrder["priority"]>;

const PRODUCT_FROM_DB: Record<DbOrder["category"], ProductCategory> = {
  corporate: "corporativo",
  keychain: "chaveiro",
  statuette: "estatueta",
  corporate_mascot: "mascote_corporativo",
  trophy: "trofeu",
  corporate_keychain: "chaveiro_corporativo",
  custom_pet: "pet_personalizado",
  custom_piece: "peca_personalizada",
  other: "outro",
};

export const PRODUCT_TO_DB = Object.fromEntries(
  Object.entries(PRODUCT_FROM_DB).map(([key, value]) => [value, key]),
) as Record<ProductCategory, DbOrder["category"]>;

const PAYMENT_FROM_DB: Record<DbOrder["payment_status"], PaymentStatus> = {
  invoiced: "faturado",
  pending: "pendente",
  partial: "entrada_paga",
  paid: "pago",
  overdue: "pendente",
  refunded: "pendente",
  cancelled: "isento",
};

export const PAYMENT_TO_DB = {
  faturado: "invoiced",
  pendente: "pending",
  entrada_paga: "partial",
  pago: "paid",
  isento: "cancelled",
} as const;

const PRINTER_STATUS_FROM_DB: Record<DbPrinter["status"], PrinterStatus> = {
  available: "disponivel",
  printing: "imprimindo",
  maintenance: "manutencao",
  offline: "offline",
};

export const PRINTER_STATUS_TO_DB = Object.fromEntries(
  Object.entries(PRINTER_STATUS_FROM_DB).map(([key, value]) => [value, key]),
) as Record<PrinterStatus, DbPrinter["status"]>;

const FILE_FROM_DB: Partial<Record<DbOrderFile["category"], FileCategory>> = {
  reference: "referencia",
  model: "modelo",
  briefing: "documento",
  approval: "documento",
  production: "foto_producao",
  quality: "foto_producao",
  shipping: "foto_producao",
  other: "documento",
};

export const FILE_TO_DB = {
  referencia: "reference",
  modelo: "model",
  documento: "other",
  foto_producao: "production",
} as const;

export function mapCustomer(row: DbCustomer): Customer {
  return {
    id: row.id,
    name: row.name,
    company: row.company_name,
    phone: row.phone,
    email: row.email,
    city: row.city ?? "",
    state: row.state ?? "",
    notes: row.notes,
    created_at: row.created_at,
    updated_at: row.updated_at,
    deleted_at: row.deleted_at,
  };
}

export function mapTeamMember(row: DbTeamMember): TeamMember {
  return {
    id: row.id,
    user_id: row.user_id,
    name: row.name,
    avatar_url: row.avatar_path,
    job_title: row.job_title,
    role: ROLE_FROM_DB[row.access_role],
    phone: row.phone,
    email: row.email,
    active: row.is_active,
    capacity: row.capacity_limit,
    specialties: row.specialties,
    notes: row.notes,
    created_at: row.created_at,
    updated_at: row.updated_at,
    deleted_at: row.deleted_at,
  };
}

export function mapPrinter(row: DbPrinter, orders: DbOrder[]): Printer {
  return {
    id: row.id,
    name: row.name,
    technology: row.technology === "fdm" ? "FDM" : row.technology === "resin" ? "Resina" : "Outro",
    status: PRINTER_STATUS_FROM_DB[row.status],
    current_material: row.current_material,
    current_order_id: row.current_order_id,
    queue: orders
      .filter((order) => order.initial_printer_id === row.id && order.id !== row.current_order_id)
      .map((order) => order.id),
    estimated_hours: Number(row.planned_hours) || null,
    notes: row.notes,
    created_at: row.created_at,
    updated_at: row.updated_at,
    deleted_at: row.deleted_at,
  };
}

export function mapOrder(row: DbOrder, item?: DbOrderItem, approvals: DbApproval[] = []): Order {
  const latestApproval = approvals
    .filter((approval) => approval.order_id === row.id)
    .sort(
      (a, b) =>
        b.version - a.version ||
        b.created_at.localeCompare(a.created_at) ||
        b.id.localeCompare(a.id),
    )[0];
  const requirements = row.mandatory_requirements?.split("\n\n") ?? [];

  return {
    id: row.id,
    code: row.code,
    created_by: row.created_by,
    shipping_address: row.shipping_address,
    shipping_method: row.shipping_method,
    carrier: row.carrier,
    tracking_code: row.tracking_code,
    shipped_at: row.shipped_at,
    customer_id: row.customer_id,
    product: PRODUCT_FROM_DB[row.category],
    project_name: row.project_name,
    quantity: item?.quantity ?? 1,
    dimensions: item?.dimensions ?? null,
    material: item?.material ?? null,
    colors: item?.colors.join(", ") || null,
    finishing: item?.finishing ?? null,
    purpose: item?.purpose ?? null,
    event_date: row.event_date,
    due_date: row.promised_at,
    status: STATUS_FROM_DB[row.status],
    priority: PRIORITY_FROM_DB[row.priority],
    urgency_reason: row.urgency_reason,
    blocked_reason: row.block_reason,
    owner_id: row.assigned_to,
    printer_id: row.initial_printer_id,
    estimated_hours: row.estimated_minutes == null ? null : row.estimated_minutes / 60,
    estimated_material:
      row.estimated_material_grams == null ? null : `${row.estimated_material_grams} g`,
    internal_notes: row.internal_notes,
    commercial_notes: row.commercial_notes,
    briefing: row.briefing_description,
    references_notes: requirements[0] ?? null,
    rights_notes: requirements[1] ?? null,
    briefing_complete: row.briefing_complete,
    value: Number(row.total_value),
    down_payment: Number(row.deposit_value),
    payment_status: PAYMENT_FROM_DB[row.payment_status],
    approval_registered: latestApproval?.status === "approved",
    approval_date: latestApproval?.decided_at ?? null,
    approval_version: latestApproval ? `v${latestApproval.version}` : null,
    approval_notes: latestApproval?.notes ?? null,
    is_demo: false,
    created_at: row.created_at,
    updated_at: row.updated_at,
    deleted_at: row.deleted_at,
  };
}

export function mapOrderItem(row: DbOrderItem): OrderItem {
  return {
    id: row.id,
    order_id: row.order_id,
    description: row.name,
    quantity: row.quantity,
    dimensions: row.dimensions,
    material: row.material,
    colors: row.colors.join(", ") || null,
    finishing: row.finishing,
    created_at: row.created_at,
    updated_at: row.updated_at,
    deleted_at: row.deleted_at,
  };
}

export function mapOrderFile(row: DbOrderFile, url?: string | null): OrderFile {
  return {
    id: row.id,
    order_id: row.order_id,
    name: row.file_name,
    size: row.size_bytes ?? 0,
    mime_type: row.mime_type ?? "application/octet-stream",
    category: FILE_FROM_DB[row.category] ?? "documento",
    url: url ?? null,
    created_at: row.created_at,
    updated_at: row.created_at,
    deleted_at: row.deleted_at,
  };
}

export function mapApproval(row: DbApproval): Approval {
  return {
    id: row.id,
    order_id: row.order_id,
    status:
      row.status === "approved" ? "aprovado" : row.status === "pending" ? "pendente" : "reprovado",
    version: `v${row.version}`,
    approved_at: row.decided_at,
    notes: row.notes,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

export function mapProductionJob(row: DbProductionJob): ProductionJob {
  const stage: OrderStatus =
    row.status === "running"
      ? "imprimindo"
      : row.status === "completed"
        ? "concluido"
        : row.status === "cancelled"
          ? "cancelado"
          : row.status === "failed" || row.status === "paused"
            ? "bloqueado"
            : "fila_impressao";

  return {
    id: row.id,
    order_id: row.order_id,
    printer_id: row.printer_id,
    member_id: row.assigned_to,
    stage,
    estimated_hours: row.estimated_minutes == null ? null : row.estimated_minutes / 60,
    real_hours: row.actual_minutes == null ? null : row.actual_minutes / 60,
    estimated_material:
      row.estimated_material_grams == null ? null : `${row.estimated_material_grams} g`,
    real_material: row.actual_material_grams == null ? null : `${row.actual_material_grams} g`,
    failed: row.status === "failed",
    failure_reason: row.failure_reason,
    reprint: row.attempt_number > 1 || Boolean(row.reprint_of_id),
    notes: row.notes,
    started_at: row.started_at,
    finished_at: row.finished_at,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

export function mapProductionEvent(row: DbProductionEvent, author: string): ProductionEvent {
  return {
    id: row.id,
    order_id: row.order_id,
    job_id: row.production_job_id,
    author,
    message: row.notes ?? row.failure_reason ?? row.event_type,
    created_at: row.created_at,
    updated_at: row.created_at,
  };
}

export function mapAudit(row: DbAudit, author: string): AuditLog {
  return {
    id: String(row.id),
    entity: row.table_name,
    entity_id: row.record_id ?? "",
    field: row.action,
    old_value: row.old_values ? JSON.stringify(row.old_values) : null,
    new_value: row.new_values ? JSON.stringify(row.new_values) : null,
    author,
    comment: row.comment,
    created_at: row.created_at,
    updated_at: row.created_at,
  };
}

export function roleFromDb(role: DbProfile["role"]): Role {
  return ROLE_FROM_DB[role];
}
