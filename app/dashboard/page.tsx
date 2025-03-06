"use client";

import { useAuth } from "@/lib/contexts/auth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const { profile } = useAuth();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      
      <Card>
        <CardContent className="p-4 sm:p-6">
          <h2 className="text-xl font-semibold mb-4">Welcome, {profile?.full_name || "User"}</h2>
          <p className="text-gray-600 mb-6">
            Manage your profile and connect with students
          </p>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg border shadow-sm">
              <h3 className="text-sm font-medium text-gray-500">Messages</h3>
              <div className="mt-1 flex items-baseline justify-between">
                <p className="text-2xl font-semibold">5</p>
                <span className="text-xs text-green-600 font-medium">+2 new today</span>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg border shadow-sm">
              <h3 className="text-sm font-medium text-gray-500">Reviews</h3>
              <div className="mt-1 flex items-baseline justify-between">
                <p className="text-2xl font-semibold">3</p>
                <span className="text-xs text-green-600 font-medium">1 new this week</span>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg border shadow-sm">
              <h3 className="text-sm font-medium text-gray-500">Profile Views</h3>
              <div className="mt-1 flex items-baseline justify-between">
                <p className="text-2xl font-semibold">28</p>
                <span className="text-xs text-green-600 font-medium">+12% from last week</span>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg border shadow-sm">
              <h3 className="text-sm font-medium text-gray-500">Rating</h3>
              <div className="mt-1 flex items-baseline justify-between">
                <p className="text-2xl font-semibold">4.8</p>
                <span className="text-xs text-gray-500 font-medium">Based on 3 reviews</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Recent Activity */}
      <Card>
        <CardContent className="p-4 sm:p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700">
                M
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium truncate">New message from Rahul Sharma</h3>
                <p className="text-sm text-gray-500">2 hours ago</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-700">
                R
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium truncate">New review from Priya Patel</h3>
                <p className="text-sm text-gray-500">Yesterday</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-700">
                V
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium truncate">Your profile was viewed 10 times</h3>
                <p className="text-sm text-gray-500">This week</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Quick Actions */}
      <Card>
        <CardContent className="p-4 sm:p-6">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Button variant="outline" className="w-full">
              Update Profile
            </Button>
            <Button variant="outline" className="w-full">
              Message Students
            </Button>
            <Button variant="outline" className="w-full">
              View Schedule
            </Button>
            <Button variant="outline" className="w-full">
              Manage Availability
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}