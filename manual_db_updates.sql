-- Run this in the Supabase SQL Editor to add the gender column to the profiles table
-- First check if the column already exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles' 
    AND column_name = 'gender'
  ) THEN
    -- Add gender column to profiles table
    ALTER TABLE public.profiles 
    ADD COLUMN gender text DEFAULT 'male' NOT NULL;

    -- Add constraint to gender column
    ALTER TABLE public.profiles 
    ADD CONSTRAINT profiles_gender_check 
    CHECK (gender IN ('male', 'female'));

    -- Set default value for existing rows
    UPDATE public.profiles 
    SET gender = 'male' 
    WHERE gender IS NULL;
  END IF;
END
$$; 