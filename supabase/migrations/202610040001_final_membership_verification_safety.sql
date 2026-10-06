-- قلبي لوڤي — العضويات والتوثيق والأمان والمدفوعات النهائية
-- Migration إضافية محافظة على البيانات الحالية، ولا تحذف أي حساب أو رسالة أو دفعة.

begin;

create extension if not exists pgcrypto;

-- =========================================================
-- 1) حالة العضوية والتوثيق والتجميد
-- =========================================================
alter table if exists public.members add column if not exists membership_tier text not null default 'basic';
alter table if exists public.members add column if not exists verification_status text not null default 'unverified';
alter table if exists public.members add column if not exists verified_at timestamptz;
alter table if exists public.members add column if not exists verified_by uuid references public.members(id) on delete set null;
alter table if exists public.members add column if not exists safety_strikes integer not null default 0;
alter table if exists public.members add column if not exists suspended_until timestamptz;
alter table if exists public.members add column if not exists suspension_reason text;
alter table if exists public.members add column if not exists profile_completion integer not null default 0;

update public.members
set membership_tier = case
  when is_founder is true then 'founder'
  when membership_tier is null or btrim(membership_tier) = '' then 'basic'
  else membership_tier
end;

create index if not exists members_membership_tier_idx on public.members(membership_tier);
create index if not exists members_verification_status_idx on public.members(verification_status);
create index if not exists members_suspended_until_idx on public.members(suspended_until);

-- =========================================================
-- 2) طلبات توثيق الهوية
-- =========================================================
create table if not exists public.verification_requests (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references public.members(id) on delete cascade,
  request_type text not null default 'identity',
  status text not null default 'pending',
  document_path text,
  selfie_path text,
  note text,
  admin_note text,
  created_at timestamptz not null default now(),
  reviewed_at timestamptz,
  reviewed_by uuid references public.members(id) on delete set null
);

create index if not exists verification_requests_member_created_idx
  on public.verification_requests(member_id, created_at desc);
create index if not exists verification_requests_status_created_idx
  on public.verification_requests(status, created_at desc);

-- =========================================================
-- 3) سجل مخالفات الأمان والعقوبات
-- =========================================================
alter table if exists public.moderation_violations add column if not exists content_excerpt text;
alter table if exists public.moderation_violations add column if not exists metadata jsonb not null default '{}'::jsonb;
alter table if exists public.moderation_violations add column if not exists strike_number integer;
alter table if exists public.moderation_violations add column if not exists action_taken text;

create or replace function public.refresh_member_safety_state(p_member_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  recent_count integer := 0;
begin
  if p_member_id is null then
    return;
  end if;

  select count(*)::integer
  into recent_count
  from public.moderation_violations
  where member_id = p_member_id
    and created_at >= now() - interval '30 days';

  update public.members
  set safety_strikes = recent_count,
      suspended_until = case
        when recent_count >= 3 and coalesce(suspended_until, '-infinity'::timestamptz) < now()
          then now() + interval '24 hours'
        else suspended_until
      end,
      suspension_reason = case
        when recent_count >= 3 then coalesce(suspension_reason, 'تكرار محاولة مشاركة بيانات تواصل أو مخالفة قواعد الأمان')
        else suspension_reason
      end,
      updated_at = now()
  where id = p_member_id;
end;
$$;

create or replace function public.apply_safety_strike()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  perform public.refresh_member_safety_state(new.member_id);
  return new;
end;
$$;

drop trigger if exists trg_apply_safety_strike on public.moderation_violations;
create trigger trg_apply_safety_strike
after insert on public.moderation_violations
for each row execute function public.apply_safety_strike();

-- =========================================================
-- 4) المدفوعات اليدوية: دليل التحويل وربط الباقة
-- =========================================================
alter table if exists public.payments add column if not exists requested_plan_id uuid references public.subscription_plans(id) on delete set null;
alter table if exists public.payments add column if not exists requested_tier text;
alter table if exists public.payments add column if not exists proof_path text;
alter table if exists public.payments add column if not exists activation_code text;
alter table if exists public.payments add column if not exists approved_subscription_id uuid references public.subscriptions(id) on delete set null;

create index if not exists payments_transaction_ref_idx
  on public.payments(transaction_ref)
  where transaction_ref is not null and btrim(transaction_ref) <> '';
create index if not exists payments_sender_wallet_idx
  on public.payments(sender_wallet)
  where sender_wallet is not null and btrim(sender_wallet) <> '';

-- =========================================================
-- 5) الباقات المرئية والشارات
-- =========================================================
alter table if exists public.subscription_plans add column if not exists tier_id text;
alter table if exists public.subscription_plans add column if not exists display_name text;
alter table if exists public.subscription_plans add column if not exists badge text;
alter table if exists public.subscription_plans add column if not exists includes_verification boolean not null default false;
alter table if exists public.subscription_plans add column if not exists highlight text;

-- نحافظ على الباقات الحالية ونضيف مستويات مستقلة يمكن للإدارة تعديل أسعارها لاحقاً.
insert into public.subscription_plans
  (name, display_name, tier_id, badge, price, duration_months, description, features, includes_verification, highlight, is_active, sort_order)
values
  ('فضية شهرية', 'الفضية', 'silver', 'فضي', 99, 1,
   'مزايا إضافية وظهور أفضل لمدة شهر.',
   '{"featured_profile":true,"hide_ads":true,"priority_support":false,"voice_messages":true}'::jsonb,
   false, null, true, 10),
  ('ذهبية 3 شهور', 'الذهبية', 'gold', 'ذهبي', 249, 3,
   'ظهور أقوى ومزايا تواصل إضافية لمدة 3 شهور.',
   '{"featured_profile":true,"hide_ads":true,"priority_support":true,"voice_messages":true,"profile_boost":true}'::jsonb,
   false, 'الأكثر طلباً', true, 20),
  ('ماسية 6 شهور', 'الماسية', 'diamond', 'ماسي', 449, 6,
   'باقة طويلة بمزايا متقدمة وتشمل طلب التوثيق بدون رسوم إضافية.',
   '{"featured_profile":true,"hide_ads":true,"priority_support":true,"voice_messages":true,"profile_boost":true,"advanced_filters":true}'::jsonb,
   true, 'قيمة أعلى', true, 30),
  ('ملكية سنوية', 'الملكية', 'royal', 'ملكي', 699, 12,
   'الباقة السنوية الأعلى بمزايا كاملة وطلب توثيق مشمول.',
   '{"featured_profile":true,"hide_ads":true,"priority_support":true,"voice_messages":true,"profile_boost":true,"advanced_filters":true,"royal_badge":true}'::jsonb,
   true, 'أفضل قيمة سنوية', true, 40)
on conflict (name) do update set
  display_name = excluded.display_name,
  tier_id = excluded.tier_id,
  badge = excluded.badge,
  description = excluded.description,
  features = excluded.features,
  includes_verification = excluded.includes_verification,
  highlight = excluded.highlight,
  is_active = true,
  sort_order = excluded.sort_order,
  updated_at = now();

-- =========================================================
-- 6) إعدادات الموقع الصادقة: لا أرقام وهمية
-- =========================================================
insert into public.site_settings(key, value)
values
  ('founder_limit', '1000'::jsonb),
  ('show_fake_member_counts', 'false'::jsonb),
  ('show_fake_success_counts', 'false'::jsonb),
  ('verification_badge_color', '"green"'::jsonb),
  ('message_requires_mutual_interest', 'true'::jsonb),
  ('safety_strike_limit', '3'::jsonb),
  ('safety_suspension_hours', '24'::jsonb)
on conflict (key) do update set value = excluded.value;

-- =========================================================
-- 7) التخزين: مستندات التوثيق خاصة بالكامل
-- =========================================================
insert into storage.buckets(id, name, public, file_size_limit, allowed_mime_types)
values
(
  'verification-documents',
  'verification-documents',
  false,
  10485760,
  array['image/jpeg','image/png','image/webp','application/pdf']
)
on conflict (id) do update set
  public = false,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

alter table public.verification_requests enable row level security;

commit;
