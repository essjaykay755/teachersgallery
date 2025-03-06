"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/contexts/auth";
import { useRouter } from "next/navigation";
import BaseUserLayout from "@/components/layout/base-user-layout";

export default function AssignedTeachersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);
  const { user, profile } = useAuth();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    
    // Redirect if not authenticated or if user is not a student or parent
    if (mounted && (!user || (profile?.user_type !== "student" && profile?.user_type !== "parent"))) {
      if (!user) {
        router.push("/auth/login");
      } else if (profile?.user_type !== "student" && profile?.user_type !== "parent") {
        router.push("/dashboard");
      }
    }
  }, [mounted, user, profile, router]);

  if (!mounted || !user || (profile?.user_type !== "student" && profile?.user_type !== "parent")) {
    return null;
  }

  return <BaseUserLayout>{children}</BaseUserLayout>;
} 