-- قلبي لوڤي — المراجعة النهائية لقاعدة البيانات
-- Migration إضافية ومحافظة قدر الإمكان: لا تحذف بيانات موجودة.
-- شغّلها بعد migrations السابقة بالترتيب.

begin;

create extension if not exists pgcrypto;

-- =========================================================
-- 1) الحقول الأساسية المطلوبة في members
-- =========================================================
alter table if exists public.members add column if not exists username text;
alter table if exists public.members add column if not exists email text;
alter table if exists public.members add column if not exists password_hash text;
alter table if exists public.members add column if not exists gender text;
alter table if exists public.members add column if not exists account_status text not null default 'active';
alter table if exists public.members add column if not exists role text not null default 'member';
alter table if exists public.members add column if not exists member_number bigint;
alter table if exists public.members add column if not exists is_founder boolean not null default false;
alter table if exists public.members add column if not exists last_seen timestamptz;
alter table if exists public.members add column if not exists created_at timestamptz not null default now();
alter table if exists public.members add column if not exists updated_at timestamptz not null default now();

create unique index if not exists members_username_lower_uidx
  on public.members (lower(username))
  where username is not null;

create unique index if not exists members_email_lower_uidx
  on public.members (lower(email))
  where email is not null;

create unique index if not exists members_member_number_uidx
  on public.members (member_number)
  where member_number is not null;

create index if not exists members_status_idx on public.members(account_status);
create index if not exists members_founder_idx on public.members(is_founder);
create index if not exists members_last_seen_idx on public.members(last_seen desc);

-- =========================================================
-- 2) بيانات الملف والإعدادات
-- =========================================================
alter table if exists public.member_details add column if not exists full_name text;
alter table if exists public.member_details add column if not exists phone text;
alter table if exists public.member_details add column if not exists gender text;
alter table if exists public.member_details add column if not exists age integer;
alter table if exists public.member_details add column if not exists city text;
alter table if exists public.member_details add column if not exists country text default 'مصر';
alter table if exists public.member_details add column if not exists marital_status text;
alter table if exists public.member_details add column if not exists education text;
alter table if exists public.member_details add column if not exists job text;
alter table if exists public.member_details add column if not exists height integer;
alter table if exists public.member_details add column if not exists body_type text;
alter table if exists public.member_details add column if not exists smoking text;
alter table if exists public.member_details add column if not exists religiosity text;
alter table if exists public.member_details add column if not exists health_status text;
alter table if exists public.member_details add column if not exists bio text;
alter table if exists public.member_details add column if not exists partner_specs text;
alter table if exists public.member_details add column if not exists interests jsonb default '[]'::jsonb;
alter table if exists public.member_details add column if not exists personality_traits jsonb default '[]'::jsonb;
alter table if exists public.member_details add column if not exists marriage_intent text;
alter table if exists public.member_details add column if not exists health_privacy text not null default 'members';
alter table if exists public.member_details add column if not exists voice_intro_url text;
alter table if exists public.member_details add column if not exists voice_intro_path text;
alter table if exists public.member_details add column if not exists voice_intro_duration integer;

create table if not exists public.member_settings (
  member_id uuid primary key references public.members(id) on delete cascade,
  show_profile boolean not null default true,
  allow_messages boolean not null default true,
  hide_last_seen boolean not null default false,
  hide_profile_views boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table if exists public.member_settings add column if not exists show_profile boolean not null default true;
alter table if exists public.member_settings add column if not exists allow_messages boolean not null default true;
alter table if exists public.member_settings add column if not exists hide_last_seen boolean not null default false;
alter table if exists public.member_settings add column if not exists hide_profile_views boolean not null default false;
alter table if exists public.member_settings add column if not exists updated_at timestamptz not null default now();

-- =========================================================
-- 3) الرسائل والإشعارات
-- =========================================================
alter table if exists public.messages add column if not exists type text not null default 'text';
alter table if exists public.messages add column if not exists voice_url text;
alter table if exists public.messages add column if not exists is_read boolean not null default false;
alter table if exists public.messages add column if not exists created_at timestamptz not null default now();

alter table if exists public.notifications add column if not exists content text;
alter table if exists public.notifications add column if not exists type text not null default 'general';
alter table if exists public.notifications add column if not exists action_url text;
alter table if exists public.notifications add column if not exists is_read boolean not null default false;
alter table if exists public.notifications add column if not exists created_at timestamptz not null default now();

create index if not exists messages_sender_receiver_created_idx
  on public.messages(sender_id, receiver_id, created_at desc);

create index if not exists messages_receiver_read_idx
  on public.messages(receiver_id, is_read, created_at desc);

create index if not exists notifications_member_read_idx
  on public.notifications(member_id, is_read, created_at desc);

-- =========================================================
-- 4) برنامج أول 1000 عضو مؤسس — رقم عضوية ذري وآمن
-- =========================================================
create sequence if not exists public.qalbylove_member_number_seq;

do $$
declare
  current_max bigint;
begin
  select coalesce(max(member_number), 0)
    into current_max
    from public.members;

  if current_max > 0 then
    perform setval(
      'public.qalbylove_member_number_seq',
      greatest(
        current_max,
        (select last_value from public.qalbylove_member_number_seq)
      ),
      true
    );
  end if;
end $$;

create or replace function public.next_member_number()
returns bigint
language sql
security definer
set search_path = public
as $$
  select nextval('public.qalbylove_member_number_seq');
$$;

create or replace function public.assign_qalbylove_founder_identity()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  founder_count integer;
begin
  -- إذا كان الـAPI قد حجز رقمًا بالفعل عبر next_member_number نحافظ عليه.
  if new.member_number is null then
    new.member_number := nextval('public.qalbylove_member_number_seq');
  end if;

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

-- تصحيح المؤسسين الموجودين بدون المساس بمن تجاوزوا أول 1000 رقم.
update public.members
set is_founder = true
where member_number between 1 and 1000
  and is_founder is distinct from true;

-- =========================================================
-- 5) الباقات النهائية
-- توافق مع الجداول القديمة
alter table public.subscription_plans alter column id set default gen_random_uuid();
create unique index if not exists subscription_plans_name_uidx on public.subscription_plans (name);

-- =========================================================
insert into public.subscription_plans
  (name, price, duration_months, description, features, is_active, sort_order)
values
  (
    'شهر واحد', 99, 1,
    'كل مزايا التميّز لمدة شهر.',
    '{"receive_messages":true,"message_anyone":true,"message_interest_only":true,"message_privacy":true,"hide_ads":true,"featured_profile":true,"change_username":true,"hidden_login":true,"member_photos":true,"priority_support":true}'::jsonb,
    true, 1
  ),
  (
    '3 شهور', 199, 3,
    'كل مزايا التميّز لمدة 3 شهور.',
    '{"receive_messages":true,"message_anyone":true,"message_interest_only":true,"message_privacy":true,"hide_ads":true,"featured_profile":true,"change_username":true,"hidden_login":true,"member_photos":true,"priority_support":true}'::jsonb,
    true, 2
  ),
  (
    '6 شهور', 399, 6,
    'كل مزايا التميّز لمدة 6 شهور.',
    '{"receive_messages":true,"message_anyone":true,"message_interest_only":true,"message_privacy":true,"hide_ads":true,"featured_profile":true,"change_username":true,"hidden_login":true,"member_photos":true,"priority_support":true}'::jsonb,
    true, 3
  ),
  (
    'سنة كاملة', 699, 12,
    'كل مزايا التميّز لمدة سنة كاملة.',
    '{"receive_messages":true,"message_anyone":true,"message_interest_only":true,"message_privacy":true,"hide_ads":true,"featured_profile":true,"change_username":true,"hidden_login":true,"member_photos":true,"priority_support":true}'::jsonb,
    true, 4
  )
on conflict (name) do update set
  price = excluded.price,
  duration_months = excluded.duration_months,
  description = excluded.description,
  features = excluded.features,
  is_active = true,
  sort_order = excluded.sort_order,
  updated_at = now();

-- =========================================================
-- 6) Storage الصوتي
-- =========================================================
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  (
    'voice-messages',
    'voice-messages',
    true,
    15728640,
    array['audio/webm','audio/ogg','audio/mp4','audio/mpeg','audio/wav','audio/x-m4a']
  ),
  (
    'voice-intros',
    'voice-intros',
    true,
    6291456,
    array['audio/webm','audio/ogg','audio/mp4','audio/mpeg','audio/wav','audio/x-m4a']
  ),
  (
    'voices',
    'voices',
    true,
    15728640,
    array['audio/webm','audio/ogg','audio/mp4','audio/mpeg','audio/wav','audio/x-m4a']
  )
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- =========================================================
-- 7) حماية الجداول الحساسة من anon/authenticated المباشر
--    الـAPI يستخدم Service Role ولذلك يظل قادرًا على العمل.
-- =========================================================
do $$
declare
  table_name text;
begin
  foreach table_name in array array[
    'members',
    'member_details',
    'member_settings',
    'messages',
    'notifications',
    'password_reset_tokens',
    'subscription_codes',
    'subscriptions',
    'payments',
    'admin_logs'
  ]
  loop
    if to_regclass('public.' || table_name) is not null then
      execute format('alter table public.%I enable row level security', table_name);
    end if;
  end loop;
end $$;

-- لا ننشئ Policy عامة للرسائل أو الحسابات لأن نظام الدخول الحالي يعتمد
-- على Cookie خاصة بالتطبيق وليس Supabase Auth. القراءة/الكتابة تتم من API الخادم.

commit;
