"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/contexts/auth";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import type { TeacherProfile, Review, Profile } from "@/lib/supabase";

export default function DashboardPage() {
  const { user, profile } = useAuth();
  const router = useRouter();
  const [teacherProfile, setTeacherProfile] = useState<TeacherProfile | null>(
    null
  );
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClientComponentClient();

  useEffect(() => {
    async function loadData() {
      if (!user || !profile) {
        router.replace("/auth/login");
        return;
      }

      setIsLoading(true);
      try {
        if (profile.user_type === "teacher") {
          // Load teacher profile and reviews
          const { data: teacherData } = await supabase
            .from("teacher_profiles")
            .select("*")
            .eq("user_id", user.id)
            .single();
          setTeacherProfile(teacherData);

          if (teacherData) {
            const { data: reviewsData } = await supabase
              .from("reviews")
              .select(
                `
                *,
                reviewer:reviewer_id (
                  full_name,
                  avatar_url
                )
              `
              )
              .eq("teacher_id", teacherData.id)
              .order("created_at", { ascending: false })
              .limit(5);
            setReviews(reviewsData || []);
          }
        }
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, [user, profile, supabase, router]);

  if (isLoading || !profile) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-base font-semibold text-indigo-600">
              Loading...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome, {profile.full_name}
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            {profile.user_type === "teacher"
              ? "Manage your teaching profile and connect with students"
              : profile.user_type === "student"
              ? "Find and connect with teachers"
              : "Find teachers for your child"}
          </p>
        </div>

        <div className="mt-12">
          {profile.user_type === "teacher" && teacherProfile && (
            <TeacherDashboard
              profile={profile}
              teacherProfile={teacherProfile}
              reviews={reviews}
            />
          )}

          {profile.user_type === "student" && (
            <StudentDashboard profile={profile} />
          )}

          {profile.user_type === "parent" && (
            <ParentDashboard profile={profile} />
          )}
        </div>
      </div>
    </div>
  );
}

interface DashboardProps {
  profile: Profile;
  teacherProfile: TeacherProfile;
  reviews: Review[];
}

function TeacherDashboard({
  profile,
  teacherProfile,
  reviews,
}: DashboardProps) {
  return (
    <div className="space-y-8">
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Your Teaching Profile
        </h2>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Subjects</h3>
            <div className="mt-1 flex flex-wrap gap-2">
              {teacherProfile.subject.map((subject: string) => (
                <span
                  key={subject}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                >
                  {subject}
                </span>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Location</h3>
            <p className="mt-1 text-sm text-gray-900">
              {teacherProfile.location}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Fee</h3>
            <p className="mt-1 text-sm text-gray-900">{teacherProfile.fee}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Rating</h3>
            <p className="mt-1 text-sm text-gray-900">
              {teacherProfile.rating
                ? `${teacherProfile.rating}/5`
                : "No ratings yet"}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Recent Reviews
        </h2>
        {reviews.length > 0 ? (
          <div className="space-y-6">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="border-b pb-4 last:border-b-0 last:pb-0"
              >
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <img
                      className="h-10 w-10 rounded-full"
                      src={review.reviewer?.avatar_url || "/default-avatar.png"}
                      alt=""
                    />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-gray-900">
                      {review.reviewer?.full_name}
                    </h3>
                    <div className="mt-1 flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`h-5 w-5 ${
                            i < review.rating
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 15.585l-7.07 4.267 1.857-7.819L0 7.383l7.714-.647L10 0l2.286 6.736L20 7.383l-4.786 4.65 1.857 7.819z"
                            clipRule="evenodd"
                          />
                        </svg>
                      ))}
                    </div>
                    <p className="mt-2 text-sm text-gray-600">
                      {review.comment}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-600">No reviews yet</p>
        )}
      </div>
    </div>
  );
}

function StudentDashboard({ profile }: { profile: Profile }) {
  const [teachers, setTeachers] = useState<TeacherProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClientComponentClient();

  useEffect(() => {
    async function loadTeachers() {
      const { data } = await supabase
        .from("teacher_profiles")
        .select(
          `
          *,
          profiles:user_id (
            full_name,
            email,
            avatar_url
          )
        `
        )
        .order("rating", { ascending: false })
        .limit(10);
      setTeachers(data || []);
      setIsLoading(false);
    }

    loadTeachers();
  }, [supabase]);

  return (
    <div className="space-y-8">
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Find Teachers
        </h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {teachers.map((teacher) => (
            <div key={teacher.id} className="border rounded-lg p-4">
              <div className="flex items-center">
                <img
                  className="h-12 w-12 rounded-full"
                  src={teacher.profiles?.avatar_url || "/default-avatar.png"}
                  alt=""
                />
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-900">
                    {teacher.profiles?.full_name}
                  </h3>
                  <div className="mt-1 flex items-center">
                    {teacher.rating && (
                      <span className="text-sm text-gray-600">
                        {teacher.rating}/5 ({teacher.reviews_count} reviews)
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex flex-wrap gap-2">
                  {teacher.subject.map((subject) => (
                    <span
                      key={subject}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                    >
                      {subject}
                    </span>
                  ))}
                </div>
                <p className="mt-2 text-sm text-gray-600">{teacher.location}</p>
                <p className="mt-1 text-sm text-gray-600">{teacher.fee}</p>
              </div>
              <div className="mt-4">
                <button className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  Contact Teacher
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ParentDashboard({ profile }: { profile: Profile }) {
  // Parent dashboard is similar to student dashboard
  return <StudentDashboard profile={profile} />;
}
