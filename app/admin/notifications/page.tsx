"use client"

import { NotificationsList } from "@/components/admin/notifications-list"

export default function AdminNotifications() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Notifications</h1>
        <p className="text-gray-500">View and manage system notifications</p>
      </div>

      {/* Notifications List */}
      <NotificationsList />
    </div>
  )
} 