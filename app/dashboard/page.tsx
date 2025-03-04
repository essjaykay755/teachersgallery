"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/contexts/auth";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import type { TeacherProfile, Review, Profile } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export default function DashboardPage() {
  const {
    user,
    profile,
    isLoading: authLoading,
    error: authError,
    refreshProfile,
  } = useAuth();
  const router = useRouter();
  const [teacherProfile, setTeacherProfile] = useState<TeacherProfile | null>(
    null
  );
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClientComponentClient();

  console.log("Dashboard: Current state:", {
    hasUser: !!user,
    hasProfile: !!profile,
    authLoading,
    authError,
    isLoading,
    error,
    userType: profile?.user_type,
  });

  // Check if the profile is a temporary one
  const isTemporaryProfile =
    profile &&
    !profile.phone &&
    profile.full_name === (user?.email?.split("@")[0] || "New User");

  useEffect(() => {
    async function loadData() {
      // If auth is still loading or no user/profile, don't try to load data
      if (authLoading || !user || !profile) {
        console.log("Dashboard: Skipping data load - waiting for auth", {
          authLoading,
          hasUser: !!user,
          hasProfile: !!profile,
        });
        return;
      }

      // TypeScript guard - at this point we know profile is not null
      const userProfile = profile;

      // If we have a temporary profile, don't try to load data
      if (isTemporaryProfile) {
        console.log("Dashboard: Using temporary profile, skipping data load");
        setIsLoading(false);
        return;
      }

      console.log("Dashboard: Starting data load");
      setIsLoading(true);
      setError(null);

      try {
        console.log(
          "Dashboard: Loading data for user type:",
          userProfile.user_type
        );
        if (userProfile.user_type === "teacher") {
          // Load teacher profile and reviews
          console.log("Dashboard: Fetching teacher profile");

          // Set a timeout for the teacher profile fetch
          const teacherProfilePromise = supabase
            .from("teacher_profiles")
            .select("*")
            .eq("user_id", user.id)
            .single();

          const timeoutPromise = new Promise((_, reject) => {
            setTimeout(
              () => reject(new Error("Teacher profile fetch timed out")),
              5000
            );
          });

          try {
            const { data: teacherData, error: teacherError } =
              (await Promise.race([
                teacherProfilePromise,
                timeoutPromise.then(() => ({
                  data: null,
                  error: new Error("Teacher profile fetch timed out"),
                })),
              ])) as any;

            if (teacherError) {
              console.error("Error loading teacher profile:", teacherError);

              // If the teacher profile doesn't exist yet, don't treat it as an error
              if (teacherError.code === "PGRST116") {
                console.log("Teacher profile not found - new teacher");
                setTeacherProfile(null);
                setReviews([]);
                setIsLoading(false);
                return;
              }

              // For timeout errors, we can still show the dashboard without teacher data
              if (teacherError.message === "Teacher profile fetch timed out") {
                console.log(
                  "Teacher profile fetch timed out - continuing with partial data"
                );
                setTeacherProfile(null);
                setReviews([]);
                setError(
                  "Some data could not be loaded. Please try refreshing."
                );
                setIsLoading(false);
                return;
              }

              setError("Failed to load teacher profile");
              setIsLoading(false);
              return;
            }

            console.log("Dashboard: Teacher profile loaded:", teacherData);
            setTeacherProfile(teacherData);

            if (teacherData) {
              console.log("Dashboard: Fetching reviews");

              // Set a timeout for the reviews fetch
              const reviewsPromise = supabase
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

              const reviewsTimeoutPromise = new Promise((_, reject) => {
                setTimeout(
                  () => reject(new Error("Reviews fetch timed out")),
                  3000
                );
              });

              try {
                const { data: reviewsData, error: reviewsError } =
                  (await Promise.race([
                    reviewsPromise,
                    reviewsTimeoutPromise.then(() => ({
                      data: [],
                      error: new Error("Reviews fetch timed out"),
                    })),
                  ])) as any;

                if (reviewsError) {
                  console.error("Error loading reviews:", reviewsError);

                  // For timeout errors, we can still show the dashboard with teacher data but no reviews
                  if (reviewsError.message === "Reviews fetch timed out") {
                    console.log(
                      "Reviews fetch timed out - continuing with partial data"
                    );
                    setReviews([]);
                    setError(
                      "Some data could not be loaded. Please try refreshing."
                    );
                    setIsLoading(false);
                    return;
                  }

                  setError("Failed to load reviews");
                  setIsLoading(false);
                  return;
                }

                console.log("Dashboard: Reviews loaded:", reviewsData);
                setReviews(reviewsData || []);
              } catch (reviewsErr) {
                console.error("Exception loading reviews:", reviewsErr);
                setReviews([]);
                setError("Failed to load reviews. Please try refreshing.");
              }
            }
          } catch (teacherErr) {
            console.error("Exception loading teacher profile:", teacherErr);
            setTeacherProfile(null);
            setReviews([]);
            setError("Failed to load teacher data. Please try refreshing.");
          }
        } else if (
          userProfile.user_type === "student" ||
          userProfile.user_type === "parent"
        ) {
          // For students and parents, we don't need to load teacher-specific data
          console.log(
            `Dashboard: No specific data to load for ${userProfile.user_type}`
          );
        } else {
          console.warn("Dashboard: Unknown user type:", userProfile.user_type);
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
        setError("An unexpected error occurred");
        setIsLoading(false);
      }
    }

    // Start loading data immediately if we have user and profile
    if (user && profile && !authLoading) {
      loadData();
    } else {
      // If we're still waiting for auth, set a timeout to prevent infinite loading
      const timeout = setTimeout(() => {
        if (isLoading) {
          console.log("Dashboard: Data loading timeout - showing partial UI");
          setIsLoading(false);
          setError("Some data could not be loaded. Please try refreshing.");
        }
      }, 10000);

      return () => clearTimeout(timeout);
    }
  }, [user, profile, authLoading, supabase, isTemporaryProfile, isLoading]);

  // Handle profile refresh
  const handleRefreshProfile = async () => {
    try {
      await refreshProfile();
    } catch (error) {
      console.error("Error refreshing profile:", error);
    }
  };

  // If auth is loading, show a loading state but with a timeout
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-2 text-base font-semibold text-indigo-600">
              Loading your dashboard...
            </p>
            <p className="mt-1 text-sm text-gray-500">
              This should only take a moment
            </p>
          </div>
        </div>
      </div>
    );
  }

  // If we have no user but auth is not loading, redirect to login
  if (!user && !authLoading) {
    // Use useEffect to handle the redirect to avoid hydration issues
    useEffect(() => {
      router.push("/login");
    }, [router]);

    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-2 text-base font-semibold text-indigo-600">
              Redirecting to login...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // If we have a user but no profile, show a message
  if (user && !profile && !authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center">
              <AlertCircle className="h-8 w-8 text-amber-500" />
            </div>
            <p className="mt-2 text-base font-semibold text-amber-600">
              Your profile is being set up
            </p>
            <p className="mt-1 text-sm text-gray-500">
              This should only take a moment. If it persists, please refresh the
              page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Refresh Page
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show auth error if any
  if (authError) {
    // Check if it's a temporary connection message
    const isConnecting = authError.includes("Connecting to");

    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {isConnecting ? (
              <>
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
                <p className="mt-2 text-base font-semibold text-indigo-600">
                  {authError}
                </p>
              </>
            ) : (
              <>
                <p className="text-base font-semibold text-red-600">
                  {authError}
                </p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Retry
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Show temporary profile warning
  if (isTemporaryProfile) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center gap-3 text-amber-600 mb-4">
              <AlertCircle className="h-6 w-6" />
              <h2 className="text-xl font-semibold">Profile Issue Detected</h2>
            </div>
            <p className="mb-4">
              We're having trouble loading your complete profile information.
              This might be due to a temporary connection issue or because your
              profile hasn't been fully set up yet.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={handleRefreshProfile}
                className="bg-indigo-600 hover:bg-indigo-700"
              >
                Refresh Profile
              </Button>
              <Button
                onClick={() => router.push("/account/settings")}
                variant="outline"
              >
                Complete Your Profile
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show loading state while data is loading
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-2 text-base font-semibold text-indigo-600">
              Loading your dashboard...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state if any
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-base font-semibold text-red-600">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Retry
            </button>
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

          {profile.user_type === "teacher" && !teacherProfile && (
            <div className="bg-white shadow rounded-lg p-6 text-center">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Complete Your Teacher Profile
              </h2>
              <p className="text-gray-600 mb-4">
                You haven't set up your teacher profile yet. Complete your
                profile to start connecting with students.
              </p>
              <button
                onClick={() => router.push("/account/settings")}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Set Up Profile
              </button>
            </div>
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
                      src={review.reviewer?.avatar_url || "/avatar.jpg"}
                      alt={`${review.reviewer?.full_name}'s avatar`}
                      className="h-10 w-10 rounded-full"
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
          profiles!user_id (
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
                  src={teacher.profiles?.avatar_url || "/avatar.jpg"}
                  alt={`${teacher.profiles?.full_name}'s avatar`}
                  className="h-10 w-10 rounded-full"
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
