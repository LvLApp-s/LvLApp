-- ============================================================
-- Migration 017: Reel Bookmarks
-- Enables users to save/bookmark reels/clips for later viewing.
-- ============================================================

create table if not exists public.reel_bookmarks (
  user_id bigint not null references public.users(id) on delete cascade,
  reel_id bigint not null references public.reels(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, reel_id)
);

create index if not exists idx_reel_bookmarks_user
  on public.reel_bookmarks(user_id);

create index if not exists idx_reel_bookmarks_reel
  on public.reel_bookmarks(reel_id);

alter table public.reel_bookmarks enable row level security;
