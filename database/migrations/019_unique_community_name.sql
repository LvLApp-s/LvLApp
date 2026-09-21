-- ============================================================
-- Migration 019: one community per name
--
-- RUN THE DUPLICATE CHECK BELOW FIRST. Creating this index fails if two
-- communities already share a name (ignoring case), and the error names the
-- clash rather than doing anything destructive.
--
--   select lower(name) as clashing_name, count(*) as how_many,
--          array_agg(id order by created_at) as community_ids
--   from public.communities
--   group by lower(name)
--   having count(*) > 1;
--
-- If that returns rows, rename the newer community (or delete it if it is
-- empty) before running the rest of this file.
--
-- Why an index and not only the application check: app.py compares the name
-- before inserting, but two people can pass that check in the same moment,
-- and until now renaming a community skipped the check entirely. The index
-- is the one place that cannot be raced or bypassed.
-- ============================================================

create unique index if not exists idx_communities_name_lower
  on public.communities (lower(name));

comment on index public.idx_communities_name_lower is
  'Community names are unique regardless of case; see app.community_name_is_taken.';
