"use client";

import * as React from "react";
import { MapPin, CheckCircle, AlertCircle, User, Star, Heart, Clock, Briefcase, GraduationCap } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { AnimatedContainer, fadeIn, zoomIn } from "@/components/ui/animations";
import { StarRating } from "@/components/ui/star-rating";
import { cn } from "@/lib/utils";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import FavouriteButton from "@/components/favourite-button";
import type { TeacherProfile, Profile } from "@/lib/supabase";
import { DummyTeacher } from "@/app/mock-data";

// Helper function to check if a string is a valid UUID
const isUUID = (id: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
};

// Define a more flexible teacher type that can handle both real and dummy data
type FlexibleTeacher = Partial<TeacherProfile> & {
  id: string;
  profiles?: Partial<Profile>;
  color?: string;
  featured?: boolean;
  // Additional fields from dummy data
  name?: string;
  subject?: string | string[];
  location?: string;
  rating?: number;
  fee?: string;
  tags?: string[];
  is_verified?: boolean;
  avatarUrl?: string;
  experience?: string | number;
  gender?: "male" | "female";
};

interface TeacherCardProps {
  teacher?: FlexibleTeacher;
  isLoading?: boolean;
}

const SkeletonCard = () => (
  <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-all duration-300">
    <div className="flex items-start gap-4">
      <div className="relative w-20 h-20 rounded-full bg-gray-200 animate-pulse" />
      <div className="flex-grow space-y-3">
        <div className="h-6 bg-gray-200 rounded w-1/3 animate-pulse" />
        <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse" />
        <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
      </div>
    </div>
    <div className="mt-4 space-y-3">
      <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse" />
      <div className="flex gap-2">
        <div className="h-6 bg-gray-200 rounded-full w-20 animate-pulse" />
        <div className="h-6 bg-gray-200 rounded-full w-20 animate-pulse" />
      </div>
    </div>
  </div>
);

const ErrorCard = () => (
  <div className="bg-white rounded-2xl p-6 shadow-md border border-red-100">
    <div className="flex items-center gap-3 text-red-600">
      <AlertCircle className="h-5 w-5" />
      <p>Failed to load teacher data</p>
    </div>
  </div>
);

const TeacherCard = React.memo(
  ({ teacher, isLoading = false }: TeacherCardProps) => {
    const router = useRouter();
    const [error, setError] = React.useState<Error | null>(null);
    const [mounted, setMounted] = React.useState(false);
    const [navigating, setNavigating] = React.useState(false);
    const [isHovered, setIsHovered] = React.useState(false);

    React.useEffect(() => {
      setMounted(true);
    }, []);

    const handleClick = React.useCallback(async () => {
      if (!teacher?.id || navigating) return;
      
      try {
        setNavigating(true);
        const path = isUUID(teacher.id) 
          ? `/teachers/${teacher.id}` 
          : `/teachers/slug/${teacher.id}`;
        console.log("Navigating to teacher profile:", path);
        
        // Direct navigation with window.location instead of router
        window.location.href = path;
      } catch (err) {
        console.error("Navigation error:", err);
        setNavigating(false);
        setError(err instanceof Error ? err : new Error("Navigation failed"));
      }
    }, [teacher?.id, navigating]);

    if (error) {
      return <ErrorCard />;
    }

    if (!mounted || isLoading || !teacher) {
      return <SkeletonCard />;
    }

    // Get the primary subject or default to "General"
    const primarySubject = Array.isArray(teacher.subject) && teacher.subject.length > 0 
      ? teacher.subject[0] 
      : typeof teacher.subject === 'string' ? teacher.subject : "General";

    // Get the teacher name from profiles or use a placeholder
    const teacherName = teacher.profiles?.full_name || teacher.name || "Teacher";

    // Get the avatar URL or use a default based on teacher ID
    const avatarUrl = teacher.profiles?.avatar_url || teacher.avatarUrl || `/avatars/avatar${(parseInt(teacher.id.slice(-2), 16) % 8) + 1}.jpg`;

    // Check if the teacher ID is a UUID or a slug
    const teacherProfilePath = isUUID(teacher.id) 
      ? `/teachers/${teacher.id}` 
      : `/teachers/slug/${teacher.id}`;
      
    // Random gradient background colors for cards
    const gradients = [
      "from-blue-50 to-indigo-50",
      "from-purple-50 to-pink-50",
      "from-yellow-50 to-amber-50",
      "from-green-50 to-emerald-50",
      "from-teal-50 to-cyan-50",
    ];
    
    // Select a gradient based on teacher ID
    const gradientIndex = parseInt(teacher.id.slice(-2), 16) % gradients.length;
    const cardGradient = gradients[gradientIndex];

    return (
      <AnimatedContainer
        animation={zoomIn}
        className={`relative overflow-hidden rounded-xl shadow-md transition-all duration-300 ${isHovered ? 'shadow-lg scale-[1.02]' : ''}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Gradient background */}
        <div className={`absolute inset-0 bg-gradient-to-br ${cardGradient} opacity-70`}></div>
        
        {/* Featured badge - if teacher is featured */}
        {teacher.featured && (
          <div className="absolute top-3 right-3 z-10">
            <Badge variant="yellow" className="font-semibold">Featured</Badge>
          </div>
        )}
        
        {/* Teacher info section */}
        <div className="relative p-5 z-0">
          <div className="flex items-start space-x-4">
            {/* Teacher avatar with verification badge */}
            <div className="relative">
              <Avatar className="h-16 w-16 border-2 border-white shadow-sm">
                <AvatarImage src={avatarUrl} alt={teacherName} />
                <AvatarFallback>
                  <User className="h-7 w-7 text-gray-400" />
                </AvatarFallback>
              </Avatar>
              {teacher.is_verified && (
                <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
                  <CheckCircle className="h-4 w-4 text-blue-500" />
                </div>
              )}
            </div>
            
            {/* Teacher details */}
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg text-gray-900">{teacherName}</h3>
              </div>
              
              <p className="text-gray-600 flex items-center mt-1">
                <GraduationCap className="h-3.5 w-3.5 mr-1 text-gray-500" />
                {primarySubject} Teacher
              </p>
              
              {/* Location */}
              <div className="flex items-center text-sm text-gray-500 mt-1">
                <MapPin className="h-3.5 w-3.5 mr-1" />
                <span>{teacher.location}</span>
              </div>
              
              {/* Experience - if available */}
              {teacher.experience && (
                <div className="flex items-center text-sm text-gray-500 mt-1">
                  <Briefcase className="h-3.5 w-3.5 mr-1" />
                  <span>{typeof teacher.experience === 'number' ? `${teacher.experience}+ years` : teacher.experience}</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Teaching modes */}
          <div className="flex flex-wrap gap-2 my-3">
            <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700 hover:bg-blue-200">
              Online
            </Badge>
            <Badge variant="secondary" className="text-xs bg-green-100 text-green-700 hover:bg-green-200">
              Home Visits
            </Badge>
            <Badge variant="secondary" className="text-xs bg-purple-100 text-purple-700 hover:bg-purple-200">
              Group & 1-on-1
            </Badge>
          </div>
          
          {/* Rating, tags and fee */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <StarRating rating={teacher.rating || 0} size="sm" />
              
              {/* Tags/Subjects */}
              {teacher.tags && teacher.tags.length > 0 && (
                <div className="text-xs text-gray-600 italic">
                  {teacher.tags.slice(0, 2).join(" • ")}
                  {teacher.tags.length > 2 && "..."}
                </div>
              )}
            </div>
            
            {/* Fee */}
            <div className="text-blue-600 font-bold bg-gradient-to-r from-blue-50 to-blue-100 px-3 py-1 rounded-full text-sm border border-blue-100">
              ₹{teacher.fee || "800"}<span className="text-xs font-normal">/hr</span>
            </div>
          </div>
        </div>
        
        {/* View profile button */}
        <div className="relative bg-white/70 backdrop-blur-sm p-3 border-t border-gray-100">
          <a 
            href={teacherProfilePath} 
            className="block w-full text-center py-2.5 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            onClick={(e) => {
              e.preventDefault();
              handleClick();
            }}
          >
            View Profile
          </a>
        </div>
      </AnimatedContainer>
    );
  }
);

TeacherCard.displayName = "TeacherCard";

export default TeacherCard;
