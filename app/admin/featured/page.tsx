"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Crown,
  BadgeCheck,
  Star,
  Clock,
  Calendar,
  Users,
  Search,
  ArrowUpDown,
  MoreVertical,
} from "lucide-react"
import Image from "next/image"

// Mock data for featured teachers
const featuredTeachers = [
  {
    id: "T001",
    name: "Priya Sharma",
    avatar: "/avatars/avatar1.jpg",
    subject: "Mathematics",
    rating: 4.8,
    students: 45,
    featuredUntil: "2024-03-15",
    plan: "Monthly",
    status: "active",
    verified: true
  },
  {
    id: "T002",
    name: "Rajesh Kumar",
    avatar: "/avatars/avatar2.jpg",
    subject: "Physics",
    rating: 4.6,
    students: 32,
    featuredUntil: "2024-03-10",
    plan: "Weekly",
    status: "active",
    verified: true
  }
]

// Pricing plans
const pricingPlans = [
  {
    id: "weekly",
    name: "Weekly Featured",
    price: "₹499",
    duration: "7 days",
    features: [
      "Priority in search results",
      "Featured badge on profile",
      "Higher visibility to students",
      "Weekly performance analytics"
    ]
  },
  {
    id: "monthly",
    name: "Monthly Featured",
    price: "₹1,499",
    duration: "30 days",
    features: [
      "All Weekly Featured benefits",
      "20% discount on monthly rate",
      "Monthly performance report",
      "Premium support"
    ]
  }
]

export default function ManageFeatured() {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold">Manage Featured Teachers</h1>
        <p className="text-gray-500">Manage featured listings and pricing plans</p>
      </div>

      {/* Pricing Plans */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Featured Listing Plans</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {pricingPlans.map((plan) => (
            <Card key={plan.id} className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-medium flex items-center gap-2">
                    <Crown className="h-5 w-5 text-blue-500" />
                    {plan.name}
                  </h3>
                  <div className="mt-2">
                    <span className="text-3xl font-bold">{plan.price}</span>
                    <span className="text-gray-500">/{plan.duration}</span>
                  </div>
                </div>
                <Button>Edit Plan</Button>
              </div>
              <div className="mt-4 space-y-2">
                {plan.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                    <BadgeCheck className="h-4 w-4 text-green-500" />
                    {feature}
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Current Featured Teachers */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Current Featured Teachers</h2>
          <div className="flex items-center gap-4">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search teachers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button>Add Featured Teacher</Button>
          </div>
        </div>

        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Teacher</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Students</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>
                  <div className="flex items-center gap-1">
                    Featured Until
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {featuredTeachers.map((teacher) => (
                <TableRow key={teacher.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100">
                        <Image
                          src={teacher.avatar}
                          alt={teacher.name}
                          width={40}
                          height={40}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="font-medium flex items-center gap-1">
                          {teacher.name}
                          {teacher.verified && (
                            <BadgeCheck className="h-4 w-4 text-blue-500" />
                          )}
                        </div>
                        <div className="text-sm text-gray-500">{teacher.id}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{teacher.subject}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                      <span>{teacher.rating}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4 text-gray-500" />
                      <span>{teacher.students}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span>{teacher.plan}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span>{teacher.featuredUntil}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      teacher.status === 'active' 
                        ? 'bg-green-50 text-green-600'
                        : 'bg-yellow-50 text-yellow-600'
                    }`}>
                      {teacher.status.charAt(0).toUpperCase() + teacher.status.slice(1)}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  )
} 