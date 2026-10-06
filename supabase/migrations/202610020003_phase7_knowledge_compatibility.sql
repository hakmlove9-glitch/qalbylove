begin;

alter table if exists public.member_details add column if not exists marriage_intent text;
alter table if exists public.member_details add column if not exists health_privacy text not null default 'members';
alter table if exists public.member_details add column if not exists voice_intro_url text;
alter table if exists public.member_details add column if not exists voice_intro_path text;
alter table if exists public.member_details add column if not exists voice_intro_duration integer;

create table if not exists public.daily_questions (
  id uuid primary key default gen_random_uuid(),
  prompt text not null unique,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.daily_answers (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references public.members(id) on delete cascade,
  question_id uuid not null references public.daily_questions(id) on delete cascade,
  answer_date date not null default current_date,
  answer text not null check (char_length(answer) <= 280),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(member_id, question_id, answer_date)
);

create index if not exists daily_answers_member_idx on public.daily_answers(member_id, answer_date desc);

insert into public.daily_questions (prompt, sort_order) values
('إيه أكتر صفة بتخليك تحس بالأمان مع شريك حياتك؟', 1),
('شكل يوم هادي وسعيد بالنسبالك بعد الزواج عامل إزاي؟', 2),
('إيه الحاجة اللي مستحيل تتنازل عنها في علاقة جادة؟', 3),
('لما تزعل، تفضّل مساحة هادية ولا الكلام فورًا؟', 4),
('إيه معنى الاستقرار بالنسبة لك؟', 5),
('إيه دور العائلة في حياتك بعد الزواج؟', 6),
('إيه عادة بسيطة تتمنى تشاركها يوميًا مع شريك حياتك؟', 7)
on conflict (prompt) do nothing;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('voice-intros', 'voice-intros', true, 6291456, array['audio/webm','audio/ogg','audio/mp4','audio/mpeg','audio/wav'])
on conflict (id) do update set public = true, file_size_limit = 6291456;

commit;
