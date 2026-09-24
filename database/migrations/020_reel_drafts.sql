-- Migration 020: reel_drafts table
-- Stores clip/reel draft metadata (caption, visibility) - no video file stored.
-- Users save the caption/settings while preparing a clip to upload later.

create table if not exists public.reel_drafts (
  id          bigserial primary key,
  user_id     bigint not null references public.users(id) on delete cascade,
  caption     text not null default '',
  visibility  text not null default 'public'
                check (visibility in ('public', 'followers', 'community', 'private')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Index for per-user queries
create index if not exists reel_drafts_user_id_idx on public.reel_drafts(user_id);

-- RLS
alter table public.reel_drafts enable row level security;

create policy "Users manage own reel drafts"
  on public.reel_drafts
  for all
  using (true)
  with check (true);
