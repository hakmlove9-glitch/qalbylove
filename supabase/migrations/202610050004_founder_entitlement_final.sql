-- قلبي لوڤي — تثبيت برنامج أول 1000 عضو مؤسس
-- لا ينشئ اشتراكًا مدفوعًا للمؤسس، بل يمنحه حالة Founder مستقلة ودائمة.

begin;

alter table if exists public.members add column if not exists is_founder boolean not null default false;
alter table if exists public.members add column if not exists membership_tier text not null default 'basic';
alter table if exists public.members add column if not exists member_number bigint;

create unique index if not exists members_member_number_uidx
  on public.members(member_number)
  where member_number is not null;

create index if not exists members_founder_member_number_idx
  on public.members(is_founder, member_number);

create or replace function public.assign_qalbylove_founder_identity()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  founder_count integer;
begin
  -- تسلسل التسجيلات المتزامنة حتى لا يتجاوز عدد المؤسسين 1000.
  perform pg_advisory_xact_lock(8141000);

  if new.member_number is null then
    new.member_number := nextval('public.qalbylove_member_number_seq');
  end if;

  select count(*)::integer
    into founder_count
    from public.members
    where is_founder = true;

  if founder_count < 1000 then
    new.is_founder := true;
    new.membership_tier := 'founder';
  else
    new.is_founder := false;
    if new.membership_tier is null or btrim(new.membership_tier) = '' or new.membership_tier = 'founder' then
      new.membership_tier := 'basic';
    end if;
  end if;

  return new;
end;
$$;

drop trigger if exists trg_assign_qalbylove_founder_identity on public.members;
create trigger trg_assign_qalbylove_founder_identity
before insert on public.members
for each row
execute function public.assign_qalbylove_founder_identity();

-- توحيد الحالة الحالية فقط: لا ننشئ أي صف في subscriptions للمؤسسين.
update public.members
set membership_tier = 'founder'
where is_founder = true
  and membership_tier is distinct from 'founder';

update public.members
set membership_tier = 'basic'
where is_founder = false
  and membership_tier = 'founder';

commit;
