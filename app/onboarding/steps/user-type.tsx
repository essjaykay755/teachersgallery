"use client";

import { useState } from "react";
import type { OnboardingState } from "@/lib/types";

type Props = {
  initialData: OnboardingState["userData"];
  onNext: (data: Partial<OnboardingState["userData"]>) => void;
  isLoading: boolean;
};

export default function UserTypeStep({
  initialData,
  onNext,
  isLoading,
}: Props) {
  const [userType, setUserType] = useState<"teacher" | "student" | "parent">(
    initialData.userType || "student"
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext({ userType });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">
          Welcome to TeachersGallery
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Let's get started by telling us who you are
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center">
            <input
              id="student"
              name="userType"
              type="radio"
              checked={userType === "student"}
              onChange={() => setUserType("student")}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
            />
            <label htmlFor="student" className="ml-3">
              <span className="block text-sm font-medium text-gray-700">
                I'm a student looking for teachers
              </span>
            </label>
          </div>

          <div className="flex items-center">
            <input
              id="teacher"
              name="userType"
              type="radio"
              checked={userType === "teacher"}
              onChange={() => setUserType("teacher")}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
            />
            <label htmlFor="teacher" className="ml-3">
              <span className="block text-sm font-medium text-gray-700">
                I'm a teacher looking to connect with students
              </span>
            </label>
          </div>

          <div className="flex items-center">
            <input
              id="parent"
              name="userType"
              type="radio"
              checked={userType === "parent"}
              onChange={() => setUserType("parent")}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
            />
            <label htmlFor="parent" className="ml-3">
              <span className="block text-sm font-medium text-gray-700">
                I'm a parent looking for teachers for my child
              </span>
            </label>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Processing..." : "Continue"}
        </button>
      </form>
    </div>
  );
}
