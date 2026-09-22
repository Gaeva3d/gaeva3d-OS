import { PRODUCT_LABELS, type ProductCategory, type PaymentStatus } from "./types.ts";
import type { NewOrderInput } from "./store";

export const NEW_ORDER_PRODUCTS = [
  "corporativo",
  "chaveiro",
  "pet_personalizado",
  "estatueta",
  "outro",
] as const satisfies readonly ProductCategory[];

export const NEW_ORDER_PAYMENTS = [
  "pago",
  "entrada_paga",
  "faturado",
] as const satisfies readonly PaymentStatus[];

export interface NewOrderDraft {
  product: (typeof NEW_ORDER_PRODUCTS)[number];
  quantity: number;
  dimensions: string;
  finishing: string;
  purpose: string;
  event_date: string;
  due_date: string;
  value: string;
  down_payment: string;
  payment_status: (typeof NEW_ORDER_PAYMENTS)[number] | "";
  commercial_notes: string;
}

function validDate(value: string) {
  return (
    /^\d{4}-\d{2}-\d{2}$/.test(value) &&
    !Number.isNaN(Date.parse(value)) &&
    new Date(value).toISOString().slice(0, 10) === value
  );
}

export function validateOrderDraft(order: NewOrderDraft) {
  const errors: Record<string, string> = {};
  if (!NEW_ORDER_PRODUCTS.includes(order.product)) errors["product"] = "Selecione a categoria.";
  if (!Number.isInteger(order.quantity) || order.quantity < 1)
    errors["quantity"] = "Quantidade deve ser um número inteiro de ao menos 1.";
  if (!validDate(order.due_date)) errors["due_date"] = "Informe o prazo prometido.";
  const total = Number(order.value);
  const deposit = Number(order.down_payment);
  if (!Number.isFinite(total) || total < 0) errors["value"] = "Informe um valor válido.";
  if (!Number.isFinite(deposit) || deposit < 0)
    errors["down_payment"] = "Informe uma entrada válida.";
  else if (deposit > total)
    errors["down_payment"] = "A entrada não pode superar o valor do pedido.";
  if (!order.payment_status) errors["payment_status"] = "Selecione o status do pagamento.";
  if (order.product === "corporativo" && order.event_date) {
    if (!validDate(order.event_date)) errors["event_date"] = "Informe uma data válida.";
    else if (order.due_date > order.event_date)
      errors["event_date"] = "O prazo prometido deve ser até a data do evento.";
  }
  return errors;
}

export function buildNewOrderInput(
  order: NewOrderDraft,
  customerId: string,
  customerName: string,
  ownerId: string | null,
  description: string,
): NewOrderInput {
  const errors = validateOrderDraft(order);
  if (Object.keys(errors).length) throw new Error(Object.values(errors)[0]);
  return {
    customer_id: customerId,
    product: order.product,
    project_name: `${PRODUCT_LABELS[order.product]} · ${customerName.trim()}`,
    quantity: order.quantity,
    dimensions: order.dimensions.trim() || null,
    material: null,
    colors: null,
    finishing: order.finishing.trim() || null,
    purpose: order.purpose.trim() || null,
    event_date: order.product === "corporativo" ? order.event_date || null : null,
    due_date: order.due_date,
    status: "recebido",
    priority: "normal",
    urgency_reason: null,
    blocked_reason: null,
    owner_id: ownerId,
    printer_id: null,
    estimated_hours: null,
    estimated_material: null,
    internal_notes: null,
    commercial_notes: order.commercial_notes.trim() || null,
    briefing: description.trim() || null,
    references_notes: null,
    rights_notes: null,
    briefing_complete: false,
    value: Number(order.value),
    down_payment: Number(order.down_payment),
    payment_status: order.payment_status as (typeof NEW_ORDER_PAYMENTS)[number],
    approval_version: null,
    approval_notes: null,
  };
}
