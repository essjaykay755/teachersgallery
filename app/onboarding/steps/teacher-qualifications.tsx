"use client";

import { useState } from "react";
import type { OnboardingState } from "@/lib/types";
import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { X } from "lucide-react";

type Props = {
  initialData: OnboardingState["userData"];
  onNext: (data: Partial<OnboardingState["userData"]>) => void;
  isLoading: boolean;
  showBackButton: boolean;
  onBack: () => void;
};

type EducationItem = {
  degree: string;
  institution: string;
  year: string;
  description?: string;
};

export default function TeacherQualificationsStep({
  initialData,
  onNext,
  isLoading,
  showBackButton,
  onBack,
}: Props) {
  const [experience, setExperience] = useState(
    initialData.teacherProfile?.experience || ""
  );
  const [degree, setDegree] = useState(
    initialData.teacherProfile?.degree || ""
  );
  const [specialization, setSpecialization] = useState(
    initialData.teacherProfile?.specialization || ""
  );
  
  // Education entries
  const [educations, setEducations] = useState<EducationItem[]>(
    initialData.teacherProfile?.educations || []
  );
  const [newEducation, setNewEducation] = useState<EducationItem>({
    degree: "",
    institution: "",
    year: "",
    description: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Ensure there's a teacherProfile object or create it
    const currentTeacherProfile = initialData.teacherProfile || {
      subject: [],
      location: "",
      fee: "",
      about: "",
      tags: [],
      educations: [],
      experiences: [],
    };
    
    onNext({
      teacherProfile: {
        ...currentTeacherProfile,
        experience,
        degree,
        specialization,
        educations,
      },
    });
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
        <CardTitle>Teacher Qualifications</CardTitle>
        <CardDescription>
          Share your educational qualifications and experience
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form id="teacher-qualifications-form" onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Teaching Experience</Label>
              <Select value={experience} onValueChange={setExperience} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select your experience" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0-2">0-2 years</SelectItem>
                  <SelectItem value="3-5">3-5 years</SelectItem>
                  <SelectItem value="6-10">6-10 years</SelectItem>
                  <SelectItem value="10+">10+ years</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="degree">Highest Degree</Label>
                <Select value={degree} onValueChange={setDegree} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select degree" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bachelors">Bachelor's</SelectItem>
                    <SelectItem value="masters">Master's</SelectItem>
                    <SelectItem value="phd">Ph.D.</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="specialization">Specialization</Label>
                <Input
                  id="specialization"
                  value={specialization}
                  onChange={(e) => setSpecialization(e.target.value)}
                  required
                  placeholder="e.g., Mathematics"
                />
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
                      className="text-sm"
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
                      className="text-sm"
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
                    className="text-sm"
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
            form="teacher-qualifications-form"
            disabled={isLoading || !experience || !degree || !specialization}
          >
            {isLoading ? "Processing..." : "Continue"}
          </Button>
        </div>
      </CardFooter>
    </>
  );
} 