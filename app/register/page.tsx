"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"

export default function Register() {
  const [userType, setUserType] = useState("student")

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Create an Account</CardTitle>
              <CardDescription>Join TeachersGallery to connect with teachers and students</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs 
                defaultValue="student" 
                className="w-full" 
                onValueChange={(value: string) => setUserType(value)}
              >
                <TabsList className="grid w-full grid-cols-3 mb-8">
                  <TabsTrigger value="student">Student</TabsTrigger>
                  <TabsTrigger value="parent">Parent</TabsTrigger>
                  <TabsTrigger value="teacher">Teacher</TabsTrigger>
                </TabsList>

                <TabsContent value="student">
                  <form className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input id="firstName" placeholder="John" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input id="lastName" placeholder="Doe" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="john@example.com" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input id="password" type="password" placeholder="Enter password" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <Input id="confirmPassword" type="password" placeholder="Confirm your password" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="grade">Current Grade/Class</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your grade" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="6">6th Grade</SelectItem>
                          <SelectItem value="7">7th Grade</SelectItem>
                          <SelectItem value="8">8th Grade</SelectItem>
                          <SelectItem value="9">9th Grade</SelectItem>
                          <SelectItem value="10">10th Grade</SelectItem>
                          <SelectItem value="11">11th Grade</SelectItem>
                          <SelectItem value="12">12th Grade</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Button className="w-full">Create Student Account</Button>
                  </form>
                </TabsContent>

                <TabsContent value="parent">
                  <form className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input id="firstName" placeholder="John" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input id="lastName" placeholder="Doe" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="john@example.com" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input id="password" type="password" placeholder="Enter password" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <Input id="confirmPassword" type="password" placeholder="Confirm your password" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" type="tel" placeholder="+91 98765 43210" />
                    </div>

                    <div className="space-y-2">
                      <Label>Number of Children</Label>
                      <RadioGroup defaultValue="1" className="flex gap-4">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="1" id="children-1" />
                          <Label htmlFor="children-1">1</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="2" id="children-2" />
                          <Label htmlFor="children-2">2</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="3" id="children-3" />
                          <Label htmlFor="children-3">3+</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <Button className="w-full">Create Parent Account</Button>
                  </form>
                </TabsContent>

                <TabsContent value="teacher">
                  <form className="space-y-6">
                    <div className="space-y-4">
                      <Label>Profile Photo</Label>
                      <div className="flex items-center gap-4">
                        <div className="w-24 h-24 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center relative overflow-hidden">
                          <input
                            type="file"
                            accept="image/*"
                            className="absolute inset-0 opacity-0 cursor-pointer"
                          />
                          <div className="text-gray-500 text-sm text-center">
                            <div className="mb-1">Upload</div>
                            <div>Photo</div>
                          </div>
                        </div>
                        <div className="text-sm text-gray-500">
                          Upload a professional photo. Students respond better to teachers with clear photos.
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input id="firstName" placeholder="John" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input id="lastName" placeholder="Doe" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="john@example.com" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input id="password" type="password" placeholder="Enter password" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <Input id="confirmPassword" type="password" placeholder="Confirm your password" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" type="tel" placeholder="+91 98765 43210" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="location">City</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select city" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="mumbai">Mumbai</SelectItem>
                            <SelectItem value="delhi">Delhi</SelectItem>
                            <SelectItem value="bangalore">Bangalore</SelectItem>
                            <SelectItem value="kolkata">Kolkata</SelectItem>
                            <SelectItem value="chennai">Chennai</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="state">State</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select state" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="maharashtra">Maharashtra</SelectItem>
                            <SelectItem value="delhi">Delhi</SelectItem>
                            <SelectItem value="karnataka">Karnataka</SelectItem>
                            <SelectItem value="west-bengal">West Bengal</SelectItem>
                            <SelectItem value="tamil-nadu">Tamil Nadu</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="coverage">Areas You Cover</Label>
                      <Input 
                        id="coverage" 
                        placeholder="e.g., Andheri, Bandra, Juhu (comma separated)"
                      />
                      <p className="text-sm text-gray-500">Enter the areas where you can conduct offline classes</p>
                    </div>

                    <div className="space-y-2">
                      <Label>Teaching Mode</Label>
                      <div className="grid grid-cols-3 gap-4">
                        <label className="flex items-center gap-2">
                          <input type="checkbox" className="rounded border-gray-300" />
                          <span>Online</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input type="checkbox" className="rounded border-gray-300" />
                          <span>Offline</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input type="checkbox" className="rounded border-gray-300" />
                          <span>Hybrid</span>
                        </label>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Class Range</Label>
                      <div className="grid grid-cols-2 gap-4">
                        <label className="flex items-center gap-2">
                          <input type="checkbox" className="rounded border-gray-300" />
                          <span>Primary (1-5)</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input type="checkbox" className="rounded border-gray-300" />
                          <span>Middle (6-8)</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input type="checkbox" className="rounded border-gray-300" />
                          <span>High School (9-10)</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input type="checkbox" className="rounded border-gray-300" />
                          <span>Higher Secondary (11-12)</span>
                        </label>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Specialized Courses</Label>
                      <div className="grid grid-cols-2 gap-4">
                        <label className="flex items-center gap-2">
                          <input type="checkbox" className="rounded border-gray-300" />
                          <span>IIT-JEE</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input type="checkbox" className="rounded border-gray-300" />
                          <span>NEET</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input type="checkbox" className="rounded border-gray-300" />
                          <span>CBSE</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input type="checkbox" className="rounded border-gray-300" />
                          <span>ICSE</span>
                        </label>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Batch Size</Label>
                      <div className="grid grid-cols-2 gap-4">
                        <label className="flex items-center gap-2">
                          <input type="checkbox" className="rounded border-gray-300" />
                          <span>Individual</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input type="checkbox" className="rounded border-gray-300" />
                          <span>Small Groups (2-5)</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input type="checkbox" className="rounded border-gray-300" />
                          <span>Large Groups (6+)</span>
                        </label>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subjects">Primary Subject</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select primary subject" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="mathematics">Mathematics</SelectItem>
                          <SelectItem value="physics">Physics</SelectItem>
                          <SelectItem value="chemistry">Chemistry</SelectItem>
                          <SelectItem value="biology">Biology</SelectItem>
                          <SelectItem value="english">English</SelectItem>
                          <SelectItem value="history">History</SelectItem>
                          <SelectItem value="geography">Geography</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="experience">Years of Experience</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select experience" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0-2">0-2 years</SelectItem>
                          <SelectItem value="3-5">3-5 years</SelectItem>
                          <SelectItem value="6-10">6-10 years</SelectItem>
                          <SelectItem value="10+">10+ years</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="qualification">Highest Qualification</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select qualification" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="bachelors">Bachelor's Degree</SelectItem>
                          <SelectItem value="masters">Master's Degree</SelectItem>
                          <SelectItem value="phd">Ph.D.</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="hourlyRate">Hourly Rate (₹)</Label>
                      <Input 
                        id="hourlyRate" 
                        type="number" 
                        placeholder="e.g., 800"
                        min="100"
                        step="50"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Availability</Label>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm text-gray-500">Weekdays</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select hours" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="9-5">9 AM - 5 PM</SelectItem>
                              <SelectItem value="10-6">10 AM - 6 PM</SelectItem>
                              <SelectItem value="11-7">11 AM - 7 PM</SelectItem>
                              <SelectItem value="custom">Custom Hours</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label className="text-sm text-gray-500">Weekends</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select hours" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="9-5">9 AM - 5 PM</SelectItem>
                              <SelectItem value="10-6">10 AM - 6 PM</SelectItem>
                              <SelectItem value="11-7">11 AM - 7 PM</SelectItem>
                              <SelectItem value="custom">Custom Hours</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bio">Brief Bio</Label>
                      <textarea
                        id="bio"
                        className="w-full min-h-[100px] px-3 py-2 rounded-md border border-input bg-background"
                        placeholder="Tell us about your teaching experience, methodology, and achievements..."
                      />
                      <p className="text-sm text-gray-500">
                        Include your teaching philosophy, notable student achievements, and any specializations.
                      </p>
                    </div>

                    <div className="space-y-4 border-t pt-6">
                      <h3 className="font-medium">Listing Options</h3>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Show Your Listing</Label>
                          <p className="text-sm text-gray-500">Make your profile visible to students in the Find Teachers section</p>
                        </div>
                        <Switch defaultChecked />
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Label className="font-medium">Featured Listing</Label>
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                            Optional
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-4">
                          Get more visibility with a featured listing. Your profile will appear at the top of search results.
                        </p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Monthly Plan */}
                          <div className="relative border rounded-lg p-4 bg-blue-50 border-blue-200">
                            <div className="space-y-3">
                              <div className="flex items-center gap-2">
                                <input
                                  type="radio"
                                  id="featured-monthly"
                                  name="featured-plan"
                                  className="h-4 w-4 text-blue-600 border-blue-300"
                                />
                                <Label htmlFor="featured-monthly" className="font-medium">30 Days Featured</Label>
                              </div>
                              <div className="pl-6">
                                <div className="text-2xl font-bold text-blue-600">₹99</div>
                                <p className="text-sm text-blue-700">Best value for long-term visibility</p>
                              </div>
                            </div>
                          </div>

                          {/* Weekly Plan */}
                          <div className="relative border rounded-lg p-4 bg-blue-50 border-blue-200">
                            <div className="space-y-3">
                              <div className="flex items-center gap-2">
                                <input
                                  type="radio"
                                  id="featured-weekly"
                                  name="featured-plan"
                                  className="h-4 w-4 text-blue-600 border-blue-300"
                                />
                                <Label htmlFor="featured-weekly" className="font-medium">7 Days Featured</Label>
                              </div>
                              <div className="pl-6">
                                <div className="text-2xl font-bold text-blue-600">₹49</div>
                                <p className="text-sm text-blue-700">Perfect for a quick boost</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <Button className="w-full">Create Teacher Account</Button>
                  </form>
                </TabsContent>
              </Tabs>

              <div className="mt-6 text-center text-sm text-gray-500">
                Already have an account?{" "}
                <Link href="/login" className="text-blue-500 hover:text-blue-600">
                  Sign in
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
} 