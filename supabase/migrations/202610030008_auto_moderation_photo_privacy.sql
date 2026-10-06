-- قلبي لوڤي — الفحص الآلي وخصوصية الصور
begin;

alter table if exists public.member_settings
  add column if not exists photo_visibility text not null default 'all';

update public.member_settings
set photo_visibility = 'all'
where photo_visibility is null
   or photo_visibility not in ('all','mutual','request','private');

alter table if exists public.photos
  add column if not exists storage_path text;

alter table if exists public.photos
  add column if not exists evidence_path text;

alter table if exists public.photos
  add column if not exists moderation_provider text;

alter table if exists public.photos
  add column if not exists moderation_meta jsonb not null default '{}'::jsonb;

alter table if exists public.photos
  add column if not exists approved_at timestamptz;

do $$
begin
  if to_regclass('public.photos') is not null then
    execute 'alter table public.photos alter column image_url drop not null';
  end if;
end $$;

create table if not exists public.photo_access_requests (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.members(id) on delete cascade,
  requester_id uuid not null references public.members(id) on delete cascade,
  status text not null default 'pending',
  created_at timestamptz not null default now(),
  responded_at timestamptz,
  unique(owner_id, requester_id)
);

create index if not exists photo_access_owner_status_idx
  on public.photo_access_requests(owner_id, status, created_at desc);

create index if not exists photo_access_requester_idx
  on public.photo_access_requests(requester_id, created_at desc);

create table if not exists public.moderation_events (
  id uuid primary key default gen_random_uuid(),
  member_id uuid references public.members(id) on delete set null,
  event_type text not null,
  source text not null,
  decision text not null,
  category text,
  reason text,
  content_excerpt text,
  evidence_path text,
  photo_id uuid references public.photos(id) on delete set null,
  metadata jsonb not null default '{}'::jsonb,
  status text not null default 'open',
  created_at timestamptz not null default now(),
  reviewed_at timestamptz,
  reviewed_by uuid references public.members(id) on delete set null
);

create index if not exists moderation_events_status_created_idx
  on public.moderation_events(status, created_at desc);

create index if not exists moderation_events_member_created_idx
  on public.moderation_events(member_id, created_at desc);

insert into storage.buckets(id, name, public, file_size_limit, allowed_mime_types)
values
(
  'moderation-evidence',
  'moderation-evidence',
  false,
  5242880,
  array['image/jpeg','image/png','image/webp']
)
on conflict (id) do update set
  public = false,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

alter table public.photo_access_requests enable row level security;
alter table public.moderation_events enable row level security;

commit;
