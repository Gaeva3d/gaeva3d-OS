import { apiErrorCopy } from "../../locales/pt-BR/apiErrors";
import { productionOrderStatusLabel } from "./productionControlsCopy";

export const productionDetailCopy = {
  loading: "Carregando ordem de produção…",
  notFound: "Ordem de produção não encontrada.",
  fetchFailed: "Não foi possível carregar a ordem de produção.",
  back: "Voltar à produção",
  title: (code) => `Ordem de produção: ${code}`,
  commandCenter: "Central da produção",
  refresh: "Atualizar",
  workflow: "Fluxo de produção",
  workflowDescription: "Crie, libere, execute e conclua a ordem de produção.",
  step: (number) => `Etapa ${number}`,
  stepStatus: {
    done: "Concluída",
    current: "Atual",
    waiting: "Aguardando",
    blocked: "Bloqueada",
  },
  workOrder: "Ordem de produção",
  draft: "Rascunho",
  created: "Criada",
  createdFromSales: "Criada a partir do pedido de venda, aguardando liberação para produção.",
  createdForStock: "Criada para estoque ou produção interna.",
  release: "Liberação",
  awaitingRelease: "Aguardando liberação",
  released: "Liberada",
  releaseChecks: "Libere após verificar os materiais e as condições comerciais.",
  releasedToProduction: "A ordem foi liberada para produção.",
  build: "Execução",
  inProduction: "Em produção",
  productionDone: "Produção concluída",
  readyToStart: "Pronta para iniciar",
  waiting: "Aguardando",
  startWhenReady: "Inicie a produção quando a equipe estiver pronta.",
  operationsInProgress: "As operações estão em execução.",
  goodsReady: "Os produtos acabados estão prontos para atender ao pedido.",
  releaseBeforeStart: "Libere a ordem antes de iniciar a produção.",
  completion: "Conclusão",
  complete: "Concluída",
  readyToComplete: "Pronta para concluir",
  completeWhenProduced: "Conclua após produzir a quantidade aceita.",
  workOrderComplete: "A produção desta ordem foi concluída.",
  startBeforeCompletion: "Inicie a produção antes de concluir a ordem.",
  summary: "Resumo da ordem",
  product: "Produto",
  unavailable: "Não informado",
  quantity: "Quantidade",
  status: "Status",
  unknownStatus: "Status desconhecido",
  priority: "Prioridade",
  normalPriority: "Normal",
  dueDate: "Prazo de entrega",
  noDueDate: "Sem prazo definido",
  progress: "Progresso",
  remakeOrder: "Ordem de refação",
  remakeOf: "Esta ordem refaz a ordem:",
  reason: (reason) => `Motivo: ${reason}`,
  viewOriginal: "Ver ordem original",
  linkedSalesOrder: "Pedido de venda vinculado",
  customer: "Cliente",
  salesOrderContext: (customer) => `${customer} · Abra o pedido de venda para gerenciar a fatura, os pagamentos e o envio.`,
  viewSalesOrder: "Ver pedido de venda",
  notes: "Observações",
  generatedFromOrder: (code) => `Gerada a partir do pedido ${code}`,
  generatedFromOrderLine: (code, line) => `Gerada a partir do item ${line} do pedido ${code}`,
  remakeOfOrder: (code, reason) => `Refação da ordem ${code} · ${reason}`,
  originalOrderScrapped: (reason) => `Motivo do refugo da ordem original: ${reason}`,
  orderScrapped: (reason) => `Motivo do refugo: ${reason}`,
  operationScheduled: "Operação agendada com sucesso.",
  materialReservationFailed: "Não foi possível reservar os materiais. Verifique os componentes e as unidades de medida.",
  materialShortages: "Há materiais pendentes para liberar a ordem.",
  materialShortage: (sku, needed, reserved) =>
    `${sku}: necessário ${needed}, reservado ${reserved}`,
  invalidStatus: (action, status) => `${action} Status atual: ${status}.`,
  shortOrder: "A ordem está com produção parcial. Aceite a quantidade produzida para concluí-la.",
  overQuantity: (reported, ordered) =>
    `A quantidade informada (${reported}) excede a quantidade da ordem (${ordered}).`,
  shortCompletion: (produced, remaining) =>
    `A quantidade produzida (${produced}) é inferior à quantidade restante (${remaining}).`,
};

export const productionDetailActions = {
  release: {
    label: "Liberar para produção",
    success: "Ordem liberada para produção.",
    error: "Não foi possível liberar a ordem de produção.",
  },
  start: {
    label: "Iniciar produção",
    success: "Produção iniciada.",
    error: "Não foi possível iniciar a produção.",
  },
  complete: {
    label: "Concluir produção",
    success: "Produção concluída.",
    error: "Não foi possível concluir a produção.",
  },
};

export function productionOrderNoteLabel(value, order) {
  if (!value) return value;

  return value.split("\n").map((line) => {
    const salesOrder = line.match(/^(?:Auto-generated|Generated) from (.+?)(?: Line (\d+))?$/);
    if (salesOrder && salesOrder[1] === order.sales_order_code) {
      const [, code, item] = salesOrder;
      return item
        ? productionDetailCopy.generatedFromOrderLine(code, item)
        : productionDetailCopy.generatedFromOrder(code);
    }

    const code = order.remake_of_code;
    const remakePrefix = `Remake of ${code}`;
    if (code && line.startsWith(remakePrefix)) {
      const reason = line.slice(remakePrefix.length);
      const originalScrapPrefix = " - Original scrapped due to: ";
      const scrapPrefix = " due to scrap: ";
      if (reason.startsWith(originalScrapPrefix)) {
        return productionDetailCopy.remakeOfOrder(
          code,
          productionDetailCopy.originalOrderScrapped(reason.slice(originalScrapPrefix.length)),
        );
      }
      if (reason.startsWith(scrapPrefix)) {
        return productionDetailCopy.remakeOfOrder(
          code,
          productionDetailCopy.orderScrapped(reason.slice(scrapPrefix.length)),
        );
      }
      if (reason.startsWith(" - ")) {
        return productionDetailCopy.remakeOfOrder(code, reason.slice(3));
      }
    }

    return line;
  }).join("\n");
}

const numberFormat = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 20 });

export function productionDetailErrorMessage(error, fallback) {
  const status = error?.status ?? error?.response?.status;
  const detail = error?.payload?.detail ?? error?.response?.data?.detail;
  const message = typeof detail === "string" ? detail : detail?.message ?? error?.message ?? "";

  if (status === 401) return apiErrorCopy.sessionExpired;
  if (status === 403) return apiErrorCopy.permissionDenied;
  if (status === 404) return productionDetailCopy.notFound;
  if (status === 429) return apiErrorCopy.tooManyRequests;
  if (status >= 500) return apiErrorCopy.serverError;
  if (status === 0 || /^(?:Failed to fetch|Network error)$/i.test(message)) {
    return apiErrorCopy.connectionError;
  }

  if (message.startsWith("Material reservation failed during release")) {
    return productionDetailCopy.materialReservationFailed;
  }
  if (Array.isArray(detail?.shortages) && detail.shortages.length > 0) {
    const shortages = detail.shortages.map(({ component_sku, needed, reserved }) =>
      productionDetailCopy.materialShortage(
        component_sku,
        numberFormat.format(needed),
        numberFormat.format(reserved),
      ),
    );
    return `${productionDetailCopy.materialShortages} ${shortages.join(". ")}.`;
  }

  const invalidStatus = message.match(/^Cannot (release|start|complete) order in ([\w-]+) status$/);
  if (invalidStatus) {
    const [, action, orderStatus] = invalidStatus;
    return productionDetailCopy.invalidStatus(
      productionDetailActions[action].error,
      productionOrderStatusLabel(orderStatus),
    );
  }
  if (message === "Order is in short status. Use the accept-short action to complete it.") {
    return productionDetailCopy.shortOrder;
  }
  const overQuantity = message.match(/^Total reported \(([\d.]+)\) exceeds ordered \(([\d.]+)\)$/);
  if (overQuantity) {
    return productionDetailCopy.overQuantity(numberFormat.format(overQuantity[1]), numberFormat.format(overQuantity[2]));
  }
  const shortCompletion = message.match(/^Completing short \(([\d.]+) of ([\d.]+) remaining\)\./);
  if (shortCompletion) {
    return productionDetailCopy.shortCompletion(numberFormat.format(shortCompletion[1]), numberFormat.format(shortCompletion[2]));
  }
  return fallback;
}
