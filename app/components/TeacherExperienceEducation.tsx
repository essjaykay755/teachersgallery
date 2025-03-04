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

        // Use Promise.allSettled instead of Promise.all to handle partial failures
        const results = await Promise.allSettled([
          fetchTeacherExperiences(teacherId),
          fetchTeacherEducations(teacherId),
        ]);

        // Check results and handle accordingly
        if (results[0].status === 'fulfilled') {
          setExperiences(results[0].value);
        } else {
          console.log("Failed to load experiences:", results[0].reason);
        }

        if (results[1].status === 'fulfilled') {
          setEducations(results[1].value);
        } else {
          console.log("Failed to load educations:", results[1].reason);
        }

        // If both failed, set an error
        if (results[0].status === 'rejected' && results[1].status === 'rejected') {
          setError("Failed to fetch teacher experiences and education");
        }
      } catch (err) {
        // This catch block will only run if there's an error in the try block itself
        // not from the Promise.allSettled results
        console.log("Error in loadData function:", err);
        setError("Failed to load teacher data");
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
