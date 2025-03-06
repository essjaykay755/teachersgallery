"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/contexts/auth";
import { useRouter, usePathname } from "next/navigation";
import BaseUserLayout from "@/components/layout/base-user-layout";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);
  const { user, profile } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

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

  // Navigation links for settings
  const navItems = [
    { 
      title: "Teacher Profile", 
      href: "/settings/teacher-profile",
      active: pathname === "/settings/teacher-profile",
      // Only show for teachers
      show: profile?.user_type === "teacher"
    },
    { 
      title: "Preferences", 
      href: "/settings/preferences",
      active: pathname === "/settings/preferences",
      show: true
    }
  ];

  return (
    <BaseUserLayout>
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6">Settings</h1>
        <div className="flex flex-col md:flex-row gap-6">
          {/* Vertical tabs */}
          <div className="w-full md:w-64 mb-6 md:mb-0">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
              <nav className="flex flex-col">
                {navItems
                  .filter(item => item.show)
                  .map((item, i) => (
                    <Link
                      key={i}
                      href={item.href}
                      className={cn(
                        "px-4 py-3 text-sm font-medium border-l-2 transition-colors",
                        item.active
                          ? "border-primary text-primary bg-primary/5 dark:bg-primary/10"
                          : "border-transparent text-muted-foreground hover:text-foreground hover:bg-accent"
                      )}
                    >
                      {item.title}
                    </Link>
                  ))}
              </nav>
            </div>
          </div>
          
          {/* Content area */}
          <div className="flex-1">
            {children}
          </div>
        </div>
      </div>
    </BaseUserLayout>
  );
} 