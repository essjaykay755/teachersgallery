"use client"

import { Card } from "@/components/ui/card"
import {
  Users,
  GraduationCap,
  DollarSign,
  TrendingUp,
  Clock,
  Star,
  AlertCircle,
  CheckCircle2,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react"

// Mock data for the dashboard
const stats = [
  {
    title: "Total Teachers",
    value: "1,234",
    change: "+12%",
    trend: "up",
    icon: GraduationCap
  },
  {
    title: "Total Students",
    value: "5,678",
    change: "+8%",
    trend: "up",
    icon: Users
  },
  {
    title: "Total Revenue",
    value: "₹45,678",
    change: "+15%",
    trend: "up",
    icon: DollarSign
  },
  {
    title: "Active Bookings",
    value: "234",
    change: "-3%",
    trend: "down",
    icon: Clock
  }
]

const recentActivities = [
  {
    type: "teacher_joined",
    message: "New teacher registration: Priya Sharma",
    time: "2 minutes ago"
  },
  {
    type: "booking_completed",
    message: "Class completed: Mathematics with Rajesh Kumar",
    time: "5 minutes ago"
  },
  {
    type: "payment_received",
    message: "Payment received: ₹1,200 from Student ID #1234",
    time: "10 minutes ago"
  },
  {
    type: "review_added",
    message: "New 5-star review for Amit Patel",
    time: "15 minutes ago"
  },
  {
    type: "support_ticket",
    message: "New support ticket: Payment issue #5678",
    time: "20 minutes ago"
  }
]

const pendingActions = [
  {
    title: "Teacher Verifications",
    count: 12,
    icon: AlertCircle,
    color: "text-yellow-500"
  },
  {
    title: "Support Tickets",
    count: 8,
    icon: AlertCircle,
    color: "text-red-500"
  },
  {
    title: "Payment Approvals",
    count: 15,
    icon: DollarSign,
    color: "text-green-500"
  },
  {
    title: "Content Reviews",
    count: 6,
    icon: Star,
    color: "text-blue-500"
  }
]

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Dashboard Overview</h1>
          <p className="text-gray-500">Welcome back, Admin</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Last updated: 2 minutes ago</span>
          <button className="p-2 hover:bg-gray-100 rounded-lg">
            <TrendingUp className="h-5 w-5 text-gray-500" />
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title} className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="h-12 w-12 rounded-lg bg-blue-50 flex items-center justify-center">
                  <Icon className="h-6 w-6 text-blue-600" />
                </div>
                <span className={`
                  flex items-center gap-1 text-sm font-medium
                  ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}
                `}>
                  {stat.change}
                  {stat.trend === 'up' ? (
                    <ArrowUpRight className="h-4 w-4" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4" />
                  )}
                </span>
              </div>
              <h3 className="text-2xl font-bold mb-1">{stat.value}</h3>
              <p className="text-gray-500">{stat.title}</p>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
        {/* Recent Activity */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">{activity.message}</p>
                  <span className="text-xs text-gray-400">{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Pending Actions */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Pending Actions</h2>
          <div className="space-y-4">
            {pendingActions.map((action) => {
              const Icon = action.icon
              return (
                <div key={action.title} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-gray-50 flex items-center justify-center">
                      <Icon className={`h-4 w-4 ${action.color}`} />
                    </div>
                    <span className="text-sm text-gray-600">{action.title}</span>
                  </div>
                  <span className="text-sm font-medium">{action.count}</span>
                </div>
              )
            })}
          </div>
        </Card>
      </div>
    </div>
  )
} 