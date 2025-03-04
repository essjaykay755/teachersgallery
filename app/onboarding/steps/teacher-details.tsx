"use client";

import { useState } from "react";
import type { OnboardingState } from "@/lib/types";
import { TeacherExperience, TeacherEducation } from "@/lib/supabase";

type Props = {
  initialData: OnboardingState["userData"];
  onNext: (data: Partial<OnboardingState["userData"]>) => void;
  isLoading: boolean;
};

type ExperienceItem = Omit<
  TeacherExperience,
  "id" | "teacher_id" | "created_at"
>;
type EducationItem = Omit<TeacherEducation, "id" | "teacher_id" | "created_at">;

export default function TeacherDetailsStep({
  initialData,
  onNext,
  isLoading,
}: Props) {
  const [subject, setSubject] = useState<string[]>(
    initialData.teacherProfile?.subject || []
  );
  const [location, setLocation] = useState(
    initialData.teacherProfile?.location || ""
  );
  const [fee, setFee] = useState(initialData.teacherProfile?.fee || "");
  const [about, setAbout] = useState(initialData.teacherProfile?.about || "");
  const [tags, setTags] = useState<string[]>(
    initialData.teacherProfile?.tags || []
  );
  const [newTag, setNewTag] = useState("");
  const [newSubject, setNewSubject] = useState("");

  // Experience and Education
  const [experiences, setExperiences] = useState<ExperienceItem[]>([]);
  const [educations, setEducations] = useState<EducationItem[]>([]);

  // New experience form
  const [newExperience, setNewExperience] = useState<ExperienceItem>({
    title: "",
    institution: "",
    period: "",
    description: "",
  });

  // New education form
  const [newEducation, setNewEducation] = useState<EducationItem>({
    degree: "",
    institution: "",
    year: "",
    description: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext({
      teacherProfile: {
        subject,
        location,
        fee,
        about,
        tags,
        experiences,
        educations,
      },
    });
  };

  const addSubject = () => {
    if (newSubject && !subject.includes(newSubject)) {
      setSubject([...subject, newSubject]);
      setNewSubject("");
    }
  };

  const removeSubject = (subjectToRemove: string) => {
    setSubject(subject.filter((s) => s !== subjectToRemove));
  };

  const addTag = () => {
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const addExperience = () => {
    if (
      newExperience.title &&
      newExperience.institution &&
      newExperience.period
    ) {
      setExperiences([...experiences, { ...newExperience }]);
      setNewExperience({
        title: "",
        institution: "",
        period: "",
        description: "",
      });
    }
  };

  const removeExperience = (index: number) => {
    setExperiences(experiences.filter((_, i) => i !== index));
  };

  const addEducation = () => {
    if (newEducation.degree && newEducation.institution && newEducation.year) {
      setEducations([...educations, { ...newEducation }]);
      setNewEducation({
        degree: "",
        institution: "",
        year: "",
        description: "",
      });
    }
  };

  const removeEducation = (index: number) => {
    setEducations(educations.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Teacher Profile</h2>
        <p className="mt-2 text-sm text-gray-600">
          Tell us about your teaching experience
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Subjects You Teach
          </label>
          <div className="mt-1 space-y-2">
            <div className="flex space-x-2">
              <input
                type="text"
                value={newSubject}
                onChange={(e) => setNewSubject(e.target.value)}
                placeholder="Add a subject"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
              <button
                type="button"
                onClick={addSubject}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {subject.map((s) => (
                <span
                  key={s}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                >
                  {s}
                  <button
                    type="button"
                    onClick={() => removeSubject(s)}
                    className="ml-1 inline-flex items-center p-0.5 rounded-full text-indigo-400 hover:bg-indigo-200 hover:text-indigo-500 focus:outline-none"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        <div>
          <label
            htmlFor="location"
            className="block text-sm font-medium text-gray-700"
          >
            Location
          </label>
          <input
            type="text"
            id="location"
            required
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label
            htmlFor="fee"
            className="block text-sm font-medium text-gray-700"
          >
            Fee Structure
          </label>
          <input
            type="text"
            id="fee"
            required
            value={fee}
            onChange={(e) => setFee(e.target.value)}
            placeholder="e.g., $50/hour"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label
            htmlFor="about"
            className="block text-sm font-medium text-gray-700"
          >
            About You
          </label>
          <textarea
            id="about"
            required
            rows={4}
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Tell students about your teaching experience, qualifications, and teaching style"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Tags
          </label>
          <div className="mt-1 space-y-2">
            <div className="flex space-x-2">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add a tag"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
              <button
                type="button"
                onClick={addTag}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-1 inline-flex items-center p-0.5 rounded-full text-indigo-400 hover:bg-indigo-200 hover:text-indigo-500 focus:outline-none"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Experience Section */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-medium text-gray-900">Work Experience</h3>

          {/* Experience List */}
          {experiences.length > 0 && (
            <div className="mt-4 space-y-4">
              {experiences.map((exp, index) => (
                <div
                  key={index}
                  className="rounded-md border border-gray-200 p-4 relative"
                >
                  <button
                    type="button"
                    onClick={() => removeExperience(index)}
                    className="absolute right-2 top-2 text-red-500 hover:text-red-700"
                    aria-label="Remove experience"
                  >
                    ×
                  </button>
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

          {/* Add Experience Form */}
          <div className="mt-4 rounded-md border border-gray-200 p-4">
            <h4 className="font-medium mb-4">Add Experience</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Title
                </label>
                <input
                  type="text"
                  value={newExperience.title}
                  onChange={(e) =>
                    setNewExperience({
                      ...newExperience,
                      title: e.target.value,
                    })
                  }
                  placeholder="e.g., Math Teacher"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Institution
                </label>
                <input
                  type="text"
                  value={newExperience.institution}
                  onChange={(e) =>
                    setNewExperience({
                      ...newExperience,
                      institution: e.target.value,
                    })
                  }
                  placeholder="e.g., ABC School"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Period
                </label>
                <input
                  type="text"
                  value={newExperience.period}
                  onChange={(e) =>
                    setNewExperience({
                      ...newExperience,
                      period: e.target.value,
                    })
                  }
                  placeholder="e.g., 2018-2022"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Description (Optional)
                </label>
                <textarea
                  value={newExperience.description}
                  onChange={(e) =>
                    setNewExperience({
                      ...newExperience,
                      description: e.target.value,
                    })
                  }
                  rows={2}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder="Briefly describe your responsibilities and achievements"
                />
              </div>

              <button
                type="button"
                onClick={addExperience}
                disabled={
                  !newExperience.title ||
                  !newExperience.institution ||
                  !newExperience.period
                }
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Experience
              </button>
            </div>
          </div>
        </div>

        {/* Education Section */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-medium text-gray-900">Education</h3>

          {/* Education List */}
          {educations.length > 0 && (
            <div className="mt-4 space-y-4">
              {educations.map((edu, index) => (
                <div
                  key={index}
                  className="rounded-md border border-gray-200 p-4 relative"
                >
                  <button
                    type="button"
                    onClick={() => removeEducation(index)}
                    className="absolute right-2 top-2 text-red-500 hover:text-red-700"
                    aria-label="Remove education"
                  >
                    ×
                  </button>
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

          {/* Add Education Form */}
          <div className="mt-4 rounded-md border border-gray-200 p-4">
            <h4 className="font-medium mb-4">Add Education</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Degree
                </label>
                <input
                  type="text"
                  value={newEducation.degree}
                  onChange={(e) =>
                    setNewEducation({ ...newEducation, degree: e.target.value })
                  }
                  placeholder="e.g., Bachelor of Science in Mathematics"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Institution
                </label>
                <input
                  type="text"
                  value={newEducation.institution}
                  onChange={(e) =>
                    setNewEducation({
                      ...newEducation,
                      institution: e.target.value,
                    })
                  }
                  placeholder="e.g., University of XYZ"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Year
                </label>
                <input
                  type="text"
                  value={newEducation.year}
                  onChange={(e) =>
                    setNewEducation({ ...newEducation, year: e.target.value })
                  }
                  placeholder="e.g., 2015"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Description (Optional)
                </label>
                <textarea
                  value={newEducation.description}
                  onChange={(e) =>
                    setNewEducation({
                      ...newEducation,
                      description: e.target.value,
                    })
                  }
                  rows={2}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder="Additional details about your education"
                />
              </div>

              <button
                type="button"
                onClick={addEducation}
                disabled={
                  !newEducation.degree ||
                  !newEducation.institution ||
                  !newEducation.year
                }
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Education
              </button>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Processing..." : "Complete Profile"}
        </button>
      </form>
    </div>
  );
}
