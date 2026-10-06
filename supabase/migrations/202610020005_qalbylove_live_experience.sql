-- إضافة حقول تجربة العضو بدون حذف أو إعادة تسمية أي بيانات موجودة.
alter table if exists public.member_details add column if not exists full_name text;
alter table if exists public.member_details add column if not exists gender text;
alter table if exists public.member_details add column if not exists education text;
alter table if exists public.member_details add column if not exists job text;
alter table if exists public.member_details add column if not exists health_status text;
alter table if exists public.member_details add column if not exists partner_specs text;
alter table if exists public.member_details add column if not exists height integer;
alter table if exists public.member_details add column if not exists smoking text;
alter table if exists public.member_details add column if not exists personality_traits jsonb default '[]'::jsonb;
alter table if exists public.member_details add column if not exists interests jsonb default '[]'::jsonb;
create index if not exists idx_member_details_city on public.member_details(city);
create index if not exists idx_member_details_age on public.member_details(age);
create index if not exists idx_member_details_gender on public.member_details(gender);
create index if not exists idx_member_details_health_status on public.member_details(health_status);
