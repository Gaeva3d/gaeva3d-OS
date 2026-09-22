-- Every fixture and mutation is rolled back. Run with a trusted SQL connection.
begin;
select set_config('request.jwt.claims', jsonb_build_object('sub', (select id from public.profiles where role='admin' and is_active limit 1), 'role', 'authenticated')::text, true);
do $$
declare target_id uuid:=gen_random_uuid(); other_id uuid:=gen_random_uuid();
begin
 if auth.uid() is null then raise exception 'Active admin required'; end if;
 insert into auth.users(id,email,raw_app_meta_data,raw_user_meta_data,email_confirmed_at)
 values(target_id,'test-access-'||target_id||'@example.invalid','{}','{}',now()),
 (other_id,'test-access-'||other_id||'@example.invalid','{}','{}',now());
 perform set_config('test.team_access',jsonb_build_object('admin',auth.uid(),'target',target_id,'other',other_id)::text,true);
end $$;
set local role authenticated;
do $$
declare x jsonb:=current_setting('test.team_access')::jsonb; result jsonb; retried jsonb; mid uuid; other_member uuid; denied boolean; r public.app_role;
 address text:='test-access-'||(x->>'target')||'@example.invalid';
begin
 result:=public.prepare_team_access(upper(address),null,'TEST ACCESS','designer','Designer',3);
 mid:=(result->>'id')::uuid;
 if result->>'email'<>address then raise exception 'Email not normalized'; end if;
 retried:=public.prepare_team_access(address,null,'Duplicate name','admin','Wrong role',9);
 if retried->>'id'<>result->>'id' or retried->>'access_role'<>'designer' then raise exception 'Retry duplicated or changed team identity'; end if;
 result:=public.link_team_access(mid,(x->>'target')::uuid);
 if result->>'user_id'<>x->>'target' then raise exception 'Missing user link'; end if;
 if (select role from public.profiles where id=(x->>'target')::uuid)<>'designer' then raise exception 'Profile role not synchronized'; end if;
 perform public.link_team_access(mid,(x->>'target')::uuid);
 if (select count(*) from public.team_members where user_id=(x->>'target')::uuid)<>1 then raise exception 'Duplicate membership'; end if;
 if not exists(select 1 from public.audit_logs where table_name='team_members' and record_id=mid and actor_id=(x->>'admin')::uuid and new_values->>'user_id'=x->>'target') then raise exception 'Actor missing from link audit'; end if;
 denied:=false; begin perform public.link_team_access(mid,(x->>'other')::uuid); exception when others then denied:=true; end;
 if not denied then raise exception 'Mismatched identity allowed'; end if;
 denied:=false; begin perform public.prepare_team_access('changed@example.invalid',mid); exception when others then denied:=true; end;
 if not denied then raise exception 'Existing identity email overwritten'; end if;
 insert into public.team_members(name,job_title,access_role) values('TEST LEGACY MEMBER','Produção','production') returning id into other_member;
 result:=public.prepare_team_access('test-access-'||(x->>'other')||'@example.invalid',other_member);
 if (result->>'id')::uuid<>other_member then raise exception 'Existing team member replaced'; end if;
 perform public.link_team_access(other_member,(x->>'other')::uuid);
 -- Direct RPC calls must enforce every role, not only the UI/Edge Function.
 foreach r in array array['viewer','commercial','production','designer']::public.app_role[] loop
   perform set_config('request.jwt.claims',jsonb_build_object('sub',x->>'admin','role','authenticated')::text,true);
   update public.profiles set role=r where id=(x->>'other')::uuid;
   perform set_config('request.jwt.claims',jsonb_build_object('sub',x->>'other','role','authenticated')::text,true);
   denied:=false; begin perform public.prepare_team_access(address); exception when insufficient_privilege then denied:=true; end;
   if not denied then raise exception 'Non-admin can prepare accounts: %',r; end if;
   denied:=false; begin perform public.link_team_access(mid,(x->>'target')::uuid); exception when insufficient_privilege then denied:=true; end;
   if not denied then raise exception 'Non-admin can link accounts: %',r; end if;
 end loop;
 perform set_config('request.jwt.claims',jsonb_build_object('sub',x->>'admin','role','authenticated')::text,true);
 update public.profiles set role='admin',is_active=false where id=(x->>'other')::uuid;
 perform set_config('request.jwt.claims',jsonb_build_object('sub',x->>'other','role','authenticated')::text,true);
 denied:=false; begin perform public.prepare_team_access(address); exception when insufficient_privilege then denied:=true; end;
 if not denied then raise exception 'Inactive administrator allowed'; end if;
end $$;
reset role;
do $$ begin
 if has_function_privilege('anon','public.link_team_access(uuid,uuid)','execute') then raise exception 'Anonymous execute grant'; end if;
 if exists(select 1 from pg_proc where oid in ('public.link_team_access(uuid,uuid)'::regprocedure,'public.prepare_team_access(text,uuid,text,public.app_role,text,integer)'::regprocedure) and prosecdef) then raise exception 'Unexpected security definer'; end if;
end $$;
rollback;
