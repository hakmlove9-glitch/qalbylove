begin;

-- إيصالات الدفع بيانات مالية حساسة، لذلك لا تبقى عامة.
insert into storage.buckets(id, name, public, file_size_limit, allowed_mime_types)
values (
  'payment-receipts', 'payment-receipts', false, 5242880,
  array['image/jpeg','image/png','image/webp']
)
on conflict (id) do update set
  public = false,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- التوثيق مستقل عن الاشتراك، ولا توجد عضوية تشتري حق مراسلة شخص بلا اهتمام متبادل.
update public.subscription_plans
set
  includes_verification = false,
  features = case tier_id
    when 'silver' then '{"hide_ads":true,"priority_support":true,"profile_badge":true,"message_privacy":true}'::jsonb
    when 'gold' then '{"hide_ads":true,"featured_profile":true,"change_username":true,"hidden_login":true,"priority_support":true,"profile_badge":true,"message_privacy":true}'::jsonb
    when 'diamond' then '{"hide_ads":true,"featured_profile":true,"change_username":true,"hidden_login":true,"priority_support":true,"profile_badge":true,"profile_frame":true,"extended_visitors":true,"message_privacy":true}'::jsonb
    when 'royal' then '{"hide_ads":true,"featured_profile":true,"change_username":true,"hidden_login":true,"priority_support":true,"profile_badge":true,"profile_frame":true,"extended_visitors":true,"message_privacy":true}'::jsonb
    else features - 'message_anyone' - 'member_photos' - 'receive_messages'
  end,
  updated_at = now()
where is_active = true;

insert into public.site_settings(key, value)
values
  ('registration_is_free', 'true'::jsonb),
  ('profiles_are_free_to_browse', 'true'::jsonb),
  ('verification_is_paid_feature', 'false'::jsonb),
  ('message_requires_mutual_interest', 'true'::jsonb)
on conflict (key) do update set value = excluded.value, updated_at = now();

commit;
