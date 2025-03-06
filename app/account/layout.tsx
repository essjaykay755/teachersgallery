"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/contexts/auth";
import { useRouter } from "next/navigation";
import BaseUserLayout from "@/components/layout/base-user-layout";

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    
    // Redirect to login if not authenticated
    if (mounted && !user) {
      router.push("/auth/login");
    }
  }, [mounted, user, router]);

  if (!mounted || !user) {
    return null;
  }

  return <BaseUserLayout>{children}</BaseUserLayout>;
} 