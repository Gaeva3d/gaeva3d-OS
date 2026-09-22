-- Reuse profiles/team_members. Auth identities are created only by the Edge Function.
create or replace function public.prepare_team_access(
  p_email text,
  p_member_id uuid default null,
  p_name text default null,
  p_role public.app_role default 'production',
  p_job_title text default null,
  p_capacity integer default 3
) returns jsonb
language plpgsql security invoker set search_path = ''
as $$
declare
  member public.team_members;
  normalized_email text := lower(btrim(p_email));
begin
  if not app_private.has_role(array['admin'::public.app_role]) then
    raise exception 'Somente administradores podem criar acessos.' using errcode = '42501';
  end if;
  if normalized_email is null or length(normalized_email) > 254
    or normalized_email !~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$' then
    raise exception 'Informe um e-mail válido.';
  end if;
  perform pg_advisory_xact_lock(hashtextextended('gaeva:team-access:' || normalized_email, 0));

  if p_member_id is not null then
    select * into member from public.team_members where id = p_member_id for update;
    if not found or member.deleted_at is not null or not member.is_active then
      raise exception 'Integrante não encontrado ou inativo.';
    end if;
    if nullif(btrim(member.email), '') is not null and lower(btrim(member.email)) <> normalized_email then
      raise exception 'Este integrante já possui outro e-mail. O acesso não foi alterado.';
    end if;
    if exists (select 1 from public.team_members where id <> member.id
      and lower(btrim(email)) = normalized_email) then
      raise exception 'Este e-mail já pertence a outro integrante. Utilize o cadastro existente.';
    end if;
    update public.team_members set email = normalized_email where id = member.id returning * into member;
  else
    -- Retrying an interrupted request reuses the original team row.
    select * into member from public.team_members
      where lower(btrim(email)) = normalized_email order by created_at limit 1 for update;
    if found then
      if member.deleted_at is not null or not member.is_active then
        raise exception 'Este e-mail está associado a um integrante inativo.';
      end if;
      return to_jsonb(member);
    end if;
    if nullif(btrim(p_name), '') is null or length(btrim(p_name)) > 120
      or p_role is null or p_capacity is null or p_capacity < 1 or p_capacity > 10000
      or length(coalesce(p_job_title, '')) > 120 then
      raise exception 'Confira nome, perfil e capacidade do integrante.';
    end if;
    insert into public.team_members (name, email, access_role, job_title, capacity_limit, is_active)
      values (btrim(p_name), normalized_email, p_role, nullif(btrim(p_job_title), ''), p_capacity, true)
      returning * into member;
  end if;
  return to_jsonb(member);
end;
$$;

create or replace function public.link_team_access(p_member_id uuid, p_user_id uuid)
returns jsonb
language plpgsql security invoker set search_path = ''
as $$
declare
  member public.team_members;
  target public.profiles;
begin
  if not app_private.has_role(array['admin'::public.app_role]) then
    raise exception 'Somente administradores podem vincular acessos.' using errcode = '42501';
  end if;
  select * into member from public.team_members where id = p_member_id for update;
  if not found or member.deleted_at is not null or not member.is_active then
    raise exception 'Integrante não encontrado ou inativo.';
  end if;
  select * into target from public.profiles where id = p_user_id for update;
  if not found or not target.is_active then
    raise exception 'Conta não encontrada ou inativa.';
  end if;
  if nullif(btrim(member.email), '') is null or target.email is null
    or lower(btrim(member.email)) <> lower(btrim(target.email)) then
    raise exception 'O e-mail da conta precisa corresponder ao integrante.';
  end if;
  if member.user_id is not null and member.user_id <> target.id then
    raise exception 'Este integrante já está vinculado a outra conta.';
  end if;
  if exists (select 1 from public.team_members where user_id = target.id and id <> member.id) then
    raise exception 'Esta conta já está vinculada a outro integrante.';
  end if;
  update public.profiles set full_name = member.name, role = member.access_role where id = target.id;
  update public.team_members set user_id = target.id, email = lower(btrim(target.email))
    where id = member.id returning * into member;
  return to_jsonb(member);
end;
$$;

revoke all on function public.prepare_team_access(text, uuid, text, public.app_role, text, integer) from public, anon;
revoke all on function public.link_team_access(uuid, uuid) from public, anon;
grant execute on function public.prepare_team_access(text, uuid, text, public.app_role, text, integer) to authenticated;
grant execute on function public.link_team_access(uuid, uuid) to authenticated;
