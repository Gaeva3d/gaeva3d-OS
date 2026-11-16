import { act, cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import AdminNotifications from "../AdminNotifications";

const { mocks } = vi.hoisted(() => ({ mocks: { api: { get: vi.fn(), post: vi.fn() }, toast: { error: vi.fn(), success: vi.fn() } } }));
vi.mock("../../../hooks/useApi", () => ({ useApi: () => mocks.api }));
vi.mock("../../../components/Toast", () => ({ useToast: () => mocks.toast }));
vi.mock("../../../hooks/useFeatureFlags", () => ({ useFeatureFlags: () => ({ isPro: false }) }));
const threads = ["A", "B"].map((id) => ({ thread_id: id, thread_subject: `Conversa ${id}`, unread_count: 0, message_count: 1, last_message_at: "2026-11-16T07:00:00Z" }));
const messages = (id) => [{ id: id === "A" ? 1 : 2, thread_id: id, body: `Mensagem ${id}`, created_at: "2026-11-16T07:00:00Z", sender_type: "customer" }];
const view = () => render(<MemoryRouter><AdminNotifications /></MemoryRouter>);
const select = async (id) => userEvent.click(await screen.findByRole("button", { name: new RegExp(`Conversa ${id}`) }));
beforeEach(() => {
  vi.clearAllMocks();
  mocks.api.get.mockImplementation((url) => Promise.resolve(url.includes("?") ? threads : messages(url.endsWith("/A") ? "A" : "B")));
  mocks.api.post.mockResolvedValue({});
});
afterEach(cleanup);

describe("legacy notification inbox context (not the Commercial chat adapter)", () => {
  it("clears previous messages during selection and ignores a late response", async () => {
    let finishA;
    mocks.api.get.mockImplementation((url) => url.includes("?") ? Promise.resolve(threads)
      : url.endsWith("/A") ? new Promise((resolve) => { finishA = resolve; }) : Promise.resolve(messages("B")));
    view(); await select("A");
    expect(screen.getByRole("status")).toHaveTextContent("Carregando mensagens");
    await select("B"); await screen.findByText("Mensagem B");
    await act(async () => { finishA(messages("A")); });
    expect(screen.queryByText("Mensagem A")).not.toBeInTheDocument();
    expect(screen.getByText("Mensagem B")).toBeInTheDocument();
    expect(mocks.api.post).not.toHaveBeenCalled();
  });

  it("preserves a separate draft for each existing thread", async () => {
    view(); await select("A"); await screen.findByText("Mensagem A");
    await userEvent.type(screen.getByRole("textbox", { name: "Rascunho de resposta" }), "Rascunho A");
    await select("B"); await screen.findByText("Mensagem B");
    expect(screen.getByRole("textbox", { name: "Rascunho de resposta" })).toHaveValue("");
    await userEvent.type(screen.getByRole("textbox", { name: "Rascunho de resposta" }), "Rascunho B");
    await select("A"); await screen.findByText("Mensagem A");
    expect(screen.getByRole("textbox", { name: "Rascunho de resposta" })).toHaveValue("Rascunho A");
    expect(mocks.api.post).not.toHaveBeenCalled();
  });

  it.each([[], [{}], [[]], messages("B")].map((data) => [data]))("distinguishes a confirmed empty thread from malformed or mismatched messages", async (data) => {
    mocks.api.get.mockImplementation((url) => Promise.resolve(url.includes("?") ? threads : data));
    view(); await select("A");
    if (data.length === 0) expect(await screen.findByText("Nenhuma mensagem nesta conversa.")).toBeInTheDocument();
    else {
      expect(await screen.findByRole("alert")).toHaveTextContent("Conversa indisponível");
      expect(screen.queryByText("Mensagem B")).not.toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Enviar" })).toBeDisabled();
    }
  });

  it("preserves the draft after denied history and disables sending until a successful read retry", async () => {
    let failed = false;
    mocks.api.get.mockImplementation((url) => url.includes("?") ? Promise.resolve(threads)
      : failed ? Promise.reject(new Error("403 private payload")) : Promise.resolve(messages("A")));
    view(); await select("A"); await screen.findByText("Mensagem A");
    await userEvent.type(screen.getByRole("textbox", { name: "Rascunho de resposta" }), "Não apagar");
    failed = true; await select("A");
    expect(await screen.findByRole("alert")).not.toHaveTextContent("private payload");
    expect(screen.queryByText("Mensagem A")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Enviar" })).toBeDisabled();
    failed = false; await userEvent.click(screen.getByRole("button", { name: "Tentar novamente" }));
    await screen.findByText("Mensagem A");
    expect(screen.getByRole("textbox", { name: "Rascunho de resposta" })).toHaveValue("Não apagar");
    expect(mocks.api.post).not.toHaveBeenCalled();
  });

  it("does not show list failure as an empty inbox", async () => {
    mocks.api.get.mockRejectedValue(new Error("private list"));
    view();
    expect(await screen.findByRole("alert")).toHaveTextContent("Não foi possível carregar as notificações");
    expect(screen.queryByText("Nenhuma mensagem por enquanto")).not.toBeInTheDocument();
  });

  it("retains a new draft typed while a prior mock reply is pending and never loads it into another thread", async () => {
    let finishSend;
    mocks.api.post.mockImplementation(() => new Promise((resolve) => { finishSend = resolve; }));
    view(); await select("A"); await screen.findByText("Mensagem A");
    await userEvent.type(screen.getByRole("textbox", { name: "Rascunho de resposta" }), "Texto A");
    await userEvent.click(screen.getByRole("button", { name: "Enviar" }));
    await select("B"); await screen.findByText("Mensagem B");
    await userEvent.type(screen.getByRole("textbox", { name: "Rascunho de resposta" }), "Texto B");
    await act(async () => { finishSend({}); });
    expect(screen.getByRole("textbox", { name: "Rascunho de resposta" })).toHaveValue("Texto B");
    expect(screen.getByText("Mensagem B")).toBeInTheDocument();
    expect(mocks.api.post).toHaveBeenCalledExactlyOnceWith("/api/v1/notifications/A/reply", { body: "Texto A" });
    await waitFor(() => expect(screen.getByRole("button", { name: "Enviar" })).toBeEnabled());
  });
});
