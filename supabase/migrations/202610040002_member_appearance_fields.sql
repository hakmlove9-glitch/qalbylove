-- QalbyLove: detailed appearance fields captured during signup.
alter table if exists public.member_details add column if not exists skin_color text;
alter table if exists public.member_details add column if not exists hair_color text;
alter table if exists public.member_details add column if not exists eye_color text;
alter table if exists public.member_details add column if not exists beard_style text;
alter table if exists public.member_details add column if not exists hijab_style text;
alter table if exists public.member_details add column if not exists clothing_style text;

comment on column public.member_details.beard_style is 'تفاصيل اللحية للعضو الرجل';
comment on column public.member_details.hijab_style is 'تفاصيل الحجاب للعضوة';
comment on column public.member_details.clothing_style is 'أسلوب اللباس المفضل للعضو';
