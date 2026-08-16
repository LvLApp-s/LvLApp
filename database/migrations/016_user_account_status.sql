-- Add reversible admin account restriction fields.
-- Run after 015_attachment_storage_bucket.sql.

alter table public.users
  add column if not exists account_status text not null default 'active'
    check (account_status in ('active', 'suspended', 'banned')),
  add column if not exists account_status_reason text not null default '',
  add column if not exists suspended_until timestamptz,
  add column if not exists account_status_updated_at timestamptz,
  add column if not exists account_status_updated_by bigint references public.users(id) on delete set null;

create index if not exists idx_users_account_status
  on public.users(account_status, created_at desc);

create index if not exists idx_users_suspended_until
  on public.users(suspended_until)
  where account_status = 'suspended' and suspended_until is not null;
