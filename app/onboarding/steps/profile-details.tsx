"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import type { OnboardingState } from "@/lib/types";
import { uploadAvatar } from "@/lib/upload";
import { useAuth } from "@/lib/contexts/auth";
import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Props = {
  initialData: OnboardingState["userData"];
  onNext: (data: Partial<OnboardingState["userData"]>) => void;
  isLoading: boolean;
  showBackButton: boolean;
  onBack: () => void;
};

export default function ProfileDetailsStep({
  initialData,
  onNext,
  isLoading,
  showBackButton,
  onBack,
}: Props) {
  const { user } = useAuth();
  const [firstName, setFirstName] = useState(initialData.firstName || "");
  const [lastName, setLastName] = useState(initialData.lastName || "");
  const [email, setEmail] = useState(initialData.email || user?.email || "");
  const [phone, setPhone] = useState(initialData.phone || "");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    initialData.avatarUrl || null
  );
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Check if user logged in via Google (will have fixed email)
  const isGoogleLogin = !!user?.app_metadata?.provider && user.app_metadata.provider.includes("google");

  // Populate fullName from firstName and lastName if they're already set
  useEffect(() => {
    if (initialData.fullName && !firstName && !lastName) {
      const nameParts = initialData.fullName.split(" ");
      if (nameParts.length >= 2) {
        setFirstName(nameParts[0]);
        setLastName(nameParts.slice(1).join(" "));
      } else if (nameParts.length === 1) {
        setFirstName(nameParts[0]);
      }
    }
  }, [initialData.fullName, firstName, lastName]);

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
        const result = await uploadAvatar(avatarFile, user?.id || tempId);

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

    // Combine first and last name into fullName
    const fullName = `${firstName} ${lastName}`.trim();

    onNext({
      firstName,
      lastName,
      fullName,
      email,
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
    <>
      <CardHeader>
        <CardTitle>Your Profile</CardTitle>
        <CardDescription>
          Tell us a bit about yourself
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form id="profile-details-form" onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  type="text"
                  id="firstName"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Your first name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  type="text"
                  id="lastName"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Your last name"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                type="email"
                id="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                disabled={isGoogleLogin}
              />
              {isGoogleLogin && (
                <p className="text-xs text-muted-foreground mt-1">
                  Email address is linked to your Google account and cannot be changed.
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                type="tel"
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Your phone number (optional)"
              />
            </div>

            <div className="space-y-2">
              <Label>Profile Picture</Label>
              <div className="flex items-center gap-5">
                <div className="flex-shrink-0">
                  {avatarPreview ? (
                    <div className="relative h-16 w-16 rounded-full overflow-hidden border">
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
                    <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
                      <span className="text-muted-foreground text-xl">?</span>
                    </div>
                  )}
                </div>
                <div className="flex-grow">
                  <Input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="cursor-pointer"
                    aria-describedby="file-description"
                  />
                  <p id="file-description" className="mt-1 text-xs text-muted-foreground">
                    JPG, PNG or GIF. Max size 2MB.
                  </p>
                  {uploadError && (
                    <p className="mt-1 text-sm text-destructive">{uploadError}</p>
                  )}
                </div>
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
            disabled={isLoading || isUploading}
          >
            Back
          </Button>
        )}
        <div className={showBackButton ? "" : "ml-auto"}>
          <Button
            type="submit"
            form="profile-details-form"
            disabled={isLoading || isUploading || !firstName || !lastName || !email}
          >
            {isLoading || isUploading ? "Processing..." : "Continue"}
          </Button>
        </div>
      </CardFooter>
    </>
  );
}
