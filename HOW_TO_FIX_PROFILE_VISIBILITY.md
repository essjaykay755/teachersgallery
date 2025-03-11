# How to Fix Profile Visibility Issue

The "Saving..." issue when toggling profile visibility is caused by a missing `is_listed` column in the `teacher_profiles` table. This document explains how to fix the issue.

## Option 1: Run the Fix Script

1. Run the `fix-profile-visibility.bat` script (Windows) or follow the manual steps below.
2. Restart your Next.js application.
3. Try toggling the profile visibility again - it should now work correctly.

## Option 2: Run SQL Commands in Supabase Studio

1. Go to your Supabase project dashboard 
2. Click on "SQL Editor" in the left sidebar
3. Create a new query
4. Copy and paste the following SQL statements:

```sql
-- Add is_listed column to teacher_profiles table if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'teacher_profiles' 
    AND column_name = 'is_listed'
  ) THEN
    -- Add is_listed column to teacher_profiles table with default value of true
    ALTER TABLE public.teacher_profiles 
    ADD COLUMN is_listed boolean DEFAULT true;

    -- Set default value for existing rows
    UPDATE public.teacher_profiles
    SET is_listed = true
    WHERE is_listed IS NULL;
  END IF;
END
$$;
```

5. Click "Run" to execute the SQL

## Option 3: Use Supabase CLI Migration

If you have the Supabase CLI installed, you can run the migration file:

```bash
# Navigate to your project directory
cd your-project-directory

# Run the migration
supabase db execute --db-url "your-supabase-db-url" --file fix-profile-visibility.sql
```

## Verify the Fix

After applying the changes:

1. Restart your Next.js development server
2. Go to your teacher profile page
3. Try toggling the profile visibility and saving
4. The profile should save successfully without getting stuck on "Saving..."

## Technical Details

The issue was caused by:

1. The application trying to update the `is_listed` field which didn't exist in the database
2. The code was treating `is_listed` as an "additional" field that might not exist, but it was being used as a critical feature

The fix:
1. Adds the `is_listed` column to the database
2. Moves the `is_listed` field from `additionalData` to `baseUpdateData` in the code
3. Sets a default value of `true` for existing profiles

This ensures that the visibility toggle works correctly and the profile can be saved without issues. 