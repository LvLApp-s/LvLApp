from pathlib import Path
import unittest


ROOT = Path(__file__).resolve().parents[1]


class DatabaseMigrationTests(unittest.TestCase):
    def test_performance_migration_is_registered(self):
        readme = (ROOT / "database" / "README.md").read_text()

        self.assertIn("migrations/014_performance_indexes.sql", readme)
        self.assertIn("migrations/015_attachment_storage_bucket.sql", readme)
        self.assertIn("migrations/016_user_account_status.sql", readme)
        self.assertLess(
            readme.index("migrations/013_post_drafts.sql"),
            readme.index("migrations/014_performance_indexes.sql"),
        )
        self.assertLess(
            readme.index("migrations/014_performance_indexes.sql"),
            readme.index("migrations/015_attachment_storage_bucket.sql"),
        )
        self.assertLess(
            readme.index("migrations/015_attachment_storage_bucket.sql"),
            readme.index("migrations/016_user_account_status.sql"),
        )

    def test_performance_migration_covers_hot_paths(self):
        sql = (ROOT / "database" / "migrations" / "014_performance_indexes.sql").read_text().lower()

        expected_snippets = [
            "create extension if not exists pg_trgm",
            "idx_posts_content_trgm_visible",
            "idx_messages_sender_created",
            "idx_messages_receiver_created",
            "idx_notifications_user_id_desc",
            "idx_likes_user_created",
            "idx_comment_likes_comment_created",
            "idx_reels_active_view_created",
            "idx_reel_likes_user_reel",
            "idx_user_safety_reports_created",
            "idx_verification_requests_user_created",
        ]
        for snippet in expected_snippets:
            with self.subTest(snippet=snippet):
                self.assertIn(snippet, sql)

    def test_attachment_storage_migration_creates_private_bucket(self):
        sql = (ROOT / "database" / "migrations" / "015_attachment_storage_bucket.sql").read_text().lower()

        expected_snippets = [
            "insert into storage.buckets",
            "'lvl-attachments'",
            "false",
            "15728640",
            "'application/pdf'",
            "'audio/mpeg'",
            "'image/jpeg'",
            "'video/mp4'",
            "on conflict (id) do update",
            "allowed_mime_types = excluded.allowed_mime_types",
        ]
        for snippet in expected_snippets:
            with self.subTest(snippet=snippet):
                self.assertIn(snippet, sql)

    def test_user_account_status_migration_prepares_reversible_restrictions(self):
        sql = (ROOT / "database" / "migrations" / "016_user_account_status.sql").read_text().lower()

        expected_snippets = [
            "add column if not exists account_status",
            "check (account_status in ('active', 'suspended', 'banned'))",
            "add column if not exists account_status_reason",
            "add column if not exists suspended_until",
            "add column if not exists account_status_updated_by",
            "idx_users_account_status",
            "idx_users_suspended_until",
        ]
        for snippet in expected_snippets:
            with self.subTest(snippet=snippet):
                self.assertIn(snippet, sql)


if __name__ == "__main__":
    unittest.main()
