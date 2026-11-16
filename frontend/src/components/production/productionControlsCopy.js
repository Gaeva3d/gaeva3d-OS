import { parseDateTime } from "../../utils/formatting.js";
import { knownProductionErrorMessage } from "./productionCopy.js";

export const productionCopy = {
  cancel: "Cancelar",
  close: "Fechar",
  complete: "Concluir",
  loading: "Carregando…",
  loadingOperationsFailed: "Não foi possível carregar as operações",
  operation: "Operação",
  operations: "Operações",
  order: "Ordem",
  product: "Produto",
  refresh: "Atualizar",
  schedule: "Agendar",
  scheduling: "Agendando…",
  skip: "Pular",
  skipOperation: "Pular operação",
  startOperationFailed: "Não foi possível iniciar a operação",
  completeOperation: "Concluir operação",
  completeOperationFailed: "Não foi possível concluir a operação",
  scrap: "Refugo",
  scrapReason: "Motivo do refugo",
  selectScrapReason: "Selecione um motivo de refugo",
  replacementOrder: "Ordem de reposição",
  materials: "Materiais",
  workCenter: "Centro de trabalho",
  workOrder: "Ordem de produção",
};

const STATUS_LABELS = {
  draft: "Rascunho",
  pending: "Pendente",
  queued: "Na fila",
  scheduled: "Agendado",
  released: "Liberado",
  in_progress: "Em andamento",
  running: "Em execução",
  paused: "Pausado",
  on_hold: "Em espera",
  qc_hold: "Aguardando controle de qualidade",
  complete: "Concluído",
  completed: "Concluído",
  skipped: "Ignorado",
  short: "Produção parcial",
  scrapped: "Refugado",
  cancelled: "Cancelado",
  closed: "Encerrado",
  available: "Disponível",
  unavailable: "Indisponível",
  idle: "Ocioso",
  busy: "Ocupado",
  printing: "Imprimindo",
  maintenance: "Em manutenção",
  offline: "Desconectado",
  allocated: "Alocado",
  consumed: "Consumido",
};

export function productionStatusLabel(status) {
  return Object.hasOwn(STATUS_LABELS, status) ? STATUS_LABELS[status] : status;
}

export function productionErrorMessage(error, fallback) {
  const message = typeof error?.detail === "string" ? error.detail : error?.message;
  const known = knownProductionErrorMessage(message);
  if (known) return known;
  return !message || /^(?:HTTP \d+|Failed to fetch|Network error|Internal Server Error)$/i.test(message)
    ? fallback
    : message;
}

const ORDER_STATUS_LABELS = {
  released: "Liberada",
  scheduled: "Agendada",
  paused: "Pausada",
  complete: "Concluída",
  completed: "Concluída",
  closed: "Encerrada",
  cancelled: "Cancelada",
  scrapped: "Refugada",
};

export function productionOrderStatusLabel(status) {
  return Object.hasOwn(ORDER_STATUS_LABELS, status)
    ? ORDER_STATUS_LABELS[status]
    : productionStatusLabel(status);
}

const productionQuantityFormatter = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 4 });

export function formatProductionQuantity(value) {
  if (value == null || value === "") return "—";
  const quantity = Number(value);
  return Number.isFinite(quantity) ? productionQuantityFormatter.format(quantity) : String(value);
}

export function formatProductionTime(value) {
  return parseDateTime(value)?.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  }) ?? "";
}

export function formatProductionDate(value) {
  if (!value) return "";
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [year, month, day] = value.split("-");
    return day + "/" + month + "/" + year;
  }
  return parseDateTime(value).toLocaleDateString("pt-BR");
}
