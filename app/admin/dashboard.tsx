"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
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
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Crown,
  BadgeCheck
} from "lucide-react"
import { Button } from "@/components/ui/button"

// Mock data for dashboard statistics
const stats = [
  {
    title: "Total Teachers",
    value: "1,234",
    change: "+12%",
    trend: "up",
    icon: GraduationCap,
    color: "bg-blue-50 text-blue-600",
    details: {
      verified: "1,100",
      featured: "134"
    }
  },
  {
    title: "Total Students",
    value: "5,678",
    change: "+8%",
    trend: "up",
    icon: Users,
    color: "bg-green-50 text-green-600",
    details: {
      active: "4,500",
      new: "178"
    }
  },
  {
    title: "Total Parents",
    value: "3,456",
    change: "+15%",
    trend: "up",
    icon: Users2,
    color: "bg-purple-50 text-purple-600",
    details: {
      active: "3,000",
      new: "156"
    }
  },
  {
    title: "Total Revenue",
    value: "₹45,678",
    change: "+5%",
    trend: "up",
    icon: DollarSign,
    color: "bg-yellow-50 text-yellow-600",
    details: {
      thisMonth: "₹12,345",
      lastMonth: "₹11,234"
    }
  }
]

// Mock data for recent activities
const recentActivities = [
  {
    message: "New teacher registration: Priya Sharma",
    timestamp: "2 minutes ago",
    icon: GraduationCap,
    color: "text-blue-600"
  },
  {
    message: "New parent registration: Rajesh Kumar",
    timestamp: "15 minutes ago",
    icon: Users2,
    color: "text-purple-600"
  },
  {
    message: "Teacher featured: Anjali Desai",
    timestamp: "1 hour ago",
    icon: Crown,
    color: "text-yellow-600"
  },
  {
    message: "New review posted for teacher",
    timestamp: "2 hours ago",
    icon: Star,
    color: "text-orange-600"
  },
  {
    message: "Teacher verified: Rahul Verma",
    timestamp: "3 hours ago",
    icon: BadgeCheck,
    color: "text-green-600"
  }
]

// Mock data for pending actions
const pendingActions = [
  {
    title: "Teacher Verifications",
    count: 12,
    icon: GraduationCap,
    color: "text-blue-600",
    bgColor: "bg-blue-50"
  },
  {
    title: "Support Tickets",
    count: 8,
    icon: LifeBuoy,
    color: "text-yellow-600",
    bgColor: "bg-yellow-50"
  },
  {
    title: "Featured Payments",
    count: 5,
    icon: Crown,
    color: "text-green-600",
    bgColor: "bg-green-50"
  },
  {
    title: "Content Reviews",
    count: 15,
    icon: Star,
    color: "text-purple-600",
    bgColor: "bg-purple-50"
  }
]

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title} className="relative overflow-hidden">
              <div className="p-6">
                <div className="flex items-center gap-3">
                  <div className={`h-12 w-12 rounded-lg ${stat.color} flex items-center justify-center`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">{stat.title}</p>
                    <div className="flex items-center gap-2">
                      <h3 className="text-2xl font-bold">{stat.value}</h3>
                      <span className={`text-sm flex items-center ${
                        stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {stat.trend === 'up' ? (
                          <ArrowUpRight className="h-4 w-4" />
                        ) : (
                          <ArrowDownRight className="h-4 w-4" />
                        )}
                        {stat.change}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t grid grid-cols-2 gap-4">
                  {Object.entries(stat.details).map(([key, value]) => (
                    <div key={key}>
                      <p className="text-xs text-gray-500 capitalize">{key}</p>
                      <p className="text-sm font-medium">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="absolute top-0 right-0 p-2">
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <TrendingUp className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Recent Activity and Pending Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">Recent Activity</h2>
              <Button variant="outline" size="sm">View All</Button>
            </div>
            <div className="space-y-6">
              {recentActivities.map((activity, index) => {
                const Icon = activity.icon
                return (
                  <div key={index} className="flex items-start gap-4">
                    <div className={`h-8 w-8 rounded-full bg-gray-50 flex items-center justify-center ${activity.color}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">{activity.message}</p>
                      <p className="text-xs text-gray-400">{activity.timestamp}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </Card>

        {/* Pending Actions */}
        <Card>
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">Pending Actions</h2>
              <Button variant="outline" size="sm">View All</Button>
            </div>
            <div className="space-y-4">
              {pendingActions.map((action) => {
                const Icon = action.icon
                return (
                  <div key={action.title} className="flex items-center justify-between p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`h-10 w-10 rounded-lg ${action.bgColor} flex items-center justify-center ${action.color}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium">{action.title}</p>
                        <p className="text-sm text-gray-500">{action.count} pending</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className={action.color}>
                      View
                    </Button>
                  </div>
                )
              })}
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
} 