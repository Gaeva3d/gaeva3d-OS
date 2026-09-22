-- Minimal missing metadata on the existing entities.
alter table public.order_assignments add column role_in_order text not null default 'production'
  check (role_in_order in ('production', 'designer', 'shipping'));
create unique index order_assignments_current_designer_idx
  on public.order_assignments(order_id) where is_current and role_in_order = 'designer';
alter table public.orders
  add column shipping_address text,
  add column shipping_method text,
  add column carrier text,
  add column tracking_code text,
  add column shipped_at timestamptz;

-- A pure projection of existing status values, never a second stored status.
create function app_private.order_stage(s text) returns text
language sql immutable security invoker set search_path = '' as $$
 select case s
 when 'received' then 'new' when 'briefing_pending' then 'confirmation'
 when 'modeling' then 'design' when 'internal_review' then 'design'
 when 'awaiting_customer_approval' then 'approval'
 when 'approved_for_production' then 'printing' when 'print_queue' then 'printing' when 'printing' then 'printing'
 when 'finishing' then 'ready' when 'quality_control' then 'ready' when 'packaging' then 'ready'
 when 'shipping' then 'shipping' when 'completed' then 'completed' else null end;
$$;

-- Existing role helper remains authoritative. Designers reuse profiles and team_members.
alter policy profiles_read on public.profiles using ((select app_private.has_role(array['admin','commercial','production','viewer','designer']::public.app_role[])));
alter policy team_members_read on public.team_members using ((select app_private.has_role(array['admin','commercial','production','viewer','designer']::public.app_role[])));
alter policy printers_read on public.printers using ((select app_private.has_role(array['admin','commercial','production','viewer','designer']::public.app_role[])));

alter policy order_assignments_read on public.order_assignments using (
 (select app_private.has_role(array['admin','commercial','production','viewer']::public.app_role[]))
 or ((select app_private.has_role(array['designer']::public.app_role[])) and assigned_to in
   (select id from public.team_members where user_id = (select auth.uid()) and is_active and deleted_at is null))
);
alter policy orders_read on public.orders using (
 (select app_private.has_role(array['admin','production','viewer']::public.app_role[]))
 or ((select app_private.has_role(array['commercial']::public.app_role[])) and
    (created_by = (select auth.uid()) or assigned_to in
      (select id from public.team_members where user_id = (select auth.uid()) and is_active and deleted_at is null)))
 or ((select app_private.has_role(array['designer']::public.app_role[])) and exists (
   select 1 from public.order_assignments a join public.team_members t on t.id=a.assigned_to
   where a.order_id=orders.id and a.role_in_order='designer' and a.is_current
     and t.user_id=(select auth.uid()) and t.is_active and t.deleted_at is null))
);
alter policy orders_operational_update on public.orders using (
 (select app_private.has_role(array['admin','production']::public.app_role[]))
 or ((select app_private.has_role(array['commercial']::public.app_role[])) and created_by=(select auth.uid()))
 or ((select app_private.has_role(array['designer']::public.app_role[])) and exists (
   select 1 from public.order_assignments a join public.team_members t on t.id=a.assigned_to
   where a.order_id=orders.id and a.role_in_order='designer' and a.is_current
     and t.user_id=(select auth.uid()) and t.is_active and t.deleted_at is null))
) with check (
 (select app_private.has_role(array['admin','production']::public.app_role[]))
 or ((select app_private.has_role(array['commercial']::public.app_role[])) and created_by=(select auth.uid()))
 or ((select app_private.has_role(array['designer']::public.app_role[])) and exists (
   select 1 from public.order_assignments a join public.team_members t on t.id=a.assigned_to
   where a.order_id=orders.id and a.role_in_order='designer' and a.is_current
     and t.user_id=(select auth.uid()) and t.is_active and t.deleted_at is null))
);
alter policy customers_read on public.customers using (
 (select app_private.has_role(array['admin','commercial','production','viewer']::public.app_role[]))
 or ((select app_private.has_role(array['designer']::public.app_role[])) and exists
    (select 1 from public.orders o where o.customer_id=customers.id and o.deleted_at is null))
);
-- Child reads inherit the order's visibility instead of granting designers global access.
alter policy order_items_read on public.order_items using (exists(select 1 from public.orders o where o.id=order_id));
alter policy order_files_read on public.order_files using (exists(select 1 from public.orders o where o.id=order_id));
alter policy approvals_read on public.approvals using (exists(select 1 from public.orders o where o.id=order_id));
alter policy production_jobs_read on public.production_jobs using (exists(select 1 from public.orders o where o.id=order_id));
alter policy production_events_read on public.production_events using (exists(select 1 from public.orders o where o.id=order_id));
alter policy audit_logs_read on public.audit_logs using (
 (select app_private.has_role(array['admin','production','viewer']::public.app_role[]))
 or exists (select 1 from public.orders o where
   (audit_logs.table_name='orders' and o.id=audit_logs.record_id)
   or o.id::text=coalesce(audit_logs.new_values->>'order_id',audit_logs.old_values->>'order_id'))
);
alter policy order_files_operational_insert on public.order_files with check (
 (select app_private.has_role(array['admin','commercial','production','designer']::public.app_role[]))
 and exists (select 1 from public.orders o where o.id=order_id and o.deleted_at is null));
alter policy order_files_operational_update on public.order_files using (
 (select app_private.has_role(array['admin','commercial','production','designer']::public.app_role[]))
 and exists (select 1 from public.orders o where o.id=order_id and o.deleted_at is null)) with check (
 (select app_private.has_role(array['admin','commercial','production','designer']::public.app_role[]))
 and exists (select 1 from public.orders o where o.id=order_id and o.deleted_at is null));
alter policy approvals_commercial_insert on public.approvals with check (
 exists(select 1 from public.orders o where o.id=order_id and o.deleted_at is null) and (
 (select app_private.has_role(array['admin','commercial']::public.app_role[])) or
 (status='pending' and (select app_private.has_role(array['production','designer']::public.app_role[])))));
alter policy approvals_commercial_update on public.approvals using (
 (select app_private.has_role(array['admin','commercial']::public.app_role[]))
 and exists(select 1 from public.orders o where o.id=order_id and o.deleted_at is null)) with check (
 (select app_private.has_role(array['admin','commercial']::public.app_role[]))
 and exists(select 1 from public.orders o where o.id=order_id and o.deleted_at is null));
alter policy production_events_production_insert on public.production_events with check (
 (select app_private.has_role(array['admin','commercial','production','designer']::public.app_role[]))
 and exists(select 1 from public.orders o where o.id=order_id and o.deleted_at is null));
alter policy order_assignments_operational_insert on public.order_assignments with check (
 (select app_private.has_role(array['admin','production']::public.app_role[])));
alter policy order_assignments_operational_update on public.order_assignments using (
 (select app_private.has_role(array['admin','production']::public.app_role[]))) with check (
 (select app_private.has_role(array['admin','production']::public.app_role[])));

-- Private object paths already start with order UUID. Never expose unrelated attachments.
alter policy storage_internal_read on storage.objects using (
 (bucket_id='avatars' and (select app_private.has_role(array['admin','commercial','production','viewer','designer']::public.app_role[])))
 or (bucket_id='order-files' and exists(select 1 from public.orders o where o.id::text=split_part(name,'/',1) and o.deleted_at is null)));
alter policy storage_operational_insert on storage.objects with check (
 (bucket_id='avatars' and (select app_private.has_role(array['admin','commercial','production']::public.app_role[])))
 or (bucket_id='order-files' and (select app_private.has_role(array['admin','commercial','production','designer']::public.app_role[]))
 and exists(select 1 from public.orders o where o.id::text=split_part(name,'/',1) and o.deleted_at is null)));
alter policy storage_operational_update on storage.objects using (
 (bucket_id='avatars' and (select app_private.has_role(array['admin','commercial','production']::public.app_role[])))
 or (bucket_id='order-files' and (select app_private.has_role(array['admin','commercial','production','designer']::public.app_role[]))
 and exists(select 1 from public.orders o where o.id::text=split_part(name,'/',1) and o.deleted_at is null))) with check (
 (bucket_id='avatars' and (select app_private.has_role(array['admin','commercial','production']::public.app_role[])))
 or (bucket_id='order-files' and (select app_private.has_role(array['admin','commercial','production','designer']::public.app_role[]))
 and exists(select 1 from public.orders o where o.id::text=split_part(name,'/',1) and o.deleted_at is null)));

-- Field-level enforcement also protects writes from the existing detail/table screens.
create function app_private.guard_order_operational_changes() returns trigger
language plpgsql security invoker set search_path='' as $$
declare r public.app_role;
begin
 select role into r from public.profiles where id=auth.uid() and is_active;
 if r='admin' or (auth.uid() is null and current_user in ('postgres','supabase_admin')) then return new; end if;
 if r='designer' then
   if (to_jsonb(new)-array['status','internal_notes','updated_at','updated_by']) is distinct from
      (to_jsonb(old)-array['status','internal_notes','updated_at','updated_by'])
      or old.status not in ('modeling','internal_review')
      or new.status not in ('modeling','internal_review','awaiting_customer_approval') then
     raise exception 'Designer só pode atualizar a modelagem atribuída e enviar para aprovação';
   end if;
 elsif r='commercial' then
   if (new.initial_printer_id,new.briefing_complete,new.block_reason,new.shipped_at)
      is distinct from (old.initial_printer_id,old.briefing_complete,old.block_reason,old.shipped_at)
      or (new.assigned_to is distinct from old.assigned_to and not (
        old.status='awaiting_customer_approval' and new.status in ('modeling','print_queue') and
        new.assigned_to is not distinct from (select a.assigned_to from public.order_assignments a
          where a.order_id=old.id and a.is_current and a.role_in_order=case when new.status='modeling' then 'designer' else 'production' end
          order by a.assigned_at desc limit 1)))
      or (new.status is distinct from old.status and not
          (old.status='awaiting_customer_approval' and new.status in ('modeling','print_queue'))) then
     raise exception 'Comercial não pode controlar livremente etapas produtivas';
   end if;
 elsif r='production' then
   if (new.total_value,new.deposit_value,new.payment_status,new.customer_id,new.created_by,new.deleted_at)
      is distinct from (old.total_value,old.deposit_value,old.payment_status,old.customer_id,old.created_by,old.deleted_at) then
     raise exception 'Produção não pode alterar dados financeiros ou administrativos';
   end if;
 else raise exception 'Sem permissão para alterar este pedido';
 end if;
 return new;
end;
$$;
create trigger guard_order_operational_changes before update on public.orders
for each row execute function app_private.guard_order_operational_changes();

-- A newer change request must invalidate an older approval, including outside the Kanban.
create function app_private.latest_order_approved(oid uuid) returns boolean
language sql stable security invoker set search_path='' as $$
 select coalesce((select status='approved' from public.approvals where order_id=oid
 order by version desc,created_at desc,id desc limit 1),false);
$$;
create or replace function app_private.validate_order_business_rules() returns trigger
language plpgsql security invoker set search_path='' as $$
begin
 if new.priority in ('urgent','critical') and nullif(btrim(new.urgency_reason),'') is null then
   raise exception 'Urgência exige motivo'; end if;
 if new.status='blocked' and nullif(btrim(new.block_reason),'') is null then
   raise exception 'Bloqueio exige motivo'; end if;
 if new.status in ('approved_for_production','print_queue','printing')
   and not app_private.latest_order_approved(new.id) then
   raise exception 'A versão atual precisa estar aprovada antes da impressão'; end if;
 new.updated_by := coalesce(auth.uid(),new.updated_by);
 return new;
end;
$$;
create or replace function app_private.validate_production_job() returns trigger
language plpgsql security invoker set search_path='' as $$
begin
 if new.status in ('queued','running') and not app_private.latest_order_approved(new.order_id) then
   raise exception 'A versão atual precisa estar aprovada antes de produzir'; end if;
 return new;
end;
$$;

-- Indexed audit projection; edits within the same visual stage do not reset stage age.
create view public.order_operational_summary with (security_invoker=true) as
select o.*,coalesce(items.quantity,0)::integer as quantity,
 c.name as customer_name,c.phone as customer_phone,c.city,c.state,
 seller.full_name as seller_name,owner.name as owner_name,
 designer.assigned_to as designer_id,designer.name as designer_name,
 coalesce(app_private.order_stage(o.status::text),last_stage.stage,'confirmation') as stage,
 coalesce(entered.created_at,o.created_at) as stage_entered_at,
 coalesce(revisions.total,0)::integer as revision_count,
 latest.version as approval_version,latest.status as approval_status,latest.created_at as approval_sent_at,
 job.status as job_status,job.failure_reason as print_failure_reason,
 modeled.started_at as modeling_started_at,
 thumb.object_path as thumbnail_path,thumb.bucket_id as thumbnail_bucket
from public.orders o
join public.customers c on c.id=o.customer_id
left join public.profiles seller on seller.id=o.created_by
left join public.team_members owner on owner.id=o.assigned_to
left join lateral (select sum(quantity) quantity from public.order_items where order_id=o.id and deleted_at is null) items on true
left join lateral (select a.assigned_to,t.name from public.order_assignments a
 join public.team_members t on t.id=a.assigned_to where a.order_id=o.id and a.is_current and a.role_in_order='designer'
 order by a.assigned_at desc limit 1) designer on true
left join lateral (select app_private.order_stage(new_values->>'status') stage from public.audit_logs
 where table_name='orders' and record_id=o.id and app_private.order_stage(new_values->>'status') is not null
 order by created_at desc,id desc limit 1) last_stage on true
left join lateral (select created_at from public.audit_logs
 where table_name='orders' and record_id=o.id
 and app_private.order_stage(new_values->>'status')=coalesce(app_private.order_stage(o.status::text),last_stage.stage,'confirmation')
 and (action='INSERT' or (old_values->>'status'<>'blocked' and
 app_private.order_stage(old_values->>'status') is distinct from app_private.order_stage(new_values->>'status')))
 order by created_at desc,id desc limit 1) entered on true
left join lateral (select count(*) total from public.approvals where order_id=o.id and status='changes_requested') revisions on true
left join lateral (select version,status,created_at from public.approvals where order_id=o.id order by version desc,created_at desc,id desc limit 1) latest on true
left join lateral (select status,failure_reason from public.production_jobs where order_id=o.id order by created_at desc,id desc limit 1) job on true
left join lateral (select max(created_at) started_at from public.production_events where order_id=o.id
 and notes='Modelagem iniciada' and created_at>=coalesce(entered.created_at,o.created_at)) modeled on true
left join lateral (select object_path,bucket_id from public.order_files where order_id=o.id and deleted_at is null and mime_type like 'image/%'
 order by case when category in ('model','approval') then 0 else 1 end,created_at desc limit 1) thumb on true
where o.deleted_at is null;
revoke all on public.order_operational_summary from anon;
grant select on public.order_operational_summary to authenticated;

-- One transaction per operational action, with optimistic concurrency and existing RLS.
create function public.operate_order(p_order_id uuid,p_action text,p_expected_updated_at timestamptz,p_payload jsonb default '{}'::jsonb)
returns jsonb language plpgsql security invoker set search_path='' as $$
declare
 o public.orders; r public.app_role; member uuid; target public.order_status;
 a public.approvals; j public.production_jobs; new_job uuid; v integer;
 action text := p_action; note text := nullif(btrim(p_payload->>'note'),'');
 current_stage text; target_stage text; exceptional boolean := false; event_note text;
begin
 select role into r from public.profiles where id=auth.uid() and is_active;
 if r is null or r='viewer' then raise exception 'Sem permissão para esta ação'; end if;
 select * into o from public.orders where id=p_order_id and deleted_at is null for update;
 if not found then raise exception 'Pedido indisponível para este usuário'; end if;
 if p_expected_updated_at is null or o.updated_at<>p_expected_updated_at then
   raise exception 'O pedido foi atualizado por outra pessoa. Atualize e tente novamente.'; end if;
 select id into member from public.team_members where user_id=auth.uid() and is_active and deleted_at is null limit 1;
 current_stage := app_private.order_stage(o.status::text);
 if action='move' then
   target := (p_payload->>'status')::public.order_status;
   if target is null then raise exception 'Selecione uma etapa'; end if;
   target_stage := app_private.order_stage(target::text);
   if target=o.status then return to_jsonb(o); end if;
   action := case
    when current_stage='new' and target_stage='confirmation' then 'assume'
    when current_stage='confirmation' and target_stage='design' then 'confirm'
    when current_stage='design' and target_stage='approval' then 'send_approval'
    when current_stage='approval' and target_stage='printing' then 'approve'
    when current_stage='approval' and target_stage='design' then 'request_changes'
    when current_stage='printing' and target_stage='ready' then 'complete_print'
    when current_stage='ready' and target_stage='shipping' then 'release'
    when current_stage='shipping' and target_stage='completed' then 'finish'
    when current_stage=target_stage and target='printing' then 'start_print'
    when current_stage=target_stage and target='quality_control' then 'quality'
    when current_stage=target_stage and target='packaging' then 'pack'
    else 'exceptional_move' end;
 end if;
 if r='designer' and (action not in ('start_modeling','send_approval','note') or not exists (
   select 1 from public.order_assignments x where x.order_id=o.id and x.assigned_to=member and x.is_current and x.role_in_order='designer')) then
   raise exception 'Designer só pode atuar nos pedidos atribuídos'; end if;
 if r='commercial' and (action not in ('approve','request_changes','note','shipping_details') or o.created_by is distinct from auth.uid()) then
   raise exception 'Ação não permitida ao Comercial'; end if;
 if action in ('approve','request_changes') and r not in ('admin','commercial') then
   raise exception 'Aprovação do cliente deve ser registrada pelo Comercial ou Administração'; end if;

 case action
 when 'assume' then
   if o.status<>'received' then raise exception 'Pedido já assumido'; end if;
   if member is null then raise exception 'Vincule seu usuário a um membro ativo da equipe'; end if;
   update public.orders set assigned_to=member,status='briefing_pending' where id=o.id;
   insert into public.order_assignments(order_id,assigned_to,role_in_order) values(o.id,member,'production');
   event_note := 'Produção assumiu o pedido';
 when 'missing' then
   if o.status<>'briefing_pending' or note is null then raise exception 'Informe o que falta na confirmação'; end if;
   update public.orders set block_reason=note,briefing_complete=false where id=o.id;
   event_note := 'Aguardando cliente: '||note;
 when 'confirm' then
   if o.status<>'briefing_pending' then raise exception 'O pedido precisa estar em confirmação'; end if;
   if coalesce((p_payload->>'confirmed')::boolean,false)=false then raise exception 'Confirme as informações do pedido'; end if;
   select assigned_to into member from public.order_assignments where order_id=o.id and is_current and role_in_order='designer' limit 1;
   update public.orders set briefing_complete=true,block_reason=null,status='modeling',assigned_to=coalesce(member,assigned_to) where id=o.id;
   event_note := 'Informações confirmadas pela Produção; enviado para Designer 3D';
 when 'assign_designer' then
   member := nullif(p_payload->>'member_id','')::uuid;
   if member is not null and not exists(select 1 from public.team_members where id=member and is_active and deleted_at is null) then raise exception 'Selecione um membro ativo'; end if;
   update public.order_assignments set is_current=false,unassigned_at=now() where order_id=o.id and role_in_order='designer' and is_current;
   if member is not null then insert into public.order_assignments(order_id,assigned_to,role_in_order) values(o.id,member,'designer'); end if;
   update public.orders set assigned_to=case when current_stage='design' then member else assigned_to end,updated_at=now() where id=o.id;
   event_note := case when member is null then 'Designer removido da atribuição atual' else 'Designer atribuído: '||(select name from public.team_members where id=member) end;
 when 'start_modeling' then
   if current_stage<>'design' then raise exception 'Pedido fora da etapa de modelagem'; end if;
   select assigned_to into member from public.order_assignments where order_id=o.id and is_current and role_in_order='designer' limit 1;
   if member is null then raise exception 'Atribua um designer existente antes de iniciar'; end if;
   update public.orders set status='modeling' where id=o.id;
   event_note := 'Modelagem iniciada';
 when 'send_approval' then
   if current_stage<>'design' then raise exception 'Pedido fora da etapa de modelagem'; end if;
   select coalesce(max(version),0)+1 into v from public.approvals where order_id=o.id;
   insert into public.approvals(order_id,version,status,notes) values(o.id,v,'pending',note);
   update public.orders set status='awaiting_customer_approval' where id=o.id;
   event_note := 'Modelo v'||v||' enviado para aprovação';
 when 'approve','request_changes' then
   if o.status<>'awaiting_customer_approval' then raise exception 'Pedido fora da etapa de aprovação'; end if;
   if action='request_changes' and note is null then raise exception 'Descreva a alteração solicitada'; end if;
   select * into a from public.approvals where order_id=o.id order by version desc,created_at desc,id desc limit 1 for update;
   if a.id is null or a.status<>'pending' then raise exception 'Nenhuma versão aguardando aprovação'; end if;
   update public.approvals set status=case when action='approve' then 'approved'::public.approval_status else 'changes_requested'::public.approval_status end,
     decided_at=now(),decided_by=auth.uid(),notes=concat_ws(E'\n',notes,note) where id=a.id;
   select assigned_to into member from public.order_assignments where order_id=o.id and is_current
     and role_in_order=case when action='approve' then 'production' else 'designer' end order by assigned_at desc limit 1;
   update public.orders set status=case when action='approve' then 'print_queue'::public.order_status else 'modeling'::public.order_status end,
     assigned_to=member where id=o.id;
   event_note := case when action='approve' then 'Modelo v'||a.version||' aprovado; enviado para impressão' else 'Alteração solicitada na v'||a.version||': '||note end;
 when 'start_print' then
   if current_stage<>'printing' then raise exception 'Pedido fora da fila de impressão'; end if;
   select * into j from public.production_jobs where order_id=o.id order by created_at desc,id desc limit 1;
   if j.status='running' then raise exception 'Impressão já iniciada'; end if;
   if j.status in ('queued','paused') then
     update public.production_jobs set status='running',started_at=coalesce(started_at,now()) where id=j.id returning id into new_job;
   else
     insert into public.production_jobs(order_id,printer_id,assigned_to,status,started_at,attempt_number,reprint_of_id)
     values(o.id,o.initial_printer_id,o.assigned_to,'running',now(),coalesce(j.attempt_number,0)+1,case when j.status='failed' then j.id else null end) returning id into new_job;
   end if;
   update public.orders set status='printing' where id=o.id;
   insert into public.production_events(order_id,production_job_id,event_type,is_reprint,notes)
     values(o.id,new_job,case when j.status='failed' then 'reprint'::public.production_event_type else 'started'::public.production_event_type end,j.status is not distinct from 'failed','Impressão iniciada');
 when 'fail_print' then
   if o.status<>'printing' or note is null then raise exception 'Informe o motivo da falha da impressão em andamento'; end if;
   select * into j from public.production_jobs where order_id=o.id and status='running' order by created_at desc limit 1 for update;
   if j.id is null then raise exception 'Nenhuma impressão em andamento'; end if;
   update public.production_jobs set status='failed',failure_reason=note,finished_at=now() where id=j.id;
   update public.orders set status='print_queue' where id=o.id;
   insert into public.production_events(order_id,production_job_id,event_type,failure_reason,notes) values(o.id,j.id,'failed',note,'Falha na impressão: '||note);
 when 'complete_print' then
   if current_stage<>'printing' then raise exception 'Pedido fora da impressão'; end if;
   select * into j from public.production_jobs where order_id=o.id and status='running' order by created_at desc limit 1 for update;
   if j.id is null then raise exception 'Inicie a impressão antes de concluí-la'; end if;
   update public.production_jobs set status='completed',finished_at=now() where order_id=o.id and status='running';
   update public.orders set status='finishing' where id=o.id;
   insert into public.production_events(order_id,production_job_id,event_type,notes) values(o.id,j.id,'completed','Impressão concluída; pedido pronto para conferência');
 when 'quality','pack','release' then
   if current_stage<>'ready' then raise exception 'Pedido fora da conferência final'; end if;
   if action='release' and coalesce((p_payload->>'confirmed')::boolean,false)=false then raise exception 'Confirme qualidade, quantidade, acabamento, itens e embalagem'; end if;
   update public.orders set status=case action when 'quality' then 'quality_control'::public.order_status when 'pack' then 'packaging'::public.order_status else 'shipping'::public.order_status end where id=o.id;
   event_note := case action when 'quality' then 'Conferência de qualidade iniciada' when 'pack' then 'Conferência concluída; aguardando embalagem' else 'Peça, quantidade, qualidade, acabamento, itens adicionais e embalagem conferidos; liberado para postagem' end;
 when 'shipping_details' then
   update public.orders set shipping_address=nullif(p_payload->>'shipping_address',''),shipping_method=nullif(p_payload->>'shipping_method',''),carrier=nullif(p_payload->>'carrier',''),tracking_code=nullif(p_payload->>'tracking_code','') where id=o.id;
   event_note := 'Dados de envio atualizados';
 when 'ship' then
   if o.status<>'shipping' or o.shipped_at is not null then raise exception 'Pedido não está aguardando postagem'; end if;
   update public.orders set shipped_at=now(),tracking_code=coalesce(nullif(p_payload->>'tracking_code',''),tracking_code) where id=o.id;
   event_note := 'Postagem registrada';
 when 'finish' then
   if o.status<>'shipping' or o.shipped_at is null then raise exception 'Registre a postagem antes de finalizar'; end if;
   update public.orders set status='completed' where id=o.id;
   event_note := 'Pedido finalizado';
 when 'assign_owner' then
   member := nullif(p_payload->>'member_id','')::uuid;
   if member is not null and not exists(select 1 from public.team_members where id=member and is_active and deleted_at is null) then raise exception 'Selecione um membro ativo'; end if;
   update public.orders set assigned_to=member where id=o.id;
   event_note := 'Responsável atual atualizado';
 when 'priority' then
   update public.orders set priority=(p_payload->>'priority')::public.priority_level,urgency_reason=coalesce(note,urgency_reason) where id=o.id;
   event_note := 'Prioridade atualizada'||case when note is null then '' else ': '||note end;
 when 'note' then
   if note is null then raise exception 'Escreva uma observação'; end if;
   -- Touch once for concurrency without changing operational status or stage age.
   update public.orders set updated_at=now() where id=o.id;
   event_note := note;
 when 'exceptional_move' then
   if r<>'admin' or note is null then raise exception 'Movimentação excepcional exige administrador e justificativa'; end if;
   update public.orders set status=target,block_reason=case when target='blocked' then note else null end where id=o.id;
   event_note := 'Movimentação excepcional: '||o.status||' → '||target||'. '||note;
 else raise exception 'Ação operacional desconhecida';
 end case;
 if event_note is not null then insert into public.production_events(order_id,event_type,notes) values(o.id,'note',event_note); end if;
 select * into o from public.orders where id=o.id;
 return to_jsonb(o);
end;
$$;
revoke all on function public.operate_order(uuid,text,timestamptz,jsonb) from public,anon;
grant execute on function public.operate_order(uuid,text,timestamptz,jsonb) to authenticated;
revoke all on function app_private.order_stage(text),app_private.latest_order_approved(uuid),app_private.guard_order_operational_changes() from public,anon;
grant execute on function app_private.order_stage(text),app_private.latest_order_approved(uuid),app_private.guard_order_operational_changes() to authenticated;

-- Complete order timeline including child entity mutations, using the same immutable audit log.
create function public.order_history(p_order_id uuid,p_before_id bigint default null,p_limit integer default 100)
returns setof public.audit_logs language sql stable security invoker set search_path='' as $$
 select a.* from public.audit_logs a
 where exists(select 1 from public.orders o where o.id=p_order_id)
 and ((a.table_name='orders' and a.record_id=p_order_id)
   or coalesce(a.new_values->>'order_id',a.old_values->>'order_id')=p_order_id::text)
 and (p_before_id is null or a.id<p_before_id)
 order by a.id desc limit least(greatest(p_limit,1),200);
$$;
revoke all on function public.order_history(uuid,bigint,integer) from public,anon;
grant execute on function public.order_history(uuid,bigint,integer) to authenticated;
create index audit_logs_order_relation_idx on public.audit_logs
 ((coalesce(new_values->>'order_id',old_values->>'order_id')),id desc)
 where coalesce(new_values->>'order_id',old_values->>'order_id') is not null;
