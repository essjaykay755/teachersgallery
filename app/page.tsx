"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import Image from "next/image"
import Link from "next/link"
import TeacherCard from "@/components/teacher-card"
import Navbar from "@/components/navbar"

export default function Home() {
  const [feeRange, setFeeRange] = useState([500, 5000])
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Filters Section */}
      <div className="bg-[#111111] border-t border-gray-800">
        <div className="container mx-auto px-4 py-4">
          {/* Mobile filters - 2 per row */}
          <div className="grid grid-cols-2 gap-3 md:hidden">
            <div className="col-span-2">
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="w-full flex items-center justify-center gap-2 bg-[#1A1A1A] text-white px-4 py-2 rounded-md"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                  />
                </svg>
                Filters
              </button>
            </div>
            <div className="w-full">
              <Select>
                <SelectTrigger className="border-0 bg-[#1A1A1A] text-white w-full">
                  <SelectValue placeholder="Subject" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="math">Mathematics</SelectItem>
                  <SelectItem value="science">Science</SelectItem>
                  <SelectItem value="english">English</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-full">
              <Select>
                <SelectTrigger className="border-0 bg-[#1A1A1A] text-white w-full">
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mumbai">Mumbai</SelectItem>
                  <SelectItem value="delhi">Delhi</SelectItem>
                  <SelectItem value="bangalore">Bangalore</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-full">
              <Select>
                <SelectTrigger className="border-0 bg-[#1A1A1A] text-white w-full">
                  <SelectValue placeholder="Experience" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1-5">1-5 years</SelectItem>
                  <SelectItem value="5-10">5-10 years</SelectItem>
                  <SelectItem value="10+">10+ years</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-full">
              <Select>
                <SelectTrigger className="border-0 bg-[#1A1A1A] text-white w-full">
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

          {/* Desktop filters */}
          <div className="hidden md:flex items-center gap-4">
            <div className="w-[200px]">
              <Select>
                <SelectTrigger className="border-0 bg-[#1A1A1A] text-white">
                  <SelectValue placeholder="Subject" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="math">Mathematics</SelectItem>
                  <SelectItem value="science">Science</SelectItem>
                  <SelectItem value="english">English</SelectItem>
                </SelectContent>
              </Select>
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

      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-8 md:grid-cols-[300px_1fr]">
          {/* Mobile filter sidebar */}
          <aside className={`
            fixed inset-y-0 left-0 z-50 w-full bg-white transform transition-transform duration-300 ease-in-out md:hidden
            ${isFilterOpen ? 'translate-x-0' : '-translate-x-full'}
          `}>
            <div className="h-full overflow-y-auto p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">Filters</h2>
                <button 
                  onClick={() => setIsFilterOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
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
            </div>
          </aside>

          {/* Desktop sidebar */}
          <aside className="hidden md:block">
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
                <h2 className="text-xl font-semibold">All Teachers</h2>
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
                id="priya-sharma"
                name="Priya Sharma"
                subject="Mathematics"
                location="Mumbai, Maharashtra"
                fee="₹800/hr"
                tags={["Online", "10+ years", "High School", "IIT-JEE"]}
                date="20 May, 2023"
                color="bg-blue-50"
                featured={true}
                avatarIndex={1}
              />
              <TeacherCard
                id="rajesh-kumar"
                name="Rajesh Kumar"
                subject="Physics"
                location="Delhi, NCR"
                fee="₹600/hr"
                tags={["Offline", "8 years", "CBSE", "NEET"]}
                date="4 Feb, 2023"
                color="bg-green-50"
                featured={true}
                avatarIndex={2}
              />
              <TeacherCard
                name="Anjali Desai"
                subject="English Literature"
                location="Bangalore, Karnataka"
                fee="₹500/hr"
                tags={["Hybrid", "5 years", "ICSE", "Primary"]}
                date="29 Jan, 2023"
                color="bg-purple-50"
                avatarIndex={3}
              />
              <TeacherCard
                name="Debanjan Chakraborty"
                subject="Chemistry"
                location="Salt Lake, Kolkata"
                fee="₹650/hr"
                tags={["Offline", "12 years", "WBCHSE", "NEET"]}
                date="15 Mar, 2023"
                color="bg-orange-50"
                avatarIndex={4}
              />
              <TeacherCard
                name="Srabanti Mukherjee"
                subject="Bengali Literature"
                location="Howrah, West Bengal"
                fee="₹450/hr"
                tags={["Hybrid", "7 years", "WBBSE", "HS"]}
                date="8 Apr, 2023"
                color="bg-pink-50"
                avatarIndex={5}
              />
              <TeacherCard
                name="Soumitra Banerjee"
                subject="Mathematics"
                location="Barasat, West Bengal"
                fee="₹550/hr"
                tags={["Online", "15 years", "WBCHSE", "JEE"]}
                date="12 Mar, 2023"
                color="bg-indigo-50"
                avatarIndex={6}
              />
              <TeacherCard
                name="Tanushree Das"
                subject="Physics"
                location="Dum Dum, Kolkata"
                fee="₹600/hr"
                tags={["Hybrid", "9 years", "WBCHSE", "NEET"]}
                date="25 Feb, 2023"
                color="bg-rose-50"
                avatarIndex={7}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

