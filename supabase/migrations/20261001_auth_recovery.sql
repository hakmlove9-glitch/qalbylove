create table if not exists public.password_reset_tokens (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references public.members(id) on delete cascade,
  token_hash text not null unique,
  expires_at timestamptz not null,
  used_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists password_reset_tokens_member_idx on public.password_reset_tokens(member_id);
create index if not exists password_reset_tokens_expires_idx on public.password_reset_tokens(expires_at);
