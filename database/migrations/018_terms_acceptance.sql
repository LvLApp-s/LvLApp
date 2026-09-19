-- Record which revision of the Terms & Conditions an account accepted.
-- Run after 017_reel_bookmarks.sql.
--
-- Idempotent and backwards compatible: existing accounts keep working with
-- both columns left null, which simply means "registered before acceptance
-- was recorded". Nothing is required, so no existing row is invalidated.

alter table public.users
  add column if not exists terms_accepted_at timestamptz,
  add column if not exists terms_version text;

comment on column public.users.terms_accepted_at is
  'When the account actively accepted the Terms & Conditions at registration.';
comment on column public.users.terms_version is
  'Terms revision identifier accepted at registration (app_utils.TERMS_VERSION).';

-- Supports admin queries for accounts still on an older terms revision.
create index if not exists idx_users_terms_version
  on public.users(terms_version)
  where terms_version is not null;

-- Username uniqueness already exists in the base schema; these indexes make
-- the guarantee explicit and case-insensitive at the database level, which is
-- the final authority behind the availability endpoint. Usernames are already
-- normalised to lowercase on write, so this adds protection without
-- rewriting any existing row.
create unique index if not exists idx_users_username_lower_unique
  on public.users (lower(username));

create unique index if not exists idx_users_nickname_lower_unique
  on public.users (lower(nickname));
