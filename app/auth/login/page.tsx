"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Mail } from "lucide-react";
import { signInWithGoogle, signInWithEmail } from "@/lib/auth";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/contexts/auth";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [nonExistentEmail, setNonExistentEmail] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const { user, profile, isNewUser, isLoading: authLoading } = useAuth();
  const supabase = createClientComponentClient();

  // Logging for debugging
  console.log("Login page state:", {
    user: !!user,
    userId: user?.id,
    profile: !!profile,
    isNewUser,
    authLoading
  });

  // Use useEffect for redirects to avoid updating during render
  useEffect(() => {
    if (!authLoading) {
      // If user is already authenticated and has a profile, redirect to dashboard
      if (user && profile) {
        console.log("User has profile, redirecting to dashboard");
        router.replace("/dashboard");
      }
      // If user is authenticated but doesn't have a profile, redirect to onboarding
      else if (user && !profile) {
        console.log("User has no profile, redirecting to onboarding");
        router.replace("/onboarding");
      }
    }
  }, [user, profile, authLoading, router]);

  // Don't redirect while still loading
  if (authLoading) {
    console.log("Auth still loading, showing loading state");
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-2 text-sm text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If we're going to be redirected, show loading
  if ((user && profile) || (user && !profile)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-2 text-sm text-gray-600">Redirecting...</p>
        </div>
      </div>
    );
  }

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setNonExistentEmail(false);
    
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please enter both email and password",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsLoading(true);
      const { data, error } = await signInWithEmail(email, password);
      
      if (error) {
        // Check if this is a non-existent email error
        if (error.isNonExistentEmail) {
          setNonExistentEmail(true);
        } else {
          toast({
            title: "Error",
            description: error.message,
            variant: "destructive",
          });
        }
      } else {
        // Successful login
        toast({
          title: "Success",
          description: "You have been logged in successfully",
        });

        // Check if user has a profile
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", data.user?.id)
          .single();

        // Redirect based on profile existence
        router.refresh();
        if (!profile) {
          router.push("/onboarding");
        } else {
          router.push("/dashboard");
        }
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      console.log("Initiating Google sign-in");
      const { error } = await signInWithGoogle();
      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
        setIsLoading(false);
      }
      // Don't set isLoading to false here as we're being redirected
    } catch (err) {
      console.error("Error during Google sign-in:", err);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  // Don't redirect here - let the callback handle it
  if (user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Welcome Back</CardTitle>
              <CardDescription>
                Sign in to your TeachersGallery account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleEmailSignIn} className="grid gap-6">
                {nonExistentEmail && (
                  <Alert variant="destructive" className="bg-amber-50 border-amber-200 text-amber-800">
                    <AlertDescription>
                      Email does not exist. Would you like to{" "}
                      <Link href="/register" className="font-medium underline">
                        sign up
                      </Link>
                      ?
                    </AlertDescription>
                  </Alert>
                )}
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
                <Button 
                  className="w-full" 
                  size="lg" 
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Signing in...</span>
                    </div>
                  ) : (
                    "Sign In"
                  )}
                </Button>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-gray-500">
                      Or continue with
                    </span>
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="w-full"
                  size="lg"
                  onClick={handleGoogleSignIn}
                  disabled={isLoading}
                  type="button"
                >
                  <div className="flex items-center justify-center gap-2">
                    {isLoading ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-600"></div>
                    ) : (
                      <Image
                        src="/google.svg"
                        alt="Google"
                        width={20}
                        height={20}
                        className="w-5 h-auto"
                      />
                    )}
                    <span>
                      {isLoading ? "Signing in..." : "Sign in with Google"}
                    </span>
                  </div>
                </Button>
                <p className="text-center text-sm text-gray-600">
                  Don't have an account?{" "}
                  <Link
                    href="/register"
                    className="text-blue-500 hover:text-blue-600"
                  >
                    Sign up
                  </Link>
                </p>
              </form>
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
                Create a teacher account to list your services and connect with
                students.
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
  );
}
