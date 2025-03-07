# How to Fix Profile Timeout Issue

The "Operation timed out" error when saving profiles is caused by missing database columns that the application is trying to update. Follow these steps to fix the issue:

## Option 1: Run SQL Commands in Supabase Studio

1. Go to your Supabase project dashboard 
2. Click on "SQL Editor" in the left sidebar
3. Create a new query
4. Copy and paste the following SQL statements:

```sql
-- Add updated_at column to profiles table
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone DEFAULT timezone('utc'::text, now());

-- Add notification_preferences column to profiles table
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS notification_preferences jsonb DEFAULT '{}'::jsonb;

-- Add a trigger to automatically update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for profiles table
DO $$
BEGIN
  -- Check if trigger exists before creating
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'set_profiles_updated_at') THEN
    CREATE TRIGGER set_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
  END IF;
END
$$;
```

5. Click "Run" to execute the SQL

## Option 2: Use Supabase CLI Migration

If you have the Supabase CLI installed, you can run the migration file:

```bash
# Navigate to your project directory
cd your-project-directory

# Run the migration
supabase migration up --db-url "your-supabase-db-url"
```

## Verify the Fix

After applying the changes:

1. Restart your Next.js development server
2. Try saving your profile again
3. The timeout error should be resolved

## Technical Details

The issue was caused by:

1. The application trying to update the `updated_at` field which didn't exist in the database
2. The application trying to update the `notification_preferences` field which didn't exist in the database

The fix adds these missing columns and sets up a trigger to automatically update the `updated_at` field whenever a record is updated. 