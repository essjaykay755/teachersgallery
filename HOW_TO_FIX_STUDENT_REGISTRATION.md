# How to Fix Student Registration Issue

The error you're seeing is because the `student_profiles` and `parent_profiles` tables don't exist in your Supabase database yet. To fix this issue, you need to create these tables in your Supabase database.

## Option 1: Run SQL Commands in Supabase Studio

1. Go to your Supabase project dashboard 
2. Click on "SQL Editor" in the left sidebar
3. Create a new query
4. Copy and paste the following SQL statements:

```sql
-- Create student_profiles table
CREATE TABLE IF NOT EXISTS public.student_profiles (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES public.profiles ON DELETE CASCADE NOT NULL,
  grade text,
  interests text[],
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id)
);

-- Create parent_profiles table
CREATE TABLE IF NOT EXISTS public.parent_profiles (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES public.profiles ON DELETE CASCADE NOT NULL,
  children_count integer DEFAULT 1,
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
```

5. Run the query by clicking the "Run" button

## Option 2: Add Table in Supabase Studio UI

If you prefer using the graphical interface:

1. Go to your Supabase project dashboard
2. Click on "Table Editor" in the left sidebar
3. Click "Create a new table" button
4. Create student_profiles table:
   - Name: student_profiles
   - Enable RLS: checked
   - Add columns:
     - id (type: uuid, primary key, default: uuid_generate_v4())
     - user_id (type: uuid, not null, foreign key to profiles.id)
     - grade (type: text)
     - interests (type: text[])
     - created_at (type: timestamp with time zone, not null, default: now())
   - Add unique constraint on user_id
5. Create parent_profiles table using the same approach

After creating these tables, the student registration process should work correctly. 