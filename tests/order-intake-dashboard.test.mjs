import assert from "node:assert/strict";
import test from "node:test";
import {
  NEW_ORDER_PRODUCTS,
  NEW_ORDER_PAYMENTS,
  buildNewOrderInput,
  validateOrderDraft,
} from "../src/lib/gaeva/new-order.ts";
import {
  dashboardRange,
  inDateRange,
  describeActivity,
  rangeLastDay,
} from "../src/lib/gaeva/dashboard-helpers.ts";
import { PRODUCT_TO_DB, PAYMENT_TO_DB } from "../src/lib/gaeva/supabase-mappers.ts";
import { needsPrinter } from "../src/lib/gaeva/helpers.ts";

const draft = {
  product: "corporativo",
  quantity: 1,
  dimensions: "",
  finishing: "",
  purpose: "",
  event_date: "",
  due_date: "2026-09-10",
  value: "",
  down_payment: "",
  payment_status: "faturado",
  commercial_notes: "",
};
const event = {
  id: "1",
  entity: "orders",
  entity_id: "order-id",
  field: "INSERT",
  old_value: null,
  new_value: JSON.stringify({ code: "GAE-2026-0001" }),
  author: "Equipe",
  created_at: "2026-09-07T22:00:00Z",
  updated_at: "2026-09-07T22:00:00Z",
};

test("missing printer list applies only to orders ready for or undergoing printing", () => {
  for (const status of ["aprovado_produzir", "fila_impressao", "imprimindo"]) {
    assert.equal(needsPrinter({ status, printer_id: null }), true);
    assert.equal(needsPrinter({ status, printer_id: "existing-printer" }), false);
  }
  for (const status of [
    "recebido",
    "briefing_pendente",
    "em_modelagem",
    "revisao_interna",
    "aguardando_aprovacao",
    "acabamento",
    "controle_qualidade",
    "embalagem",
    "expedicao",
    "concluido",
    "cancelado",
    "bloqueado",
  ]) {
    assert.equal(needsPrinter({ status, printer_id: null }), false);
  }
});

test("new intake uses the requested categories and payments with distinct database values", () => {
  assert.deepEqual(NEW_ORDER_PRODUCTS, [
    "corporativo",
    "chaveiro",
    "pet_personalizado",
    "estatueta",
    "outro",
  ]);
  assert.deepEqual(NEW_ORDER_PAYMENTS, ["pago", "entrada_paga", "faturado"]);
  assert.equal(PRODUCT_TO_DB.estatueta, "statuette");
  assert.equal(PRODUCT_TO_DB.corporativo, "corporate");
  assert.equal(PRODUCT_TO_DB.chaveiro, "keychain");
  assert.equal(PAYMENT_TO_DB.faturado, "invoiced");
});

test("submission needs no project name, production form, or briefing confirmation", () => {
  const input = buildNewOrderInput(
    draft,
    "customer-id",
    "Cliente Teste",
    null,
    "  Descrição e referências  ",
  );
  assert.equal(input.project_name, "Corporativo · Cliente Teste");
  assert.equal(input.status, "recebido");
  assert.equal(input.priority, "normal");
  assert.equal(input.owner_id, null);
  assert.equal(input.printer_id, null);
  assert.equal(input.briefing, "Descrição e referências");
  assert.equal(input.references_notes, null);
  assert.equal(input.rights_notes, null);
  assert.equal(input.value, 0);
  assert.equal(input.down_payment, 0);
});

test("event date is saved only for corporate orders, with deadline validation", () => {
  assert.ok(validateOrderDraft({ ...draft, event_date: "2026-09-09" }).event_date);
  const input = buildNewOrderInput(
    { ...draft, product: "pet_personalizado", event_date: "2026-09-09" },
    "c",
    "Cliente",
    "member",
    "",
  );
  assert.equal(input.event_date, null);
  assert.equal(input.owner_id, "member");
  assert.equal(
    buildNewOrderInput({ ...draft, event_date: "2026-09-11" }, "c", "Cliente", null, "").event_date,
    "2026-09-11",
  );
});

test("amounts accept cents and reject excess deposit or invalid quantity/date/payment", () => {
  const valid = {
    ...draft,
    value: "397.50",
    down_payment: "100.25",
    payment_status: "entrada_paga",
  };
  assert.deepEqual(validateOrderDraft(valid), {});
  assert.equal(buildNewOrderInput(valid, "c", "Cliente", null, "").down_payment, 100.25);
  assert.ok(validateOrderDraft({ ...draft, value: "10", down_payment: "11" }).down_payment);
  assert.ok(validateOrderDraft({ ...draft, quantity: 1.5 }).quantity);
  assert.ok(validateOrderDraft({ ...draft, due_date: "2026-02-30" }).due_date);
  assert.ok(validateOrderDraft({ ...draft, payment_status: "" }).payment_status);
});

test("day month and year ranges handle leap days, year rollover, and Brazilian midnight", () => {
  assert.deepEqual(dashboardRange("dia", "2024-02-29"), { start: "2024-02-29", end: "2024-03-01" });
  assert.deepEqual(dashboardRange("mes", "2026-12-08"), { start: "2026-12-01", end: "2027-01-01" });
  assert.deepEqual(dashboardRange("ano", "2026-09-07"), { start: "2026-01-01", end: "2027-01-01" });
  assert.equal(inDateRange("2026-09-08T02:59:59Z", "2026-09-07", "2026-09-08"), true);
  assert.equal(inDateRange("2026-09-08T03:00:00Z", "2026-09-07", "2026-09-08"), false);
  assert.equal(inDateRange("invalid", "2026-09-07", "2026-09-08"), false);
  assert.equal(rangeLastDay("2024-03-01"), "2024-02-29");
});

test("activities show readable actions, preserve order links, and tolerate malformed data", () => {
  const orders = [{ id: "order-id", code: "GAE-2026-0001" }];
  const insert = describeActivity(event, orders);
  assert.equal(insert.text, "cadastrou o pedido GAE-2026-0001");
  assert.equal(insert.orderId, "order-id");
  const update = describeActivity(
    {
      ...event,
      field: "UPDATE",
      old_value: JSON.stringify({ code: "GAE-2026-0001", status: "received" }),
      new_value: JSON.stringify({ code: "GAE-2026-0001", status: "modeling" }),
    },
    orders,
  );
  assert.match(update.text, /Pedido recebido para Em modelagem/);
  assert.doesNotMatch(update.text, /[{}]|updated_at/);
  const file = describeActivity(
    {
      ...event,
      entity: "order_files",
      new_value: JSON.stringify({ file_name: "referencia.jpg", order_id: "order-id" }),
    },
    orders,
  );
  assert.equal(file.orderId, "order-id");
  assert.match(file.text, /referencia.jpg do pedido GAE-2026-0001/);
  assert.doesNotThrow(() =>
    describeActivity({ ...event, field: "UPDATE", new_value: "invalid JSON" }, orders),
  );
});
