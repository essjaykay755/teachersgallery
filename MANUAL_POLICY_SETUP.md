# Manual Storage Policy Setup for TeachersGallery

Since the automated script couldn't apply the storage policies, you'll need to set them up manually through the Supabase dashboard. Follow these steps:

## 1. Log in to your Supabase Dashboard

Go to [https://app.supabase.com/](https://app.supabase.com/) and log in to your account.

## 2. Select your Project

Select the project you're using for TeachersGallery.

## 3. Navigate to Storage

Click on "Storage" in the left sidebar.

## 4. Verify the Avatars Bucket

Make sure the "avatars" bucket exists. If it doesn't, create it:

1. Click "New Bucket"
2. Name it "avatars"
3. Check "Public bucket" to make it public
4. Set the file size limit to 2MB
5. Click "Create bucket"

## 5. Set up RLS Policies

Now you need to set up Row Level Security (RLS) policies for the storage bucket:

1. Click on "Policies" in the top navigation bar
2. You should see the "storage.objects" table
3. Click on "New Policy" to create each of the following policies:

### Policy 1: Allow anyone to view avatars

- **Policy Name**: Anyone can view avatars
- **Target Roles**: All users (authenticated and anonymous)
- **Operation**: SELECT
- **Using Expression**: `bucket_id = 'avatars'`

### Policy 2: Allow authenticated users to upload their own avatars

- **Policy Name**: Users can upload their own avatars
- **Target Roles**: Authenticated users only
- **Operation**: INSERT
- **Using Expression**: `bucket_id = 'avatars' and owner_id = auth.uid()::text`

### Policy 3: Allow users to update their own avatars

- **Policy Name**: Users can update their own avatars
- **Target Roles**: Authenticated users only
- **Operation**: UPDATE
- **Using Expression**: `bucket_id = 'avatars' and owner_id = auth.uid()::text`

### Policy 4: Allow users to delete their own avatars

- **Policy Name**: Users can delete their own avatars
- **Target Roles**: Authenticated users only
- **Operation**: DELETE
- **Using Expression**: `bucket_id = 'avatars' and owner_id = auth.uid()::text`

## 6. Set up RLS Policies for Profiles Table

In addition to the storage policies, you also need to set up Row Level Security (RLS) policies for the profiles table:

1. Go to the "Table Editor" in the Supabase dashboard
2. Select the "profiles" table
3. Click on "Policies" in the top navigation bar
4. Click on "New Policy" to create each of the following policies:

### Policy 1: Allow users to insert their own profile

- **Policy Name**: Users can insert their own profile
- **Target Roles**: Authenticated users only
- **Operation**: INSERT
- **Using Expression**: `auth.uid() = id`

### Policy 2: Allow service role to insert any profile (for API endpoints)

- **Policy Name**: Service role can insert any profile
- **Target Roles**: Service role only
- **Operation**: INSERT
- **Using Expression**: `true`

## 7. Test the Policies

After setting up all the policies, test the registration functionality in your application to make sure it works correctly.

## Troubleshooting

If you're still having issues with avatar uploads:

1. **Check Authentication**: Make sure the user is properly authenticated before attempting to upload.

2. **Check Console Errors**: Look for specific error messages in the browser console.

3. **Verify Bucket Permissions**: In the Supabase dashboard, go to Storage > Buckets and make sure the "avatars" bucket is set to public.

4. **Check RLS Policies**: Make sure all the policies are correctly applied to the storage.objects table.

5. **Test with Supabase UI**: Try uploading a file directly through the Supabase dashboard to see if it works there.

6. **Check File Size and Type**: Make sure the file is less than 2MB and is an image file.

If you continue to have issues, you may need to check the Supabase logs for more detailed error information.
