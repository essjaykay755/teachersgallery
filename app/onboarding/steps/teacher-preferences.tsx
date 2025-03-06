"use client";

import { useState } from "react";
import type { OnboardingState } from "@/lib/types";
import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { X } from "lucide-react";

type Props = {
  initialData: OnboardingState["userData"];
  onNext: (data: Partial<OnboardingState["userData"]>) => void;
  isLoading: boolean;
  showBackButton: boolean;
  onBack: () => void;
};

type ExperienceItem = {
  title: string;
  institution: string;
  period: string;
  description?: string;
};

export default function TeacherPreferencesStep({
  initialData,
  onNext,
  isLoading,
  showBackButton,
  onBack,
}: Props) {
  const [teachingModes, setTeachingModes] = useState<string[]>(
    initialData.teacherProfile?.teachingModes || []
  );
  
  // Experience entries
  const [experiences, setExperiences] = useState<ExperienceItem[]>(
    initialData.teacherProfile?.experiences || []
  );
  const [newExperience, setNewExperience] = useState<ExperienceItem>({
    title: "",
    institution: "",
    period: "",
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
        teachingModes,
        experiences,
      },
    });
  };

  const toggleTeachingMode = (mode: string) => {
    setTeachingModes(
      teachingModes.includes(mode)
        ? teachingModes.filter((m) => m !== mode)
        : [...teachingModes, mode]
    );
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

  return (
    <>
      <CardHeader>
        <CardTitle>Teaching Preferences</CardTitle>
        <CardDescription>
          Tell us how you prefer to teach and your work experience
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form id="teacher-preferences-form" onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Teaching Mode</Label>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="online"
                    checked={teachingModes.includes("online")}
                    onCheckedChange={() => toggleTeachingMode("online")}
                  />
                  <Label htmlFor="online" className="cursor-pointer">Online</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="offline"
                    checked={teachingModes.includes("offline")}
                    onCheckedChange={() => toggleTeachingMode("offline")}
                  />
                  <Label htmlFor="offline" className="cursor-pointer">In-Person</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="group"
                    checked={teachingModes.includes("group")}
                    onCheckedChange={() => toggleTeachingMode("group")}
                  />
                  <Label htmlFor="group" className="cursor-pointer">Group Classes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="individual"
                    checked={teachingModes.includes("individual")}
                    onCheckedChange={() => toggleTeachingMode("individual")}
                  />
                  <Label htmlFor="individual" className="cursor-pointer">One-on-One</Label>
                </div>
              </div>
            </div>

            {/* Work Experience */}
            <div className="space-y-3 border rounded-md p-4">
              <h3 className="font-medium">Work Experience</h3>
              
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
                      className="text-sm"
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
                      className="text-sm"
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
                    className="text-sm"
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
            form="teacher-preferences-form"
            disabled={isLoading || teachingModes.length === 0}
          >
            {isLoading ? "Processing..." : "Complete Profile"}
          </Button>
        </div>
      </CardFooter>
    </>
  );
} 