-- Bootstrap the first application administrator through the trusted SQL control plane.
-- API roles and SECURITY DEFINER callers cannot use current_user as a trust signal.
-- No account identifiers, passwords, JWTs, or provider credentials belong in migrations.
create or replace function app_private.protect_profile_privileges()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if (new.role, new.is_active) is distinct from (old.role, old.is_active)
     and not app_private.has_role(array['admin'::public.app_role]) then
    if session_user = 'postgres'
       and current_setting('role', true) in ('none', 'postgres')
       and (select auth.uid()) is null
       and old.role = 'viewer'::public.app_role
       and new.role = 'admin'::public.app_role
       and old.is_active and new.is_active
       and exists (
         select 1 from auth.users u
         where u.id = new.id
           and u.email_confirmed_at is not null
           and u.deleted_at is null
           and (u.banned_until is null or u.banned_until <= now())
       ) then
      perform pg_advisory_xact_lock(hashtextextended('gaeva:first-admin-bootstrap', 0));
      if not exists (select 1 from public.profiles p where p.role = 'admin'::public.app_role) then
        return new;
      end if;
    end if;
    raise exception 'Only administrators can change roles or activation status';
  end if;
  return new;
end;
$$;

revoke all on function app_private.protect_profile_privileges() from public, anon, authenticated;
