begin;

-- الاسم الظاهر منفصل عن الاسم الحقيقي السري.
alter table if exists public.member_details add column if not exists display_name text;
alter table if exists public.member_details add column if not exists phone_normalized text;

-- البريد ورقم الهاتف مسموح بتكرارهما بين أكثر من حساب.
drop index if exists public.members_email_lower_uidx;

do $$
declare
  c record;
begin
  for c in
    select conname
    from pg_constraint pc
    join pg_class t on t.oid = pc.conrelid
    join pg_namespace n on n.oid = t.relnamespace
    where n.nspname = 'public'
      and t.relname = 'members'
      and pc.contype = 'u'
      and array_length(pc.conkey, 1) = 1
      and exists (
        select 1
        from unnest(pc.conkey) as k(attnum)
        join pg_attribute a on a.attrelid = t.oid and a.attnum = k.attnum
        where a.attname = 'email'
      )
  loop
    execute format('alter table public.members drop constraint if exists %I', c.conname);
  end loop;
end $$;

create index if not exists members_email_lookup_idx
  on public.members (lower(email))
  where email is not null;

create index if not exists member_details_phone_lookup_idx
  on public.member_details (phone_normalized)
  where phone_normalized is not null and phone_normalized <> '';

commit;
