-- Frontend workflow: drafts, bookmarks, and rich replies.
alter table public.posts
  add column if not exists status text not null default 'published'
    check (status in ('draft', 'published')),
  add column if not exists updated_at timestamptz not null default now();

create index if not exists idx_posts_user_status_updated
  on public.posts(user_id, status, updated_at desc)
  where deleted_at is null;

create table if not exists public.bookmarks (
  user_id bigint not null references public.users(id) on delete cascade,
  post_id bigint not null references public.posts(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, post_id)
);

alter table public.comments
  add column if not exists image_url text,
  add column if not exists gif_url text,
  add column if not exists sticker text,
  add column if not exists parent_comment_id bigint references public.comments(id) on delete set null;

create index if not exists idx_comments_parent on public.comments(parent_comment_id);
