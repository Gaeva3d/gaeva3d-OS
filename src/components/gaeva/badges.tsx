import { cn } from "@/lib/utils";
import { RISK_LABELS } from "@/lib/gaeva/helpers";
import {
  PAYMENT_LABELS,
  PRINTER_STATUS_LABELS,
  PRIORITY_LABELS,
  STATUS_LABELS,
  type DeadlineRisk,
  type OrderStatus,
  type PaymentStatus,
  type Printer,
  type Priority,
} from "@/lib/gaeva/types";

const chip =
  "inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-xs font-medium whitespace-nowrap";

const STATUS_TONE: Record<OrderStatus, string> = {
  recebido: "border-border bg-muted text-muted-foreground",
  briefing_pendente: "border-warning/30 bg-warning/15 text-warning-foreground",
  em_modelagem: "border-primary/25 bg-primary/10 text-primary",
  revisao_interna: "border-primary/25 bg-primary/10 text-primary",
  aguardando_aprovacao: "border-warning/30 bg-warning/15 text-warning-foreground",
  aprovado_produzir: "border-success/30 bg-success/12 text-success",
  fila_impressao: "border-primary/25 bg-primary/10 text-primary",
  imprimindo: "border-primary/40 bg-primary text-primary-foreground",
  acabamento: "border-border bg-secondary text-secondary-foreground",
  controle_qualidade: "border-border bg-secondary text-secondary-foreground",
  embalagem: "border-border bg-secondary text-secondary-foreground",
  expedicao: "border-border bg-secondary text-secondary-foreground",
  concluido: "border-success/30 bg-success/12 text-success",
  bloqueado: "border-danger/35 bg-danger/12 text-danger",
  cancelado: "border-border bg-muted text-muted-foreground line-through",
};

export function StatusBadge({ status, className }: { status: OrderStatus; className?: string }) {
  return <span className={cn(chip, STATUS_TONE[status], className)}>{STATUS_LABELS[status]}</span>;
}

const PRIORITY_TONE: Record<Priority, string> = {
  normal: "border-border bg-muted text-muted-foreground",
  alta: "border-primary/30 bg-primary/10 text-primary",
  urgente: "border-warning/40 bg-warning/20 text-warning-foreground",
  critica: "border-danger/40 bg-danger/15 text-danger",
};

export function PriorityBadge({ priority, className }: { priority: Priority; className?: string }) {
  return (
    <span className={cn(chip, PRIORITY_TONE[priority], className)}>
      {PRIORITY_LABELS[priority]}
    </span>
  );
}

const RISK_TONE: Record<DeadlineRisk, string> = {
  saudavel: "border-success/30 bg-success/12 text-success",
  atencao: "border-warning/35 bg-warning/18 text-warning-foreground",
  risco: "border-warning/50 bg-warning/25 text-warning-foreground",
  atrasado: "border-danger/40 bg-danger/15 text-danger",
};

export function RiskBadge({ risk, className }: { risk: DeadlineRisk; className?: string }) {
  return <span className={cn(chip, RISK_TONE[risk], className)}>{RISK_LABELS[risk]}</span>;
}

const PRINTER_TONE: Record<Printer["status"], string> = {
  disponivel: "border-success/30 bg-success/12 text-success",
  imprimindo: "border-primary/30 bg-primary/10 text-primary",
  manutencao: "border-warning/40 bg-warning/20 text-warning-foreground",
  offline: "border-border bg-muted text-muted-foreground",
};

export function PrinterStatusBadge({ status }: { status: Printer["status"] }) {
  return <span className={cn(chip, PRINTER_TONE[status])}>{PRINTER_STATUS_LABELS[status]}</span>;
}

const PAYMENT_TONE: Record<PaymentStatus, string> = {
  faturado: "border-primary/25 bg-primary/10 text-primary",
  pendente: "border-warning/35 bg-warning/15 text-warning-foreground",
  entrada_paga: "border-primary/25 bg-primary/10 text-primary",
  pago: "border-success/30 bg-success/12 text-success",
  isento: "border-border bg-muted text-muted-foreground",
};

export function PaymentBadge({ status }: { status: PaymentStatus }) {
  return <span className={cn(chip, PAYMENT_TONE[status])}>{PAYMENT_LABELS[status]}</span>;
}
