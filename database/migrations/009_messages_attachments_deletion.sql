-- Alter messages table to add attachment support
ALTER TABLE public.messages ADD COLUMN IF NOT EXISTS attachment_url text;
ALTER TABLE public.messages ADD COLUMN IF NOT EXISTS attachment_type text;
ALTER TABLE public.messages ADD COLUMN IF NOT EXISTS attachment_name text;

-- Alter messages table to add message deletion support (delete for me / everyone)
ALTER TABLE public.messages ADD COLUMN IF NOT EXISTS deleted_for_everyone boolean DEFAULT false;
ALTER TABLE public.messages ADD COLUMN IF NOT EXISTS deleted_by_sender boolean DEFAULT false;
ALTER TABLE public.messages ADD COLUMN IF NOT EXISTS deleted_by_receiver boolean DEFAULT false;
