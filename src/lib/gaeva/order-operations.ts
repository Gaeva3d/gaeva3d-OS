import { useQuery, useQueryClient, type QueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { requireSupabase } from "@/integrations/supabase/client";
import type { Json, Tables } from "@/integrations/supabase/types";
import type { OperationalOrder } from "./kanban";

export type OrderAction =
  | "move"
  | "assume"
  | "confirm"
  | "missing"
  | "assign_designer"
  | "start_modeling"
  | "send_approval"
  | "approve"
  | "request_changes"
  | "start_print"
  | "fail_print"
  | "complete_print"
  | "quality"
  | "pack"
  | "release"
  | "shipping_details"
  | "ship"
  | "finish"
  | "assign_owner"
  | "priority"
  | "note";

// Only the lightweight operational projection. Briefings, files and timeline are loaded on open.
const SUMMARY_COLUMNS =
  "id,code,customer_id,category,project_name,quantity,status,priority,promised_at,event_date,total_value,payment_status,assigned_to,initial_printer_id,created_by,created_at,updated_at,deleted_at,block_reason,briefing_complete,urgency_reason,shipped_at,tracking_code,customer_name,customer_phone,city,state,seller_name,owner_name,designer_id,designer_name,stage,stage_entered_at,revision_count,approval_version,approval_status,approval_sent_at,job_status,print_failure_reason,modeling_started_at,thumbnail_path,thumbnail_bucket" as const;
export const operationalKey = (userId: string, finished: boolean) =>
  ["orders", "operational", userId, finished] as const;

export async function fetchOperationalOrders(finished: boolean, signal?: AbortSignal) {
  const rows: OperationalOrder[] = [];
  // Explicit pagination avoids Supabase's default 1000-row cap. Closed orders remain opt-in.
  for (let offset = 0; ; offset += 250) {
    let query = requireSupabase()
      .from("order_operational_summary")
      .select(SUMMARY_COLUMNS)
      .neq("status", "cancelled")
      .order("id")
      .range(offset, offset + 249);
    if (!finished) query = query.neq("status", "completed");
    if (signal) query = query.abortSignal(signal);
    const result = await query;
    if (result.error) throw result.error;
    rows.push(...result.data);
    if (result.data.length < 250)
      return [...new Map(rows.map((order) => [order.id, order])).values()];
  }
}

const refreshVersions = new WeakMap<QueryClient, Map<string, number>>();
export async function refreshOperationalOrder(cache: QueryClient, id: string) {
  const versions = refreshVersions.get(cache) ?? new Map<string, number>();
  refreshVersions.set(cache, versions);
  const version = (versions.get(id) ?? 0) + 1;
  versions.set(id, version);
  const { data, error } = await requireSupabase()
    .from("order_operational_summary")
    .select(SUMMARY_COLUMNS)
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  if (versions.get(id) !== version) return;
  cache.setQueriesData<OperationalOrder[]>({ queryKey: ["orders", "operational"] }, (old) => {
    if (!old) return old;
    return data ? [...old.filter((o) => o.id !== id), data] : old.filter((o) => o.id !== id);
  });
  // Active caches must drop a card as soon as it is finalized; finished caches retain it.
  for (const query of cache.getQueryCache().findAll({ queryKey: ["orders", "operational"] })) {
    if (query.queryKey[3] === false)
      cache.setQueryData<OperationalOrder[]>(query.queryKey, (old) =>
        old?.filter((o) => o.status !== "completed" && o.status !== "cancelled"),
      );
    else
      cache.setQueryData<OperationalOrder[]>(query.queryKey, (old) =>
        old?.filter((o) => o.status !== "cancelled"),
      );
  }
  await cache.invalidateQueries({ queryKey: ["orders", "detail", id] });
  await cache.invalidateQueries({ queryKey: ["orders", "history", id] });
}

export async function operateOrder(
  order: Pick<OperationalOrder, "id" | "updated_at">,
  action: OrderAction,
  payload: Json = {},
) {
  const { data, error } = await requireSupabase().rpc("operate_order", {
    p_order_id: order.id,
    p_action: action,
    p_expected_updated_at: order.updated_at,
    p_payload: payload,
  });
  if (error) throw error;
  return data as unknown as Tables<"orders">;
}

export function useOperationalOrders(userId: string, finished: boolean) {
  const cache = useQueryClient();
  const result = useQuery({
    queryKey: operationalKey(userId, finished),
    queryFn: ({ signal }) => fetchOperationalOrders(finished, signal),
    staleTime: 15_000,
  });
  useEffect(() => {
    const client = requireSupabase();
    const refresh = (id: string) => {
      void refreshOperationalOrder(cache, id).catch(() =>
        cache.invalidateQueries({ queryKey: ["orders", "operational"] }),
      );
    };
    const channel = client
      .channel(`orders-board-${userId}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, (payload) => {
        const row = payload.new as { id?: string };
        const old = payload.old as { id?: string };
        if (row.id || old.id) refresh((row.id || old.id)!);
      })
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "production_jobs" },
        (payload) => {
          const row = payload.new as { order_id?: string };
          if (row.order_id) refresh(row.order_id);
        },
      )
      .subscribe();
    return () => {
      void client.removeChannel(channel);
    };
  }, [cache, userId]);
  return result;
}

export async function fetchOrderDetail(id: string) {
  const c = requireSupabase();
  const [order, items, files, approvals, jobs, events, assignments] = await Promise.all([
    c
      .from("orders")
      .select("*, customer:customers(*)")
      .eq("id", id)
      .is("deleted_at", null)
      .single(),
    c.from("order_items").select("*").eq("order_id", id).is("deleted_at", null).order("created_at"),
    c
      .from("order_files")
      .select("*")
      .eq("order_id", id)
      .is("deleted_at", null)
      .order("created_at", { ascending: false }),
    c
      .from("approvals")
      .select("*, decider:profiles!approvals_decided_by_fkey(full_name)")
      .eq("order_id", id)
      .order("version", { ascending: false }),
    c
      .from("production_jobs")
      .select("*")
      .eq("order_id", id)
      .order("created_at", { ascending: false }),
    c
      .from("production_events")
      .select("*, author:profiles!production_events_created_by_fkey(full_name)")
      .eq("order_id", id)
      .order("created_at", { ascending: false }),
    c
      .from("order_assignments")
      .select("*")
      .eq("order_id", id)
      .order("assigned_at", { ascending: false }),
  ]);
  for (const result of [order, items, files, approvals, jobs, events, assignments])
    if (result.error) throw result.error;
  const signed = await Promise.all(
    (files.data ?? []).map(async (file) => {
      const result = await c.storage.from(file.bucket_id).createSignedUrl(file.object_path, 3600);
      return { ...file, url: result.data?.signedUrl ?? null };
    }),
  );
  return {
    order: order.data!,
    items: items.data ?? [],
    files: signed,
    approvals: approvals.data ?? [],
    jobs: jobs.data ?? [],
    events: events.data ?? [],
    assignments: assignments.data ?? [],
  };
}

export async function fetchOrderHistory(id: string, before?: number) {
  const result = await requireSupabase().rpc("order_history", {
    p_order_id: id,
    p_limit: 100,
    ...(before ? { p_before_id: before } : {}),
  });
  if (result.error) throw result.error;
  const actorIds = [...new Set(result.data.map((a) => a.actor_id).filter((x): x is string => !!x))];
  const actors = actorIds.length
    ? await requireSupabase().from("profiles").select("id,full_name").in("id", actorIds)
    : { data: [], error: null };
  if (actors.error) throw actors.error;
  return result.data.map((a) => ({
    ...a,
    author: actors.data?.find((p) => p.id === a.actor_id)?.full_name ?? "Sistema",
  }));
}
