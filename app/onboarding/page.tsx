"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/contexts/auth";
import type { OnboardingState, OnboardingStep } from "@/lib/types";
import UserTypeStep from "./steps/user-type";
import ProfileDetailsStep from "./steps/profile-details";
import TeacherDetailsStep from "./steps/teacher-details";
import StudentDetailsStep from "./steps/student-details";
import ParentDetailsStep from "./steps/parent-details";
import TeacherQualificationsStep from "./steps/teacher-qualifications";
import TeacherPreferencesStep from "./steps/teacher-preferences";
import CompletionStep from "./steps/completion-step";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { 
  CheckCircle2, 
  ChevronRight, 
  User, 
  UserPlus, 
  GraduationCap, 
  School,
  BookOpen,
  UserCog,
  Flag
} from "lucide-react";

const INITIAL_STATE: OnboardingState = {
  currentStep: "user-type",
  userData: {},
};

// Step configuration - base steps that are always shown
const BASE_STEPS = [
  { id: "user-type", title: "User Type", icon: User },
  { id: "profile-details", title: "Profile Details", icon: UserPlus },
];

// User type-specific steps
const STUDENT_STEPS = [
  { id: "student-details", title: "Student Details", icon: School },
];

const PARENT_STEPS = [
  { id: "parent-details", title: "Parent Details", icon: UserCog },
];

const TEACHER_STEPS = [
  { id: "teacher-details", title: "Teaching Profile", icon: BookOpen },
  { id: "teacher-qualifications", title: "Qualifications", icon: GraduationCap },
  { id: "teacher-preferences", title: "Preferences", icon: CheckCircle2 },
];

// Completion step
const COMPLETION_STEP = [
  { id: "complete", title: "Complete", icon: Flag },
];

export default function OnboardingPage() {
  const { user, profile, isNewUser, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [state, setState] = useState<OnboardingState>(INITIAL_STATE);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeSteps, setActiveSteps] = useState(() => [...BASE_STEPS]);
  const [profileCreated, setProfileCreated] = useState(false);
  const supabase = createClientComponentClient();

  useEffect(() => {
    // Add debug logging for the onboarding page
    console.log("Onboarding page mounted with state:", { 
      user: !!user,
      userId: user?.id,
      profile: !!profile,
      profileId: profile?.id,
      isNewUser,
      authLoading
    });

    // Skip redirects while still loading auth state
    if (authLoading) {
      console.log("Auth still loading, waiting...");
      return;
    }

    // If user is not logged in, redirect to login
    if (!user) {
      console.log("No user found, redirecting to login");
      router.replace("/auth/login");
      return;
    }

    // If user already has a profile, redirect to dashboard
    if (profile) {
      console.log("User already has a profile, redirecting to dashboard");
      router.replace("/dashboard");
      return;
    }

    // If user is logged in but doesn't have a profile, they should stay on this page
    console.log("User is in onboarding process, proceeding...");
  }, [user, profile, isNewUser, authLoading, router]);

  // Update active steps whenever user type or current step changes
  useEffect(() => {
    let steps = [...BASE_STEPS];
    
    // When going back to user-type step, only show base steps until user selects again
    if (state.currentStep === "user-type") {
      setActiveSteps(steps);
      return;
    }
    
    // Add user type-specific steps
    if (state.userData.userType === "teacher") {
      steps = [...steps, ...TEACHER_STEPS];
    } else if (state.userData.userType === "student") {
      steps = [...steps, ...STUDENT_STEPS];
    } else if (state.userData.userType === "parent") {
      steps = [...steps, ...PARENT_STEPS];
    }
    
    // Add completion step if user has reached the final step or is going to
    if (state.currentStep === "complete" || 
        (state.userData.userType === "student" && state.currentStep === "student-details") ||
        (state.userData.userType === "parent" && state.currentStep === "parent-details") ||
        (state.userData.userType === "teacher" && state.currentStep === "teacher-preferences")) {
      steps = [...steps, ...COMPLETION_STEP];
    }
    
    setActiveSteps(steps);
    
    // Important: Log the current state for debugging
    console.log("Steps updated:", { 
      steps, 
      userType: state.userData.userType,
      currentStep: state.currentStep,
      includesCompletion: steps.some(step => step.id === "complete")
    });
  }, [state.userData.userType, state.currentStep]);

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

  const handleBack = () => {
    let previousStep: OnboardingStep = state.currentStep;
    
    switch (state.currentStep) {
      case "profile-details":
        previousStep = "user-type";
        break;
      case "student-details":
        previousStep = "profile-details";
        break;
      case "parent-details":
        previousStep = "profile-details";
        break;
      case "teacher-details":
        previousStep = "profile-details";
        break;
      case "teacher-qualifications":
        previousStep = "teacher-details";
        break;
      case "teacher-preferences":
        previousStep = "teacher-qualifications";
        break;
      default:
        return; // No back for first step or completion step
    }
    
    // When going back to user type, preserve the current selection
    console.log(`Going back to ${previousStep}, preserving data:`, state.userData);
    setState(prevState => ({
      ...prevState,
      currentStep: previousStep,
    }));
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

      // If we're coming from user-type step and the user type has changed,
      // we need to update the steps immediately
      if (state.currentStep === "user-type" && stepData.userType) {
        // Update active steps based on the new user type
        let updatedSteps = [...BASE_STEPS];
        if (stepData.userType === "teacher") {
          updatedSteps = [...updatedSteps, ...TEACHER_STEPS];
        } else if (stepData.userType === "student") {
          updatedSteps = [...updatedSteps, ...STUDENT_STEPS];
        } else if (stepData.userType === "parent") {
          updatedSteps = [...updatedSteps, ...PARENT_STEPS];
        }
        setActiveSteps(updatedSteps);
      }

      // Determine next step
      let nextStep: OnboardingStep = state.currentStep;
      switch (state.currentStep) {
        case "user-type":
          nextStep = "profile-details";
          break;
        case "profile-details":
          // Different paths based on user type
          if (newState.userData.userType === "teacher") {
            nextStep = "teacher-details";
          } else if (newState.userData.userType === "student") {
            nextStep = "student-details";
          } else if (newState.userData.userType === "parent") {
            nextStep = "parent-details";
          } else {
            nextStep = "complete";
          }
          break;
        case "student-details":
          nextStep = "complete";
          break;
        case "parent-details":
          nextStep = "complete";
          break;
        case "teacher-details":
          nextStep = "teacher-qualifications";
          break;
        case "teacher-qualifications":
          nextStep = "teacher-preferences";
          break;
        case "teacher-preferences":
          nextStep = "complete";
          break;
      }

      // If this is the final step, save everything to the database
      if (nextStep === "complete" && user && !profileCreated) {
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
            full_name: newState.userData.fullName || `${newState.userData.firstName} ${newState.userData.lastName}`,
            email: user.email || newState.userData.email, // Use Google email or direct registration email
            phone: newState.userData.phone,
            user_type: newState.userData.userType,
            avatar_url: newState.userData.avatarUrl,
          })
          .select()
          .single();

        if (profileError) throw profileError;
        
        // Log profile data after creation
        console.log("Onboarding: Profile created with data:", {
          profileId: profileData?.id,
          userType: profileData?.user_type,
          selectedUserType: newState.userData.userType,
          fullProfileData: profileData
        });

        // If user is a student, store grade info
        if (newState.userData.userType === "student" && profileData) {
          try {
            const { error: studentError } = await supabase
              .from("student_profiles")
              .insert({
                user_id: profileData.id,
                grade: newState.userData.grade,
                interests: newState.userData.interests || [],
              });

            if (studentError) {
              console.error("Failed to create student profile:", studentError);
              // Continue anyway, since the base profile was created
            }
          } catch (err) {
            console.error("Error creating student profile:", err);
            // Continue anyway, since the base profile was created
          }
        }

        // If user is a parent, store children info
        if (newState.userData.userType === "parent" && profileData) {
          try {
            const { error: parentError } = await supabase
              .from("parent_profiles")
              .insert({
                user_id: profileData.id,
                children_count: parseInt(newState.userData.childrenCount || "1"),
                children_grades: newState.userData.childrenGrades || [],
              });

            if (parentError) {
              console.error("Failed to create parent profile:", parentError);
              // Continue anyway, since the base profile was created
            }
          } catch (err) {
            console.error("Error creating parent profile:", err);
            // Continue anyway, since the base profile was created
          }
        }

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

        // Mark profile as created to prevent duplicate creation
        setProfileCreated(true);

        // Trigger a revalidation of the auth context by refreshing the session
        const { error: refreshError } = await supabase.auth.refreshSession();
        if (refreshError) throw refreshError;

        // Add more robust logging to track the completion process
        console.log("Profile creation complete, moving to completion step", {
          userType: newState.userData.userType,
          profileCreated,
          nextStep
        });

        // Wait for a short delay to ensure the auth context is updated
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Increased from 500ms to 1000ms

        // Force a state update before router refresh to ensure UI updates
        setState({ ...newState, currentStep: nextStep });
        
        // Update the router to refresh auth context but don't redirect yet
        router.refresh();
      }

      // Update state with next step (moved this outside the if block to ensure it always executes)
      setState((prevState) => {
        console.log("Updating state to next step:", { 
          current: prevState.currentStep, 
          next: nextStep,
          isComplete: nextStep === "complete"
        });
        return { ...newState, currentStep: nextStep };
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  // Get current step index and calculate progress
  const currentStepIndex = activeSteps.findIndex(step => step.id === state.currentStep);
  // If step not found in active steps (e.g., when switching from teacher to student/parent),
  // default to the profile-details step
  const safeCurrentStepIndex = currentStepIndex === -1 
    ? activeSteps.findIndex(step => step.id === "profile-details") 
    : currentStepIndex;
  
  const progressPercentage = activeSteps.length > 1 
    ? Math.round((safeCurrentStepIndex / (activeSteps.length - 1)) * 100) 
    : 0;

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Only show progress steps if not on completion step */}
          {state.currentStep !== "complete" && (
            <>
              {/* Progress steps */}
              <div className="mb-8">
                <div className="flex items-center justify-between relative">
                  {activeSteps.map((step, index) => (
                    <div 
                      key={step.id} 
                      className="flex flex-col items-center z-10"
                    >
                      <div className={`
                        w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300
                        ${index <= safeCurrentStepIndex ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}
                      `}>
                        <step.icon className="w-5 h-5" />
                      </div>
                      <span className={`
                        mt-2 text-xs transition-colors duration-300
                        ${index <= safeCurrentStepIndex ? 'text-primary font-medium' : 'text-muted-foreground'}
                      `}>
                        {step.title}
                      </span>
                    </div>
                  ))}
                  
                  {/* Progress connector line */}
                  <div className="absolute left-0 right-0 top-5 h-0.5 bg-muted -z-10">
                    <div 
                      className="h-full bg-primary transition-all duration-500 ease-in-out" 
                      style={{ width: `${progressPercentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Current step indicator below each step */}
              <div className="mb-6 text-center">
                <p className="text-sm font-medium">
                  Step {safeCurrentStepIndex + 1} of {activeSteps.length}: <span className="text-primary">{activeSteps[safeCurrentStepIndex].title}</span>
                </p>
                <div className="w-full h-2 bg-muted rounded-full mt-2 overflow-hidden">
                  <div 
                    className="h-full bg-primary rounded-full transition-all duration-500 ease-in-out"
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
              </div>
            </>
          )}

          {/* Error message */}
          {error && (
            <div className="mb-4 rounded-md bg-destructive/10 p-4">
              <div className="text-sm text-destructive">{error}</div>
            </div>
          )}
          
          {/* Step content */}
          <Card>
            {state.currentStep === "user-type" && (
              <UserTypeStep
                initialData={state.userData}
                onNext={handleNext}
                isLoading={isLoading}
                showBackButton={false}
                onBack={handleBack}
              />
            )}

            {state.currentStep === "profile-details" && (
              <ProfileDetailsStep
                initialData={state.userData}
                onNext={handleNext}
                isLoading={isLoading}
                showBackButton={true}
                onBack={handleBack}
              />
            )}

            {state.currentStep === "student-details" && (
              <StudentDetailsStep
                initialData={state.userData}
                onNext={handleNext}
                isLoading={isLoading}
                showBackButton={true}
                onBack={handleBack}
              />
            )}

            {state.currentStep === "parent-details" && (
              <ParentDetailsStep
                initialData={state.userData}
                onNext={handleNext}
                isLoading={isLoading}
                showBackButton={true}
                onBack={handleBack}
              />
            )}

            {state.currentStep === "teacher-details" && (
              <TeacherDetailsStep
                initialData={state.userData}
                onNext={handleNext}
                isLoading={isLoading}
                showBackButton={true}
                onBack={handleBack}
              />
            )}

            {state.currentStep === "teacher-qualifications" && (
              <TeacherQualificationsStep
                initialData={state.userData}
                onNext={handleNext}
                isLoading={isLoading}
                showBackButton={true}
                onBack={handleBack}
              />
            )}

            {state.currentStep === "teacher-preferences" && (
              <TeacherPreferencesStep
                initialData={state.userData}
                onNext={handleNext}
                isLoading={isLoading}
                showBackButton={true}
                onBack={handleBack}
              />
            )}

            {state.currentStep === "complete" && (
              <CompletionStep 
                key={`completion-${profileCreated ? 'created' : 'pending'}-${Date.now()}`} 
                userType={state.userData.userType || "user"} 
              />
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
