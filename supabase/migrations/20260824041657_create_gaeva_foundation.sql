-- GAEVA OS foundation
-- Internal order, production, printer, team, file and audit management.

create extension if not exists pgcrypto with schema extensions;

create schema if not exists app_private;
revoke all on schema app_private from public;
grant usage on schema app_private to authenticated;

create type public.app_role as enum ('admin', 'commercial', 'production', 'viewer');
create type public.priority_level as enum ('normal', 'high', 'urgent', 'critical');
create type public.order_status as enum (
  'received',
  'briefing_pending',
  'modeling',
  'internal_review',
  'awaiting_customer_approval',
  'approved_for_production',
  'print_queue',
  'printing',
  'finishing',
  'quality_control',
  'packaging',
  'shipping',
  'completed',
  'blocked',
  'cancelled'
);
create type public.product_category as enum (
  'corporate_mascot',
  'trophy',
  'corporate_keychain',
  'custom_pet',
  'custom_piece',
  'other'
);
create type public.payment_status as enum ('pending', 'partial', 'paid', 'overdue', 'refunded', 'cancelled');
create type public.printer_status as enum ('available', 'printing', 'maintenance', 'offline');
create type public.printer_technology as enum ('fdm', 'resin', 'other');
create type public.approval_status as enum ('pending', 'approved', 'changes_requested', 'rejected');
create type public.file_category as enum ('reference', 'briefing', 'model', 'approval', 'production', 'quality', 'shipping', 'other');
create type public.production_job_status as enum ('queued', 'running', 'paused', 'failed', 'completed', 'cancelled');
create type public.production_event_type as enum ('started', 'paused', 'resumed', 'completed', 'failed', 'reprint', 'note', 'material_update');

create sequence public.gaeva_order_code_seq start 1;

create or replace function public.generate_order_code()
returns text
language sql
volatile
security invoker
set search_path = ''
as $$
  select 'GAE-' || extract(year from current_date)::int::text || '-' || lpad(nextval('public.gaeva_order_code_seq')::text, 4, '0');
$$;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  email text,
  phone text,
  avatar_path text,
  role public.app_role not null default 'viewer',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.team_members (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique references public.profiles(id) on delete set null,
  name text not null,
  avatar_path text,
  job_title text not null,
  access_role public.app_role not null default 'viewer',
  phone text,
  email text,
  is_active boolean not null default true,
  capacity_limit integer not null default 0 check (capacity_limit >= 0),
  specialties text[] not null default '{}',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table public.customers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  company_name text,
  phone text not null,
  email text,
  city text,
  state char(2),
  notes text,
  created_by uuid references public.profiles(id) on delete set null default auth.uid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  constraint customers_phone_not_blank check (btrim(phone) <> ''),
  constraint customers_state_format check (state is null or state ~ '^[A-Z]{2}$')
);

create table public.printers (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  model text,
  technology public.printer_technology not null,
  status public.printer_status not null default 'available',
  current_material text,
  planned_hours numeric(10,2) not null default 0 check (planned_hours >= 0),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  code text not null unique default public.generate_order_code(),
  customer_id uuid not null references public.customers(id) on delete restrict,
  project_name text not null,
  category public.product_category not null,
  status public.order_status not null default 'received',
  priority public.priority_level not null default 'normal',
  promised_at date not null,
  event_date date,
  total_value numeric(12,2) not null default 0 check (total_value >= 0),
  deposit_value numeric(12,2) not null default 0 check (deposit_value >= 0),
  balance_value numeric(12,2) generated always as (greatest(total_value - deposit_value, 0)) stored,
  payment_status public.payment_status not null default 'pending',
  briefing_description text,
  mandatory_requirements text,
  brand_use_authorized boolean not null default false,
  briefing_complete boolean not null default false,
  commercial_notes text,
  internal_notes text,
  urgency_reason text,
  block_reason text,
  assigned_to uuid references public.team_members(id) on delete set null,
  initial_printer_id uuid references public.printers(id) on delete set null,
  estimated_minutes integer check (estimated_minutes is null or estimated_minutes >= 0),
  estimated_material_grams numeric(10,2) check (estimated_material_grams is null or estimated_material_grams >= 0),
  created_by uuid references public.profiles(id) on delete set null default auth.uid(),
  updated_by uuid references public.profiles(id) on delete set null default auth.uid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  constraint orders_deposit_not_above_total check (deposit_value <= total_value),
  constraint orders_event_before_promise check (event_date is null or promised_at <= event_date),
  constraint orders_urgency_reason check (
    priority not in ('urgent', 'critical') or nullif(btrim(urgency_reason), '') is not null
  ),
  constraint orders_block_reason check (
    status <> 'blocked' or nullif(btrim(block_reason), '') is not null
  )
);

alter table public.printers
  add column current_order_id uuid references public.orders(id) on delete set null;

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  category public.product_category not null,
  name text not null,
  quantity integer not null default 1 check (quantity > 0),
  dimensions text,
  technology text,
  material text,
  colors text[] not null default '{}',
  finishing text,
  purpose text,
  event_date date,
  notes text,
  estimated_minutes integer check (estimated_minutes is null or estimated_minutes >= 0),
  estimated_material_grams numeric(10,2) check (estimated_material_grams is null or estimated_material_grams >= 0),
  actual_minutes integer check (actual_minutes is null or actual_minutes >= 0),
  actual_material_grams numeric(10,2) check (actual_material_grams is null or actual_material_grams >= 0),
  unit_price numeric(12,2) not null default 0 check (unit_price >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table public.order_files (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  order_item_id uuid references public.order_items(id) on delete set null,
  category public.file_category not null default 'other',
  bucket_id text not null default 'order-files',
  object_path text not null,
  file_name text not null,
  mime_type text,
  size_bytes bigint check (size_bytes is null or size_bytes >= 0),
  version integer not null default 1 check (version > 0),
  notes text,
  uploaded_by uuid references public.profiles(id) on delete set null default auth.uid(),
  created_at timestamptz not null default now(),
  deleted_at timestamptz,
  unique (bucket_id, object_path)
);

create table public.order_assignments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  assigned_to uuid references public.team_members(id) on delete set null,
  printer_id uuid references public.printers(id) on delete set null,
  is_current boolean not null default true,
  notes text,
  assigned_by uuid references public.profiles(id) on delete set null default auth.uid(),
  assigned_at timestamptz not null default now(),
  unassigned_at timestamptz,
  constraint order_assignments_has_target check (assigned_to is not null or printer_id is not null)
);

create table public.approvals (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  order_file_id uuid references public.order_files(id) on delete set null,
  version integer not null default 1 check (version > 0),
  status public.approval_status not null default 'pending',
  customer_name text,
  customer_phone text,
  evidence_path text,
  notes text,
  decided_at timestamptz,
  decided_by uuid references public.profiles(id) on delete set null,
  created_by uuid references public.profiles(id) on delete set null default auth.uid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint approvals_decision_date check (
    (status = 'pending' and decided_at is null) or
    (status <> 'pending' and decided_at is not null)
  )
);

create table public.production_jobs (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  order_item_id uuid references public.order_items(id) on delete set null,
  printer_id uuid references public.printers(id) on delete set null,
  assigned_to uuid references public.team_members(id) on delete set null,
  status public.production_job_status not null default 'queued',
  queue_position integer check (queue_position is null or queue_position > 0),
  planned_start_at timestamptz,
  planned_end_at timestamptz,
  started_at timestamptz,
  finished_at timestamptz,
  estimated_minutes integer check (estimated_minutes is null or estimated_minutes >= 0),
  actual_minutes integer check (actual_minutes is null or actual_minutes >= 0),
  estimated_material_grams numeric(10,2) check (estimated_material_grams is null or estimated_material_grams >= 0),
  actual_material_grams numeric(10,2) check (actual_material_grams is null or actual_material_grams >= 0),
  attempt_number integer not null default 1 check (attempt_number > 0),
  failure_reason text,
  reprint_of_id uuid references public.production_jobs(id) on delete set null,
  notes text,
  created_by uuid references public.profiles(id) on delete set null default auth.uid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint production_jobs_dates check (
    planned_end_at is null or planned_start_at is null or planned_end_at >= planned_start_at
  ),
  constraint production_jobs_actual_dates check (
    finished_at is null or started_at is null or finished_at >= started_at
  ),
  constraint production_jobs_active_printer check (
    status not in ('running', 'completed') or printer_id is not null
  ),
  constraint production_jobs_failure_reason check (
    status <> 'failed' or nullif(btrim(failure_reason), '') is not null
  )
);

create table public.production_events (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  production_job_id uuid references public.production_jobs(id) on delete cascade,
  event_type public.production_event_type not null,
  previous_status public.production_job_status,
  new_status public.production_job_status,
  duration_minutes integer check (duration_minutes is null or duration_minutes >= 0),
  material_grams numeric(10,2) check (material_grams is null or material_grams >= 0),
  failure_reason text,
  is_reprint boolean not null default false,
  notes text,
  created_by uuid references public.profiles(id) on delete set null default auth.uid(),
  created_at timestamptz not null default now()
);

create table public.audit_logs (
  id bigint generated always as identity primary key,
  table_name text not null,
  record_id uuid,
  action text not null check (action in ('INSERT', 'UPDATE', 'DELETE')),
  actor_id uuid references public.profiles(id) on delete set null,
  old_values jsonb,
  new_values jsonb,
  comment text,
  created_at timestamptz not null default now()
);

create index customers_name_idx on public.customers using btree (name);
create index customers_phone_idx on public.customers using btree (phone);
create index orders_customer_idx on public.orders (customer_id);
create index orders_status_priority_idx on public.orders (status, priority);
create index orders_promised_at_idx on public.orders (promised_at) where deleted_at is null;
create index orders_assigned_to_idx on public.orders (assigned_to) where deleted_at is null;
create index orders_printer_idx on public.orders (initial_printer_id) where deleted_at is null;
create index order_items_order_idx on public.order_items (order_id);
create index order_files_order_idx on public.order_files (order_id);
create index order_assignments_order_current_idx on public.order_assignments (order_id, is_current);
create index approvals_order_status_idx on public.approvals (order_id, status);
create index production_jobs_order_status_idx on public.production_jobs (order_id, status);
create index production_jobs_printer_queue_idx on public.production_jobs (printer_id, queue_position) where status = 'queued';
create index production_events_order_created_idx on public.production_events (order_id, created_at desc);
create index audit_logs_record_idx on public.audit_logs (table_name, record_id, created_at desc);

create or replace function app_private.has_role(allowed_roles public.app_role[])
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select
    (select auth.uid()) is not null
    and exists (
      select 1
      from public.profiles p
      where p.id = (select auth.uid())
        and p.is_active
        and p.role = any(allowed_roles)
    );
$$;

revoke all on function app_private.has_role(public.app_role[]) from public;
grant execute on function app_private.has_role(public.app_role[]) to authenticated;

create or replace function app_private.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create or replace function app_private.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  requested_role public.app_role := 'viewer';
begin
  if new.raw_app_meta_data ? 'role'
     and (new.raw_app_meta_data ->> 'role') in ('admin', 'commercial', 'production', 'viewer') then
    requested_role := (new.raw_app_meta_data ->> 'role')::public.app_role;
  end if;

  insert into public.profiles (id, full_name, email, role)
  values (
    new.id,
    coalesce(nullif(new.raw_app_meta_data ->> 'full_name', ''), split_part(coalesce(new.email, 'Usuário'), '@', 1)),
    new.email,
    requested_role
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

revoke all on function app_private.handle_new_user() from public, anon, authenticated;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function app_private.handle_new_user();

create or replace function app_private.protect_profile_privileges()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if (new.role, new.is_active) is distinct from (old.role, old.is_active)
     and not app_private.has_role(array['admin'::public.app_role]) then
    raise exception 'Only administrators can change roles or activation status';
  end if;
  return new;
end;
$$;

revoke all on function app_private.protect_profile_privileges() from public, anon, authenticated;

create trigger protect_profile_privileges
before update on public.profiles
for each row execute function app_private.protect_profile_privileges();

create or replace function app_private.validate_order_business_rules()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  if new.priority in ('urgent', 'critical')
     and nullif(btrim(new.urgency_reason), '') is null then
    raise exception 'Urgent and critical orders require an urgency reason';
  end if;

  if new.status = 'blocked'
     and nullif(btrim(new.block_reason), '') is null then
    raise exception 'Blocked orders require a block reason';
  end if;

  if new.status in ('print_queue', 'printing')
     and not exists (
       select 1
       from public.approvals a
       where a.order_id = new.id
         and a.status = 'approved'
     ) then
    raise exception 'Customer approval is required before printing';
  end if;

  new.updated_by := coalesce(auth.uid(), new.updated_by);
  return new;
end;
$$;

create trigger validate_order_business_rules
before insert or update on public.orders
for each row execute function app_private.validate_order_business_rules();

create or replace function app_private.validate_production_job()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  if new.status in ('queued', 'running')
     and not exists (
       select 1
       from public.approvals a
       where a.order_id = new.order_id
         and a.status = 'approved'
     ) then
    raise exception 'Customer approval is required before queueing production';
  end if;
  return new;
end;
$$;

create trigger validate_production_job
before insert or update on public.production_jobs
for each row execute function app_private.validate_production_job();

create or replace function app_private.write_audit_log()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  row_id uuid;
begin
  if auth.uid() is null and current_user not in ('postgres', 'supabase_admin') then
    raise exception 'Unauthenticated audit write rejected';
  end if;

  row_id := case
    when tg_op = 'DELETE' then old.id
    else new.id
  end;

  insert into public.audit_logs (
    table_name,
    record_id,
    action,
    actor_id,
    old_values,
    new_values
  )
  values (
    tg_table_name,
    row_id,
    tg_op,
    auth.uid(),
    case when tg_op in ('UPDATE', 'DELETE') then to_jsonb(old) else null end,
    case when tg_op in ('INSERT', 'UPDATE') then to_jsonb(new) else null end
  );

  if tg_op = 'DELETE' then
    return old;
  end if;

  return new;
end;
$$;

revoke all on function app_private.write_audit_log() from public, anon, authenticated;

create or replace function app_private.reject_audit_mutation()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  raise exception 'Audit logs are immutable';
end;
$$;

create trigger audit_logs_immutable
before update or delete on public.audit_logs
for each row execute function app_private.reject_audit_mutation();

create trigger profiles_updated_at before update on public.profiles for each row execute function app_private.set_updated_at();
create trigger team_members_updated_at before update on public.team_members for each row execute function app_private.set_updated_at();
create trigger customers_updated_at before update on public.customers for each row execute function app_private.set_updated_at();
create trigger printers_updated_at before update on public.printers for each row execute function app_private.set_updated_at();
create trigger orders_updated_at before update on public.orders for each row execute function app_private.set_updated_at();
create trigger order_items_updated_at before update on public.order_items for each row execute function app_private.set_updated_at();
create trigger approvals_updated_at before update on public.approvals for each row execute function app_private.set_updated_at();
create trigger production_jobs_updated_at before update on public.production_jobs for each row execute function app_private.set_updated_at();

create trigger customers_audit after insert or update or delete on public.customers for each row execute function app_private.write_audit_log();
create trigger printers_audit after insert or update or delete on public.printers for each row execute function app_private.write_audit_log();
create trigger orders_audit after insert or update or delete on public.orders for each row execute function app_private.write_audit_log();
create trigger order_items_audit after insert or update or delete on public.order_items for each row execute function app_private.write_audit_log();
create trigger order_files_audit after insert or update or delete on public.order_files for each row execute function app_private.write_audit_log();
create trigger order_assignments_audit after insert or update or delete on public.order_assignments for each row execute function app_private.write_audit_log();
create trigger approvals_audit after insert or update or delete on public.approvals for each row execute function app_private.write_audit_log();
create trigger production_jobs_audit after insert or update or delete on public.production_jobs for each row execute function app_private.write_audit_log();
create trigger production_events_audit after insert or update or delete on public.production_events for each row execute function app_private.write_audit_log();

alter table public.profiles enable row level security;
alter table public.team_members enable row level security;
alter table public.customers enable row level security;
alter table public.printers enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.order_files enable row level security;
alter table public.order_assignments enable row level security;
alter table public.approvals enable row level security;
alter table public.production_jobs enable row level security;
alter table public.production_events enable row level security;
alter table public.audit_logs enable row level security;

revoke all on all tables in schema public from anon;
revoke all on all sequences in schema public from anon;

grant usage on schema public to authenticated;
grant select, insert, update on public.profiles to authenticated;
grant select, insert, update on public.team_members to authenticated;
grant select, insert, update on public.customers to authenticated;
grant select, insert, update on public.printers to authenticated;
grant select, insert, update on public.orders to authenticated;
grant select, insert, update on public.order_items to authenticated;
grant select, insert, update on public.order_files to authenticated;
grant select, insert, update on public.order_assignments to authenticated;
grant select, insert, update on public.approvals to authenticated;
grant select, insert, update on public.production_jobs to authenticated;
grant select, insert on public.production_events to authenticated;
grant select on public.audit_logs to authenticated;
grant usage, select on all sequences in schema public to authenticated;

create policy profiles_read
on public.profiles for select to authenticated
using ((select app_private.has_role(array['admin'::public.app_role, 'commercial'::public.app_role, 'production'::public.app_role, 'viewer'::public.app_role])));

create policy profiles_update_self
on public.profiles for update to authenticated
using (id = (select auth.uid()))
with check (id = (select auth.uid()));

create policy profiles_admin_all
on public.profiles for all to authenticated
using ((select app_private.has_role(array['admin'::public.app_role])))
with check ((select app_private.has_role(array['admin'::public.app_role])));

create policy team_members_read
on public.team_members for select to authenticated
using ((select app_private.has_role(array['admin'::public.app_role, 'commercial'::public.app_role, 'production'::public.app_role, 'viewer'::public.app_role])));

create policy team_members_admin_write
on public.team_members for all to authenticated
using ((select app_private.has_role(array['admin'::public.app_role])))
with check ((select app_private.has_role(array['admin'::public.app_role])));

create policy customers_read
on public.customers for select to authenticated
using ((select app_private.has_role(array['admin'::public.app_role, 'commercial'::public.app_role, 'production'::public.app_role, 'viewer'::public.app_role])));

create policy customers_commercial_insert
on public.customers for insert to authenticated
with check ((select app_private.has_role(array['admin'::public.app_role, 'commercial'::public.app_role])));

create policy customers_commercial_update
on public.customers for update to authenticated
using ((select app_private.has_role(array['admin'::public.app_role, 'commercial'::public.app_role])))
with check ((select app_private.has_role(array['admin'::public.app_role, 'commercial'::public.app_role])));

create policy printers_read
on public.printers for select to authenticated
using ((select app_private.has_role(array['admin'::public.app_role, 'commercial'::public.app_role, 'production'::public.app_role, 'viewer'::public.app_role])));

create policy printers_admin_insert
on public.printers for insert to authenticated
with check ((select app_private.has_role(array['admin'::public.app_role])));

create policy printers_production_update
on public.printers for update to authenticated
using ((select app_private.has_role(array['admin'::public.app_role, 'production'::public.app_role])))
with check ((select app_private.has_role(array['admin'::public.app_role, 'production'::public.app_role])));

create policy orders_read
on public.orders for select to authenticated
using ((select app_private.has_role(array['admin'::public.app_role, 'commercial'::public.app_role, 'production'::public.app_role, 'viewer'::public.app_role])));

create policy orders_commercial_insert
on public.orders for insert to authenticated
with check ((select app_private.has_role(array['admin'::public.app_role, 'commercial'::public.app_role])));

create policy orders_operational_update
on public.orders for update to authenticated
using ((select app_private.has_role(array['admin'::public.app_role, 'commercial'::public.app_role, 'production'::public.app_role])))
with check ((select app_private.has_role(array['admin'::public.app_role, 'commercial'::public.app_role, 'production'::public.app_role])));

create policy order_items_read
on public.order_items for select to authenticated
using ((select app_private.has_role(array['admin'::public.app_role, 'commercial'::public.app_role, 'production'::public.app_role, 'viewer'::public.app_role])));

create policy order_items_commercial_insert
on public.order_items for insert to authenticated
with check ((select app_private.has_role(array['admin'::public.app_role, 'commercial'::public.app_role])));

create policy order_items_operational_update
on public.order_items for update to authenticated
using ((select app_private.has_role(array['admin'::public.app_role, 'commercial'::public.app_role, 'production'::public.app_role])))
with check ((select app_private.has_role(array['admin'::public.app_role, 'commercial'::public.app_role, 'production'::public.app_role])));

create policy order_files_read
on public.order_files for select to authenticated
using ((select app_private.has_role(array['admin'::public.app_role, 'commercial'::public.app_role, 'production'::public.app_role, 'viewer'::public.app_role])));

create policy order_files_operational_insert
on public.order_files for insert to authenticated
with check ((select app_private.has_role(array['admin'::public.app_role, 'commercial'::public.app_role, 'production'::public.app_role])));

create policy order_files_operational_update
on public.order_files for update to authenticated
using ((select app_private.has_role(array['admin'::public.app_role, 'commercial'::public.app_role, 'production'::public.app_role])))
with check ((select app_private.has_role(array['admin'::public.app_role, 'commercial'::public.app_role, 'production'::public.app_role])));

create policy order_assignments_read
on public.order_assignments for select to authenticated
using ((select app_private.has_role(array['admin'::public.app_role, 'commercial'::public.app_role, 'production'::public.app_role, 'viewer'::public.app_role])));

create policy order_assignments_operational_insert
on public.order_assignments for insert to authenticated
with check ((select app_private.has_role(array['admin'::public.app_role, 'commercial'::public.app_role, 'production'::public.app_role])));

create policy order_assignments_operational_update
on public.order_assignments for update to authenticated
using ((select app_private.has_role(array['admin'::public.app_role, 'commercial'::public.app_role, 'production'::public.app_role])))
with check ((select app_private.has_role(array['admin'::public.app_role, 'commercial'::public.app_role, 'production'::public.app_role])));

create policy approvals_read
on public.approvals for select to authenticated
using ((select app_private.has_role(array['admin'::public.app_role, 'commercial'::public.app_role, 'production'::public.app_role, 'viewer'::public.app_role])));

create policy approvals_commercial_insert
on public.approvals for insert to authenticated
with check ((select app_private.has_role(array['admin'::public.app_role, 'commercial'::public.app_role])));

create policy approvals_commercial_update
on public.approvals for update to authenticated
using ((select app_private.has_role(array['admin'::public.app_role, 'commercial'::public.app_role])))
with check ((select app_private.has_role(array['admin'::public.app_role, 'commercial'::public.app_role])));

create policy production_jobs_read
on public.production_jobs for select to authenticated
using ((select app_private.has_role(array['admin'::public.app_role, 'commercial'::public.app_role, 'production'::public.app_role, 'viewer'::public.app_role])));

create policy production_jobs_production_insert
on public.production_jobs for insert to authenticated
with check ((select app_private.has_role(array['admin'::public.app_role, 'production'::public.app_role])));

create policy production_jobs_production_update
on public.production_jobs for update to authenticated
using ((select app_private.has_role(array['admin'::public.app_role, 'production'::public.app_role])))
with check ((select app_private.has_role(array['admin'::public.app_role, 'production'::public.app_role])));

create policy production_events_read
on public.production_events for select to authenticated
using ((select app_private.has_role(array['admin'::public.app_role, 'commercial'::public.app_role, 'production'::public.app_role, 'viewer'::public.app_role])));

create policy production_events_production_insert
on public.production_events for insert to authenticated
with check ((select app_private.has_role(array['admin'::public.app_role, 'production'::public.app_role])));

create policy audit_logs_read
on public.audit_logs for select to authenticated
using ((select app_private.has_role(array['admin'::public.app_role, 'commercial'::public.app_role, 'production'::public.app_role, 'viewer'::public.app_role])));

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  (
    'order-files',
    'order-files',
    false,
    52428800,
    array[
      'image/jpeg', 'image/png', 'image/webp', 'image/heic',
      'application/pdf', 'application/zip',
      'model/stl', 'model/3mf', 'application/octet-stream'
    ]
  ),
  (
    'avatars',
    'avatars',
    false,
    5242880,
    array['image/jpeg', 'image/png', 'image/webp']
  )
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy storage_internal_read
on storage.objects for select to authenticated
using (
  bucket_id in ('order-files', 'avatars')
  and (select app_private.has_role(array['admin'::public.app_role, 'commercial'::public.app_role, 'production'::public.app_role, 'viewer'::public.app_role]))
);

create policy storage_operational_insert
on storage.objects for insert to authenticated
with check (
  bucket_id in ('order-files', 'avatars')
  and (select app_private.has_role(array['admin'::public.app_role, 'commercial'::public.app_role, 'production'::public.app_role]))
);

create policy storage_operational_update
on storage.objects for update to authenticated
using (
  bucket_id in ('order-files', 'avatars')
  and (select app_private.has_role(array['admin'::public.app_role, 'commercial'::public.app_role, 'production'::public.app_role]))
)
with check (
  bucket_id in ('order-files', 'avatars')
  and (select app_private.has_role(array['admin'::public.app_role, 'commercial'::public.app_role, 'production'::public.app_role]))
);

create policy storage_admin_delete
on storage.objects for delete to authenticated
using (
  bucket_id in ('order-files', 'avatars')
  and (select app_private.has_role(array['admin'::public.app_role]))
);

alter publication supabase_realtime add table
  public.orders,
  public.printers,
  public.production_jobs,
  public.production_events;
