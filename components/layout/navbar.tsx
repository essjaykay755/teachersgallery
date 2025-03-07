"use client";

import { Fragment, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/contexts/auth";
import { Menu, Transition } from "@headlessui/react";
import { signOut } from "@/lib/auth";
import { Menu as MenuIcon, X, User } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback, AvatarWithTypeIndicator } from "@/components/ui/avatar";

export default function Navbar() {
  const { user, profile } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Debug profile data
  useEffect(() => {
    console.log("Navbar: Profile data:", {
      hasProfile: !!profile,
      userType: profile?.user_type,
      fullProfile: profile
    });
  }, [profile]);

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true);
      await signOut();
      router.push("/");
    } catch (error) {
      console.error("Error signing out:", error);
    } finally {
      setIsSigningOut(false);
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-xl font-bold text-indigo-600">
                TeachersGallery
              </Link>
            </div>
          </div>

          <div className="flex items-center">
            {user ? (
              <Menu as="div" className="ml-3 relative">
                <Menu.Button className="relative flex rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 cursor-pointer">
                  <AvatarWithTypeIndicator
                    size="sm"
                    src={profile?.avatar_url}
                    alt={profile?.full_name || "User avatar"}
                    userType={profile?.user_type || "unknown"}
                    fallback={<User className="h-4 w-4" />}
                  />
                </Menu.Button>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-200"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 z-10 mt-2 w-64 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <Menu.Item>
                      {({ active }) => (
                        <div className="px-4 py-2 text-sm border-b flex items-center gap-3">
                          <div className="flex-shrink-0">
                            <AvatarWithTypeIndicator
                              size="sm"
                              className="!min-w-8 !min-h-8"
                              src={profile?.avatar_url}
                              alt={profile?.full_name || "User avatar"}
                              userType={profile?.user_type || "unknown"}
                              fallback={<User className="h-4 w-4" />}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-700">{profile?.full_name || "User"}</p>
                            <div className="overflow-hidden relative email-container group">
                              <p 
                                className="text-gray-500 truncate group-hover:animate-marquee whitespace-nowrap"
                                style={{
                                  maskImage: 'linear-gradient(to right, black 85%, transparent 100%)',
                                  WebkitMaskImage: 'linear-gradient(to right, black 85%, transparent 100%)'
                                }}
                              >
                                {user.email}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          href="/dashboard"
                          className={`${
                            active ? "bg-gray-100" : ""
                          } block px-4 py-2 text-sm text-gray-700`}
                        >
                          Dashboard
                        </Link>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          href="/account/settings"
                          className={`${
                            active ? "bg-gray-100" : ""
                          } block px-4 py-2 text-sm text-gray-700`}
                        >
                          Settings
                        </Link>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={handleSignOut}
                          disabled={isSigningOut}
                          className={`${
                            active ? "bg-gray-100" : ""
                          } block w-full text-left px-4 py-2 text-sm text-gray-700 disabled:opacity-50`}
                        >
                          {isSigningOut ? "Signing out..." : "Sign out"}
                        </button>
                      )}
                    </Menu.Item>
                  </Menu.Items>
                </Transition>
              </Menu>
            ) : (
              <div className="flex items-center gap-4">
                <Link
                  href="/auth/login"
                  className="text-gray-700 hover:text-gray-900"
                >
                  Sign in
                </Link>
                <Link
                  href="/auth/register"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
