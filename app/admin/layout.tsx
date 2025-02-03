"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  GraduationCap,
  Users,
  Users2,
  DollarSign,
  MessageSquare,
  Star,
  LifeBuoy,
  Bell,
  Settings,
  Menu,
  X,
  LogOut
} from "lucide-react"
import { Button } from "@/components/ui/button"

const sidebarLinks = [
  {
    title: "Overview",
    icon: LayoutDashboard,
    href: "/admin"
  },
  {
    title: "Teachers",
    icon: GraduationCap,
    href: "/admin/teachers"
  },
  {
    title: "Students",
    icon: Users,
    href: "/admin/students"
  },
  {
    title: "Parents",
    icon: Users2,
    href: "/admin/parents"
  },
  {
    title: "Payments",
    icon: DollarSign,
    href: "/admin/payments"
  },
  {
    title: "Messages",
    icon: MessageSquare,
    href: "/admin/messages"
  },
  {
    title: "Reviews",
    icon: Star,
    href: "/admin/reviews"
  },
  {
    title: "Support",
    icon: LifeBuoy,
    href: "/admin/support"
  },
  {
    title: "Notifications",
    icon: Bell,
    href: "/admin/notifications"
  },
  {
    title: "Settings",
    icon: Settings,
    href: "/admin/settings"
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
      <button
        className="fixed top-4 left-4 z-50 lg:hidden bg-white p-2 rounded-lg shadow-lg"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <Menu className="h-6 w-6" />
        )}
      </button>

      {/* Sidebar */}
      <aside className={cn(
        "fixed top-0 left-0 z-40 w-64 h-screen transition-transform bg-white shadow-lg",
        sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <div className="h-full flex flex-col">
          {/* Admin Profile */}
          <div className="p-6 border-b bg-gradient-to-r from-blue-500 to-blue-600">
            <div className="flex items-center justify-center mb-2">
              <Image
                src="/logo.png"
                alt="Teachers Gallery"
                width={240}
                height={72}
                className="h-16 w-auto"
                priority
              />
            </div>
            <p className="text-sm text-white opacity-90 text-center mt-3">Admin Dashboard</p>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 overflow-y-auto p-4">
            <div className="space-y-1">
              {sidebarLinks.map((link) => {
                const Icon = link.icon
                const isActive = pathname === link.href
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                      isActive 
                        ? "bg-blue-50 text-blue-600" 
                        : "text-gray-600 hover:bg-gray-50"
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{link.title}</span>
                  </Link>
                )
              })}
            </div>
          </nav>

          {/* Admin Profile Footer */}
          <div className="p-4 border-t bg-gray-50">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium">Admin User</p>
                <p className="text-sm text-gray-500">admin@teachersgallery.com</p>
              </div>
            </div>
            <Button variant="outline" className="w-full flex items-center gap-2">
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className={cn(
        "transition-all duration-200 ease-in-out min-h-screen",
        "lg:ml-64 p-8"
      )}>
        <div className="bg-white rounded-lg shadow-sm p-6">
          {children}
        </div>
      </main>
    </div>
  )
} 