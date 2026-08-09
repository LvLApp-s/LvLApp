-- Performance indexes for the high-traffic Flask/Supabase paths.
-- Run after 013_post_drafts.sql.

create extension if not exists pg_trgm;

-- Search pages use ILIKE on these fields.
create index if not exists idx_posts_content_trgm_visible
  on public.posts using gin (content gin_trgm_ops)
  where deleted_at is null;

create index if not exists idx_users_username_trgm
  on public.users using gin (username gin_trgm_ops);

create index if not exists idx_users_display_name_trgm
  on public.users using gin (display_name gin_trgm_ops);

create index if not exists idx_users_nickname_trgm
  on public.users using gin (nickname gin_trgm_ops);

-- Direct messages query by either participant, latest id, and newest pages.
create index if not exists idx_messages_sender_created
  on public.messages(sender_id, created_at desc);

create index if not exists idx_messages_receiver_created
  on public.messages(receiver_id, created_at desc);

create index if not exists idx_messages_sender_id_desc
  on public.messages(sender_id, id desc);

create index if not exists idx_messages_receiver_id_desc
  on public.messages(receiver_id, id desc);

-- Polling and message notification read-sync endpoints.
create index if not exists idx_notifications_user_id_desc
  on public.notifications(user_id, id desc);

create index if not exists idx_notifications_message_unread
  on public.notifications(user_id, actor_id, created_at desc)
  where type = 'message' and is_read = false;

-- Profile/activity pages filter interactions by the acting user.
create index if not exists idx_likes_user_created
  on public.likes(user_id, created_at desc);

create index if not exists idx_reposts_user_created
  on public.reposts(user_id, created_at desc);

create index if not exists idx_comment_likes_comment_created
  on public.comment_likes(comment_id, created_at desc);

create index if not exists idx_comment_reposts_comment_created
  on public.comment_reposts(comment_id, created_at desc);

-- Reels discovery and viewer-state enrichment.
create index if not exists idx_reels_active_view_created
  on public.reels(view_count desc, created_at desc)
  where deleted_at is null and status = 'active';

create index if not exists idx_reel_likes_user_reel
  on public.reel_likes(user_id, reel_id);

create index if not exists idx_reel_views_user_reel
  on public.reel_views(user_id, reel_id);

-- Community member lists and reverse post lookups.
create index if not exists idx_community_members_community_created
  on public.community_members(community_id, created_at desc);

create index if not exists idx_community_posts_post
  on public.community_posts(post_id);

-- Safety/admin queues.
create index if not exists idx_user_safety_target_action_created
  on public.user_safety_actions(target_user_id, action_type, created_at desc);

create index if not exists idx_user_safety_reports_created
  on public.user_safety_actions(created_at desc)
  where action_type = 'report';

create index if not exists idx_job_positions_active_created
  on public.job_positions(created_at desc)
  where is_active = true;

create index if not exists idx_job_applications_created
  on public.job_applications(created_at desc);

create index if not exists idx_contact_messages_created
  on public.contact_messages(created_at desc);

create index if not exists idx_verification_requests_user_created
  on public.verification_requests(user_id, created_at desc);

create index if not exists idx_verification_requests_status_created
  on public.verification_requests(status, created_at desc);
