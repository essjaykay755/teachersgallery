"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useAuth } from "@/lib/contexts/auth";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import type { TeacherProfile, Review, Profile } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import TeacherExperienceEducation from "@/app/components/TeacherExperienceEducation";

// Create a single Supabase client instance to be reused
const supabase = createClientComponentClient();

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
  // Add a ref to track if we're already loading data to prevent loops
  const isLoadingRef = useRef(false);
  // Add a ref to track error attempts to prevent infinite retries
  const errorAttemptsRef = useRef(0);
  // Add a ref to track if component is mounted
  const isMountedRef = useRef(false);

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

  // Handle profile refresh
  const handleRefreshProfile = useCallback(async () => {
    try {
      await refreshProfile();
    } catch (error) {
      console.error("Error refreshing profile:", error);
    }
  }, [refreshProfile]);

  // Load dashboard data
  const loadData = useCallback(async () => {
    // Prevent multiple simultaneous calls
    if (isLoadingRef.current) {
      console.log("Dashboard: Already loading data, skipping");
      return;
    }

    // If we've had too many errors, don't try again automatically
    if (errorAttemptsRef.current >= 3) {
      console.log("Dashboard: Too many error attempts, skipping automatic retry");
      setError("Unable to load data after multiple attempts. Please try refreshing the page.");
      setIsLoading(false);
      return;
    }

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
    isLoadingRef.current = true;

    try {
      console.log(
        "Dashboard: Loading data for user type:",
        userProfile.user_type
      );
      if (userProfile.user_type === "teacher") {
        // Load teacher profile and reviews
        console.log("Dashboard: Fetching teacher profile");

        try {
          // Simple fetch without timeout to avoid race condition issues
          const { data: teacherData, error: teacherError } = await supabase
            .from("teacher_profiles")
            .select("*")
            .eq("user_id", user.id)
            .single();

          if (teacherError) {
            console.error("Error loading teacher profile:", teacherError);

            // If the teacher profile doesn't exist yet, don't treat it as an error
            if (teacherError.code === "PGRST116") {
              console.log("Teacher profile not found - new teacher");
              setTeacherProfile(null);
              setReviews([]);
              setIsLoading(false);
              isLoadingRef.current = false;
              return;
            }

            // Increment error attempts
            errorAttemptsRef.current += 1;
            setError("Failed to load teacher profile");
            setIsLoading(false);
            isLoadingRef.current = false;
            return;
          }

          // Reset error attempts on success
          errorAttemptsRef.current = 0;
          console.log("Dashboard: Teacher profile loaded:", teacherData);
          setTeacherProfile(teacherData);

          if (teacherData) {
            console.log("Dashboard: Fetching reviews");

            try {
              const { data: reviewsData, error: reviewsError } = await supabase
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

              if (reviewsError) {
                console.error("Error loading reviews:", reviewsError);
                setError("Failed to load reviews");
                setIsLoading(false);
                isLoadingRef.current = false;
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
          // Increment error attempts
          errorAttemptsRef.current += 1;
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
      // Increment error attempts
      errorAttemptsRef.current += 1;
      setError("An unexpected error occurred");
      setIsLoading(false);
    } finally {
      // Always reset the loading ref
      isLoadingRef.current = false;
    }
  }, [user, profile, authLoading, isTemporaryProfile]);

  // Manual refresh handler - resets error attempts counter
  const handleManualRefresh = useCallback(async () => {
    errorAttemptsRef.current = 0;
    return loadData();
  }, [loadData]);

  // Effect to load data when auth state changes
  useEffect(() => {
    // Set mounted flag
    isMountedRef.current = true;
    
    // Only load data if component is mounted and we have the necessary data
    if (isMountedRef.current && user && profile && !authLoading && !isLoadingRef.current) {
      loadData();
    }
    
    // Cleanup function
    return () => {
      isMountedRef.current = false;
    };
  }, [user, profile, authLoading, loadData]);

  // Separate effect for loading timeout
  useEffect(() => {
    // Only set timeout if we're loading and component is mounted
    if (isLoading && isMountedRef.current) {
      const timeout = setTimeout(() => {
        if (isLoading && isMountedRef.current) {
          console.log("Dashboard: Data loading timeout - showing partial UI");
          setIsLoading(false);
          setError("Some data could not be loaded. Please try refreshing.");
          isLoadingRef.current = false;
          // Increment error attempts
          errorAttemptsRef.current += 1;
        }
      }, 10000);

      return () => clearTimeout(timeout);
    }
  }, [isLoading]);

  // If auth is loading, show a loading state
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

  // If there's an auth error, show an error state with retry button
  if (authError) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <AlertCircle className="h-8 w-8 text-red-500 mr-2" />
              <h1 className="text-2xl font-bold">Connection Error</h1>
            </div>
            <p className="text-gray-700 mb-4">{authError}</p>
            <div className="flex justify-center">
              <Button onClick={handleRefreshProfile}>Retry</Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If no user is logged in, redirect to login
  if (!user) {
    router.push("/auth/login");
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">
              Redirecting to login...
            </h1>
          </div>
        </div>
      </div>
    );
  }

  // If no profile exists, show a message
  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">
              Profile Not Found
            </h1>
            <p className="text-gray-700 mb-4">
              We couldn't find your profile. Please try refreshing or contact
              support.
            </p>
            <div className="flex justify-center">
              <Button onClick={handleRefreshProfile}>Refresh Profile</Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render the appropriate dashboard based on user type
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
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

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-2 text-base font-semibold text-indigo-600">
              Loading your dashboard...
            </p>
          </div>
        ) : error ? (
          <div className="bg-white shadow rounded-lg p-6 text-center">
            <div className="flex items-center justify-center mb-4">
              <AlertCircle className="h-6 w-6 text-red-500 mr-2" />
              <h2 className="text-xl font-semibold">Error</h2>
            </div>
            <p className="mb-4 text-gray-700">{error}</p>
            <Button onClick={handleManualRefresh}>Retry</Button>
          </div>
        ) : (
          <>
            {profile.user_type === "teacher" && (
              <TeacherDashboard
                profile={profile}
                teacherProfile={teacherProfile}
                reviews={reviews}
                isLoading={isLoading}
                error={error}
                onRefresh={handleManualRefresh}
              />
            )}

            {profile.user_type === "student" && (
              <StudentDashboard profile={profile} />
            )}

            {profile.user_type === "parent" && (
              <ParentDashboard profile={profile} />
            )}
          </>
        )}
      </div>
    </div>
  );
}

interface DashboardProps {
  profile: Profile;
  teacherProfile: TeacherProfile | null;
  reviews: Review[];
  isLoading: boolean;
  error: string | null;
  onRefresh: () => Promise<void>;
}

function TeacherDashboard({
  profile,
  teacherProfile,
  reviews,
  isLoading,
  error,
  onRefresh,
}: DashboardProps) {
  const [experienceError, setExperienceError] = useState<string | null>(null);

  // Handle errors from the TeacherExperienceEducation component
  const handleExperienceError = useCallback((err: string) => {
    console.log("Experience component error handled:", err);
    setExperienceError(err);
  }, []);

  return (
    <div className="space-y-8">
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Your Teaching Profile
        </h2>
        {teacherProfile ? (
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Subjects</h3>
              <div className="mt-1 flex flex-wrap gap-2">
                {teacherProfile?.subject?.map((subject: string) => (
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
                {teacherProfile?.location}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Fee</h3>
              <p className="mt-1 text-sm text-gray-900">{teacherProfile?.fee}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Rating</h3>
              <p className="mt-1 text-sm text-gray-900">
                {teacherProfile?.rating
                  ? `${teacherProfile.rating}/5`
                  : "No ratings yet"}
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-gray-600">
              You haven't set up your teacher profile yet.
            </p>
            <Button className="mt-4">Complete Your Profile</Button>
          </div>
        )}
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
          <p className="text-center text-gray-600 py-4">No reviews yet</p>
        )}
      </div>

      {teacherProfile && (
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Experience & Education
          </h2>
          <CustomErrorBoundary fallback={<p className="text-red-500">Failed to load experience and education data. Please try again later.</p>}>
            <TeacherExperienceEducation 
              teacherId={teacherProfile.id} 
            />
          </CustomErrorBoundary>
        </div>
      )}
    </div>
  );
}

// Simple error boundary component
function CustomErrorBoundary({ children, fallback }: { children: React.ReactNode, fallback: React.ReactNode }) {
  const [hasError, setHasError] = useState(false);
  
  useEffect(() => {
    const errorHandler = (event: ErrorEvent) => {
      if (event.error && event.error.message.includes("Failed to fetch teacher")) {
        console.log("Caught error in error boundary:", event.error);
        setHasError(true);
        // Prevent the error from propagating
        event.preventDefault();
      }
    };
    
    window.addEventListener('error', errorHandler);
    
    return () => {
      window.removeEventListener('error', errorHandler);
    };
  }, []);
  
  if (hasError) {
    return <>{fallback}</>;
  }
  
  return <>{children}</>;
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
