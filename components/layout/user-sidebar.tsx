"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  User,
  Settings,
  GraduationCap,
  Bell,
  Menu,
  X,
  LogOut,
  LayoutDashboard,
  Sliders,
  LucideIcon,
  Users
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/contexts/auth";
import { signOut } from "@/lib/auth";

// Define types for sidebar items
type SidebarLink = {
  title: string;
  href: string;
  icon: LucideIcon;
  isActive?: (path: string) => boolean;
};

type SidebarGroup = {
  title: string;
  icon: LucideIcon;
  items: SidebarLink[];
};

type SidebarItem = SidebarLink | SidebarGroup;

// Function to check if an item is a group
const isGroup = (item: SidebarItem): item is SidebarGroup => {
  return 'items' in item;
};

const getSidebarLinks = (userType: string | undefined): SidebarItem[] => {
  const links: SidebarItem[] = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Account Settings",
      href: "/account/settings",
      icon: Settings,
    }
  ];

  // Add teacher profile link if user is a teacher
  if (userType === "teacher") {
    links.push({
      title: "Teacher Profile",
      href: "/teacher-profile",
      icon: GraduationCap,
    });
    
    // Add students assigned link for teachers
    links.push({
      title: "Students Assigned",
      href: "/assigned-students",
      icon: Users,
    });
  }

  // Add general settings link
  links.push({
    title: "Settings",
    href: "/settings",
    icon: Sliders,
    // For the active state, check if the path starts with /settings
    isActive: (path: string) => path.startsWith('/settings') && path !== '/settings/teacher-profile',
  });
  
  // Add notifications link
  links.push({
    title: "Notifications",
    href: "/notifications",
    icon: Bell,
  });

  return links;
};

export default function UserSidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});
  const pathname = usePathname();
  const { user, profile } = useAuth();
  
  const handleSignOut = async () => {
    await signOut();
    // Force a hard refresh to clear all client state
    window.location.href = "/auth/login";
  };

  const sidebarLinks = getSidebarLinks(profile?.user_type);

  const toggleGroup = (groupTitle: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupTitle]: !prev[groupTitle]
    }));
  };

  return (
    <>
      {/* Mobile Sidebar Toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label={sidebarOpen ? "Close sidebar menu" : "Open sidebar menu"}
          aria-expanded={sidebarOpen}
          aria-controls="user-sidebar-menu"
        >
          {sidebarOpen ? (
            <X className="h-4 w-4" />
          ) : (
            <Menu className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Sidebar */}
      <div
        id="user-sidebar-menu"
        role="navigation"
        aria-label="User navigation"
        className={cn(
          "fixed top-16 bottom-0 left-0 z-40 w-64 bg-white border-r transform transition-transform duration-200 ease-in-out lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* User Info */}
          <div className="p-6 border-b">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full overflow-hidden">
                <img
                  src={profile?.avatar_url || "/avatar.jpg"}
                  alt="User avatar"
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <p className="font-medium text-gray-900">{profile?.full_name || "User"}</p>
                <p className="text-sm text-gray-500">{user?.email}</p>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex-1 overflow-y-auto py-4">
            <nav className="px-4 space-y-1">
              {sidebarLinks.map((link, i) => {
                // Check if this is a group with sub-items
                if (isGroup(link)) {
                  const isExpanded = expandedGroups[link.title] || false;
                  const hasActiveChild = link.items.some(item => item.href === pathname);
                  
                  return (
                    <div key={i} className="space-y-1">
                      {/* Group header */}
                      <button
                        onClick={() => toggleGroup(link.title)}
                        className={cn(
                          "flex items-center w-full px-3 py-2 text-sm font-medium rounded-md",
                          hasActiveChild
                            ? "text-indigo-700 bg-indigo-50"
                            : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                        )}
                      >
                        <link.icon className="mr-3 h-5 w-5 flex-shrink-0" aria-hidden="true" />
                        <span className="flex-1 text-left">{link.title}</span>
                        <svg
                          className={cn(
                            "h-4 w-4 transition-transform",
                            isExpanded ? "rotate-90" : ""
                          )}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                      
                      {/* Group children */}
                      {isExpanded && (
                        <div className="ml-8 space-y-1">
                          {link.items.map((subItem, j) => (
                            <Link
                              key={j}
                              href={subItem.href}
                              className={cn(
                                "flex items-center px-3 py-2 text-sm font-medium rounded-md",
                                pathname === subItem.href
                                  ? "text-indigo-700 bg-indigo-50"
                                  : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                              )}
                            >
                              <subItem.icon className="mr-3 h-5 w-5 flex-shrink-0" aria-hidden="true" />
                              {subItem.title}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                } else {
                  // Regular link
                  // Check if item has a custom isActive function
                  const isActive = link.isActive ? link.isActive(pathname) : pathname === link.href;
                  
                  return (
                    <Link
                      key={i}
                      href={link.href}
                      className={cn(
                        "flex items-center px-3 py-2 text-sm font-medium rounded-md",
                        isActive
                          ? "text-indigo-700 bg-indigo-50"
                          : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                      )}
                    >
                      <link.icon className="mr-3 h-5 w-5 flex-shrink-0" aria-hidden="true" />
                      {link.title}
                    </Link>
                  );
                }
              })}
            </nav>
          </div>

          {/* Sign Out Button */}
          <div className="p-4 border-t">
            <button
              onClick={handleSignOut}
              className="flex w-full items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md"
            >
              <LogOut className="mr-3 h-5 w-5 flex-shrink-0" aria-hidden="true" />
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Overlay (visible on mobile only) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </>
  );
} 