"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { GraduationCap, Users, User } from "lucide-react"

export default function ManageUsers() {
  const [activeTab, setActiveTab] = useState("teachers")

  const handleAddTeacher = (e: React.FormEvent) => {
    e.preventDefault()
    // Add teacher logic here
    console.log('Adding teacher...')
  }

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault()
    // Add student logic here
    console.log('Adding student...')
  }

  const handleAddParent = (e: React.FormEvent) => {
    e.preventDefault()
    // Add parent logic here
    console.log('Adding parent...')
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold">Manage Users</h1>
        <p className="text-gray-500">Add and manage teachers, students, and parents</p>
      </div>

      <Card>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full justify-start rounded-none border-b p-0">
            <TabsTrigger
              value="teachers"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 flex items-center gap-2"
            >
              <GraduationCap className="h-4 w-4" />
              Add Teacher
            </TabsTrigger>
            <TabsTrigger
              value="students"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 flex items-center gap-2"
            >
              <User className="h-4 w-4" />
              Add Student
            </TabsTrigger>
            <TabsTrigger
              value="parents"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 flex items-center gap-2"
            >
              <Users className="h-4 w-4" />
              Add Parent
            </TabsTrigger>
          </TabsList>

          <TabsContent value="teachers" className="p-6">
            <form onSubmit={handleAddTeacher} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>First Name</Label>
                  <Input placeholder="Enter first name" />
                </div>
                <div className="space-y-2">
                  <Label>Last Name</Label>
                  <Input placeholder="Enter last name" />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Email</Label>
                <Input type="email" placeholder="Enter email address" />
              </div>

              <div className="space-y-2">
                <Label>Phone</Label>
                <Input placeholder="Enter phone number" />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Password</Label>
                  <Input type="password" placeholder="Enter password" />
                </div>
                <div className="space-y-2">
                  <Label>Confirm Password</Label>
                  <Input type="password" placeholder="Confirm password" />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Subjects</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select subjects" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mathematics">Mathematics</SelectItem>
                    <SelectItem value="physics">Physics</SelectItem>
                    <SelectItem value="chemistry">Chemistry</SelectItem>
                    <SelectItem value="biology">Biology</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>About</Label>
                <Textarea placeholder="Enter teacher's bio and experience" />
              </div>

              <div className="space-y-2">
                <Label>Hourly Rate (₹)</Label>
                <Input type="number" placeholder="Enter hourly rate" />
              </div>

              <Button type="submit" className="w-full">Add Teacher</Button>
            </form>
          </TabsContent>

          <TabsContent value="students" className="p-6">
            <form onSubmit={handleAddStudent} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>First Name</Label>
                  <Input placeholder="Enter first name" />
                </div>
                <div className="space-y-2">
                  <Label>Last Name</Label>
                  <Input placeholder="Enter last name" />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Email</Label>
                <Input type="email" placeholder="Enter email address" />
              </div>

              <div className="space-y-2">
                <Label>Phone</Label>
                <Input placeholder="Enter phone number" />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Password</Label>
                  <Input type="password" placeholder="Enter password" />
                </div>
                <div className="space-y-2">
                  <Label>Confirm Password</Label>
                  <Input type="password" placeholder="Confirm password" />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Grade/Class</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select grade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="8">Class 8</SelectItem>
                    <SelectItem value="9">Class 9</SelectItem>
                    <SelectItem value="10">Class 10</SelectItem>
                    <SelectItem value="11">Class 11</SelectItem>
                    <SelectItem value="12">Class 12</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Subjects Interested In</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select subjects" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mathematics">Mathematics</SelectItem>
                    <SelectItem value="physics">Physics</SelectItem>
                    <SelectItem value="chemistry">Chemistry</SelectItem>
                    <SelectItem value="biology">Biology</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit" className="w-full">Add Student</Button>
            </form>
          </TabsContent>

          <TabsContent value="parents" className="p-6">
            <form onSubmit={handleAddParent} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>First Name</Label>
                  <Input placeholder="Enter first name" />
                </div>
                <div className="space-y-2">
                  <Label>Last Name</Label>
                  <Input placeholder="Enter last name" />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Email</Label>
                <Input type="email" placeholder="Enter email address" />
              </div>

              <div className="space-y-2">
                <Label>Phone</Label>
                <Input placeholder="Enter phone number" />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Password</Label>
                  <Input type="password" placeholder="Enter password" />
                </div>
                <div className="space-y-2">
                  <Label>Confirm Password</Label>
                  <Input type="password" placeholder="Confirm password" />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Number of Children</Label>
                <Input type="number" placeholder="Enter number of children" />
              </div>

              <div className="space-y-2">
                <Label>Location</Label>
                <Input placeholder="Enter location" />
              </div>

              <Button type="submit" className="w-full">Add Parent</Button>
            </form>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  )
} 