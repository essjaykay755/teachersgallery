"use client"

import { Button } from "@/components/ui/button"
import { Notification, getNotificationColor, getNotificationBorder } from "@/data/notifications"
import { cn } from "@/lib/utils"

interface NotificationItemProps {
  notification: Notification
  onMarkAsRead?: (id: string) => void
}

export function NotificationItem({ notification, onMarkAsRead }: NotificationItemProps) {
  const Icon = notification.icon
  const colorClasses = getNotificationColor(notification.type)
  const borderClass = notification.severity ? getNotificationBorder(notification.severity) : ""

  return (
    <div className={cn(
      "flex items-start gap-4 p-4 bg-white border-l-4 hover:bg-gray-50/50 transition-colors",
      !notification.read && "bg-blue-50/20",
      borderClass
    )}>
      <div className={cn(
        "flex items-center justify-center h-8 w-8 rounded-full shrink-0",
        colorClasses
      )}>
        <Icon className="h-4 w-4" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h4 className="text-sm font-medium text-gray-900">{notification.title}</h4>
            <p className="text-sm text-gray-500 mt-0.5 break-words">{notification.message}</p>
          </div>
          <span className="text-xs text-gray-400 whitespace-nowrap">{notification.time}</span>
        </div>

        {notification.actionLabel && (
          <div className="mt-2 flex items-center gap-3">
            <Button 
              variant="link" 
              className="h-auto p-0 text-sm font-medium"
              asChild
            >
              <a href={notification.actionUrl}>{notification.actionLabel}</a>
            </Button>
            {!notification.read && onMarkAsRead && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-auto py-1 px-2 text-xs"
                onClick={() => onMarkAsRead(notification.id)}
              >
                Mark as read
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  )
} 