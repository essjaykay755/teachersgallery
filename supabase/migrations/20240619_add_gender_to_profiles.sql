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