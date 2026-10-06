begin;

alter table if exists public.member_details
  add column if not exists governorate text;

create index if not exists member_details_governorate_idx
  on public.member_details(governorate);

commit;
