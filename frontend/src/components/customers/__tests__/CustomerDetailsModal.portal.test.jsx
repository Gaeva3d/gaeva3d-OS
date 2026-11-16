import { act, cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import CustomerDetailsModal from "../CustomerDetailsModal";

const { flags } = vi.hoisted(() => ({ flags: { isPro: true } }));
vi.mock("../../../config/api", () => ({ API_URL: "" }));
vi.mock("../../../hooks/useFeatureFlags", () => ({ useFeatureFlags: () => flags }));
vi.mock("../../../hooks/useFormatCurrency", () => ({ useFormatCurrency: () => (value) => String(value) }));
const response = (data, status = 200) => ({ ok: status === 200, status, json: async () => data });
const detail = (name) => ({ has_portal_access: true, customer_organization_name: name });
const view = (id = 1) => <CustomerDetailsModal customer={{ id, full_name: `Cliente ${id}` }} onClose={() => {}} onEdit={() => {}} />;
const openPortal = async () => userEvent.click(screen.getByRole("tab", { name: "B2B Portal" }));
function mockReads(handler) {
  const fetch = vi.fn((url, init) => {
    if (handler) { const result = handler(url, init); if (result !== undefined) return result; }
    if (url.includes("portal-details")) return Promise.resolve(response(detail("ORG-1")));
    if (url.includes("by-customer")) return Promise.resolve(response({ assigned: [] }));
    return Promise.resolve(response([]));
  });
  vi.stubGlobal("fetch", fetch); return fetch;
}
beforeEach(() => { flags.isPro = true; });
afterEach(() => { cleanup(); vi.unstubAllGlobals(); });

describe("customer Portal context negative-read boundary, not a certified PRO schema", () => {
  it.each([401, 403, 404, 503])("never treats failed details HTTP%s as no portal configured", async (status) => {
    const fetch = mockReads((url) => url.includes("portal-details") ? Promise.resolve(response({ detail: "private account" }, status)) : undefined);
    render(view()); await openPortal();
    expect(await screen.findByRole("alert")).not.toHaveTextContent("private account");
    expect(screen.queryByText("Not Configured")).not.toBeInTheDocument();
    expect(screen.queryByText("No portal organization linked")).not.toBeInTheDocument();
    expect(fetch.mock.calls.some(([url]) => url.includes("catalogs"))).toBe(false);
    expect(fetch.mock.calls.every(([, init]) => !init.method)).toBe(true);
  });

  it.each([[null], [{}], [[]]])("does not infer no access from a missing or malformed details indicator", async (data) => {
    mockReads((url) => url.includes("portal-details") ? Promise.resolve(response(data)) : undefined);
    render(view()); await openPortal();
    await screen.findByRole("alert");
    expect(screen.queryByText("Not Configured")).not.toBeInTheDocument();
  });

  it("permits no-access presentation only from the existing client's explicit false indicator", async () => {
    mockReads((url) => url.includes("portal-details") ? Promise.resolve(response({ has_portal_access: false })) : undefined);
    render(view()); await openPortal();
    expect(await screen.findByText("Not Configured")).toBeInTheDocument();
    expect(screen.getByText("No portal organization linked")).toBeInTheDocument();
  });

  it("retries the details GET without mutation after unavailable read", async () => {
    let failed = true;
    const fetch = mockReads((url) => url.includes("portal-details") ? Promise.resolve(failed ? response({}, 404) : response(detail("ORG-RETRY"))) : undefined);
    render(view()); await openPortal(); await screen.findByRole("alert");
    failed = false; await userEvent.click(screen.getByRole("button", { name: "Tentar novamente" }));
    expect(await screen.findByText("Linked to organization: ORG-RETRY")).toBeInTheDocument();
    expect(fetch.mock.calls.every(([, init]) => !init.method)).toBe(true);
  });

  it("clears A immediately and ignores a late details response after choosing B", async () => {
    let finishA;
    mockReads((url) => url.includes("/1/portal-details") ? new Promise((resolve) => { finishA = resolve; })
      : url.includes("/2/portal-details") ? Promise.resolve(response(detail("ORG-B"))) : undefined);
    const { rerender } = render(view(1)); await openPortal();
    expect(screen.getByRole("status")).toHaveTextContent("Consultando dados");
    rerender(view(2));
    expect(await screen.findByText("Linked to organization: ORG-B")).toBeInTheDocument();
    await act(async () => { finishA(response(detail("ORG-A"))); });
    expect(screen.queryByText("Linked to organization: ORG-A")).not.toBeInTheDocument();
  });

  it("clears loaded organization/catalog projections while the next customer is pending", async () => {
    mockReads((url) => url.includes("/2/portal-details") ? new Promise(() => {})
      : url.includes("by-customer/1") ? Promise.resolve(response({ assigned: [{ id: 3, name: "PRIVATE-CATALOG-A" }] })) : undefined);
    const { rerender } = render(view(1)); await openPortal();
    await screen.findByText("PRIVATE-CATALOG-A");
    rerender(view(2));
    expect(screen.queryByText("PRIVATE-CATALOG-A")).not.toBeInTheDocument();
    expect(screen.queryByText("Linked to organization: ORG-1")).not.toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent("Consultando dados");
  });

  it.each(["price-levels", "by-customer"])("keeps failed %s read unavailable instead of inventing public/default catalogs", async (path) => {
    const fetch = mockReads((url) => url.includes(path) ? Promise.resolve(response({ detail: "private catalog" }, 403)) : undefined);
    render(view()); await openPortal();
    expect(await screen.findByRole("alert")).not.toHaveTextContent("private catalog");
    expect(screen.queryByText(/Only public catalogs visible/)).not.toBeInTheDocument();
    expect(screen.queryByText(/No price level assigned/)).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Remove" })).not.toBeInTheDocument();
    expect(fetch.mock.calls.every(([, init]) => !init.method)).toBe(true);
  });

  it.each(["price-levels", "by-customer"].flatMap((path) =>
    [42, "invalid", true, null, []].map((entry) => [path, entry])
  ))("rejects non-record %s entry %j without default/public claims", async (path, entry) => {
    const fetch = mockReads((url) => url.includes(path)
      ? Promise.resolve(response(path === "price-levels" ? [entry] : { assigned: [entry] }))
      : undefined);
    render(view()); await openPortal();
    await screen.findByRole("alert");
    expect(screen.queryByText(/Only public catalogs visible/)).not.toBeInTheDocument();
    expect(screen.queryByText(/No price level assigned/)).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Remove" })).not.toBeInTheDocument();
    expect(fetch.mock.calls.every(([, init]) => !init.method)).toBe(true);
  });

  it("retains the existing empty-array read presentation without a read error", async () => {
    const fetch = mockReads();
    render(view()); await openPortal();
    expect(await screen.findByText(/Only public catalogs visible/)).toBeInTheDocument();
    expect(screen.getByText(/No price level assigned/)).toBeInTheDocument();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    expect(fetch.mock.calls.every(([, init]) => !init.method)).toBe(true);
  });

  it("drops late catalog data after customer change and PRO withdrawal", async () => {
    let finishCatalog;
    const fetch = mockReads((url) => url.includes("by-customer/1") ? new Promise((resolve) => { finishCatalog = resolve; }) : undefined);
    const { rerender } = render(view()); await openPortal();
    await waitFor(() => expect(fetch.mock.calls.some(([url]) => url.includes("by-customer/1"))).toBe(true));
    flags.isPro = false; rerender(view());
    expect(screen.queryByRole("tab", { name: "B2B Portal" })).not.toBeInTheDocument();
    expect(screen.getByRole("tabpanel")).toHaveAccessibleName("Visão geral");
    await act(async () => { finishCatalog(response({ assigned: [{ id: 5, name: "PRIVATE-LATE" }] })); });
    flags.isPro = true; rerender(view(2));
    expect(screen.queryByText("PRIVATE-LATE")).not.toBeInTheDocument();
  });

  it("retries malformed catalog reads without presenting defaults or mutating assignments", async () => {
    let malformed = true;
    const fetch = mockReads((url) => url.includes("by-customer") ? Promise.resolve(response(malformed ? {} : { assigned: [] })) : undefined);
    render(view()); await openPortal(); await screen.findByRole("alert");
    expect(screen.queryByText(/Only public catalogs visible/)).not.toBeInTheDocument();
    malformed = false;
    await userEvent.click(screen.getByRole("button", { name: "Tentar novamente" }));
    expect(await screen.findByText("Linked to organization: ORG-1")).toBeInTheDocument();
    expect(fetch.mock.calls.every(([, init]) => !init.method)).toBe(true);
  });

  it("handles a network failure without asserting absence of portal access", async () => {
    mockReads((url) => url.includes("portal-details") ? Promise.reject(new TypeError("private network diagnostic")) : undefined);
    render(view()); await openPortal();
    expect(await screen.findByRole("alert")).not.toHaveTextContent("private network diagnostic");
    expect(screen.queryByText("Not Configured")).not.toBeInTheDocument();
  });
});
