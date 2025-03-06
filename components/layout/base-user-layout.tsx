"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/contexts/auth";
import { useRouter } from "next/navigation";
import NavigationTabs from "./navigation-tabs";

export default function BaseUserLayout({
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-12 gap-6">
          {/* Vertical Tabs Navigation (left side) */}
          <div className="col-span-12 md:col-span-3">
            <NavigationTabs />
          </div>
          
          {/* Main Content (right side) */}
          <div className="col-span-12 md:col-span-9 space-y-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
} 