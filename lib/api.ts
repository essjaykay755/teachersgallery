import { TeacherExperience, TeacherEducation } from "./supabase";

/**
 * Fetches experiences for a specific teacher
 * @param teacherId The ID of the teacher
 * @returns Promise with the experiences data
 */
export async function fetchTeacherExperiences(
  teacherId: string
): Promise<TeacherExperience[]> {
  try {
    const response = await fetch(
      `/api/teacher/experience?teacher_id=${teacherId}`
    );

    if (!response.ok) {
      const error = await response.json();
      // Log the error but don't throw, just return empty array
      console.log("Error fetching teacher experiences:", error.error || response.statusText);
      return [];
    }

    const { data } = await response.json();
    return data || [];
  } catch (error) {
    // Log the error but don't throw, just return empty array
    console.log("Exception fetching teacher experiences:", error);
    return [];
  }
}

/**
 * Fetches education for a specific teacher
 * @param teacherId The ID of the teacher
 * @returns Promise with the education data
 */
export async function fetchTeacherEducations(
  teacherId: string
): Promise<TeacherEducation[]> {
  try {
    const response = await fetch(
      `/api/teacher/education?teacher_id=${teacherId}`
    );

    if (!response.ok) {
      const error = await response.json();
      // Log the error but don't throw, just return empty array
      console.log("Error fetching teacher educations:", error.error || response.statusText);
      return [];
    }

    const { data } = await response.json();
    return data || [];
  } catch (error) {
    // Log the error but don't throw, just return empty array
    console.log("Exception fetching teacher educations:", error);
    return [];
  }
}

/**
 * Adds a new experience for a teacher
 * @param experience The experience data to add
 * @returns Promise with the created experience data
 */
export async function addTeacherExperience(
  experience: Omit<TeacherExperience, "id" | "teacher_id" | "created_at">
): Promise<TeacherExperience | null> {
  try {
    const response = await fetch("/api/teacher/experience", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(experience),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to add teacher experience");
    }

    const { data } = await response.json();
    return data;
  } catch (error) {
    console.error("Error adding teacher experience:", error);
    return null;
  }
}

/**
 * Adds a new education for a teacher
 * @param education The education data to add
 * @returns Promise with the created education data
 */
export async function addTeacherEducation(
  education: Omit<TeacherEducation, "id" | "teacher_id" | "created_at">
): Promise<TeacherEducation | null> {
  try {
    const response = await fetch("/api/teacher/education", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(education),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to add teacher education");
    }

    const { data } = await response.json();
    return data;
  } catch (error) {
    console.error("Error adding teacher education:", error);
    return null;
  }
}

/**
 * Deletes a teacher experience
 * @param experienceId The ID of the experience to delete
 * @returns Promise indicating success or failure
 */
export async function deleteTeacherExperience(
  experienceId: string
): Promise<boolean> {
  try {
    const response = await fetch(`/api/teacher/experience?id=${experienceId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to delete teacher experience");
    }

    return true;
  } catch (error) {
    console.error("Error deleting teacher experience:", error);
    return false;
  }
}

/**
 * Deletes a teacher education
 * @param educationId The ID of the education to delete
 * @returns Promise indicating success or failure
 */
export async function deleteTeacherEducation(
  educationId: string
): Promise<boolean> {
  try {
    const response = await fetch(`/api/teacher/education?id=${educationId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to delete teacher education");
    }

    return true;
  } catch (error) {
    console.error("Error deleting teacher education:", error);
    return false;
  }
}

/**
 * Fetches a paginated list of teachers with filters
 * @param page The page number to fetch (default 1)
 * @param limit The number of items per page (default 10)
 * @param subject Optional filter for subject
 * @param location Optional filter for location
 * @param minRating Optional filter for minimum rating
 * @param searchQuery Optional search query
 * @param sortField Optional field to sort by (rating or created_at)
 * @param sortOrder Optional sort order (asc or desc)
 * @returns Promise with the paginated teachers data and metadata
 */
export async function fetchTeachers({
  page = 1,
  limit = 10,
  subject = "",
  location = "",
  minRating = "",
  searchQuery = "",
  sortField = "created_at",
  sortOrder = "desc",
} = {}) {
  try {
    let url = `/api/teachers?page=${page}&limit=${limit}`;
    
    if (subject) url += `&subject=${encodeURIComponent(subject)}`;
    if (location) url += `&location=${encodeURIComponent(location)}`;
    if (minRating) url += `&minRating=${minRating}`;
    if (searchQuery) url += `&search=${encodeURIComponent(searchQuery)}`;
    if (sortField) url += `&sortField=${sortField}`;
    if (sortOrder) url += `&sortOrder=${sortOrder}`;
    
    const response = await fetch(url);

    if (!response.ok) {
      const error = await response.json();
      console.error("Error fetching teachers:", error.error || response.statusText);
      return { data: [], metadata: { total: 0, page, limit, hasMore: false } };
    }

    return await response.json();
  } catch (error) {
    console.error("Exception fetching teachers:", error);
    return { data: [], metadata: { total: 0, page, limit, hasMore: false } };
  }
}

/**
 * Fetches a single teacher's profile by ID
 * @param id The teacher ID to fetch
 * @returns Promise with the teacher profile data or null if not found
 */
export async function fetchTeacherProfile(id: string) {
  try {
    const response = await fetch(`/api/teachers/${id}`);

    if (!response.ok) {
      const error = await response.json();
      console.error("Error fetching teacher profile:", error.error || response.statusText);
      return null;
    }

    const { data } = await response.json();
    return data;
  } catch (error) {
    console.error("Exception fetching teacher profile:", error);
    return null;
  }
}
