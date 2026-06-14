-- ============================================================
-- Storage bucket for vehicle images.
-- Path convention: {showroom_id}/{vehicle_id}/{uuid}.{ext}
-- The first folder segment carries the showroom_id; policies use
-- this to check ownership against public.showrooms.
-- ============================================================

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'vehicle-images',
  'vehicle-images',
  true,
  5 * 1024 * 1024, -- 5 MB per file
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif']
)
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- Public read so img tags work without signed URLs.
create policy "vehicle_images_public_read"
on storage.objects for select
to public
using (bucket_id = 'vehicle-images');

-- Vendor uploads: showroom_id (first folder) must belong to the caller.
create policy "vehicle_images_owner_insert"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'vehicle-images'
  and exists (
    select 1 from public.showrooms s
    where s.id::text = (storage.foldername(name))[1]
      and s.owner_user_id = auth.uid()
  )
);

create policy "vehicle_images_owner_update"
on storage.objects for update
to authenticated
using (
  bucket_id = 'vehicle-images'
  and exists (
    select 1 from public.showrooms s
    where s.id::text = (storage.foldername(name))[1]
      and s.owner_user_id = auth.uid()
  )
);

create policy "vehicle_images_owner_delete"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'vehicle-images'
  and exists (
    select 1 from public.showrooms s
    where s.id::text = (storage.foldername(name))[1]
      and s.owner_user_id = auth.uid()
  )
);
