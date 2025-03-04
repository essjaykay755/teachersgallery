"use client";

import { useState, useEffect } from "react";
import { TeacherExperience, TeacherEducation } from "@/lib/supabase";
import {
  fetchTeacherExperiences,
  fetchTeacherEducations,
  addTeacherExperience,
  addTeacherEducation,
  deleteTeacherExperience,
  deleteTeacherEducation,
} from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Trash2, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type Props = {
  teacherId: string;
};

export default function TeacherExperienceEducationManager({
  teacherId,
}: Props) {
  const [experiences, setExperiences] = useState<TeacherExperience[]>([]);
  const [educations, setEducations] = useState<TeacherEducation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // New experience form
  const [newExperience, setNewExperience] = useState<
    Omit<TeacherExperience, "id" | "teacher_id" | "created_at">
  >({
    title: "",
    institution: "",
    period: "",
    description: "",
  });

  // New education form
  const [newEducation, setNewEducation] = useState<
    Omit<TeacherEducation, "id" | "teacher_id" | "created_at">
  >({
    degree: "",
    institution: "",
    year: "",
    description: "",
  });

  const [isAddingExperience, setIsAddingExperience] = useState(false);
  const [isAddingEducation, setIsAddingEducation] = useState(false);
  const [isSubmittingExperience, setIsSubmittingExperience] = useState(false);
  const [isSubmittingEducation, setIsSubmittingEducation] = useState(false);
  const [isDeletingExperience, setIsDeletingExperience] = useState<
    string | null
  >(null);
  const [isDeletingEducation, setIsDeletingEducation] = useState<string | null>(
    null
  );

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        setError(null);

        const [experiencesData, educationsData] = await Promise.all([
          fetchTeacherExperiences(teacherId),
          fetchTeacherEducations(teacherId),
        ]);

        setExperiences(experiencesData);
        setEducations(educationsData);
      } catch (err) {
        setError("Failed to load teacher data");
        console.error("Error loading teacher experience/education:", err);
      } finally {
        setIsLoading(false);
      }
    }

    if (teacherId) {
      loadData();
    }
  }, [teacherId]);

  const handleAddExperience = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !newExperience.title ||
      !newExperience.institution ||
      !newExperience.period
    ) {
      return;
    }

    try {
      setIsSubmittingExperience(true);
      const result = await addTeacherExperience(newExperience);

      if (result) {
        setExperiences([...experiences, result]);
        setNewExperience({
          title: "",
          institution: "",
          period: "",
          description: "",
        });
        setIsAddingExperience(false);
      }
    } catch (err) {
      console.error("Error adding experience:", err);
    } finally {
      setIsSubmittingExperience(false);
    }
  };

  const handleAddEducation = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !newEducation.degree ||
      !newEducation.institution ||
      !newEducation.year
    ) {
      return;
    }

    try {
      setIsSubmittingEducation(true);
      const result = await addTeacherEducation(newEducation);

      if (result) {
        setEducations([...educations, result]);
        setNewEducation({
          degree: "",
          institution: "",
          year: "",
          description: "",
        });
        setIsAddingEducation(false);
      }
    } catch (err) {
      console.error("Error adding education:", err);
    } finally {
      setIsSubmittingEducation(false);
    }
  };

  const handleDeleteExperience = async (experienceId: string) => {
    try {
      setIsDeletingExperience(experienceId);
      const success = await deleteTeacherExperience(experienceId);

      if (success) {
        setExperiences(experiences.filter((exp) => exp.id !== experienceId));
      }
    } catch (err) {
      console.error("Error deleting experience:", err);
    } finally {
      setIsDeletingExperience(null);
    }
  };

  const handleDeleteEducation = async (educationId: string) => {
    try {
      setIsDeletingEducation(educationId);
      const success = await deleteTeacherEducation(educationId);

      if (success) {
        setEducations(educations.filter((edu) => edu.id !== educationId));
      }
    } catch (err) {
      console.error("Error deleting education:", err);
    } finally {
      setIsDeletingEducation(null);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        <div className="h-20 bg-gray-200 rounded"></div>
        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        <div className="h-20 bg-gray-200 rounded"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-md bg-red-50 p-4">
        <div className="text-sm text-red-700">{error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Experience Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Work Experience</h3>
          {!isAddingExperience && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsAddingExperience(true)}
              className="flex items-center gap-1"
            >
              <Plus className="h-4 w-4" />
              Add Experience
            </Button>
          )}
        </div>

        {experiences.length === 0 && !isAddingExperience ? (
          <p className="text-gray-500 italic">
            No experience information available
          </p>
        ) : (
          <div className="space-y-4">
            {experiences.map((exp) => (
              <div
                key={exp.id}
                className="border border-gray-200 rounded-md p-4 relative"
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-2 h-8 w-8 text-gray-400 hover:text-red-500"
                  onClick={() => handleDeleteExperience(exp.id)}
                  disabled={isDeletingExperience === exp.id}
                >
                  {isDeletingExperience === exp.id ? (
                    <div className="h-4 w-4 border-2 border-t-transparent border-red-500 rounded-full animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </Button>
                <h4 className="font-medium">{exp.title}</h4>
                <p className="text-sm text-gray-600">{exp.institution}</p>
                <p className="text-sm text-gray-500">{exp.period}</p>
                {exp.description && (
                  <p className="mt-2 text-sm">{exp.description}</p>
                )}
              </div>
            ))}
          </div>
        )}

        {isAddingExperience && (
          <form
            onSubmit={handleAddExperience}
            className="mt-4 border border-gray-200 rounded-md p-4"
          >
            <h4 className="font-medium mb-4">Add Experience</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <Input
                  required
                  value={newExperience.title}
                  onChange={(e) =>
                    setNewExperience({
                      ...newExperience,
                      title: e.target.value,
                    })
                  }
                  placeholder="e.g., Math Teacher"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Institution
                </label>
                <Input
                  required
                  value={newExperience.institution}
                  onChange={(e) =>
                    setNewExperience({
                      ...newExperience,
                      institution: e.target.value,
                    })
                  }
                  placeholder="e.g., ABC School"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Period
                </label>
                <Input
                  required
                  value={newExperience.period}
                  onChange={(e) =>
                    setNewExperience({
                      ...newExperience,
                      period: e.target.value,
                    })
                  }
                  placeholder="e.g., 2018-2022"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description (Optional)
                </label>
                <Textarea
                  value={newExperience.description}
                  onChange={(e) =>
                    setNewExperience({
                      ...newExperience,
                      description: e.target.value,
                    })
                  }
                  rows={2}
                  placeholder="Briefly describe your responsibilities and achievements"
                />
              </div>

              <div className="flex gap-2">
                <Button
                  type="submit"
                  disabled={
                    isSubmittingExperience ||
                    !newExperience.title ||
                    !newExperience.institution ||
                    !newExperience.period
                  }
                >
                  {isSubmittingExperience ? (
                    <>
                      <div className="h-4 w-4 border-2 border-t-transparent border-white rounded-full animate-spin mr-2" />
                      Saving...
                    </>
                  ) : (
                    "Save Experience"
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAddingExperience(false)}
                  disabled={isSubmittingExperience}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </form>
        )}
      </div>

      {/* Education Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Education</h3>
          {!isAddingEducation && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsAddingEducation(true)}
              className="flex items-center gap-1"
            >
              <Plus className="h-4 w-4" />
              Add Education
            </Button>
          )}
        </div>

        {educations.length === 0 && !isAddingEducation ? (
          <p className="text-gray-500 italic">
            No education information available
          </p>
        ) : (
          <div className="space-y-4">
            {educations.map((edu) => (
              <div
                key={edu.id}
                className="border border-gray-200 rounded-md p-4 relative"
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-2 h-8 w-8 text-gray-400 hover:text-red-500"
                  onClick={() => handleDeleteEducation(edu.id)}
                  disabled={isDeletingEducation === edu.id}
                >
                  {isDeletingEducation === edu.id ? (
                    <div className="h-4 w-4 border-2 border-t-transparent border-red-500 rounded-full animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </Button>
                <h4 className="font-medium">{edu.degree}</h4>
                <p className="text-sm text-gray-600">{edu.institution}</p>
                <p className="text-sm text-gray-500">{edu.year}</p>
                {edu.description && (
                  <p className="mt-2 text-sm">{edu.description}</p>
                )}
              </div>
            ))}
          </div>
        )}

        {isAddingEducation && (
          <form
            onSubmit={handleAddEducation}
            className="mt-4 border border-gray-200 rounded-md p-4"
          >
            <h4 className="font-medium mb-4">Add Education</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Degree
                </label>
                <Input
                  required
                  value={newEducation.degree}
                  onChange={(e) =>
                    setNewEducation({ ...newEducation, degree: e.target.value })
                  }
                  placeholder="e.g., Bachelor of Science in Mathematics"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Institution
                </label>
                <Input
                  required
                  value={newEducation.institution}
                  onChange={(e) =>
                    setNewEducation({
                      ...newEducation,
                      institution: e.target.value,
                    })
                  }
                  placeholder="e.g., University of XYZ"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Year
                </label>
                <Input
                  required
                  value={newEducation.year}
                  onChange={(e) =>
                    setNewEducation({ ...newEducation, year: e.target.value })
                  }
                  placeholder="e.g., 2015"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description (Optional)
                </label>
                <Textarea
                  value={newEducation.description}
                  onChange={(e) =>
                    setNewEducation({
                      ...newEducation,
                      description: e.target.value,
                    })
                  }
                  rows={2}
                  placeholder="Additional details about your education"
                />
              </div>

              <div className="flex gap-2">
                <Button
                  type="submit"
                  disabled={
                    isSubmittingEducation ||
                    !newEducation.degree ||
                    !newEducation.institution ||
                    !newEducation.year
                  }
                >
                  {isSubmittingEducation ? (
                    <>
                      <div className="h-4 w-4 border-2 border-t-transparent border-white rounded-full animate-spin mr-2" />
                      Saving...
                    </>
                  ) : (
                    "Save Education"
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAddingEducation(false)}
                  disabled={isSubmittingEducation}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
