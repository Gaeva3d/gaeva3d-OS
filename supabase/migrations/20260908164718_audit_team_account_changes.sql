create trigger profiles_access_audit after insert or update or delete on public.profiles for each row execute function app_private.write_audit_log();
create trigger team_members_access_audit after insert or update or delete on public.team_members for each row execute function app_private.write_audit_log();
