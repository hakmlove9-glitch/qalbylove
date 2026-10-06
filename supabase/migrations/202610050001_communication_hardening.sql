-- QalbyLove communication hardening
-- 1) Voice messages are private. They are served through short-lived signed URLs from the server.
update storage.buckets
set public = false
where id in ('voice-messages', 'voices');

-- 2) A pair can have only one mutual match, regardless of member ordering.
delete from public.matches where member_one is null or member_two is null or member_one = member_two;

with ranked as (
  select id,
         row_number() over (
           partition by least(member_one, member_two), greatest(member_one, member_two)
           order by created_at asc, id asc
         ) as rn
  from public.matches
)
delete from public.matches m
using ranked r
where m.id = r.id and r.rn > 1;

create unique index if not exists matches_pair_unique_idx
  on public.matches (least(member_one, member_two), greatest(member_one, member_two));
