"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/contexts/auth";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import type { TeacherProfile } from "@/lib/supabase";
import { uploadAvatar } from "@/lib/upload";
import TeacherExperienceEducationManager from "@/app/components/TeacherExperienceEducationManager";

export default function TeacherProfileSettings() {
  const { user, profile } = useAuth();
  const router = useRouter();
  const [teacherProfile, setTeacherProfile] = useState<TeacherProfile | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    subject: [] as string[],
    location: "",
    fee: "",
    about: "",
    tags: [] as string[],
    is_listed: false,
    newSubject: "",
    newTag: "",
  });
  const supabase = createClientComponentClient();

  useEffect(() => {
    if (!user || !profile || profile.user_type !== "teacher") {
      router.replace("/dashboard");
      return;
    }

    async function loadTeacherProfile() {
      const { data, error } = await supabase
        .from("teacher_profiles")
        .select("*")
        .eq("user_id", user!.id)
        .single();

      if (!error && data) {
        setTeacherProfile(data);
        setFormData({
          ...formData,
          subject: data.subject,
          location: data.location,
          fee: data.fee,
          about: data.about,
          tags: data.tags || [],
          is_listed: data.is_verified,
        });
      }
      setIsLoading(false);
    }

    loadTeacherProfile();
  }, [user, profile, supabase, router]);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
    }
  };

  const handleAddSubject = () => {
    if (
      formData.newSubject &&
      !formData.subject.includes(formData.newSubject)
    ) {
      setFormData({
        ...formData,
        subject: [...formData.subject, formData.newSubject],
        newSubject: "",
      });
    }
  };

  const handleRemoveSubject = (subject: string) => {
    setFormData({
      ...formData,
      subject: formData.subject.filter((s) => s !== subject),
    });
  };

  const handleAddTag = () => {
    if (formData.newTag && !formData.tags.includes(formData.newTag)) {
      setFormData({
        ...formData,
        tags: [...formData.tags, formData.newTag],
        newTag: "",
      });
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((t) => t !== tag),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !profile) {
      setError("User not authenticated");
      return;
    }

    try {
      setIsSaving(true);
      setError(null);

      // Upload new avatar if selected
      if (avatarFile) {
        // Ensure the avatars bucket exists
        try {
          const response = await fetch("/api/storage/ensure-bucket", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          });

          if (!response.ok) {
            console.warn(
              "Could not ensure avatars bucket exists, but continuing anyway"
            );
          }
        } catch (err) {
          console.warn(
            "Failed to ensure avatars bucket exists, but continuing anyway:",
            err
          );
        }

        const result = await uploadAvatar(avatarFile, user.id);
        if ("error" in result) {
          throw new Error(result.error);
        }

        // Update profile with new avatar
        const { error: updateError } = await supabase
          .from("profiles")
          .update({ avatar_url: result.url })
          .eq("id", user.id);

        if (updateError) throw updateError;
      }

      // Update or create teacher profile
      const profileData = {
        user_id: user.id,
        subject: formData.subject,
        location: formData.location,
        fee: formData.fee,
        about: formData.about,
        tags: formData.tags,
        is_verified: formData.is_listed,
      };

      const { error: teacherError } = teacherProfile
        ? await supabase
            .from("teacher_profiles")
            .update(profileData)
            .eq("id", teacherProfile.id)
        : await supabase.from("teacher_profiles").insert(profileData);

      if (teacherError) throw teacherError;

      // Trigger a revalidation of the auth context by refreshing the session
      const { error: refreshError } = await supabase.auth.refreshSession();
      if (refreshError) throw refreshError;

      // Wait for a short delay to ensure the auth context is updated
      await new Promise((resolve) => setTimeout(resolve, 500));

      router.refresh();
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save profile");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-base font-semibold text-indigo-600">
              Loading...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Teacher Profile Settings
          </h2>

          {error && (
            <div className="mb-4 rounded-md bg-red-50 p-4">
              <div className="text-sm text-red-700">{error}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Profile Picture
              </label>
              <div className="mt-1 flex items-center space-x-4">
                <img
                  src={profile?.avatar_url || "/default-avatar.png"}
                  alt=""
                  className="h-12 w-12 rounded-full"
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Subjects You Teach
              </label>
              <div className="mt-1 space-y-2">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={formData.newSubject}
                    onChange={(e) =>
                      setFormData({ ...formData, newSubject: e.target.value })
                    }
                    placeholder="Add a subject"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                  <button
                    type="button"
                    onClick={handleAddSubject}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.subject.map((subject) => (
                    <span
                      key={subject}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                    >
                      {subject}
                      <button
                        type="button"
                        onClick={() => handleRemoveSubject(subject)}
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
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
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
                value={formData.fee}
                onChange={(e) =>
                  setFormData({ ...formData, fee: e.target.value })
                }
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
                value={formData.about}
                onChange={(e) =>
                  setFormData({ ...formData, about: e.target.value })
                }
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
                    value={formData.newTag}
                    onChange={(e) =>
                      setFormData({ ...formData, newTag: e.target.value })
                    }
                    placeholder="Add a tag"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-1 inline-flex items-center p-0.5 rounded-full text-indigo-400 hover:bg-indigo-200 hover:text-indigo-500 focus:outline-none"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="is_listed"
                checked={formData.is_listed}
                onChange={(e) =>
                  setFormData({ ...formData, is_listed: e.target.checked })
                }
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label
                htmlFor="is_listed"
                className="ml-2 block text-sm text-gray-900"
              >
                List my profile publicly (students can find and contact me)
              </label>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>

          {/* Experience and Education Manager */}
          {teacherProfile && (
            <div className="mt-10 pt-10 border-t border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                Experience and Education
              </h3>
              <TeacherExperienceEducationManager
                teacherId={teacherProfile.id}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
