-- Private Storage bucket used by message/file attachments.
-- The Flask backend writes with the server-side Supabase secret and streams downloads after authorization checks.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'lvl-attachments',
  'lvl-attachments',
  false,
  15728640,
  array[
    'application/msword',
    'application/pdf',
    'application/vnd.ms-excel',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'audio/mp4',
    'audio/mpeg',
    'audio/ogg',
    'audio/wav',
    'image/bmp',
    'image/gif',
    'image/jpeg',
    'image/png',
    'image/webp',
    'text/plain',
    'video/mp4',
    'video/quicktime',
    'video/webm',
    'video/x-m4v'
  ]
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;
