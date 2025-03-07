# How to Fix Supabase Storage RLS Error

The error `StorageApiError: new row violates row-level security policy` occurs when trying to upload files to Supabase Storage but encountering permission issues with the Row Level Security (RLS) policies.

## Solution

You need to update your Supabase Storage RLS policies to allow authenticated users to upload files.

### Option 1: Run SQL Commands in Supabase Studio

1. Go to your Supabase project dashboard
2. Click on "SQL Editor" in the left sidebar
3. Create a new query
4. Copy and paste the following SQL statements:

```sql
-- First, check if the avatars bucket exists and create it if it doesn't
-- NOTE: This requires admin privileges and might fail in the web interface
DO $$
DECLARE 
  bucket_exists BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT FROM storage.buckets WHERE name = 'avatars'
  ) INTO bucket_exists;
  
  IF NOT bucket_exists THEN
    INSERT INTO storage.buckets (id, name, public) 
    VALUES ('avatars', 'avatars', true);
  END IF;
END $$;

-- Now update the RLS policies for storage

-- Drop existing policies for the avatars bucket if they exist
DROP POLICY IF EXISTS "Anyone can view avatars" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload their own avatars" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own avatars" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own avatars" ON storage.objects;

-- Create new policies with correct owner field

-- Allow public access to view avatars
CREATE POLICY "Anyone can view avatars"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

-- Allow authenticated users to upload their own avatars
-- Note: The correct field is 'auth.uid()' compared to 'owner'
CREATE POLICY "Users can upload their own avatars"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'avatars' AND
  (auth.uid())::text = owner
);

-- Allow users to update their own avatars
CREATE POLICY "Users can update their own avatars"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'avatars' AND
  (auth.uid())::text = owner
);

-- Allow users to delete their own avatars
CREATE POLICY "Users can delete their own avatars"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'avatars' AND
  (auth.uid())::text = owner
);
```

5. Click "Run" to execute the SQL

### Option 2: Using the Supabase Dashboard UI

1. Go to your Supabase project dashboard
2. Click on "Storage" in the left sidebar
3. Create the "avatars" bucket if it doesn't exist:
   - Click "New Bucket"
   - Name it "avatars"
   - Check "Public bucket" to make it public
   - Click "Create bucket"
4. Click on the "Policies" tab
5. Delete any existing policies for the "avatars" bucket
6. Create the following policies:

   **Policy 1: Anyone can view avatars**
   - Operation: SELECT
   - Policy name: Anyone can view avatars
   - Target roles: All users
   - Using expression: `bucket_id = 'avatars'`

   **Policy 2: Users can upload their own avatars**
   - Operation: INSERT
   - Policy name: Users can upload their own avatars
   - Target roles: Authenticated users only
   - Using expression: `bucket_id = 'avatars' AND auth.uid()::text = owner`

   **Policy 3: Users can update their own avatars**
   - Operation: UPDATE
   - Policy name: Users can update their own avatars
   - Target roles: Authenticated users only
   - Using expression: `bucket_id = 'avatars' AND auth.uid()::text = owner`

   **Policy 4: Users can delete their own avatars**
   - Operation: DELETE
   - Policy name: Users can delete their own avatars
   - Target roles: Authenticated users only
   - Using expression: `bucket_id = 'avatars' AND auth.uid()::text = owner`

## Important Note About the Owner Field

The key issue in the RLS policy error is often due to confusion between `owner_id` and `owner`. In Supabase Storage:

- The correct field name is **`owner`** (not `owner_id`)
- You need to compare it with `auth.uid()::text`

The correct syntax is:
```sql
auth.uid()::text = owner
```

## After Applying the Fix

1. Restart your Next.js development server
2. Clear your browser cache or use incognito mode
3. Log out and log back in
4. Try uploading a profile picture again 