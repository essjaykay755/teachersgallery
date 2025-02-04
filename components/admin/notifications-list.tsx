import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { NotificationItem } from "./notification-item"
import { notifications as initialNotifications } from "@/data/notifications"
import { Bell, CheckCheck } from "lucide-react"

export function NotificationsList() {
  const [notifications, setNotifications] = useState(initialNotifications)
  const unreadCount = notifications.filter(n => !n.read).length

  const handleMarkAsRead = (id: string) => {
    setNotifications(notifications.map(notification =>
      notification.id === id ? { ...notification, read: true } : notification
    ))
  }

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(notification => ({ ...notification, read: true })))
  }

  return (
    <Card>
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold">Notifications</h2>
          {unreadCount > 0 && (
            <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
              {unreadCount} unread
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <Button 
            variant="ghost" 
            size="sm"
            className="text-sm"
            onClick={handleMarkAllAsRead}
          >
            <CheckCheck className="h-4 w-4 mr-1" />
            Mark all as read
          </Button>
        )}
      </div>

      <div className="divide-y">
        {notifications.length > 0 ? (
          notifications.map(notification => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onMarkAsRead={handleMarkAsRead}
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <Bell className="h-6 w-6 text-gray-400" />
            </div>
            <h3 className="text-sm font-medium text-gray-900">No notifications</h3>
            <p className="text-sm text-gray-500 mt-1">
              You're all caught up! Check back later for new updates.
            </p>
          </div>
        )}
      </div>
    </Card>
  )
} 