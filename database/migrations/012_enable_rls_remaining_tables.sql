-- Enable RLS on remaining public app tables that are accessed by the Flask service-role backend.
-- The backend service key bypasses RLS; leaving these enabled protects exposed public schemas.

alter table public.communities enable row level security;
alter table public.community_members enable row level security;
alter table public.community_posts enable row level security;
alter table public.community_videos enable row level security;
alter table public.reels enable row level security;
alter table public.reel_likes enable row level security;
alter table public.reel_comments enable row level security;
alter table public.reel_views enable row level security;
alter table public.user_safety_actions enable row level security;
alter table public.password_reset_tokens enable row level security;
alter table public.comment_likes enable row level security;
alter table public.comment_reposts enable row level security;
