-- Align foreign-key indexes and remove overlapping permissive RLS policies.

create index if not exists approvals_created_by_idx on public.approvals (created_by);
create index if not exists approvals_decided_by_idx on public.approvals (decided_by);
create index if not exists approvals_order_file_id_idx on public.approvals (order_file_id);
create index if not exists audit_logs_actor_id_idx on public.audit_logs (actor_id);
create index if not exists customers_created_by_idx on public.customers (created_by);
create index if not exists order_assignments_assigned_by_idx on public.order_assignments (assigned_by);
create index if not exists order_assignments_assigned_to_idx on public.order_assignments (assigned_to);
create index if not exists order_assignments_printer_id_idx on public.order_assignments (printer_id);
create index if not exists order_files_order_item_id_idx on public.order_files (order_item_id);
create index if not exists order_files_uploaded_by_idx on public.order_files (uploaded_by);
create index if not exists orders_created_by_idx on public.orders (created_by);
create index if not exists orders_updated_by_idx on public.orders (updated_by);
create index if not exists printers_current_order_id_idx on public.printers (current_order_id);
create index if not exists production_events_created_by_idx on public.production_events (created_by);
create index if not exists production_events_job_id_idx on public.production_events (production_job_id);
create index if not exists production_jobs_assigned_to_idx on public.production_jobs (assigned_to);
create index if not exists production_jobs_created_by_idx on public.production_jobs (created_by);
create index if not exists production_jobs_order_item_id_idx on public.production_jobs (order_item_id);
create index if not exists production_jobs_reprint_of_id_idx on public.production_jobs (reprint_of_id);

drop policy if exists profiles_admin_all on public.profiles;
drop policy if exists profiles_update_self on public.profiles;

create policy profiles_admin_insert
on public.profiles for insert to authenticated
with check ((select app_private.has_role(array['admin'::public.app_role])));

create policy profiles_update_self_or_admin
on public.profiles for update to authenticated
using (
  id = (select auth.uid())
  or (select app_private.has_role(array['admin'::public.app_role]))
)
with check (
  id = (select auth.uid())
  or (select app_private.has_role(array['admin'::public.app_role]))
);

drop policy if exists team_members_admin_write on public.team_members;

create policy team_members_admin_insert
on public.team_members for insert to authenticated
with check ((select app_private.has_role(array['admin'::public.app_role])));

create policy team_members_admin_update
on public.team_members for update to authenticated
using ((select app_private.has_role(array['admin'::public.app_role])))
with check ((select app_private.has_role(array['admin'::public.app_role])));

