"use client";

import { useState } from "react";
import type { OnboardingState } from "@/lib/types";
import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, X } from "lucide-react";

type Props = {
  initialData: OnboardingState["userData"];
  onNext: (data: Partial<OnboardingState["userData"]>) => void;
  isLoading: boolean;
  showBackButton: boolean;
  onBack: () => void;
};

export default function StudentDetailsStep({
  initialData,
  onNext,
  isLoading,
  showBackButton,
  onBack,
}: Props) {
  const [grade, setGrade] = useState(initialData.grade || "");
  const [interests, setInterests] = useState<string[]>(initialData.interests || []);
  const [newInterest, setNewInterest] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Student details form submitted", { grade, interests });
    
    // Validate form data
    if (!grade) {
      console.error("Grade is required");
      return;
    }
    
    // Submit the form data
    onNext({
      grade,
      interests,
    });
  };

  const addInterest = () => {
    if (newInterest && !interests.includes(newInterest)) {
      setInterests([...interests, newInterest]);
      setNewInterest("");
    }
  };

  const removeInterest = (interest: string) => {
    setInterests(interests.filter((item) => item !== interest));
  };

  return (
    <>
      <CardHeader>
        <CardTitle>Student Details</CardTitle>
        <CardDescription>
          Tell us about your educational needs
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form id="student-details-form" onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="grade">Current Grade/Class</Label>
              <Select value={grade} onValueChange={setGrade} required>
                <SelectTrigger id="grade">
                  <SelectValue placeholder="Select your grade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="6">6th Grade</SelectItem>
                  <SelectItem value="7">7th Grade</SelectItem>
                  <SelectItem value="8">8th Grade</SelectItem>
                  <SelectItem value="9">9th Grade</SelectItem>
                  <SelectItem value="10">10th Grade</SelectItem>
                  <SelectItem value="11">11th Grade</SelectItem>
                  <SelectItem value="12">12th Grade</SelectItem>
                  <SelectItem value="college">College/University</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Subjects of Interest</Label>
              <div className="flex gap-2">
                <Input
                  type="text"
                  value={newInterest}
                  onChange={(e) => setNewInterest(e.target.value)}
                  placeholder="Add a subject you're interested in"
                  className="flex-1"
                />
                <Button
                  type="button"
                  onClick={addInterest}
                  size="sm"
                >
                  <Plus className="h-4 w-4 mr-1" /> Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {interests.map((interest) => (
                  <Badge key={interest} variant="secondary" className="gap-1">
                    {interest}
                    <button
                      type="button"
                      onClick={() => removeInterest(interest)}
                      className="ml-1 text-muted-foreground hover:text-foreground rounded-full"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
                {interests.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    Add subjects you're interested in learning
                  </p>
                )}
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
            form="student-details-form"
            disabled={isLoading || !grade}
            onClick={(e) => {
              if (!grade) {
                e.preventDefault();
                console.error("Grade is required");
                return;
              }
              console.log("Continue button clicked", { isLoading, grade });
            }}
          >
            {isLoading ? "Processing..." : "Continue"}
          </Button>
        </div>
      </CardFooter>
    </>
  );
} 