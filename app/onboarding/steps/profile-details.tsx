"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import type { OnboardingState } from "@/lib/types";
import { uploadAvatar } from "@/lib/upload";
import { useAuth } from "@/lib/contexts/auth";

type Props = {
  initialData: OnboardingState["userData"];
  onNext: (data: Partial<OnboardingState["userData"]>) => void;
  isLoading: boolean;
};

export default function ProfileDetailsStep({
  initialData,
  onNext,
  isLoading,
}: Props) {
  const { user } = useAuth();
  const [fullName, setFullName] = useState(initialData.fullName || "");
  const [phone, setPhone] = useState(initialData.phone || "");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    initialData.avatarUrl || null
  );
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let avatarUrl = initialData.avatarUrl;

    if (avatarFile) {
      setIsUploading(true);
      setUploadError(null);

      try {
        // Try to ensure the avatars bucket exists first
        try {
          console.log("Ensuring avatars bucket exists...");
          const response = await fetch("/api/storage/ensure-bucket", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          });

          if (!response.ok) {
            console.warn(
              `Failed to ensure avatars bucket exists (status: ${response.status}), but continuing anyway`
            );
            const errorData = await response.json();
            console.warn("Error details:", errorData);
          } else {
            console.log("Bucket ensure API call successful");
          }
        } catch (err) {
          console.warn(
            "Failed to ensure avatars bucket exists, but continuing anyway:",
            err
          );
          // Continue anyway and let the upload handle any errors
        }

        // Attempt to upload the avatar
        console.log("Starting avatar upload...");
        // Use a temporary ID if user is not available
        const tempId = "temp-" + Date.now();
        const result = await uploadAvatar(avatarFile, tempId);

        if ("error" in result) {
          console.error("Avatar upload returned error:", result.error);
          // Ensure we're setting a string
          setUploadError(result.error || "Unknown error occurred");
          setIsUploading(false);
          return;
        }

        console.log("Avatar upload successful:", result.url);
        avatarUrl = result.url;
      } catch (err) {
        console.error("Unhandled avatar upload error:", err);
        setUploadError("Failed to upload avatar. Please try again.");
        setIsUploading(false);
        return;
      }

      setIsUploading(false);
    }

    onNext({
      fullName,
      phone,
      avatarUrl,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setUploadError(null);

      // Create a preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveAvatar = () => {
    setAvatarFile(null);
    setAvatarPreview(null);
    setUploadError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Your Profile</h2>
        <p className="mt-2 text-sm text-gray-600">
          Tell us a bit about yourself
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="fullName"
            className="block text-sm font-medium text-gray-700"
          >
            Full Name
          </label>
          <input
            type="text"
            id="fullName"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-gray-700"
          >
            Phone Number
          </label>
          <input
            type="tel"
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Profile Picture
          </label>
          <div className="mt-1 flex items-center space-x-5">
            <div className="flex-shrink-0">
              {avatarPreview ? (
                <div className="relative h-16 w-16 rounded-full overflow-hidden">
                  <Image
                    src={avatarPreview}
                    alt="Avatar preview"
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveAvatar}
                    className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white opacity-0 hover:opacity-100 transition-opacity"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-400 text-xl">?</span>
                </div>
              )}
            </div>
            <div className="flex-grow">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
              />
              {uploadError && (
                <p className="mt-1 text-sm text-red-600">{uploadError}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                JPG, PNG or GIF. Max size 2MB.
              </p>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading || isUploading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading || isUploading ? "Processing..." : "Continue"}
        </button>
      </form>
    </div>
  );
}
