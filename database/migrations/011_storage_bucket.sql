-- Storage bucket used by post images, profile photos, reels, message attachments, and CV uploads.
-- The Flask backend writes with a server-side Supabase secret and stores public URLs.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'lvl-media',
  'lvl-media',
  true,
  52428800,
  array[
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'video/mp4',
    'video/webm',
    'video/quicktime',
    'video/x-m4v',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;
