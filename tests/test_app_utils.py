import unittest
from datetime import date

from app_utils import (
    MIN_AGE,
    birthday_date_limits,
    normalize_username,
    profile_banner_for_level,
    terms_acceptance_error,
    validate_birthday,
    validate_password_pair,
    validate_username_format,
)


class AppUtilsTests(unittest.TestCase):
    def test_normalize_username_lowercases_and_trims(self):
        self.assertEqual(normalize_username("  EfeUser  "), "efeuser")

    def test_validate_birthday_rejects_future_and_unrealistic_dates(self):
        today = date(2026, 5, 14)

        self.assertEqual(validate_birthday("3333-02-02", today=today)[1], "Birthday cannot be in the future.")
        self.assertEqual(validate_birthday("1890-01-01", today=today)[1], "Birthday must be a realistic date.")
        self.assertEqual(validate_birthday("not-a-date", today=today)[1], "Birthday must use a real date in YYYY-MM-DD format.")

    def test_validate_birthday_enforces_minimum_age(self):
        # One day short of 16 on the day of the check.
        birthday, error = validate_birthday("2010-05-15", today=date(2026, 5, 14))

        self.assertIsNone(birthday)
        self.assertEqual(error, "You must be at least 16 years old to use LvL.")

    def test_validate_birthday_accepts_exactly_sixteen(self):
        birthday, error = validate_birthday("2010-05-14", today=date(2026, 5, 14))

        self.assertEqual(birthday.isoformat(), "2010-05-14")
        self.assertIsNone(error)

    def test_validate_birthday_accepts_realistic_dates(self):
        birthday, error = validate_birthday("2001-08-20", today=date(2026, 5, 14))

        self.assertEqual(birthday.isoformat(), "2001-08-20")
        self.assertIsNone(error)

    def test_birthday_limits_are_relative_to_today(self):
        limits = birthday_date_limits(date(2026, 5, 14))

        self.assertEqual(limits['min'].isoformat(), "1906-05-14")
        self.assertEqual(limits['max'].isoformat(), "2010-05-14")

    def test_profile_banner_level_tiers(self):
        self.assertEqual(profile_banner_for_level(1)['class'], "level-1")
        self.assertEqual(profile_banner_for_level(2)['class'], "level-2")
        self.assertEqual(profile_banner_for_level(5)['class'], "level-3")
        self.assertEqual(profile_banner_for_level(10)['class'], "level-4")
        self.assertEqual(profile_banner_for_level(20)['class'], "level-5")
        self.assertEqual(profile_banner_for_level(30)['class'], "level-6")
        self.assertEqual(profile_banner_for_level(50)['class'], "level-7")


class RegistrationValidatorTests(unittest.TestCase):
    def test_minimum_age_is_sixteen(self):
        self.assertEqual(MIN_AGE, 16)

    def test_username_format_normalises_case(self):
        self.assertEqual(validate_username_format("Berkan"), ("berkan", None))
        self.assertEqual(validate_username_format("BERKAN"), ("berkan", None))
        self.assertEqual(validate_username_format("  berkan  "), ("berkan", None))

    def test_username_format_rejects_bad_input(self):
        self.assertIsNone(validate_username_format("ab")[0])
        self.assertIsNone(validate_username_format("has space")[0])
        self.assertIsNone(validate_username_format("a" * 25)[0])
        self.assertIsNone(validate_username_format("")[0])
        self.assertEqual(validate_username_format("")[1], "Username is required.")

    def test_password_pair_requires_match_and_length(self):
        self.assertEqual(validate_password_pair("short", "short"), "Password must be at least 8 characters.")
        self.assertEqual(validate_password_pair("longenough", ""), "Confirm your password.")
        self.assertEqual(validate_password_pair("longenough", "different1"), "Passwords do not match.")
        self.assertIsNone(validate_password_pair("longenough", "longenough"))

    def test_terms_must_be_actively_accepted(self):
        self.assertIsNone(terms_acceptance_error("1"))
        self.assertIsNone(terms_acceptance_error("on"))
        self.assertIsNotNone(terms_acceptance_error(None))
        self.assertIsNotNone(terms_acceptance_error(""))
        self.assertIsNotNone(terms_acceptance_error("0"))


if __name__ == "__main__":
    unittest.main()
