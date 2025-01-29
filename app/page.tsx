"use client"

import { Search } from "lucide-react"
import TeacherCard from "@/components/teacher-card"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import Image from "next/image"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"

export default function Home() {
  const [feeRange, setFeeRange] = useState([500, 5000])

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-[#111111]">
        <div className="container mx-auto px-4">
          <div className="flex h-20 items-center justify-between">
            <div className="flex items-center gap-8">
              <div className="h-12">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-U6cB7m9VfcWDYksnC7skDsLAWpHG4O.png"
                  alt="TeachersGallery.com"
                  width={200}
                  height={48}
                  className="h-full w-auto"
                />
              </div>
              <nav className="hidden md:flex items-center gap-8">
                <a href="#" className="text-sm text-white border-b-2 border-white pb-6">
                  Find Teachers
                </a>
                <a href="#" className="text-sm text-white/70 hover:text-white">
                  Messages
                </a>
                <a href="#" className="text-sm text-white/70 hover:text-white">
                  Community
                </a>
                <a href="#" className="text-sm text-white/70 hover:text-white">
                  FAQ
                </a>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-white/70">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span className="text-sm">Mumbai, India</span>
              </div>
              <button className="p-2 text-white/70 hover:text-white">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                  />
                </svg>
              </button>
              <button className="p-2 text-white/70 hover:text-white">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
              </button>
              <div className="h-8 w-8 rounded-full bg-gray-300"></div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center gap-4">
              <div className="w-[200px]">
                <div className="flex items-center gap-2 bg-[#1A1A1A] rounded-lg px-4 py-2.5">
                  <Search className="h-5 w-5 text-gray-400" />
                  <Select>
                    <SelectTrigger className="border-0 bg-transparent p-0 text-white shadow-none focus:ring-0">
                      <SelectValue placeholder="Subject" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="math">Mathematics</SelectItem>
                      <SelectItem value="science">Science</SelectItem>
                      <SelectItem value="english">English</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="w-[200px]">
                <Select>
                  <SelectTrigger className="border-0 bg-[#1A1A1A] text-white">
                    <SelectValue placeholder="Location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mumbai">Mumbai</SelectItem>
                    <SelectItem value="delhi">Delhi</SelectItem>
                    <SelectItem value="bangalore">Bangalore</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="w-[200px]">
                <Select>
                  <SelectTrigger className="border-0 bg-[#1A1A1A] text-white">
                    <SelectValue placeholder="Experience" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-5">1-5 years</SelectItem>
                    <SelectItem value="5-10">5-10 years</SelectItem>
                    <SelectItem value="10+">10+ years</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="w-[200px]">
                <Select>
                  <SelectTrigger className="border-0 bg-[#1A1A1A] text-white">
                    <SelectValue placeholder="Class Range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="primary">Primary (1-5)</SelectItem>
                    <SelectItem value="middle">Middle (6-8)</SelectItem>
                    <SelectItem value="high">High (9-12)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-8 md:grid-cols-[300px_1fr]">
          <aside>
            <div className="rounded-2xl bg-[#111111] p-8 text-white mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-[url('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-wSESIDUnipMUNmerGXRCf8iK5JmuXz.png')] opacity-10 rounded-lg"></div>
                <div className="relative">
                  <h2 className="text-2xl font-bold mb-4">Get your best teacher with TeachersGallery</h2>
                  <button className="bg-[#4B9CFF] hover:bg-[#3D7FCC] text-white px-6 py-2 rounded-lg text-sm transition-colors">
                    Learn more
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-medium">Fee Range (₹/hr)</h3>
                <div className="px-2">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span>₹{feeRange[0]}</span>
                    <span>₹{feeRange[1]}</span>
                  </div>
                  <Slider
                    min={500}
                    max={5000}
                    step={100}
                    value={feeRange}
                    onValueChange={setFeeRange}
                    className="w-full"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium">Teaching Mode</h3>
                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded border-gray-300" defaultChecked />
                    <span>Online</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded border-gray-300" defaultChecked />
                    <span>Offline</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded border-gray-300" />
                    <span>Hybrid</span>
                  </label>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium">Availability</h3>
                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded border-gray-300" defaultChecked />
                    <span>Weekdays</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded border-gray-300" defaultChecked />
                    <span>Weekends</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded border-gray-300" />
                    <span>Evening</span>
                  </label>
                </div>
              </div>
            </div>
          </aside>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-semibold">Recommended Teachers</h2>
                <span className="rounded-full bg-gray-100 px-3 py-0.5 text-sm">386</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Sort by:</span>
                <Select defaultValue="latest">
                  <SelectTrigger className="w-[180px] border-gray-200">
                    <SelectValue placeholder="Last updated" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="latest">Last updated</SelectItem>
                    <SelectItem value="experience">Experience</SelectItem>
                    <SelectItem value="rating">Rating</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <TeacherCard
                name="Priya Sharma"
                subject="Mathematics"
                location="Mumbai, Maharashtra"
                fee="₹800/hr"
                tags={["Online", "10+ years", "High School", "IIT-JEE"]}
                date="20 May, 2023"
                color="bg-blue-50"
              />
              <TeacherCard
                name="Rajesh Kumar"
                subject="Physics"
                location="Delhi, NCR"
                fee="₹600/hr"
                tags={["Offline", "8 years", "CBSE", "NEET"]}
                date="4 Feb, 2023"
                color="bg-green-50"
              />
              <TeacherCard
                name="Anjali Desai"
                subject="English Literature"
                location="Bangalore, Karnataka"
                fee="₹500/hr"
                tags={["Hybrid", "5 years", "ICSE", "Primary"]}
                date="29 Jan, 2023"
                color="bg-purple-50"
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

