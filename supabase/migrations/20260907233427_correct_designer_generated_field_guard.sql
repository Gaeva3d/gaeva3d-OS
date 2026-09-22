create or replace function app_private.guard_order_operational_changes() returns trigger
language plpgsql security invoker set search_path='' as $$
declare r public.app_role;
begin
 select role into r from public.profiles where id=auth.uid() and is_active;
 if r='admin' or (auth.uid() is null and current_user in ('postgres','supabase_admin')) then return new; end if;
 if r='designer' then
   if (to_jsonb(new)-array['status','internal_notes','updated_at','updated_by','balance_value']) is distinct from
      (to_jsonb(old)-array['status','internal_notes','updated_at','updated_by','balance_value'])
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
