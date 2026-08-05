-- Migration: 008_careers_schema.sql
-- Description: Create tables for open positions, careers applications, and contact messages.

-- Job Positions Table
CREATE TABLE IF NOT EXISTS job_positions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    title text NOT NULL,
    department text NOT NULL,
    type text NOT NULL DEFAULT 'Full-time', -- Full-time, Internship, Part-time
    description text NOT NULL,
    is_active boolean NOT NULL DEFAULT true,
    created_at timestamptz NOT NULL DEFAULT now()
);

-- Job Applications Table
CREATE TABLE IF NOT EXISTS job_applications (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    position_id uuid REFERENCES job_positions(id) ON DELETE SET NULL,
    position_title text NOT NULL, -- Cache the title in case the position is deleted
    name text NOT NULL,
    email text NOT NULL,
    message text NOT NULL,
    cv_url text, -- Path or URL to the uploaded CV file
    created_at timestamptz NOT NULL DEFAULT now()
);

-- Contact Messages Table
CREATE TABLE IF NOT EXISTS contact_messages (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    email text NOT NULL,
    message text NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS and add basic select/insert policies (or keep simple for demo/development)
ALTER TABLE job_positions ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Allow anonymous or authenticated select for active positions
CREATE POLICY "Allow public select of active positions" ON job_positions
    FOR SELECT USING (is_active = true);

-- Allow anonymous or authenticated insert for applications and messages
CREATE POLICY "Allow public insert of applications" ON job_applications
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public insert of contact messages" ON contact_messages
    FOR INSERT WITH CHECK (true);

-- Allow admins (using service_role or target policies) full access. 
-- In development, if RLS is enabled without admin policies, use service_role client.
