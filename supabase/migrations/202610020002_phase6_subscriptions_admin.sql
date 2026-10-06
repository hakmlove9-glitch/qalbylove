begin;

create extension if not exists pgcrypto;

create table if not exists public.subscription_plans (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  price numeric(10,2) not null default 0,
  duration_months integer not null default 1,
  description text,
  features jsonb not null default '{}'::jsonb,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.subscription_plans add column if not exists features jsonb not null default '{}'::jsonb;
alter table public.subscription_plans add column if not exists is_active boolean not null default true;
alter table public.subscription_plans add column if not exists sort_order integer not null default 0;
alter table public.subscription_plans add column if not exists description text;

create table if not exists public.subscription_codes (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  plan_id uuid references public.subscription_plans(id) on delete restrict,
  plan_months integer not null,
  plan_price numeric(10,2) not null,
  is_used boolean not null default false,
  used_by uuid references public.members(id) on delete set null,
  used_at timestamptz,
  expires_at timestamptz,
  created_by uuid references public.members(id) on delete set null,
  created_at timestamptz not null default now()
);

alter table public.subscription_codes add column if not exists plan_id uuid references public.subscription_plans(id) on delete restrict;
alter table public.subscription_codes add column if not exists used_at timestamptz;
alter table public.subscription_codes add column if not exists expires_at timestamptz;
alter table public.subscription_codes add column if not exists created_by uuid references public.members(id) on delete set null;

create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.members(id) on delete cascade,
  plan_id uuid references public.subscription_plans(id) on delete set null,
  plan_name text not null,
  price numeric(10,2) not null default 0,
  duration_months integer not null default 1,
  status text not null default 'active',
  starts_at timestamptz,
  ends_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists subscriptions_user_status_idx on public.subscriptions(user_id, status, ends_at desc);
create index if not exists subscription_codes_available_idx on public.subscription_codes(is_used, expires_at);

create extension if not exists pgcrypto;
alter table public.subscription_plans alter column id set default gen_random_uuid();
create unique index if not exists subscription_plans_name_uidx on public.subscription_plans (name);

insert into public.subscription_plans (name, price, duration_months, description, features, is_active, sort_order)
values
('شهر واحد', 99, 1, 'تجربة تميّز كاملة لمدة شهر.', '{"receive_messages":true,"message_anyone":true,"message_interest_only":true,"message_privacy":true,"hide_ads":true,"featured_profile":true,"change_username":true,"hidden_login":true,"member_photos":true,"priority_support":true}'::jsonb, true, 1),
('3 شهور', 199, 3, 'أفضل توازن بين السعر والمدة.', '{"receive_messages":true,"message_anyone":true,"message_interest_only":true,"message_privacy":true,"hide_ads":true,"featured_profile":true,"change_username":true,"hidden_login":true,"member_photos":true,"priority_support":true}'::jsonb, true, 2),
('6 شهور', 399, 6, 'وقت أطول للتعارف الجاد بمرونة أكبر.', '{"receive_messages":true,"message_anyone":true,"message_interest_only":true,"message_privacy":true,"hide_ads":true,"featured_profile":true,"change_username":true,"hidden_login":true,"member_photos":true,"priority_support":true}'::jsonb, true, 3),
('سنة كاملة', 699, 12, 'أكبر مدة بأفضل قيمة سنوية.', '{"receive_messages":true,"message_anyone":true,"message_interest_only":true,"message_privacy":true,"hide_ads":true,"featured_profile":true,"change_username":true,"hidden_login":true,"member_photos":true,"priority_support":true}'::jsonb, true, 4)
on conflict (name) do update set
  price = excluded.price,
  duration_months = excluded.duration_months,
  description = excluded.description,
  features = excluded.features,
  is_active = true,
  sort_order = excluded.sort_order,
  updated_at = now();

commit;
