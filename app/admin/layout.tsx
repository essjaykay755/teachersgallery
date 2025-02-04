"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  LayoutGrid,
  Users,
  GraduationCap,
  MessageSquare,
  Star,
  Settings,
  Bell,
  Menu,
  X,
  Crown,
  UserPlus
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import Image from "next/image"

const sidebarLinks = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutGrid
  },
  {
    title: "Add Users",
    href: "/admin/users",
    icon: UserPlus
  },
  {
    title: "Teachers",
    href: "/admin/teachers",
    icon: GraduationCap
  },
  {
    title: "Students",
    href: "/admin/students",
    icon: Users
  },
  {
    title: "Parents",
    href: "/admin/parents",
    icon: Users
  },
  {
    title: "Messages",
    href: "/admin/messages",
    icon: MessageSquare
  },
  {
    title: "Reviews",
    href: "/admin/reviews",
    icon: Star
  },
  {
    title: "Featured",
    href: "/admin/featured",
    icon: Crown
  },
  {
    title: "Notifications",
    href: "/admin/notifications",
    icon: Bell
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: Settings
  }
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Sidebar Toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? (
            <X className="h-4 w-4" />
          ) : (
            <Menu className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-40 w-72 bg-white border-r transform transition-transform duration-200 ease-in-out lg:translate-x-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="h-24 flex items-center justify-center bg-blue-600 px-6">
            <Link href="/admin" className="flex flex-col items-center gap-2">
              <div className="w-32 h-12 flex items-center justify-center">
                <Image
                  src="/logo.png"
                  alt="TeachersGallery Logo"
                  width={100}
                  height={40}
                  className="object-contain brightness-0 invert"
                />
              </div>
              <span className="text-sm font-medium text-white">Admin Panel</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-6">
            <ul className="space-y-2">
              {sidebarLinks.map((link) => {
                const Icon = link.icon
                const isActive = pathname === link.href
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-colors",
                        isActive 
                          ? "bg-blue-50 text-blue-700" 
                          : "text-gray-600 hover:bg-gray-50"
                      )}
                    >
                      <Icon className="h-5 w-5" />
                      {link.title}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className={cn(
        "min-h-screen transition-all duration-200 ease-in-out",
        "lg:pl-72"
      )}>
        <main className="container mx-auto px-6 py-8">
          {children}
        </main>
      </div>
    </div>
  )
} 