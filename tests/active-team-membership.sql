-- Run with a trusted SQL connection on an isolated, migrated Supabase branch.
-- All fixtures are rolled back. Audit identity sequences are not transactional:
-- do not run this fixture suite on production.
begin;
set local statement_timeout = '30s';

do $$
declare
  administrator uuid := gen_random_uuid();
  applicant uuid := gen_random_uuid();
  customer uuid;
  order_id uuid;
begin
  -- Trusted test bootstrap only. No Auth API call, real email or password.
  perform set_config('request.jwt.claims', jsonb_build_object('sub', administrator, 'role', 'authenticated')::text, true);
  insert into auth.users(id, email, raw_app_meta_data, raw_user_meta_data, email_confirmed_at)
  values (administrator, 'test-admin-' || administrator || '@example.invalid', '{"role":"admin"}', '{}', now());
  insert into public.team_members(user_id, name, job_title, access_role)
  values (administrator, 'TEST SECURITY ADMIN', 'Admin', 'admin');

  -- Auth defaults plus user-editable metadata must not grant admission.
  insert into auth.users(id, email, raw_app_meta_data, raw_user_meta_data, email_confirmed_at)
  values (applicant, 'test-applicant-' || applicant || '@example.invalid', '{}', '{"role":"admin","is_active":true}', now());
  if (select role from public.profiles where id = applicant) <> 'viewer' then
    raise exception 'User metadata changed the default role';
  end if;
  insert into public.customers(name, phone)
  values ('TEST SECURITY CUSTOMER', '00000000000') returning id into customer;
  insert into public.orders(code, customer_id, project_name, category, promised_at)
  values ('TEST-SECURITY-' || gen_random_uuid(), customer, 'TEST SECURITY', 'other', current_date + 7)
  returning id into order_id;
  insert into public.order_items(order_id, category, name, quantity)
  values (order_id, 'other', 'TEST ITEM', 1);
  insert into public.order_files(order_id, object_path, file_name, mime_type)
  values (order_id, order_id || '/test.txt', 'test.txt', 'text/plain');
  -- Metadata fixture only, no file is uploaded or downloaded.
  insert into storage.objects(bucket_id, name)
  values ('order-files', order_id || '/test.txt'), ('avatars', applicant || '/test.txt');
  perform set_config('test.admission', jsonb_build_object('admin', administrator, 'applicant', applicant, 'order', order_id)::text, true);
end $$;

set local role authenticated;
do $$
declare
  x jsonb := current_setting('test.admission')::jsonb;
  relation text;
  records bigint;
  denied boolean;
  access_role public.app_role;
begin
  -- Check actual RLS, including the audit OR EXISTS branch and Storage.
  -- A profile alone grants no data, irrespective of its stored application role.
  foreach access_role in array array['viewer','commercial','production','designer','admin']::public.app_role[] loop
    perform set_config('request.jwt.claims', jsonb_build_object('sub', x->>'admin', 'role', 'authenticated')::text, true);
    update public.profiles set role = access_role where id = (x->>'applicant')::uuid;
    perform set_config('request.jwt.claims', jsonb_build_object('sub', x->>'applicant', 'role', 'authenticated', 'user_metadata', jsonb_build_object('role','admin'))::text, true);
    if app_private.has_role(array[access_role]) then raise exception 'Unlinked role admitted: %', access_role; end if;
    foreach relation in array array['profiles','team_members','customers','orders','order_items','order_files','order_assignments','approvals','printers','production_jobs','production_events','audit_logs','order_operational_summary'] loop
      execute format('select count(*) from public.%I', relation) into records;
      if records <> 0 then raise exception 'Unlinked % reads %', access_role, relation; end if;
    end loop;
    select count(*) into records from storage.objects where bucket_id in ('order-files','avatars');
    if records <> 0 then raise exception 'Unlinked role reads Storage metadata'; end if;
    if exists(select 1 from public.order_history((x->>'order')::uuid)) then raise exception 'Unlinked role reads history RPC'; end if;
    denied := false;
    begin
      perform public.prepare_team_access('test-denied@example.invalid', null, 'DENIED', 'admin', 'Admin', 1);
    exception when insufficient_privilege then denied := true;
    end;
    if not denied then raise exception 'Unlinked role provisions team'; end if;
    denied := false;
    begin
      perform public.operate_order((x->>'order')::uuid, 'note', now(), '{"note":"DENIED"}');
    exception when others then denied := true;
    end;
    if not denied then raise exception 'Unlinked role operates order'; end if;
    denied := false;
    begin
      insert into public.customers(name, phone) values('DENIED', '00000000000');
    exception when insufficient_privilege then denied := true;
    end;
    if not denied then raise exception 'Unlinked role writes customer'; end if;
  end loop;
end $$;

do $$
declare
  x jsonb := current_setting('test.admission')::jsonb;
  member jsonb;
  member_id uuid;
  affected integer;
  access_role public.app_role;
begin
  perform set_config('request.jwt.claims', jsonb_build_object('sub', x->>'admin', 'role', 'authenticated')::text, true);
  update public.profiles set role = 'viewer' where id = (x->>'applicant')::uuid;
  member := public.prepare_team_access('test-applicant-' || (x->>'applicant') || '@example.invalid', null, 'TEST INVITED VIEWER', 'viewer', 'Visualização', 1);
  member_id := (member->>'id')::uuid;
  perform public.link_team_access(member_id, (x->>'applicant')::uuid);
  -- Retrying the existing provisioner must preserve the single membership.
  perform public.link_team_access(member_id, (x->>'applicant')::uuid);
  if (select count(*) from public.team_members where user_id = (x->>'applicant')::uuid) <> 1 then
    raise exception 'Provisioner duplicated the membership';
  end if;

  -- Preserve the privileges of legitimately invited users. Financial scope of
  -- an invited viewer is deliberately not redesigned by this admission fix.
  foreach access_role in array array['viewer','commercial','production','designer','admin']::public.app_role[] loop
    perform set_config('request.jwt.claims', jsonb_build_object('sub', x->>'admin', 'role', 'authenticated')::text, true);
    update public.profiles set role = access_role where id = (x->>'applicant')::uuid;
    update public.team_members set access_role = (select p.role from public.profiles p where p.id = (x->>'applicant')::uuid) where id = member_id;
    perform set_config('request.jwt.claims', jsonb_build_object('sub', x->>'applicant', 'role', 'authenticated')::text, true);
    if not app_private.has_role(array[access_role]) then raise exception 'Linked role rejected: %', access_role; end if;
    if access_role <> 'admin' and app_private.has_role(array['admin']::public.app_role[]) then raise exception 'Role escalated'; end if;
    if not exists(select 1 from public.profiles where id = (x->>'applicant')::uuid) then raise exception 'Own profile unavailable'; end if;
    if access_role in ('viewer','production','admin') and not exists(select 1 from public.orders where id = (x->>'order')::uuid) then
      raise exception 'Authorized order unavailable';
    end if;
    if access_role = 'viewer' then
      if not exists(select 1 from public.audit_logs where record_id = (x->>'order')::uuid) then raise exception 'Invited viewer history changed'; end if;
      if not exists(select 1 from storage.objects where bucket_id = 'order-files' and name = (x->>'order') || '/test.txt') then raise exception 'Authorized file metadata unavailable'; end if;
      begin
        update public.profiles set role = 'admin' where id = (x->>'applicant')::uuid;
        get diagnostics affected = row_count;
      exception when others then affected := 0;
      end;
      if affected <> 0 then raise exception 'Viewer escalated own role'; end if;
    end if;
  end loop;

  -- Existing JWT claims do not retain access after membership deactivation.
  perform set_config('request.jwt.claims', jsonb_build_object('sub', x->>'admin', 'role', 'authenticated')::text, true);
  update public.team_members set is_active = false where id = member_id;
  perform set_config('request.jwt.claims', jsonb_build_object('sub', x->>'applicant', 'role', 'authenticated')::text, true);
  if app_private.has_role(array['admin']::public.app_role[]) or exists(select 1 from public.orders) then raise exception 'Inactive member retained access'; end if;

  perform set_config('request.jwt.claims', jsonb_build_object('sub', x->>'admin', 'role', 'authenticated')::text, true);
  update public.team_members set is_active = true, deleted_at = now() where id = member_id;
  perform set_config('request.jwt.claims', jsonb_build_object('sub', x->>'applicant', 'role', 'authenticated')::text, true);
  if app_private.has_role(array['admin']::public.app_role[]) or exists(select 1 from public.audit_logs) then raise exception 'Deleted member retained access'; end if;

  perform set_config('request.jwt.claims', jsonb_build_object('sub', x->>'admin', 'role', 'authenticated')::text, true);
  update public.team_members set deleted_at = null where id = member_id;
  update public.profiles set is_active = false where id = (x->>'applicant')::uuid;
  perform set_config('request.jwt.claims', jsonb_build_object('sub', x->>'applicant', 'role', 'authenticated')::text, true);
  if app_private.has_role(array['admin']::public.app_role[]) or exists(select 1 from public.customers) then raise exception 'Inactive profile retained access'; end if;
end $$;

reset role;
set local role anon;
do $$
declare relation text; denied boolean;
begin
  foreach relation in array array['profiles','team_members','customers','orders','order_items','order_files','order_assignments','approvals','printers','production_jobs','production_events','audit_logs','order_operational_summary'] loop
    denied := false;
    begin execute format('select 1 from public.%I limit 1', relation);
    exception when insufficient_privilege then denied := true;
    end;
    if not denied then raise exception 'Anonymous table access: %', relation; end if;
  end loop;
end $$;
reset role;
do $$
begin
  if has_function_privilege('anon', 'app_private.has_role(public.app_role[])', 'execute') then raise exception 'Anonymous helper grant'; end if;
  if not has_function_privilege('authenticated', 'app_private.has_role(public.app_role[])', 'execute') then raise exception 'Authenticated helper grant lost'; end if;
  if not exists(select 1 from pg_proc where oid = 'app_private.has_role(public.app_role[])'::regprocedure
    and prosecdef and pg_get_userbyid(proowner) = 'postgres' and proconfig @> array['search_path=""']) then
    raise exception 'Private helper owner/security changed';
  end if;
end $$;
select 'PASS: admission, 5 roles, RLS, history, Storage metadata, provisioning, inactive/deleted membership and anon' as result;
rollback;
