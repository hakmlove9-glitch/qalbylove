-- قلبي لوڤي: برنامج أول 1000 عضو مؤسس
-- التخصيص يتم داخل قاعدة البيانات بقفل transaction-level حتى لا يحصل عضوان
-- على نفس رقم العضوية عند التسجيل في نفس اللحظة.

alter table if exists public.members
  add column if not exists member_number bigint;

alter table if exists public.members
  add column if not exists is_founder boolean not null default false;

create or replace function public.assign_qalbylove_founder_identity()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  founder_count integer;
  next_member_number bigint;
begin
  perform pg_advisory_xact_lock(2601001);

  select coalesce(max(member_number), 0) + 1
    into next_member_number
    from public.members;
  new.member_number := next_member_number;

  select count(*)
    into founder_count
    from public.members
    where is_founder = true;

  new.is_founder := founder_count < 1000;
  return new;
end;
$$;

drop trigger if exists trg_assign_qalbylove_founder_identity on public.members;
create trigger trg_assign_qalbylove_founder_identity
before insert on public.members
for each row
execute function public.assign_qalbylove_founder_identity();

create index if not exists idx_members_is_founder on public.members(is_founder);
create index if not exists idx_members_member_number on public.members(member_number);
