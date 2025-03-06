"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ReactConfetti from "react-confetti";
import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Home, LayoutDashboard, CheckCircle2 } from "lucide-react";

type Props = {
  userType: string;
};

export default function CompletionStep({ userType }: Props) {
  const router = useRouter();
  const [confettiActive, setConfettiActive] = useState(true);
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 0,
    height: typeof window !== "undefined" ? window.innerHeight : 0
  });

  // Log when the completion step is rendered
  useEffect(() => {
    console.log("CompletionStep rendered with userType:", userType);
  }, [userType]);

  // Update window size on resize
  const handleResize = useCallback(() => {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight
    });
  }, []);

  useEffect(() => {
    // Initialize window size
    if (typeof window !== "undefined") {
      handleResize();
      window.addEventListener("resize", handleResize);
    }

    // Auto-hide confetti after 5 seconds
    const timer = setTimeout(() => {
      setConfettiActive(false);
    }, 5000);

    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timer);
    };
  }, [handleResize]);

  // Get greeting message based on user type
  const getMessage = () => {
    const message = (() => {
      switch (userType) {
        case "teacher":
          return "Your teacher profile has been created! You can now start sharing your expertise with students.";
        case "student":
          return "Your student profile has been created! You can now start exploring teachers and learning opportunities.";
        case "parent":
          return "Your parent profile has been created! You can now start finding the perfect teachers for your children.";
        default:
          return "Your profile has been created! You're all set to start using TeachersGallery.";
      }
    })();
    
    console.log("CompletionStep message selected:", message);
    return message;
  };

  return (
    <>
      {confettiActive && (
        <ReactConfetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={500}
          gravity={0.15}
        />
      )}

      <CardHeader className="text-center">
        <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
          <CheckCircle2 className="h-6 w-6 text-primary" />
        </div>
        <CardTitle>Congratulations!</CardTitle>
        <CardDescription>
          {getMessage()}
        </CardDescription>
      </CardHeader>

      <CardContent className="text-center space-y-6">
        <p className="text-muted-foreground">
          You've successfully completed the onboarding process. Your new profile is ready!
        </p>

        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-4">
            <div className="flex flex-col items-center gap-2">
              <Home className="h-8 w-8 text-muted-foreground" />
              <h3 className="text-sm font-medium">Visit Homepage</h3>
              <p className="text-xs text-muted-foreground">Explore the TeachersGallery platform</p>
            </div>
          </div>
          
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-4">
            <div className="flex flex-col items-center gap-2">
              <LayoutDashboard className="h-8 w-8 text-muted-foreground" />
              <h3 className="text-sm font-medium">Go to Dashboard</h3>
              <p className="text-xs text-muted-foreground">Manage your profile and activities</p>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between">
        <Link href="/" className="w-full mr-2">
          <Button variant="outline" className="w-full">
            <Home className="mr-2 h-4 w-4" />
            Homepage
          </Button>
        </Link>
        <Link href="/dashboard" className="w-full ml-2">
          <Button className="w-full">
            <LayoutDashboard className="mr-2 h-4 w-4" />
            My Dashboard
          </Button>
        </Link>
      </CardFooter>
    </>
  );
} 