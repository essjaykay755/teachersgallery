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
  Users,
  Heart
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { signOut } from "@/lib/auth";
import { Avatar, AvatarImage, AvatarFallback, AvatarWithTypeIndicator } from "@/components/ui/avatar";
import { useEffect } from "react";

export default function NavigationTabs() {
  const { user, profile } = useAuth();
  const pathname = usePathname();

  // Debug profile data
  useEffect(() => {
    console.log("NavigationTabs: Profile data:", {
      hasProfile: !!profile,
      userType: profile?.user_type,
      fullProfile: profile
    });
  }, [profile]);

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
      title: "Assigned Students",
      href: "/assigned-students",
      icon: Users,
    });
  } 
  // Add student profile if user is a student
  else if (profile?.user_type === "student") {
    navItems.push({
      title: "Student Profile", 
      href: "/student-profile",
      icon: GraduationCap,
    });
    
    // Add assigned teachers for students
    navItems.push({
      title: "Assigned Teachers",
      href: "/assigned-teachers", 
      icon: Users,
    });
    
    // Add favourite teachers link for students
    navItems.push({
      title: "Favourite Teachers",
      href: "/account/favourite-teachers",
      icon: Heart,
    });
  }
  // Add parent profile if user is a parent
  else if (profile?.user_type === "parent") {
    navItems.push({
      title: "Parent Profile",
      href: "/parent-profile",
      icon: GraduationCap, 
    });
    
    // Add assigned teachers for parents
    navItems.push({
      title: "Assigned Teachers",
      href: "/assigned-teachers",
      icon: Users,
    });
    
    // Add favourite teachers link for parents
    navItems.push({
      title: "Favourite Teachers",
      href: "/account/favourite-teachers",
      icon: Heart,
    });
  }
  
  // Add remaining items
  navItems.push({
    title: "Notifications",
    href: "/notifications",
    icon: Bell,
  });

  // Debug navigation items
  useEffect(() => {
    console.log("NavigationTabs: Generated navigation items:", {
      userType: profile?.user_type,
      navItems: navItems.map(item => item.title)
    });
  }, [profile?.user_type, navItems]);

  return (
    <Card>
      <CardContent className="p-0">
        {/* User Profile */}
        <div className="p-4 border-b">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0">
              <AvatarWithTypeIndicator
                size="md"
                className="!h-12 !w-12 rounded-full"
                src={profile?.avatar_url}
                alt={profile?.full_name || "User avatar"}
                userType={profile?.user_type}
                fallback={
                  <div className={cn(
                    "w-full h-full flex items-center justify-center text-white text-xs font-medium",
                    profile?.user_type === "teacher" ? "bg-blue-500" :
                    profile?.user_type === "student" ? "bg-green-500" :
                    profile?.user_type === "parent" ? "bg-purple-500" :
                    profile?.user_type === "admin" ? "bg-red-500" : "bg-gray-400"
                  )}>
                    {profile?.user_type?.charAt(0).toUpperCase() || "U"}
                  </div>
                }
              />
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