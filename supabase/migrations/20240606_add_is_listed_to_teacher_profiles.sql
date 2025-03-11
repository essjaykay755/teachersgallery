-- Add is_listed column to teacher_profiles table
ALTER TABLE public.teacher_profiles
ADD COLUMN IF NOT EXISTS is_listed boolean DEFAULT true;

-- Update RLS policies for the new column
ALTER POLICY "Teachers can update own profile" ON public.teacher_profiles
  USING (auth.uid() = user_id); 