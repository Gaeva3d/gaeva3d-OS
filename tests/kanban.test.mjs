import assert from "node:assert/strict";
import test from "node:test";
import {
  STAGES,
  STATUS_STAGE,
  EMPTY_FILTERS,
  elapsed,
  compareOperationalOrders,
  matchesBoardFilters,
  allowedDestinations,
  needsMyAction,
  exceedsStageSla,
  daysToDeadline,
} from "../src/lib/gaeva/kanban.ts";
const now = new Date("2026-09-08T01:00:00Z"); // Still September 7 in São Paulo.
const base = {
  id: "a",
  status: "modeling",
  stage: "design",
  priority: "normal",
  promised_at: "2026-09-10",
  created_at: "2026-09-01T10:00:00Z",
  stage_entered_at: "2026-09-07T00:00:00Z",
  customer_name: "João Silva",
  customer_phone: "(11) 99999-8888",
  code: "GAE-1048",
  project_name: "Pet",
  category: "custom_pet",
  assigned_to: "p",
  designer_id: "d",
  created_by: "seller",
};
test("all existing operational statuses map to exactly one of eight columns", () => {
  assert.equal(STAGES.length, 8);
  assert.equal(STATUS_STAGE["approved_for_production"], "printing");
  for (const s of ["finishing", "quality_control", "packaging"])
    assert.equal(STATUS_STAGE[s], "ready");
  for (const [status, stage] of Object.entries(STATUS_STAGE))
    if (!["cancelled", "blocked"].includes(status)) assert.ok(STAGES.some((s) => s.id === stage));
});
test("overdue orders win over urgency and age, without losing high priority", () => {
  const old = { ...base, id: "old", stage_entered_at: "2026-08-01T00:00:00Z" };
  const urgent = { ...base, id: "urgent", priority: "urgent" };
  const late = { ...base, id: "late", promised_at: "2026-09-06" };
  const near = { ...base, id: "near", promised_at: "2026-09-08" };
  const normal = { ...old, promised_at: "2026-09-30" };
  assert.deepEqual(
    [normal, near, urgent, late]
      .sort((a, b) => compareOperationalOrders(a, b, now))
      .map((o) => o.id),
    ["late", "urgent", "near", "old"],
  );
});
test("date-only promised dates use the Brazilian operation day", () => {
  assert.equal(daysToDeadline({ ...base, promised_at: "2026-09-07" }, now), 0);
  assert.equal(daysToDeadline({ ...base, promised_at: "2026-09-06" }, now), -1);
});
test("stage age derives from timestamps, handles future dates and optional SLA", () => {
  assert.equal(elapsed("2026-09-08T00:40:00Z", now), "20 min");
  assert.equal(elapsed("2026-09-07T22:00:00Z", now), "3h");
  assert.equal(elapsed("2026-09-06T01:00:00Z", now), "2 dias");
  assert.equal(elapsed("2026-09-09T01:00:00Z", now), "0 min");
  assert.equal(exceedsStageSla(base, {}, now), false);
  assert.equal(exceedsStageSla(base, { design: 12 }, now), true);
});
test("combined filters normalize accented names and formatted phone numbers", () => {
  const identity = { role: "admin", memberId: "a", userId: "u" };
  assert.equal(
    matchesBoardFilters(
      base,
      { ...EMPTY_FILTERS, query: "joao", designer: "d", stage: "design" },
      identity,
      now,
    ),
    true,
  );
  assert.equal(
    matchesBoardFilters(base, { ...EMPTY_FILTERS, query: "11999998888" }, identity, now),
    true,
  );
  assert.equal(
    matchesBoardFilters(
      base,
      { ...EMPTY_FILTERS, query: "João", designer: "another" },
      identity,
      now,
    ),
    false,
  );
});
test("my orders are actionable assignments and completed orders are excluded", () => {
  assert.equal(needsMyAction(base, "designer", "user", "d"), true);
  assert.equal(needsMyAction({ ...base, stage: "approval" }, "designer", "user", "d"), false);
  assert.equal(needsMyAction({ ...base, stage: "printing" }, "producao", "user", "p"), true);
  assert.equal(needsMyAction({ ...base, status: "completed" }, "admin", "user", "a"), false);
});
test("role-based destinations permit required returns and administrator exceptions", () => {
  assert.deepEqual(allowedDestinations(base, "designer", "d"), ["approval"]);
  assert.deepEqual(allowedDestinations(base, "designer", "someone"), []);
  assert.deepEqual(allowedDestinations({ ...base, stage: "approval" }, "comercial", "p"), [
    "design",
    "printing",
  ]);
  assert.deepEqual(allowedDestinations({ ...base, stage: "approval" }, "producao", "p"), []);
  assert.equal(allowedDestinations(base, "admin", "a").length, 7);
  assert.deepEqual(allowedDestinations(base, "visualizacao", "v"), []);
});

test("designer follows assigned pending approvals in My orders without approval permission", () => {
  const identity = { role: "designer", memberId: "d", userId: "designer-user" };
  const pending = { ...base, status: "awaiting_customer_approval", stage: "approval" };
  const filters = { ...EMPTY_FILTERS, quick: "mine" };
  assert.equal(matchesBoardFilters(base, filters, identity, now), true);
  assert.equal(matchesBoardFilters(pending, filters, identity, now), true);
  assert.equal(needsMyAction(pending, "designer", identity.userId, identity.memberId), false);
  assert.deepEqual(allowedDestinations(pending, "designer", "d"), []);
  for (const excluded of [
    { ...pending, designer_id: "another" },
    { ...pending, designer_id: null },
    { ...pending, status: "completed" },
    { ...pending, status: "cancelled" },
    { ...base, stage: "printing", status: "print_queue" },
  ])
    assert.equal(matchesBoardFilters(excluded, filters, identity, now), false);
  assert.equal(matchesBoardFilters(pending, { ...filters, stage: "design" }, identity, now), false);
});

test("revisions remain in the designer work list and other roles keep their existing scope", () => {
  const revision = { ...base, revision_count: 2 };
  assert.equal(
    matchesBoardFilters(
      revision,
      { ...EMPTY_FILTERS, quick: "mine" },
      { role: "designer", memberId: "d", userId: "designer-user" },
      now,
    ),
    true,
  );
  const pending = { ...base, status: "awaiting_customer_approval", stage: "approval" };
  const filters = { ...EMPTY_FILTERS, quick: "mine" };
  assert.equal(
    matchesBoardFilters(
      pending,
      filters,
      { role: "comercial", memberId: "sales-member", userId: "seller" },
      now,
    ),
    true,
  );
  assert.equal(
    matchesBoardFilters(
      pending,
      filters,
      { role: "comercial", memberId: "sales-member", userId: "another" },
      now,
    ),
    false,
  );
  assert.equal(
    matchesBoardFilters(
      pending,
      filters,
      { role: "producao", memberId: "p", userId: "production-user" },
      now,
    ),
    false,
  );
  assert.equal(
    matchesBoardFilters(
      pending,
      filters,
      { role: "visualizacao", memberId: "d", userId: "viewer" },
      now,
    ),
    false,
  );
});
