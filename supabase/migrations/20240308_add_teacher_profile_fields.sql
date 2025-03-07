-- Add new columns to teacher_profiles table
ALTER TABLE public.teacher_profiles
  ADD COLUMN IF NOT EXISTS qualifications text[],
  ADD COLUMN IF NOT EXISTS years_experience text,
  ADD COLUMN IF NOT EXISTS teaching_style text,
  ADD COLUMN IF NOT EXISTS availability text[],
  ADD COLUMN IF NOT EXISTS teaching_format text DEFAULT 'both',
  ADD COLUMN IF NOT EXISTS education text;

-- Update RLS policies for the new columns
ALTER POLICY "Teachers can update own profile" ON public.teacher_profiles
  USING (auth.uid() = user_id);

-- Rename subject to subjects for consistency (if not already done)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'teacher_profiles'
    AND column_name = 'subject'
  ) THEN
    ALTER TABLE public.teacher_profiles RENAME COLUMN subject TO subjects;
  END IF;
END $$; 