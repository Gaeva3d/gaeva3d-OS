-- A profile created by Auth is not an admission to the internal GAEVA team.
-- Reuse the membership established by prepare_team_access/link_team_access.
-- Preserve the existing signature, postgres owner, ACL and private schema.
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
      join public.team_members t on t.user_id = p.id
      where p.id = (select auth.uid())
        and p.is_active
        and p.role = any(allowed_roles)
        and t.is_active
        and t.deleted_at is null
    );
$$;
