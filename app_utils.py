import re
from datetime import date, datetime


MIN_AGE = 16
MAX_AGE = 120
MIN_PASSWORD_LENGTH = 8

# Bumped whenever the published Terms & Conditions text changes so that
# `users.terms_version` records which revision an account accepted.
TERMS_VERSION = '2026-09-19'

USERNAME_MIN_LENGTH = 3
USERNAME_MAX_LENGTH = 24
USERNAME_PATTERN = re.compile(r'^[a-z0-9_]{%d,%d}$' % (USERNAME_MIN_LENGTH, USERNAME_MAX_LENGTH))
USERNAME_FORMAT_ERROR = (
    "Username must be 3-24 characters: letters, numbers, or underscores only."
)


def normalize_username(value):
    return (value or '').strip().lower()


def _replace_year(value, year):
    try:
        return value.replace(year=year)
    except ValueError:
        return value.replace(year=year, day=28)


def birthday_date_limits(today=None):
    today = today or date.today()
    return {
        'min': _replace_year(today, today.year - MAX_AGE),
        'max': _replace_year(today, today.year - MIN_AGE),
    }


def validate_birthday(value, required=False, today=None):
    value = (value or '').strip()
    if not value:
        if required:
            return None, "Birthday is required."
        return None, None

    try:
        birthday = datetime.strptime(value, '%Y-%m-%d').date()
    except ValueError:
        return None, "Birthday must use a real date in YYYY-MM-DD format."

    today = today or date.today()
    limits = birthday_date_limits(today)
    if birthday > today:
        return None, "Birthday cannot be in the future."
    if birthday > limits['max']:
        return None, f"You must be at least {MIN_AGE} years old to use LvL."
    if birthday < limits['min']:
        return None, "Birthday must be a realistic date."
    return birthday, None


def profile_banner_for_level(level):
    level = max(1, int(level or 1))
    if level >= 50:
        return {
            'class': 'level-7',
            'label': 'Icon Legend',
            'description': 'A prestige banner for Level 50 accounts and long-term LvL icons.',
        }
    if level >= 30:
        return {
            'class': 'level-6',
            'label': 'Mythic Orbit',
            'description': 'A stronger high-rank banner for mythic LvL status.',
        }
    if level >= 20:
        return {
            'class': 'level-5',
            'label': 'Mythic Circuit',
            'description': 'A high-rank banner for long-running LvL legends.',
        }
    if level >= 10:
        return {
            'class': 'level-4',
            'label': 'Hero Pulse',
            'description': 'A brighter profile stage for proven community energy.',
        }
    if level >= 5:
        return {
            'class': 'level-3',
            'label': 'Rising Charge',
            'description': 'A stronger banner for active members gaining momentum.',
        }
    if level >= 2:
        return {
            'class': 'level-2',
            'label': 'Neon Climb',
            'description': 'Your first upgraded LvL banner.',
        }
    return {
        'class': 'level-1',
        'label': 'First Step',
        'description': 'The starter banner for new LvL profiles.',
    }


def validate_username_format(value):
    """Return (normalized_username, error). Storage is always lowercase so
    `Berkan`, `berkan` and `BERKAN` resolve to the same identity."""
    normalized = normalize_username(value)
    if not normalized:
        return None, "Username is required."
    if not USERNAME_PATTERN.match(normalized):
        return None, USERNAME_FORMAT_ERROR
    return normalized, None


def validate_password_pair(password, confirmation):
    """Shared password rules for registration and password reset."""
    password = password or ''
    confirmation = confirmation or ''
    if len(password) < MIN_PASSWORD_LENGTH:
        return f"Password must be at least {MIN_PASSWORD_LENGTH} characters."
    if not confirmation:
        return "Confirm your password."
    if password != confirmation:
        return "Passwords do not match."
    return None


def terms_acceptance_error(accepted):
    """Registration is refused unless the Terms checkbox was actively ticked."""
    if accepted in (True, '1', 'on', 'true', 'yes'):
        return None
    return "You must accept the Terms & Conditions to create an account."
