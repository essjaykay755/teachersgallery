import { 
  UserPlus, 
  Star, 
  AlertTriangle, 
  Flag, 
  MessageSquare, 
  BadgeCheck, 
  Ban,
  DollarSign,
  Crown
} from "lucide-react"

export type NotificationType = 
  | "new_teacher"
  | "new_review"
  | "report"
  | "verification"
  | "message"
  | "payment"
  | "featured"
  | "block"

export interface Notification {
  id: string
  type: NotificationType
  title: string
  message: string
  time: string
  read: boolean
  actionUrl?: string
  actionLabel?: string
  icon: any // Lucide icon component
  severity?: "low" | "medium" | "high"
}

export const notifications: Notification[] = [
  {
    id: "1",
    type: "new_teacher",
    title: "New Teacher Registration",
    message: "Rajesh Kumar has registered as a Physics teacher",
    time: "2 minutes ago",
    read: false,
    actionUrl: "/admin/teachers/T123",
    actionLabel: "Review Profile",
    icon: UserPlus,
    severity: "medium"
  },
  {
    id: "2",
    type: "verification",
    title: "Verification Request",
    message: "Priya Sharma has submitted documents for verification",
    time: "15 minutes ago",
    read: false,
    actionUrl: "/admin/verifications/V456",
    actionLabel: "Verify Documents",
    icon: BadgeCheck,
    severity: "high"
  },
  {
    id: "3",
    type: "report",
    title: "Content Reported",
    message: "A review has been reported for inappropriate content",
    time: "1 hour ago",
    read: false,
    actionUrl: "/admin/reports/R789",
    actionLabel: "Review Report",
    icon: Flag,
    severity: "high"
  },
  {
    id: "4",
    type: "new_review",
    title: "New Teacher Review",
    message: "A new 2-star review has been posted for Amit Shah",
    time: "2 hours ago",
    read: true,
    actionUrl: "/admin/reviews/RV101",
    actionLabel: "View Review",
    icon: Star,
    severity: "medium"
  },
  {
    id: "5",
    type: "message",
    title: "Support Message",
    message: "New support request from student regarding payment issue",
    time: "3 hours ago",
    read: true,
    actionUrl: "/admin/messages/M202",
    actionLabel: "Reply",
    icon: MessageSquare,
    severity: "medium"
  },
  {
    id: "6",
    type: "payment",
    title: "Failed Payment",
    message: "Featured listing payment failed for teacher Sanjay Mehta",
    time: "4 hours ago",
    read: true,
    actionUrl: "/admin/payments/P303",
    actionLabel: "Review Payment",
    icon: DollarSign,
    severity: "high"
  },
  {
    id: "7",
    type: "featured",
    title: "New Featured Request",
    message: "Anita Desai has requested a featured listing upgrade",
    time: "5 hours ago",
    read: true,
    actionUrl: "/admin/featured/F404",
    actionLabel: "Process Request",
    icon: Crown,
    severity: "low"
  },
  {
    id: "8",
    type: "block",
    title: "Account Blocked",
    message: "Teacher account blocked due to multiple violations",
    time: "6 hours ago",
    read: true,
    actionUrl: "/admin/teachers/T505",
    actionLabel: "Review Block",
    icon: Ban,
    severity: "high"
  },
  {
    id: "9",
    type: "verification",
    title: "Document Verification Failed",
    message: "Unable to verify teaching certificates for Rahul Verma",
    time: "8 hours ago",
    read: true,
    actionUrl: "/admin/verifications/V606",
    actionLabel: "Contact Teacher",
    icon: AlertTriangle,
    severity: "high"
  },
  {
    id: "10",
    type: "new_teacher",
    title: "Profile Update",
    message: "5 new teachers have completed their profiles",
    time: "12 hours ago",
    read: true,
    actionUrl: "/admin/teachers",
    actionLabel: "View Teachers",
    icon: UserPlus,
    severity: "low"
  }
]

export const getNotificationColor = (type: NotificationType) => {
  const colors = {
    new_teacher: "bg-blue-50 text-blue-700",
    new_review: "bg-yellow-50 text-yellow-700",
    report: "bg-red-50 text-red-700",
    verification: "bg-green-50 text-green-700",
    message: "bg-purple-50 text-purple-700",
    payment: "bg-orange-50 text-orange-700",
    featured: "bg-indigo-50 text-indigo-700",
    block: "bg-gray-50 text-gray-700"
  }
  return colors[type]
}

export const getNotificationBorder = (severity: "low" | "medium" | "high") => {
  const borders = {
    low: "border-l-blue-500",
    medium: "border-l-yellow-500",
    high: "border-l-red-500"
  }
  return borders[severity]
} 