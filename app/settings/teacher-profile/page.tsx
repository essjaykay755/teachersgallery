"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/contexts/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import TeacherExperienceEducationManager from "@/app/components/TeacherExperienceEducationManager";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import type { TeacherProfile } from "@/lib/supabase";

export default function TeacherProfilePage() {
  const { user, profile } = useAuth();
  const [isClient, setIsClient] = useState(false);
  const [teacherProfile, setTeacherProfile] = useState<TeacherProfile | null>(null);
  
  // Teacher profile form state
  const [teacherFormData, setTeacherFormData] = useState({
    subject: [] as string[],
    location: "",
    fee: "",
    about: "",
    tags: [] as string[],
    is_listed: true,
    newSubject: "",
    newTag: "",
  });

  useEffect(() => {
    setIsClient(true);
    
    // Load teacher profile if user is a teacher
    if (profile?.user_type === "teacher" && user) {
      fetchTeacherProfile();
    }
  }, [profile, user]);

  const fetchTeacherProfile = async () => {
    if (!user) return;
    
    try {
      const supabase = createClientComponentClient();
      const { data, error } = await supabase
        .from("teacher_profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();
        
      if (error) {
        console.error("Error fetching teacher profile:", error);
      } else if (data) {
        setTeacherProfile(data);
      }
    } catch (error) {
      console.error("Error fetching teacher profile:", error);
    }
  };

  const handleAddSubject = () => {
    if (teacherFormData.newSubject.trim() !== "" && !teacherFormData.subject.includes(teacherFormData.newSubject.trim())) {
      setTeacherFormData({
        ...teacherFormData,
        subject: [...teacherFormData.subject, teacherFormData.newSubject.trim()],
        newSubject: "",
      });
    }
  };

  const handleRemoveSubject = (subject: string) => {
    setTeacherFormData({
      ...teacherFormData,
      subject: teacherFormData.subject.filter((s) => s !== subject),
    });
  };

  const handleAddTag = () => {
    if (teacherFormData.newTag.trim() !== "" && !teacherFormData.tags.includes(teacherFormData.newTag.trim())) {
      setTeacherFormData({
        ...teacherFormData,
        tags: [...teacherFormData.tags, teacherFormData.newTag.trim()],
        newTag: "",
      });
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTeacherFormData({
      ...teacherFormData,
      tags: teacherFormData.tags.filter((t) => t !== tag),
    });
  };

  if (!isClient) {
    return null;
  }

  // Redirect or show message if user is not a teacher
  if (profile?.user_type !== "teacher") {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-6">Teacher Profile</h1>
        <Card>
          <CardHeader>
            <CardTitle>Teacher Profile</CardTitle>
            <CardDescription>
              This section is only available for teacher accounts.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Teacher Profile</h1>
      <Card>
        <CardHeader>
          <CardTitle>Teacher Profile</CardTitle>
          <CardDescription>
            Manage your teacher profile information that will be visible to students.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <Label className="block text-sm font-medium text-gray-700">
                Subjects You Teach
              </Label>
              <div className="mt-1 space-y-2">
                <div className="flex space-x-2">
                  <Input
                    type="text"
                    value={teacherFormData.newSubject}
                    onChange={(e) =>
                      setTeacherFormData({ ...teacherFormData, newSubject: e.target.value })
                    }
                    placeholder="Add a subject"
                    className="block w-full"
                  />
                  <Button 
                    type="button"
                    onClick={handleAddSubject}
                  >
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {teacherFormData.subject.map((subject) => (
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
              <Label
                htmlFor="location"
                className="block text-sm font-medium text-gray-700"
              >
                Location
              </Label>
              <Input
                id="location"
                value={teacherFormData.location}
                onChange={(e) =>
                  setTeacherFormData({ ...teacherFormData, location: e.target.value })
                }
                className="mt-1 block w-full"
              />
            </div>

            <div>
              <Label
                htmlFor="fee"
                className="block text-sm font-medium text-gray-700"
              >
                Fee Structure
              </Label>
              <Input
                id="fee"
                value={teacherFormData.fee}
                onChange={(e) =>
                  setTeacherFormData({ ...teacherFormData, fee: e.target.value })
                }
                placeholder="e.g., $50/hour"
                className="mt-1 block w-full"
              />
            </div>

            <div>
              <Label
                htmlFor="about"
                className="block text-sm font-medium text-gray-700"
              >
                About You
              </Label>
              <Textarea
                id="about"
                rows={4}
                value={teacherFormData.about}
                onChange={(e) =>
                  setTeacherFormData({ ...teacherFormData, about: e.target.value })
                }
                className="mt-1 block w-full"
                placeholder="Tell students about your teaching experience, qualifications, and teaching style"
              />
            </div>

            <div>
              <Label className="block text-sm font-medium text-gray-700">
                Tags
              </Label>
              <div className="mt-1 space-y-2">
                <div className="flex space-x-2">
                  <Input
                    type="text"
                    value={teacherFormData.newTag}
                    onChange={(e) =>
                      setTeacherFormData({ ...teacherFormData, newTag: e.target.value })
                    }
                    placeholder="Add a tag"
                    className="block w-full"
                  />
                  <Button
                    type="button"
                    onClick={handleAddTag}
                  >
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {teacherFormData.tags.map((tag) => (
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

            {/* Work Experience and Education Manager */}
            {teacherProfile && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Work Experience & Education</h3>
                  <TeacherExperienceEducationManager teacherId={teacherProfile.id} />
                </div>
              </div>
            )}

            <div className="flex items-center">
              <input
                type="checkbox"
                id="is_listed"
                checked={teacherFormData.is_listed}
                onChange={(e) =>
                  setTeacherFormData({ ...teacherFormData, is_listed: e.target.checked })
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

            <Button>Save Teacher Profile</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 