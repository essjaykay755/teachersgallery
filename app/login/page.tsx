"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Mail } from "lucide-react"
import Navbar from "@/components/navbar"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Welcome Back</CardTitle>
              <CardDescription>Sign in to your TeachersGallery account</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Password</Label>
                      <Link 
                        href="/forgot-password" 
                        className="text-sm text-blue-500 hover:text-blue-600"
                      >
                        Forgot password?
                      </Link>
                    </div>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>
                <Button className="w-full" size="lg">
                  Sign In
                </Button>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-gray-500">Or continue with</span>
                  </div>
                </div>
                <Button variant="outline" className="w-full" size="lg">
                  <div className="flex items-center justify-center gap-2">
                    <Image
                      src="/google.svg"
                      alt="Google"
                      width={20}
                      height={20}
                      className="h-5 w-5"
                    />
                    <span>Sign in with Google</span>
                  </div>
                </Button>
                <p className="text-center text-sm text-gray-600">
                  Don't have an account?{" "}
                  <Link href="/register" className="text-blue-500 hover:text-blue-600">
                    Sign up
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Additional Info */}
          <div className="mt-6 space-y-4">
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="font-medium mb-2">Why Sign In?</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                  <span>Message teachers directly</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                  <span>Save your favorite teachers</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                  <span>Schedule and manage classes</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                  <span>Access learning resources</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="font-medium mb-2">Are you a teacher?</h3>
              <p className="text-sm text-gray-600 mb-4">
                Create a teacher account to list your services and connect with students.
              </p>
              <Link href="/register?type=teacher">
                <Button variant="outline" className="w-full">
                  Register as Teacher
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
} 