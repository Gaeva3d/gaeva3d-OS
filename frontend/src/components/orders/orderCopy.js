export const orderCopy = {
  orderLoading: "O pedido ainda está carregando",
  productLineRequired: "O pedido precisa ter um item de produto",
  productionOrderExists: "Já existe uma ordem de produção",
  confirmationRequired: "Confirme o pedido antes de liberar a produção",
  billingRequired: "Emita ou envie uma fatura, ou registre um pagamento antes de liberar a produção",
  operation: "Operação",
  orderFetchFailed: "Não foi possível carregar o pedido",
  refundRecorded: "Reembolso registrado",
  paymentRecorded: "Pagamento registrado",
  dataRefreshed: "Dados atualizados",
  refreshFailed: "Não foi possível atualizar",
  productionOrderCreated: "Ordem de produção criada com sucesso",
  cancelFailed: "Não foi possível cancelar o pedido",
  closePreviewFailed: "Não foi possível carregar a prévia do encerramento parcial",
  closeShortFailed: "Não foi possível encerrar o pedido parcialmente",
  confirmationRefreshFailed: "Pedido confirmado, mas alguns dados relacionados não foram atualizados",
  confirmFailed: "Não foi possível confirmar o pedido",
  acceptShortFailed: "Não foi possível aceitar a quantidade produzida",
  rejectFailed: "Não foi possível rejeitar o pedido",
  deleteFailed: "Não foi possível excluir o pedido",
  invoiceCreateFailed: "Não foi possível emitir a fatura",
  invoiceSendFailed: "Não foi possível marcar a fatura como enviada",
  invoiceDownloadFailed: "Não foi possível baixar o PDF da fatura",
  loadingOrder: "Carregando pedido…",
  orderNotFound: "Pedido não encontrado",
  availabilityProductRequired: "O pedido precisa ter um produto para verificar a disponibilidade",
  availabilityProductionRequired: "Crie uma ordem de produção para verificar a disponibilidade dos materiais",
  availabilityFailed: "Não foi possível verificar a disponibilidade",
  orderCommandCenter: "Central do pedido",
  quickActions: "Ações rápidas",
  checkingInvoice: "Verificando a situação da fatura…",
  orderInvoice: "Fatura do pedido",
  openInvoice: "Abrir fatura",
  downloadPdf: "Baixar PDF",
  checking: "Verificando…",
  checkMaterials: "Verificar disponibilidade de materiais",
  viewInProduction: "Ver na produção",
  orderSummary: "Resumo do pedido",
  product: "Produto",
  lines: "Itens",
  quantity: "Quantidade",
  status: "Status",
  previouslyClosedShort: "Encerrado parcialmente e depois atendido",
  closedShort: "Encerrado parcialmente",
  total: "Total",
  customer: "Cliente",
  name: "Nome",
  email: "E-mail",
  phone: "Telefone",
  customerId: "ID do cliente",
  viewQuote: "Ver proposta",
  noCustomer: "Nenhuma informação de cliente cadastrada.",
  activity: "Atividade",
  shippingTracking: "Rastreamento do envio",
  closeOrderShort: "Encerrar pedido parcialmente",
  unresolvedProductionOrders: "Ainda há ordens de produção pendentes",
  loadingPreview: "Carregando prévia…",
  ordered: "Solicitado",
  adjusted: "Ajustado",
  reason: "Motivo",
  linkedProductionOrders: "Ordens de produção vinculadas:",
  closing: "Encerrando…",
  rejecting: "Rejeitando…",
  rejectOrder: "Rejeitar pedido",
  orderAlreadyShipped: "O pedido já foi enviado",
  createProductionFirst: "Crie uma ordem de produção primeiro",
  productionMustFinish: "Conclua a produção antes do envio",
  materialsMustBeAvailable: "Resolva as faltas de material antes do envio",
  creating: "Criando…",
  createInvoice: "Emitir fatura",
  markingSent: "Atualizando…",
  markSent: "Marcar como enviada",
  recordPayment: "Registrar pagamento",
  confirmOrder: "Confirmar pedido",
  needsReview: "Requer revisão",
  confirmReview: "Revise o cliente, os itens, os preços, o frete e os impostos.",
  confirmedForBilling: "O pedido está pronto para faturamento.",
  confirming: "Confirmando…",
  confirm: "Confirmar",
  billingStep: "Fatura / Pagamento",
  notReleased: "Aguardando liberação",
  billingReleased: "O faturamento já permite liberar a produção.",
  billingBeforeProduction: "Envie uma fatura ou registre um pagamento antes de liberar a produção.",
  productionOrders: "Ordens de produção",
  noProductLine: "Sem item de produto",
  noProductionForServices: "Itens de serviço dispensam a liberação da produção.",
  productionLinked: "As ordens de produção foram vinculadas ao pedido. Abra a produção para liberar, iniciar e concluir as ordens.",
  readyToCreateWorkOrders: "Pronto para criar ordens de produção.",
  openWorkOrder: "Abrir ordem de produção",
  createWorkOrders: "Criar ordens de produção",
  fulfillment: "Expedição",
  readyToShip: "Pronto para envio",
  waiting: "Aguardando",
  shipmentInProgress: "O envio está em andamento ou já foi concluído.",
  productionReady: "A produção foi concluída e os materiais estão disponíveis.",
  shipOrder: "Enviar pedido",
  orderWorkflow: "Fluxo do pedido",
  orderWorkflowDescription: "Confirme o pedido, faça o faturamento, libere a produção e prepare o envio.",
  orderActions: "Ações do pedido",
  cancelOrder: "Cancelar pedido",
  closeShort: "Encerrar parcialmente",
  deleteOrder: "Excluir pedido",
  refreshOrderData: "Atualizar dados do pedido",
  refreshing: "Atualizando…",
  refresh: "↻ Atualizar",
  printPackingSlipHelp: "Imprimir lista de embalagem em PDF",
  printPackingSlip: "Imprimir lista de embalagem",
};

const STATUS_LABELS = {
  draft: "Rascunho",
  pending: "Pendente",
  pending_confirmation: "Aguardando confirmação",
  confirmed: "Confirmado",
  processing: "Em processamento",
  on_hold: "Em espera",
  in_production: "Em produção",
  ready_to_ship: "Pronto para envio",
  partially_ready: "Parcialmente pronto",
  partially_shipped: "Parcialmente enviado",
  shipped: "Enviado",
  delivered: "Entregue",
  complete: "Concluído",
  completed: "Concluído",
  closed: "Encerrado",
  fulfilled: "Atendido",
  cancelled: "Cancelado",
  rejected: "Rejeitado",
  blocked: "Bloqueado",
  released: "Liberado",
  scheduled: "Programado",
  running: "Em andamento",
  in_progress: "Em andamento",
  short: "Produção parcial",
  scrapped: "Descartado",
  qc_hold: "Retido pela qualidade",
  queued: "Na fila",
  short_closed: "Encerrado parcialmente e pronto para envio",
  sent: "Enviada",
  unpaid: "Em aberto",
  partial: "Parcialmente pago",
  partially_paid: "Parcialmente pago",
  paid: "Pago",
  overdue: "Em atraso",
  void: "Anulado",
  refunded: "Reembolsado",
};

const WORKFLOW_STATES = {
  done: "Concluída",
  active: "Em andamento",
  blocked: "Bloqueada",
  waiting: "Aguardando",
};

export function orderStatusLabel(status) {
  return Object.hasOwn(STATUS_LABELS, status)
    ? STATUS_LABELS[status]
    : status?.replace(/_/g, " ") || "Desconhecido";
}

export function workflowStateLabel(state) {
  return WORKFLOW_STATES[state];
}

const PAYMENT_METHODS = {
  cash: "Dinheiro",
  check: "Cheque",
  credit_card: "Cartão de crédito",
  debit_card: "Cartão de débito",
  online: "Pagamento online",
  wire: "Transferência bancária",
  other: "Outro",
  pix: "Pix",
  boleto: "Boleto",
  paypal: "PayPal",
  venmo: "Venmo",
  zelle: "Zelle",
};

export function paymentMethodLabel(method) {
  return Object.hasOwn(PAYMENT_METHODS, method) ? PAYMENT_METHODS[method] : method;
}

export function orderErrorMessage(error, fallback) {
  const message = error?.message;
  if (error?.status === 403 && message === "Not authorized to view this order") {
    return "Você não tem permissão para ver este pedido.";
  }
  if (error?.status === 404 && (!message || /^(?:HTTP 404|Sales order not found)$/i.test(message))) {
    return orderCopy.orderNotFound;
  }
  if (!message || /^(?:HTTP \d+|Failed to fetch|Network error|Internal Server Error)$/i.test(message)) {
    return fallback;
  }
  return message;
}

export function shippingBlockLabel(reason) {
  if (reason === "Order has no shipping address.") {
    return "O pedido não tem endereço de entrega.";
  }
  if (reason === "Shipment GL posting for material-backed sales orders needs raw-material account mapping") {
    return "O lançamento contábil do envio exige configurar as contas de matérias-primas.";
  }
  const status = reason.match(/^Order is '([^']+)'; it must be 'ready_to_ship' to ship\.$/);
  if (status) {
    return "Status atual: " + orderStatusLabel(status[1]) + ". O pedido precisa estar pronto para envio.";
  }
  const product = reason.match(/^Insufficient inventory for product (\d+)\.$/);
  return product ? "Estoque insuficiente para o produto " + product[1] + "." : reason;
}

const REFERENCE_LABELS = {
  make_product: "Produto",
  product: "Produto",
  production_order: "Ordem de produção",
  purchase_order: "Pedido de compra",
};

export function orderReferenceLabel(type) {
  return Object.hasOwn(REFERENCE_LABELS, type) ? REFERENCE_LABELS[type] : type;
}

export function orderIssueLabel(issue) {
  const code = issue.reference_code;
  switch (issue.type) {
    case "production_missing":
      return `Não há ordem de produção para ${code}`;
    case "production_incomplete":
      return `A ordem de produção ${code} ainda não foi concluída`;
    case "material_shortage": {
      const quantity = issue.details?.shortage_projected ?? issue.details?.shortage;
      if (quantity == null || !Number.isFinite(Number(quantity))) return issue.message;
      const amount = new Intl.NumberFormat("pt-BR").format(Number(quantity));
      return `Estoque insuficiente para ${code}: faltam ${amount} un.`;
    }
    case "purchase_pending":
      return `Pedido de compra ${code} aguardando recebimento`;
    default:
      return issue.message;
  }
}

const ACTION_PREFIXES = {
  purchase_order: ["Expedite PO ", "Agilizar pedido de compra "],
  product: ["Create PO for ", "Criar pedido de compra para "],
  production_order: ["Complete production ", "Concluir produção "],
  make_product: ["Create production order for ", "Criar ordem de produção para "],
};

export function orderActionLabel(action) {
  const prefixes = ACTION_PREFIXES[action.reference_type];
  return prefixes && action.action.startsWith(prefixes[0])
    ? prefixes[1] + action.action.slice(prefixes[0].length)
    : action.action;
}

export function orderActionImpactLabel(impact) {
  if (!impact) return impact;
  return impact
    .replace(/^Need ([\d.]+) units$/, "Quantidade necessária: $1 un.")
    .replace(/^([\d.]+) units remaining$/, "Quantidade restante: $1 un.")
    .replace(/^Resolves material shortage, expected (None|TBD)$/, "Cobre a falta de material. Previsão indisponível.")
    .replace(/^Resolves material shortage, expected (\d{4}-\d{2}-\d{2})$/, "Cobre a falta de material. Previsão: $1.");
}

export function closeShortReasonLabel(reason) {
  if (!reason) return reason;
  return reason
    .replace(/^Material line — no adjustment$/, "Item de material sem ajuste")
    .replace(/^Fully produced$/, "Produção concluída")
    .replace(/^Limited by PO (.+): produced ([\d.]+) of ([\d.]+)$/, "Ordem $1: $2 de $3 produzidos")
    .replace(/^Produced ([\d.]+) of ([\d.]+)$/, "Produzidos $1 de $2")
    .replace(/^Available inventory: ([\d.]+)$/, "Estoque disponível: $1");
}
