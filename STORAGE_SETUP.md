# Storage Setup for TeachersGallery

This document explains how to set up the Supabase storage for the TeachersGallery application.

## Prerequisites

1. A Supabase project with the database schema already set up
2. The Supabase URL and API keys (anon key and service role key)

## Setting up the Storage Bucket

The application requires an `avatars` storage bucket for storing user profile pictures. There are two ways to set this up:

### Option 1: Using the Setup Script (Recommended)

1. Make sure you have the following environment variables in your `.env.local` file:

   ```
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```

2. Run the setup script:

   ```bash
   npm run setup:storage
   ```

   This script will:

   - Check if the `avatars` bucket exists and create it if it doesn't
   - Apply the necessary RLS (Row Level Security) policies to the bucket

### Option 2: Manual Setup

If you prefer to set up the storage bucket manually:

1. Go to your Supabase dashboard
2. Navigate to Storage > Buckets
3. Click "Create Bucket"
4. Name it `avatars`
5. Set it as public
6. Set a file size limit of 2MB

Then, apply the following RLS policies to the `storage.objects` table:

```sql
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
```

## Troubleshooting

If you encounter issues with avatar uploads:

1. **Permission Denied Errors**: Make sure the RLS policies are correctly applied and that the user is authenticated.

2. **Bucket Not Found**: Ensure the `avatars` bucket exists. The application will attempt to create it if it doesn't exist, but this requires the service role key to be set correctly.

3. **File Size Errors**: Ensure the file is less than 2MB.

4. **File Type Errors**: Only image files are allowed.

5. **Row Level Security Errors**: If you see "new row violates row-level security policy", it means the RLS policies are preventing the operation. Check that the user is authenticated and that the policies are correctly applied.

## Implementation Details

The avatar upload functionality is implemented in:

- `lib/upload.ts`: Contains the `uploadAvatar` function that handles file validation and upload
- `app/api/storage/ensure-bucket/route.ts`: API endpoint that ensures the avatars bucket exists
- `app/onboarding/steps/profile-details.tsx`: Component that handles avatar upload during onboarding
- `app/settings/teacher-profile/page.tsx`: Component that handles avatar upload in the teacher profile settings

The upload process:

1. Validates the file type and size
2. Ensures the avatars bucket exists
3. Uploads the file to the bucket
4. Returns the public URL of the uploaded file
