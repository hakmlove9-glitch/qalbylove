begin;

-- اسم المستخدم يبقى كما كتبه العضو، لكن منع التكرار يكون غير حساس لحالة الحروف.
-- هذا يسمح: عربي / English / Capital / small / رموز / Emoji.

create unique index if not exists members_username_lower_uidx
  on public.members (lower(btrim(username)))
  where username is not null and btrim(username) <> '';

create or replace function public.is_username_available(candidate_username text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select
    candidate_username is not null
    and btrim(candidate_username) <> ''
    and not exists (
      select 1
      from public.members m
      where lower(btrim(m.username)) = lower(btrim(candidate_username))
    );
$$;

revoke all on function public.is_username_available(text) from public;
grant execute on function public.is_username_available(text) to service_role;

commit;
