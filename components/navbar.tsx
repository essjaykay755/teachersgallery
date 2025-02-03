"use client"

import Image from "next/image"
import Link from "next/link"
import { MapPin, LogOut, User } from "lucide-react"
import { useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

// Mock locations data
const locations = [
  {
    city: "Mumbai",
    state: "Maharashtra",
    areas: ["Andheri", "Bandra", "Juhu", "Powai", "Worli"]
  },
  {
    city: "Delhi",
    state: "Delhi NCR",
    areas: ["South Delhi", "North Delhi", "Noida", "Gurgaon", "Faridabad"]
  },
  {
    city: "Bangalore",
    state: "Karnataka",
    areas: ["Koramangala", "Indiranagar", "Whitefield", "HSR Layout", "JP Nagar"]
  },
  {
    city: "Kolkata",
    state: "West Bengal",
    areas: ["Salt Lake", "Park Street", "New Town", "Ballygunge", "Behala"]
  },
  {
    city: "Chennai",
    state: "Tamil Nadu",
    areas: ["T Nagar", "Anna Nagar", "Adyar", "Velachery", "Mylapore"]
  }
]

// Mock notifications data
const mockNotifications = [
  {
    id: 1,
    type: "message",
    content: "New message from Priya Sharma",
    time: "2 minutes ago",
    read: false,
  },
  {
    id: 2,
    type: "booking",
    content: "Your class with Rajesh Kumar is confirmed",
    time: "1 hour ago",
    read: false,
  },
  {
    id: 3,
    type: "system",
    content: "Welcome to TeachersGallery!",
    time: "2 days ago",
    read: true,
  },
]

export default function Navbar() {
  const [showNotifications, setShowNotifications] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showLocationPicker, setShowLocationPicker] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState({
    city: "Mumbai",
    state: "Maharashtra"
  })
  const router = useRouter()
  const pathname = usePathname()

  const handleLocationSelect = (city: string, state: string) => {
    setSelectedLocation({ city, state })
    setShowLocationPicker(false)
    // Add logic to update location in your app state/context
  }

  const handleLogout = () => {
    // Add logout logic here
    console.log('Logging out...')
  }

  return (
    <header className="bg-[#111111] relative">
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="h-14">
              <Image
                src="/logo.png"
                alt="TeachersGallery.com"
                width={280}
                height={56}
                className="h-full w-auto"
                priority
              />
            </Link>
            <nav className="hidden md:flex items-center gap-8">
              <Link 
                href="/" 
                className={`text-sm px-4 py-2 rounded-full ${
                  pathname === '/' 
                    ? 'text-white bg-white/10' 
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                Find Teachers
              </Link>
              <Link 
                href="/messages" 
                className={`text-sm px-4 py-2 rounded-full ${
                  pathname === '/messages' 
                    ? 'text-white bg-white/10' 
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                Messages
              </Link>
              <Link 
                href="/faq" 
                className={`text-sm px-4 py-2 rounded-full ${
                  pathname === '/faq' 
                    ? 'text-white bg-white/10' 
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                FAQ
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <Popover open={showLocationPicker} onOpenChange={setShowLocationPicker}>
              <PopoverTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="flex items-center gap-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full px-4"
                >
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm">{selectedLocation.city}, {selectedLocation.state}</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[300px] p-0" align="end">
                <Command>
                  <CommandInput placeholder="Search location..." />
                  <CommandEmpty>No location found.</CommandEmpty>
                  <CommandGroup heading="Popular Cities">
                    {locations.map((location) => (
                      <CommandItem
                        key={location.city}
                        onSelect={() => handleLocationSelect(location.city, location.state)}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <MapPin className="h-4 w-4" />
                        <div>
                          <div className="font-medium">{location.city}</div>
                          <div className="text-sm text-gray-500">{location.state}</div>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
            <div className="relative">
              <button 
                className="p-2 text-white/70 hover:text-white"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <h3 className="font-semibold text-gray-900">Notifications</h3>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {mockNotifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`px-4 py-3 hover:bg-gray-50 ${
                          !notification.read ? 'bg-blue-50' : ''
                        }`}
                      >
                        <p className="text-sm text-gray-800">{notification.content}</p>
                        <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                      </div>
                    ))}
                  </div>
                  <div className="px-4 py-2 border-t border-gray-100">
                    <Link href="/notifications" className="text-sm text-blue-500 hover:text-blue-600">
                      View all notifications
                    </Link>
                  </div>
                </div>
              )}
            </div>
            <div className="relative">
              <button 
                className="h-8 w-8 overflow-hidden rounded-full"
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                <Image
                  src="/avatar.jpg"
                  alt="User avatar"
                  width={32}
                  height={32}
                  className="h-full w-full object-cover"
                  priority
                />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                  <Link 
                    href="/account" 
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <User className="h-4 w-4" />
                    Account
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
} 