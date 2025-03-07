import { createClient } from "@supabase/supabase-js";

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error("Missing env.NEXT_PUBLIC_SUPABASE_URL");
}
if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error("Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY");
}

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
    global: {
      fetch: (url, options) => {
        return fetch(url, {
          ...options,
          // Increase request timeout to 60 seconds (from default 30s)
          signal: options?.signal || AbortSignal.timeout(60000)
        });
      }
    }
  }
);

// Types for our database tables
export type Profile = {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  user_type: "teacher" | "student" | "parent" | "admin";
  avatar_url?: string;
  created_at: string;
};

export type TeacherProfile = {
  id: string;
  user_id: string;
  subject: string[];
  location: string;
  fee: string;
  about: string;
  tags: string[];
  is_verified: boolean;
  rating?: number;
  reviews_count?: number;
  created_at: string;
  profiles?: Profile;
};

export type StudentProfile = {
  id: string;
  user_id: string;
  grade: string;
  interests: string[];
  created_at: string;
  profiles?: Profile;
};

export type ParentProfile = {
  id: string;
  user_id: string;
  children_count: number;
  children_grades: string[];
  created_at: string;
  profiles?: Profile;
};

export type TeacherExperience = {
  id: string;
  teacher_id: string;
  title: string;
  institution: string;
  period: string;
  description?: string;
  created_at: string;
};

export type TeacherEducation = {
  id: string;
  teacher_id: string;
  degree: string;
  institution: string;
  year: string;
  description?: string;
  created_at: string;
};

export type PricingPlan = {
  id: string;
  name: string;
  price: number;
  duration_days: number;
  features: string[];
  created_at: string;
};

export type FeaturedTeacher = {
  id: string;
  teacher_id: string;
  plan_id: string;
  start_date: string;
  end_date: string;
  created_at: string;
  teacher_profile?: TeacherProfile;
  pricing_plan?: PricingPlan;
};

export type Review = {
  id: string;
  teacher_id: string;
  reviewer_id: string;
  rating: number;
  comment: string;
  created_at: string;
  reviewer?: Profile;
};

export type Message = {
  id: string;
  sender_id: string;
  receiver_id: string;
  message: string;
  created_at: string;
  read: boolean;
};
