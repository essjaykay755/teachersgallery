-- Create student_profiles table
CREATE TABLE IF NOT EXISTS public.student_profiles (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES public.profiles ON DELETE CASCADE NOT NULL,
  grade text NOT NULL,
  interests text[],
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id)
);

-- Create parent_profiles table
CREATE TABLE IF NOT EXISTS public.parent_profiles (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES public.profiles ON DELETE CASCADE NOT NULL,
  children_count integer DEFAULT 1 NOT NULL,
  children_grades text[],
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id)
);

-- Enable Row Level Security
ALTER TABLE public.student_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parent_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for student_profiles
CREATE POLICY "Student profiles are viewable by everyone"
  ON public.student_profiles FOR SELECT
  USING (true);

CREATE POLICY "Students can update own profile"
  ON public.student_profiles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Students can insert own profile"
  ON public.student_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create policies for parent_profiles
CREATE POLICY "Parent profiles are viewable by everyone"
  ON public.parent_profiles FOR SELECT
  USING (true);

CREATE POLICY "Parents can update own profile"
  ON public.parent_profiles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Parents can insert own profile"
  ON public.parent_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id); 