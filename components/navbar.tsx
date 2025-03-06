"use client";

import Image from "next/image";
import Link from "next/link";
import {
  MapPin,
  LogOut,
  User,
  Menu,
  X,
  Search,
  Home,
  MessageSquare,
  HelpCircle,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  AnimatedContainer,
  fadeIn,
  slideDown,
  slideRight,
  slideLeft,
} from "@/components/ui/animations";
import { useDebounce } from "@/hooks/useDebounce";
import { useAuth } from "@/lib/contexts/auth";
import { signOut } from "@/lib/auth";

// Mock locations data
const locations = [
  {
    city: "Mumbai",
    state: "Maharashtra",
    areas: ["Andheri", "Bandra", "Juhu", "Powai", "Worli"],
  },
  {
    city: "Delhi",
    state: "Delhi NCR",
    areas: ["South Delhi", "North Delhi", "Noida", "Gurgaon", "Faridabad"],
  },
  {
    city: "Bangalore",
    state: "Karnataka",
    areas: [
      "Koramangala",
      "Indiranagar",
      "Whitefield",
      "HSR Layout",
      "JP Nagar",
    ],
  },
  {
    city: "Kolkata",
    state: "West Bengal",
    areas: ["Salt Lake", "Park Street", "New Town", "Ballygunge", "Behala"],
  },
  {
    city: "Chennai",
    state: "Tamil Nadu",
    areas: ["T Nagar", "Anna Nagar", "Adyar", "Velachery", "Mylapore"],
  },
];

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
];

// Add this helper function to check if a profile is temporary
const isTemporaryProfile = (
  user: { email?: string } | null,
  profile: { phone?: string; full_name?: string } | null
): boolean => {
  if (!profile) return false;
  return (
    !profile.phone &&
    profile.full_name === (user?.email?.split("@")[0] || "New User")
  );
};

export default function Navbar() {
  const { user, profile, refreshProfile } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery);
  const [selectedLocation, setSelectedLocation] = useState({
    city: "Mumbai",
    state: "Maharashtra",
  });
  const router = useRouter();
  const pathname = usePathname();

  // Create refs for dropdown containers
  const userMenuRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const searchModalRef = useRef<HTMLDivElement>(null);

  // Check if the current profile is temporary
  const profileIsTemporary = isTemporaryProfile(user, profile);

  // Handle click outside to close dropdowns
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      // Close user menu if click is outside
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setShowUserMenu(false);
      }

      // Close notifications if click is outside
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target as Node)
      ) {
        setShowNotifications(false);
      }

      // For mobile menu and search modal, we need to check if the click is outside
      // but we don't want to close them when clicking on their toggle buttons
      const target = event.target as HTMLElement;

      // Check if the click is on the mobile menu toggle button
      const isMobileMenuToggleClick = target.closest(
        "[data-mobile-menu-toggle]"
      );
      if (
        !isMobileMenuToggleClick &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(target)
      ) {
        setShowMobileMenu(false);
      }

      // Check if the click is on the search modal toggle button
      const isSearchModalToggleClick = target.closest(
        "[data-search-modal-toggle]"
      );
      if (
        !isSearchModalToggleClick &&
        searchModalRef.current &&
        !searchModalRef.current.contains(target)
      ) {
        setShowSearchModal(false);
      }
    }

    // Add event listener
    document.addEventListener("mousedown", handleClickOutside);

    // Clean up
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLocationSelect = (city: string, state: string) => {
    setSelectedLocation({ city, state });
    setShowLocationPicker(false);
    // Add logic to update location in your app state/context
  };

  const handleLogout = async () => {
    try {
      const { error } = await signOut();
      if (error) {
        console.error("Error signing out:", error);
        return;
      }
      // Clear local state
      setShowUserMenu(false);
      // Force a hard refresh to clear all client state
      window.location.href = "/auth/login";
    } catch (err) {
      console.error("Error during logout:", err);
    }
  };

  const handleNavigation = (path: string) => {
    setShowUserMenu(false); // Close menu first
    router.push(path);
  };

  // Add a function to handle profile refresh
  const handleRefreshProfile = async () => {
    try {
      await refreshProfile();
      // If we're on the dashboard, refresh the page to show updated data
      if (pathname === "/dashboard") {
        router.refresh();
      }
    } catch (error) {
      console.error("Error refreshing profile:", error);
    }
  };

  return (
    <>
      <header className="bg-[#111111] relative">
        <div className="container mx-auto px-4">
          <div className="flex h-20 items-center justify-between">
            <div className="flex items-center gap-8">
              {/* Mobile Menu Button */}
              <button
                className="lg:hidden text-white/70 hover:text-white"
                onClick={() => setShowMobileMenu(true)}
                data-mobile-menu-toggle
              >
                <Menu className="h-6 w-6" />
              </button>

              <Link href="/" className="flex items-center h-14">
                <Image
                  src="/logo.png"
                  alt="TeachersGallery"
                  width={280}
                  height={56}
                  className="h-14 w-auto"
                />
              </Link>
              <nav className="hidden lg:flex items-center gap-8">
                <Link
                  href="/"
                  className={`text-sm px-4 py-2 rounded-full flex items-center gap-2 ${
                    pathname === "/"
                      ? "text-white bg-white/10"
                      : "text-white/70 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <Home className="h-4 w-4" />
                  <span>Find Teachers</span>
                </Link>
                <Link
                  href="/messages"
                  className={`text-sm px-4 py-2 rounded-full flex items-center gap-2 ${
                    pathname === "/messages"
                      ? "text-white bg-white/10"
                      : "text-white/70 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <MessageSquare className="h-4 w-4" />
                  <span>Messages</span>
                </Link>
                <Link
                  href="/faq"
                  className={`text-sm px-4 py-2 rounded-full flex items-center gap-2 ${
                    pathname === "/faq"
                      ? "text-white bg-white/10"
                      : "text-white/70 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <HelpCircle className="h-4 w-4" />
                  <span>FAQ</span>
                </Link>
              </nav>
            </div>

            {/* Desktop Search Bar */}
            <div className="hidden lg:block flex-1 max-w-xl mx-8">
              <div className="relative">
                <Input
                  placeholder="Search teachers by name, subject, or location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 bg-white/10 border-white/10 text-white placeholder:text-white/50 focus:bg-white/20"
                />
                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" />
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Mobile Search Button */}
              <button
                className="lg:hidden text-white/70 hover:text-white"
                onClick={() => setShowSearchModal(true)}
                data-search-modal-toggle
              >
                <Search className="h-5 w-5" />
              </button>

              {/* Location Picker (Both Mobile and Desktop) */}
              <Popover
                open={showLocationPicker}
                onOpenChange={setShowLocationPicker}
              >
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center gap-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full px-4"
                  >
                    <MapPin className="h-4 w-4" />
                    <span className="hidden md:inline text-sm">
                      {selectedLocation.city}, {selectedLocation.state}
                    </span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[300px] p-0" align="end">
                  <Command>
                    <div className="px-3 py-2 border-b">
                      <div className="text-sm text-gray-500">
                        Current location
                      </div>
                      <div className="font-medium">
                        {selectedLocation.city}, {selectedLocation.state}
                      </div>
                    </div>
                    <CommandInput placeholder="Search location..." />
                    <CommandEmpty>No location found.</CommandEmpty>
                    <CommandGroup heading="Popular Cities">
                      {locations.map((location) => (
                        <CommandItem
                          key={location.city}
                          onSelect={() =>
                            handleLocationSelect(location.city, location.state)
                          }
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <MapPin className="h-4 w-4" />
                          <div>
                            <div className="font-medium">{location.city}</div>
                            <div className="text-sm text-gray-500">
                              {location.state}
                            </div>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>

              <div className="relative" ref={notificationsRef}>
                <button
                  className="p-2 text-white/70 hover:text-white"
                  onClick={() => setShowNotifications(!showNotifications)}
                >
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
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
                      <h3 className="font-semibold text-gray-900">
                        Notifications
                      </h3>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {mockNotifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`px-4 py-3 hover:bg-gray-50 ${
                            !notification.read ? "bg-blue-50" : ""
                          }`}
                        >
                          <p className="text-sm text-gray-800">
                            {notification.content}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {notification.time}
                          </p>
                        </div>
                      ))}
                    </div>
                    <div className="px-4 py-2 border-t border-gray-100">
                      <Link
                        href="/notifications"
                        className="text-sm text-blue-500 hover:text-blue-600"
                      >
                        View all notifications
                      </Link>
                    </div>
                  </div>
                )}
              </div>
              <div className="relative" ref={userMenuRef}>
                <button
                  className="h-8 w-8 overflow-hidden rounded-full"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                >
                  {user ? (
                    <img
                      src={profile?.avatar_url || "/avatar.jpg"}
                      alt="User avatar"
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        // Handle image loading errors
                        console.error("Avatar image failed to load");
                        e.currentTarget.src = "/avatar.jpg";
                      }}
                    />
                  ) : (
                    <Link
                      href="/auth/login"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Sign In
                    </Link>
                  )}
                </button>

                {showUserMenu && user && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                    <div className="px-4 py-2 text-sm text-gray-700 border-b">
                      <p className="font-medium">{profile?.full_name}</p>
                      <p className="text-gray-500">{user.email}</p>
                      {profileIsTemporary && (
                        <p className="text-amber-600 text-xs mt-1">
                          Profile incomplete
                        </p>
                      )}
                    </div>

                    {profileIsTemporary ? (
                      <>
                        <button
                          onClick={() => handleNavigation("/account/settings")}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                        >
                          <User className="h-4 w-4" />
                          Complete Profile
                        </button>
                        <button
                          onClick={handleRefreshProfile}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-amber-600 hover:bg-gray-100 w-full text-left"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-4 w-4"
                          >
                            <path d="M21 2v6h-6"></path>
                            <path d="M3 12a9 9 0 0 1 15-6.7L21 8"></path>
                            <path d="M3 22v-6h6"></path>
                            <path d="M21 12a9 9 0 0 1-15 6.7L3 16"></path>
                          </svg>
                          Refresh Profile
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleNavigation("/dashboard")}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                        >
                          <User className="h-4 w-4" />
                          Profile
                        </button>
                      </>
                    )}

                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
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

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="fixed inset-0 bg-black/50 z-50 lg:hidden">
            <AnimatedContainer
              animation={slideLeft}
              className="fixed inset-y-0 left-0 w-full max-w-[280px] bg-[#111111] shadow-lg"
              ref={mobileMenuRef}
            >
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between p-4 border-b border-white/10">
                  <h2 className="text-lg font-semibold text-white">Menu</h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white/70 hover:text-white hover:bg-white/10"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                <div className="flex-1 overflow-y-auto py-4">
                  <nav className="space-y-2 px-4">
                    <Link
                      href="/"
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm ${
                        pathname === "/"
                          ? "bg-white/10 text-white"
                          : "text-white/70 hover:bg-white/10 hover:text-white"
                      }`}
                      onClick={() => setShowMobileMenu(false)}
                    >
                      <Home className="h-4 w-4" />
                      <span>Find Teachers</span>
                    </Link>
                    <Link
                      href="/messages"
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm ${
                        pathname === "/messages"
                          ? "bg-white/10 text-white"
                          : "text-white/70 hover:bg-white/10 hover:text-white"
                      }`}
                      onClick={() => setShowMobileMenu(false)}
                    >
                      <MessageSquare className="h-4 w-4" />
                      <span>Messages</span>
                    </Link>
                    <Link
                      href="/faq"
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm ${
                        pathname === "/faq"
                          ? "bg-white/10 text-white"
                          : "text-white/70 hover:bg-white/10 hover:text-white"
                      }`}
                      onClick={() => setShowMobileMenu(false)}
                    >
                      <HelpCircle className="h-4 w-4" />
                      <span>FAQ</span>
                    </Link>
                  </nav>
                </div>
              </div>
            </AnimatedContainer>
          </div>
        )}
      </header>

      {/* Search Modal for Mobile/Tablet */}
      {showSearchModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-start justify-center pt-20 px-4 lg:hidden">
          <AnimatedContainer
            animation={slideDown}
            className="w-full max-w-lg"
            ref={searchModalRef}
          >
            <div className="relative">
              <Input
                placeholder="Search teachers by name, subject, or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-10 h-12 text-lg bg-white shadow-lg"
                autoFocus
              />
              <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <button
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                onClick={() => setShowSearchModal(false)}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </AnimatedContainer>
        </div>
      )}
    </>
  );
}
