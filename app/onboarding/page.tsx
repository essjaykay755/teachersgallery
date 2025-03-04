"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/contexts/auth";
import type { OnboardingState, OnboardingStep } from "@/lib/types";
import UserTypeStep from "./steps/user-type";
import ProfileDetailsStep from "./steps/profile-details";
import TeacherDetailsStep from "./steps/teacher-details";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

const INITIAL_STATE: OnboardingState = {
  currentStep: "user-type",
  userData: {},
};

export default function OnboardingPage() {
  const { user, profile } = useAuth();
  const router = useRouter();
  const [state, setState] = useState<OnboardingState>(INITIAL_STATE);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClientComponentClient();

  useEffect(() => {
    // If user is not logged in, redirect to login
    if (!user) {
      router.replace("/auth/login");
      return;
    }

    // If user already has a profile, redirect to dashboard
    if (profile) {
      router.replace("/dashboard");
      return;
    }
  }, [user, profile, router]);

  // Function to ensure the avatars bucket exists
  const ensureAvatarsBucket = async (): Promise<boolean> => {
    try {
      const response = await fetch("/api/storage/ensure-bucket", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const data = await response.json();
        console.error("Error ensuring avatars bucket:", data.error);
        return false;
      }

      return true;
    } catch (err) {
      console.error("Failed to ensure avatars bucket:", err);
      return false;
    }
  };

  const handleNext = async (stepData: Partial<OnboardingState["userData"]>) => {
    try {
      setIsLoading(true);
      setError(null);

      // Update state with new data
      const newState = {
        ...state,
        userData: { ...state.userData, ...stepData },
      };

      // Determine next step
      let nextStep: OnboardingStep = state.currentStep;
      switch (state.currentStep) {
        case "user-type":
          nextStep = "profile-details";
          break;
        case "profile-details":
          nextStep =
            newState.userData.userType === "teacher"
              ? "teacher-details"
              : "complete";
          break;
        case "teacher-details":
          nextStep = "complete";
          break;
      }

      // If this is the final step, save everything to the database
      if (nextStep === "complete" && user) {
        // If this is a teacher registration, ensure the avatars bucket exists
        if (newState.userData.userType === "teacher") {
          const bucketExists = await ensureAvatarsBucket();
          if (!bucketExists) {
            console.warn(
              "Could not ensure avatars bucket exists, but continuing anyway"
            );
            // We'll continue anyway and let the upload handle any errors
          }
        }

        // Create basic profile
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .insert({
            id: user.id,
            full_name: newState.userData.fullName,
            email: user.email,
            phone: newState.userData.phone,
            user_type: newState.userData.userType,
            avatar_url: newState.userData.avatarUrl,
          })
          .select()
          .single();

        if (profileError) throw profileError;

        // If user is a teacher, create teacher profile
        if (
          newState.userData.userType === "teacher" &&
          newState.userData.teacherProfile &&
          profileData
        ) {
          // Extract experiences and educations from teacherProfile
          const { experiences, educations, ...teacherProfileData } =
            newState.userData.teacherProfile;

          // Create teacher profile
          const { data: teacherData, error: teacherError } = await supabase
            .from("teacher_profiles")
            .insert({
              user_id: profileData.id,
              ...teacherProfileData,
            })
            .select()
            .single();

          if (teacherError) throw teacherError;

          // Add experiences if any
          if (experiences && experiences.length > 0 && teacherData) {
            const experiencesWithTeacherId = experiences.map((exp) => ({
              ...exp,
              teacher_id: teacherData.id,
            }));

            const { error: experiencesError } = await supabase
              .from("teacher_experiences")
              .insert(experiencesWithTeacherId);

            if (experiencesError) throw experiencesError;
          }

          // Add educations if any
          if (educations && educations.length > 0 && teacherData) {
            const educationsWithTeacherId = educations.map((edu) => ({
              ...edu,
              teacher_id: teacherData.id,
            }));

            const { error: educationsError } = await supabase
              .from("teacher_educations")
              .insert(educationsWithTeacherId);

            if (educationsError) throw educationsError;
          }
        }

        // Trigger a revalidation of the auth context by refreshing the session
        const { error: refreshError } = await supabase.auth.refreshSession();
        if (refreshError) throw refreshError;

        // Wait for a short delay to ensure the auth context is updated
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Redirect to dashboard after successful profile creation
        router.refresh(); // Refresh the router to update auth context
        router.replace("/dashboard");
        return;
      }

      // Update state with next step
      setState({ ...newState, currentStep: nextStep });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        {error && (
          <div className="mb-4 rounded-md bg-red-50 p-4">
            <div className="text-sm text-red-700">{error}</div>
          </div>
        )}

        {state.currentStep === "user-type" && (
          <UserTypeStep
            initialData={state.userData}
            onNext={handleNext}
            isLoading={isLoading}
          />
        )}

        {state.currentStep === "profile-details" && (
          <ProfileDetailsStep
            initialData={state.userData}
            onNext={handleNext}
            isLoading={isLoading}
          />
        )}

        {state.currentStep === "teacher-details" && (
          <TeacherDetailsStep
            initialData={state.userData}
            onNext={handleNext}
            isLoading={isLoading}
          />
        )}
      </div>
    </div>
  );
}
