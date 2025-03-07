"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/contexts/auth";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback, AvatarWithTypeIndicator } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { User, MessageSquare, Heart, Star } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Define types for favourite teachers
interface TeacherProfile {
  id: string;
  user_id: string;
  subjects?: string[];
  about?: string;
  average_rating?: number;
  profiles?: {
    full_name?: string;
    avatar_url?: string;
  };
}

interface FavouriteTeacher {
  id: string;
  user_id: string;
  teacher_id: string;
  created_at: string;
  teacher_profiles: TeacherProfile;
}

export default function FavouriteTeachersPage() {
  const { user, profile } = useAuth();
  const [isClient, setIsClient] = useState(false);
  const [favouriteTeachers, setFavouriteTeachers] = useState<FavouriteTeacher[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const supabase = createClientComponentClient();

  useEffect(() => {
    setIsClient(true);
    
    if (user && (profile?.user_type === "student" || profile?.user_type === "parent")) {
      fetchFavouriteTeachers();
    } else if (profile?.user_type === "teacher") {
      // Redirect teachers to dashboard
      router.push("/dashboard");
    }
  }, [user, profile]);

  const fetchFavouriteTeachers = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      // Fetch favourite teachers from the database
      const { data, error } = await supabase
        .from("favourite_teachers")
        .select(`
          *,
          teacher_profiles(
            *,
            profiles(*)
          )
        `)
        .eq("user_id", user.id);

      if (error) {
        console.error("Error fetching favourite teachers:", error);
        return;
      }

      setFavouriteTeachers(data || []);
    } catch (err) {
      console.error("Failed to fetch favourite teachers:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const removeFavourite = async (teacherId: string) => {
    if (!user) return;
    
    try {
      // Remove teacher from favourites
      const { error } = await supabase
        .from("favourite_teachers")
        .delete()
        .eq("user_id", user.id)
        .eq("teacher_id", teacherId);

      if (error) {
        console.error("Error removing favourite teacher:", error);
        return;
      }

      // Refresh the list
      fetchFavouriteTeachers();
    } catch (err) {
      console.error("Failed to remove favourite teacher:", err);
    }
  };

  if (!isClient) {
    return null;
  }

  if (profile?.user_type !== "student" && profile?.user_type !== "parent") {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Access Restricted</h1>
          <p className="text-gray-600 mb-4">This page is only available to students and parents.</p>
          <Button onClick={() => router.push("/dashboard")}>Go to Dashboard</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Favourite Teachers</h1>
      
      {isLoading ? (
        <div className="flex justify-center items-center min-h-[40vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : favouriteTeachers.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <Heart className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h2 className="text-xl font-semibold mb-2">No Favourite Teachers Yet</h2>
          <p className="text-gray-600 mb-6">
            You haven't added any teachers to your favourites list yet.
          </p>
          <Button onClick={() => router.push("/find-teachers")}>
            Find Teachers
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {favouriteTeachers.map((favourite) => {
            const teacher = favourite.teacher_profiles;
            const teacherProfile = teacher?.profiles;
            
            return (
              <Card key={favourite.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <CardContent className="p-0">
                  <div className="p-6">
                    <div className="flex items-start gap-4">
                      <AvatarWithTypeIndicator
                        size="lg"
                        src={teacherProfile?.avatar_url}
                        alt={teacherProfile?.full_name || "Teacher"}
                        userType="teacher"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg truncate">
                          {teacherProfile?.full_name || "Teacher"}
                        </h3>
                        <p className="text-gray-500 text-sm mb-1">
                          {teacher?.subjects?.join(", ") || "No subjects specified"}
                        </p>
                        <div className="flex items-center text-amber-500 text-sm">
                          <Star className="h-4 w-4 mr-1 fill-current" />
                          <span>{teacher?.average_rating || "New"}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 text-sm line-clamp-3 text-gray-600">
                      {teacher?.about || "No description provided."}
                    </div>
                  </div>
                  
                  <div className="border-t flex divide-x">
                    <Link
                      href={`/teachers/${teacher?.id}`}
                      className="flex-1 py-3 text-center text-sm font-medium text-indigo-600 hover:bg-indigo-50"
                    >
                      View Profile
                    </Link>
                    <button
                      onClick={() => removeFavourite(teacher?.id)}
                      className="flex-1 py-3 text-center text-sm font-medium text-red-600 hover:bg-red-50"
                    >
                      Remove
                    </button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
} 