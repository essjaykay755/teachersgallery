"use client";

import { useState, useEffect } from "react";
import type { OnboardingState } from "@/lib/types";
import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

type Props = {
  initialData: OnboardingState["userData"];
  onNext: (data: Partial<OnboardingState["userData"]>) => void;
  isLoading: boolean;
  showBackButton: boolean;
  onBack: () => void;
};

export default function UserTypeStep({
  initialData,
  onNext,
  isLoading,
  showBackButton,
  onBack,
}: Props) {
  const [userType, setUserType] = useState<"teacher" | "student" | "parent">(
    initialData.userType || "student"
  );

  useEffect(() => {
    console.log("UserTypeStep: initialData changed", initialData);
    if (initialData.userType) {
      setUserType(initialData.userType);
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("UserTypeStep: Submitting with userType", userType);
    onNext({ userType });
  };

  // Simple direct handler for changing user type
  const selectUserType = (type: "teacher" | "student" | "parent") => {
    console.log("UserTypeStep: Directly selecting user type", type);
    setUserType(type);
  };

  console.log("UserTypeStep rendering with userType:", userType, "initialData:", initialData);

  return (
    <>
      <CardHeader>
        <CardTitle>Welcome to TeachersGallery</CardTitle>
        <CardDescription>
          Let's get started by telling us who you are
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form id="user-type-form" onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            {/* Student option */}
            <div 
              className={`
                flex items-start space-x-3 rounded-md border p-4 shadow-sm 
                hover:border-primary cursor-pointer transition-colors
                ${userType === "student" ? "border-primary bg-primary/5" : ""}
              `}
              onClick={() => selectUserType("student")}
            >
              <input
                type="radio"
                id="student"
                name="userType"
                value="student"
                checked={userType === "student"}
                onChange={() => selectUserType("student")}
                className="mt-1"
              />
              <div className="flex flex-col flex-1">
                <label 
                  htmlFor="student" 
                  className="font-medium cursor-pointer w-full"
                >
                  I'm a student
                </label>
                <span className="text-sm text-muted-foreground">
                  Looking for qualified teachers
                </span>
              </div>
            </div>
            
            {/* Teacher option */}
            <div 
              className={`
                flex items-start space-x-3 rounded-md border p-4 shadow-sm 
                hover:border-primary cursor-pointer transition-colors
                ${userType === "teacher" ? "border-primary bg-primary/5" : ""}
              `}
              onClick={() => selectUserType("teacher")}
            >
              <input
                type="radio"
                id="teacher"
                name="userType"
                value="teacher"
                checked={userType === "teacher"}
                onChange={() => selectUserType("teacher")}
                className="mt-1"
              />
              <div className="flex flex-col flex-1">
                <label 
                  htmlFor="teacher" 
                  className="font-medium cursor-pointer w-full"
                >
                  I'm a teacher
                </label>
                <span className="text-sm text-muted-foreground">
                  Looking to connect with students
                </span>
              </div>
            </div>
            
            {/* Parent option */}
            <div 
              className={`
                flex items-start space-x-3 rounded-md border p-4 shadow-sm 
                hover:border-primary cursor-pointer transition-colors
                ${userType === "parent" ? "border-primary bg-primary/5" : ""}
              `}
              onClick={() => selectUserType("parent")}
            >
              <input
                type="radio"
                id="parent"
                name="userType"
                value="parent"
                checked={userType === "parent"}
                onChange={() => selectUserType("parent")}
                className="mt-1"
              />
              <div className="flex flex-col flex-1">
                <label 
                  htmlFor="parent" 
                  className="font-medium cursor-pointer w-full"
                >
                  I'm a parent
                </label>
                <span className="text-sm text-muted-foreground">
                  Looking for teachers for my child
                </span>
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
            form="user-type-form"
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : "Continue"}
          </Button>
        </div>
      </CardFooter>
    </>
  );
}
