import { act, cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import AdminAccessRequests from "../AdminAccessRequests";

const { mocks } = vi.hoisted(() => ({ mocks: { api: { get: vi.fn(), post: vi.fn() }, toast: { error: vi.fn(), success: vi.fn() }, flags: { isPro: true, loading: false } } }));
vi.mock("../../../hooks/useApi", () => ({ useApi: () => mocks.api }));
vi.mock("../../../components/Toast", () => ({ useToast: () => mocks.toast }));
vi.mock("../../../hooks/useFeatureFlags", () => ({ useFeatureFlags: () => mocks.flags }));
// Existing client fields only, synthetic. This is not a certified PRO schema.
const record = (name, status = "pending") => ({ id: name, business_name: name, status, contact_name: "Contato de teste", contact_email: "test@example.test", created_at: "2026-11-16T07:00:00Z" });
beforeEach(() => { vi.clearAllMocks(); mocks.flags = { isPro: true, loading: false }; mocks.api.get.mockResolvedValue([]); });
afterEach(cleanup);

describe("existing Portal client negative availability boundary", () => {
  it.each([401, 403, 404, 503])("does not turn HTTP%s into confirmed empty or offer invitation commands", async (status) => {
    mocks.api.get.mockRejectedValue(Object.assign(new Error("private license or account details"), { status }));
    render(<AdminAccessRequests />);
    const alert = await screen.findByRole("alert");
    expect(alert).not.toHaveTextContent("private license or account details");
    expect(screen.queryByText("No pending access requests")).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Approve" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Resend Invite" })).not.toBeInTheDocument();
    if (status === 404) expect(alert).toHaveTextContent("não está disponível neste sistema");
    if (status === 403) expect(alert).toHaveTextContent("não tem permissão");
    expect(mocks.api.post).not.toHaveBeenCalled();
  });

  it("retries only the existing read endpoint and shows empty only after successful response", async () => {
    mocks.api.get.mockRejectedValueOnce(new Error("network")).mockResolvedValueOnce([]);
    render(<AdminAccessRequests />);
    await screen.findByRole("alert");
    await userEvent.click(screen.getByRole("button", { name: "Tentar novamente" }));
    expect(await screen.findByText("No pending access requests")).toBeInTheDocument();
    expect(mocks.api.get.mock.calls).toEqual([["/api/v1/pro/portal/admin/access-requests?status=pending"], ["/api/v1/pro/portal/admin/access-requests?status=pending"]]);
    expect(mocks.api.post).not.toHaveBeenCalled();
  });

  it.each([[{}], [[[]]], [[{}]], [[{ id: {} }]], [[{ id: "" }]]])("rejects a malformed list instead of rendering phantom requests", async (data) => {
    mocks.api.get.mockResolvedValue(data);
    render(<AdminAccessRequests />);
    await screen.findByRole("alert");
    expect(screen.queryByText("No pending access requests")).not.toBeInTheDocument();
    expect(mocks.api.post).not.toHaveBeenCalled();
  });

  it("clears private cards and their actions when the next filter read fails", async () => {
    mocks.api.get.mockResolvedValueOnce([record("PRIVATE-OLD")]).mockRejectedValue(new Error("403"));
    render(<AdminAccessRequests />);
    await screen.findByText("PRIVATE-OLD");
    expect(screen.getByRole("button", { name: "Approve" })).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Approved" }));
    await screen.findByRole("alert");
    expect(screen.queryByText("PRIVATE-OLD")).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Approve" })).not.toBeInTheDocument();
    expect(mocks.api.post).not.toHaveBeenCalled();
  });

  it("ignores stale records from a superseded filter", async () => {
    let resolvePending;
    mocks.api.get.mockImplementation((url) => url.endsWith("status=pending") ? new Promise((resolve) => { resolvePending = resolve; }) : Promise.resolve([]));
    render(<AdminAccessRequests />);
    expect(screen.getByRole("status")).toHaveTextContent("Consultando solicitações");
    await userEvent.click(screen.getByRole("button", { name: "Approved" }));
    await screen.findByText("No approved access requests");
    await act(async () => { resolvePending([record("STALE")]); });
    expect(screen.queryByText("STALE")).not.toBeInTheDocument();
    expect(mocks.api.post).not.toHaveBeenCalled();
  });

  it("makes no PRO request while flags load or PRO is absent", async () => {
    mocks.flags = { isPro: false, loading: true };
    const { rerender } = render(<AdminAccessRequests />);
    expect(screen.getByRole("status")).toHaveTextContent("Consultando disponibilidade");
    expect(mocks.api.get).not.toHaveBeenCalled();
    mocks.flags = { isPro: false, loading: false }; rerender(<AdminAccessRequests />);
    expect(await screen.findByText("PRO Feature")).toBeInTheDocument();
    expect(mocks.api.get).not.toHaveBeenCalled();
  });

  it("discards a response that arrives after PRO access is withdrawn", async () => {
    let resolve;
    mocks.api.get.mockImplementation(() => new Promise((done) => { resolve = done; }));
    const { rerender } = render(<AdminAccessRequests />);
    await waitFor(() => expect(mocks.api.get).toHaveBeenCalledTimes(1));
    mocks.flags = { isPro: false, loading: false }; rerender(<AdminAccessRequests />);
    await act(async () => { resolve([record("PRIVATE-LATE")]); });
    expect(screen.queryByText("PRIVATE-LATE")).not.toBeInTheDocument();
    mocks.flags = { isPro: true, loading: false }; rerender(<AdminAccessRequests />);
    expect(screen.queryByText("PRIVATE-LATE")).not.toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent("Consultando solicitações");
  });
});
