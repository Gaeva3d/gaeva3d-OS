/* eslint-disable react-refresh/only-export-components */
import type { User } from "@supabase/supabase-js";
import { useRouterState } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { AppLoading, AuthScreen, FirstAccessScreen } from "@/components/gaeva/auth-screen";
import { isSupabaseConfigured, requireSupabase, supabase } from "@/integrations/supabase/client";
import type { Json, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";
import { operateOrder, refreshOperationalOrder, type OrderAction } from "./order-operations";
import { isNormalMove, stageForStatus } from "./kanban";

import { canMoveTo, nextOrderCode } from "./helpers";
import {
  FILE_TO_DB,
  PAYMENT_TO_DB,
  PRINTER_STATUS_TO_DB,
  PRIORITY_TO_DB,
  PRODUCT_TO_DB,
  ROLE_TO_DB,
  STATUS_TO_DB,
  mapApproval,
  mapAudit,
  mapCustomer,
  mapOrder,
  mapOrderFile,
  mapOrderItem,
  mapPrinter,
  mapProductionEvent,
  mapProductionJob,
  mapTeamMember,
  roleFromDb,
  type DbProfile,
} from "./supabase-mappers";
import {
  PRIORITY_LABELS,
  STATUS_LABELS,
  type Approval,
  type AuditLog,
  type Customer,
  type FileCategory,
  type Order,
  type OrderFile,
  type OrderItem,
  type Printer,
  type ProductionEvent,
  type ProductionJob,
  type TeamMember,
  type UUID,
} from "./types";

interface DataState {
  customers: Customer[];
  team: TeamMember[];
  printers: Printer[];
  orders: Order[];
  orderItems: OrderItem[];
  files: OrderFile[];
  approvals: Approval[];
  jobs: ProductionJob[];
  events: ProductionEvent[];
  audit: AuditLog[];
}

const EMPTY_DATA: DataState = {
  customers: [],
  team: [],
  printers: [],
  orders: [],
  orderItems: [],
  files: [],
  approvals: [],
  jobs: [],
  events: [],
  audit: [],
};

export type MutationResult = { ok: boolean; error?: string | undefined };
type BaseFields = "id" | "created_at" | "updated_at" | "deleted_at";

export interface NewOrderInput extends Omit<
  Order,
  BaseFields | "code" | "is_demo" | "approval_registered" | "approval_date"
> {
  approval_registered?: boolean;
}

export interface FileUploadInput {
  file?: File;
  name: string;
  size: number;
  mime_type: string;
  category: FileCategory;
  url?: string | null;
}

interface GaevaContextValue extends DataState {
  loading: boolean;
  error: string | null;
  authUser: User;
  profile: DbProfile;
  currentMember: TeamMember;
  can: (action: "manage_commercial" | "manage_production" | "manage_settings") => boolean;
  signOut: () => Promise<void>;
  refreshData: () => Promise<void>;
  runOrderAction: (
    id: UUID,
    updatedAt: string,
    action: OrderAction,
    payload?: Json,
  ) => Promise<MutationResult>;
  createCustomer: (input: Omit<Customer, BaseFields>) => Promise<Customer>;
  updateCustomer: (id: UUID, patch: Partial<Customer>) => Promise<MutationResult>;
  createOrder: (input: NewOrderInput) => Promise<Order>;
  updateOrder: (id: UUID, patch: Partial<Order>, comment?: string) => Promise<MutationResult>;
  changeStatus: (
    id: UUID,
    status: Order["status"],
    options?: { reason?: string; comment?: string },
  ) => Promise<MutationResult>;
  addFiles: (orderId: UUID, files: FileUploadInput[]) => Promise<MutationResult>;
  removeFile: (fileId: UUID) => Promise<MutationResult>;
  registerApproval: (
    orderId: UUID,
    input: { version: string; notes?: string; approved: boolean },
  ) => Promise<MutationResult>;
  addProductionEvent: (orderId: UUID, message: string) => Promise<MutationResult>;
  upsertJob: (
    job: Partial<ProductionJob> & { order_id: UUID; id?: UUID },
  ) => Promise<MutationResult>;
  updatePrinter: (id: UUID, patch: Partial<Printer>) => Promise<MutationResult>;
  createPrinter: (
    input: Pick<Printer, "name" | "technology" | "current_material" | "notes">,
  ) => Promise<MutationResult>;
  upsertTeamMember: (
    member: Partial<TeamMember> & { id?: UUID; name: string },
  ) => Promise<MutationResult>;
  nextCode: () => string;
}

const GaevaContext = createContext<GaevaContextValue | null>(null);

function messageFrom(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "object" && error && "message" in error) return String(error.message);
  return "Não foi possível concluir a operação.";
}

function numberFrom(value?: string | number | null): number | null {
  if (value == null || value === "") return null;
  const parsed =
    typeof value === "number" ? value : Number(value.replace(",", ".").replace(/[^\d.-]/g, ""));
  return Number.isFinite(parsed) ? parsed : null;
}

function dateOnly(value?: string | null): string | null {
  return value ? value.slice(0, 10) : null;
}

function safeObjectName(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9._-]/g, "-");
}

export function GaevaProvider({ children }: { children: ReactNode }) {
  const lightweight = useRouterState({
    select: (s) =>
      s.location.pathname === "/pedidos/kanban" ||
      (s.location.pathname.replace(/\/$/, "") === "/pedidos" &&
        (s.location.search as { view?: string }).view === "kanban"),
  });
  const queryCache = useQueryClient();
  const loadVersion = useRef(0);
  const [data, setData] = useState<DataState>(EMPTY_DATA);
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<DbProfile | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    const version = ++loadVersion.current;
    const client = requireSupabase();
    setLoading(true);
    setError(null);

    try {
      const userResult = await client.auth.getUser();
      const userId = userResult.data.user?.id;
      if (!userId) throw new Error("Sessão expirada. Entre novamente.");

      if (lightweight) {
        const [ownProfile, members, machines] = await Promise.all([
          client.from("profiles").select("*").eq("id", userId).single(),
          client.from("team_members").select("*").is("deleted_at", null).order("name"),
          client.from("printers").select("*").is("deleted_at", null).order("name"),
        ]);
        for (const response of [ownProfile, members, machines])
          if (response.error) throw response.error;
        if (version !== loadVersion.current) return;
        setProfile(ownProfile.data);
        setData({
          ...EMPTY_DATA,
          team: (members.data ?? []).map(mapTeamMember),
          printers: (machines.data ?? []).map((p) => mapPrinter(p, [])),
        });
        return;
      }

      const [
        profileResult,
        profilesResult,
        customersResult,
        teamResult,
        printersResult,
        ordersResult,
        itemsResult,
        filesResult,
        approvalsResult,
        jobsResult,
        eventsResult,
        auditResult,
      ] = await Promise.all([
        client.from("profiles").select("*").eq("id", userId).single(),
        client.from("profiles").select("*"),
        client.from("customers").select("*").is("deleted_at", null).order("name"),
        client.from("team_members").select("*").is("deleted_at", null).order("name"),
        client.from("printers").select("*").is("deleted_at", null).order("name"),
        client
          .from("orders")
          .select("*")
          .is("deleted_at", null)
          .order("created_at", { ascending: false }),
        client.from("order_items").select("*").is("deleted_at", null).order("created_at"),
        client
          .from("order_files")
          .select("*")
          .is("deleted_at", null)
          .order("created_at", { ascending: false }),
        client.from("approvals").select("*").order("created_at", { ascending: false }),
        client.from("production_jobs").select("*").order("created_at", { ascending: false }),
        client.from("production_events").select("*").order("created_at", { ascending: false }),
        client.from("audit_logs").select("*").order("created_at", { ascending: false }).limit(250),
      ]);

      const results = [
        profileResult,
        profilesResult,
        customersResult,
        teamResult,
        printersResult,
        ordersResult,
        itemsResult,
        filesResult,
        approvalsResult,
        jobsResult,
        eventsResult,
        auditResult,
      ];
      const failed = results.find((query) => query.error);
      if (failed?.error) throw failed.error;

      const currentProfile = profileResult.data;
      if (!currentProfile) throw new Error("Seu usuário ainda não possui um perfil de acesso.");
      if (version !== loadVersion.current) return;
      setProfile(currentProfile);

      const dbOrders = ordersResult.data ?? [];
      const dbItems = itemsResult.data ?? [];
      const dbApprovals = approvalsResult.data ?? [];
      const profilesById = new Map((profilesResult.data ?? []).map((item) => [item.id, item]));
      const itemByOrder = new Map(dbItems.map((item) => [item.order_id, item]));
      const signedFiles = await Promise.all(
        (filesResult.data ?? []).map(async (file) => {
          const signed = await client.storage
            .from(file.bucket_id)
            .createSignedUrl(file.object_path, 3600);
          return mapOrderFile(file, signed.data?.signedUrl ?? null);
        }),
      );

      if (version !== loadVersion.current) return;
      setData({
        customers: (customersResult.data ?? []).map(mapCustomer),
        team: (teamResult.data ?? []).map(mapTeamMember),
        printers: (printersResult.data ?? []).map((printer) => mapPrinter(printer, dbOrders)),
        orders: dbOrders.map((order) => ({
          ...mapOrder(order, itemByOrder.get(order.id), dbApprovals),
          quantity: dbItems
            .filter((item) => item.order_id === order.id)
            .reduce((sum, item) => sum + item.quantity, 0),
        })),
        orderItems: dbItems.map(mapOrderItem),
        files: signedFiles,
        approvals: dbApprovals.map(mapApproval),
        jobs: (jobsResult.data ?? []).map(mapProductionJob),
        events: (eventsResult.data ?? []).map((event) =>
          mapProductionEvent(
            event,
            profilesById.get(event.created_by ?? "")?.full_name ?? "Equipe GAEVA",
          ),
        ),
        audit: (auditResult.data ?? []).map((entry) =>
          mapAudit(entry, profilesById.get(entry.actor_id ?? "")?.full_name ?? "Sistema"),
        ),
      });
    } catch (loadError) {
      if (version !== loadVersion.current) return;
      setError(messageFrom(loadError));
      setData(EMPTY_DATA);
    } finally {
      if (version === loadVersion.current) setLoading(false);
    }
  }, [lightweight]);

  useEffect(() => {
    if (!supabase) {
      setAuthLoading(false);
      setLoading(false);
      return;
    }
    void supabase.auth.getSession().then(({ data: sessionData }) => {
      setAuthUser(sessionData.session?.user ?? null);
      setAuthLoading(false);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthUser(session?.user ?? null);
      if (!session) {
        ++loadVersion.current;
        queryCache.clear();
        setProfile(null);
        setData(EMPTY_DATA);
      }
    });
    return () => listener.subscription.unsubscribe();
  }, [queryCache]);

  useEffect(() => {
    if (!authUser) {
      setLoading(false);
      return;
    }
    void loadData();
  }, [authUser, loadData]);

  const signIn = useCallback(async (email: string, password: string): Promise<MutationResult> => {
    try {
      const client = requireSupabase();
      const { error: signInError } = await client.auth.signInWithPassword({ email, password });
      if (signInError) throw signInError;
      return { ok: true };
    } catch (signInError) {
      return { ok: false, error: messageFrom(signInError) };
    }
  }, []);

  const signOut = useCallback(async () => {
    await requireSupabase().auth.signOut();
  }, []);

  const currentMember = useMemo<TeamMember | null>(() => {
    if (!authUser || !profile) return null;
    return (
      data.team.find((member) => member.user_id === authUser.id) ?? {
        id: authUser.id,
        user_id: authUser.id,
        name: profile.full_name,
        avatar_url: profile.avatar_path,
        job_title: "Usuário do sistema",
        role: roleFromDb(profile.role),
        phone: profile.phone,
        email: profile.email,
        active: profile.is_active,
        capacity: 0,
        specialties: [],
        notes: null,
        created_at: profile.created_at,
        updated_at: profile.updated_at,
      }
    );
  }, [authUser, data.team, profile]);

  const can = useCallback(
    (action: "manage_commercial" | "manage_production" | "manage_settings") => {
      if (!profile?.is_active) return false;
      const role = roleFromDb(profile.role);
      if (role === "admin") return true;
      if (role === "visualizacao") return false;
      if (action === "manage_commercial") return role === "comercial";
      if (action === "manage_production") return role === "producao";
      return false;
    },
    [profile],
  );

  const value = useMemo<GaevaContextValue | null>(() => {
    if (!authUser || !profile || !currentMember) return null;
    const client = requireSupabase();
    const result = async (operation: () => Promise<void>): Promise<MutationResult> => {
      try {
        await operation();
        await loadData();
        await queryCache.invalidateQueries({ queryKey: ["orders"] });
        return { ok: true };
      } catch (mutationError) {
        return { ok: false, error: messageFrom(mutationError) };
      }
    };
    const runOrderAction: GaevaContextValue["runOrderAction"] = async (
      id,
      updatedAt,
      action,
      payload = {},
    ) => {
      try {
        await operateOrder({ id, updated_at: updatedAt }, action, payload);
        await refreshOperationalOrder(queryCache, id);
        if (!lightweight) await loadData();
        return { ok: true };
      } catch (err) {
        // On conflicts show current server data, never roll a card back over another user's write.
        await refreshOperationalOrder(queryCache, id).catch(() => undefined);
        return { ok: false, error: messageFrom(err) };
      }
    };

    return {
      ...data,
      loading,
      error,
      authUser,
      profile,
      currentMember,
      can,
      signOut,
      refreshData: loadData,
      runOrderAction,
      nextCode: () => nextOrderCode(data.orders.map((order) => order.code)),
      createCustomer: async (input) => {
        const { data: created, error: createError } = await client
          .from("customers")
          .insert({
            name: input.name,
            company_name: input.company ?? null,
            phone: input.phone,
            email: input.email ?? null,
            city: input.city || null,
            state: input.state || null,
            notes: input.notes ?? null,
          })
          .select()
          .single();
        if (createError) throw createError;
        await loadData();
        return mapCustomer(created);
      },
      updateCustomer: (id, patch) =>
        result(async () => {
          const update: TablesUpdate<"customers"> = {};
          if (patch.name !== undefined) update.name = patch.name;
          if (patch.company !== undefined) update.company_name = patch.company;
          if (patch.phone !== undefined) update.phone = patch.phone;
          if (patch.email !== undefined) update.email = patch.email;
          if (patch.city !== undefined) update.city = patch.city || null;
          if (patch.state !== undefined) update.state = patch.state || null;
          if (patch.notes !== undefined) update.notes = patch.notes;
          const { error: updateError } = await client.from("customers").update(update).eq("id", id);
          if (updateError) throw updateError;
        }),
      createOrder: async (input) => {
        const requirements =
          [input.references_notes, input.rights_notes].filter(Boolean).join("\n\n") || null;
        const { data: created, error: createError } = await client
          .from("orders")
          .insert({
            customer_id: input.customer_id,
            project_name: input.project_name,
            category: PRODUCT_TO_DB[input.product],
            status: STATUS_TO_DB[input.status],
            priority: PRIORITY_TO_DB[input.priority],
            promised_at: dateOnly(input.due_date)!,
            event_date: dateOnly(input.event_date),
            total_value: input.value,
            deposit_value: input.down_payment,
            payment_status: PAYMENT_TO_DB[input.payment_status],
            briefing_description: input.briefing ?? null,
            mandatory_requirements: requirements,
            briefing_complete: input.briefing_complete,
            commercial_notes: input.commercial_notes ?? null,
            internal_notes: input.internal_notes ?? null,
            urgency_reason: input.urgency_reason ?? null,
            block_reason: input.blocked_reason ?? null,
            assigned_to: input.owner_id ?? null,
            initial_printer_id: input.printer_id ?? null,
            estimated_minutes:
              input.estimated_hours == null ? null : Math.round(input.estimated_hours * 60),
            estimated_material_grams: numberFrom(input.estimated_material),
          })
          .select()
          .single();
        if (createError) throw createError;

        const { data: item, error: itemError } = await client
          .from("order_items")
          .insert({
            order_id: created.id,
            category: PRODUCT_TO_DB[input.product],
            name: input.project_name,
            quantity: input.quantity,
            dimensions: input.dimensions ?? null,
            material: input.material ?? null,
            colors: input.colors
              ? input.colors
                  .split(",")
                  .map((color) => color.trim())
                  .filter(Boolean)
              : [],
            finishing: input.finishing ?? null,
            purpose: input.purpose ?? null,
            event_date: dateOnly(input.event_date),
            estimated_minutes:
              input.estimated_hours == null ? null : Math.round(input.estimated_hours * 60),
            estimated_material_grams: numberFrom(input.estimated_material),
            unit_price: input.quantity > 0 ? input.value / input.quantity : input.value,
          })
          .select()
          .single();
        if (itemError) throw itemError;
        // Publish the complete intake through the existing orders Realtime stream.
        // The first INSERT can reach another user's board before its items exist.
        const { error: completeError } = await client
          .from("orders")
          .update({ updated_at: new Date().toISOString() })
          .eq("id", created.id);
        if (completeError) throw completeError;
        await loadData();
        await queryCache.invalidateQueries({ queryKey: ["orders"] });
        return mapOrder(created, item, []);
      },
      updateOrder: (id, patch) =>
        result(async () => {
          const update: TablesUpdate<"orders"> = {};
          if (patch.customer_id !== undefined) update.customer_id = patch.customer_id;
          if (patch.project_name !== undefined) update.project_name = patch.project_name;
          if (patch.product !== undefined) update.category = PRODUCT_TO_DB[patch.product];
          if (patch.status !== undefined) update.status = STATUS_TO_DB[patch.status];
          if (patch.priority !== undefined) update.priority = PRIORITY_TO_DB[patch.priority];
          if (patch.due_date !== undefined) update.promised_at = dateOnly(patch.due_date)!;
          if (patch.event_date !== undefined) update.event_date = dateOnly(patch.event_date);
          if (patch.value !== undefined) update.total_value = patch.value;
          if (patch.down_payment !== undefined) update.deposit_value = patch.down_payment;
          if (patch.payment_status !== undefined)
            update.payment_status = PAYMENT_TO_DB[patch.payment_status];
          if (patch.briefing !== undefined) update.briefing_description = patch.briefing;
          if (patch.briefing_complete !== undefined)
            update.briefing_complete = patch.briefing_complete;
          if (patch.commercial_notes !== undefined)
            update.commercial_notes = patch.commercial_notes;
          if (patch.internal_notes !== undefined) update.internal_notes = patch.internal_notes;
          if (patch.urgency_reason !== undefined) update.urgency_reason = patch.urgency_reason;
          if (patch.blocked_reason !== undefined) update.block_reason = patch.blocked_reason;
          if (patch.owner_id !== undefined) update.assigned_to = patch.owner_id;
          if (patch.printer_id !== undefined) update.initial_printer_id = patch.printer_id;
          if (patch.estimated_hours !== undefined)
            update.estimated_minutes =
              patch.estimated_hours == null ? null : Math.round(patch.estimated_hours * 60);
          if (patch.estimated_material !== undefined)
            update.estimated_material_grams = numberFrom(patch.estimated_material);
          const { error: updateError } = await client.from("orders").update(update).eq("id", id);
          if (updateError) throw updateError;
        }),
      changeStatus: async (id, status, options) => {
        const order = data.orders.find((item) => item.id === id);
        if (!order) return { ok: false, error: "Pedido não encontrado." };
        const from = stageForStatus(order.status),
          to = stageForStatus(status);
        let note = options?.reason ?? options?.comment;
        if (from !== to && !isNormalMove(from ?? "", to ?? "")) {
          if (profile.role !== "admin")
            return { ok: false, error: "Movimentação excepcional exige administrador." };
          note =
            note ?? window.prompt("Confirmar movimentação: informe a justificativa.") ?? undefined;
          if (!note?.trim()) return { ok: false, error: "Movimentação cancelada." };
        }
        const needsConfirmation =
          (from === "confirmation" && to === "design") || (from === "ready" && to === "shipping");
        if (
          needsConfirmation &&
          !window.confirm(
            from === "confirmation"
              ? "Referências, produto, quantidade, personalizações, prazo e endereço aplicável foram confirmados?"
              : "Peça, quantidade, qualidade, acabamento, itens e embalagem foram conferidos?",
          )
        )
          return { ok: false, error: "Movimentação cancelada." };
        if (from === "approval" && to === "design" && !note)
          note = window.prompt("Qual alteração o cliente solicitou?") ?? undefined;
        return runOrderAction(id, order.updated_at, "move", {
          status: STATUS_TO_DB[status],
          confirmed: needsConfirmation,
          ...(note ? { note } : {}),
        });
      },
      addFiles: (orderId, uploads) =>
        result(async () => {
          for (const upload of uploads) {
            if (!upload.file)
              throw new Error(`O conteúdo de ${upload.name} não está disponível para envio.`);
            const randomId = globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;
            const objectPath = `${orderId}/${randomId}-${safeObjectName(upload.name)}`;
            const { error: uploadError } = await client.storage
              .from("order-files")
              .upload(objectPath, upload.file, { contentType: upload.mime_type, upsert: false });
            if (uploadError) throw uploadError;
            const { error: metadataError } = await client.from("order_files").insert({
              order_id: orderId,
              category: FILE_TO_DB[upload.category],
              bucket_id: "order-files",
              object_path: objectPath,
              file_name: upload.name,
              mime_type: upload.mime_type,
              size_bytes: upload.size,
            });
            if (metadataError) throw metadataError;
          }
        }),
      removeFile: (fileId) =>
        result(async () => {
          const { error: removeError } = await client
            .from("order_files")
            .update({ deleted_at: new Date().toISOString() })
            .eq("id", fileId);
          if (removeError) throw removeError;
        }),
      registerApproval: async (orderId, input) => {
        const order = data.orders.find((o) => o.id === orderId);
        if (!order) return { ok: false, error: "Pedido não encontrado." };
        return runOrderAction(
          orderId,
          order.updated_at,
          input.approved ? "approve" : "request_changes",
          { note: input.notes ?? "" },
        );
      },
      addProductionEvent: (orderId, message) =>
        result(async () => {
          const { error: eventError } = await client.from("production_events").insert({
            order_id: orderId,
            event_type: "note",
            notes: message,
          });
          if (eventError) throw eventError;
        }),
      upsertJob: (job) =>
        result(async () => {
          const status: TablesInsert<"production_jobs">["status"] = job.failed
            ? "failed"
            : job.stage === "imprimindo"
              ? "running"
              : job.stage === "concluido"
                ? "completed"
                : job.stage === "cancelado"
                  ? "cancelled"
                  : "queued";
          const payload: TablesUpdate<"production_jobs"> = {
            order_id: job.order_id,
            printer_id: job.printer_id ?? null,
            assigned_to: job.member_id ?? null,
            status,
            estimated_minutes:
              job.estimated_hours == null ? null : Math.round(job.estimated_hours * 60),
            actual_minutes: job.real_hours == null ? null : Math.round(job.real_hours * 60),
            estimated_material_grams: numberFrom(job.estimated_material),
            actual_material_grams: numberFrom(job.real_material),
            failure_reason: job.failed ? (job.failure_reason ?? "Falha informada") : null,
            attempt_number: job.reprint ? 2 : 1,
            notes: job.notes ?? null,
            started_at: job.started_at ?? null,
            finished_at: job.finished_at ?? null,
          };
          const query = job.id
            ? client.from("production_jobs").update(payload).eq("id", job.id)
            : client.from("production_jobs").insert(payload as TablesInsert<"production_jobs">);
          const { error: jobError } = await query;
          if (jobError) throw jobError;
        }),
      updatePrinter: (id, patch) =>
        result(async () => {
          const update: TablesUpdate<"printers"> = {};
          if (patch.name !== undefined) update.name = patch.name;
          if (patch.status !== undefined) update.status = PRINTER_STATUS_TO_DB[patch.status];
          if (patch.current_material !== undefined)
            update.current_material = patch.current_material;
          if (patch.current_order_id !== undefined)
            update.current_order_id = patch.current_order_id;
          if (patch.estimated_hours !== undefined)
            update.planned_hours = patch.estimated_hours ?? 0;
          if (patch.notes !== undefined) update.notes = patch.notes;
          const { error: printerError } = await client.from("printers").update(update).eq("id", id);
          if (printerError) throw printerError;
        }),
      createPrinter: (input) =>
        result(async () => {
          const technology = input.technology.toLowerCase().includes("res") ? "resin" : "fdm";
          const { error: printerError } = await client.from("printers").insert({
            name: input.name,
            technology,
            current_material: input.current_material ?? null,
            notes: input.notes ?? null,
          });
          if (printerError) throw printerError;
        }),
      upsertTeamMember: (member) =>
        result(async () => {
          const linkedUserId =
            member.user_id ?? data.team.find((item) => item.id === member.id)?.user_id ?? null;
          const payload: TablesUpdate<"team_members"> = { name: member.name };
          if (member.user_id !== undefined) payload.user_id = member.user_id;
          if (member.avatar_url !== undefined) payload.avatar_path = member.avatar_url;
          if (member.job_title !== undefined) payload.job_title = member.job_title;
          if (member.role !== undefined) payload.access_role = ROLE_TO_DB[member.role];
          if (member.phone !== undefined) payload.phone = member.phone;
          if (member.email !== undefined) payload.email = member.email;
          if (member.active !== undefined) payload.is_active = member.active;
          if (member.capacity !== undefined) payload.capacity_limit = member.capacity;
          if (member.specialties !== undefined) payload.specialties = member.specialties;
          if (member.notes !== undefined) payload.notes = member.notes;
          const query = member.id
            ? client.from("team_members").update(payload).eq("id", member.id)
            : client.from("team_members").insert({
                name: member.name,
                user_id: member.user_id ?? null,
                job_title: member.job_title ?? "Produção",
                access_role: member.role ? ROLE_TO_DB[member.role] : "production",
                capacity_limit: member.capacity ?? 0,
                is_active: member.active ?? true,
                specialties: member.specialties ?? [],
                phone: member.phone ?? null,
                email: member.email ?? null,
                notes: member.notes ?? null,
              });
          const { error: teamError } = await query;
          if (teamError) throw teamError;
          if (linkedUserId && member.role) {
            const { error: profileError } = await client
              .from("profiles")
              .update({ role: ROLE_TO_DB[member.role] })
              .eq("id", linkedUserId);
            if (profileError) throw profileError;
          }
        }),
    };
  }, [
    authUser,
    can,
    currentMember,
    data,
    error,
    loadData,
    loading,
    profile,
    signOut,
    lightweight,
    queryCache,
  ]);

  if (authLoading) return <AppLoading />;
  if (!authUser)
    return <AuthScreen configured={isSupabaseConfigured} error={error} onSignIn={signIn} />;
  if (authUser.app_metadata["gaeva_requires_password_change"] === true)
    return <FirstAccessScreen onSignOut={signOut} />;
  if (loading && !profile) return <AppLoading />;
  if (!value) {
    return (
      <AuthScreen
        configured={isSupabaseConfigured}
        error={error ?? "Não foi possível carregar seu perfil de acesso."}
        onSignIn={signIn}
      />
    );
  }
  return <GaevaContext.Provider value={value}>{children}</GaevaContext.Provider>;
}

export function useGaeva(): GaevaContextValue {
  const context = useContext(GaevaContext);
  if (!context) throw new Error("useGaeva precisa estar dentro de <GaevaProvider>.");
  return context;
}

export function useOrderView(orderId?: UUID) {
  const { orders, customers, team, printers } = useGaeva();
  const order = orders.find((item) => item.id === orderId);
  return {
    order,
    customer: customers.find((item) => item.id === order?.customer_id),
    owner: team.find((item) => item.id === order?.owner_id),
    printer: printers.find((item) => item.id === order?.printer_id),
  };
}

export const LABELS = { STATUS_LABELS, PRIORITY_LABELS };
