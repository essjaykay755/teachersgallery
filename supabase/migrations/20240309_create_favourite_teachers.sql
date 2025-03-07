-- Create favourite_teachers table
CREATE TABLE IF NOT EXISTS public.favourite_teachers (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES public.profiles ON DELETE CASCADE NOT NULL,
  teacher_id uuid REFERENCES public.teacher_profiles ON DELETE CASCADE NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, teacher_id)
);

-- Enable Row Level Security
ALTER TABLE public.favourite_teachers ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Users can view and manage their own favourite teachers
CREATE POLICY "Users can view their own favourites" 
  ON public.favourite_teachers
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can add to their favourites" 
  ON public.favourite_teachers
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove from their favourites" 
  ON public.favourite_teachers
  FOR DELETE
  USING (auth.uid() = user_id);

-- Add the function to create the favourite_teachers table in the seed data
CREATE OR REPLACE FUNCTION public.create_favourite_teachers_table()
RETURNS void AS $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'favourite_teachers'
  ) THEN
    EXECUTE '
    CREATE TABLE public.favourite_teachers (
      id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
      user_id uuid REFERENCES public.profiles ON DELETE CASCADE NOT NULL,
      teacher_id uuid REFERENCES public.teacher_profiles ON DELETE CASCADE NOT NULL,
      created_at timestamp with time zone DEFAULT timezone(''utc''::text, now()) NOT NULL,
      UNIQUE(user_id, teacher_id)
    );
    ';
    
    EXECUTE 'ALTER TABLE public.favourite_teachers ENABLE ROW LEVEL SECURITY;';
    
    EXECUTE '
    CREATE POLICY "Users can view their own favourites" 
      ON public.favourite_teachers
      FOR SELECT
      USING (auth.uid() = user_id);
    ';
    
    EXECUTE '
    CREATE POLICY "Users can add to their favourites" 
      ON public.favourite_teachers
      FOR INSERT
      WITH CHECK (auth.uid() = user_id);
    ';
    
    EXECUTE '
    CREATE POLICY "Users can remove from their favourites" 
      ON public.favourite_teachers
      FOR DELETE
      USING (auth.uid() = user_id);
    ';
  END IF;
END;
$$ LANGUAGE plpgsql; 