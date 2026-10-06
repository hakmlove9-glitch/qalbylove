begin;

alter table if exists public.member_details add column if not exists residence_type text;
alter table if exists public.member_details add column if not exists previous_marriage text;
alter table if exists public.member_details add column if not exists has_children boolean not null default false;
alter table if exists public.member_details add column if not exists children_count integer not null default 0;
alter table if exists public.member_details add column if not exists children_living text;
alter table if exists public.member_details add column if not exists housing_plan text;
alter table if exists public.member_details add column if not exists marriage_timeline text;
alter table if exists public.member_details add column if not exists work_status text;
alter table if exists public.member_details add column if not exists weight integer;
alter table if exists public.member_details add column if not exists prayer_status text;
alter table if exists public.member_details add column if not exists health_details text;

create table if not exists public.moderation_violations (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references public.members(id) on delete cascade,
  violation_type text not null,
  source text not null,
  created_at timestamptz not null default now()
);

create index if not exists moderation_violations_member_created_idx
  on public.moderation_violations(member_id, created_at desc);

alter table public.moderation_violations enable row level security;

commit;
