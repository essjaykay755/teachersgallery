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
  | "teacher-details"
  | "complete";

export type OnboardingState = {
  currentStep: OnboardingStep;
  userData: {
    userType?: "teacher" | "student" | "parent";
    fullName?: string;
    phone?: string;
    avatarUrl?: string;
    teacherProfile?: {
      subject: string[];
      location: string;
      fee: string;
      about: string;
      tags: string[];
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
