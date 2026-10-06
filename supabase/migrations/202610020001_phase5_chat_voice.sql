-- قلبي لوڤ - المرحلة الخامسة: الرسائل الحية والصوتية
-- Migration إضافية وغير هدّامة قدر الإمكان.

alter table if exists public.messages add column if not exists type text default 'text';
alter table if exists public.messages add column if not exists voice_url text;
alter table if exists public.messages add column if not exists is_read boolean default false;
alter table if exists public.messages add column if not exists created_at timestamptz default now();

-- بعض النسخ القديمة استخدمت read بدل is_read.
do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema='public' and table_name='messages' and column_name='read'
  ) then
    execute 'update public.messages set is_read = coalesce(is_read, read, false)';
  end if;
exception when others then null;
end $$;

create index if not exists idx_messages_sender_receiver_created on public.messages(sender_id, receiver_id, created_at desc);
create index if not exists idx_messages_receiver_unread on public.messages(receiver_id, is_read, created_at desc);

alter table if exists public.notifications add column if not exists content text;
alter table if exists public.notifications add column if not exists is_read boolean default false;
alter table if exists public.notifications add column if not exists created_at timestamptz default now();

do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema='public' and table_name='notifications' and column_name='message'
  ) then
    execute 'update public.notifications set content = coalesce(content, message) where content is null';
  end if;
  if exists (
    select 1 from information_schema.columns
    where table_schema='public' and table_name='notifications' and column_name='read'
  ) then
    execute 'update public.notifications set is_read = coalesce(is_read, read, false)';
  end if;
exception when others then null;
end $$;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'voice-messages',
  'voice-messages',
  true,
  12582912,
  array['audio/webm','audio/ogg','audio/mp4','audio/mpeg','audio/wav']
)
on conflict (id) do update
set public = true,
    file_size_limit = 12582912,
    allowed_mime_types = array['audio/webm','audio/ogg','audio/mp4','audio/mpeg','audio/wav'];
