-- Migration: 021_job_application_portfolio_link.sql
-- Description: Replace the uploaded CV with a link the applicant supplies.
--
-- The careers form took a CV file and wrote it to static/uploads/cvs/ with
-- cv_file.save(). The serverless filesystem is read-only, so that call raised,
-- and because it ran before the insert and had no handler around it, the whole
-- application was lost: the candidate saw a 500 and nothing reached this table.
--
-- The form asks for a LinkedIn or portfolio URL instead. Nothing is written to
-- disk, so the application always lands here.
--
-- cv_url is kept as it is. Rows created before this migration may hold a
-- filename whose file no longer exists -- the admin dashboard shows those as
-- unavailable rather than linking to a 404.

ALTER TABLE job_applications
ADD COLUMN IF NOT EXISTS portfolio_url text;

COMMENT ON COLUMN job_applications.portfolio_url IS
  'LinkedIn, GitHub or portfolio URL supplied by the applicant.';

COMMENT ON COLUMN job_applications.cv_url IS
  'Legacy: filename of an uploaded CV. No longer written; see portfolio_url.';
