-- Storage RLS policies for avatars bucket

-- Allow any authenticated user to view avatars (public access)
create policy "Anyone can view avatars"
on storage.objects for select
using (bucket_id = 'avatars');

-- Allow authenticated users to upload their own avatars
create policy "Users can upload their own avatars"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'avatars' and
  owner_id = auth.uid()::text
);

-- Allow users to update their own avatars
create policy "Users can update their own avatars"
on storage.objects for update
to authenticated
using (
  bucket_id = 'avatars' and
  owner_id = auth.uid()::text
);

-- Allow users to delete their own avatars
create policy "Users can delete their own avatars"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'avatars' and
  owner_id = auth.uid()::text
); 