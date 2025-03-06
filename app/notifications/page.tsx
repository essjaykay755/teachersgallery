"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/contexts/auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bell } from "lucide-react"

// Mock notifications for demonstration
const mockNotifications = [
  {
    id: 1,
    title: "New message received",
    description: "You have received a new message from John Doe",
    date: "2 hours ago",
    read: false,
  },
  {
    id: 2,
    title: "Profile view",
    description: "Your profile was viewed by 5 new students",
    date: "Yesterday",
    read: true,
  },
  {
    id: 3,
    title: "New review",
    description: "You received a new 5-star review from Sarah Smith",
    date: "3 days ago",
    read: true,
  },
]

export default function NotificationsPage() {
  const { user, profile } = useAuth()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return null
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Notifications</h1>
      
      <div className="space-y-4">
        {mockNotifications.length > 0 ? (
          mockNotifications.map((notification) => (
            <Card key={notification.id} className={notification.read ? "opacity-75" : ""}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">{notification.title}</CardTitle>
                  <span className="text-sm text-gray-500">{notification.date}</span>
                </div>
                {!notification.read && (
                  <div className="absolute top-4 right-4 h-2 w-2 bg-blue-500 rounded-full"></div>
                )}
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">{notification.description}</CardDescription>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-12">
            <Bell className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">No notifications</h3>
            <p className="mt-2 text-sm text-gray-500">
              You don't have any notifications at the moment.
            </p>
          </div>
        )}
      </div>
    </div>
  )
} 