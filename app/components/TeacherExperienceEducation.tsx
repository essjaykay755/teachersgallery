"use client";

import { useState, useEffect } from "react";
import { TeacherExperience, TeacherEducation } from "@/lib/supabase";
import { fetchTeacherExperiences, fetchTeacherEducations } from "@/lib/api";

type Props = {
  teacherId: string;
  isEditable?: boolean;
};

export default function TeacherExperienceEducation({
  teacherId,
  isEditable = false,
}: Props) {
  const [experiences, setExperiences] = useState<TeacherExperience[]>([]);
  const [educations, setEducations] = useState<TeacherEducation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Work Experience
        </h3>

        {experiences.length === 0 ? (
          <p className="text-gray-500 italic">
            No experience information available
          </p>
        ) : (
          <div className="space-y-4">
            {experiences.map((exp) => (
              <div
                key={exp.id}
                className="border border-gray-200 rounded-md p-4"
              >
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
      </div>

      {/* Education Section */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Education</h3>

        {educations.length === 0 ? (
          <p className="text-gray-500 italic">
            No education information available
          </p>
        ) : (
          <div className="space-y-4">
            {educations.map((edu) => (
              <div
                key={edu.id}
                className="border border-gray-200 rounded-md p-4"
              >
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
      </div>
    </div>
  );
}
