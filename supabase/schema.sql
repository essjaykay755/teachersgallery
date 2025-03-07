-- Create tables with RLS enabled
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text not null,
  email text not null,
  phone text,
  user_type text not null check (user_type in ('teacher', 'student', 'parent')),
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.teacher_profiles (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles on delete cascade not null,
  subject text[] not null,
  location text not null,
  fee text not null,
  about text not null,
  tags text[],
  is_verified boolean default false,
  rating numeric(3,2) check (rating >= 1 and rating <= 5),
  reviews_count integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id)
);

-- New tables for teacher experience and education
create table public.teacher_experience (
  id uuid primary key default uuid_generate_v4(),
  teacher_id uuid references public.teacher_profiles on delete cascade not null,
  title text not null,
  institution text not null,
  period text not null,
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.teacher_education (
  id uuid primary key default uuid_generate_v4(),
  teacher_id uuid references public.teacher_profiles on delete cascade not null,
  degree text not null,
  institution text not null,
  year text not null,
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Favourite teachers table
create table public.favourite_teachers (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles on delete cascade not null,
  teacher_id uuid references public.teacher_profiles on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, teacher_id)
);

-- Featured teachers and pricing plans
create table public.pricing_plans (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  price numeric not null,
  duration_days integer not null,
  features text[],
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.featured_teachers (
  id uuid primary key default uuid_generate_v4(),
  teacher_id uuid references public.teacher_profiles on delete cascade not null,
  plan_id uuid references public.pricing_plans on delete cascade not null,
  start_date timestamp with time zone default timezone('utc'::text, now()) not null,
  end_date timestamp with time zone not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.reviews (
  id uuid primary key default uuid_generate_v4(),
  teacher_id uuid references public.teacher_profiles on delete cascade not null,
  reviewer_id uuid references public.profiles on delete cascade not null,
  rating integer not null check (rating >= 1 and rating <= 5),
  comment text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(teacher_id, reviewer_id)
);

create table public.messages (
  id uuid primary key default uuid_generate_v4(),
  sender_id uuid references public.profiles on delete cascade not null,
  receiver_id uuid references public.profiles on delete cascade not null,
  message text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  read boolean default false
);

-- Enable Row Level Security
alter table public.profiles enable row level security;
alter table public.teacher_profiles enable row level security;
alter table public.teacher_experience enable row level security;
alter table public.teacher_education enable row level security;
alter table public.pricing_plans enable row level security;
alter table public.featured_teachers enable row level security;
alter table public.reviews enable row level security;
alter table public.messages enable row level security;
alter table public.favourite_teachers enable row level security;

-- Create policies
-- Profiles: viewable by everyone, but only editable by the owner
create policy "Profiles are viewable by everyone"
  on public.profiles for select
  using (true);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Teacher profiles: viewable by everyone, but only editable by the owner
create policy "Teacher profiles are viewable by everyone"
  on public.teacher_profiles for select
  using (true);

create policy "Teachers can update own profile"
  on public.teacher_profiles for update
  using (auth.uid() = user_id);

create policy "Teachers can insert own profile"
  on public.teacher_profiles for insert
  with check (auth.uid() = user_id);

-- Teacher experience: viewable by everyone, but only editable by the owner
create policy "Teacher experience is viewable by everyone"
  on public.teacher_experience for select
  using (true);

create policy "Teachers can update own experience"
  on public.teacher_experience for update
  using (
    auth.uid() = (
      select user_id from public.teacher_profiles
      where id = teacher_id
    )
  );

create policy "Teachers can insert own experience"
  on public.teacher_experience for insert
  with check (
    auth.uid() = (
      select user_id from public.teacher_profiles
      where id = teacher_id
    )
  );

create policy "Teachers can delete own experience"
  on public.teacher_experience for delete
  using (
    auth.uid() = (
      select user_id from public.teacher_profiles
      where id = teacher_id
    )
  );

-- Teacher education: viewable by everyone, but only editable by the owner
create policy "Teacher education is viewable by everyone"
  on public.teacher_education for select
  using (true);

create policy "Teachers can update own education"
  on public.teacher_education for update
  using (
    auth.uid() = (
      select user_id from public.teacher_profiles
      where id = teacher_id
    )
  );

create policy "Teachers can insert own education"
  on public.teacher_education for insert
  with check (
    auth.uid() = (
      select user_id from public.teacher_profiles
      where id = teacher_id
    )
  );

create policy "Teachers can delete own education"
  on public.teacher_education for delete
  using (
    auth.uid() = (
      select user_id from public.teacher_profiles
      where id = teacher_id
    )
  );

-- Pricing plans: viewable by everyone, but only editable by admins (will be handled in API)
create policy "Pricing plans are viewable by everyone"
  on public.pricing_plans for select
  using (true);

-- Featured teachers: viewable by everyone, but only editable by admins (will be handled in API)
create policy "Featured teachers are viewable by everyone"
  on public.featured_teachers for select
  using (true);

-- Reviews: viewable by everyone, insertable by authenticated users (except self-reviews)
create policy "Reviews are viewable by everyone"
  on public.reviews for select
  using (true);

create policy "Authenticated users can insert reviews"
  on public.reviews for insert
  with check (
    auth.uid() = reviewer_id and
    auth.uid() != (
      select user_id from public.teacher_profiles
      where id = teacher_id
    )
  );

-- Messages: only viewable and insertable by participants
create policy "Users can view their own messages"
  on public.messages for select
  using (auth.uid() = sender_id or auth.uid() = receiver_id);

create policy "Users can send messages"
  on public.messages for insert
  with check (auth.uid() = sender_id);

-- Authenticated users can select featured teachers
create policy "Authenticated users can select featured teachers" on public.featured_teachers for select using (true);

-- Favourite teachers policies
create policy "Users can view their own favourites" on public.favourite_teachers for select using (auth.uid() = user_id);
create policy "Users can add to their favourites" on public.favourite_teachers for insert with check (auth.uid() = user_id);
create policy "Users can remove from their favourites" on public.favourite_teachers for delete using (auth.uid() = user_id);

-- Create functions for computed fields
create or replace function public.update_teacher_rating()
returns trigger as $$
begin
  update public.teacher_profiles
  set 
    rating = (
      select avg(rating)::numeric(3,2)
      from public.reviews
      where teacher_id = new.teacher_id
    ),
    reviews_count = (
      select count(*)
      from public.reviews
      where teacher_id = new.teacher_id
    )
  where id = new.teacher_id;
  return new;
end;
$$ language plpgsql security definer;

-- Create trigger to update teacher rating
create trigger on_review_update
  after insert or update or delete
  on public.reviews
  for each row
  execute function public.update_teacher_rating(); 