"use client";

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/contexts/auth";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { toast } from "@/components/ui/use-toast";

// Helper function to check if a string is a valid UUID
const isUUID = (id: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
};

interface FavouriteButtonProps {
  teacherId: string;
  className?: string;
}

export default function FavouriteButton({ teacherId, className }: FavouriteButtonProps) {
  const { user, profile } = useAuth();
  const [isFavourite, setIsFavourite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const supabase = createClientComponentClient();

  // Set client-side rendering flag
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Check if teacher is already in favourites
  useEffect(() => {
    if (isClient && user && (profile?.user_type === "student" || profile?.user_type === "parent")) {
      checkFavouriteStatus();
    }
  }, [isClient, user, profile, teacherId]);

  const checkFavouriteStatus = async () => {
    if (!user || !isUUID(teacherId)) return;

    try {
      const { data, error } = await supabase
        .from("favourite_teachers")
        .select("id")
        .eq("user_id", user.id)
        .eq("teacher_id", teacherId)
        .single();

      if (error && error.code !== "PGRST116") { // PGRST116 is "no rows returned"
        console.error("Error checking favourite status:", error);
        return;
      }

      setIsFavourite(!!data);
    } catch (err) {
      console.error("Error checking favourite status:", err);
    }
  };

  const toggleFavourite = async () => {
    if (!user) return;
    
    // Only students and parents can add favourites
    if (profile?.user_type !== "student" && profile?.user_type !== "parent") {
      toast({
        title: "Access Restricted",
        description: "Only students and parents can add teachers to favourites.",
        variant: "destructive",
      });
      return;
    }

    // Check if teacherId is a valid UUID
    if (!isUUID(teacherId)) {
      toast({
        title: "Cannot Add to Favourites",
        description: "This is a demo teacher and cannot be added to favourites.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      if (isFavourite) {
        // Remove from favourites
        const { error } = await supabase
          .from("favourite_teachers")
          .delete()
          .eq("user_id", user.id)
          .eq("teacher_id", teacherId);

        if (error) {
          console.error("Error removing from favourites:", error);
          toast({
            title: "Error",
            description: "Failed to remove teacher from favourites.",
            variant: "destructive",
          });
          return;
        }

        toast({
          title: "Removed from favourites",
          description: "Teacher has been removed from your favourites.",
        });
      } else {
        // Add to favourites
        const { error } = await supabase
          .from("favourite_teachers")
          .insert({
            user_id: user.id,
            teacher_id: teacherId,
          });

        if (error) {
          console.error("Error adding to favourites:", error);
          toast({
            title: "Error",
            description: "Failed to add teacher to favourites.",
            variant: "destructive",
          });
          return;
        }

        toast({
          title: "Added to favourites",
          description: "Teacher has been added to your favourites.",
        });
      }

      // Update the favourite status
      setIsFavourite(!isFavourite);
    } catch (err) {
      console.error("Error toggling favourite status:", err);
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Don't render anything on server
  if (!isClient) {
    return null;
  }

  // Don't show button for teachers or if not logged in
  if (!user || profile?.user_type === "teacher") {
    return null;
  }

  return (
    <Button
      variant="outline"
      size="sm"
      className={`flex items-center gap-2 ${className}`}
      onClick={toggleFavourite}
      disabled={isLoading}
    >
      <Heart
        className={`h-4 w-4 ${isFavourite ? "fill-red-500 text-red-500" : ""}`}
      />
      {isFavourite ? "Remove from Favourites" : "Add to Favourites"}
    </Button>
  );
} 