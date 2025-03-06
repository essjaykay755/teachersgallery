"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/contexts/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function SettingsIndexPage() {
  const router = useRouter();
  const { profile } = useAuth();

  // Redirect to the appropriate settings page based on user type
  useEffect(() => {
    if (profile?.user_type === "teacher") {
      router.push("/settings/teacher-profile");
    } else {
      router.push("/settings/preferences");
    }
  }, [profile, router]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Settings</CardTitle>
        <CardDescription>
          Redirecting to settings...
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>Please wait while we redirect you to the appropriate settings page.</p>
      </CardContent>
    </Card>
  );
} 