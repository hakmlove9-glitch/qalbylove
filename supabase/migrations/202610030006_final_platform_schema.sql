-- قلبي لوڤي — المخطط النهائي الموحد
-- Migration تصالحية محافظة على البيانات قدر الإمكان.
-- لا تحذف حسابات أو رسائل أو مدفوعات.
-- هدفها توحيد الجداول التي تعتمد عليها النسخة النهائية من app/components/lib/services.

begin;

create extension if not exists pgcrypto;

-- =========================================================
-- 1) الأعضاء: الاسم الظاهر فريد، البريد مسموح بتكراره
-- =========================================================
alter table if exists public.members add column if not exists username text;
alter table if exists public.members add column if not exists email text;
alter table if exists public.members add column if not exists password_hash text;
alter table if exists public.members add column if not exists gender text;
alter table if exists public.members add column if not exists account_status text not null default 'active';
alter table if exists public.members add column if not exists role text not null default 'member';
alter table if exists public.members add column if not exists is_admin boolean not null default false;
alter table if exists public.members add column if not exists member_number bigint;
alter table if exists public.members add column if not exists is_founder boolean not null default false;
alter table if exists public.members add column if not exists last_seen timestamptz;
alter table if exists public.members add column if not exists created_at timestamptz not null default now();
alter table if exists public.members add column if not exists updated_at timestamptz not null default now();

drop index if exists public.members_email_lower_uidx;

create unique index if not exists members_username_lower_uidx
  on public.members(lower(username))
  where username is not null and btrim(username) <> '';

create index if not exists members_email_lookup_idx
  on public.members(lower(email))
  where email is not null and btrim(email) <> '';

create unique index if not exists members_member_number_uidx
  on public.members(member_number)
  where member_number is not null;

create index if not exists members_gender_status_idx
  on public.members(gender, account_status);

create index if not exists members_last_seen_idx
  on public.members(last_seen desc);

-- =========================================================
-- 2) الملف الشخصي: صف واحد فقط لكل عضو
-- =========================================================
alter table if exists public.member_details add column if not exists display_name text;
alter table if exists public.member_details add column if not exists full_name text;
alter table if exists public.member_details add column if not exists phone text;
alter table if exists public.member_details add column if not exists phone_normalized text;
alter table if exists public.member_details add column if not exists gender text;
alter table if exists public.member_details add column if not exists age integer;
alter table if exists public.member_details add column if not exists residence_type text;
alter table if exists public.member_details add column if not exists governorate text;
alter table if exists public.member_details add column if not exists city text;
alter table if exists public.member_details add column if not exists country text default 'مصر';
alter table if exists public.member_details add column if not exists marital_status text;
alter table if exists public.member_details add column if not exists previous_marriage text;
alter table if exists public.member_details add column if not exists has_children boolean not null default false;
alter table if exists public.member_details add column if not exists children_count integer not null default 0;
alter table if exists public.member_details add column if not exists children_living text;
alter table if exists public.member_details add column if not exists housing_plan text;
alter table if exists public.member_details add column if not exists marriage_timeline text;
alter table if exists public.member_details add column if not exists education text;
alter table if exists public.member_details add column if not exists job text;
alter table if exists public.member_details add column if not exists work_status text;
alter table if exists public.member_details add column if not exists height integer;
alter table if exists public.member_details add column if not exists weight integer;
alter table if exists public.member_details add column if not exists body_type text;
alter table if exists public.member_details add column if not exists smoking text;
alter table if exists public.member_details add column if not exists prayer_status text;
alter table if exists public.member_details add column if not exists religiosity text;
alter table if exists public.member_details add column if not exists health_status text;
alter table if exists public.member_details add column if not exists health_details text;
alter table if exists public.member_details add column if not exists health_privacy text not null default 'members';
alter table if exists public.member_details add column if not exists bio text;
alter table if exists public.member_details add column if not exists partner_specs text;
alter table if exists public.member_details add column if not exists interests jsonb not null default '[]'::jsonb;
alter table if exists public.member_details add column if not exists personality_traits jsonb not null default '[]'::jsonb;
alter table if exists public.member_details add column if not exists marriage_intent text default 'زواج جاد';
alter table if exists public.member_details add column if not exists voice_intro_url text;
alter table if exists public.member_details add column if not exists voice_intro_path text;
alter table if exists public.member_details add column if not exists voice_intro_duration integer;
alter table if exists public.member_details add column if not exists created_at timestamptz default now();
alter table if exists public.member_details add column if not exists updated_at timestamptz default now();

-- النسخ القديمة قد تكون أنشأت أكثر من صف لنفس العضو.
-- نحتفظ بأقدم صف ونزيل التكرار قبل فرض uniqueness.
do $$
begin
  if to_regclass('public.member_details') is not null then
    delete from public.member_details a
    using public.member_details b
    where a.member_id = b.member_id
      and a.ctid > b.ctid;
  end if;
end $$;

create unique index if not exists member_details_member_id_uidx
  on public.member_details(member_id);

create index if not exists member_details_gender_idx on public.member_details(gender);
create index if not exists member_details_governorate_city_idx on public.member_details(governorate, city);
create index if not exists member_details_age_idx on public.member_details(age);
create index if not exists member_details_health_idx on public.member_details(health_status);
create index if not exists member_details_phone_lookup_idx
  on public.member_details(phone_normalized)
  where phone_normalized is not null and phone_normalized <> '';

-- =========================================================
-- 3) إعدادات العضو: الأصل ظهور الملف واستقبال الرسائل
-- =========================================================
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

update public.member_settings
set show_profile = true,
    allow_messages = true
where show_profile is distinct from true
   or allow_messages is distinct from true;

-- =========================================================
-- 4) الصور الشخصية
-- =========================================================
create table if not exists public.photos (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references public.members(id) on delete cascade,
  image_url text not null,
  is_primary boolean not null default false,
  moderation_status text not null default 'pending',
  moderation_reason text,
  created_at timestamptz not null default now()
);

alter table if exists public.photos add column if not exists member_id uuid references public.members(id) on delete cascade;

-- توافق مع أي نسخة قديمة كانت تستخدم user_id بدل member_id.
do $$
begin
  if to_regclass('public.photos') is not null
     and exists (
       select 1
       from information_schema.columns
       where table_schema = 'public'
         and table_name = 'photos'
         and column_name = 'user_id'
     ) then
    execute 'update public.photos set member_id = user_id where member_id is null and user_id is not null';
  end if;
end $$;

alter table if exists public.photos add column if not exists image_url text;
alter table if exists public.photos add column if not exists is_primary boolean not null default false;
alter table if exists public.photos add column if not exists moderation_status text not null default 'pending';
alter table if exists public.photos add column if not exists moderation_reason text;
alter table if exists public.photos add column if not exists approved boolean not null default false;

alter table if exists public.photos add column if not exists created_at timestamptz not null default now();

update public.photos
set moderation_status =
  case
    when approved = true then 'approved'
    when moderation_status is null or btrim(moderation_status) = '' then 'pending'
    else moderation_status
  end;

create or replace function public.sync_photo_moderation_columns()
returns trigger
language plpgsql
as $$
begin
  if new.moderation_status = 'approved' then
    new.approved := true;
  elsif new.moderation_status = 'rejected' then
    new.approved := false;
  elsif new.approved = true then
    new.moderation_status := 'approved';
  end if;
  return new;
end;
$$;

drop trigger if exists trg_sync_photo_moderation_columns on public.photos;
create trigger trg_sync_photo_moderation_columns
before insert or update on public.photos
for each row execute function public.sync_photo_moderation_columns();

create index if not exists photos_member_idx
  on public.photos(member_id, created_at desc);

create unique index if not exists photos_one_primary_per_member_uidx
  on public.photos(member_id)
  where is_primary = true;

-- =========================================================
-- 5) الرسائل والإشعارات — دعم البنية الحديثة والقديمة معًا
-- =========================================================
alter table if exists public.messages add column if not exists type text not null default 'text';
alter table if exists public.messages add column if not exists content text;
alter table if exists public.messages add column if not exists voice_url text;
alter table if exists public.messages add column if not exists is_read boolean not null default false;
alter table if exists public.messages add column if not exists created_at timestamptz not null default now();

create index if not exists messages_sender_receiver_created_idx
  on public.messages(sender_id, receiver_id, created_at desc);

create index if not exists messages_receiver_read_idx
  on public.messages(receiver_id, is_read, created_at desc);

alter table if exists public.notifications add column if not exists message text;
alter table if exists public.notifications add column if not exists content text;
alter table if exists public.notifications add column if not exists type text not null default 'general';
alter table if exists public.notifications add column if not exists action_url text;
alter table if exists public.notifications add column if not exists read boolean not null default false;
alter table if exists public.notifications add column if not exists is_read boolean not null default false;
alter table if exists public.notifications add column if not exists created_at timestamptz not null default now();

create or replace function public.sync_notification_legacy_columns()
returns trigger
language plpgsql
as $$
begin
  new.content := coalesce(nullif(new.content, ''), new.message);
  new.message := coalesce(nullif(new.message, ''), new.content);
  new.is_read := coalesce(new.is_read, new.read, false);
  new.read := coalesce(new.read, new.is_read, false);
  return new;
end;
$$;

drop trigger if exists trg_sync_notification_legacy_columns on public.notifications;
create trigger trg_sync_notification_legacy_columns
before insert or update on public.notifications
for each row execute function public.sync_notification_legacy_columns();

update public.notifications
set content = coalesce(content, message),
    message = coalesce(message, content),
    is_read = coalesce(is_read, read, false),
    read = coalesce(read, is_read, false);

create index if not exists notifications_member_read_idx
  on public.notifications(member_id, is_read, created_at desc);

-- =========================================================
-- 6) الاهتمام والتوافق والحظر والزيارات والبلاغات
-- =========================================================

-- الاهتمامات
create table if not exists public.interests (
  id uuid primary key default gen_random_uuid(),
  sender_id uuid references public.members(id) on delete cascade,
  receiver_id uuid references public.members(id) on delete cascade,
  status text not null default 'sent',
  created_at timestamptz not null default now()
);

alter table if exists public.interests add column if not exists sender_id uuid references public.members(id) on delete cascade;
alter table if exists public.interests add column if not exists receiver_id uuid references public.members(id) on delete cascade;
alter table if exists public.interests add column if not exists status text not null default 'sent';
alter table if exists public.interests add column if not exists created_at timestamptz not null default now();

do $$
begin
  if to_regclass('public.interests') is not null then
    if exists (select 1 from information_schema.columns where table_schema='public' and table_name='interests' and column_name='member_id') then
      execute 'update public.interests set sender_id = member_id where sender_id is null and member_id is not null';
    end if;
    if exists (select 1 from information_schema.columns where table_schema='public' and table_name='interests' and column_name='target_member_id') then
      execute 'update public.interests set receiver_id = target_member_id where receiver_id is null and target_member_id is not null';
    end if;
    if exists (select 1 from information_schema.columns where table_schema='public' and table_name='interests' and column_name='target_id') then
      execute 'update public.interests set receiver_id = target_id where receiver_id is null and target_id is not null';
    end if;
  end if;
end $$;

create unique index if not exists interests_pair_uidx
  on public.interests(sender_id, receiver_id)
  where sender_id is not null and receiver_id is not null;

-- المفضلة
create table if not exists public.favorites (
  id uuid primary key default gen_random_uuid(),
  member_id uuid references public.members(id) on delete cascade,
  target_member_id uuid references public.members(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table if exists public.favorites add column if not exists member_id uuid references public.members(id) on delete cascade;
alter table if exists public.favorites add column if not exists target_member_id uuid references public.members(id) on delete cascade;
alter table if exists public.favorites add column if not exists created_at timestamptz not null default now();

do $$
begin
  if to_regclass('public.favorites') is not null then
    if exists (select 1 from information_schema.columns where table_schema='public' and table_name='favorites' and column_name='user_id') then
      execute 'update public.favorites set member_id = user_id where member_id is null and user_id is not null';
    end if;
    if exists (select 1 from information_schema.columns where table_schema='public' and table_name='favorites' and column_name='owner_id') then
      execute 'update public.favorites set member_id = owner_id where member_id is null and owner_id is not null';
    end if;
    if exists (select 1 from information_schema.columns where table_schema='public' and table_name='favorites' and column_name='favorite_member_id') then
      execute 'update public.favorites set target_member_id = favorite_member_id where target_member_id is null and favorite_member_id is not null';
    end if;
    if exists (select 1 from information_schema.columns where table_schema='public' and table_name='favorites' and column_name='target_id') then
      execute 'update public.favorites set target_member_id = target_id where target_member_id is null and target_id is not null';
    end if;
  end if;
end $$;

create unique index if not exists favorites_pair_uidx
  on public.favorites(member_id, target_member_id)
  where member_id is not null and target_member_id is not null;

-- الحظر
create table if not exists public.blocks (
  id uuid primary key default gen_random_uuid(),
  blocker_id uuid references public.members(id) on delete cascade,
  blocked_id uuid references public.members(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table if exists public.blocks add column if not exists blocker_id uuid references public.members(id) on delete cascade;
alter table if exists public.blocks add column if not exists blocked_id uuid references public.members(id) on delete cascade;
alter table if exists public.blocks add column if not exists created_at timestamptz not null default now();

do $$
begin
  if to_regclass('public.blocks') is not null then
    if exists (select 1 from information_schema.columns where table_schema='public' and table_name='blocks' and column_name='member_id') then
      execute 'update public.blocks set blocker_id = member_id where blocker_id is null and member_id is not null';
    end if;
    if exists (select 1 from information_schema.columns where table_schema='public' and table_name='blocks' and column_name='target_member_id') then
      execute 'update public.blocks set blocked_id = target_member_id where blocked_id is null and target_member_id is not null';
    end if;
    if exists (select 1 from information_schema.columns where table_schema='public' and table_name='blocks' and column_name='blocked_member_id') then
      execute 'update public.blocks set blocked_id = blocked_member_id where blocked_id is null and blocked_member_id is not null';
    end if;
  end if;
end $$;

create unique index if not exists blocks_pair_uidx
  on public.blocks(blocker_id, blocked_id)
  where blocker_id is not null and blocked_id is not null;

-- التوافق
create table if not exists public.matches (
  id uuid primary key default gen_random_uuid(),
  member_one uuid references public.members(id) on delete cascade,
  member_two uuid references public.members(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table if exists public.matches add column if not exists member_one uuid references public.members(id) on delete cascade;
alter table if exists public.matches add column if not exists member_two uuid references public.members(id) on delete cascade;
alter table if exists public.matches add column if not exists created_at timestamptz not null default now();

do $$
begin
  if to_regclass('public.matches') is not null then
    if exists (select 1 from information_schema.columns where table_schema='public' and table_name='matches' and column_name='member1_id') then
      execute 'update public.matches set member_one = member1_id where member_one is null and member1_id is not null';
    end if;
    if exists (select 1 from information_schema.columns where table_schema='public' and table_name='matches' and column_name='member2_id') then
      execute 'update public.matches set member_two = member2_id where member_two is null and member2_id is not null';
    end if;
    if exists (select 1 from information_schema.columns where table_schema='public' and table_name='matches' and column_name='user1_id') then
      execute 'update public.matches set member_one = user1_id where member_one is null and user1_id is not null';
    end if;
    if exists (select 1 from information_schema.columns where table_schema='public' and table_name='matches' and column_name='user2_id') then
      execute 'update public.matches set member_two = user2_id where member_two is null and user2_id is not null';
    end if;
  end if;
end $$;

create index if not exists matches_one_idx on public.matches(member_one);
create index if not exists matches_two_idx on public.matches(member_two);

-- زيارات الملف
create table if not exists public.profile_views (
  id uuid primary key default gen_random_uuid(),
  viewer_id uuid references public.members(id) on delete cascade,
  viewed_id uuid references public.members(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table if exists public.profile_views add column if not exists viewer_id uuid references public.members(id) on delete cascade;
alter table if exists public.profile_views add column if not exists viewed_id uuid references public.members(id) on delete cascade;
alter table if exists public.profile_views add column if not exists created_at timestamptz not null default now();

do $$
begin
  if to_regclass('public.profile_views') is not null then
    if exists (select 1 from information_schema.columns where table_schema='public' and table_name='profile_views' and column_name='member_id') then
      execute 'update public.profile_views set viewer_id = member_id where viewer_id is null and member_id is not null';
    end if;
    if exists (select 1 from information_schema.columns where table_schema='public' and table_name='profile_views' and column_name='profile_member_id') then
      execute 'update public.profile_views set viewed_id = profile_member_id where viewed_id is null and profile_member_id is not null';
    end if;
    if exists (select 1 from information_schema.columns where table_schema='public' and table_name='profile_views' and column_name='viewed_member_id') then
      execute 'update public.profile_views set viewed_id = viewed_member_id where viewed_id is null and viewed_member_id is not null';
    end if;
  end if;
end $$;

create index if not exists profile_views_viewed_idx
  on public.profile_views(viewed_id, created_at desc);

-- البلاغات
create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid references public.members(id) on delete cascade,
  reported_member_id uuid references public.members(id) on delete cascade,
  reason text,
  details text,
  status text not null default 'pending',
  created_at timestamptz not null default now(),
  reviewed_at timestamptz,
  reviewed_by uuid references public.members(id) on delete set null
);

alter table if exists public.reports add column if not exists reporter_id uuid references public.members(id) on delete cascade;
alter table if exists public.reports add column if not exists reported_member_id uuid references public.members(id) on delete cascade;
alter table if exists public.reports add column if not exists reason text;
alter table if exists public.reports add column if not exists details text;
alter table if exists public.reports add column if not exists status text not null default 'pending';
alter table if exists public.reports add column if not exists created_at timestamptz not null default now();
alter table if exists public.reports add column if not exists reviewed_at timestamptz;
alter table if exists public.reports add column if not exists reviewed_by uuid references public.members(id) on delete set null;

do $$
begin
  if to_regclass('public.reports') is not null then
    if exists (select 1 from information_schema.columns where table_schema='public' and table_name='reports' and column_name='member_id') then
      execute 'update public.reports set reporter_id = member_id where reporter_id is null and member_id is not null';
    end if;
    if exists (select 1 from information_schema.columns where table_schema='public' and table_name='reports' and column_name='target_member_id') then
      execute 'update public.reports set reported_member_id = target_member_id where reported_member_id is null and target_member_id is not null';
    end if;
    if exists (select 1 from information_schema.columns where table_schema='public' and table_name='reports' and column_name='reported_id') then
      execute 'update public.reports set reported_member_id = reported_id where reported_member_id is null and reported_id is not null';
    end if;
  end if;
end $$;

create index if not exists reports_status_created_idx
  on public.reports(status, created_at desc);

-- =========================================================
-- 7) آدم/حواء والسجل المعرفي
-- =========================================================
create table if not exists public.assistant_logs (
  id uuid primary key default gen_random_uuid(),
  member_id uuid references public.members(id) on delete cascade,
  question text not null,
  answer text not null,
  created_at timestamptz not null default now()
);

alter table if exists public.assistant_logs add column if not exists member_id uuid references public.members(id) on delete cascade;
alter table if exists public.assistant_logs add column if not exists question text;
alter table if exists public.assistant_logs add column if not exists answer text;
alter table if exists public.assistant_logs add column if not exists created_at timestamptz not null default now();

create index if not exists assistant_logs_member_created_idx
  on public.assistant_logs(member_id, created_at desc);

create table if not exists public.moderation_violations (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references public.members(id) on delete cascade,
  violation_type text not null,
  source text not null,
  created_at timestamptz not null default now()
);

alter table if exists public.moderation_violations add column if not exists member_id uuid references public.members(id) on delete cascade;
alter table if exists public.moderation_violations add column if not exists violation_type text;
alter table if exists public.moderation_violations add column if not exists source text;
alter table if exists public.moderation_violations add column if not exists created_at timestamptz not null default now();

create index if not exists moderation_violations_member_created_idx
  on public.moderation_violations(member_id, created_at desc);

-- سؤال اليوم يحتاج unique حقيقي لأن الـAPI يستخدم ON CONFLICT.
alter table if exists public.daily_answers add column if not exists member_id uuid references public.members(id) on delete cascade;
alter table if exists public.daily_answers add column if not exists question_id uuid;
alter table if exists public.daily_answers add column if not exists answer_date date not null default current_date;

create unique index if not exists daily_answers_member_question_date_uidx
  on public.daily_answers(member_id, question_id, answer_date);

-- =========================================================
-- 8) الباقات: فضي / ذهبي / ماسي / ملكي
-- =========================================================
alter table if exists public.subscription_plans add column if not exists tier_id text;
alter table if exists public.subscription_plans add column if not exists display_name text;
alter table if exists public.subscription_plans add column if not exists badge text;
alter table if exists public.subscription_plans add column if not exists features jsonb not null default '{}'::jsonb;
alter table if exists public.subscription_plans add column if not exists is_active boolean not null default true;
alter table if exists public.subscription_plans add column if not exists sort_order integer not null default 0;
alter table if exists public.subscription_plans add column if not exists updated_at timestamptz not null default now();

alter table if exists public.subscription_plans alter column id set default gen_random_uuid();

create unique index if not exists subscription_plans_name_uidx
  on public.subscription_plans(name);

insert into public.subscription_plans
  (name, price, duration_months, description, features, is_active, sort_order, tier_id, display_name, badge)
values
(
  'شهر واحد', 99, 1,
  'العضوية الفضية لمدة شهر.',
  '{"receive_messages":true,"message_anyone":true,"hide_ads":true,"member_photos":true,"priority_support":true,"profile_badge":true}'::jsonb,
  true, 1, 'silver', 'العضوية الفضية', 'وسام فضي'
),
(
  '3 شهور', 199, 3,
  'العضوية الذهبية لمدة 3 أشهر.',
  '{"receive_messages":true,"message_anyone":true,"message_interest_only":true,"message_privacy":true,"hide_ads":true,"featured_profile":true,"change_username":true,"hidden_login":true,"member_photos":true,"priority_support":true,"profile_badge":true}'::jsonb,
  true, 2, 'gold', 'العضوية الذهبية', 'وسام ذهبي'
),
(
  '6 شهور', 399, 6,
  'العضوية الماسية لمدة 6 أشهر.',
  '{"receive_messages":true,"message_anyone":true,"message_interest_only":true,"message_privacy":true,"hide_ads":true,"featured_profile":true,"change_username":true,"hidden_login":true,"member_photos":true,"priority_support":true,"profile_badge":true,"profile_frame":true,"extended_visitors":true}'::jsonb,
  true, 3, 'diamond', 'العضوية الماسية', 'وسام ماسي'
),
(
  'سنة كاملة', 699, 12,
  'العضوية الملكية لمدة سنة.',
  '{"receive_messages":true,"message_anyone":true,"message_interest_only":true,"message_privacy":true,"hide_ads":true,"featured_profile":true,"change_username":true,"hidden_login":true,"member_photos":true,"priority_support":true,"profile_badge":true,"profile_frame":true,"extended_visitors":true}'::jsonb,
  true, 4, 'royal', 'العضوية الملكية', 'التاج الملكي'
)
on conflict (name) do update set
  price = excluded.price,
  duration_months = excluded.duration_months,
  description = excluded.description,
  features = excluded.features,
  is_active = true,
  sort_order = excluded.sort_order,
  tier_id = excluded.tier_id,
  display_name = excluded.display_name,
  badge = excluded.badge,
  updated_at = now();

alter table if exists public.subscription_codes add column if not exists plan_id uuid references public.subscription_plans(id) on delete restrict;
alter table if exists public.subscription_codes add column if not exists plan_months integer;
alter table if exists public.subscription_codes add column if not exists plan_price numeric(10,2);
alter table if exists public.subscription_codes add column if not exists is_used boolean not null default false;
alter table if exists public.subscription_codes add column if not exists used_by uuid references public.members(id) on delete set null;
alter table if exists public.subscription_codes add column if not exists used_at timestamptz;
alter table if exists public.subscription_codes add column if not exists expires_at timestamptz;
alter table if exists public.subscription_codes add column if not exists created_by uuid references public.members(id) on delete set null;

create unique index if not exists subscription_codes_code_uidx
  on public.subscription_codes(code);

alter table if exists public.subscriptions add column if not exists user_id uuid references public.members(id) on delete cascade;
alter table if exists public.subscriptions add column if not exists plan_id uuid references public.subscription_plans(id) on delete set null;
alter table if exists public.subscriptions add column if not exists plan_name text;
alter table if exists public.subscriptions add column if not exists price numeric(10,2) not null default 0;
alter table if exists public.subscriptions add column if not exists duration_months integer not null default 1;
alter table if exists public.subscriptions add column if not exists status text not null default 'active';
alter table if exists public.subscriptions add column if not exists starts_at timestamptz;
alter table if exists public.subscriptions add column if not exists ends_at timestamptz;
alter table if exists public.subscriptions add column if not exists updated_at timestamptz not null default now();

create index if not exists subscriptions_user_status_idx
  on public.subscriptions(user_id, status, ends_at desc);

-- =========================================================
-- 9) الدفع اليدوي — كل الحقول التي تحتاجها صفحة العضو والإدارة
-- =========================================================
create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references public.members(id) on delete cascade,
  amount numeric(10,2) not null default 0,
  wallet_number text,
  wallet_network text,
  sender_wallet text,
  proof_url text,
  plan_name text,
  duration_months integer,
  transaction_ref text,
  note text,
  status text not null default 'pending',
  reviewed_by uuid references public.members(id) on delete set null,
  reviewed_at timestamptz,
  rejection_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table if exists public.payments add column if not exists member_id uuid references public.members(id) on delete cascade;
alter table if exists public.payments add column if not exists amount numeric(10,2) not null default 0;
alter table if exists public.payments add column if not exists wallet_number text;
alter table if exists public.payments add column if not exists wallet_network text;
alter table if exists public.payments add column if not exists sender_wallet text;
alter table if exists public.payments add column if not exists proof_url text;
alter table if exists public.payments add column if not exists plan_name text;
alter table if exists public.payments add column if not exists duration_months integer;
alter table if exists public.payments add column if not exists transaction_ref text;
alter table if exists public.payments add column if not exists note text;
alter table if exists public.payments add column if not exists status text not null default 'pending';
alter table if exists public.payments add column if not exists reviewed_by uuid references public.members(id) on delete set null;
alter table if exists public.payments add column if not exists reviewed_at timestamptz;
alter table if exists public.payments add column if not exists rejection_reason text;
alter table if exists public.payments add column if not exists created_at timestamptz not null default now();
alter table if exists public.payments add column if not exists updated_at timestamptz not null default now();

create index if not exists payments_member_created_idx
  on public.payments(member_id, created_at desc);

create index if not exists payments_status_created_idx
  on public.payments(status, created_at desc);

-- =========================================================
-- 10) الإدارة والمحتوى
-- =========================================================
create table if not exists public.admin_logs (
  id uuid primary key default gen_random_uuid(),
  admin_id uuid references public.members(id) on delete set null,
  action text not null,
  target_type text,
  target_id text,
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.site_settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

insert into public.site_settings(key, value)
values
  ('platform_identity', '{"name":"قلبي لوڤي","country":"مصر","serious_marriage":true}'::jsonb),
  ('founder_program', '{"limit":1000,"enabled":true}'::jsonb),
  ('payment', '{"method":"كاش","phone":"01141353008","networks":["فودافون كاش","أورنج كاش","اتصالات كاش","وي كاش"]}'::jsonb)
on conflict (key) do update set
  value = excluded.value,
  updated_at = now();

-- =========================================================
-- 11) Storage
-- =========================================================
insert into storage.buckets(id, name, public, file_size_limit, allowed_mime_types)
values
(
  'member-photos', 'member-photos', true, 5242880,
  array['image/jpeg','image/png','image/webp']
),
(
  'payment-receipts', 'payment-receipts', true, 5242880,
  array['image/jpeg','image/png','image/webp']
),
(
  'voice-messages', 'voice-messages', true, 15728640,
  array['audio/webm','audio/ogg','audio/mp4','audio/mpeg','audio/wav','audio/x-m4a']
),
(
  'voice-intros', 'voice-intros', true, 15728640,
  array['audio/webm','audio/ogg','audio/mp4','audio/mpeg','audio/wav','audio/x-m4a']
),
(
  'voices', 'voices', true, 15728640,
  array['audio/webm','audio/ogg','audio/mp4','audio/mpeg','audio/wav','audio/x-m4a']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- =========================================================
-- 12) RLS: التطبيق الحالي يعمل بCookie خاصة به وService Role على السيرفر
-- =========================================================
do $$
declare
  table_name text;
begin
  foreach table_name in array array[
    'members','member_details','member_settings','photos','messages','notifications',
    'favorites','interests','blocks','matches','profile_views','reports',
    'assistant_logs','moderation_violations','password_reset_tokens',
    'subscription_plans','subscription_codes','subscriptions','payments',
    'admin_logs','site_settings','daily_questions','daily_answers'
  ]
  loop
    if to_regclass('public.' || table_name) is not null then
      execute format('alter table public.%I enable row level security', table_name);
    end if;
  end loop;
end $$;

-- لا نفتح سياسات anon/authenticated عامة على الجداول الحساسة.
-- القراءة والكتابة الحساسة تمر عبر API الخادم باستخدام Service Role.

commit;
