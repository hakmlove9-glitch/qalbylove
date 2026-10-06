-- توافق نهائي مع جدول photos القديم.
-- بعض النسخ القديمة كانت تحتوي user_id NOT NULL بجانب member_id.
-- الكود النهائي يعتمد member_id، لذلك نسمح لـ user_id أن يكون فارغًا بدل تعطيل الرفع.

begin;

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
    execute 'alter table public.photos alter column user_id drop not null';

    if exists (
      select 1
      from information_schema.columns
      where table_schema = 'public'
        and table_name = 'photos'
        and column_name = 'member_id'
    ) then
      execute 'update public.photos set member_id = user_id where member_id is null and user_id is not null';
    end if;
  end if;
end $$;

create index if not exists photos_member_created_idx
  on public.photos(member_id, created_at desc);

commit;
