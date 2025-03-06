"use client";

import { useState } from "react";
import type { OnboardingState } from "@/lib/types";
import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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

export default function ParentDetailsStep({
  initialData,
  onNext,
  isLoading,
  showBackButton,
  onBack,
}: Props) {
  const [childrenCount, setChildrenCount] = useState(initialData.childrenCount || "1");
  const [childrenGrades, setChildrenGrades] = useState<string[]>(initialData.childrenGrades || []);
  const [selectedGrade, setSelectedGrade] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext({
      childrenCount,
      childrenGrades,
    });
  };

  const addGrade = () => {
    if (selectedGrade && !childrenGrades.includes(selectedGrade)) {
      setChildrenGrades([...childrenGrades, selectedGrade]);
      setSelectedGrade("");
    }
  };

  const removeGrade = (grade: string) => {
    setChildrenGrades(childrenGrades.filter((item) => item !== grade));
  };

  return (
    <>
      <CardHeader>
        <CardTitle>Parent Details</CardTitle>
        <CardDescription>
          Tell us about your children's educational needs
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form id="parent-details-form" onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Number of Children</Label>
              <RadioGroup
                value={childrenCount}
                onValueChange={setChildrenCount}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="1" id="children-1" />
                  <Label htmlFor="children-1">1</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="2" id="children-2" />
                  <Label htmlFor="children-2">2</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="3" id="children-3" />
                  <Label htmlFor="children-3">3+</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label>Children's Grades</Label>
              <div className="flex gap-2">
                <Select value={selectedGrade} onValueChange={setSelectedGrade}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Select grade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="preschool">Preschool</SelectItem>
                    <SelectItem value="kindergarten">Kindergarten</SelectItem>
                    <SelectItem value="1">1st Grade</SelectItem>
                    <SelectItem value="2">2nd Grade</SelectItem>
                    <SelectItem value="3">3rd Grade</SelectItem>
                    <SelectItem value="4">4th Grade</SelectItem>
                    <SelectItem value="5">5th Grade</SelectItem>
                    <SelectItem value="6">6th Grade</SelectItem>
                    <SelectItem value="7">7th Grade</SelectItem>
                    <SelectItem value="8">8th Grade</SelectItem>
                    <SelectItem value="9">9th Grade</SelectItem>
                    <SelectItem value="10">10th Grade</SelectItem>
                    <SelectItem value="11">11th Grade</SelectItem>
                    <SelectItem value="12">12th Grade</SelectItem>
                    <SelectItem value="college">College/University</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  type="button"
                  onClick={addGrade}
                  size="sm"
                  disabled={!selectedGrade}
                >
                  <Plus className="h-4 w-4 mr-1" /> Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {childrenGrades.map((grade) => (
                  <Badge key={grade} variant="secondary" className="gap-1">
                    {grade === "preschool" ? "Preschool" : 
                     grade === "kindergarten" ? "Kindergarten" : 
                     grade === "college" ? "College/University" : 
                     `${grade}${
                       grade === "1" ? "st" : 
                       grade === "2" ? "nd" : 
                       grade === "3" ? "rd" : "th"
                     } Grade`}
                    <button
                      type="button"
                      onClick={() => removeGrade(grade)}
                      className="ml-1 text-muted-foreground hover:text-foreground rounded-full"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
                {childrenGrades.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    Add the grades of your children
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Looking For</Label>
              <p className="text-sm text-muted-foreground">
                What subjects are you looking for a teacher for? (You can customize this later)
              </p>
              <div className="flex flex-wrap gap-2 mt-2">
                <Badge variant="outline">Mathematics</Badge>
                <Badge variant="outline">Science</Badge>
                <Badge variant="outline">English</Badge>
                <Badge variant="outline">History</Badge>
                <Badge variant="outline">Computer Science</Badge>
                <Badge variant="outline">Music</Badge>
                <Badge variant="outline">Art</Badge>
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
            form="parent-details-form"
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : "Continue"}
          </Button>
        </div>
      </CardFooter>
    </>
  );
} 