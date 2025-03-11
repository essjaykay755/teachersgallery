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