-- Create helper functions to modify database schema through RPC
-- These functions can be called via the Supabase client

-- Function to add notification_preferences column to profiles table
CREATE OR REPLACE FUNCTION alter_profiles_add_notification_prefs()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if the column already exists
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'profiles'
    AND column_name = 'notification_preferences'
  ) THEN
    -- Add the column
    EXECUTE 'ALTER TABLE public.profiles ADD COLUMN notification_preferences jsonb DEFAULT ''{}'':jsonb';
    RETURN true;
  END IF;
  
  -- Column already exists
  RETURN false;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION alter_profiles_add_notification_prefs() TO authenticated;

-- Function to add updated_at column to profiles table
CREATE OR REPLACE FUNCTION alter_profiles_add_updated_at()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if the column already exists
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'profiles'
    AND column_name = 'updated_at'
  ) THEN
    -- Add the column
    EXECUTE 'ALTER TABLE public.profiles ADD COLUMN updated_at timestamp with time zone DEFAULT timezone(''utc''::text, now())';
    
    -- Create trigger function if it doesn't exist
    IF NOT EXISTS (
      SELECT 1
      FROM pg_proc
      WHERE proname = 'update_updated_at_column'
    ) THEN
      EXECUTE '
        CREATE OR REPLACE FUNCTION update_updated_at_column()
        RETURNS TRIGGER AS $$
        BEGIN
           NEW.updated_at = NOW();
           RETURN NEW;
        END;
        $$ language ''plpgsql'';
      ';
    END IF;
    
    -- Create trigger if it doesn't exist
    IF NOT EXISTS (
      SELECT 1
      FROM pg_trigger
      WHERE tgname = 'set_profiles_updated_at'
    ) THEN
      EXECUTE '
        CREATE TRIGGER set_profiles_updated_at
        BEFORE UPDATE ON public.profiles
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
      ';
    END IF;
    
    RETURN true;
  END IF;
  
  -- Column already exists
  RETURN false;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION alter_profiles_add_updated_at() TO authenticated;

-- Function to check what columns are missing from profiles table
CREATE OR REPLACE FUNCTION check_profiles_missing_columns()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result jsonb := '{}'::jsonb;
BEGIN
  -- Check notification_preferences column
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'profiles'
    AND column_name = 'notification_preferences'
  ) THEN
    result := result || '{"notification_preferences": false}'::jsonb;
  ELSE
    result := result || '{"notification_preferences": true}'::jsonb;
  END IF;
  
  -- Check updated_at column
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'profiles'
    AND column_name = 'updated_at'
  ) THEN
    result := result || '{"updated_at": false}'::jsonb;
  ELSE
    result := result || '{"updated_at": true}'::jsonb;
  END IF;
  
  -- Check gender column
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'profiles'
    AND column_name = 'gender'
  ) THEN
    result := result || '{"gender": false}'::jsonb;
  ELSE
    result := result || '{"gender": true}'::jsonb;
  END IF;
  
  RETURN result;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION check_profiles_missing_columns() TO authenticated; 