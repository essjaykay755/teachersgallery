export type PaginationParams = {
  page: number;
  limit: number;
};

export type PaginatedResponse<T> = {
  data: T[];
  metadata: {
    total: number;
    page: number;
    limit: number;
    hasMore: boolean;
  };
};

export type OnboardingStep =
  | "user-type"
  | "profile-details"
  | "student-details"
  | "parent-details"
  | "teacher-details"
  | "teacher-qualifications"
  | "teacher-preferences"
  | "complete";

export type OnboardingState = {
  currentStep: OnboardingStep;
  userData: {
    userType?: "teacher" | "student" | "parent";
    fullName?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    avatarUrl?: string;
    // Student-specific fields
    grade?: string;
    interests?: string[];
    // Parent-specific fields
    childrenCount?: string;
    childrenGrades?: string[];
    // Teacher-specific fields
    teacherProfile?: {
      subject: string[];
      location: string;
      fee: string;
      about: string;
      tags: string[];
      // Teaching preferences
      teachingModes?: string[];
      experience?: string;
      degree?: string;
      specialization?: string;
      // Educational and professional background
      experiences?: Array<{
        title: string;
        institution: string;
        period: string;
        description?: string;
      }>;
      educations?: Array<{
        degree: string;
        institution: string;
        year: string;
        description?: string;
      }>;
    };
  };
};
