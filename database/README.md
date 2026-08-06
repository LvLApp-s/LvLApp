# Database Files

The active application uses Supabase/PostgreSQL through `app.py`.

For a fresh Supabase project, run the SQL files in this order:

1. `000_base_schema.sql`
2. `community_schema.sql`
3. `migrations/001_product_hardening.sql`
4. `migrations/002_reels.sql`
5. `migrations/004_streaks.sql`
6. `migrations/005_oauth_identity.sql`
7. `migrations/005_reel_notifications.sql`
8. `migrations/006_password_reset_tokens.sql`
9. `migrations/007_comment_interactions.sql`
10. `migrations/008_careers_schema.sql`
11. `migrations/009_messages_attachments_deletion.sql`
12. `migrations/010_contact_suggestions_verification.sql`
13. `migrations/011_storage_bucket.sql`
14. `migrations/012_enable_rls_remaining_tables.sql`
15. `migrations/013_post_drafts.sql`

`migrations/003_safety_and_demo.sql` is optional demo seed data. Do not run it in production unless you intentionally want demo users/posts.

- `000_base_schema.sql` contains the core app tables required by `app.py`: users, posts, comments, likes, reposts, follows, friendships, messages, notifications, and XP events.
- `community_schema.sql` contains the current community-related Supabase tables.
- `migrations/001_product_hardening.sql` adds current production hardening columns, indexes, unique constraints, media support, onboarding fields, and safety-action tables.
- `migrations/002_reels.sql` adds the first-class Reels tables.
- `migrations/003_safety_and_demo.sql` adds user safety actions and optional demo content.
- `migrations/004_streaks.sql` adds high-five streak tracking.
- `migrations/005_oauth_identity.sql` adds Supabase Auth identity columns for social login.
- `migrations/006_password_reset_tokens.sql` adds hashed password reset tokens for normal email login.
- `migrations/011_storage_bucket.sql` creates the public `lvl-media` Supabase Storage bucket used by uploads.
- `migrations/012_enable_rls_remaining_tables.sql` enables RLS on remaining app tables accessed by the service-role backend.
- `migrations/013_post_drafts.sql` adds backend-owned saved post drafts for future compose autosave UI.
- `legacy/mysql_schema.sql` is an archived MySQL/XAMPP schema from the old PHP version. Do not use it for the Flask/Supabase app.

Future database changes should be written as Supabase/PostgreSQL migrations, not MySQL scripts.
