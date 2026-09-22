-- Run against an isolated branch, or transactionally with a trusted SQL connection.
-- All fixtures (including Auth users) are rolled back. No customer/order sequences consumed.
begin;
select set_config('request.jwt.claims',jsonb_build_object('sub',(select id from public.profiles where role='admin' and is_active limit 1),'role','authenticated')::text,true);
do $$
declare admin_id uuid:=auth.uid(); commercial_id uuid:=gen_random_uuid(); production_id uuid:=gen_random_uuid(); designer_id uuid:=gen_random_uuid(); viewer_id uuid:=gen_random_uuid();
 c uuid; o uuid; other_order uuid; designer_member uuid; production_member uuid; machine uuid;
begin
 if admin_id is null then raise exception 'An existing active admin is required for this test'; end if;
 insert into auth.users(id,email,raw_app_meta_data,raw_user_meta_data,email_confirmed_at)
 select id,'test-kanban-'||id||'@example.invalid','{}','{}',now() from unnest(array[commercial_id,production_id,designer_id,viewer_id]) id;
 update public.profiles set role='commercial' where id=commercial_id;
 update public.profiles set role='production' where id=production_id;
 update public.profiles set role='designer' where id=designer_id;
 -- Legitimate operators must have an active membership. Unlinked identities
 -- are covered separately by active-team-membership.sql.
 insert into public.team_members(user_id,name,job_title,access_role)
 values(commercial_id,'TESTE COMERCIAL','Comercial','commercial'),
       (viewer_id,'TESTE VISUALIZACAO','Visualização','viewer');
 insert into public.team_members(user_id,name,job_title,access_role) values(designer_id,'TESTE DESIGNER','Designer 3D','designer') returning id into designer_member;
 insert into public.team_members(user_id,name,job_title,access_role) values(production_id,'TESTE PRODUCAO','Produção','production') returning id into production_member;
 select id into machine from public.printers where deleted_at is null limit 1;
 insert into public.customers(name,phone) values('TESTE KANBAN TRANSACIONAL','00000000000') returning id into c;
 insert into public.orders(code,customer_id,project_name,category,promised_at,created_by,initial_printer_id)
 values('TEST-KANBAN-'||gen_random_uuid(),c,'TESTE KANBAN','other',current_date+7,commercial_id,machine) returning id into o;
 insert into public.order_items(order_id,category,name,quantity) values(o,'other','Item A',2),(o,'other','Item B',3);
 insert into public.orders(code,customer_id,project_name,category,promised_at,created_by)
 values('TEST-KANBAN-'||gen_random_uuid(),c,'TESTE OUTRO','other',current_date+7,admin_id) returning id into other_order;
 perform set_config('test.kanban',jsonb_build_object('admin',admin_id,'commercial',commercial_id,'production',production_id,'designer',designer_id,'viewer',viewer_id,'order',o,'other_order',other_order,'designer_member',designer_member,'production_member',production_member)::text,true);
end $$;
set local role authenticated;
do $$
declare x jsonb:=current_setting('test.kanban')::jsonb; oid uuid:=(x->>'order')::uuid; stamp timestamptz; data jsonb; n integer; denied boolean; stage_time timestamptz;
begin
 -- The viewer cannot move or write, even by calling the RPC directly.
 perform set_config('request.jwt.claims',jsonb_build_object('sub',x->>'viewer','role','authenticated')::text,true);
 select updated_at into stamp from public.orders where id=oid;
 denied:=false; begin perform public.operate_order(oid,'assume',stamp); exception when others then denied:=true; end;
 if not denied then raise exception 'Viewer was allowed to mutate'; end if;

 -- Commercial sees related orders only; cannot control production status directly or through RPC.
 perform set_config('request.jwt.claims',jsonb_build_object('sub',x->>'commercial','role','authenticated')::text,true);
 if exists(select 1 from public.orders where id=(x->>'other_order')::uuid) then raise exception 'Unrelated commercial order leaked'; end if;
 denied:=false; begin update public.orders set status='printing' where id=oid; exception when others then denied:=true; end;
 if not denied then raise exception 'Commercial bypassed operational restrictions'; end if;

 perform set_config('request.jwt.claims',jsonb_build_object('sub',x->>'production','role','authenticated')::text,true);
 select updated_at into stamp from public.orders where id=oid;
 perform public.operate_order(oid,'assume',stamp);
 select updated_at into stamp from public.orders where id=oid;
 perform public.operate_order(oid,'missing',stamp,'{"note":"Falta referência"}');
 select updated_at into stamp from public.orders where id=oid;
 perform public.operate_order(oid,'assign_designer',stamp,jsonb_build_object('member_id',x->>'designer_member'));
 select updated_at into stamp from public.orders where id=oid;
 denied:=false; begin perform public.operate_order(oid,'confirm',stamp); exception when others then denied:=true; end;
 if not denied then raise exception 'Confirmation was skipped'; end if;
 perform public.operate_order(oid,'confirm',stamp,'{"confirmed":true}');

 -- Designer: only assigned orders and their children; no role escalation/financial edits.
 perform set_config('request.jwt.claims',jsonb_build_object('sub',x->>'designer','role','authenticated')::text,true);
 if exists(select 1 from public.orders where id=(x->>'other_order')::uuid) then raise exception 'Unassigned order leaked to designer'; end if;
 select quantity,stage_entered_at into n,stage_time from public.order_operational_summary where id=oid;
 if n<>5 then raise exception 'Items were not aggregated correctly'; end if;
 denied:=false; begin update public.orders set total_value=999 where id=oid; exception when others then denied:=true; end;
 if not denied then raise exception 'Designer changed financial data'; end if;
 denied:=false; begin update public.profiles set role='admin' where id=auth.uid(); exception when others then denied:=true; end;
 if not denied then raise exception 'Designer escalated role'; end if;
 select updated_at into stamp from public.orders where id=oid;
 perform public.operate_order(oid,'start_modeling',stamp);
 select updated_at into stamp from public.orders where id=oid;
 perform public.operate_order(oid,'note',stamp,'{"note":"Modelando"}');
 if (select stage_entered_at from public.order_operational_summary where id=oid) is distinct from stage_time then raise exception 'Non-stage edit reset age'; end if;
 select updated_at into stamp from public.orders where id=oid;
 perform public.operate_order(oid,'send_approval',stamp);
 select updated_at into stamp from public.orders where id=oid;
 denied:=false; begin perform public.operate_order(oid,'approve',stamp); exception when others then denied:=true; end;
 if not denied then raise exception 'Designer self-approved'; end if;

 perform set_config('request.jwt.claims',jsonb_build_object('sub',x->>'commercial','role','authenticated')::text,true);
 perform public.operate_order(oid,'request_changes',stamp,'{"note":"Ajustar nome"}');
 perform set_config('request.jwt.claims',jsonb_build_object('sub',x->>'designer','role','authenticated')::text,true);
 select updated_at into stamp from public.orders where id=oid;
 perform public.operate_order(oid,'send_approval',stamp);
 perform set_config('request.jwt.claims',jsonb_build_object('sub',x->>'commercial','role','authenticated')::text,true);
 select updated_at into stamp from public.orders where id=oid;
 perform public.operate_order(oid,'approve',stamp);

 perform set_config('request.jwt.claims',jsonb_build_object('sub',x->>'production','role','authenticated')::text,true);
 select updated_at into stamp from public.orders where id=oid;
 denied:=false; begin perform public.operate_order(oid,'start_print',stamp-interval '1 second'); exception when others then denied:=true; end;
 if not denied then raise exception 'Stale mutation was accepted'; end if;
 perform public.operate_order(oid,'start_print',stamp);
 select updated_at into stamp from public.orders where id=oid;
 perform public.operate_order(oid,'fail_print',stamp,'{"note":"Falha de aderência"}');
 select updated_at into stamp from public.orders where id=oid;
 perform public.operate_order(oid,'start_print',stamp);
 select updated_at into stamp from public.orders where id=oid;
 perform public.operate_order(oid,'complete_print',stamp);
 select updated_at into stamp from public.orders where id=oid;
 perform public.operate_order(oid,'release',stamp,'{"confirmed":true}');
 select updated_at into stamp from public.orders where id=oid;
 denied:=false; begin perform public.operate_order(oid,'finish',stamp); exception when others then denied:=true; end;
 if not denied then raise exception 'Order finalized before shipping'; end if;
 perform public.operate_order(oid,'shipping_details',stamp,'{"tracking_code":"TEST123","shipping_address":"Destino de teste","carrier":"Transportadora teste","shipping_method":"Envio"}');
 select updated_at into stamp from public.orders where id=oid;
 perform public.operate_order(oid,'ship',stamp);
 select updated_at into stamp from public.orders where id=oid;
 perform public.operate_order(oid,'finish',stamp);
 select to_jsonb(s) into data from public.order_operational_summary s where id=oid;
 if data->>'stage'<>'completed' or (data->>'revision_count')::integer<>1 or data->>'tracking_code'<>'TEST123' then raise exception 'Operational summary invalid'; end if;
 select count(*) into n from public.production_jobs where order_id=oid;
 if n<>2 then raise exception 'Reprint lost prior job'; end if;
 select count(*) into n from public.order_history(oid);
 if n<20 then raise exception 'Incomplete history'; end if;

 perform set_config('request.jwt.claims',jsonb_build_object('sub',x->>'admin','role','authenticated')::text,true);
 select updated_at into stamp from public.orders where id=oid;
 perform public.operate_order(oid,'move',stamp,'{"status":"briefing_pending","note":"Correção administrativa de teste"}');
 select updated_at into stamp from public.orders where id=oid;
 perform public.operate_order(oid,'confirm',stamp,'{"confirmed":true}');
 select updated_at into stamp from public.orders where id=oid;
 perform public.operate_order(oid,'send_approval',stamp);
 denied:=false; begin update public.orders set status='printing' where id=oid; exception when others then denied:=true; end;
 if not denied then raise exception 'An old approval authorized a newer unapproved version'; end if;
 denied:=false; begin update public.audit_logs set comment='tampered' where record_id=oid; exception when others then denied:=true; end;
 -- An immutable RLS-denied update may affect zero rows rather than raise.
 if exists(select 1 from public.audit_logs where record_id=oid and comment='tampered') then raise exception 'Audit is mutable'; end if;
end $$;
select 'PASS: fluxo completo, 5 roles, RLS, revisão, concorrência, falha, reimpressão, postagem e histórico' result;
rollback;
