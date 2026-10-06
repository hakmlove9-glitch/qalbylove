-- قلبي لوڤي — تقوية البلاغات والحظر ومسارات الإدارة بدون حذف أي بيانات.
begin;

alter table if exists public.reports add column if not exists reported_member_id uuid references public.members(id) on delete cascade;
alter table if exists public.reports add column if not exists details text;
alter table if exists public.reports add column if not exists reviewed_at timestamptz;
alter table if exists public.reports add column if not exists reviewed_by uuid references public.members(id) on delete set null;

-- نقل أي قيمة قديمة إن كان العمود legacy موجودًا.
do $$
begin
  if exists (select 1 from information_schema.columns where table_schema='public' and table_name='reports' and column_name='reported_id') then
    execute 'update public.reports set reported_member_id = reported_id where reported_member_id is null and reported_id is not null';
  end if;
end $$;

create index if not exists reports_reporter_created_idx on public.reports(reporter_id, created_at desc);
create index if not exists reports_reported_status_idx on public.reports(reported_member_id, status, created_at desc);
create index if not exists blocks_blocker_created_idx on public.blocks(blocker_id, created_at desc);

insert into public.site_settings(key, value)
values
  ('report_rate_limit_10m', '5'::jsonb),
  ('report_review_is_private', 'true'::jsonb),
  ('block_stops_contact', 'true'::jsonb)
on conflict (key) do update set value = excluded.value, updated_at = now();

commit;
