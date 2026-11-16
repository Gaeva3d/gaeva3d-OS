import { act, cleanup, renderHook } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { useCRUD } from "../useCRUD";
const { api } = vi.hoisted(() => ({ api: { get: vi.fn(), post: vi.fn(), patch: vi.fn(), del: vi.fn() } }));
vi.mock("../useApi", () => ({ useApi: () => api }));
afterEach(() => { cleanup(); vi.clearAllMocks(); });

it("keeps loading for the newest opted-in read when an older read finishes first", async () => {
  let finishOld, finishNew;
  api.get.mockImplementationOnce(() => new Promise((done) => { finishOld = done; })).mockImplementationOnce(() => new Promise((done) => { finishNew = done; }));
  const { result } = renderHook(() => useCRUD("/customers", { immediate: false, latestReadOnly: true }));
  let old, current;
  act(() => { old = result.current.fetchAll({ status: "active" }); current = result.current.fetchAll(); });
  await act(async () => { finishOld([{ id: 1 }]); await old; });
  expect(result.current.loading).toBe(true);
  expect(result.current.items).toEqual([]);
  await act(async () => { finishNew([{ id: 2 }]); await current; });
  expect(result.current.items).toEqual([{ id: 2 }]);
  expect(result.current.loading).toBe(false);
});

it("preserves existing mutation argument forwarding independently of the read-only option", async () => {
  const created = { id: 3 }; api.post.mockResolvedValue(created);
  const { result } = renderHook(() => useCRUD("/customers", { immediate: false, latestReadOnly: true }));
  expect(await result.current.create({ name: "example" })).toBe(created);
  await result.current.update(3, { name: "edited" }, "patch");
  await result.current.remove(3);
  expect(api.post).toHaveBeenCalledExactlyOnceWith("/customers", { name: "example" });
  expect(api.patch).toHaveBeenCalledExactlyOnceWith("/customers/3", { name: "edited" });
  expect(api.del).toHaveBeenCalledExactlyOnceWith("/customers/3");
  expect(api.get).not.toHaveBeenCalled();
});
