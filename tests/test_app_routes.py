import io
import json
import os
import tempfile
import unittest
import inspect
from email import message_from_string
from datetime import datetime, timedelta, timezone
from pathlib import Path
from types import SimpleNamespace
from unittest.mock import patch
from werkzeug.datastructures import FileStorage

import bcrypt

import app as zapp


class FakeDraftsTable:
    def __init__(self, rows=None):
        self.rows = rows if rows is not None else []
        self.action = None
        self.selected = None
        self.inserted = None
        self.updated = None
        self.filters = []
        self.ordering = None
        self.limit_value = None

    def select(self, columns, **kwargs):
        self.action = "select"
        self.selected = columns
        return self

    def insert(self, payload):
        self.action = "insert"
        self.inserted = payload
        return self

    def update(self, payload):
        self.action = "update"
        self.updated = payload
        return self

    def delete(self):
        self.action = "delete"
        return self

    def eq(self, key, value):
        self.filters.append((key, value))
        return self

    def order(self, key, desc=False):
        self.ordering = (key, desc)
        return self

    def limit(self, value):
        self.limit_value = value
        return self

    def execute(self):
        if self.action == "insert":
            row = {"id": 91, **self.inserted}
            return SimpleNamespace(data=[row])
        return SimpleNamespace(data=self.rows)


class FakeDraftsSupabase:
    def __init__(self, table):
        self.drafts_table = table
        self.table_names = []

    def table(self, name):
        self.table_names.append(name)
        return self.drafts_table


class FakeDraftPublishTable:
    def __init__(self, db, name):
        self.db = db
        self.name = name
        self.action = None
        self.filters = []
        self.payload = None
        self.limit_value = None

    def select(self, *_args, **_kwargs):
        self.action = "select"
        return self

    def insert(self, payload):
        self.action = "insert"
        self.payload = payload
        return self

    def delete(self):
        self.action = "delete"
        return self

    def eq(self, key, value):
        self.filters.append((key, value))
        return self

    def limit(self, value):
        self.limit_value = value
        return self

    def execute(self):
        if self.name == "post_drafts" and self.action == "select":
            self.db.draft_select_filters = self.filters
            self.db.draft_select_limit = self.limit_value
            return SimpleNamespace(data=[self.db.draft] if self.db.draft else [])
        if self.name == "post_drafts" and self.action == "delete":
            self.db.draft_delete_filters = self.filters
            return SimpleNamespace(data=[{"id": self.db.draft["id"]}] if self.db.draft and self.db.delete_succeeds else [])
        if self.name == "posts" and self.action == "insert":
            self.db.post_inserted = self.payload
            return SimpleNamespace(data=[{"id": self.db.post_id, **self.payload}])
        return SimpleNamespace(data=[])


class FakeDraftPublishSupabase:
    def __init__(self, draft=None, delete_succeeds=True):
        self.draft = draft
        self.delete_succeeds = delete_succeeds
        self.post_id = 123
        self.post_inserted = None
        self.draft_select_filters = []
        self.draft_select_limit = None
        self.draft_delete_filters = []
        self.table_names = []

    def table(self, name):
        self.table_names.append(name)
        return FakeDraftPublishTable(self, name)


class AppRouteTests(unittest.TestCase):
    def setUp(self):
        zapp.app.config.update(TESTING=True, WTF_CSRF_ENABLED=False)
        self.client = zapp.app.test_client()

    def csrf(self):
        html = self.client.get("/auth").data.decode()
        return html.split('name="csrf_token" value="', 1)[1].split('"', 1)[0]

    def sample_post(self, post_id=42, user_id=8, username="demo", content="hello"):
        return {
            "id": post_id,
            "user_id": user_id,
            "content": content,
            "reply_count": 0,
            "repost_count": 0,
            "like_count": 0,
            "viewer_reposted": False,
            "viewer_liked": False,
            "is_repost": False,
            "user": {
                "id": user_id,
                "username": username,
                "display_name": "Demo User",
                "profile_photo_url": "",
                "level": 1,
            },
        }

    def test_timeline_dedupes_same_post_across_direct_and_repost(self):
        direct = self.sample_post(post_id=42, content="original")
        direct["timeline_created_at"] = "2026-06-01T10:00:00"
        direct["is_repost"] = False
        repost = self.sample_post(post_id=42, content="original")
        repost["timeline_created_at"] = "2026-06-01T11:00:00"
        repost["is_repost"] = True
        repost["reposted_by"] = {"username": "sam", "display_name": "Sam"}

        posts = zapp.dedupe_timeline_posts([repost, direct])

        self.assertEqual(len(posts), 1)
        self.assertTrue(posts[0]["is_repost"])

    def test_notification_stacking_uses_reel_id_for_reel_events(self):
        notifications = [
            {"type": "reel_like", "reel_id": 9, "actor_name": "Ada", "is_read": False},
            {"type": "reel_like", "reel_id": 9, "actor_name": "Sam", "is_read": True},
            {"type": "reel_like", "reel_id": 10, "actor_name": "Mina", "is_read": False},
        ]

        stacked = zapp.stack_notifications(notifications)

        self.assertEqual(len(stacked), 2)
        reel_9 = next(item for item in stacked if item["reel_id"] == 9)
        self.assertEqual(reel_9["stack_count"], 2)
        self.assertEqual(reel_9["actor_summary"], "Ada and Sam")

    def test_app_defines_shared_dedupe_helpers_once(self):
        source = inspect.getsource(zapp)

        self.assertEqual(source.count("def dedupe_timeline_posts("), 1)
        self.assertEqual(source.count("def create_notification("), 1)

    def test_admin_token_requires_configured_secret(self):
        with patch.dict(os.environ, {}, clear=True):
            self.assertFalse(zapp.admin_token_is_valid("admin123"))
            self.assertFalse(zapp.admin_token_is_valid(""))

        with patch.dict(os.environ, {"LVL_ADMIN_TOKEN": "secret"}, clear=True):
            self.assertTrue(zapp.admin_token_is_valid("secret"))
            self.assertFalse(zapp.admin_token_is_valid("admin123"))

    def test_flask_secret_key_is_required_in_production(self):
        with self.assertRaises(RuntimeError):
            zapp.resolve_flask_secret_key({"VERCEL_ENV": "production"})

        self.assertEqual(
            zapp.resolve_flask_secret_key({"VERCEL_ENV": "production", "FLASK_SECRET_KEY": "configured"}),
            "configured",
        )
        self.assertEqual(zapp.resolve_flask_secret_key({}), zapp.DEFAULT_DEV_SECRET_KEY)

    def test_session_cookie_config_supports_local_and_vercel_runtime(self):
        local_config = zapp.session_cookie_config({})
        self.assertFalse(local_config["SESSION_COOKIE_SECURE"])
        self.assertEqual(local_config["SESSION_COOKIE_SAMESITE"], "Lax")

        production_config = zapp.session_cookie_config({"VERCEL_ENV": "production"})
        self.assertTrue(production_config["SESSION_COOKIE_SECURE"])
        self.assertEqual(production_config["SESSION_COOKIE_SAMESITE"], "None")

        invalid_local_none = zapp.session_cookie_config({
            "SESSION_COOKIE_SECURE": "0",
            "SESSION_COOKIE_SAMESITE": "None",
        })
        self.assertEqual(invalid_local_none["SESSION_COOKIE_SAMESITE"], "Lax")

    def test_remember_session_lifetime_uses_bounded_day_count(self):
        self.assertEqual(zapp.remember_session_lifetime({}).days, 30)
        self.assertEqual(zapp.remember_session_lifetime({"REMEMBER_SESSION_DAYS": "7"}).days, 7)
        self.assertEqual(zapp.remember_session_lifetime({"REMEMBER_SESSION_DAYS": "0"}).days, 1)
        self.assertEqual(zapp.remember_session_lifetime({"REMEMBER_SESSION_DAYS": "365"}).days, 90)
        self.assertEqual(zapp.remember_session_lifetime({"REMEMBER_SESSION_DAYS": "bad"}).days, 30)

    def test_email_validation_requires_basic_address_shape(self):
        self.assertTrue(zapp.is_valid_email("sina@example.com"))
        self.assertTrue(zapp.is_valid_email("  sina+lvl@example.co  "))
        self.assertFalse(zapp.is_valid_email("invalid-email"))
        self.assertFalse(zapp.is_valid_email("missing-domain@"))
        self.assertFalse(zapp.is_valid_email("has space@example.com"))

    def test_password_reset_memory_fallback_is_disabled_on_vercel_production(self):
        with patch.dict(os.environ, {"VERCEL_ENV": "production"}, clear=True):
            self.assertFalse(zapp.password_reset_memory_fallback_enabled())

        with patch.dict(os.environ, {"APP_ENV": "development"}, clear=True):
            self.assertTrue(zapp.password_reset_memory_fallback_enabled())

    def test_mail_delivery_configuration_requires_sender_credentials(self):
        self.assertFalse(zapp.mail_delivery_is_configured({
            "username": "mailer@lvl.test",
            "password": "",
            "from_email": "noreply@lvl.test",
        }))
        self.assertTrue(zapp.mail_delivery_is_configured({
            "username": "mailer@lvl.test",
            "password": "smtp-secret",
            "from_email": "noreply@lvl.test",
        }))

    def test_oauth_sessions_are_persistent_by_default(self):
        self.assertTrue(zapp.oauth_session_remember({}))
        self.assertFalse(zapp.oauth_session_remember({"OAUTH_SESSION_REMEMBER": "0"}))

    def test_setup_health_reports_password_reset_email_readiness(self):
        with patch.object(zapp, "supabase", None), patch.dict(os.environ, {}, clear=True):
            missing = {check["label"]: check for check in zapp.get_setup_health()}

        self.assertEqual(missing["Password reset email"]["status"], "needs_attention")

        env = {
            "SMTP_FROM": "noreply@lvl.test",
            "SMTP_USERNAME": "mailer@lvl.test",
            "SMTP_PASSWORD": "smtp-secret",
        }
        with patch.object(zapp, "supabase", None), patch.dict(os.environ, env, clear=True):
            ready = {check["label"]: check for check in zapp.get_setup_health()}

        self.assertEqual(ready["Password reset email"]["status"], "ready")

    def test_default_video_upload_limit_matches_storage_bucket(self):
        self.assertEqual(zapp.MAX_VIDEO_BYTES, 50 * 1024 * 1024)

    def test_recent_duplicate_submission_queries_same_actor_text_and_window(self):
        class Result:
            data = [{"id": 99}]

        class FakeTable:
            def __init__(self):
                self.calls = []

            def select(self, columns):
                self.calls.append(("select", columns))
                return self

            def eq(self, key, value):
                self.calls.append(("eq", key, value))
                return self

            def gte(self, key, value):
                self.calls.append(("gte", key, value))
                return self

            def limit(self, value):
                self.calls.append(("limit", value))
                return self

            def execute(self):
                return Result()

        table = FakeTable()
        fake_supabase = SimpleNamespace(table=lambda name: table)

        with patch.object(zapp, "supabase", fake_supabase):
            duplicate = zapp.recent_duplicate_submission(
                "messages",
                {"sender_id": 7, "receiver_id": 8},
                "content",
                "hello",
            )

        self.assertTrue(duplicate)
        self.assertIn(("eq", "sender_id", 7), table.calls)
        self.assertIn(("eq", "receiver_id", 8), table.calls)
        self.assertIn(("eq", "content", "hello"), table.calls)
        self.assertTrue(any(call[0] == "gte" and call[1] == "created_at" for call in table.calls))
        self.assertIn(("limit", 1), table.calls)

    def test_submit_script_locks_content_forms_without_native_fallback_duplicates(self):
        script = Path("static/js/script.js").read_text(encoding="utf-8")
        home_template = Path("templates/index.html").read_text(encoding="utf-8")

        self.assertIn("function lockSubmitForm(form, submitBtn)", script)
        self.assertIn("composer.addEventListener('submit'", script)
        self.assertIn("chatForm.dataset.submitting === '1'", script)
        self.assertIn("commentForm.dataset.submitting === '1'", script)
        self.assertIn("data-draft-save-url", home_template)
        self.assertIn("data-save-draft", home_template)
        self.assertIn("draftDeleteUrl", script)
        self.assertIn("saveCurrentDraft", script)
        self.assertIn("restoreDraft", script)
        self.assertIn("data-load-older-messages", Path("templates/messages.html").read_text(encoding="utf-8"))
        self.assertIn("before_id", script)
        self.assertIn("loadOlderBtn", script)
        self.assertNotIn("chatForm.submit();", script)
        self.assertNotIn("commentForm.submit();", script)

    def test_notifications_page_and_live_script_use_event_ids(self):
        script = Path("static/js/script.js").read_text(encoding="utf-8")
        template = Path("templates/notifications.html").read_text(encoding="utf-8")
        css = Path("static/css/sections/notifications.css").read_text(encoding="utf-8")

        self.assertIn("data-notifications-feed", template)
        self.assertIn("data-latest-notification-id", template)
        self.assertIn("data-notification-id", template)
        self.assertIn("data-notifications-empty", template)
        self.assertIn("latest_notification_id", script)
        self.assertIn("latest_message_id", script)
        self.assertIn("refreshNotificationFeed", script)
        self.assertIn("/api/notifications?", script)
        self.assertIn("updateBadgeGroup('more'", script)
        self.assertIn("new-notification", css)

    def test_login_requires_credentials(self):
        with patch.object(zapp, "supabase", object()):
            response = self.client.post("/auth", data={
                "csrf_token": self.csrf(),
                "action": "login",
                "username": "",
                "password": ""
            })
        self.assertEqual(response.status_code, 200)
        self.assertIn(b"Username and password are required.", response.data)

    def test_password_login_remember_me_sets_permanent_session(self):
        class Result:
            def __init__(self, data=None):
                self.data = data or []

        class FakeUsersTable:
            def __init__(self):
                self.filters = {}

            def select(self, *_args, **_kwargs):
                return self

            def eq(self, key, value):
                self.filters[key] = value
                return self

            def execute(self):
                if self.filters.get("username") == "demo":
                    return Result([{
                        "id": 12,
                        "username": "demo",
                        "email": "demo@example.com",
                        "password_hash": "hashed",
                    }])
                return Result([])

        fake = SimpleNamespace(table=lambda _name: FakeUsersTable())
        csrf_token = self.csrf()
        with self.client.session_transaction() as sess:
            sess["stale_session_value"] = "remove-me"

        with patch.object(zapp, "supabase", fake), \
             patch.object(zapp.bcrypt, "checkpw", return_value=True), \
             patch.object(zapp, "award_xp"):
            response = self.client.post("/auth", data={
                "csrf_token": csrf_token,
                "action": "login",
                "username": "demo",
                "password": "secret123",
                "remember_me": "1",
            })

        self.assertEqual(response.status_code, 302)
        self.assertTrue(response.location.endswith("/"))
        self.assertIn("Expires=", response.headers.get("Set-Cookie", ""))
        with self.client.session_transaction() as sess:
            self.assertEqual(sess["user_id"], 12)
            self.assertTrue(sess.permanent)
            self.assertIn("csrf_token", sess)
            self.assertNotIn("stale_session_value", sess)

    def test_password_login_without_remember_me_uses_browser_session(self):
        class Result:
            def __init__(self, data=None):
                self.data = data or []

        class FakeUsersTable:
            def __init__(self):
                self.filters = {}

            def select(self, *_args, **_kwargs):
                return self

            def eq(self, key, value):
                self.filters[key] = value
                return self

            def execute(self):
                if self.filters.get("username") == "demo":
                    return Result([{
                        "id": 12,
                        "username": "demo",
                        "email": "demo@example.com",
                        "password_hash": "hashed",
                    }])
                return Result([])

        fake = SimpleNamespace(table=lambda _name: FakeUsersTable())
        with patch.object(zapp, "supabase", fake), \
             patch.object(zapp.bcrypt, "checkpw", return_value=True), \
             patch.object(zapp, "award_xp"):
            response = self.client.post("/auth", data={
                "csrf_token": self.csrf(),
                "action": "login",
                "username": "demo",
                "password": "secret123",
            })

        self.assertEqual(response.status_code, 302)
        self.assertNotIn("Expires=", response.headers.get("Set-Cookie", ""))
        with self.client.session_transaction() as sess:
            self.assertEqual(sess["user_id"], 12)
            self.assertFalse(sess.permanent)

    def test_nickname_fields_allow_uppercase_input(self):
        auth_html = self.client.get("/auth").data.decode()
        self.assertIn('name="nickname" pattern="[A-Za-z0-9_]{3,24}"', auth_html)
        self.assertIn('name="birthday"', auth_html)

        fake_user = {
            "id": 7,
            "first_name": "Demo",
            "last_name": "User",
            "nickname": "demo",
            "username": "demo",
            "display_name": "Demo User",
            "profile_photo_url": "",
            "theme_color": "#1D9BF0",
            "avatar_color": "#1D9BF0",
            "bio": "",
            "location": "",
            "website": "",
            "gender": "Male",
            "birthday": "",
        }
        with patch.object(zapp, "get_current_user", return_value=fake_user), \
             patch.object(zapp, "get_community_highlights", return_value=[]), \
             patch.object(zapp, "get_home_reel_preview", return_value=[]):
            settings_html = self.client.get("/settings").data.decode()
        self.assertIn('name="nickname" maxlength="24" pattern="[A-Za-z0-9_]{3,24}"', settings_html)
        self.assertIn('name="remove_profile_photo"', settings_html)

    def test_auth_page_lists_enabled_social_providers_only(self):
        auth_html = self.client.get("/auth").data.decode()

        self.assertIn('data-i18n="auth_continue_google"', auth_html)
        self.assertIn('data-i18n="auth_or_email"', auth_html)
        self.assertIn('name="remember_me" value="1"', auth_html)
        self.assertIn('data-i18n="auth_remember_me"', auth_html)
        self.assertIn('href="/forgot-password"', auth_html)
        self.assertIn('class="brand-mark brand-logo-large"', auth_html)
        self.assertIn("assets/icon-512.png", auth_html)
        self.assertNotIn('brand-mark large">LvL', auth_html)
        self.assertEqual([provider["provider"] for provider in zapp.SUPABASE_SOCIAL_PROVIDERS], ["google"])
        for provider in zapp.SUPABASE_SOCIAL_PROVIDERS:
            self.assertIn(provider["label"], auth_html)
            self.assertIn(f'/auth/oauth/{provider["provider"]}', auth_html)
        self.assertNotIn('GitHub', auth_html)
        self.assertNotIn('/auth/oauth/github', auth_html)
        self.assertNotIn('Discord', auth_html)
        self.assertNotIn('/auth/oauth/discord', auth_html)
        self.assertNotIn('/auth/oauth/facebook', auth_html)
        self.assertNotIn('/auth/oauth/apple', auth_html)
        self.assertNotIn('/auth/oauth/azure', auth_html)
        self.assertNotIn('/auth/oauth/x', auth_html)

    def test_oauth_start_rejects_disabled_provider_before_supabase_call(self):
        class FakeAuth:
            def sign_in_with_oauth(self, _credentials):
                raise AssertionError("disabled providers must not start Supabase OAuth")

        with patch.object(zapp, "supabase", SimpleNamespace(auth=FakeAuth())):
            for provider in ["facebook", "github", "discord"]:
                response = self.client.get(f"/auth/oauth/{provider}")
                self.assertEqual(response.status_code, 302)
                self.assertTrue(response.location.endswith("/auth"))

    def test_oauth_start_redirects_to_supabase_provider(self):
        class FakeStorage:
            def __init__(self):
                self.items = {}

            def get_item(self, key):
                return self.items.get(key)

            def set_item(self, key, value):
                self.items[key] = value

        class FakeAuth:
            def __init__(self):
                self.calls = []
                self._storage_key = "supabase.auth.token"
                self._storage = FakeStorage()

            def sign_in_with_oauth(self, credentials):
                self.calls.append(credentials)
                self._storage.set_item("supabase.auth.token-code-verifier", "test-verifier")
                return SimpleNamespace(url="https://project.supabase.co/auth/v1/authorize?provider=google")

        fake = SimpleNamespace(auth=FakeAuth())

        with patch.object(zapp, "supabase", fake), \
             patch.object(zapp, "create_oauth_supabase_client", return_value=fake):
            response = self.client.get("/auth/oauth/google")

        self.assertEqual(response.status_code, 302)
        self.assertEqual(response.location, "https://project.supabase.co/auth/v1/authorize?provider=google")
        credentials = fake.auth.calls[0]
        self.assertEqual(credentials["provider"], "google")
        self.assertTrue(credentials["options"]["redirect_to"].endswith("/auth/oauth/callback"))
        self.assertNotIn("query_params", credentials["options"])
        with self.client.session_transaction() as sess:
            self.assertEqual(sess["oauth_provider"], "google")
            self.assertEqual(sess["oauth_code_verifier"], "test-verifier")
            self.assertNotIn("oauth_state", sess)

    def test_oauth_start_uses_configured_redirect_base(self):
        class FakeStorage:
            def get_item(self, _key):
                return "test-verifier"

            def set_item(self, *_args):
                return None

        class FakeAuth:
            def __init__(self):
                self.calls = []
                self._storage_key = "supabase.auth.token"
                self._storage = FakeStorage()

            def sign_in_with_oauth(self, credentials):
                self.calls.append(credentials)
                return SimpleNamespace(url="https://project.supabase.co/auth/v1/authorize?provider=google")

        fake = SimpleNamespace(auth=FakeAuth())

        with patch.object(zapp, "supabase", fake), \
             patch.object(zapp, "create_oauth_supabase_client", return_value=fake), \
             patch.dict(os.environ, {"APP_BASE_URL": "http://127.0.0.1:5055", "OAUTH_REDIRECT_BASE_URL": "http://127.0.0.1:5050"}):
            response = self.client.get("/auth/oauth/google", base_url="http://127.0.0.1:5055")

        self.assertEqual(response.status_code, 302)
        credentials = fake.auth.calls[0]
        self.assertEqual(credentials["options"]["redirect_to"], "http://127.0.0.1:5050/auth/oauth/callback")

    def test_oauth_start_ignores_loopback_redirect_base_on_public_host(self):
        class FakeStorage:
            def get_item(self, _key):
                return "test-verifier"

            def set_item(self, *_args):
                return None

        class FakeAuth:
            def __init__(self):
                self.calls = []
                self._storage_key = "supabase.auth.token"
                self._storage = FakeStorage()

            def sign_in_with_oauth(self, credentials):
                self.calls.append(credentials)
                return SimpleNamespace(url="https://project.supabase.co/auth/v1/authorize?provider=google")

        fake = SimpleNamespace(auth=FakeAuth())

        with patch.object(zapp, "supabase", fake), \
             patch.object(zapp, "create_oauth_supabase_client", return_value=fake), \
             patch.dict(os.environ, {"APP_BASE_URL": "http://127.0.0.1:5055", "OAUTH_REDIRECT_BASE_URL": "http://127.0.0.1:5050"}):
            response = self.client.get("/auth/oauth/google", base_url="https://lvl.example.test")

        self.assertEqual(response.status_code, 302)
        credentials = fake.auth.calls[0]
        self.assertEqual(credentials["options"]["redirect_to"], "https://lvl.example.test/auth/oauth/callback")

    def test_forgot_password_stores_hashed_reset_token_and_emails_link(self):
        class Result:
            def __init__(self, data=None):
                self.data = data or []

        class FakeTable:
            def __init__(self, fake, name):
                self.fake = fake
                self.name = name
                self.mode = None
                self.filters = {}
                self.payload = None

            def select(self, *_args, **_kwargs):
                self.mode = "select"
                return self

            def insert(self, payload):
                self.mode = "insert"
                self.payload = payload
                return self

            def eq(self, key, value):
                self.filters[key] = value
                return self

            def execute(self):
                if self.name == "users" and self.mode == "select":
                    if self.filters.get("username") == "demo" or self.filters.get("email") == "demo@example.com":
                        return Result([{"id": 12, "email": "demo@example.com", "display_name": "Demo User", "username": "demo"}])
                    return Result([])
                if self.name == "password_reset_tokens" and self.mode == "insert":
                    self.fake.reset_payload = self.payload
                    return Result([{"id": 99, **self.payload}])
                return Result([])

        class FakeSupabase:
            def __init__(self):
                self.reset_payload = None

            def table(self, name):
                return FakeTable(self, name)

        sent = {}

        def fake_mail(user, token):
            sent["user"] = user
            sent["token"] = token
            return True

        fake = FakeSupabase()
        with patch.object(zapp, "supabase", fake), patch.object(zapp, "send_password_reset_email", side_effect=fake_mail):
            response = self.client.post("/forgot-password", data={
                "csrf_token": self.csrf(),
                "account": "demo",
            }, follow_redirects=True)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(fake.reset_payload["user_id"], 12)
        self.assertEqual(len(fake.reset_payload["token_hash"]), 64)
        self.assertNotEqual(fake.reset_payload["token_hash"], sent["token"])
        self.assertEqual(sent["user"]["email"], "demo@example.com")
        self.assertIn(b"If that account exists", response.data)

    def test_forgot_password_does_not_reveal_missing_accounts(self):
        class EmptyTable:
            def select(self, *_args, **_kwargs):
                return self

            def eq(self, *_args):
                return self

            def execute(self):
                return SimpleNamespace(data=[])

        fake = SimpleNamespace(table=lambda _name: EmptyTable())

        with patch.object(zapp, "supabase", fake), patch.object(zapp, "send_password_reset_email") as mail:
            response = self.client.post("/forgot-password", data={
                "csrf_token": self.csrf(),
                "account": "missing@example.com",
            }, follow_redirects=True)

        self.assertEqual(response.status_code, 200)
        self.assertIn(b"If that account exists", response.data)
        mail.assert_not_called()

    def test_forgot_password_does_not_email_if_token_storage_fails_in_production(self):
        class Result:
            def __init__(self, data=None):
                self.data = data or []

        class FakeTable:
            def __init__(self, name):
                self.name = name
                self.mode = None
                self.filters = {}

            def select(self, *_args, **_kwargs):
                self.mode = "select"
                return self

            def insert(self, _payload):
                self.mode = "insert"
                return self

            def eq(self, key, value):
                self.filters[key] = value
                return self

            def execute(self):
                if self.name == "users" and self.mode == "select" and self.filters.get("username") == "demo":
                    return Result([{"id": 12, "email": "demo@example.com", "display_name": "Demo User", "username": "demo"}])
                if self.name == "password_reset_tokens" and self.mode == "insert":
                    raise RuntimeError("missing reset-token table")
                return Result([])

        fake = SimpleNamespace(table=lambda name: FakeTable(name))

        with patch.object(zapp, "supabase", fake), \
             patch.object(zapp, "send_password_reset_email") as mail, \
             patch.object(zapp.app.logger, "error") as log_error, \
             patch.dict(os.environ, {"FLASK_ENV": "production"}):
            response = self.client.post("/forgot-password", data={
                "csrf_token": self.csrf(),
                "account": "demo",
            }, follow_redirects=True)

        self.assertEqual(response.status_code, 200)
        self.assertIn(b"If that account exists", response.data)
        mail.assert_not_called()
        log_error.assert_called_once()

    def test_password_reset_email_uses_smtp_env_settings(self):
        class FakeSMTP:
            def __init__(self, host, port):
                self.host = host
                self.port = port
                self.started_tls = False
                self.login_args = None
                self.sent = None
                self.quit_called = False

            def starttls(self):
                self.started_tls = True

            def login(self, username, password):
                self.login_args = (username, password)

            def sendmail(self, sender, recipient, message):
                self.sent = (sender, recipient, message)

            def quit(self):
                self.quit_called = True

        smtp_instances = []

        def fake_smtp(host, port):
            smtp = FakeSMTP(host, port)
            smtp_instances.append(smtp)
            return smtp

        env = {
            "MAIL_USERNAME": "",
            "MAIL_PASSWORD": "",
            "SMTP_HOST": "smtp.example.test",
            "SMTP_PORT": "2525",
            "SMTP_USE_TLS": "1",
            "SMTP_FROM": "noreply@lvl.test",
            "SMTP_USERNAME": "mailer@lvl.test",
            "SMTP_PASSWORD": "smtp-secret",
            "APP_BASE_URL": "https://lvl.example.test",
        }
        with zapp.app.test_request_context("/"), \
             patch.dict(os.environ, env), \
             patch.object(zapp.smtplib, "SMTP", side_effect=fake_smtp):
            sent = zapp.send_password_reset_email(
                {"email": "demo@example.com", "display_name": "Demo User"},
                "reset-token",
            )

        self.assertTrue(sent)
        self.assertEqual(len(smtp_instances), 1)
        smtp = smtp_instances[0]
        self.assertEqual((smtp.host, smtp.port), ("smtp.example.test", 2525))
        self.assertTrue(smtp.started_tls)
        self.assertEqual(smtp.login_args, ("mailer@lvl.test", "smtp-secret"))
        self.assertEqual(smtp.sent[0], "noreply@lvl.test")
        self.assertEqual(smtp.sent[1], "demo@example.com")
        message = message_from_string(smtp.sent[2])
        html = ""
        for part in message.walk():
            if part.get_content_type() == "text/html":
                html += part.get_payload(decode=True).decode(part.get_content_charset() or "utf-8")
        self.assertIn("https://lvl.example.test/reset-password/reset-token", html)
        self.assertTrue(smtp.quit_called)

    def test_reset_password_updates_hash_and_marks_token_used(self):
        raw_token = "reset-token-123"
        token_hash = zapp.password_reset_token_hash(raw_token)
        expires_at = (datetime.now(timezone.utc) + timedelta(minutes=20)).isoformat()

        class Result:
            def __init__(self, data=None):
                self.data = data or []

        class FakeTable:
            def __init__(self, fake, name):
                self.fake = fake
                self.name = name
                self.mode = None
                self.filters = {}
                self.payload = None

            def select(self, *_args, **_kwargs):
                self.mode = "select"
                return self

            def update(self, payload):
                self.mode = "update"
                self.payload = payload
                return self

            def eq(self, key, value):
                self.filters[key] = value
                return self

            def is_(self, key, value):
                self.filters[key] = value
                return self

            def execute(self):
                if self.name == "password_reset_tokens" and self.mode == "select":
                    if self.filters.get("token_hash") == token_hash:
                        return Result([{"id": 5, "user_id": 12, "token_hash": token_hash, "expires_at": expires_at, "used_at": None}])
                    return Result([])
                if self.name == "password_reset_tokens" and self.mode == "update":
                    self.fake.reset_update = self.payload
                    return Result([{"id": 5, **self.payload}])
                if self.name == "users" and self.mode == "update":
                    self.fake.user_update = self.payload
                    return Result([{"id": 12, **self.payload}])
                return Result([])

        class FakeSupabase:
            def __init__(self):
                self.user_update = None
                self.reset_update = None

            def table(self, name):
                return FakeTable(self, name)

        fake = FakeSupabase()
        with patch.object(zapp, "supabase", fake):
            response = self.client.post(f"/reset-password/{raw_token}", data={
                "csrf_token": self.csrf(),
                "password": "newpass123",
                "confirm_password": "newpass123",
            })

        self.assertEqual(response.status_code, 302)
        self.assertTrue(response.location.endswith("/"))
        self.assertTrue(bcrypt.checkpw(b"newpass123", fake.user_update["password_hash"].encode("utf-8")))
        self.assertIsNotNone(fake.reset_update["used_at"])
        with self.client.session_transaction() as sess:
            self.assertEqual(sess["user_id"], 12)
            self.assertFalse(sess.permanent)
            self.assertIn(("success", "Password updated. You are signed in."), sess.get("_flashes", []))

    def test_reset_password_rejects_expired_token(self):
        raw_token = "expired-token"
        zapp.PASSWORD_RESET_TOKENS.clear()
        zapp.PASSWORD_RESET_TOKENS[zapp.password_reset_token_hash(raw_token)] = {
            "user_id": 12,
            "expires_at": datetime.now(timezone.utc) - timedelta(minutes=1),
            "used_at": None,
        }

        with patch.object(zapp, "supabase", None):
            response = self.client.get(f"/reset-password/{raw_token}", follow_redirects=True)

        self.assertEqual(response.status_code, 200)
        self.assertIn(b"That reset link is invalid or expired.", response.data)

    def test_oauth_callback_logs_in_existing_user_by_email(self):
        class FakeStorage:
            def __init__(self):
                self.items = {}

            def set_item(self, key, value):
                self.items[key] = value

            def get_item(self, key):
                return self.items.get(key)

            def remove_item(self, key):
                self.items.pop(key, None)

        class FakeAuth:
            def __init__(self):
                self._storage_key = "supabase.auth.token"
                self._storage = FakeStorage()
                self.exchange_params = None

            def exchange_code_for_session(self, params):
                self.exchange_params = params
                user = SimpleNamespace(
                    id="11111111-1111-1111-1111-111111111111",
                    email="oauth@example.com",
                    user_metadata={
                        "full_name": "OAuth Member",
                        "avatar_url": "https://example.com/avatar.png",
                    },
                    app_metadata={"provider": "google"},
                )
                return SimpleNamespace(user=user, session=SimpleNamespace(user=user))

        class FakeUsersTable:
            def __init__(self, fake):
                self.fake = fake
                self.filters = {}
                self.mode = "select"
                self.payload = None

            def select(self, *_args, **_kwargs):
                self.mode = "select"
                return self

            def update(self, payload):
                self.mode = "update"
                self.payload = payload
                return self

            def eq(self, key, value):
                self.filters[key] = value
                return self

            def execute(self):
                if self.mode == "update":
                    self.fake.updated_payload = self.payload
                    return SimpleNamespace(data=[])
                if self.filters.get("supabase_auth_user_id"):
                    return SimpleNamespace(data=[])
                if self.filters.get("email") == "oauth@example.com":
                    return SimpleNamespace(data=[{"id": 44, "email": "oauth@example.com", "username": "oauthmember"}])
                return SimpleNamespace(data=[])

        class FakeSupabase:
            def __init__(self):
                self.auth = FakeAuth()
                self.updated_payload = None

            def table(self, name):
                self.table_name = name
                return FakeUsersTable(self)

        fake = FakeSupabase()
        with self.client.session_transaction() as sess:
            sess["oauth_state"] = "expected-state"
            sess["oauth_provider"] = "google"
            sess["oauth_code_verifier"] = "stored-verifier"

        with patch.object(zapp, "supabase", fake), \
             patch.object(zapp, "create_oauth_supabase_client", return_value=fake):
            response = self.client.get("/auth/oauth/callback?code=abc123&state=expected-state")

        self.assertEqual(response.status_code, 302)
        self.assertTrue(response.location.endswith("/"))
        self.assertEqual(fake.auth.exchange_params["auth_code"], "abc123")
        self.assertEqual(fake.auth.exchange_params["code_verifier"], "stored-verifier")
        self.assertEqual(fake.auth._storage.items["supabase.auth.token-code-verifier"], "stored-verifier")
        self.assertEqual(fake.updated_payload["oauth_provider"], "google")
        with self.client.session_transaction() as sess:
            self.assertEqual(sess["user_id"], 44)
            self.assertTrue(sess.permanent)
            self.assertNotIn("pending_oauth_profile", sess)

    def test_oauth_callback_uses_isolated_auth_client_for_exchange(self):
        class FakeStorage:
            def __init__(self):
                self.items = {}

            def set_item(self, key, value):
                self.items[key] = value

            def get_item(self, key):
                return self.items.get(key)

        class IsolatedAuth:
            def __init__(self):
                self._storage_key = "supabase.auth.token"
                self._storage = FakeStorage()
                self.exchange_params = None

            def exchange_code_for_session(self, params):
                self.exchange_params = params
                user = SimpleNamespace(
                    id="66666666-6666-6666-6666-666666666666",
                    email="bridge@example.com",
                    user_metadata={"full_name": "Bridge User"},
                    app_metadata={"provider": "google"},
                )
                return SimpleNamespace(user=user, session=SimpleNamespace(user=user))

        class SharedAuth:
            _storage_key = "supabase.auth.token"
            _storage = FakeStorage()

            def exchange_code_for_session(self, _params):
                raise AssertionError("OAuth exchange must not mutate the shared backend client")

        class FakeUsersTable:
            def __init__(self, fake):
                self.fake = fake
                self.filters = {}
                self.mode = "select"
                self.payload = None

            def select(self, *_args, **_kwargs):
                self.mode = "select"
                return self

            def update(self, payload):
                self.mode = "update"
                self.payload = payload
                return self

            def eq(self, key, value):
                self.filters[key] = value
                return self

            def execute(self):
                if self.mode == "update":
                    self.fake.updated_payload = self.payload
                    return SimpleNamespace(data=[])
                if self.filters.get("supabase_auth_user_id") == "66666666-6666-6666-6666-666666666666":
                    return SimpleNamespace(data=[{
                        "id": 66,
                        "email": "bridge@example.com",
                        "username": "bridgeuser",
                    }])
                return SimpleNamespace(data=[])

        class SharedSupabase:
            def __init__(self):
                self.auth = SharedAuth()
                self.updated_payload = None

            def table(self, _name):
                return FakeUsersTable(self)

        shared = SharedSupabase()
        isolated = SimpleNamespace(auth=IsolatedAuth())
        with self.client.session_transaction() as sess:
            sess["oauth_provider"] = "google"
            sess["oauth_code_verifier"] = "stored-verifier"

        with patch.object(zapp, "supabase", shared), \
             patch.object(zapp, "url", "https://project.supabase.co"), \
             patch.object(zapp, "key", "service-role-key"), \
             patch.object(zapp, "create_client", return_value=isolated) as create_client_mock:
            response = self.client.get("/auth/oauth/callback?code=abc123")

        self.assertEqual(response.status_code, 302)
        self.assertTrue(response.location.endswith("/"))
        create_client_mock.assert_called_once_with("https://project.supabase.co", "service-role-key")
        self.assertEqual(isolated.auth.exchange_params["auth_code"], "abc123")
        self.assertEqual(isolated.auth.exchange_params["code_verifier"], "stored-verifier")
        self.assertEqual(shared.updated_payload["supabase_auth_user_id"], "66666666-6666-6666-6666-666666666666")
        with self.client.session_transaction() as sess:
            self.assertEqual(sess["user_id"], 66)
            self.assertTrue(sess.permanent)
            self.assertNotIn("pending_oauth_profile", sess)

    def test_oauth_callback_sends_new_user_to_social_onboarding(self):
        class FakeAuth:
            _storage_key = "supabase.auth.token"

            class Storage:
                def set_item(self, *_args):
                    pass

            _storage = Storage()

            def exchange_code_for_session(self, _params):
                user = SimpleNamespace(
                    id="22222222-2222-2222-2222-222222222222",
                    email="new@example.com",
                    user_metadata={"name": "New OAuth"},
                    app_metadata={"provider": "google"},
                )
                return SimpleNamespace(user=user, session=SimpleNamespace(user=user))

        class FakeUsersTable:
            def select(self, *_args, **_kwargs):
                return self

            def eq(self, *_args):
                return self

            def execute(self):
                return SimpleNamespace(data=[])

        fake = SimpleNamespace(auth=FakeAuth(), table=lambda _name: FakeUsersTable())
        with self.client.session_transaction() as sess:
            sess["oauth_state"] = "expected-state"
            sess["oauth_provider"] = "google"
            sess["oauth_code_verifier"] = "stored-verifier"

        with patch.object(zapp, "supabase", fake), \
             patch.object(zapp, "create_oauth_supabase_client", return_value=fake):
            response = self.client.get("/auth/oauth/callback?code=abc123&state=expected-state")

        self.assertEqual(response.status_code, 302)
        self.assertTrue(response.location.endswith("/auth/oauth/onboarding"))
        with self.client.session_transaction() as sess:
            self.assertEqual(sess["pending_oauth_profile"]["email"], "new@example.com")
            self.assertEqual(sess["pending_oauth_profile"]["provider"], "google")
            self.assertEqual(sess["pending_oauth_profile"]["first_name"], "New")

    def test_oauth_callback_allows_missing_returned_state_when_session_started(self):
        class FakeStorage:
            def __init__(self):
                self.items = {}

            def set_item(self, key, value):
                self.items[key] = value

            def get_item(self, key):
                return self.items.get(key)

        class FakeAuth:
            def __init__(self):
                self._storage_key = "supabase.auth.token"
                self._storage = FakeStorage()

            def exchange_code_for_session(self, params):
                self.exchange_params = params
                user = SimpleNamespace(
                    id="44444444-4444-4444-4444-444444444444",
                    email="nostate@example.com",
                    user_metadata={"full_name": "No State"},
                    app_metadata={"provider": "google"},
                )
                return SimpleNamespace(user=user, session=SimpleNamespace(user=user))

        class FakeUsersTable:
            def select(self, *_args, **_kwargs):
                return self

            def eq(self, *_args):
                return self

            def execute(self):
                return SimpleNamespace(data=[])

        fake = SimpleNamespace(auth=FakeAuth())
        fake.table = lambda _name: FakeUsersTable()
        with self.client.session_transaction() as sess:
            sess["oauth_state"] = "expected-state"
            sess["oauth_provider"] = "google"
            sess["oauth_code_verifier"] = "stored-verifier"

        with patch.object(zapp, "supabase", fake), \
             patch.object(zapp, "create_oauth_supabase_client", return_value=fake):
            response = self.client.get("/auth/oauth/callback?code=abc123")

        self.assertEqual(response.status_code, 302)
        self.assertTrue(response.location.endswith("/auth/oauth/onboarding"))
        with self.client.session_transaction() as sess:
            self.assertNotIn("oauth_state", sess)
            self.assertNotIn("oauth_provider", sess)
            self.assertEqual(sess["pending_oauth_profile"]["email"], "nostate@example.com")

    def test_oauth_callback_allows_missing_session_state_when_code_exchanges(self):
        class FakeAuth:
            def exchange_code_for_session(self, _params):
                user = SimpleNamespace(
                    id="55555555-5555-5555-5555-555555555555",
                    email="cookieless@example.com",
                    user_metadata={"full_name": "Cookie Less"},
                    app_metadata={"provider": "google"},
                )
                return SimpleNamespace(user=user, session=SimpleNamespace(user=user))

        class FakeUsersTable:
            def select(self, *_args, **_kwargs):
                return self

            def eq(self, *_args):
                return self

            def execute(self):
                return SimpleNamespace(data=[])

        fake = SimpleNamespace(auth=FakeAuth(), table=lambda _name: FakeUsersTable())

        with patch.object(zapp, "supabase", fake), \
             patch.object(zapp, "create_oauth_supabase_client", return_value=fake):
            response = self.client.get("/auth/oauth/callback?code=abc123&state=returned-state")

        self.assertEqual(response.status_code, 302)
        self.assertTrue(response.location.endswith("/auth/oauth/onboarding"))
        with self.client.session_transaction() as sess:
            self.assertEqual(sess["pending_oauth_profile"]["email"], "cookieless@example.com")

    def test_oauth_onboarding_creates_lvl_user(self):
        class FakeUsersTable:
            def __init__(self, fake, name):
                self.fake = fake
                self.name = name
                self.payload = None

            def insert(self, payload):
                self.payload = payload
                return self

            def execute(self):
                if self.name == "users":
                    self.fake.inserted_payload = self.payload
                return SimpleNamespace(data=[{"id": 55, **self.payload}])

        class FakeSupabase:
            def __init__(self):
                self.inserted_payload = None

            def table(self, name):
                self.table_name = name
                return FakeUsersTable(self, name)

        fake = FakeSupabase()
        with self.client.session_transaction() as sess:
            sess["pending_oauth_profile"] = {
                "provider": "google",
                "subject": "33333333-3333-3333-3333-333333333333",
                "email": "join@example.com",
                "first_name": "Join",
                "last_name": "Member",
                "display_name": "Join Member",
                "avatar_url": "",
            }
        csrf_token = self.csrf()

        with patch.object(zapp, "supabase", fake):
            response = self.client.post("/auth/oauth/onboarding", data={
                "csrf_token": csrf_token,
                "first_name": "Join",
                "last_name": "Member",
                "nickname": "joinmember",
                "email": "join@example.com",
                "birthday": "2000-01-01",
                "gender": "Male",
            })

        self.assertEqual(response.status_code, 302)
        self.assertTrue(response.location.endswith("/"))
        self.assertEqual(fake.inserted_payload["oauth_provider"], "google")
        self.assertEqual(fake.inserted_payload["supabase_auth_user_id"], "33333333-3333-3333-3333-333333333333")
        self.assertEqual(fake.inserted_payload["username"], "joinmember")
        with self.client.session_transaction() as sess:
            self.assertEqual(sess["user_id"], 55)
            self.assertTrue(sess.permanent)
            self.assertNotIn("pending_oauth_profile", sess)

    def test_shared_post_card_has_menu_actions(self):
        with zapp.app.test_request_context("/"):
            html = zapp.render_template("_post_card.html", viewer={"id": 7}, post={
                "id": 42,
                "user_id": 8,
                "content": "hello",
                "reply_count": 0,
                "repost_count": 0,
                "like_count": 0,
                "viewer_reposted": False,
                "viewer_liked": False,
                "user": {
                    "id": 8,
                    "username": "demo",
                    "display_name": "Demo User",
                    "profile_photo_url": "",
                },
            })
        self.assertIn("Copy link", html)
        self.assertIn("Report post", html)
        self.assertIn('data-i18n="post_mute_user"', html)
        self.assertIn("@demo", html)
        self.assertIn('data-i18n="post_block_user"', html)

    def test_own_post_card_has_delete_action(self):
        with zapp.app.test_request_context("/"):
            html = zapp.render_template("_post_card.html", viewer={"id": 7}, post={
                "id": 42,
                "user_id": 7,
                "content": "hello",
                "reply_count": 0,
                "repost_count": 0,
                "like_count": 0,
                "viewer_reposted": False,
                "viewer_liked": False,
                "user": {
                    "id": 7,
                    "username": "demo",
                    "display_name": "Demo User",
                    "profile_photo_url": "",
                },
            })
        self.assertIn("Delete post", html)
        self.assertNotIn("Report post", html)

    def test_single_post_uses_menu_for_report_action(self):
        with zapp.app.test_request_context("/post/42"):
            html = zapp.render_template("post.html", viewer={"id": 7}, post={
                "id": 42,
                "user_id": 8,
                "content": "hello",
                "created_at": "2026-06-06T00:00:00+00:00",
                "user": {
                    "id": 8,
                    "username": "demo",
                    "display_name": "Demo User",
                    "profile_photo_url": "",
                },
            }, comments=[])

        self.assertIn('class="post-menu-wrap"', html)
        self.assertIn('data-post-menu-toggle', html)
        self.assertIn('class="post-menu"', html)
        self.assertIn("Report post", html)
        self.assertIn("Mute @demo", html)
        self.assertIn("Block @demo", html)
        self.assertNotIn('class="inline-report-form"', html)

    def test_new_routes_are_registered(self):
        routes = {rule.rule for rule in zapp.app.url_map.iter_rules()}

        self.assertIn("/profile/<username>/<list_type>", routes)
        self.assertIn("/admin/users/level", routes)
        self.assertIn("/setup-health", routes)
        self.assertIn("/level-guide", routes)
        self.assertIn("/reels", routes)
        self.assertIn("/auth/oauth/<provider>", routes)
        self.assertIn("/auth/oauth/callback", routes)
        self.assertIn("/auth/oauth/onboarding", routes)
        self.assertIn("/forgot-password", routes)
        self.assertIn("/reset-password/<token>", routes)
        self.assertIn("/reels/upload", routes)
        self.assertIn("/reels/<int:reel_id>/like", routes)
        self.assertIn("/delete_post", routes)
        self.assertIn("/delete_message", routes)
        self.assertIn("/delete_account", routes)
        self.assertIn("/profile", routes)
        self.assertIn("/activity", routes)

    def test_timeline_dedupe_keeps_newest_post_instance(self):
        posts = [
            {"id": 1, "timeline_created_at": "2026-06-05T12:00:00", "is_repost": True},
            {"id": 1, "timeline_created_at": "2026-06-05T11:00:00", "is_repost": False},
            {"id": 2, "timeline_created_at": "2026-06-05T10:00:00", "is_repost": False},
        ]

        deduped = zapp.dedupe_timeline_posts(posts)

        self.assertEqual([post["id"] for post in deduped], [1, 2])
        self.assertTrue(deduped[0]["is_repost"])

    def sample_reel(self, reel_id=1, user_id=7):
        return {
            "id": reel_id,
            "user_id": user_id,
            "video_url": "https://example.com/reel.mp4",
            "caption": "hello reel",
            "visibility": "public",
            "allow_comments": True,
            "allow_downloads": False,
            "autoplay_next": True,
            "view_count": 0,
            "author": {
                "id": user_id,
                "username": "demo",
                "display_name": "Demo User",
                "profile_photo_url": "",
            },
            "user": {
                "id": user_id,
                "username": "demo",
                "display_name": "Demo User",
                "profile_photo_url": "",
            },
            "community": None,
            "like_count": 0,
            "comment_count": 0,
            "viewer_liked": False,
            "is_owner": True,
            "is_demo": False,
        }

    def test_demo_reels_provide_scrollable_local_batch(self):
        with zapp.app.test_request_context("/"), \
             patch.object(zapp, "get_reels", side_effect=RuntimeError("offline")):
            reels = zapp.get_home_reel_preview(7)

        self.assertEqual(len(reels), zapp.HOME_REEL_PREVIEW_LIMIT)
        self.assertEqual(reels[-1]["id"], f"demo-{zapp.HOME_REEL_PREVIEW_LIMIT}")

    def test_home_reel_panel_uses_scrollable_reel_batch(self):
        viewer = {"id": 7, "username": "demo", "display_name": "Demo User", "profile_photo_url": ""}
        reels = [self.sample_reel(reel_id=i, user_id=7) for i in range(1, 4)]

        with patch.object(zapp, "get_current_user", return_value=viewer), \
             patch.object(zapp, "get_feed_posts", return_value=[]), \
             patch.object(zapp, "get_community_highlights", return_value=[]), \
             patch.object(zapp, "get_reels", return_value=(reels, False)) as get_reels:
            html = self.client.get("/").data.decode()

        get_reels.assert_called_once_with(7, limit=50, page=1)
        self.assertIn('data-i18n="leaderboard_title"', html)
        self.assertNotIn("<h2>Community Highlights</h2>", html)
        self.assertIn('data-home-reel-slides tabindex="0"', html)
        self.assertIn('aria-label="Home reels"', html)
        self.assertNotIn('data-home-reel-nav', html)
        self.assertNotIn('data-home-reel-counter', html)

    def test_home_media_preview_falls_back_to_demo_batch(self):
        with zapp.app.test_request_context("/reels"), \
             patch.object(zapp, "supabase", object()):
            media = zapp.get_home_media_preview(7)

        self.assertEqual(len(media), zapp.HOME_MEDIA_PREVIEW_LIMIT)
        self.assertEqual(media[-1]["id"], f"demo-media-{zapp.HOME_MEDIA_PREVIEW_LIMIT}")

    def test_level_achievements_report_public_progress(self):
        profile = {"level": 5, "total_xp": 720}
        stats = {"posts": 1, "comments": 4, "followers": 2, "friends": 1}

        achievements = zapp.profile_achievements(profile, stats)

        first_post = next(item for item in achievements if item["id"] == "first_post")
        conversation = next(item for item in achievements if item["id"] == "conversation_starter")
        rising = next(item for item in achievements if item["id"] == "rising_member")

        self.assertTrue(first_post["unlocked"])
        self.assertEqual(first_post["progress_label"], "1 / 1")
        self.assertFalse(conversation["unlocked"])
        self.assertEqual(conversation["progress_label"], "4 / 10")
        self.assertTrue(rising["unlocked"])

    def test_forced_sin_account_level_override(self):
        user = {
            "id": 9,
            "username": "sin",
            "nickname": "sin",
            "display_name": "sin sin",
            "level": 2,
            "total_xp": 74,
        }

        zapp.apply_forced_user_levels(user)

        self.assertEqual(user["level"], 50)
        self.assertGreaterEqual(user["total_xp"], zapp.xp_required_for_level(50))
        self.assertEqual(user["activity_title"], "Icon Legend")

    def test_reel_author_renders_forced_level_badge(self):
        reel = self.sample_reel(user_id=9)
        reel["author"].update({
            "username": "sin",
            "nickname": "sin",
            "display_name": "sin sin",
            "level": 2,
            "total_xp": 74,
        })
        reel["user"] = reel["author"]
        zapp.apply_forced_user_levels(reel)

        with zapp.app.test_request_context("/reels"):
            html = zapp.render_template("_reel_card.html", viewer={"id": 7, "display_name": "Viewer", "username": "viewer"}, reel=reel)

        self.assertIn("reel-level-badge", html)
        self.assertIn("LvL 50", html)

    def test_admin_level_update_requires_token_and_updates_user_level(self):
        class Result:
            def __init__(self, data=None):
                self.data = data or []

        class FakeTable:
            def __init__(self, db, name):
                self.db = db
                self.name = name
                self.action = None
                self.values = None
                self.filters = []

            def select(self, *_args, **_kwargs):
                self.action = "select"
                return self

            def update(self, values):
                self.action = "update"
                self.values = values
                self.db.updated = values
                return self

            def eq(self, key, value):
                self.filters.append((key, value))
                return self

            def execute(self):
                self.db.calls.append((self.name, self.action, self.values, tuple(self.filters)))
                if self.name == "users" and self.action == "select":
                    return Result([{
                        "id": 9,
                        "username": "sin",
                        "display_name": "sin sin",
                        "level": 2,
                        "total_xp": 74,
                    }])
                return Result([{"id": 9, **(self.values or {})}])

        class FakeSupabase:
            def __init__(self):
                self.calls = []
                self.updated = None

            def table(self, name):
                return FakeTable(self, name)

        fake = FakeSupabase()
        with self.client.session_transaction() as sess:
            sess["csrf_token"] = "token"
        with patch.dict(os.environ, {"LVL_ADMIN_TOKEN": "secret"}), \
             patch.object(zapp, "get_current_user", return_value={"id": 7, "username": "admin"}), \
             patch.object(zapp, "supabase", fake):
            response = self.client.post("/admin/users/level", data={
                "csrf_token": "token",
                "admin_token": "secret",
                "username": "sin",
                "level": "50",
            })

        payload = response.get_json()
        self.assertTrue(payload["success"])
        self.assertEqual(fake.updated["level"], 50)
        self.assertEqual(fake.updated["total_xp"], zapp.xp_required_for_level(50))
        self.assertEqual(fake.updated["activity_title"], "Icon Legend")
        self.assertEqual(fake.updated["badge_color"], zapp.badge_color_for_level(50))

        with self.client.session_transaction() as sess:
            sess["csrf_token"] = "token"
        with patch.dict(os.environ, {"LVL_ADMIN_TOKEN": "secret"}), \
             patch.object(zapp, "get_current_user", return_value={"id": 7, "username": "admin"}), \
             patch.object(zapp, "supabase", fake):
            denied = self.client.post("/admin/users/level", data={
                "csrf_token": "token",
                "admin_token": "wrong",
                "username": "sin",
                "level": "50",
            })

        self.assertEqual(denied.status_code, 403)

    def test_admin_helpers_validate_ids_and_sanitize_search_terms(self):
        self.assertEqual(zapp.parse_positive_id("42"), 42)
        self.assertIsNone(zapp.parse_positive_id("0"))
        self.assertIsNone(zapp.parse_positive_id("-5"))
        self.assertIsNone(zapp.parse_positive_id("1,posts.delete"))
        self.assertEqual(
            zapp.parse_uuid_id("AAAAAAAA-AAAA-AAAA-AAAA-AAAAAAAAAAAA"),
            "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
        )
        self.assertIsNone(zapp.parse_uuid_id("position-1"))
        self.assertIsNone(zapp.parse_uuid_id("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa,posts.delete"))

        term = zapp.admin_search_term("sina%),email.ilike.%%; drop")
        self.assertEqual(term, "sina email.ilike. drop")
        self.assertNotIn("%", term)
        self.assertNotIn(",", term)
        self.assertNotIn(")", term)
        self.assertLessEqual(len(zapp.admin_search_term("a" * 200)), 80)

    def test_admin_dashboard_requires_valid_admin_session_for_actions(self):
        class FakeSupabase:
            def __init__(self):
                self.calls = []

            def table(self, name):
                self.calls.append(("table", name))
                return self

        fake = FakeSupabase()
        with self.client.session_transaction() as sess:
            sess["csrf_token"] = "token"

        with patch.object(zapp, "get_current_user", return_value={"id": 7, "username": "admin"}), \
             patch.object(zapp, "supabase", fake):
            response = self.client.post("/admin-dashboard", data={
                "csrf_token": "token",
                "action": "delete_post_global",
                "id": "42",
            })

        self.assertEqual(response.status_code, 302)
        self.assertTrue(response.headers["Location"].endswith("/admin-dashboard"))
        self.assertEqual(fake.calls, [])

    def test_admin_dashboard_rejects_invalid_actions_without_mutation(self):
        class FakeSupabase:
            def __init__(self):
                self.calls = []

            def table(self, name):
                self.calls.append(("table", name))
                return self

        fake = FakeSupabase()
        with self.client.session_transaction() as sess:
            sess["csrf_token"] = "token"
            sess["admin_token"] = "secret"

        viewer = {"id": 7, "username": "admin"}
        with patch.dict(os.environ, {"LVL_ADMIN_TOKEN": "secret"}), \
             patch.object(zapp, "get_current_user", return_value=viewer), \
             patch.object(zapp, "supabase", fake), \
             patch.object(zapp, "log_admin_action") as audit:
            invalid_suggestion = self.client.post("/admin-dashboard", data={
                "csrf_token": "token",
                "action": "update_suggestion_status",
                "id": "12",
                "status": "DeleteEverything",
            })
            invalid_verification = self.client.post("/admin-dashboard", data={
                "csrf_token": "token",
                "action": "respond_verification",
                "id": "3",
                "status": "Pending",
            })
            invalid_position = self.client.post("/admin-dashboard", data={
                "csrf_token": "token",
                "action": "delete_position",
                "id": "position-1",
            })
            invalid_id = self.client.post("/admin-dashboard", data={
                "csrf_token": "token",
                "action": "dismiss_report",
                "id": "1,posts.delete",
            })
            self_delete = self.client.post("/admin-dashboard", data={
                "csrf_token": "token",
                "action": "delete_user_global",
                "id": "7",
            })
            self_warn = self.client.post("/admin-dashboard", data={
                "csrf_token": "token",
                "action": "warn_user",
                "id": "7",
                "warning_text": "Stop testing yourself.",
            })

        for response in (invalid_suggestion, invalid_verification, invalid_position, invalid_id, self_delete, self_warn):
            self.assertEqual(response.status_code, 302)
            self.assertTrue(response.headers["Location"].endswith("/admin-dashboard"))
        self.assertEqual(fake.calls, [])
        audit.assert_not_called()

    def test_admin_dashboard_validates_and_applies_admin_actions(self):
        suggestion_id = "11111111-1111-1111-1111-111111111111"
        verification_id = "22222222-2222-2222-2222-222222222222"
        position_id = "33333333-3333-3333-3333-333333333333"

        class Result:
            def __init__(self, data=None):
                self.data = data or []

        class FakeTable:
            def __init__(self, db, name):
                self.db = db
                self.name = name
                self.action = None
                self.values = None
                self.filters = []

            def select(self, *_args, **_kwargs):
                self.action = "select"
                return self

            def update(self, values):
                self.action = "update"
                self.values = values
                return self

            def eq(self, key, value):
                self.filters.append((key, value))
                return self

            def limit(self, *_args, **_kwargs):
                return self

            def execute(self):
                self.db.calls.append((self.name, self.action, self.values, tuple(self.filters)))
                if self.name == "verification_requests" and self.action == "select":
                    return Result([{"id": verification_id, "user_id": 9, "status": "Pending"}])
                if self.name == "job_positions" and self.action == "select":
                    return Result([{"id": position_id, "is_active": True}])
                return Result([self.values or {}])

        class FakeSupabase:
            def __init__(self):
                self.calls = []

            def table(self, name):
                return FakeTable(self, name)

        fake = FakeSupabase()
        with self.client.session_transaction() as sess:
            sess["csrf_token"] = "token"
            sess["admin_token"] = "secret"

        viewer = {"id": 7, "username": "admin"}
        with patch.dict(os.environ, {"LVL_ADMIN_TOKEN": "secret"}), \
             patch.object(zapp, "get_current_user", return_value=viewer), \
             patch.object(zapp, "supabase", fake), \
             patch.object(zapp, "log_admin_action") as audit:
            suggestion = self.client.post("/admin-dashboard", data={
                "csrf_token": "token",
                "action": "update_suggestion_status",
                "id": suggestion_id,
                "status": "Reviewed",
            })
            verification = self.client.post("/admin-dashboard", data={
                "csrf_token": "token",
                "action": "respond_verification",
                "id": verification_id,
                "status": "Approved",
                "admin_notes": "Looks good.",
            })
            position = self.client.post("/admin-dashboard", data={
                "csrf_token": "token",
                "action": "toggle_position",
                "id": position_id,
            })

        self.assertEqual(suggestion.status_code, 302)
        self.assertEqual(verification.status_code, 302)
        self.assertEqual(position.status_code, 302)
        self.assertIn(("contact_messages", "update", {"status": "Reviewed"}, (("id", suggestion_id),)), fake.calls)
        self.assertIn(("users", "update", {"is_profile_verified": True}, (("id", 9),)), fake.calls)
        self.assertIn(("job_positions", "update", {"is_active": False}, (("id", position_id),)), fake.calls)

        verification_update = next(
            call for call in fake.calls
            if call[0] == "verification_requests" and call[1] == "update"
        )
        self.assertEqual(verification_update[2]["status"], "Approved")
        self.assertEqual(verification_update[2]["admin_notes"], "Looks good.")
        self.assertIsNone(verification_update[2]["rejection_cooldown_until"])
        self.assertIsNotNone(datetime.fromisoformat(verification_update[2]["updated_at"]).tzinfo)
        self.assertEqual(verification_update[3], (("id", verification_id),))
        audit.assert_any_call("admin", "update_suggestion_status", suggestion_id, "Reviewed")
        audit.assert_any_call("admin", "respond_verification", verification_id, "status=Approved")
        audit.assert_any_call("admin", "toggle_position", position_id, "new_status=False")

    def test_level_guide_page_explains_xp_and_rewards(self):
        fake_user = {
            "id": 7,
            "username": "demo",
            "display_name": "Demo User",
            "profile_photo_url": "",
        }

        with patch.object(zapp, "supabase", object()), \
             patch.object(zapp, "get_current_user", return_value=fake_user), \
             patch.object(zapp, "get_community_highlights", return_value=[]):
            html = self.client.get("/level-guide").data.decode()

        self.assertIn("LvL Guide", html)
        self.assertIn("+10 XP", html)
        self.assertIn("Reward Roadmap", html)
        self.assertIn("Profile Color", html)
        self.assertIn("App Icon Recolor", html)
        self.assertIn("Achievements are display badges", html)

    def test_community_template_renders_three_timeline_tabs(self):
        viewer = {"id": 7, "username": "viewer", "display_name": "Viewer", "profile_photo_url": ""}
        timeline_feeds = {
            "followers": [self.sample_post(1, 8, "follower", "Follower post")],
            "following": [self.sample_post(2, 9, "following", "Following post")],
            "community": [dict(self.sample_post(3, 10, "groupuser", "Community thread"), community={
                "id": 5,
                "name": "Level Talk",
                "slug": "level-talk",
                "accent_color": "#1D9BF0",
            }, community_id=5)],
        }
        with zapp.app.test_request_context("/community?tab=following"):
            html = zapp.render_template(
                "community.html",
                viewer=viewer,
                metrics={"users": 4, "posts": 3, "communities": 1, "likes": 0, "follows": 0},
                recent_members=[],
                popular_users=[],
                trending_posts=[],
                communities=[{"name": "Level Talk", "slug": "level-talk", "description": "XP threads", "accent_color": "#1D9BF0"}],
                activity_items=[],
                community_tabs=zapp.COMMUNITY_TIMELINE_TABS,
                active_tab="following",
                timeline_feeds=timeline_feeds,
                timeline_counts={key: len(value) for key, value in timeline_feeds.items()},
                highlights=[],
            )

        self.assertIn('data-community-hub', html)
        self.assertIn('data-active-tab="following"', html)
        self.assertIn("Followers", html)
        self.assertIn("Following", html)
        self.assertIn("Community", html)
        self.assertIn("Follower post", html)
        self.assertIn("Following post", html)
        self.assertIn("Community thread", html)
        self.assertIn('class="community-lens-strip"', html)
        self.assertIn("History", html)
        self.assertIn("Trends", html)
        self.assertIn("News", html)
        self.assertIn('data-community-pane="followers"', html)
        self.assertIn('aria-current="page"', html)
        self.assertRegex(html, r'data-community-pane="followers"[\s\S]+?hidden')
        self.assertNotIn("Community video feed", html)

        with zapp.app.test_request_context("/community?tab=following"):
            empty_html = zapp.render_template(
                "community.html",
                viewer=viewer,
                metrics={"users": 4, "posts": 0, "communities": 1, "likes": 0, "follows": 0},
                recent_members=[],
                popular_users=[],
                trending_posts=[],
                communities=[],
                activity_items=[],
                community_tabs=zapp.COMMUNITY_TIMELINE_TABS,
                active_tab="following",
                timeline_feeds={"followers": [], "following": [], "community": []},
                timeline_counts={"followers": 0, "following": 0, "community": 0},
                highlights=[],
            )

        self.assertIn("What this timeline means", empty_html)
        self.assertIn("This is the middle timeline", empty_html)

    def test_community_route_defaults_to_following_timeline(self):
        viewer = {"id": 7, "username": "viewer", "display_name": "Viewer", "profile_photo_url": ""}
        explore = {
            "metrics": {"users": 0, "posts": 0, "communities": 0, "likes": 0, "follows": 0},
            "recent_members": [],
            "popular_users": [],
            "trending_posts": [],
            "communities": [],
            "activity_items": [],
        }
        timeline = {
            "tabs": zapp.COMMUNITY_TIMELINE_TABS,
            "active_tab": "following",
            "feeds": {"followers": [], "following": [], "community": []},
            "counts": {"followers": 0, "following": 0, "community": 0},
        }

        with patch.object(zapp, "get_current_user", return_value=viewer), \
             patch.object(zapp, "get_explore_context", return_value=explore), \
             patch.object(zapp, "get_community_timeline_context", return_value=timeline) as timeline_context, \
             patch.object(zapp, "get_community_highlights", return_value=[]), \
             patch.object(zapp, "get_home_reel_preview", return_value=[self.sample_reel()]) as home_reels:
            html = self.client.get("/community").data.decode()

        timeline_context.assert_called_once_with(viewer, None)
        home_reels.assert_called_once_with(7)
        self.assertIn('data-active-tab="following"', html)
        self.assertIn("Follow people to fill this timeline", html)
        self.assertIn('data-home-reel-panel', html)
        self.assertIn('aria-label="Home reels"', html)

    def test_community_timeline_context_uses_three_feed_builders(self):
        viewer = {"id": 7}
        with patch.object(zapp, "get_followers_feed_posts", return_value=[self.sample_post(1)]), \
             patch.object(zapp, "get_following_feed_posts", return_value=[self.sample_post(2)]), \
             patch.object(zapp, "get_community_timeline_posts", return_value=[]):
            context = zapp.get_community_timeline_context(viewer, "followers", limit=5)

        self.assertEqual(context["active_tab"], "followers")
        self.assertEqual(context["counts"]["followers"], 1)
        self.assertEqual(context["counts"]["following"], 1)
        self.assertEqual(context["counts"]["community"], 0)

    def test_static_asset_version_is_consistent(self):
        styles = Path("static/css/styles.css").read_text(encoding="utf-8")
        service_worker = Path("static/service-worker.js").read_text(encoding="utf-8")
        expected_query = f"?v={zapp.ASSET_VERSION}"

        for line in styles.splitlines():
            if line.startswith("@import"):
                self.assertIn(expected_query, line)

        self.assertIn(f"const ASSET_VERSION = '{zapp.ASSET_VERSION}';", service_worker)
        self.assertIn("sections/activity.css", styles)

    def test_mobile_settings_actions_stay_in_document_flow(self):
        settings_css = Path("static/css/sections/settings.css").read_text(encoding="utf-8")
        mobile_settings_css = settings_css.split("@media (max-width: 991px)", 1)[1]
        actions_rule = mobile_settings_css.split(".form-actions", 1)[1].split("}", 1)[0]

        self.assertIn("position: static", actions_rule)
        self.assertIn("margin: 0", actions_rule)
        self.assertNotIn("position: sticky", actions_rule)
        self.assertNotIn("margin-inline: -", actions_rule)

    def test_settings_profile_color_control_labels_visible_effect(self):
        settings_html = Path("templates/settings.html").read_text(encoding="utf-8")
        settings_css = Path("static/css/sections/settings.css").read_text(encoding="utf-8")

        self.assertIn("Profile banner color", settings_html)
        self.assertIn("Changes the banner on your profile", settings_html)
        self.assertIn("--profile-preview-color", settings_css)
        self.assertNotIn("--lvl-white-10", settings_css)

    def test_mobile_settings_profile_preview_avatar_clears_text(self):
        settings_css = Path("static/css/sections/settings.css").read_text(encoding="utf-8")
        mobile_settings_css = settings_css.split("@media (max-width: 991px)", 1)[1]
        preview_rule = mobile_settings_css.split(".settings-container .profile-preview-card", 1)[1].split("}", 1)[0]
        name_rule = mobile_settings_css.split(".settings-container .profile-preview-card strong", 1)[1].split("}", 1)[0]

        self.assertIn("padding: 146px 14px 14px", preview_rule)
        self.assertIn("min-height: 270px", preview_rule)
        self.assertIn("margin-top: 0", name_rule)

    def test_reels_script_keeps_sound_preference_for_session(self):
        script = Path("static/js/script.js").read_text(encoding="utf-8")

        self.assertIn("lvlReelsSoundOn", script)
        self.assertIn("sessionStorage.setItem", script)
        self.assertIn("applySoundPreferenceToAll", script)

    def test_reels_autoplay_waits_two_loops_and_pauses_for_comments(self):
        script = Path("static/js/script.js").read_text(encoding="utf-8")

        self.assertIn("const commentsAreOpen = () => document.body.classList.contains('reel-comments-open')", script)
        self.assertIn("autoplay_next_reels", script)
        self.assertIn("if (!commentsAreOpen()) activateCard(nextCard)", script)

    def test_auth_page_includes_pwa_install_prompt(self):
        auth_html = self.client.get("/auth").data.decode()

        self.assertIn('data-install-prompt', auth_html)
        self.assertIn('data-install-action', auth_html)
        self.assertIn('data-install-manual', auth_html)
        self.assertIn('Install LvL', auth_html)
        self.assertIn('Add to Home Screen', auth_html)

    def test_reels_redirects_unauthenticated_users(self):
        with patch.object(zapp, "get_current_user", return_value=None):
            response = self.client.get("/reels")

        self.assertEqual(response.status_code, 302)
        self.assertIn("/auth", response.location)

    def test_reels_renders_authenticated_page(self):
        viewer = {"id": 7, "username": "demo", "display_name": "Demo User", "profile_photo_url": ""}
        media_post = dict(self.sample_post(post_id=44), image_url="/static/assets/icon-512.png")
        with patch.object(zapp, "get_current_user", return_value=viewer), \
             patch.object(zapp, "get_reels", return_value=([self.sample_reel()], False)), \
             patch.object(zapp, "get_community_highlights", return_value=[]), \
             patch.object(zapp, "get_home_media_preview", return_value=[media_post]) as media_preview:
            html = self.client.get("/reels").data.decode()

        media_preview.assert_called_once_with(7)
        self.assertIn("Clips", html)
        self.assertIn('data-reels-feed', html)
        self.assertIn('data-home-media-panel', html)
        self.assertIn('aria-label="Non-reel media"', html)
        self.assertNotIn('data-home-reel-panel', html)
        self.assertIn('mobile-reels-upload-cta', html)
        self.assertIn('mobile-reel-upload-action', html)
        self.assertIn("hello reel", html)
        self.assertNotIn('aria-label="Reels pagination"', html)

    def test_reels_empty_real_feed_does_not_use_demo_when_table_ready(self):
        viewer = {"id": 7, "username": "demo", "display_name": "Demo User", "profile_photo_url": ""}
        with patch.object(zapp, "get_current_user", return_value=viewer), \
             patch.object(zapp, "get_reels", return_value=([], False)), \
             patch.object(zapp, "get_community_highlights", return_value=[]), \
             patch.object(zapp, "get_home_media_preview", return_value=[]):
            html = self.client.get("/reels").data.decode()

        self.assertIn("No real clips yet", html)
        self.assertNotIn("Demo reel", html)

    def test_reels_uses_demo_fallback_only_when_table_unavailable(self):
        viewer = {"id": 7, "username": "demo", "display_name": "Demo User", "profile_photo_url": ""}
        with patch.object(zapp, "get_current_user", return_value=viewer), \
             patch.object(zapp, "get_reels", side_effect=RuntimeError("reels relation does not exist")), \
             patch.object(zapp, "get_community_highlights", return_value=[]), \
             patch.object(zapp, "get_home_media_preview", return_value=[]):
            html = self.client.get("/reels").data.decode()

        self.assertIn("Demo reel", html)
        self.assertIn("Reels database table is not ready", html)

    def test_reel_upload_renders_for_authenticated_user(self):
        viewer = {"id": 7, "username": "demo", "display_name": "Demo User", "profile_photo_url": ""}
        with patch.object(zapp, "get_current_user", return_value=viewer), \
             patch.object(zapp, "get_reel_upload_communities", return_value=[]):
            html = self.client.get("/reels/upload").data.decode()

        self.assertIn("Upload Clip", html)
        self.assertIn('enctype="multipart/form-data"', html)
        self.assertIn('accept="video/mp4,video/webm,video/quicktime,video/x-m4v"', html)

    def test_reel_upload_rejects_missing_video(self):
        viewer = {"id": 7, "username": "demo", "display_name": "Demo User", "profile_photo_url": ""}
        with patch.object(zapp, "get_current_user", return_value=viewer), \
             patch.object(zapp, "get_reel_upload_communities", return_value=[]):
            response = self.client.post("/reels/upload", data={
                "csrf_token": self.csrf(),
                "caption": "no file",
                "visibility": "public",
                "allow_comments": "on",
                "autoplay_next": "on",
            }, follow_redirects=True)

        self.assertIn(b"Choose a video to upload.", response.data)

    def test_reel_upload_rejects_unsupported_extension(self):
        viewer = {"id": 7, "username": "demo", "display_name": "Demo User", "profile_photo_url": ""}
        with patch.object(zapp, "get_current_user", return_value=viewer), \
             patch.object(zapp, "get_reel_upload_communities", return_value=[]):
            response = self.client.post("/reels/upload", data={
                "csrf_token": self.csrf(),
                "caption": "bad file",
                "visibility": "public",
                "video": (io.BytesIO(b"not-video"), "clip.txt"),
            }, content_type="multipart/form-data", follow_redirects=True)

        self.assertIn(b"Videos must be MP4, WebM, MOV, or M4V.", response.data)

    def test_reel_upload_inserts_when_video_upload_is_mocked(self):
        class Result:
            def __init__(self, data=None):
                self.data = data or []

        class FakeTable:
            def __init__(self):
                self.inserted = None

            def insert(self, payload):
                self.inserted = payload
                return self

            def execute(self):
                return Result([{"id": 123}])

        class FakeSupabase:
            def __init__(self):
                self.reels = FakeTable()

            def table(self, name):
                return self.reels

        fake = FakeSupabase()
        viewer = {"id": 7, "username": "demo", "display_name": "Demo User", "profile_photo_url": ""}
        with patch.object(zapp, "get_current_user", return_value=viewer), \
             patch.object(zapp, "get_reel_upload_communities", return_value=[]), \
             patch.object(zapp, "upload_video_to_storage", return_value=("https://cdn.example.com/reel.mp4", "reels/7/reel.mp4")), \
             patch.object(zapp, "award_xp") as award_xp, \
             patch.object(zapp, "supabase", fake):
            response = self.client.post("/reels/upload", data={
                "csrf_token": self.csrf(),
                "caption": "mock upload",
                "visibility": "public",
                "allow_comments": "on",
                "autoplay_next": "on",
                "video": (io.BytesIO(b"video-bytes"), "clip.mp4"),
            }, content_type="multipart/form-data")

        self.assertEqual(response.status_code, 302)
        self.assertEqual(fake.reels.inserted["video_url"], "https://cdn.example.com/reel.mp4")
        self.assertEqual(fake.reels.inserted["storage_path"], "reels/7/reel.mp4")
        award_xp.assert_called_once_with(7, "reel_created", 15, 123)

    def test_reel_like_endpoint_toggles_like_json(self):
        class Result:
            def __init__(self, data=None, count=0):
                self.data = data or []
                self.count = count

        class FakeTable:
            def __init__(self, db, name):
                self.db = db
                self.name = name
                self.action = None
                self.filters = []

            def select(self, *_args, **_kwargs):
                self.action = "select"
                return self

            def insert(self, payload):
                self.action = "insert"
                self.db.inserted = payload
                return self

            def delete(self):
                self.action = "delete"
                return self

            def eq(self, key, value):
                self.filters.append((key, value))
                return self

            def execute(self):
                self.db.calls.append((self.name, self.action, tuple(self.filters)))
                if self.action == "select" and self.filters == [("reel_id", 1), ("user_id", 7)]:
                    return Result([])
                if self.action == "select" and self.filters == [("reel_id", 1)]:
                    return Result([], count=1)
                return Result([])

        class FakeSupabase:
            def __init__(self):
                self.calls = []
                self.inserted = None

            def table(self, name):
                return FakeTable(self, name)

        fake = FakeSupabase()
        with self.client.session_transaction() as sess:
            sess["csrf_token"] = "token"
        with patch.object(zapp, "get_current_user", return_value={"id": 7, "username": "demo"}), \
             patch.object(zapp, "get_reel_by_id", return_value=self.sample_reel()), \
             patch.object(zapp, "supabase", fake):
            response = self.client.post("/reels/1/like", data={"csrf_token": "token", "ajax": "1"})

        payload = response.get_json()
        self.assertTrue(payload["success"])
        self.assertTrue(payload["liked"])
        self.assertEqual(payload["count"], 1)
        self.assertEqual(fake.inserted, {"reel_id": 1, "user_id": 7})

    def test_layout_contains_reels_navigation(self):
        viewer = {"id": 7, "username": "demo", "display_name": "Demo User", "profile_photo_url": ""}
        with zapp.app.test_request_context("/"):
            html = zapp.render_template("index.html", viewer=viewer, posts=[], mode="all", highlights=[], page=1, has_next=False)

        self.assertIn('/reels', html)
        self.assertIn('Clips', html)
        self.assertIn('<aside class="left-rail menu-open">', html)
        self.assertNotIn('id="sidebar-toggle"', html)
        self.assertNotIn('class="mobile-sidebar-toggle"', html)
        self.assertIn('class="mobile-brand mobile-brand-logo-only" href="/" aria-label="Home"', html)
        self.assertIn('class="app-topbar topbar-search-only"', html)
        self.assertIn('topbar-search-only', html)
        self.assertIn('class="topbar-search"', html)
        self.assertNotIn('data-web-back', html)
        self.assertNotIn('class="topbar-actions"', html)
        left_rail_nav = html.split('<nav class="nav-list"', 1)[1].split('</nav>', 1)[0]
        self.assertNotIn('href="/search"', left_rail_nav)
        self.assertNotIn('aria-label="Search"', left_rail_nav)
        self.assertIn('href="/messages"', left_rail_nav)
        self.assertIn('aria-label="Messages"', left_rail_nav)
        self.assertIn('href="/notifications"', left_rail_nav)
        self.assertIn('aria-label="Alerts"', left_rail_nav)
        self.assertNotIn('href="/activity"', left_rail_nav)
        self.assertNotIn('aria-label="Activity"', left_rail_nav)
        self.assertNotIn('aria-label="Profile"', left_rail_nav)
        self.assertIn('class="mini-profile" href="/profile/demo"', html)
        self.assertIn('action="/search"', html.split('<form class="topbar-search"', 1)[1])
        self.assertIn('class="mobile-header-search"', html)
        self.assertNotIn('class="mobile-header-actions"', html)
        self.assertNotIn('class="nav-label sr-only"', html)
        self.assertIn('class="mobile-nav-label sr-only"', html)
        self.assertIn('data-mobile-profile-trigger', html)
        self.assertIn('data-mobile-account-menu', html)
        self.assertIn('data-i18n="mobile_logout"', html)
        mobile_nav_only = html.split('<nav class="mobile-bottom-nav"', 1)[1].split('</nav>', 1)[0]
        self.assertNotIn('href="/messages"', mobile_nav_only)
        self.assertNotIn('href="/notifications"', mobile_nav_only)
        mobile_order = [
            mobile_nav_only.index('aria-label="Home"'),
            mobile_nav_only.index('aria-label="Community"'),
            mobile_nav_only.index('aria-label="Create post"'),
            mobile_nav_only.index('aria-label="Clips"'),
            mobile_nav_only.index('aria-label="More"'),
        ]
        self.assertEqual(sorted(mobile_order), mobile_order)

        with zapp.app.test_request_context("/search"):
            search_html = zapp.render_template(
                "search.html",
                viewer=viewer,
                query="",
                tab="top",
                posts=[],
                users=[],
                suggested_users=[],
                recent_posts=[],
                highlights=[],
                page=1,
                has_next=False,
            )
        self.assertIn('data-web-back', search_html)
        self.assertNotIn('class="topbar-actions"', search_html)

    def test_mobile_reels_keep_immersive_video_fit(self):
        css = Path("static/css/sections/reels.css").read_text(encoding="utf-8")

        self.assertIn(".reel-video", css)
        self.assertRegex(css, r"(?s)\.reel-video\s*\{[^}]*object-fit:\s*contain")

    def test_reels_header_reserves_shared_topbar_space(self):
        css = Path("static/css/sections/reels.css").read_text(encoding="utf-8")

        self.assertIn("--reels-topbar-offset: 69px", css)
        self.assertIn("--reels-header-block: 80px", css)
        self.assertIn("min-height: calc(100svh - var(--reels-topbar-offset))", css)
        self.assertIn("top: var(--reels-topbar-offset)", css)
        self.assertIn("height: calc(100svh - var(--reels-topbar-offset) - var(--reels-header-block))", css)
        self.assertIn("min-height: calc(100svh - var(--reels-topbar-offset) - var(--reels-header-block))", css)
        self.assertIn("--reels-topbar-offset: 64px", css)
        self.assertIn("calc(100dvh - 64px - var(--reels-mobile-header)", css)
        self.assertNotIn("--reels-topbar-offset: 119px", css)
        self.assertIn("top: auto", css)

    def test_mobile_reel_comments_keep_composer_above_bottom_nav(self):
        css = Path("static/css/sections/reels.css").read_text(encoding="utf-8")

        self.assertIn("--reels-mobile-bottom-nav: 76px", css)
        self.assertIn("bottom: calc(var(--reels-mobile-bottom-nav) + env(safe-area-inset-bottom))", css)
        self.assertIn("max-height: calc(100dvh - 64px - var(--reels-mobile-bottom-nav) - env(safe-area-inset-bottom))", css)
        self.assertIn(".reel-comment-submit-form", css)
        self.assertIn("position: sticky", css)

    def test_reels_template_does_not_render_bottom_pagination_buttons(self):
        viewer = {"id": 7, "username": "demo", "display_name": "Demo User", "profile_photo_url": ""}
        with zapp.app.test_request_context("/reels"):
            html = zapp.render_template(
                "reels.html",
                viewer=viewer,
                reels=[],
                page=1,
                has_next=True,
                table_ready=True,
                tab="for_you",
                highlights=[],
            )

        self.assertNotIn('class="reels-pagination"', html)
        self.assertNotIn("More reels", html)
        self.assertNotIn(">Previous<", html)

    def test_mobile_reels_uses_bottom_plus_instead_of_header_upload_cta(self):
        css = Path("static/css/sections/reels.css").read_text(encoding="utf-8")
        mobile_nav_css = Path("static/css/sections/mobile-navigation.css").read_text(encoding="utf-8")

        self.assertIn("--reels-mobile-header: 52px", css)
        self.assertIn(".reels-header-title", css)
        self.assertIn("display: none", css)
        self.assertIn(".reels-header .compact-action", css)
        self.assertIn("display: none", css)
        self.assertIn("grid-template-columns: repeat(2, minmax(0, 1fr))", css)
        self.assertIn(".reels-header .compact-action", mobile_nav_css)
        self.assertIn("display: none", mobile_nav_css)
        self.assertNotIn("display: inline-flex", mobile_nav_css.split(".reels-header .compact-action", 1)[1].split("}", 1)[0])

    def test_reels_header_only_shows_for_you_and_following_tabs(self):
        viewer = {"id": 7, "username": "demo", "display_name": "Demo User", "profile_photo_url": ""}
        with zapp.app.test_request_context("/reels"):
            html = zapp.render_template(
                "reels.html",
                viewer=viewer,
                reels=[],
                page=1,
                has_next=False,
                table_ready=True,
                tab="for_you",
                highlights=[],
            )

        tabs = html.split('<nav class="reels-tabs"', 1)[1].split("</nav>", 1)[0]
        self.assertIn("For You", tabs)
        self.assertIn("Following", tabs)
        self.assertNotIn("Discovery", tabs)
        self.assertNotIn("tab=discovery", tabs)

    def test_reels_route_normalizes_removed_discovery_tab(self):
        captured_context = {}

        def fake_render(_template, **context):
            captured_context.update(context)
            return "ok"

        with patch.object(zapp, "get_current_user", return_value={"id": 7, "username": "demo"}), \
             patch.object(zapp, "get_reels", return_value=([], False)) as fake_get_reels, \
             patch.object(zapp, "render_template", side_effect=fake_render):
            response = self.client.get("/reels?tab=discovery")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(captured_context["tab"], "for_you")
        self.assertEqual(fake_get_reels.call_args.kwargs["tab"], "for_you")

    def test_sidebar_labels_are_visible_only_when_menu_is_open(self):
        css = Path("static/css/sections/navigation.css").read_text(encoding="utf-8")
        hardening_css = Path("static/css/sections/hardening.css").read_text(encoding="utf-8")
        mobile_drawer_css = Path("static/css/sections/mobile-drawer.css").read_text(encoding="utf-8")
        mobile_navigation_css = Path("static/css/sections/mobile-navigation.css").read_text(encoding="utf-8")
        script = Path("static/js/script.js").read_text(encoding="utf-8")

        self.assertIn(".left-rail:not(.menu-open) .nav-list a .sr-only", css)
        self.assertIn(".mobile-bottom-nav a .sr-only", css)
        self.assertIn(".left-rail.menu-open .nav-list a", css)
        self.assertIn("justify-content: flex-start", css)
        self.assertIn("gap: 14px", css)
        legacy_css = Path("static/css/sections/legacy-polish.css").read_text(encoding="utf-8")
        self.assertIn("transition: width 0.25s cubic-bezier(0.4, 0, 0.2, 1);", legacy_css)
        self.assertIn(".left-rail-wrapper:has(.left-rail.menu-open)", legacy_css)
        self.assertIn(".left-rail.menu-open .mini-profile div", hardening_css)
        self.assertIn("display: flex !important", hardening_css)
        self.assertIn("text-overflow: ellipsis", hardening_css)
        self.assertIn(".left-rail.menu-open", mobile_drawer_css)
        self.assertIn("display: none !important", mobile_drawer_css)
        self.assertIn(".mobile-account-menu:not([hidden])", mobile_drawer_css)
        self.assertIn("grid-template-columns: 40px minmax(0, 1fr) auto", mobile_navigation_css)
        self.assertIn("data-mobile-profile-trigger", script)
        self.assertIn("data-mobile-account-menu", script)
        self.assertIn("mobileProfileTrigger.addEventListener('click'", script)
        self.assertNotIn("mobile-sidebar-toggle", script)

    def test_community_highlights_badges_and_profile_hover_are_guarded(self):
        css = Path("static/css/sections/community-highlights.css").read_text(encoding="utf-8")

        self.assertIn(".community-highlights.panel", css)
        self.assertIn("padding: var(--space-8)", css)
        self.assertIn(".community-highlights.panel h2", css)
        self.assertIn("font-size: clamp(21px, 1.6vw, 24px)", css)
        self.assertIn(".mini-profile:hover", css)
        self.assertIn("text-decoration: none", css)
        self.assertIn(".left-rail.menu-open .mini-profile", css)
        self.assertIn("border-radius: var(--radius-lg)", css)
        self.assertIn(".mini-profile .level-badge", css)
        self.assertIn(".mini-profile .community-level-badge", css)
        self.assertIn("min-width: calc(var(--badge-height-sm) * 3)", css)

    def test_post_actions_are_icon_first_controls(self):
        with zapp.app.test_request_context("/"):
            html = zapp.render_template("_post_card.html", viewer={"id": 7}, post=self.sample_post())

        self.assertIn('aria-label="Reply to post"', html)
        self.assertIn('aria-label="Repost"', html)
        self.assertIn('aria-label="Like post"', html)
        self.assertIn('class="post-action-icon"', html)
        self.assertNotIn('<span aria-hidden="true">Reply</span>', html)
        self.assertNotIn('<span aria-hidden="true">Repost</span>', html)
        self.assertNotIn('<span aria-hidden="true">Like</span>', html)

    def test_manifest_has_core_app_shortcuts(self):
        manifest_path = Path(__file__).resolve().parents[1] / "static" / "manifest.json"
        manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
        shortcuts = {shortcut["name"]: shortcut["url"] for shortcut in manifest["shortcuts"]}

        self.assertEqual(shortcuts["Home"], "/")
        self.assertEqual(shortcuts["Reels"], "/reels")
        self.assertEqual(shortcuts["Messages"], "/messages")
        self.assertEqual(shortcuts["Notifications"], "/notifications")
        self.assertEqual(shortcuts["Profile"], "/profile")

    def test_search_discovery_context_uses_ranked_people_and_recent_posts(self):
        viewer = {"id": 7}
        popular = [{"id": 8, "username": "ranked", "display_name": "Ranked User"}]
        recent = [self.sample_post(12, 8, "ranked", "recent")]

        with patch.object(zapp, "get_popular_users", return_value=popular) as popular_users, \
             patch.object(zapp, "get_recent_posts", return_value=recent) as recent_posts:
            context = zapp.get_search_discovery_context(viewer, people_limit=4, posts_limit=3)

        popular_users.assert_called_once_with(7, 4)
        recent_posts.assert_called_once_with(7, 3)
        self.assertEqual(context["suggested_users"], popular)
        self.assertEqual(context["recent_posts"], recent)

    def test_setup_health_page_renders_safe_project_checks(self):
        viewer = {"id": 7, "username": "demo", "display_name": "Demo User", "profile_photo_url": ""}
        checks = [
            {"label": "Supabase connection", "status": "ready", "detail": "Client configured."},
            {"label": "Reels table", "status": "ready", "detail": "The reels table is queryable."},
            {"label": "PWA manifest", "status": "ready", "detail": "Manifest file exists."},
        ]
        with patch.object(zapp, "get_current_user", return_value=viewer), \
             patch.object(zapp, "get_setup_health", return_value=checks), \
             patch.object(zapp, "get_community_highlights", return_value=[]):
            html = self.client.get("/setup-health").data.decode()

        self.assertIn("Setup Health", html)
        self.assertIn("Supabase connection", html)
        self.assertIn("Reels table", html)
        self.assertIn("PWA manifest", html)

    def test_activity_template_groups_recent_user_history(self):
        viewer = {"id": 7, "username": "demo", "display_name": "Demo User", "profile_photo_url": ""}
        with zapp.app.test_request_context("/activity"):
            html = zapp.render_template(
                "activity.html",
                viewer=viewer,
                highlights=[],
                activity_items=[
                    zapp.activity_item("post", "Post", "Shared a status", "2026-06-01T12:00:00", "/post/1", "📝"),
                    zapp.activity_item("like", "Like", "You liked a post.", "2026-06-01T11:00:00", "/post/2", "👍"),
                ],
            )

        self.assertIn("Activity", html)
        self.assertIn("Shared a status", html)
        self.assertIn("You liked a post.", html)
        self.assertIn('class="activity-row"', html)

    def test_notification_stacking_creates_short_grouped_items(self):
        notifications = [
            {"type": "like", "post_id": 5, "actor_name": "Ada", "is_read": False},
            {"type": "like", "post_id": 5, "actor_name": "Sam", "is_read": True},
            {"type": "comment", "post_id": 5, "actor_name": "Mina", "is_read": False},
        ]

        stacked = zapp.stack_notifications(notifications)

        self.assertEqual(len(stacked), 2)
        like_item = next(item for item in stacked if item["type"] == "like")
        self.assertEqual(like_item["stack_count"], 2)
        self.assertEqual(like_item["actor_summary"], "Ada and Sam")
        self.assertFalse(like_item["is_read"])

    def test_notification_stacking_uses_reel_id_for_reel_events(self):
        notifications = [
            {"type": "reel_like", "reel_id": 9, "actor_name": "Ada", "is_read": False},
            {"type": "reel_like", "reel_id": 9, "actor_name": "Sam", "is_read": True},
            {"type": "reel_like", "reel_id": 10, "actor_name": "Mina", "is_read": False},
        ]

        stacked = zapp.stack_notifications(notifications)

        self.assertEqual(len(stacked), 2)
        reel_9 = next(item for item in stacked if item["reel_id"] == 9)
        self.assertEqual(reel_9["stack_count"], 2)
        self.assertEqual(reel_9["actor_summary"], "Ada and Sam")

    def test_notifications_template_marks_live_feed_rows(self):
        viewer = {"id": 7, "username": "demo", "display_name": "Demo User", "profile_photo_url": ""}
        notification = {
            "id": 44,
            "type": "message",
            "actor_username": "friend",
            "actor_name": "Friend User",
            "actor_summary": "Friend User",
            "is_read": False,
            "stack_count": 1,
            "created_at": "2026-08-09T12:00:00+00:00",
            "message_url": "/messages?u=friend",
            "friendship_status": "accepted",
            "friendship_action_user_id": 8,
        }
        with zapp.app.test_request_context("/notifications"):
            html = zapp.render_template(
                "notifications.html",
                viewer=viewer,
                notifications=[notification],
                highlights=[],
            )

        self.assertIn('data-notifications-feed data-latest-notification-id="44"', html)
        self.assertIn('data-notification-id="44"', html)
        self.assertIn("Friend User", html)
        self.assertIn("/messages?u=friend", html)

    def test_create_notification_validates_type_and_inserts_payload(self):
        class Result:
            data = []

        class FakeTable:
            def __init__(self):
                self.inserted = []

            def insert(self, payload):
                self.inserted.append(payload)
                return self

            def execute(self):
                return Result()

        fake_table = FakeTable()
        fake_supabase = SimpleNamespace(table=lambda _name: fake_table)

        with patch.object(zapp, "supabase", fake_supabase), \
             patch.object(zapp, "interaction_blocked", return_value=False):
            self.assertFalse(zapp.create_notification(7, 7, "like", post_id=5))
            self.assertFalse(zapp.create_notification(7, 8, "unsupported", post_id=5))
            self.assertTrue(zapp.create_notification(7, 8, "like", post_id=5))

        self.assertEqual(fake_table.inserted, [{
            "user_id": 7,
            "actor_id": 8,
            "type": "like",
            "post_id": 5,
        }])

    def test_live_status_includes_latest_event_ids(self):
        with patch.object(zapp, "get_current_user", return_value={"id": 7, "username": "demo"}), \
             patch.object(zapp, "unread_notification_count", return_value=2), \
             patch.object(zapp, "unread_message_count", return_value=3), \
             patch.object(zapp, "latest_notification_id", return_value=44), \
             patch.object(zapp, "latest_message_id", return_value=91):
            response = self.client.get("/api/live-status")

        payload = response.get_json()
        self.assertEqual(response.status_code, 200)
        self.assertTrue(payload["success"])
        self.assertEqual(payload["unread_notifications"], 2)
        self.assertEqual(payload["unread_messages"], 3)
        self.assertEqual(payload["latest_notification_id"], 44)
        self.assertEqual(payload["latest_message_id"], 91)
        self.assertIsNotNone(datetime.fromisoformat(payload["server_time"]).tzinfo)

    def test_api_notifications_returns_visible_recent_notifications(self):
        class Result:
            def __init__(self, data=None):
                self.data = data or []

        class FakeTable:
            def __init__(self, db):
                self.db = db
                self.filters = []
                self.limit_value = None

            def select(self, *_args, **_kwargs):
                return self

            def eq(self, key, value):
                self.filters.append((key, value))
                return self

            def gt(self, key, value):
                self.filters.append((key, value))
                return self

            def order(self, key, desc=False):
                self.db.ordering = (key, desc)
                return self

            def limit(self, value):
                self.limit_value = value
                return self

            def execute(self):
                self.db.filters = self.filters
                self.db.limit_value = self.limit_value
                return Result([
                    {
                        "id": 44,
                        "user_id": 7,
                        "actor_id": 8,
                        "type": "message",
                        "message_id": 91,
                        "is_read": False,
                        "created_at": "2026-08-09T12:00:00+00:00",
                        "actor": {"id": 8, "username": "friend", "display_name": "Friend User"},
                    },
                    {
                        "id": 43,
                        "user_id": 7,
                        "actor_id": 99,
                        "type": "like",
                        "post_id": 5,
                        "is_read": False,
                        "created_at": "2026-08-09T11:00:00+00:00",
                        "actor": {"id": 99, "username": "blocked", "display_name": "Blocked User"},
                    },
                ])

        class FakeSupabase:
            def __init__(self):
                self.filters = []
                self.ordering = None
                self.limit_value = None

            def table(self, name):
                self.table_name = name
                return FakeTable(self)

        fake = FakeSupabase()
        with patch.object(zapp, "get_current_user", return_value={"id": 7, "username": "demo"}), \
             patch.object(zapp, "supabase", fake), \
             patch.object(zapp, "blocked_user_ids_for_viewer", return_value={99}), \
             patch.object(zapp, "unread_notification_count", return_value=1), \
             patch.object(zapp, "latest_notification_id", return_value=44):
            response = self.client.get("/api/notifications?since_id=40&limit=5")

        payload = response.get_json()
        self.assertEqual(response.status_code, 200)
        self.assertTrue(payload["success"])
        self.assertEqual(fake.table_name, "notifications")
        self.assertEqual(fake.filters, [("user_id", 7), ("id", 40)])
        self.assertEqual(fake.ordering, ("id", True))
        self.assertEqual(fake.limit_value, 5)
        self.assertEqual(len(payload["notifications"]), 1)
        self.assertEqual(payload["notifications"][0]["id"], 44)
        self.assertEqual(payload["notifications"][0]["message_url"], "/messages?u=friend")
        self.assertEqual(payload["unread_notifications"], 1)

    def test_mark_notifications_read_supports_json_response(self):
        class Result:
            data = []

        class FakeTable:
            def __init__(self, db):
                self.db = db
                self.values = None
                self.filters = []

            def update(self, values):
                self.values = values
                return self

            def eq(self, key, value):
                self.filters.append((key, value))
                return self

            def execute(self):
                self.db.calls.append((self.values, tuple(self.filters)))
                return Result()

        class FakeSupabase:
            def __init__(self):
                self.calls = []

            def table(self, name):
                self.table_name = name
                return FakeTable(self)

        fake = FakeSupabase()
        with self.client.session_transaction() as sess:
            sess["csrf_token"] = "token"

        with patch.object(zapp, "get_current_user", return_value={"id": 7, "username": "demo"}), \
             patch.object(zapp, "supabase", fake), \
             patch.object(zapp, "unread_notification_count", return_value=0):
            response = self.client.post("/mark_notifications_read", data={
                "csrf_token": "token",
                "ajax": "1",
            })

        payload = response.get_json()
        self.assertEqual(response.status_code, 200)
        self.assertTrue(payload["success"])
        self.assertEqual(payload["unread_notifications"], 0)
        self.assertEqual(fake.table_name, "notifications")
        self.assertEqual(fake.calls, [({"is_read": True}, (("user_id", 7),))])

    def test_profile_stats_are_ordered_without_duplicate_metric_card(self):
        fake_user = {
            "id": 7,
            "username": "demo",
            "display_name": "Demo User",
            "profile_photo_url": "",
            "theme_color": "#1D9BF0",
            "avatar_color": "#1D9BF0",
            "badge_color": "#71767B",
            "level": 2,
            "total_xp": 120,
            "bio": "",
            "location": "",
            "website": "",
            "gender": "Male",
            "created_at": "2026-05-14T00:00:00+00:00",
        }
        with zapp.app.test_request_context("/profile/demo"):
            html = zapp.render_template(
                "profile.html",
                viewer=fake_user,
                profile=fake_user,
                is_own_profile=True,
                is_following=False,
                friend_status=None,
                friend_action_user_id=None,
                safety_state={"muted": False, "blocked": False},
                stats={"posts": 1, "comments": 2, "friends": 3, "following": 4, "followers": 5},
                posts=[],
                mode="posts",
                page=1,
                has_next=False,
                highlights=[],
                profile_banner={"label": "Rising", "description": "Keep going.", "class": "level-1"},
                profile_banner_class="level-1",
                profile_xp_progress=20,
                profile_xp_needed=80,
                profile_xp_current=20,
                profile_xp_span=100,
                next_level_reward={"level": 5, "label": "Rising Charge", "description": "Banner upgrade"},
                achievement_summary={"unlocked": 1, "total": 3},
                achievements=[{
                    "id": "first_post",
                    "name": "First Post",
                    "description": "Share one post.",
                    "current": 1,
                    "target": 1,
                    "progress": 100,
                    "progress_label": "1 / 1",
                    "unlocked": True,
                }],
            )

        stats_pos = html.index('class="profile-stats"')
        posts_pos = html.index('list_type=\'posts\'') if "list_type='posts'" in html else html.index('/profile/demo?m=posts')
        following_pos = html.index('/profile/demo/following')
        followers_pos = html.index('/profile/demo/followers')
        friends_pos = html.index('/profile/demo/friends')
        self.assertLess(posts_pos, following_pos)
        self.assertLess(following_pos, followers_pos)
        self.assertLess(followers_pos, friends_pos)
        self.assertGreater(posts_pos, stats_pos)
        self.assertNotIn('profile-account-card', html)
        self.assertIn('/profile/demo/following', html)
        self.assertIn('/profile/demo/followers', html)
        self.assertIn('/profile/demo/friends', html)
        self.assertIn("Achievements", html)
        self.assertIn("First Post", html)
        self.assertIn('href="/activity"', html)
        self.assertIn(">Activity</a>", html)
        self.assertIn('href="/settings"', html)
        self.assertIn(">Settings</a>", html)
        self.assertIn('href="/level-guide"', html)
        self.assertIn(">LvL Guide</a>", html)
        self.assertIn("profile-owner-actions", html)

    def test_other_profile_has_high_five_action(self):
        viewer = {
            "id": 7,
            "username": "viewer",
            "display_name": "Viewer",
            "profile_photo_url": "",
            "level": 1,
        }
        profile = {
            "id": 8,
            "username": "demo",
            "display_name": "Demo User",
            "profile_photo_url": "",
            "theme_color": "#1D9BF0",
            "avatar_color": "#1D9BF0",
            "badge_color": "#71767B",
            "level": 2,
            "total_xp": 120,
            "bio": "",
            "location": "",
            "website": "",
            "gender": "Male",
            "created_at": "2026-05-14T00:00:00+00:00",
        }
        with zapp.app.test_request_context("/profile/demo"):
            html = zapp.render_template(
                "profile.html",
                viewer=viewer,
                profile=profile,
                is_own_profile=False,
                is_following=False,
                friend_status=None,
                friend_action_user_id=None,
                safety_state={"muted": False, "blocked": False},
                stats={"posts": 1, "comments": 2, "friends": 3, "following": 4, "followers": 5},
                posts=[],
                mode="posts",
                page=1,
                has_next=False,
                highlights=[],
                profile_banner={"label": "Rising", "description": "Keep going.", "class": "level-1"},
                profile_banner_class="level-1",
                profile_xp_progress=20,
                profile_xp_needed=80,
                profile_xp_current=20,
                profile_xp_span=100,
                next_level_reward={"level": 5, "label": "Rising Charge", "description": "Banner upgrade"},
                achievement_summary={"unlocked": 1, "total": 3},
                achievements=[],
            )

        self.assertIn('class="profile-high-five-form"', html)
        self.assertIn('/profile/demo/high-five', html)
        self.assertIn('aria-label="High-five Demo User"', html)
        self.assertIn("Friendship starts with a streak", html)
        self.assertNotIn("Add friend", html)

    def test_mobile_profile_actions_use_stable_grid(self):
        css = Path("static/css/sections/profile-mobile.css").read_text(encoding="utf-8")

        self.assertIn("@media (max-width: 420px)", css)
        self.assertIn(".profile-actions:has(.profile-high-five-form)", css)
        self.assertIn("display: grid", css)
        self.assertIn("grid-template-areas:", css)
        self.assertIn('"highfive follow message"', css)
        self.assertIn('"mute mute block"', css)
        self.assertIn('.profile-actions .ajax-action-form[data-action="follow"]', css)
        self.assertIn('.profile-actions .ajax-action-form[data-action="mute"]', css)
        self.assertIn('.profile-actions .ajax-action-form[data-action="block"]', css)
        self.assertIn("width: 100%", css)
        self.assertIn(".profile-owner-actions", css)
        self.assertIn(".profile-top-row:has(.profile-owner-actions)", css)
        self.assertIn("grid-template-columns: repeat(3, minmax(0, 1fr))", css)
        self.assertIn(".profile-owner-actions > .outline-button", css)
        self.assertIn("grid-area: auto", css)
        self.assertIn("@media (max-width: 340px)", css)

    def test_profile_action_buttons_use_shared_control_shape(self):
        css = Path("static/css/sections/profile.css").read_text(encoding="utf-8")

        self.assertIn(".profile-actions form", css)
        self.assertIn(".profile-actions .outline-button", css)
        self.assertIn("display: inline-flex", css)
        self.assertIn("min-height: var(--control-lg)", css)
        self.assertIn("align-items: center", css)
        self.assertIn("justify-content: center", css)
        self.assertIn("border-radius: var(--radius-lg)", css)

    def test_relative_time_helper_formats_short_units(self):
        self.assertEqual(zapp.relative_time(None), "")
        self.assertEqual(zapp.relative_time("not-a-date"), "")

        now = zapp.datetime(2026, 6, 1, 12, 0, 0)
        self.assertEqual(zapp.relative_time("2026-06-01T11:59:30", now=now), "30s")
        self.assertEqual(zapp.relative_time("2026-06-01T11:42:00", now=now), "18m")
        self.assertEqual(zapp.relative_time("2026-06-01T08:00:00", now=now), "4h")
        self.assertEqual(zapp.relative_time("2026-05-30T12:00:00", now=now), "2d")
        self.assertEqual(zapp.relative_time("2026-04-01T12:00:00", now=now), "2mo")
        self.assertEqual(zapp.relative_time("2025-04-01T12:00:00", now=now), "1y")

    def test_high_five_route_is_registered(self):
        routes = {rule.rule for rule in zapp.app.url_map.iter_rules()}

        self.assertIn("/profile/<username>/high-five", routes)

    def test_social_list_renders_scrollable_people_panel(self):
        with zapp.app.test_request_context("/profile/demo/followers"):
            html = zapp.render_template(
                "social_list.html",
                viewer={"id": 7, "username": "viewer", "display_name": "Viewer", "profile_photo_url": ""},
                profile={"id": 8, "username": "demo", "display_name": "Demo User"},
                list_type="followers",
                list_title="Followers",
                users=[{
                    "id": 9,
                    "username": "follower",
                    "display_name": "Follower User",
                    "profile_photo_url": "",
                    "level": 1,
                    "is_following": False,
                }],
                highlights=[],
            )

        self.assertIn('class="people-list-scroll"', html)
        self.assertIn('class="person-row"', html)
        self.assertIn('/profile/follower', html)

    def test_create_post_requires_content_or_image(self):
        fake_user = {"id": 7, "username": "demo", "profile_photo_url": ""}
        with patch.object(zapp, "get_current_user", return_value=fake_user):
            response = self.client.post("/create_post", data={"csrf_token": self.csrf(), "content": ""})
        self.assertEqual(response.status_code, 302)

    def test_create_post_suppresses_rapid_duplicate_text(self):
        fake_user = {"id": 7, "username": "demo", "profile_photo_url": ""}
        with patch.object(zapp, "get_current_user", return_value=fake_user), \
             patch.object(zapp, "interaction_blocked", return_value=False), \
             patch.object(zapp, "recent_duplicate_submission", return_value=True), \
             patch.object(zapp, "supabase") as fake_supabase:
            response = self.client.post("/create_post", data={"csrf_token": self.csrf(), "content": "same"})

        self.assertEqual(response.status_code, 302)
        fake_supabase.table.assert_not_called()

    def test_create_post_accepts_image_only(self):
        class FakePostsTable:
            def __init__(self):
                self.inserted = None

            def insert(self, payload):
                self.inserted = payload
                return self

            def execute(self):
                return type("Response", (), {"data": [{"id": 123}]})()

        class FakeSupabase:
            def __init__(self, table):
                self.posts_table = table

            def table(self, name):
                self.last_table = name
                return self.posts_table

        fake_user = {"id": 7, "username": "demo", "profile_photo_url": ""}
        posts_table = FakePostsTable()
        fake_supabase = FakeSupabase(posts_table)

        with patch.object(zapp, "get_current_user", return_value=fake_user), \
             patch.object(zapp, "upload_image_to_storage", return_value="/static/uploads/posts/7/test.png"), \
             patch.object(zapp, "award_xp"), \
             patch.object(zapp, "supabase", fake_supabase):
            response = self.client.post("/create_post", data={
                "csrf_token": self.csrf(),
                "content": "",
                "image": (io.BytesIO(b"image-bytes"), "post.png"),
            }, content_type="multipart/form-data")

        self.assertEqual(response.status_code, 302)
        self.assertEqual(posts_table.inserted["content"], "")
        self.assertEqual(posts_table.inserted["image_url"], "/static/uploads/posts/7/test.png")

    def test_create_post_deletes_viewer_draft_after_publish(self):
        fake_user = {"id": 7, "username": "demo", "profile_photo_url": ""}
        fake_supabase = FakeDraftPublishSupabase(draft={
            "id": 44,
            "user_id": 7,
            "content": "from draft",
            "image_url": "https://example.com/draft.png",
        })

        with patch.object(zapp, "get_current_user", return_value=fake_user), \
             patch.object(zapp, "recent_duplicate_submission", return_value=False), \
             patch.object(zapp, "award_xp"), \
             patch.object(zapp, "supabase", fake_supabase):
            response = self.client.post("/create_post", data={
                "csrf_token": self.csrf(),
                "content": "from draft",
                "draft_id": "44",
            })

        self.assertEqual(response.status_code, 302)
        self.assertEqual(fake_supabase.post_inserted, {
            "user_id": 7,
            "content": "from draft",
            "image_url": "https://example.com/draft.png",
        })
        self.assertEqual(fake_supabase.draft_select_filters, [("id", 44), ("user_id", 7)])
        self.assertEqual(fake_supabase.draft_delete_filters, [("id", 44), ("user_id", 7)])

    def test_api_post_drafts_lists_viewer_drafts(self):
        fake_user = {"id": 7, "username": "demo", "profile_photo_url": ""}
        drafts_table = FakeDraftsTable(rows=[{
            "id": 3,
            "content": "saved text",
            "image_url": None,
            "created_at": "2026-08-06T10:00:00+00:00",
            "updated_at": "2026-08-06T10:05:00+00:00",
        }])

        with patch.object(zapp, "get_current_user", return_value=fake_user), \
             patch.object(zapp, "supabase", FakeDraftsSupabase(drafts_table)):
            response = self.client.get("/api/drafts")

        payload = response.get_json()
        self.assertEqual(response.status_code, 200)
        self.assertTrue(payload["success"])
        self.assertEqual(payload["drafts"][0]["content"], "saved text")
        self.assertEqual(drafts_table.filters, [("user_id", 7)])
        self.assertEqual(drafts_table.ordering, ("updated_at", True))
        self.assertEqual(drafts_table.limit_value, zapp.POST_DRAFT_LIMIT)

    def test_api_save_post_draft_creates_viewer_draft(self):
        token = self.csrf()
        fake_user = {"id": 7, "username": "demo", "profile_photo_url": ""}
        drafts_table = FakeDraftsTable()

        with patch.object(zapp, "get_current_user", return_value=fake_user), \
             patch.object(zapp, "supabase", FakeDraftsSupabase(drafts_table)):
            response = self.client.post(
                "/api/drafts/save",
                json={"content": "draft body"},
                headers={"X-CSRF-Token": token},
            )

        payload = response.get_json()
        self.assertEqual(response.status_code, 200)
        self.assertTrue(payload["success"])
        self.assertEqual(payload["draft"]["id"], 91)
        self.assertEqual(drafts_table.inserted["user_id"], 7)
        self.assertEqual(drafts_table.inserted["content"], "draft body")
        self.assertIsNone(drafts_table.inserted["image_url"])
        self.assertIn("updated_at", drafts_table.inserted)

    def test_api_save_post_draft_updates_only_viewer_draft(self):
        token = self.csrf()
        fake_user = {"id": 7, "username": "demo", "profile_photo_url": ""}
        drafts_table = FakeDraftsTable(rows=[{"id": 44, "content": "updated"}])

        with patch.object(zapp, "get_current_user", return_value=fake_user), \
             patch.object(zapp, "supabase", FakeDraftsSupabase(drafts_table)):
            response = self.client.post(
                "/api/drafts/save",
                json={"draft_id": 44, "content": "updated"},
                headers={"X-CSRF-Token": token},
            )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(drafts_table.updated["content"], "updated")
        self.assertNotIn("image_url", drafts_table.updated)
        self.assertEqual(drafts_table.filters, [("id", 44), ("user_id", 7)])

    def test_api_save_post_draft_uploads_image_file(self):
        token = self.csrf()
        fake_user = {"id": 7, "username": "demo", "profile_photo_url": ""}
        drafts_table = FakeDraftsTable()

        with patch.object(zapp, "get_current_user", return_value=fake_user), \
             patch.object(zapp, "upload_image_to_storage", return_value="/static/uploads/drafts/7/draft.png"), \
             patch.object(zapp, "supabase", FakeDraftsSupabase(drafts_table)):
            response = self.client.post(
                "/api/drafts/save",
                data={
                    "content": "draft with image",
                    "image": (io.BytesIO(b"image-bytes"), "draft.png"),
                },
                headers={"X-CSRF-Token": token},
                content_type="multipart/form-data",
            )

        payload = response.get_json()
        self.assertEqual(response.status_code, 200)
        self.assertTrue(payload["success"])
        self.assertEqual(drafts_table.inserted["user_id"], 7)
        self.assertEqual(drafts_table.inserted["content"], "draft with image")
        self.assertEqual(drafts_table.inserted["image_url"], "/static/uploads/drafts/7/draft.png")

    def test_api_save_post_draft_can_clear_existing_image(self):
        token = self.csrf()
        fake_user = {"id": 7, "username": "demo", "profile_photo_url": ""}
        drafts_table = FakeDraftsTable(rows=[{"id": 44, "content": "updated", "image_url": None}])

        with patch.object(zapp, "get_current_user", return_value=fake_user), \
             patch.object(zapp, "supabase", FakeDraftsSupabase(drafts_table)):
            response = self.client.post(
                "/api/drafts/save",
                json={"draft_id": 44, "content": "updated", "clear_image": "1"},
                headers={"X-CSRF-Token": token},
            )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(drafts_table.updated["content"], "updated")
        self.assertIsNone(drafts_table.updated["image_url"])
        self.assertEqual(drafts_table.filters, [("id", 44), ("user_id", 7)])

    def test_api_save_post_draft_validates_content_length(self):
        token = self.csrf()
        fake_user = {"id": 7, "username": "demo", "profile_photo_url": ""}
        drafts_table = FakeDraftsTable()

        with patch.object(zapp, "get_current_user", return_value=fake_user), \
             patch.object(zapp, "supabase", FakeDraftsSupabase(drafts_table)):
            response = self.client.post(
                "/api/drafts/save",
                json={"content": "x" * 281},
                headers={"X-CSRF-Token": token},
            )

        self.assertEqual(response.status_code, 400)
        self.assertIsNone(drafts_table.inserted)
        self.assertIsNone(drafts_table.updated)

    def test_api_delete_post_draft_deletes_only_viewer_draft(self):
        token = self.csrf()
        fake_user = {"id": 7, "username": "demo", "profile_photo_url": ""}
        drafts_table = FakeDraftsTable(rows=[{"id": 44}])

        with patch.object(zapp, "get_current_user", return_value=fake_user), \
             patch.object(zapp, "supabase", FakeDraftsSupabase(drafts_table)):
            response = self.client.post(
                "/api/drafts/delete",
                json={"draft_id": 44},
                headers={"X-CSRF-Token": token},
            )

        payload = response.get_json()
        self.assertEqual(response.status_code, 200)
        self.assertTrue(payload["success"])
        self.assertEqual(payload["deleted_id"], 44)
        self.assertEqual(drafts_table.action, "delete")
        self.assertEqual(drafts_table.filters, [("id", 44), ("user_id", 7)])

    def test_api_publish_post_draft_creates_post_and_deletes_draft(self):
        token = self.csrf()
        fake_user = {"id": 7, "username": "demo", "profile_photo_url": ""}
        fake_supabase = FakeDraftPublishSupabase(draft={
            "id": 44,
            "user_id": 7,
            "content": "draft body",
            "image_url": "https://example.com/image.png",
            "created_at": "2026-08-06T10:00:00+00:00",
            "updated_at": "2026-08-06T10:05:00+00:00",
        })

        with patch.object(zapp, "get_current_user", return_value=fake_user), \
             patch.object(zapp, "supabase", fake_supabase), \
             patch.object(zapp, "recent_duplicate_submission", return_value=False), \
             patch.object(zapp, "award_xp") as award_xp:
            response = self.client.post(
                "/api/drafts/publish",
                json={"draft_id": 44},
                headers={"X-CSRF-Token": token},
            )

        payload = response.get_json()
        self.assertEqual(response.status_code, 200)
        self.assertTrue(payload["success"])
        self.assertEqual(payload["post"]["id"], 123)
        self.assertEqual(payload["deleted_id"], 44)
        self.assertTrue(payload["draft_deleted"])
        self.assertEqual(fake_supabase.draft_select_filters, [("id", 44), ("user_id", 7)])
        self.assertEqual(fake_supabase.draft_select_limit, 1)
        self.assertEqual(fake_supabase.post_inserted, {
            "user_id": 7,
            "content": "draft body",
            "image_url": "https://example.com/image.png",
        })
        self.assertEqual(fake_supabase.draft_delete_filters, [("id", 44), ("user_id", 7)])
        award_xp.assert_called_once_with(7, "post_created", 10, 123)

    def test_api_publish_post_draft_returns_404_for_missing_viewer_draft(self):
        token = self.csrf()
        fake_user = {"id": 7, "username": "demo", "profile_photo_url": ""}
        fake_supabase = FakeDraftPublishSupabase(draft=None)

        with patch.object(zapp, "get_current_user", return_value=fake_user), \
             patch.object(zapp, "supabase", fake_supabase), \
             patch.object(zapp, "award_xp") as award_xp:
            response = self.client.post(
                "/api/drafts/publish",
                json={"draft_id": 44},
                headers={"X-CSRF-Token": token},
            )

        payload = response.get_json()
        self.assertEqual(response.status_code, 404)
        self.assertFalse(payload["success"])
        self.assertEqual(fake_supabase.draft_select_filters, [("id", 44), ("user_id", 7)])
        self.assertIsNone(fake_supabase.post_inserted)
        self.assertEqual(fake_supabase.draft_delete_filters, [])
        award_xp.assert_not_called()

    def test_send_message_blocks_self_message(self):
        fake_user = {"id": 7, "username": "demo", "profile_photo_url": ""}
        with patch.object(zapp, "get_current_user", return_value=fake_user):
            response = self.client.post("/send_message", data={
                "csrf_token": self.csrf(),
                "receiver_id": "7",
                "content": "hello",
                "ajax": "1"
            })
        self.assertEqual(response.status_code, 400)
        self.assertIn(b"You cannot send a message to yourself", response.data)

    def test_send_message_suppresses_rapid_duplicate_ajax(self):
        fake_user = {"id": 7, "username": "demo", "profile_photo_url": ""}
        with patch.object(zapp, "get_current_user", return_value=fake_user), \
             patch.object(zapp, "interaction_blocked", return_value=False), \
             patch.object(zapp, "recent_duplicate_submission", return_value=True), \
             patch.object(zapp, "supabase") as fake_supabase:
            response = self.client.post("/send_message", data={
                "csrf_token": self.csrf(),
                "receiver_id": "8",
                "content": "hello",
                "ajax": "1",
            })

        self.assertEqual(response.status_code, 409)
        self.assertIn(b"Already sent.", response.data)
        fake_supabase.table.assert_not_called()

    def test_attachment_upload_enforces_allowlist_and_owner_bound_temp_file(self):
        fake_user = {"id": 7, "username": "demo", "profile_photo_url": ""}
        token = self.csrf()

        with tempfile.TemporaryDirectory() as tmpdir, \
             patch.object(zapp.app, "root_path", tmpdir), \
             patch.object(zapp, "get_current_user", return_value=fake_user):
            rejected = self.client.post(
                "/api/upload_attachment",
                data={"file": (io.BytesIO(b"<svg></svg>"), "icon.svg")},
                headers={"X-CSRF-Token": token},
                content_type="multipart/form-data",
            )
            self.assertEqual(rejected.status_code, 400)
            self.assertFalse(rejected.get_json()["success"])

            accepted = self.client.post(
                "/api/upload_attachment",
                data={"file": (io.BytesIO(b"%PDF-1.4"), "Report Final.pdf")},
                headers={"X-CSRF-Token": token},
                content_type="multipart/form-data",
            )

            payload = accepted.get_json()
            self.assertEqual(accepted.status_code, 200)
            self.assertTrue(payload["success"])
            self.assertRegex(payload["temp_filename"], r"^u7_[0-9a-f]{32}\.pdf$")
            self.assertEqual(payload["attachment_name"], "Report_Final.pdf")
            self.assertEqual(payload["attachment_type"], "document")
            self.assertTrue(os.path.exists(os.path.join(tmpdir, "uploads", "attachments", payload["temp_filename"])))

    def test_attachment_upload_uses_private_supabase_bucket_outside_testing(self):
        class FakeBucket:
            def __init__(self):
                self.uploads = []

            def upload(self, path, payload, file_options=None):
                self.uploads.append((path, payload, file_options))

        class FakeStorage:
            def __init__(self):
                self.bucket = FakeBucket()
                self.created = None

            def get_bucket(self, name):
                raise RuntimeError("missing bucket")

            def create_bucket(self, name, options=None):
                self.created = (name, options)

            def from_(self, name):
                self.selected = name
                return self.bucket

        fake_storage = FakeStorage()
        fake_supabase = SimpleNamespace(storage=fake_storage)
        token = self.csrf()

        with patch.dict(zapp.app.config, {"TESTING": False}), \
             patch.object(zapp, "supabase", fake_supabase), \
             patch.object(zapp, "get_current_user", return_value={"id": 7, "username": "demo"}):
            response = self.client.post(
                "/api/upload_attachment",
                data={"file": (io.BytesIO(b"%PDF-1.4"), "report.pdf")},
                headers={"X-CSRF-Token": token},
                content_type="multipart/form-data",
            )

        payload = response.get_json()
        self.assertEqual(response.status_code, 200)
        self.assertTrue(payload["success"])
        self.assertEqual(fake_storage.created[0], zapp.SUPABASE_ATTACHMENT_BUCKET)
        self.assertFalse(fake_storage.created[1]["public"])
        uploaded_path, uploaded_payload, options = fake_storage.bucket.uploads[0]
        self.assertEqual(uploaded_path, zapp.attachment_storage_path(payload["temp_filename"]))
        self.assertEqual(uploaded_payload, b"%PDF-1.4")
        self.assertEqual(options["content-type"], "application/pdf")

    def test_send_message_finalizes_private_attachment_file(self):
        class Result:
            def __init__(self, data=None):
                self.data = data or []

        class FakeTable:
            def __init__(self, db, name):
                self.db = db
                self.name = name
                self.action = None
                self.values = None
                self.filters = []

            def select(self, *_args, **_kwargs):
                self.action = "select"
                return self

            def insert(self, values):
                self.action = "insert"
                self.values = values
                return self

            def update(self, values):
                self.action = "update"
                self.values = values
                return self

            def eq(self, key, value):
                self.filters.append((key, value))
                return self

            def execute(self):
                self.db.calls.append((self.name, self.action, self.values, tuple(self.filters)))
                if self.name == "users" and self.action == "select":
                    return Result([{"id": 8}])
                if self.name == "messages" and self.action == "insert":
                    return Result([{"id": 91, **self.values}])
                return Result([self.values or {}])

        class FakeSupabase:
            def __init__(self):
                self.calls = []

            def table(self, name):
                return FakeTable(self, name)

        fake = FakeSupabase()
        fake_user = {"id": 7, "username": "demo", "profile_photo_url": ""}
        temp_filename = zapp.temporary_attachment_filename(7, "pdf")

        with tempfile.TemporaryDirectory() as tmpdir:
            upload_dir = os.path.join(tmpdir, "uploads", "attachments")
            os.makedirs(upload_dir, exist_ok=True)
            temp_path = os.path.join(upload_dir, temp_filename)
            with open(temp_path, "wb") as attachment_file:
                attachment_file.write(b"%PDF-1.4")

            with patch.object(zapp.app, "root_path", tmpdir), \
                 patch.object(zapp, "get_current_user", return_value=fake_user), \
                 patch.object(zapp, "supabase", fake), \
                 patch.object(zapp, "interaction_blocked", return_value=False), \
                 patch.object(zapp, "recent_duplicate_submission", return_value=False), \
                 patch.object(zapp, "create_notification"), \
                 patch.object(zapp, "update_streak", return_value=(0, 0)):
                response = self.client.post("/send_message", data={
                    "csrf_token": self.csrf(),
                    "receiver_id": "8",
                    "content": "",
                    "temp_filename": temp_filename,
                    "attachment_name": "Report Final.pdf",
                    "ajax": "1",
                })

            payload = response.get_json()
            self.assertEqual(response.status_code, 200)
            self.assertTrue(payload["success"])
            self.assertFalse(os.path.exists(temp_path))
            self.assertTrue(os.path.exists(os.path.join(upload_dir, "91.pdf")))
            self.assertIn(("messages", "insert", {
                "sender_id": 7,
                "receiver_id": 8,
                "content": "",
                "attachment_type": "document",
                "attachment_name": "Report_Final.pdf",
            }, ()), fake.calls)
            self.assertIn(("messages", "update", {"attachment_url": "/attachment/91"}, (("id", 91),)), fake.calls)

    def test_send_message_rejects_cross_user_temp_attachment(self):
        fake_user = {"id": 7, "username": "demo", "profile_photo_url": ""}
        temp_filename = zapp.temporary_attachment_filename(8, "pdf")

        with tempfile.TemporaryDirectory() as tmpdir:
            upload_dir = os.path.join(tmpdir, "uploads", "attachments")
            os.makedirs(upload_dir, exist_ok=True)
            with open(os.path.join(upload_dir, temp_filename), "wb") as attachment_file:
                attachment_file.write(b"%PDF-1.4")

            with patch.object(zapp.app, "root_path", tmpdir), \
                 patch.object(zapp, "get_current_user", return_value=fake_user), \
                 patch.object(zapp, "supabase") as fake_supabase:
                response = self.client.post("/send_message", data={
                    "csrf_token": self.csrf(),
                    "receiver_id": "8",
                    "content": "",
                    "temp_filename": temp_filename,
                    "attachment_name": "Report.pdf",
                    "ajax": "1",
                })

            self.assertEqual(response.status_code, 400)
            self.assertIn("Invalid attachment upload", response.get_json()["error"])
            fake_supabase.table.assert_not_called()

    def test_send_message_moves_supabase_attachment_to_message_key(self):
        class Result:
            def __init__(self, data=None):
                self.data = data or []

        class FakeBucket:
            def __init__(self, files):
                self.files = files
                self.moves = []

            def exists(self, path):
                return path in self.files

            def move(self, source, target):
                self.moves.append((source, target))
                self.files[target] = self.files.pop(source)

        class FakeStorage:
            def __init__(self, bucket):
                self.bucket = bucket

            def from_(self, name):
                self.selected = name
                return self.bucket

        class FakeTable:
            def __init__(self, db, name):
                self.db = db
                self.name = name
                self.action = None
                self.values = None
                self.filters = []

            def select(self, *_args, **_kwargs):
                self.action = "select"
                return self

            def insert(self, values):
                self.action = "insert"
                self.values = values
                return self

            def update(self, values):
                self.action = "update"
                self.values = values
                return self

            def eq(self, key, value):
                self.filters.append((key, value))
                return self

            def execute(self):
                self.db.calls.append((self.name, self.action, self.values, tuple(self.filters)))
                if self.name == "users" and self.action == "select":
                    return Result([{"id": 8}])
                if self.name == "messages" and self.action == "insert":
                    return Result([{"id": 91, **self.values}])
                return Result([self.values or {}])

        class FakeSupabase:
            def __init__(self, storage):
                self.storage = storage
                self.calls = []

            def table(self, name):
                return FakeTable(self, name)

        temp_filename = zapp.temporary_attachment_filename(7, "pdf")
        temp_path = zapp.attachment_storage_path(temp_filename)
        bucket = FakeBucket({temp_path: b"%PDF-1.4"})
        fake = FakeSupabase(FakeStorage(bucket))

        with patch.dict(zapp.app.config, {"TESTING": False}), \
             patch.object(zapp, "supabase", fake), \
             patch.object(zapp, "get_current_user", return_value={"id": 7, "username": "demo"}), \
             patch.object(zapp, "interaction_blocked", return_value=False), \
             patch.object(zapp, "recent_duplicate_submission", return_value=False), \
             patch.object(zapp, "create_notification"), \
             patch.object(zapp, "update_streak", return_value=(0, 0)):
            response = self.client.post("/send_message", data={
                "csrf_token": self.csrf(),
                "receiver_id": "8",
                "content": "",
                "temp_filename": temp_filename,
                "attachment_name": "Report.pdf",
                "ajax": "1",
            })

        self.assertEqual(response.status_code, 200)
        final_path = zapp.attachment_storage_path("91.pdf")
        self.assertEqual(bucket.moves, [(temp_path, final_path)])
        self.assertNotIn(temp_path, bucket.files)
        self.assertEqual(bucket.files[final_path], b"%PDF-1.4")
        self.assertIn(("messages", "update", {"attachment_url": "/attachment/91"}, (("id", 91),)), fake.calls)

    def test_mark_message_thread_read_clears_messages_and_notifications(self):
        class FakeTable:
            def __init__(self, db, name):
                self.db = db
                self.name = name
                self.action = None
                self.values = None
                self.filters = []

            def update(self, values):
                self.action = "update"
                self.values = values
                return self

            def eq(self, key, value):
                self.filters.append((key, value))
                return self

            def execute(self):
                self.db.calls.append((self.name, self.action, self.values, tuple(self.filters)))
                return SimpleNamespace(data=[])

        class FakeSupabase:
            def __init__(self):
                self.calls = []

            def table(self, name):
                return FakeTable(self, name)

        fake = FakeSupabase()
        with patch.object(zapp, "supabase", fake):
            zapp.mark_message_thread_read(7, 8)

        self.assertIn(("messages", "update", {"is_read": True}, (("sender_id", 8), ("receiver_id", 7))), fake.calls)
        self.assertIn(("notifications", "update", {"is_read": True}, (("user_id", 7), ("actor_id", 8), ("type", "message"), ("is_read", False))), fake.calls)

    def test_api_messages_supports_before_id_pagination(self):
        class Result:
            def __init__(self, data=None):
                self.data = data or []

        class FakeTable:
            def __init__(self, db, name):
                self.db = db
                self.name = name
                self.filters = []
                self.or_filter = None
                self.lt_filter = None
                self.gt_filter = None
                self.ordering = None
                self.limit_value = None

            def select(self, *_args, **_kwargs):
                return self

            def eq(self, key, value):
                self.filters.append((key, value))
                return self

            def or_(self, value):
                self.or_filter = value
                return self

            def lt(self, key, value):
                self.lt_filter = (key, value)
                return self

            def gt(self, key, value):
                self.gt_filter = (key, value)
                return self

            def order(self, key, desc=False):
                self.ordering = (key, desc)
                return self

            def limit(self, value):
                self.limit_value = value
                return self

            def execute(self):
                if self.name == "users":
                    return Result([{"id": 8, "username": "friend", "display_name": "Friend"}])
                self.db.message_filters = self.filters
                self.db.message_or_filter = self.or_filter
                self.db.message_lt_filter = self.lt_filter
                self.db.message_gt_filter = self.gt_filter
                self.db.message_ordering = self.ordering
                self.db.message_limit = self.limit_value
                return Result([
                    {"id": 99, "sender_id": 8, "receiver_id": 7, "content": "newer", "created_at": "2026-08-09T12:03:00+00:00"},
                    {"id": 98, "sender_id": 7, "receiver_id": 8, "content": "older", "created_at": "2026-08-09T12:02:00+00:00"},
                    {"id": 97, "sender_id": 8, "receiver_id": 7, "content": "has more", "created_at": "2026-08-09T12:01:00+00:00"},
                ])

        class FakeSupabase:
            def __init__(self):
                self.message_filters = []
                self.message_or_filter = None
                self.message_lt_filter = None
                self.message_gt_filter = None
                self.message_ordering = None
                self.message_limit = None

            def table(self, name):
                return FakeTable(self, name)

        fake = FakeSupabase()
        with patch.object(zapp, "get_current_user", return_value={"id": 7, "username": "viewer"}), \
             patch.object(zapp, "supabase", fake), \
             patch.object(zapp, "attach_shared_posts", side_effect=lambda messages: messages), \
             patch.object(zapp, "mark_message_thread_read") as mark_read:
            response = self.client.get("/api/messages/friend?before_id=100&limit=2")

        payload = response.get_json()
        self.assertEqual(response.status_code, 200)
        self.assertTrue(payload["success"])
        self.assertEqual([message["id"] for message in payload["messages"]], [98, 99])
        self.assertTrue(payload["has_more"])
        self.assertEqual(payload["oldest_message_id"], 98)
        self.assertEqual(fake.message_lt_filter, ("id", 100))
        self.assertIsNone(fake.message_gt_filter)
        self.assertEqual(fake.message_ordering, ("created_at", True))
        self.assertEqual(fake.message_limit, 3)
        self.assertIn("sender_id.eq.7", fake.message_or_filter)
        self.assertIn("receiver_id.eq.8", fake.message_or_filter)
        mark_read.assert_called_once_with(7, 8)

    def test_share_post_blocks_safety_hidden_recipients(self):
        class Result:
            def __init__(self, data=None):
                self.data = data or []

        class FakeTable:
            def __init__(self, db, name):
                self.db = db
                self.name = name
                self.action = None
                self.payload = None

            def select(self, *_args, **_kwargs):
                self.action = "select"
                return self

            def insert(self, payload):
                self.action = "insert"
                self.payload = payload
                return self

            def neq(self, *_args):
                return self

            def order(self, *_args, **_kwargs):
                return self

            def range(self, *_args):
                return self

            def execute(self):
                if self.name == "messages" and self.action == "insert":
                    self.db.message_payloads.append(self.payload)
                    return Result([{"id": 1}])
                if self.name == "users":
                    return Result([
                        {"id": 8, "username": "blocked", "display_name": "Blocked User"},
                        {"id": 9, "username": "open", "display_name": "Open User"},
                    ])
                return Result()

        class FakeSupabase:
            def __init__(self):
                self.message_payloads = []

            def table(self, name):
                return FakeTable(self, name)

        fake = FakeSupabase()
        viewer = {"id": 7, "username": "viewer", "display_name": "Viewer", "profile_photo_url": ""}

        with zapp.app.test_request_context("/share_post/42", method="POST", data={"target_user_id": "8"}), \
             patch.object(zapp, "get_current_user", return_value=viewer), \
             patch.object(zapp, "supabase", fake), \
             patch.object(zapp, "interaction_blocked", side_effect=lambda _viewer_id, target_id: target_id == 8):
            response = zapp.share_post(42)

        self.assertEqual(response.status_code, 302)
        self.assertEqual(fake.message_payloads, [])

        rendered = {}
        with zapp.app.test_request_context("/share_post/42"), \
             patch.object(zapp, "get_current_user", return_value=viewer), \
             patch.object(zapp, "supabase", fake), \
             patch.object(zapp, "filter_blocked_users", return_value=[{"id": 9, "username": "open", "display_name": "Open User"}]) as filter_users, \
             patch.object(zapp, "render_template", side_effect=lambda _template, **context: rendered.update(context) or "OK"):
            self.assertEqual(zapp.share_post(42), "OK")

        filter_users.assert_called_once()
        self.assertEqual([user["id"] for user in rendered["users"]], [9])

    def test_api_share_send_validates_and_sends_dm(self):
        class Result:
            def __init__(self, data=None):
                self.data = data or []

        class FakeTable:
            def __init__(self, db, name):
                self.db = db
                self.name = name
                self.payload = None

            def insert(self, payload):
                self.payload = payload
                return self

            def execute(self):
                if self.name == "messages":
                    self.db.message_payloads.append(self.payload)
                    return Result([{"id": 77}])
                return Result()

        class FakeSupabase:
            def __init__(self):
                self.message_payloads = []

            def table(self, name):
                return FakeTable(self, name)

        viewer = {"id": 7, "username": "viewer", "display_name": "Viewer", "profile_photo_url": ""}
        token = self.csrf()

        with patch.object(zapp, "get_current_user", return_value=viewer):
            missing = self.client.post(
                "/api/share/send",
                json={"receiver_id": "8"},
                headers={"X-CSRF-Token": token},
            )
            self.assertEqual(missing.status_code, 400)
            self.assertFalse(missing.get_json()["success"])

            self_send = self.client.post(
                "/api/share/send",
                json={"receiver_id": "7", "url": "https://lvlapp.vercel.app/reels#reel-3"},
                headers={"X-CSRF-Token": token},
            )
            self.assertEqual(self_send.status_code, 400)
            self.assertIn("someone else", self_send.get_json()["error"])

        blocked_fake = FakeSupabase()
        with patch.object(zapp, "get_current_user", return_value=viewer), \
             patch.object(zapp, "supabase", blocked_fake), \
             patch.object(zapp, "interaction_blocked", return_value=True):
            blocked = self.client.post(
                "/api/share/send",
                json={"receiver_id": "8", "url": "https://lvlapp.vercel.app/reels#reel-3"},
                headers={"X-CSRF-Token": token},
            )
            self.assertEqual(blocked.status_code, 403)
            self.assertEqual(blocked_fake.message_payloads, [])

        duplicate_fake = FakeSupabase()
        with patch.object(zapp, "get_current_user", return_value=viewer), \
             patch.object(zapp, "supabase", duplicate_fake), \
             patch.object(zapp, "interaction_blocked", return_value=False), \
             patch.object(zapp, "recent_duplicate_submission", return_value=True):
            duplicate = self.client.post(
                "/api/share/send",
                json={"receiver_id": "8", "url": "https://lvlapp.vercel.app/reels#reel-3"},
                headers={"X-CSRF-Token": token},
            )
            self.assertEqual(duplicate.status_code, 409)
            self.assertEqual(duplicate_fake.message_payloads, [])

        fake = FakeSupabase()
        with patch.object(zapp, "get_current_user", return_value=viewer), \
             patch.object(zapp, "supabase", fake), \
             patch.object(zapp, "interaction_blocked", return_value=False), \
             patch.object(zapp, "recent_duplicate_submission", return_value=False), \
             patch.object(zapp, "create_notification") as notify:
            response = self.client.post(
                "/api/share/send",
                json={"receiver_id": "8", "url": "https://lvlapp.vercel.app/reels#reel-3"},
                headers={"X-CSRF-Token": token},
            )

        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.get_json()["success"])
        self.assertEqual(fake.message_payloads, [{
            "sender_id": 7,
            "receiver_id": 8,
            "content": "Check this out! https://lvlapp.vercel.app/reels#reel-3",
        }])
        notify.assert_called_once_with(8, 7, 'message', message_id=77)

    def test_onboarding_skips_blocked_follow_ids(self):
        class Result:
            def __init__(self, data=None):
                self.data = data or []

        class FakeTable:
            def __init__(self, db, name):
                self.db = db
                self.name = name
                self.action = None
                self.payload = None

            def select(self, *_args, **_kwargs):
                self.action = "select"
                return self

            def update(self, payload):
                self.action = "update"
                self.payload = payload
                return self

            def insert(self, payload):
                self.action = "insert"
                self.payload = payload
                return self

            def eq(self, key, value):
                self.db.filters.append((self.name, key, value))
                return self

            def execute(self):
                if self.name == "follows" and self.action == "insert":
                    self.db.follow_payloads.append(self.payload)
                return Result()

        class FakeSupabase:
            def __init__(self):
                self.filters = []
                self.follow_payloads = []

            def table(self, name):
                return FakeTable(self, name)

        fake = FakeSupabase()
        viewer = {"id": 7, "username": "viewer", "display_name": "Viewer", "profile_photo_url": ""}

        with zapp.app.test_request_context("/onboarding", method="POST", data={"follow_ids": ["8", "9"]}), \
             patch.object(zapp, "get_current_user", return_value=viewer), \
             patch.object(zapp, "supabase", fake), \
             patch.object(zapp, "interaction_blocked", side_effect=lambda _viewer_id, target_id: target_id == 8):
            response = zapp.onboarding()

        self.assertEqual(response.status_code, 302)
        self.assertEqual(fake.follow_payloads, [{"follower_id": 7, "following_id": 9}])

    def test_blocked_profile_hides_stats_and_activity(self):
        class Result:
            def __init__(self, data=None, count=0):
                self.data = data or []
                self.count = count

        class FakeTable:
            def __init__(self, name):
                self.name = name

            def select(self, *_args, **_kwargs):
                return self

            def eq(self, *_args):
                return self

            def is_(self, *_args):
                return self

            def execute(self):
                if self.name == "users":
                    return Result([{
                        "id": 8,
                        "username": "blocked",
                        "display_name": "Blocked User",
                        "profile_photo_url": "",
                        "theme_color": "#1D9BF0",
                        "avatar_color": "#1D9BF0",
                        "badge_color": "#71767B",
                        "level": 2,
                        "total_xp": 120,
                        "bio": "",
                        "location": "",
                        "website": "",
                        "gender": "Male",
                        "created_at": "2026-05-14T00:00:00+00:00",
                    }])
                return Result(count=99)

        class FakeSupabase:
            def table(self, name):
                return FakeTable(name)

        viewer = {"id": 7, "username": "viewer", "display_name": "Viewer", "profile_photo_url": ""}
        rendered = {}

        with zapp.app.test_request_context("/profile/blocked"), \
             patch.object(zapp, "get_current_user", return_value=viewer), \
             patch.object(zapp, "supabase", FakeSupabase()), \
             patch.object(zapp, "get_user_safety_state", return_value={"blocked": False, "muted": False, "blocked_by": True, "interaction_blocked": True}), \
             patch.object(zapp, "get_profile_posts", return_value=[self.sample_post()]), \
             patch.object(zapp, "get_pair_streak_status", return_value={"count": 0, "is_friend": False, "days_until_friend": 7}), \
             patch.object(zapp, "get_streak_friend_ids", return_value=({}, [1, 2])), \
             patch.object(zapp, "get_community_highlights", return_value=[]), \
             patch.object(zapp, "render_template", side_effect=lambda _template, **context: rendered.update(context) or "OK"):
            self.assertEqual(zapp.profile("blocked"), "OK")

        self.assertEqual(rendered["posts"], [])
        self.assertEqual(rendered["stats"], {"following": 0, "followers": 0, "friends": 0, "posts": 0, "comments": 0})

    def test_community_members_filters_blocked_users(self):
        class Result:
            def __init__(self, data=None):
                self.data = data or []

        class FakeTable:
            def select(self, *_args, **_kwargs):
                return self

            def eq(self, *_args):
                return self

            def order(self, *_args, **_kwargs):
                return self

            def limit(self, *_args):
                return self

            def execute(self):
                return Result([
                    {"user_id": 8, "user": {"id": 8, "username": "blocked"}},
                    {"user_id": 9, "user": {"id": 9, "username": "open"}},
                ])

        with patch.object(zapp, "supabase", SimpleNamespace(table=lambda _name: FakeTable())), \
             patch.object(zapp, "blocked_user_ids_for_viewer", return_value={8}):
            members = zapp.get_community_members(1, viewer_id=7)

        self.assertEqual([member["user"]["id"] for member in members], [9])

    def test_messages_template_includes_message_delete_controls(self):
        viewer = {"id": 7, "username": "viewer", "display_name": "Viewer", "profile_photo_url": ""}
        target = {"id": 8, "username": "demo", "display_name": "Demo User", "profile_photo_url": "", "theme_color": "#1D9BF0"}
        with zapp.app.test_request_context("/messages?u=demo"):
            html = zapp.render_template(
                "messages.html",
                viewer=viewer,
                target_username="demo",
                target_user=target,
                conversations=[],
                all_users=[],
                has_older_messages=True,
                messages_list=[{
                    "id": 42,
                    "sender_id": 7,
                    "receiver_id": 8,
                    "content": "hello",
                    "created_at": "2026-05-14T12:00:00+00:00",
                }],
                suggested_communities=[],
                message_trending_posts=[],
                message_people=[],
            )

        self.assertIn('data-delete-message-url="/delete_message"', html)
        self.assertIn('data-message-id="42"', html)
        self.assertIn('data-load-older-messages', html)
        self.assertIn('delete_for_me', html)

    def test_messages_empty_state_restores_discovery_content(self):
        viewer = {"id": 7, "username": "viewer", "display_name": "Viewer", "profile_photo_url": ""}
        with zapp.app.test_request_context("/messages"):
            html = zapp.render_template(
                "messages.html",
                viewer=viewer,
                target_username=None,
                target_user=None,
                conversations=[],
                all_users=[{
                    "id": 8,
                    "username": "demo",
                    "display_name": "Demo User",
                    "profile_photo_url": "",
                }],
                messages_list=[],
                suggested_communities=[{
                    "name": "Design",
                    "slug": "design",
                    "description": "Creative posts.",
                    "accent_color": "#1D9BF0",
                }],
                message_trending_posts=[],
                message_people=[{
                    "id": 9,
                    "username": "friend",
                    "display_name": "Friend User",
                    "profile_photo_url": "",
                }],
                highlights=[],
                home_reels=[self.sample_reel()],
            )

        self.assertIn('class="chat-unselected"', html)
        self.assertIn('class="message-discovery-grid"', html)
        self.assertIn("Suggested groups", html)
        self.assertIn("People to message", html)
        self.assertIn("Start a new conversation", html)
        self.assertIn("/messages?u=demo", html)
        self.assertIn('data-home-reel-panel', html)

    def test_settings_template_includes_account_delete_form(self):
        fake_user = {
            "id": 7,
            "first_name": "Demo",
            "last_name": "User",
            "nickname": "demo",
            "username": "demo",
            "display_name": "Demo User",
            "profile_photo_url": "",
            "theme_color": "#1D9BF0",
            "avatar_color": "#1D9BF0",
            "bio": "",
            "location": "",
            "website": "",
            "gender": "Male",
            "birthday": "",
        }
        with zapp.app.test_request_context("/settings"):
            html = zapp.render_template("settings.html", viewer=fake_user)

        self.assertIn('/delete_account', html)
        self.assertIn('name="confirm_username"', html)
        self.assertIn('name="current_password"', html)
        self.assertIn("Delete account", html)

    def test_settings_template_can_render_shared_right_rail(self):
        fake_user = {
            "id": 7,
            "first_name": "Demo",
            "last_name": "User",
            "nickname": "demo",
            "username": "demo",
            "display_name": "Demo User",
            "profile_photo_url": "",
            "theme_color": "#1D9BF0",
            "avatar_color": "#1D9BF0",
            "bio": "",
            "location": "",
            "website": "",
            "gender": "Male",
            "birthday": "",
        }
        with zapp.app.test_request_context("/settings"):
            html = zapp.render_template("settings.html", viewer=fake_user, highlights=[], home_reels=[self.sample_reel()])

        self.assertIn('data-home-reel-panel', html)
        self.assertIn('aria-label="Home reels"', html)

    def test_delete_message_removes_participant_message(self):
        class Result:
            def __init__(self, data=None):
                self.data = data or []

        class FakeTable:
            def __init__(self, db, name):
                self.db = db
                self.name = name
                self.action = None
                self.values = None
                self.filters = []

            def select(self, *_args, **_kwargs):
                self.action = "select"
                return self

            def update(self, values):
                self.action = "update"
                self.values = values
                return self

            def delete(self):
                self.action = "delete"
                return self

            def eq(self, key, value):
                self.filters.append((key, value))
                return self

            def execute(self):
                self.db.calls.append((self.name, self.action, self.values, tuple(self.filters)))
                if self.name == "messages" and self.action == "select":
                    return Result([{"id": 42, "sender_id": 7, "receiver_id": 8}])
                return Result()

        class FakeSupabase:
            def __init__(self):
                self.calls = []

            def table(self, name):
                return FakeTable(self, name)

        fake = FakeSupabase()
        with self.client.session_transaction() as sess:
            sess["csrf_token"] = "token"
        with patch.object(zapp, "get_current_user", return_value={"id": 7, "username": "viewer"}), \
             patch.object(zapp, "supabase", fake):
            response = self.client.post("/delete_message", data={
                "csrf_token": "token",
                "message_id": "42",
                "redirect": "/messages?u=demo"
            })

        self.assertEqual(response.status_code, 302)
        self.assertIn(("messages", "update", {
            "content": "This message was deleted",
            "deleted_for_everyone": True,
            "attachment_url": None,
            "attachment_type": None,
            "attachment_name": None
        }, (("id", 42),)), fake.calls)

    def test_delete_message_removes_private_attachment_file(self):
        class Result:
            def __init__(self, data=None):
                self.data = data or []

        class FakeTable:
            def __init__(self, db, name):
                self.db = db
                self.name = name
                self.action = None
                self.values = None
                self.filters = []

            def select(self, *_args, **_kwargs):
                self.action = "select"
                return self

            def update(self, values):
                self.action = "update"
                self.values = values
                return self

            def eq(self, key, value):
                self.filters.append((key, value))
                return self

            def execute(self):
                if self.name == "messages" and self.action == "select":
                    return Result([{
                        "id": 42,
                        "sender_id": 7,
                        "receiver_id": 8,
                        "created_at": datetime.now(timezone.utc).isoformat(),
                        "attachment_url": "/attachment/42",
                        "attachment_name": "Report.pdf",
                    }])
                self.db.calls.append((self.name, self.action, self.values, tuple(self.filters)))
                return Result()

        class FakeSupabase:
            def __init__(self):
                self.calls = []

            def table(self, name):
                return FakeTable(self, name)

        fake = FakeSupabase()
        with tempfile.TemporaryDirectory() as tmpdir:
            upload_dir = os.path.join(tmpdir, "uploads", "attachments")
            os.makedirs(upload_dir, exist_ok=True)
            attachment_path = os.path.join(upload_dir, "42.pdf")
            with open(attachment_path, "wb") as attachment_file:
                attachment_file.write(b"%PDF-1.4")

            with self.client.session_transaction() as sess:
                sess["csrf_token"] = "token"
            with patch.object(zapp.app, "root_path", tmpdir), \
                 patch.object(zapp, "get_current_user", return_value={"id": 7, "username": "viewer"}), \
                 patch.object(zapp, "supabase", fake):
                response = self.client.post("/delete_message", data={
                    "csrf_token": "token",
                    "message_id": "42",
                    "delete_type": "everyone",
                    "redirect": "/messages?u=demo",
                })

            self.assertEqual(response.status_code, 302)
            self.assertFalse(os.path.exists(attachment_path))
            self.assertIn(("messages", "update", {
                "content": "This message was deleted",
                "deleted_for_everyone": True,
                "attachment_url": None,
                "attachment_type": None,
                "attachment_name": None
            }, (("id", 42),)), fake.calls)

    def test_delete_message_rejects_non_participant(self):
        class Result:
            def __init__(self, data=None):
                self.data = data or []

        class FakeTable:
            def __init__(self, db, name):
                self.db = db
                self.name = name
                self.action = None
                self.filters = []

            def select(self, *_args, **_kwargs):
                self.action = "select"
                return self

            def update(self, _values):
                self.action = "update"
                return self

            def delete(self):
                self.action = "delete"
                return self

            def eq(self, key, value):
                self.filters.append((key, value))
                return self

            def execute(self):
                self.db.calls.append((self.name, self.action, tuple(self.filters)))
                if self.name == "messages" and self.action == "select":
                    return Result([{"id": 42, "sender_id": 1, "receiver_id": 2}])
                return Result()

        class FakeSupabase:
            def __init__(self):
                self.calls = []

            def table(self, name):
                return FakeTable(self, name)

        fake = FakeSupabase()
        with self.client.session_transaction() as sess:
            sess["csrf_token"] = "token"
        with patch.object(zapp, "get_current_user", return_value={"id": 7, "username": "viewer"}), \
             patch.object(zapp, "supabase", fake):
            response = self.client.post("/delete_message", data={
                "csrf_token": "token",
                "message_id": "42",
                "redirect": "/messages?u=demo"
            })

        self.assertEqual(response.status_code, 302)
        self.assertNotIn(("messages", "delete", (("id", 42),)), fake.calls)

    def test_download_attachment_requires_participant_and_serves_private_file(self):
        class Result:
            def __init__(self, data=None):
                self.data = data or []

        class FakeTable:
            def __init__(self, row):
                self.row = row

            def select(self, *_args, **_kwargs):
                return self

            def eq(self, *_args, **_kwargs):
                return self

            def execute(self):
                return Result([self.row])

        row = {
            "id": 91,
            "sender_id": 7,
            "receiver_id": 8,
            "attachment_url": "/attachment/91",
            "attachment_name": "Report.pdf",
            "deleted_for_everyone": False,
            "deleted_by_sender": False,
            "deleted_by_receiver": False,
        }

        with tempfile.TemporaryDirectory() as tmpdir:
            upload_dir = os.path.join(tmpdir, "uploads", "attachments")
            os.makedirs(upload_dir, exist_ok=True)
            with open(os.path.join(upload_dir, "91.pdf"), "wb") as attachment_file:
                attachment_file.write(b"%PDF-1.4")

            with patch.object(zapp.app, "root_path", tmpdir), \
                 patch.object(zapp, "supabase", SimpleNamespace(table=lambda _name: FakeTable(row))), \
                 patch.object(zapp, "get_current_user", return_value={"id": 7, "username": "sender"}):
                allowed = self.client.get("/attachment/91")
                allowed_data = allowed.get_data()
                allowed.close()

            with patch.object(zapp.app, "root_path", tmpdir), \
                 patch.object(zapp, "supabase", SimpleNamespace(table=lambda _name: FakeTable(row))), \
                 patch.object(zapp, "get_current_user", return_value={"id": 9, "username": "stranger"}):
                denied = self.client.get("/attachment/91")

        self.assertEqual(allowed.status_code, 200)
        self.assertEqual(allowed_data, b"%PDF-1.4")
        self.assertEqual(denied.status_code, 403)

    def test_download_attachment_streams_supabase_private_file(self):
        class Result:
            def __init__(self, data=None):
                self.data = data or []

        class FakeTable:
            def select(self, *_args, **_kwargs):
                return self

            def eq(self, *_args, **_kwargs):
                return self

            def execute(self):
                return Result([{
                    "id": 91,
                    "sender_id": 7,
                    "receiver_id": 8,
                    "attachment_url": "/attachment/91",
                    "attachment_name": "Report.pdf",
                    "deleted_for_everyone": False,
                    "deleted_by_sender": False,
                    "deleted_by_receiver": False,
                }])

        class FakeBucket:
            def __init__(self):
                self.downloads = []

            def download(self, path):
                self.downloads.append(path)
                return b"%PDF-1.4"

        class FakeStorage:
            def __init__(self, bucket):
                self.bucket = bucket

            def from_(self, name):
                self.selected = name
                return self.bucket

        bucket = FakeBucket()
        fake_supabase = SimpleNamespace(
            table=lambda _name: FakeTable(),
            storage=FakeStorage(bucket),
        )

        with patch.dict(zapp.app.config, {"TESTING": False}), \
             patch.object(zapp, "supabase", fake_supabase), \
             patch.object(zapp, "get_current_user", return_value={"id": 7, "username": "sender"}):
            response = self.client.get("/attachment/91")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, b"%PDF-1.4")
        self.assertEqual(bucket.downloads, [zapp.attachment_storage_path("91.pdf")])

    def test_delete_post_updates_only_owner_with_timezone_timestamp(self):
        class Result:
            def __init__(self, data=None):
                self.data = data or []

        class FakeTable:
            def __init__(self, db, name):
                self.db = db
                self.name = name
                self.action = None
                self.values = None
                self.filters = []

            def select(self, *_args, **_kwargs):
                self.action = "select"
                return self

            def update(self, values):
                self.action = "update"
                self.values = values
                return self

            def eq(self, key, value):
                self.filters.append((key, value))
                return self

            def execute(self):
                if self.name == "posts" and self.action == "select":
                    return Result([self.db.post_row])
                if self.name == "posts" and self.action == "update":
                    self.db.updates.append((self.values, tuple(self.filters)))
                return Result()

        class FakeSupabase:
            def __init__(self, post_row):
                self.post_row = post_row
                self.updates = []

            def table(self, name):
                return FakeTable(self, name)

        viewer = {"id": 7, "username": "viewer"}
        token = self.csrf()

        non_owner = FakeSupabase({"id": 42, "user_id": 8})
        with patch.object(zapp, "get_current_user", return_value=viewer), \
             patch.object(zapp, "supabase", non_owner):
            response = self.client.post("/delete_post", data={"csrf_token": token, "post_id": "42"})
        self.assertEqual(response.status_code, 302)
        self.assertEqual(non_owner.updates, [])

        owned = FakeSupabase({"id": 42, "user_id": 7})
        with patch.object(zapp, "get_current_user", return_value=viewer), \
             patch.object(zapp, "supabase", owned):
            response = self.client.post("/delete_post", data={"csrf_token": token, "post_id": "42"})

        self.assertEqual(response.status_code, 302)
        self.assertEqual(len(owned.updates), 1)
        deleted_at = owned.updates[0][0]["deleted_at"]
        self.assertIsNotNone(datetime.fromisoformat(deleted_at).tzinfo)
        self.assertEqual(owned.updates[0][1], (("id", 42),))

    def test_delete_reel_updates_only_owner_with_timezone_timestamp(self):
        class Result:
            def __init__(self, data=None):
                self.data = data or []

        class FakeTable:
            def __init__(self, db, name):
                self.db = db
                self.name = name
                self.action = None
                self.values = None
                self.filters = []

            def select(self, *_args, **_kwargs):
                self.action = "select"
                return self

            def update(self, values):
                self.action = "update"
                self.values = values
                return self

            def eq(self, key, value):
                self.filters.append((key, value))
                return self

            def is_(self, key, value):
                self.filters.append((key, value))
                return self

            def execute(self):
                if self.name == "reels" and self.action == "select":
                    return Result([self.db.reel_row])
                if self.name == "reels" and self.action == "update":
                    self.db.updates.append((self.values, tuple(self.filters)))
                return Result()

        class FakeSupabase:
            def __init__(self, reel_row):
                self.reel_row = reel_row
                self.updates = []

            def table(self, name):
                return FakeTable(self, name)

        viewer = {"id": 7, "username": "viewer"}
        token = self.csrf()

        non_owner = FakeSupabase({"id": 42, "user_id": 8})
        with patch.object(zapp, "get_current_user", return_value=viewer), \
             patch.object(zapp, "supabase", non_owner):
            response = self.client.post("/reels/42/delete", data={"csrf_token": token})
        self.assertEqual(response.status_code, 302)
        self.assertEqual(non_owner.updates, [])

        owned = FakeSupabase({"id": 42, "user_id": 7})
        with patch.object(zapp, "get_current_user", return_value=viewer), \
             patch.object(zapp, "supabase", owned):
            response = self.client.post("/reels/42/delete", data={"csrf_token": token})

        self.assertEqual(response.status_code, 302)
        self.assertEqual(len(owned.updates), 1)
        self.assertEqual(owned.updates[0][0]["status"], "deleted")
        deleted_at = owned.updates[0][0]["deleted_at"]
        self.assertIsNotNone(datetime.fromisoformat(deleted_at).tzinfo)
        self.assertEqual(owned.updates[0][1], (("id", 42),))

    def test_delete_account_checks_password_and_clears_session(self):
        class Result:
            data = []

        class FakeTable:
            def __init__(self, db, name):
                self.db = db
                self.name = name
                self.action = None
                self.filters = []

            def delete(self):
                self.action = "delete"
                return self

            def eq(self, key, value):
                self.filters.append((key, value))
                return self

            def execute(self):
                self.db.calls.append((self.name, self.action, tuple(self.filters)))
                return Result()

        class FakeSupabase:
            def __init__(self):
                self.calls = []

            def table(self, name):
                return FakeTable(self, name)

        fake = FakeSupabase()
        with self.client.session_transaction() as sess:
            sess["csrf_token"] = "token"
            sess["user_id"] = 7
        viewer = {"id": 7, "username": "demo", "password_hash": "$2b$12$placeholderplaceholderplaceholderplaceholderplace"}
        with patch.object(zapp, "get_current_user", return_value=viewer), \
             patch.object(zapp, "supabase", fake), \
             patch.object(zapp.bcrypt, "checkpw", return_value=True):
            response = self.client.post("/delete_account", data={
                "csrf_token": "token",
                "confirm_username": "demo",
                "current_password": "password123"
            })

        self.assertEqual(response.status_code, 302)
        self.assertIn(("users", "delete", (("id", 7),)), fake.calls)
        with self.client.session_transaction() as sess:
            self.assertNotIn("user_id", sess)

    def test_website_normalization_accepts_http_only(self):
        self.assertEqual(zapp.normalize_website("https://example.com"), "https://example.com")
        self.assertEqual(zapp.normalize_website("ftp://example.com"), "")

    def test_image_extension_validation(self):
        self.assertTrue(zapp.allowed_image_file("photo.webp"))
        self.assertFalse(zapp.allowed_image_file("photo.exe"))

    def test_default_storage_bucket_matches_project_setup(self):
        self.assertEqual(zapp.STORAGE_BUCKET, "lvl-media")

    def test_profile_image_upload_ensures_storage_bucket(self):
        class FakeBucket:
            def __init__(self):
                self.uploaded = None

            def upload(self, path, payload, file_options=None):
                self.uploaded = (path, payload, file_options)

            def get_public_url(self, path):
                return f"https://cdn.example.com/{path}"

        class FakeStorage:
            def __init__(self):
                self.bucket = FakeBucket()
                self.checked = []

            def get_bucket(self, name):
                self.checked.append(name)
                return {"id": name}

            def from_(self, name):
                return self.bucket

        class FakeSupabase:
            def __init__(self):
                self.storage = FakeStorage()

        fake = FakeSupabase()
        upload = FileStorage(
            stream=io.BytesIO(b"avatar-bytes"),
            filename="avatar.png",
            content_type="image/png",
        )

        with patch.object(zapp, "supabase", fake):
            url = zapp.upload_image_to_storage(upload, "avatars/7")

        self.assertTrue(url.startswith("https://cdn.example.com/avatars/7/"))
        self.assertEqual(fake.storage.checked, [zapp.STORAGE_BUCKET])
        self.assertEqual(fake.storage.bucket.uploaded[2]["content-type"], "image/png")

    def test_image_upload_falls_back_to_local_storage_when_bucket_unavailable(self):
        class BrokenStorage:
            def get_bucket(self, name):
                raise RuntimeError("Bucket not found")

            def create_bucket(self, name, options=None):
                raise RuntimeError("Not allowed")

        class FakeSupabase:
            def __init__(self):
                self.storage = BrokenStorage()

        upload = FileStorage(
            stream=io.BytesIO(b"post-image-bytes"),
            filename="post.png",
            content_type="image/png",
        )
        original_static_folder = zapp.app.static_folder

        with tempfile.TemporaryDirectory() as tmpdir:
            try:
                zapp.app.static_folder = tmpdir
                with zapp.app.test_request_context("/"), \
                     patch.object(zapp, "supabase", FakeSupabase()), \
                     patch.object(zapp, "LOCAL_IMAGE_UPLOAD_FALLBACK", True):
                    url = zapp.upload_image_to_storage(upload, "posts/7")
            finally:
                zapp.app.static_folder = original_static_folder

            self.assertTrue(url.startswith("/static/uploads/posts/7/"))
            stored_path = os.path.join(tmpdir, *url.split("/static/", 1)[1].split("/"))
            self.assertTrue(os.path.exists(stored_path))

    def test_contact_form_validation_and_submission(self):
        res = self.client.get("/contact")
        self.assertEqual(res.status_code, 302)
        self.assertTrue(res.headers['Location'].endswith("/level-guide#contact"))

        class FakeResponse:
            data = []

        class FakeTable:
            def __init__(self):
                self.inserted = []
            def insert(self, payload):
                self.inserted.append(payload)
                return self
            def execute(self):
                return FakeResponse()

        fake_table = FakeTable()
        class FakeSupabase:
            def table(self, name):
                if name == 'contact_messages':
                    return fake_table
                return None

        with patch.object(zapp, "supabase", FakeSupabase()):
            res = self.client.post("/guide/contact", data={
                "csrf_token": self.csrf(),
                "name": "Test User",
                "email": "invalid-email",
                "subject": "General Question",
                "message": "Hello world"
            })
            self.assertEqual(res.status_code, 302)
            self.assertTrue(res.headers['Location'].endswith("/level-guide#contact"))
            self.assertEqual(len(fake_table.inserted), 0)

        with patch.object(zapp, "supabase", FakeSupabase()):
            res = self.client.post("/guide/contact", data={
                "csrf_token": self.csrf(),
                "name": "Test User",
                "email": "test@example.com",
                "subject": "Suggestion",
                "message": "This is a suggestion message"
            })
            self.assertEqual(res.status_code, 302)
            self.assertTrue(res.headers['Location'].endswith("/level-guide#contact"))
            self.assertEqual(len(fake_table.inserted), 1)
            self.assertEqual(fake_table.inserted[0]["subject"], "Suggestion")

    def test_careers_form_requires_login_and_saves_application(self):
        res = self.client.post("/guide/careers", data={
            "csrf_token": self.csrf(),
            "name": "Sina",
            "email": "sina@example.com",
            "position": "Backend Engineer",
            "message": "I can help with backend systems."
        })
        self.assertEqual(res.status_code, 302)
        self.assertTrue(res.headers['Location'].endswith("/auth"))

        user = {"id": 8, "username": "sina", "display_name": "Sina", "email": "sina@example.com"}

        class FakeResponse:
            def __init__(self, data=None):
                self.data = data or []

        class FakeTable:
            def __init__(self, data=None):
                self.data = data or []
                self.inserted = []
                self.filters = []
            def select(self, *args, **kwargs):
                return self
            def eq(self, key, value):
                self.filters.append((key, value))
                return self
            def limit(self, *args, **kwargs):
                return self
            def insert(self, payload):
                self.inserted.append(payload)
                return self
            def execute(self):
                return FakeResponse(self.data)

        positions_table = FakeTable([{"id": "position-1"}])
        applications_table = FakeTable()

        class FakeSupabase:
            def table(self, name):
                if name == 'job_positions':
                    return positions_table
                if name == 'job_applications':
                    return applications_table
                return None

        with self.client.session_transaction() as sess:
            sess['user_id'] = user['id']

        with patch.object(zapp, "get_current_user", return_value=user), \
             patch.object(zapp, "supabase", FakeSupabase()):
            res = self.client.post("/guide/careers", data={
                "csrf_token": self.csrf(),
                "name": "Sina",
                "email": "invalid-email",
                "position": "Backend Engineer",
                "message": "I can help with backend systems."
            })
            self.assertEqual(res.status_code, 302)
            self.assertTrue(res.headers['Location'].endswith("/level-guide#careers"))
            self.assertEqual(applications_table.inserted, [])

            res = self.client.post("/guide/careers", data={
                "csrf_token": self.csrf(),
                "name": "Sina",
                "email": "sina@example.com",
                "position": "Backend Engineer",
                "message": "I can help with backend systems.",
                "cv": (io.BytesIO(b"bad executable"), "resume.exe")
            })
            self.assertEqual(res.status_code, 302)
            self.assertTrue(res.headers['Location'].endswith("/level-guide#careers"))
            self.assertEqual(applications_table.inserted, [])

            res = self.client.post("/guide/careers", data={
                "csrf_token": self.csrf(),
                "name": "Sina",
                "email": "sina@example.com",
                "position": "Backend Engineer",
                "message": "I can help with backend systems."
            })

        self.assertEqual(res.status_code, 302)
        self.assertTrue(res.headers['Location'].endswith("/level-guide#careers"))
        self.assertEqual(positions_table.filters, [("title", "Backend Engineer")])
        self.assertEqual(len(applications_table.inserted), 1)
        self.assertEqual(applications_table.inserted[0]["position_id"], "position-1")
        self.assertEqual(applications_table.inserted[0]["position_title"], "Backend Engineer")
        self.assertIsNone(applications_table.inserted[0]["cv_url"])

    def test_verification_request_cooldown_and_submission(self):
        res = self.client.get("/request_verification")
        self.assertEqual(res.status_code, 302)
        self.assertTrue(res.headers['Location'].endswith("/level-guide#verification"))

        user = {"id": 8, "username": "demo", "display_name": "Demo User", "email": "demo@example.com"}
        
        class FakeResponse:
            def __init__(self, data=None):
                self.data = data or []

        class FakeTable:
            def __init__(self, data=None):
                self.data = data or []
                self.inserted = []
            def select(self, *args, **kwargs):
                return self
            def eq(self, *args, **kwargs):
                return self
            def order(self, *args, **kwargs):
                return self
            def limit(self, *args, **kwargs):
                return self
            def insert(self, payload):
                self.inserted.append(payload)
                return self
            def execute(self):
                return FakeResponse(self.data)

        fake_table_pending = FakeTable([{"status": "Pending", "created_at": "2026-06-01T10:00:00"}])
        class FakeSupabasePending:
            def table(self, name):
                if name == 'verification_requests':
                    return fake_table_pending
                return None

        # Seed session transaction
        with self.client.session_transaction() as sess:
            sess['user_id'] = user['id']

        with patch.object(zapp, "get_current_user", return_value=user), \
             patch.object(zapp, "supabase", FakeSupabasePending()):
            res = self.client.post("/guide/verification", data={
                "csrf_token": self.csrf(),
                "reason": "Verify me please",
                "links": "https://twitter.com/demo"
            })
            self.assertEqual(res.status_code, 302)
            self.assertTrue(res.headers['Location'].endswith("/level-guide#verification"))
            self.assertEqual(len(fake_table_pending.inserted), 0)

        cooldown_time = (datetime.now(timezone.utc) + timedelta(days=5)).isoformat()
        fake_table_cooldown = FakeTable([{"status": "Rejected", "rejection_cooldown_until": cooldown_time}])
        class FakeSupabaseCooldown:
            def table(self, name):
                if name == 'verification_requests':
                    return fake_table_cooldown
                return None

        with patch.object(zapp, "get_current_user", return_value=user), \
             patch.object(zapp, "supabase", FakeSupabaseCooldown()):
            res = self.client.post("/guide/verification", data={
                "csrf_token": self.csrf(),
                "reason": "Verify me please",
                "links": "https://twitter.com/demo"
            })
            self.assertEqual(res.status_code, 302)
            self.assertTrue(res.headers['Location'].endswith("/level-guide#verification"))
            self.assertEqual(len(fake_table_cooldown.inserted), 0)

        fake_table_clean = FakeTable([])
        class FakeSupabaseClean:
            def table(self, name):
                if name == 'verification_requests':
                    return fake_table_clean
                return None

        with patch.object(zapp, "get_current_user", return_value=user), \
             patch.object(zapp, "supabase", FakeSupabaseClean()):
            res = self.client.post("/guide/verification", data={
                "csrf_token": self.csrf(),
                "reason": "Verify me please",
                "links": "https://twitter.com/demo"
            })
            self.assertEqual(res.status_code, 302)
            self.assertTrue(res.headers['Location'].endswith("/level-guide#verification"))
            self.assertEqual(len(fake_table_clean.inserted), 1)
            self.assertEqual(fake_table_clean.inserted[0]["reason"], "Verify me please")


if __name__ == "__main__":
    unittest.main()
