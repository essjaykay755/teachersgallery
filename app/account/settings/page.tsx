"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/contexts/auth";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { uploadAvatar } from "@/lib/upload";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function AccountSettings() {
  const {
    user,
    profile,
    isLoading: authLoading,
    error: authError,
    refreshProfile,
  } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
  });
  const supabase = createClientComponentClient();

  // Debug logging
  console.log("AccountSettings: Current state:", {
    hasUser: !!user,
    hasProfile: !!profile,
    authLoading,
    authError,
    isLoading,
    error,
  });

  useEffect(() => {
    if (!authLoading && (!user || !profile)) {
      console.log("AccountSettings: No user/profile, redirecting to login");
      router.replace("/auth/login");
    }
  }, [user, profile, authLoading, router]);

  useEffect(() => {
    if (profile) {
      console.log("AccountSettings: Setting form data from profile");
      setFormData({
        fullName: profile.full_name || "",
        email: profile.email || "",
        phone: profile.phone || "",
      });
    }
  }, [profile]);

  // Show loading state while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-2 text-sm text-gray-600">Loading your account...</p>
        </div>
      </div>
    );
  }

  // Show auth error if any
  if (authError) {
    // Check if it's a temporary connection message
    const isConnecting = authError.includes("Connecting to");

    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          {isConnecting ? (
            <>
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
              <p className="mt-2 text-sm text-indigo-600">{authError}</p>
            </>
          ) : (
            <>
              <p className="text-base font-semibold text-red-600">
                {authError}
              </p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Retry
              </button>
            </>
          )}
        </div>
      </div>
    );
  }

  // Don't render anything if not authenticated
  if (!user || !profile) {
    return null;
  }

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      console.log("AccountSettings: Submitting form");

      // Upload new avatar if selected
      let avatarUrl = profile.avatar_url;
      if (avatarFile) {
        console.log("AccountSettings: Uploading avatar");
        const result = await uploadAvatar(avatarFile, user.id);
        if ("error" in result) {
          console.error("Avatar upload error:", result.error);
          throw new Error(result.error);
        }

        avatarUrl = result.url;
        console.log(
          "AccountSettings: Avatar uploaded successfully:",
          avatarUrl
        );
      }

      // Update profile
      console.log("AccountSettings: Updating profile");
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          full_name: formData.fullName,
          phone: formData.phone,
          avatar_url: avatarUrl,
        })
        .eq("id", user.id);

      if (profileError) {
        console.error("Profile update error:", profileError);
        throw profileError;
      }

      console.log("AccountSettings: Profile updated successfully");

      // Refresh the profile in the auth context
      console.log("AccountSettings: Refreshing profile in auth context");
      await refreshProfile();

      console.log(
        "AccountSettings: Profile refreshed, redirecting to dashboard"
      );
      router.push("/dashboard");
    } catch (err) {
      console.error("Form submission error:", err);
      setError(err instanceof Error ? err.message : "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Account Settings</CardTitle>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-4 rounded-md bg-red-50 p-4">
                <div className="text-sm text-red-700">{error}</div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label className="block text-sm font-medium text-gray-700">
                  Profile Picture
                </Label>
                <div className="mt-1 flex items-center space-x-4">
                  <div className="w-24 h-24 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center relative overflow-hidden">
                    {avatarFile ? (
                      <img
                        src={URL.createObjectURL(avatarFile)}
                        alt="Preview"
                        className="h-full w-full object-cover"
                      />
                    ) : profile.avatar_url ? (
                      <img
                        src={profile.avatar_url}
                        alt="Profile avatar"
                        className="h-24 w-24 rounded-full object-cover"
                        onError={(e) => {
                          // Handle image loading errors
                          console.error("Avatar image failed to load");
                          e.currentTarget.src = "/avatar.jpg";
                        }}
                      />
                    ) : (
                      <img
                        src="/avatar.jpg"
                        alt="Default avatar"
                        className="h-24 w-24 rounded-full"
                      />
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                  </div>
                  <div className="text-sm text-gray-500">
                    Click to upload a new profile picture
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                  className="mt-1"
                  required
                />
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  disabled
                  className="mt-1 bg-gray-50"
                />
                <p className="mt-1 text-sm text-gray-500">
                  Email cannot be changed. Contact support if you need to update
                  your email.
                </p>
              </div>

              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="mt-1"
                />
              </div>

              <div className="flex justify-end">
                <Button type="submit" disabled={isLoading} className="ml-3">
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
