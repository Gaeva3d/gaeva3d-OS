/**
 * Modelo de dados do GAEVA OS.
 * Adapta as tabelas existentes no Supabase, fonte oficial dos dados:
 * profiles, customers, orders, order_items, order_files, order_assignments,
 * approvals, printers, production_jobs, production_events, team_members, audit_logs.
 */

export type UUID = string;

export interface BaseRecord {
  id: UUID;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

export type Role = "admin" | "comercial" | "producao" | "designer" | "visualizacao";

export const ROLE_LABELS: Record<Role, string> = {
  admin: "Direção/Admin",
  comercial: "Comercial",
  producao: "Produção",
  designer: "Designer 3D",
  visualizacao: "Visualização",
};

export type OrderStatus =
  | "recebido"
  | "briefing_pendente"
  | "em_modelagem"
  | "revisao_interna"
  | "aguardando_aprovacao"
  | "aprovado_produzir"
  | "fila_impressao"
  | "imprimindo"
  | "acabamento"
  | "controle_qualidade"
  | "embalagem"
  | "expedicao"
  | "concluido"
  | "bloqueado"
  | "cancelado";

export const ORDER_STATUS_FLOW: OrderStatus[] = [
  "recebido",
  "briefing_pendente",
  "em_modelagem",
  "revisao_interna",
  "aguardando_aprovacao",
  "aprovado_produzir",
  "fila_impressao",
  "imprimindo",
  "acabamento",
  "controle_qualidade",
  "embalagem",
  "expedicao",
  "concluido",
  "bloqueado",
  "cancelado",
];

export const STATUS_LABELS: Record<OrderStatus, string> = {
  recebido: "Pedido recebido",
  briefing_pendente: "Confirmação do pedido",
  em_modelagem: "Em modelagem",
  revisao_interna: "Revisão interna",
  aguardando_aprovacao: "Aguardando aprovação",
  aprovado_produzir: "Pronto para produção",
  fila_impressao: "Fila de impressão",
  imprimindo: "Imprimindo",
  acabamento: "Acabamento",
  controle_qualidade: "Conferência",
  embalagem: "Embalagem",
  expedicao: "Postagem",
  concluido: "Finalizado",
  bloqueado: "Bloqueado",
  cancelado: "Cancelado",
};

/** Etapas usadas no quadro de produção (kanban operacional). */
export const PRODUCTION_STAGES: OrderStatus[] = [
  "aprovado_produzir",
  "fila_impressao",
  "imprimindo",
  "acabamento",
  "controle_qualidade",
  "embalagem",
  "expedicao",
  "concluido",
];

export type Priority = "normal" | "alta" | "urgente" | "critica";

export const PRIORITY_LABELS: Record<Priority, string> = {
  normal: "Normal",
  alta: "Prioridade",
  urgente: "Urgente",
  critica: "Crítica",
};

export type ProductCategory =
  | "corporativo"
  | "chaveiro"
  | "estatueta"
  | "mascote_corporativo"
  | "trofeu"
  | "chaveiro_corporativo"
  | "pet_personalizado"
  | "peca_personalizada"
  | "outro";

export const PRODUCT_LABELS: Record<ProductCategory, string> = {
  corporativo: "Corporativo",
  chaveiro: "Chaveiro",
  estatueta: "Estatueta",
  mascote_corporativo: "Mascote corporativo",
  trofeu: "Troféu",
  chaveiro_corporativo: "Chaveiro corporativo",
  pet_personalizado: "Pet personalizado",
  peca_personalizada: "Peça personalizada",
  outro: "Outros",
};

export type PaymentStatus = "pendente" | "entrada_paga" | "pago" | "isento" | "faturado";

export const PAYMENT_LABELS: Record<PaymentStatus, string> = {
  pendente: "Pendente",
  entrada_paga: "Entrada paga",
  pago: "Pago",
  isento: "Isento",
  faturado: "Faturado",
};

export type PrinterStatus = "disponivel" | "imprimindo" | "manutencao" | "offline";

export const PRINTER_STATUS_LABELS: Record<PrinterStatus, string> = {
  disponivel: "Disponível",
  imprimindo: "Imprimindo",
  manutencao: "Manutenção",
  offline: "Offline",
};

export type DeadlineRisk = "saudavel" | "atencao" | "risco" | "atrasado";

export interface Customer extends BaseRecord {
  name: string;
  company?: string | null;
  phone: string;
  email?: string | null;
  city: string;
  state: string;
  notes?: string | null;
}

export interface TeamMember extends BaseRecord {
  user_id?: UUID | null;
  name: string;
  avatar_url?: string | null;
  job_title: string;
  role: Role;
  phone?: string | null;
  email?: string | null;
  active: boolean;
  capacity: number;
  specialties: string[];
  notes?: string | null;
}

export interface Printer extends BaseRecord {
  name: string;
  technology: string;
  status: PrinterStatus;
  current_material?: string | null;
  current_order_id?: UUID | null;
  queue: UUID[];
  estimated_hours?: number | null;
  notes?: string | null;
}

export interface OrderItem extends BaseRecord {
  order_id: UUID;
  description: string;
  quantity: number;
  dimensions?: string | null;
  material?: string | null;
  colors?: string | null;
  finishing?: string | null;
}

export type FileCategory = "referencia" | "modelo" | "documento" | "foto_producao";

export interface OrderFile extends BaseRecord {
  order_id: UUID;
  name: string;
  size: number;
  mime_type: string;
  category: FileCategory;
  url?: string | null;
}

export interface OrderAssignment extends BaseRecord {
  order_id: UUID;
  member_id: UUID;
  role_in_order: string;
}

export interface Approval extends BaseRecord {
  order_id: UUID;
  status: "pendente" | "aprovado" | "reprovado";
  version: string;
  approved_at?: string | null;
  notes?: string | null;
}

export interface ProductionJob extends BaseRecord {
  order_id: UUID;
  printer_id?: UUID | null;
  member_id?: UUID | null;
  stage: OrderStatus;
  estimated_hours?: number | null;
  real_hours?: number | null;
  estimated_material?: string | null;
  real_material?: string | null;
  failed: boolean;
  failure_reason?: string | null;
  reprint: boolean;
  notes?: string | null;
  started_at?: string | null;
  finished_at?: string | null;
}

export interface ProductionEvent extends BaseRecord {
  order_id: UUID;
  job_id?: UUID | null;
  author: string;
  message: string;
}

export interface AuditLog extends BaseRecord {
  entity: string;
  entity_id: UUID;
  field: string;
  old_value: string | null;
  new_value: string | null;
  author: string;
  comment?: string | null;
}

export interface Order extends BaseRecord {
  created_by?: UUID | null;
  shipping_address?: string | null;
  shipping_method?: string | null;
  carrier?: string | null;
  tracking_code?: string | null;
  shipped_at?: string | null;
  code: string;
  customer_id: UUID;
  product: ProductCategory;
  project_name: string;
  quantity: number;
  dimensions?: string | null;
  material?: string | null;
  colors?: string | null;
  finishing?: string | null;
  purpose?: string | null;
  event_date?: string | null;
  due_date: string;
  status: OrderStatus;
  priority: Priority;
  urgency_reason?: string | null;
  blocked_reason?: string | null;
  owner_id?: UUID | null;
  printer_id?: UUID | null;
  estimated_hours?: number | null;
  estimated_material?: string | null;
  internal_notes?: string | null;
  commercial_notes?: string | null;
  briefing?: string | null;
  references_notes?: string | null;
  rights_notes?: string | null;
  briefing_complete: boolean;
  value: number;
  down_payment: number;
  payment_status: PaymentStatus;
  approval_registered: boolean;
  approval_date?: string | null;
  approval_version?: string | null;
  approval_notes?: string | null;
  is_demo: boolean;
}
