"use client";

import { useAuth } from "@/lib/contexts/auth";
import { Card, CardContent } from "@/components/ui/card";
import {
  LayoutDashboard,
  Settings,
  Bell,
  LogOut,
  User,
  GraduationCap,
  Users
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { signOut } from "@/lib/auth";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export default function NavigationTabs() {
  const { user, profile } = useAuth();
  const pathname = usePathname();

  const handleSignOut = async () => {
    await signOut();
    // Force a hard refresh to clear all client state
    window.location.href = "/auth/login";
  };

  // Create base navigation items first
  let navItems = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Account Settings",
      href: "/account/settings",
      icon: User,
    }
  ];
  
  // Add teacher profile if user is a teacher
  if (profile?.user_type === "teacher") {
    navItems.push({
      title: "Teacher Profile",
      href: "/teacher-profile",
      icon: GraduationCap,
    });
    
    // Add students assigned option for teachers
    navItems.push({
      title: "Students Assigned",
      href: "/assigned-students",
      icon: Users,
    });
  }
  
  // Add remaining items
  navItems.push({
    title: "Notifications",
    href: "/notifications",
    icon: Bell,
  });

  return (
    <Card>
      <CardContent className="p-0">
        {/* User Profile */}
        <div className="p-4 border-b">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0">
              <Avatar size="lg" className="!h-12 !w-12 rounded-full">
                <AvatarImage
                  src={profile?.avatar_url}
                  alt={profile?.full_name || "User avatar"}
                  onError={(e) => {
                    console.error("Avatar image failed to load");
                  }}
                  className="object-cover"
                />
                <AvatarFallback>
                  <User className="h-6 w-6" />
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-medium text-gray-900 truncate">{profile?.full_name || "User"}</p>
              <p className="text-sm text-gray-500 truncate">{user?.email}</p>
            </div>
          </div>
        </div>
        
        {/* Navigation Links */}
        <nav className="p-2">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                      isActive
                        ? "bg-indigo-50 text-indigo-700"
                        : "text-gray-700 hover:bg-gray-100"
                    )}
                  >
                    <Icon className="h-5 w-5" aria-hidden="true" />
                    {item.title}
                  </Link>
                </li>
              );
            })}
            
            {/* Logout Button */}
            <li>
              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <LogOut className="h-5 w-5" aria-hidden="true" />
                Logout
              </button>
            </li>
          </ul>
        </nav>
      </CardContent>
    </Card>
  );
} 