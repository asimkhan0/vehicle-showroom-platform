-- ============================================================
-- Storage policy fix.
-- The previous policies' subquery against public.showrooms is
-- subject to that table's RLS when evaluated inside a storage
-- policy, which can fail unpredictably. Wrap the ownership
-- check in a SECURITY DEFINER function so it runs with table
-- owner privileges and is impervious to caller's RLS view.
-- ============================================================

create or replace function public.user_owns_showroom(showroom_id text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.showrooms
    where id::text = showroom_id
      and owner_user_id = auth.uid()
  );
$$;

grant execute on function public.user_owns_showroom(text) to authenticated;

drop policy if exists "vehicle_images_owner_insert" on storage.objects;
drop policy if exists "vehicle_images_owner_update" on storage.objects;
drop policy if exists "vehicle_images_owner_delete" on storage.objects;

create policy "vehicle_images_owner_insert"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'vehicle-images'
  and public.user_owns_showroom((storage.foldername(name))[1])
);

create policy "vehicle_images_owner_update"
on storage.objects for update
to authenticated
using (
  bucket_id = 'vehicle-images'
  and public.user_owns_showroom((storage.foldername(name))[1])
)
with check (
  bucket_id = 'vehicle-images'
  and public.user_owns_showroom((storage.foldername(name))[1])
);

create policy "vehicle_images_owner_delete"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'vehicle-images'
  and public.user_owns_showroom((storage.foldername(name))[1])
);
