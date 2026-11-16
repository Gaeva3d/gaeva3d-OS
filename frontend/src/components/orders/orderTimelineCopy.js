import { orderStatusLabel } from "./orderCopy.js";

export const orderTimelineCopy = Object.freeze({
  activityError: "Não foi possível carregar a atividade do pedido.",
  activityEmpty: "Nenhuma atividade registrada.",
  shippingError: "Não foi possível carregar o rastreamento do envio.",
  shippingEmpty: "Nenhum evento de envio registrado.",
  tracking: "Rastreio:",
  carrierApi: "API da transportadora",
  author: (name) => `Por ${name}`,
});

const activityTitles = Object.freeze({
  "Order created": "Pedido criado",
  "Order created from quote": "Pedido criado a partir da proposta",
  "Order confirmed": "Pedido confirmado",
  "Order cancelled": "Pedido cancelado",
  "Order rejected": "Pedido rejeitado",
  "Order closed short": "Pedido encerrado parcialmente",
  "Payment received": "Pagamento recebido",
  "Payment refunded": "Pagamento reembolsado",
  "Shipping address updated": "Endereço de entrega atualizado",
  "Shipping charge updated": "Frete atualizado",
  "Order shipped": "Pedido enviado",
  "Order delivered": "Pedido entregue",
});

const activityDescriptions = Object.freeze({
  "External order confirmed by operator": "Pedido externo confirmado pelo operador.",
});

export function activityTitle(event) {
  if (event.event_type === "note_added") return event.title;
  if (event.event_type === "status_change" && event.title?.startsWith("Status changed to ") && event.new_value) {
    return `Status alterado para ${orderStatusLabel(event.new_value)}`;
  }
  if (event.event_type === "status_change" && event.title?.startsWith("Payment status changed to ") && event.new_value) {
    return `Status do pagamento alterado para ${orderStatusLabel(event.new_value)}`;
  }
  const workOrders = event.event_type === "production_started" && /^Created (\d+) work order\(s\)$/.exec(event.title);
  if (workOrders) {
    const count = Number(workOrders[1]);
    return count === 1 ? "1 ordem de produção criada" : `${count} ordens de produção criadas`;
  }
  return Object.hasOwn(activityTitles, event.title) ? activityTitles[event.title] : event.title;
}

export function activityDescription(event) {
  if (event.event_type === "note_added") return event.description;
  if (event.event_type === "shipped" && event.title === "Order shipped" && event.description?.startsWith("Shipped via ")) {
    return `Enviado por ${event.description.slice("Shipped via ".length)}`;
  }
  if (event.event_type === "production_started" && event.description?.startsWith("Work orders: ")) {
    return `Ordens de produção: ${event.description.slice("Work orders: ".length)}`;
  }
  return Object.hasOwn(activityDescriptions, event.description)
    ? activityDescriptions[event.description]
    : event.description;
}

export function activityValue(event, value) {
  return event.event_type === "status_change" ? orderStatusLabel(value) : value;
}

function isSystemShippingLabel(event) {
  return event.event_type === "label_purchased" && event.title === "Shipping Label Created";
}

export function shippingTitle(event) {
  return isSystemShippingLabel(event) ? "Etiqueta de envio criada" : event.title;
}

export function shippingDescription(event) {
  if (!isSystemShippingLabel(event) || !event.description?.startsWith("Carrier: ")) return event.description;
  return event.description.replace(/^Carrier: /, "Transportadora: ").replace(", Service: ", ", Serviço: ");
}
