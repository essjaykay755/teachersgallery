"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import Image from "next/image"
import { Camera, Mail, Phone, MapPin, Calendar, Clock } from "lucide-react"

// Mock user data - In real app, this would come from your auth system
const mockUser = {
  type: "teacher", // or "student" or "parent"
  name: "John Doe",
  email: "john@example.com",
  phone: "+91 98765 43210",
  avatar: "/avatar.jpg",
  listingActive: true,
  featuredUntil: "2024-05-01", // null if not featured
}

export default function Account() {
  const [isClient, setIsClient] = useState(false)
  const [activeTab, setActiveTab] = useState("profile")
  const [image, setImage] = useState<string | null>(null)
  const [isListingActive, setIsListingActive] = useState(mockUser.listingActive)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const getDaysRemaining = (dateString: string | null) => {
    if (!dateString) return 0
    const featuredUntil = new Date(dateString)
    const today = new Date()
    const diffTime = featuredUntil.getTime() - today.getTime()
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  const renderTeacherSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Hourly Rate</Label>
          <Input type="number" placeholder="800" defaultValue="800" />
        </div>
        <div className="space-y-2">
          <Label>Teaching Mode</Label>
          <Select defaultValue="hybrid">
            <SelectTrigger>
              <SelectValue placeholder="Select mode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="online">Online Only</SelectItem>
              <SelectItem value="offline">Offline Only</SelectItem>
              <SelectItem value="hybrid">Hybrid</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Areas You Cover</Label>
        <Input placeholder="e.g., Andheri, Bandra, Juhu" />
      </div>

      <div className="space-y-2">
        <Label>Availability</Label>
        <div className="grid grid-cols-2 gap-4">
          <Select defaultValue="9-5">
            <SelectTrigger>
              <SelectValue placeholder="Weekday hours" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="9-5">9 AM - 5 PM</SelectItem>
              <SelectItem value="10-6">10 AM - 6 PM</SelectItem>
              <SelectItem value="11-7">11 AM - 7 PM</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="10-6">
            <SelectTrigger>
              <SelectValue placeholder="Weekend hours" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="9-5">9 AM - 5 PM</SelectItem>
              <SelectItem value="10-6">10 AM - 6 PM</SelectItem>
              <SelectItem value="11-7">11 AM - 7 PM</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-6 border-t pt-6">
        <h3 className="font-medium">Listing Settings</h3>
        
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Show Your Listing</Label>
            <p className="text-sm text-gray-500">Make your profile visible to students in the Find Teachers section</p>
          </div>
          <Switch 
            checked={isListingActive}
            onCheckedChange={setIsListingActive}
          />
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <h4 className="font-medium">Featured Status</h4>
            {mockUser.featuredUntil ? (
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                    Featured
                  </span>
                  <span className="text-sm text-gray-600">
                    {getDaysRemaining(mockUser.featuredUntil)} days remaining
                  </span>
                </div>
                <p className="text-sm text-gray-500">
                  Your profile is featured and appears at the top of search results
                </p>
              </div>
            ) : (
              <div className="space-y-1">
                <p className="text-sm text-gray-600">
                  Get more visibility with a featured listing
                </p>
                <p className="text-sm font-medium text-blue-600">
                  ₹999/month
                </p>
              </div>
            )}
          </div>
          <Button variant={mockUser.featuredUntil ? "outline" : "default"}>
            {mockUser.featuredUntil ? "Manage" : "Upgrade"}
          </Button>
        </div>
      </div>
    </div>
  )

  const renderStudentSettings = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Grade/Class</Label>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select grade" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="8">8th Grade</SelectItem>
            <SelectItem value="9">9th Grade</SelectItem>
            <SelectItem value="10">10th Grade</SelectItem>
            <SelectItem value="11">11th Grade</SelectItem>
            <SelectItem value="12">12th Grade</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Preferred Mode</Label>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select mode" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="online">Online Only</SelectItem>
            <SelectItem value="offline">Offline Only</SelectItem>
            <SelectItem value="hybrid">No Preference</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Subjects of Interest</Label>
        <Input placeholder="e.g., Mathematics, Physics, Chemistry" />
      </div>
    </div>
  )

  const renderParentSettings = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Number of Children</Label>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select number" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">1</SelectItem>
            <SelectItem value="2">2</SelectItem>
            <SelectItem value="3">3 or more</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Children's Grades</Label>
        <Input placeholder="e.g., 8th, 10th" />
      </div>

      <div className="space-y-2">
        <Label>Preferred Teaching Mode</Label>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select mode" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="online">Online Only</SelectItem>
            <SelectItem value="offline">Offline Only</SelectItem>
            <SelectItem value="hybrid">No Preference</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>Manage your account settings and preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="profile">Profile</TabsTrigger>
                  <TabsTrigger value="preferences">Preferences</TabsTrigger>
                  <TabsTrigger value="notifications">Notifications</TabsTrigger>
                  <TabsTrigger value="security">Security</TabsTrigger>
                </TabsList>

                <TabsContent value="profile" className="space-y-6">
                  <div className="flex items-center gap-4 py-4">
                    <div className="h-20 w-20 rounded-full overflow-hidden">
                      <img
                        src={mockUser.avatar}
                        alt="Profile"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <Button variant="outline" size="sm">
                        Change Photo
                      </Button>
                    </div>
                  </div>

                  <div className="grid gap-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" defaultValue={mockUser.name} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" defaultValue={mockUser.email} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input id="phone" defaultValue={mockUser.phone} />
                    </div>
                  </div>

                  {mockUser.type === "teacher" && renderTeacherSettings()}
                  {mockUser.type === "student" && renderStudentSettings()}
                  {mockUser.type === "parent" && renderParentSettings()}
                </TabsContent>

                <TabsContent value="preferences" className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Email Notifications</Label>
                      <Select defaultValue="all">
                        <SelectTrigger>
                          <SelectValue placeholder="Select preference" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Notifications</SelectItem>
                          <SelectItem value="important">Important Only</SelectItem>
                          <SelectItem value="none">None</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Language</Label>
                      <Select defaultValue="en">
                        <SelectTrigger>
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="hi">Hindi</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="notifications" className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between py-3">
                      <div>
                        <h4 className="text-sm font-medium">Email Notifications</h4>
                        <p className="text-sm text-gray-500">Receive email about your account activity</p>
                      </div>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between py-3">
                      <div>
                        <h4 className="text-sm font-medium">Push Notifications</h4>
                        <p className="text-sm text-gray-500">Receive push notifications about new messages</p>
                      </div>
                      <Switch />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="security" className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="current-password">Current Password</Label>
                      <Input id="current-password" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-password">New Password</Label>
                      <Input id="new-password" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm New Password</Label>
                      <Input id="confirm-password" type="password" />
                    </div>
                    <Button>Update Password</Button>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="flex justify-end gap-4 mt-6">
                <Button variant="outline">Cancel</Button>
                <Button>Save Changes</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
} 