"""An admin action must read the kind of id its table actually uses.

Four of them read a uuid through parse_positive_id, which takes integers
only. It returned None, the handler's `if id and supabase` was false, and
opening or closing a job posting, deleting one, marking a suggestion reviewed
and approving a verification request each redirected having done nothing --
no error, no log line, no change.
"""
import inspect
import re
import unittest
from pathlib import Path

import app as zapp

ROOT = Path(zapp.__file__).resolve().parent

# Which parser each action's id must go through, from the migrations that
# create the tables: uuid primary keys in 008 and 010, bigint everywhere else.
UUID_ACTIONS = {'toggle_position', 'delete_position',
                'update_suggestion_status', 'respond_verification'}
INT_ACTIONS = {'dismiss_report', 'delete_post_global', 'delete_comment_global',
               'delete_reel_global', 'delete_reel_comment_global',
               'delete_community_global'}


def handler_source():
    source = inspect.getsource(zapp.admin_dashboard)
    return source


class AdminIdTypeTests(unittest.TestCase):
    def setUp(self):
        self.source = handler_source()

    def parser_for(self, action):
        block = re.search(
            r"action == '" + re.escape(action) + r"':\n(.*?)=\s*(parse_\w+)\(",
            self.source, re.S)
        self.assertIsNotNone(block, f"no handler for {action}")
        return block.group(2)

    def test_uuid_keyed_tables_are_read_as_uuids(self):
        for action in sorted(UUID_ACTIONS):
            with self.subTest(action=action):
                self.assertEqual(self.parser_for(action), 'parse_uuid_id')

    def test_bigint_keyed_tables_are_read_as_integers(self):
        for action in sorted(INT_ACTIONS):
            with self.subTest(action=action):
                self.assertEqual(self.parser_for(action), 'parse_positive_id')

    def test_parse_positive_id_still_refuses_a_uuid(self):
        self.assertIsNone(zapp.parse_positive_id(
            '11111111-1111-1111-1111-111111111111'))

    def test_parse_uuid_id_accepts_one_and_refuses_an_integer(self):
        self.assertEqual(
            zapp.parse_uuid_id('11111111-1111-1111-1111-111111111111'),
            '11111111-1111-1111-1111-111111111111')
        self.assertIsNone(zapp.parse_uuid_id('42'))
        self.assertIsNone(zapp.parse_uuid_id("'; drop table users;--"))

    def test_the_migrations_still_say_which_tables_are_uuid_keyed(self):
        """If one of these ever moves to bigint, the lists above are wrong."""
        sql = '\n'.join(
            path.read_text(encoding='utf-8')
            for path in sorted((ROOT / 'database' / 'migrations').glob('*.sql')))
        for table in ('job_positions', 'contact_messages', 'verification_requests'):
            with self.subTest(table=table):
                created = re.search(
                    r'create table if not exists (?:public\.)?' + table
                    + r'\s*\((.*?)\n\);', sql, re.S | re.I)
                self.assertIsNotNone(created, f"{table} is not created anywhere")
                self.assertRegex(created.group(1), r'id\s+uuid')


if __name__ == '__main__':
    unittest.main()
