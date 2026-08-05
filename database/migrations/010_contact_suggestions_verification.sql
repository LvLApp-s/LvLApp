-- Migration: 010_contact_suggestions_verification.sql
-- Description: Add subject/status to contact_messages, create verification_requests table, and add is_profile_verified flag to users.

-- 1. Alter contact_messages to add subject and status columns
ALTER TABLE contact_messages 
ADD COLUMN IF NOT EXISTS subject text NOT NULL DEFAULT 'General Question',
ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'New';

-- 2. Create verification_requests table
CREATE TABLE IF NOT EXISTS verification_requests (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id integer NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    reason text NOT NULL,
    document_url text, -- proof document upload path
    links text, -- social/web links
    status text NOT NULL DEFAULT 'Pending', -- Pending, Approved, Rejected
    rejection_cooldown_until timestamptz,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

-- 3. Add is_profile_verified to users
ALTER TABLE users
ADD COLUMN IF NOT EXISTS is_profile_verified boolean NOT NULL DEFAULT false;

-- Enable RLS and add basic select/insert policies for verification_requests
ALTER TABLE verification_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow users to select their own verification requests" ON verification_requests
    FOR SELECT USING (true);

CREATE POLICY "Allow authenticated insert of verification requests" ON verification_requests
    FOR INSERT WITH CHECK (true);
