"use client";

import { useState } from "react";
import type { OnboardingState } from "@/lib/types";
import { TeacherExperience, TeacherEducation } from "@/lib/supabase";
import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plus, X } from "lucide-react";

type Props = {
  initialData: OnboardingState["userData"];
  onNext: (data: Partial<OnboardingState["userData"]>) => void;
  isLoading: boolean;
  showBackButton: boolean;
  onBack: () => void;
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
  showBackButton,
  onBack,
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
  const [experiences, setExperiences] = useState<ExperienceItem[]>(
    initialData.teacherProfile?.experiences || []
  );
  const [educations, setEducations] = useState<EducationItem[]>(
    initialData.teacherProfile?.educations || []
  );

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
    <>
      <CardHeader>
        <CardTitle>Teacher Profile</CardTitle>
        <CardDescription>
          Tell us about your teaching experience
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form id="teacher-details-form" onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            {/* Subjects */}
            <div className="space-y-2">
              <Label>Subjects You Teach</Label>
              <div className="flex gap-2">
                <Input
                  type="text"
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  placeholder="Add a subject"
                  className="flex-1"
                />
                <Button
                  type="button"
                  onClick={addSubject}
                  size="sm"
                >
                  <Plus className="h-4 w-4 mr-1" /> Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {subject.map((s) => (
                  <Badge key={s} variant="secondary" className="gap-1">
                    {s}
                    <button
                      type="button"
                      onClick={() => removeSubject(s)}
                      className="ml-1 text-muted-foreground hover:text-foreground rounded-full"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            {/* Location */}
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                type="text"
                id="location"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Your teaching location"
              />
            </div>

            {/* Fee */}
            <div className="space-y-2">
              <Label htmlFor="fee">Fee Structure</Label>
              <Input
                type="text"
                id="fee"
                required
                value={fee}
                onChange={(e) => setFee(e.target.value)}
                placeholder="e.g., $50/hour"
              />
            </div>

            {/* About */}
            <div className="space-y-2">
              <Label htmlFor="about">About You</Label>
              <Textarea
                id="about"
                required
                rows={4}
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                placeholder="Tell students about your teaching experience, qualifications, and teaching style"
              />
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <Label>Tags</Label>
              <div className="flex gap-2">
                <Input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add a tag"
                  className="flex-1"
                />
                <Button
                  type="button"
                  onClick={addTag}
                  size="sm"
                >
                  <Plus className="h-4 w-4 mr-1" /> Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((t) => (
                  <Badge key={t} variant="outline" className="gap-1">
                    {t}
                    <button
                      type="button"
                      onClick={() => removeTag(t)}
                      className="ml-1 text-muted-foreground hover:text-foreground rounded-full"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            {/* Experience */}
            <div className="space-y-3 border rounded-md p-4">
              <h3 className="font-medium">Experience</h3>
              
              {/* List of experiences */}
              <div className="space-y-3">
                {experiences.map((exp, index) => (
                  <div key={index} className="p-3 border rounded-md bg-muted/40 relative">
                    <button
                      type="button"
                      onClick={() => removeExperience(index)}
                      className="absolute top-2 right-2 text-muted-foreground hover:text-destructive"
                    >
                      <X className="h-4 w-4" />
                    </button>
                    <div className="text-sm font-medium">{exp.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {exp.institution} • {exp.period}
                    </div>
                    {exp.description && <div className="text-xs mt-1">{exp.description}</div>}
                  </div>
                ))}
              </div>
              
              {/* Add new experience form */}
              <div className="border rounded-md p-3 space-y-3">
                <h4 className="text-sm font-medium">Add New Experience</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="exp-title" className="text-xs">Title</Label>
                    <Input
                      id="exp-title"
                      value={newExperience.title}
                      onChange={(e) =>
                        setNewExperience({ ...newExperience, title: e.target.value })
                      }
                      placeholder="Position Title"
                      size="sm"
                    />
                  </div>
                  <div>
                    <Label htmlFor="exp-institution" className="text-xs">Institution</Label>
                    <Input
                      id="exp-institution"
                      value={newExperience.institution}
                      onChange={(e) =>
                        setNewExperience({
                          ...newExperience,
                          institution: e.target.value,
                        })
                      }
                      placeholder="Company/School"
                      size="sm"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="exp-period" className="text-xs">Period</Label>
                  <Input
                    id="exp-period"
                    value={newExperience.period}
                    onChange={(e) =>
                      setNewExperience({ ...newExperience, period: e.target.value })
                    }
                    placeholder="e.g., 2020-2022"
                    size="sm"
                  />
                </div>
                <div>
                  <Label htmlFor="exp-description" className="text-xs">Description</Label>
                  <Textarea
                    id="exp-description"
                    value={newExperience.description || ""}
                    onChange={(e) =>
                      setNewExperience({
                        ...newExperience,
                        description: e.target.value,
                      })
                    }
                    placeholder="Brief description (optional)"
                    rows={2}
                  />
                </div>
                <Button
                  type="button"
                  onClick={addExperience}
                  variant="secondary"
                  className="w-full"
                  size="sm"
                  disabled={
                    !newExperience.title ||
                    !newExperience.institution ||
                    !newExperience.period
                  }
                >
                  Add Experience
                </Button>
              </div>
            </div>

            {/* Education */}
            <div className="space-y-3 border rounded-md p-4">
              <h3 className="font-medium">Education</h3>
              
              {/* List of educations */}
              <div className="space-y-3">
                {educations.map((edu, index) => (
                  <div key={index} className="p-3 border rounded-md bg-muted/40 relative">
                    <button
                      type="button"
                      onClick={() => removeEducation(index)}
                      className="absolute top-2 right-2 text-muted-foreground hover:text-destructive"
                    >
                      <X className="h-4 w-4" />
                    </button>
                    <div className="text-sm font-medium">{edu.degree}</div>
                    <div className="text-xs text-muted-foreground">
                      {edu.institution} • {edu.year}
                    </div>
                    {edu.description && <div className="text-xs mt-1">{edu.description}</div>}
                  </div>
                ))}
              </div>
              
              {/* Add new education form */}
              <div className="border rounded-md p-3 space-y-3">
                <h4 className="text-sm font-medium">Add New Education</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="edu-degree" className="text-xs">Degree</Label>
                    <Input
                      id="edu-degree"
                      value={newEducation.degree}
                      onChange={(e) =>
                        setNewEducation({ ...newEducation, degree: e.target.value })
                      }
                      placeholder="Degree/Certificate"
                      size="sm"
                    />
                  </div>
                  <div>
                    <Label htmlFor="edu-institution" className="text-xs">Institution</Label>
                    <Input
                      id="edu-institution"
                      value={newEducation.institution}
                      onChange={(e) =>
                        setNewEducation({
                          ...newEducation,
                          institution: e.target.value,
                        })
                      }
                      placeholder="University/College"
                      size="sm"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="edu-year" className="text-xs">Year</Label>
                  <Input
                    id="edu-year"
                    value={newEducation.year}
                    onChange={(e) =>
                      setNewEducation({ ...newEducation, year: e.target.value })
                    }
                    placeholder="e.g., 2022"
                    size="sm"
                  />
                </div>
                <div>
                  <Label htmlFor="edu-description" className="text-xs">Description</Label>
                  <Textarea
                    id="edu-description"
                    value={newEducation.description || ""}
                    onChange={(e) =>
                      setNewEducation({
                        ...newEducation,
                        description: e.target.value,
                      })
                    }
                    placeholder="Brief description (optional)"
                    rows={2}
                  />
                </div>
                <Button
                  type="button"
                  onClick={addEducation}
                  variant="secondary"
                  className="w-full"
                  size="sm"
                  disabled={
                    !newEducation.degree ||
                    !newEducation.institution ||
                    !newEducation.year
                  }
                >
                  Add Education
                </Button>
              </div>
            </div>
          </div>
        </form>
      </CardContent>

      <CardFooter className="flex justify-between">
        {showBackButton && (
          <Button
            variant="outline"
            onClick={onBack}
            disabled={isLoading}
          >
            Back
          </Button>
        )}
        <div className={showBackButton ? "" : "ml-auto"}>
          <Button
            type="submit"
            form="teacher-details-form"
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : "Complete Setup"}
          </Button>
        </div>
      </CardFooter>
    </>
  );
}
