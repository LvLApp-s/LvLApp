import io
import unittest
from pathlib import Path
from types import SimpleNamespace
from unittest.mock import patch

from werkzeug.datastructures import FileStorage

import app as zapp


ROOT = Path(__file__).resolve().parents[1]


class FrontendPhaseTests(unittest.TestCase):
    def setUp(self):
        zapp.app.config.update(TESTING=True, WTF_CSRF_ENABLED=False)

    def test_remember_me_and_local_cookie_configuration_exist(self):
        auth = (ROOT / "templates" / "auth.html").read_text(encoding="utf-8")
        source = (ROOT / "app.py").read_text(encoding="utf-8")
        self.assertIn('name="remember_me"', auth)
        self.assertIn("session.permanent", source)
        self.assertIn("session_cookie_config", source)
        self.assertTrue(zapp.session_cookie_config({"VERCEL": "1"})["SESSION_COOKIE_SECURE"])

    def test_draft_and_bookmark_routes_are_registered(self):
        routes = {rule.rule for rule in zapp.app.url_map.iter_rules()}
        self.assertIn("/drafts", routes)
        self.assertIn("/posts/<int:post_id>/edit", routes)
        self.assertIn("/toggle_bookmark", routes)

    def test_rich_reply_form_is_progressive(self):
        post = (ROOT / "templates" / "post.html").read_text(encoding="utf-8")
        script = (ROOT / "static" / "js" / "script.js").read_text(encoding="utf-8")
        self.assertIn("data-ajax-reply-form", post)
        self.assertIn("data-emoji-picker", post)
        self.assertIn("data-sticker-picker", post)
        self.assertIn("function initRichReplies()", script)
        self.assertIn("data.append('ajax', '1')", script)

    def test_post_actions_include_direct_share_and_bookmark(self):
        card = (ROOT / "templates" / "_post_card.html").read_text(encoding="utf-8")
        detail = (ROOT / "templates" / "post.html").read_text(encoding="utf-8")
        self.assertIn("url_for('share_post', post_id=post.id)", card)
        self.assertIn("url_for('toggle_bookmark')", card)
        self.assertIn("url_for('share_post', post_id=post.id)", detail)
        self.assertIn("url_for('toggle_bookmark')", detail)

    def test_image_only_post_can_be_edited_without_required_text(self):
        edit = (ROOT / "templates" / "edit_post.html").read_text(encoding="utf-8")
        self.assertNotIn('name="content" maxlength="280" rows="6" required', edit)
        self.assertIn("if post.status == 'draft'", edit)
        self.assertIn("'Save changes'", edit)

    def test_profile_photo_limit_is_enforced_in_client_and_server(self):
        settings = (ROOT / "templates" / "settings.html").read_text(encoding="utf-8")
        source = (ROOT / "app.py").read_text(encoding="utf-8")
        self.assertIn("sourceFile.size > 5 * 1024 * 1024", settings)
        self.assertIn("MAX_PROFILE_IMAGE_BYTES = 5 * 1024 * 1024", source)
        self.assertIn("max_bytes=MAX_PROFILE_IMAGE_BYTES", source)

    def test_media_is_lazy_and_clips_are_progressive(self):
        card = (ROOT / "templates" / "_post_card.html").read_text(encoding="utf-8")
        reel = (ROOT / "templates" / "_reel_card.html").read_text(encoding="utf-8")
        self.assertIn('loading="lazy"', card)
        self.assertIn('preload="none"', reel)

    def test_frontend_migration_is_additive(self):
        migration = (ROOT / "database" / "migrations" / "011_frontend_workflow.sql").read_text(encoding="utf-8")
        self.assertIn("add column if not exists status", migration.lower())
        self.assertIn("create table if not exists public.bookmarks", migration.lower())
        self.assertIn("add column if not exists image_url", migration.lower())

    def test_visible_post_filter_excludes_drafts(self):
        rows = [
            {"id": 1, "user_id": 7, "status": "published"},
            {"id": 2, "user_id": 7, "status": "draft"},
        ]
        with patch.object(zapp, "blocked_user_ids_for_viewer", return_value=set()):
            visible = zapp.visible_post_filter(rows, 7)
        self.assertEqual([row["id"] for row in visible], [1])

    def test_published_query_falls_back_for_pre_migration_schema(self):
        attempts = []

        class Query:
            def __init__(self):
                self.with_status = False

            def eq(self, key, _value):
                if key == "status":
                    self.with_status = True
                return self

            def execute(self):
                attempts.append(self.with_status)
                if self.with_status:
                    raise RuntimeError("Could not find the 'status' column in the schema cache")
                return SimpleNamespace(data=[{"id": 1}])

        result = zapp.execute_published_posts(Query)
        self.assertEqual(result.data, [{"id": 1}])
        self.assertEqual(attempts, [True, False])

    def test_draft_creation_skips_publish_deduplication_and_xp(self):
        class Query:
            def __init__(self, db):
                self.db = db

            def insert(self, payload):
                self.db.payload = payload
                return self

            def execute(self):
                return SimpleNamespace(data=[{"id": 41}])

        class FakeSupabase:
            payload = None

            def table(self, name):
                self.table_name = name
                return Query(self)

        fake = FakeSupabase()
        viewer = {"id": 7, "username": "viewer"}
        with zapp.app.test_request_context("/create_post", method="POST", data={"content": "work in progress", "intent": "draft"}), \
             patch.object(zapp, "get_current_user", return_value=viewer), \
             patch.object(zapp, "supabase", fake), \
             patch.object(zapp, "recent_duplicate_submission") as duplicate, \
             patch.object(zapp, "award_xp") as award_xp:
            response = zapp.create_post()

        self.assertEqual(response.status_code, 302)
        self.assertEqual(fake.payload["status"], "draft")
        duplicate.assert_not_called()
        award_xp.assert_not_called()

    def test_ajax_reply_rejects_parent_from_another_post(self):
        class Query:
            def __init__(self, name):
                self.name = name
                self.filters = []

            def select(self, *_args, **_kwargs):
                return self

            def eq(self, key, value):
                self.filters.append((key, value))
                return self

            def is_(self, *_args):
                return self

            def execute(self):
                if self.name == "posts":
                    return SimpleNamespace(data=[{"id": 1, "user_id": 8, "status": "published"}])
                return SimpleNamespace(data=[])

        fake = SimpleNamespace(table=lambda name: Query(name))
        viewer = {"id": 7, "username": "viewer", "display_name": "Viewer"}
        with zapp.app.test_request_context("/add_comment", method="POST", data={
            "post_id": "1", "parent_comment_id": "99", "comment": "hello", "ajax": "1"
        }), patch.object(zapp, "get_current_user", return_value=viewer), \
             patch.object(zapp, "supabase", fake), \
             patch.object(zapp, "interaction_blocked", return_value=False):
            response, status = zapp.add_comment()

        self.assertEqual(status, 400)
        self.assertFalse(response.get_json()["success"])
        self.assertIn("reply target", response.get_json()["error"].lower())

    def test_ajax_gif_reply_returns_rendered_comment(self):
        class Query:
            def __init__(self, name):
                self.name = name
                self.payload = None

            def select(self, *_args, **_kwargs):
                return self

            def eq(self, *_args):
                return self

            def is_(self, *_args):
                return self

            def insert(self, payload):
                self.payload = payload
                return self

            def execute(self):
                if self.name == "posts":
                    return SimpleNamespace(data=[{"id": 1, "user_id": 7, "status": "published"}])
                if self.name == "comments" and self.payload is not None:
                    return SimpleNamespace(data=[{
                        "id": 55,
                        "post_id": 1,
                        "user_id": 7,
                        "comment": "",
                        "gif_url": self.payload["gif_url"],
                        "created_at": "2026-08-11T12:00:00+00:00",
                    }])
                return SimpleNamespace(data=[])

        fake = SimpleNamespace(table=lambda name: Query(name))
        viewer = {"id": 7, "username": "viewer", "display_name": "Viewer", "profile_photo_url": ""}
        with zapp.app.test_request_context("/add_comment", method="POST", data={
            "post_id": "1", "gif_url": "https://example.com/reaction.gif", "ajax": "1"
        }), patch.object(zapp, "get_current_user", return_value=viewer), \
             patch.object(zapp, "supabase", fake), \
             patch.object(zapp, "interaction_blocked", return_value=False), \
             patch.object(zapp, "award_xp"):
            response = zapp.add_comment()

        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.get_json()["success"])
        self.assertIn("reaction.gif", response.get_json()["html"])

    def test_ajax_bookmark_rejects_draft_post(self):
        touched = []

        class Query:
            def __init__(self, name):
                self.name = name

            def select(self, *_args, **_kwargs):
                return self

            def eq(self, *_args):
                return self

            def is_(self, *_args):
                return self

            def execute(self):
                touched.append(self.name)
                return SimpleNamespace(data=[{"id": 2, "user_id": 7, "status": "draft"}])

        fake = SimpleNamespace(table=lambda name: Query(name))
        with zapp.app.test_request_context("/toggle_bookmark", method="POST", data={"post_id": "2", "ajax": "1"}), \
             patch.object(zapp, "get_current_user", return_value={"id": 7}), \
             patch.object(zapp, "supabase", fake):
            response, status = zapp.toggle_bookmark()

        self.assertEqual(status, 404)
        self.assertFalse(response.get_json()["success"])
        self.assertEqual(touched, ["posts"])

    def test_profile_photo_server_limit_rejects_oversized_file(self):
        oversized = FileStorage(
            stream=io.BytesIO(b"x" * (zapp.MAX_PROFILE_IMAGE_BYTES + 1)),
            filename="avatar.jpg",
            content_type="image/jpeg",
        )
        with self.assertRaisesRegex(ValueError, "5 MB"):
            zapp.upload_image_to_storage(oversized, "avatars/7", max_bytes=zapp.MAX_PROFILE_IMAGE_BYTES)


if __name__ == "__main__":
    unittest.main()
