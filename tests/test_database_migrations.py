from pathlib import Path
import unittest


ROOT = Path(__file__).resolve().parents[1]


class DatabaseMigrationTests(unittest.TestCase):
    def test_performance_migration_is_registered(self):
        readme = (ROOT / "database" / "README.md").read_text()

        self.assertIn("migrations/014_performance_indexes.sql", readme)
        self.assertLess(
            readme.index("migrations/013_post_drafts.sql"),
            readme.index("migrations/014_performance_indexes.sql"),
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


if __name__ == "__main__":
    unittest.main()
