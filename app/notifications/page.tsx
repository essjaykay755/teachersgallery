"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Navbar from "@/components/navbar"
import { MessageSquare, Calendar, Bell, CheckCircle2 } from "lucide-react"

// Mock notifications data - In a real app, this would come from an API
const mockNotifications = [
  {
    id: 1,
    type: "message",
    content: "New message from Priya Sharma",
    time: "2 minutes ago",
    read: false,
    icon: MessageSquare,
  },
  {
    id: 2,
    type: "booking",
    content: "Your class with Rajesh Kumar is confirmed",
    time: "1 hour ago",
    read: false,
    icon: Calendar,
  },
  {
    id: 3,
    type: "system",
    content: "Welcome to TeachersGallery!",
    time: "2 days ago",
    read: true,
    icon: Bell,
  },
  {
    id: 4,
    type: "booking",
    content: "Booking request from Amit Patel for Mathematics",
    time: "3 days ago",
    read: true,
    icon: Calendar,
  },
  {
    id: 5,
    type: "message",
    content: "New message from Sneha Gupta regarding Physics classes",
    time: "4 days ago",
    read: true,
    icon: MessageSquare,
  },
]

export default function NotificationsPage() {
  const [filter, setFilter] = useState("all")
  const [sortBy, setSortBy] = useState("newest")

  const getFilteredNotifications = () => {
    let filtered = [...mockNotifications]

    // Apply filter
    if (filter !== "all") {
      filtered = filtered.filter(n => n.type === filter)
    }

    // Apply sorting
    filtered.sort((a, b) => {
      if (sortBy === "newest") {
        return -1 // In real app, compare actual timestamps
      } else {
        return 1
      }
    })

    return filtered
  }

  const markAllAsRead = () => {
    // In real app, make API call to mark all as read
    console.log("Marking all as read...")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Notifications</CardTitle>
              <div className="flex items-center gap-4">
                <Select value={filter} onValueChange={setFilter}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Filter by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="message">Messages</SelectItem>
                    <SelectItem value="booking">Bookings</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" onClick={markAllAsRead}>
                  Mark all as read
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {getFilteredNotifications().map((notification) => {
                  const Icon = notification.icon
                  return (
                    <div
                      key={notification.id}
                      className={`flex items-start gap-4 p-4 rounded-lg border ${
                        !notification.read ? 'bg-blue-50 border-blue-100' : 'bg-white border-gray-100'
                      }`}
                    >
                      <div className={`p-2 rounded-full ${
                        !notification.read ? 'bg-blue-100' : 'bg-gray-100'
                      }`}>
                        <Icon className="h-5 w-5 text-gray-600" />
                      </div>
                      <div className="flex-grow">
                        <p className="text-sm text-gray-800">{notification.content}</p>
                        <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                      </div>
                      {notification.read && (
                        <CheckCircle2 className="h-5 w-5 text-gray-400" />
                      )}
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
} 