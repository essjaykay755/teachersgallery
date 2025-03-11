"use client";

import * as React from "react";
import { MapPin, CheckCircle, AlertCircle, User, Star, Heart } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { AnimatedContainer, fadeIn } from "@/components/ui/animations";
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
  <div className="bg-white rounded-2xl p-6 shadow-sm">
    <div className="flex items-start gap-4">
      <div className="relative w-20 h-20 rounded-full bg-gray-200" />
      <div className="flex-grow space-y-3">
        <div className="h-6 bg-gray-200 rounded w-1/3" />
        <div className="h-4 bg-gray-200 rounded w-1/4" />
        <div className="h-4 bg-gray-200 rounded w-1/2" />
      </div>
    </div>
    <div className="mt-4 space-y-3">
      <div className="h-4 bg-gray-200 rounded w-1/4" />
      <div className="flex gap-2">
        <div className="h-6 bg-gray-200 rounded-full w-20" />
        <div className="h-6 bg-gray-200 rounded-full w-20" />
      </div>
    </div>
  </div>
);

const ErrorCard = () => (
  <div className="bg-white rounded-2xl p-6 shadow-sm border border-red-100">
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

    React.useEffect(() => {
      setMounted(true);
    }, []);

    const handleClick = React.useCallback(() => {
      if (!teacher?.id) return;
      try {
        const path = isUUID(teacher.id) 
          ? `/teachers/${teacher.id}` 
          : `/teachers/slug/${teacher.id}`;
        console.log("Navigating to teacher profile:", path);
        router.push(path);
      } catch (err) {
        console.error("Navigation error:", err);
        setError(err instanceof Error ? err : new Error("Navigation failed"));
      }
    }, [router, teacher?.id]);

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

    // Get experience level badge
    const getExperienceBadge = () => {
      const years = parseInt(String(teacher.experience || '0'), 10);
      if (years >= 10) return { label: '10+ yrs', bg: 'bg-purple-100 text-purple-700' };
      if (years >= 5) return { label: '5+ yrs', bg: 'bg-blue-100 text-blue-700' };
      if (years >= 2) return { label: '2+ yrs', bg: 'bg-green-100 text-green-700' };
      return { label: 'New', bg: 'bg-gray-100 text-gray-700' };
    };
    
    const expBadge = getExperienceBadge();

    return (
      <div 
        className={cn(
          "rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-200 relative group h-auto",
          // Use gender-specific gradients with proper fallback if gender field doesn't exist
          teacher.gender === "female" ? "bg-gradient-to-br from-white to-pink-50" :
          teacher.profiles?.gender === "female" ? "bg-gradient-to-br from-white to-pink-50" :
          "bg-gradient-to-br from-white to-blue-50", // Default to blue (male)
          teacher.id && "cursor-pointer hover:scale-[1.01]"
        )}
        onClick={handleClick}
        role={teacher.id ? "link" : undefined}
        tabIndex={teacher.id ? 0 : undefined}
        onKeyDown={(e) => e.key === "Enter" && handleClick()}
      >
        {teacher.featured && (
          <div className="absolute -top-1 -right-1 z-10">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-white/80 animate-pulse"></span>
              Featured
            </span>
          </div>
        )}

        {/* Header Section */}
        <div className="flex items-start gap-4">
          <div className="relative w-20 h-20 flex-shrink-0">
            <Avatar size="lg" className="w-full h-full ring-2 ring-blue-100 ring-offset-2">
              <AvatarImage
                src={avatarUrl}
                alt={teacherName}
              />
              <AvatarFallback>
                <User className="h-8 w-8 text-gray-400" />
              </AvatarFallback>
            </Avatar>
            {teacher.is_verified && (
              <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm z-20">
                <CheckCircle
                  className="h-5 w-5 text-green-500 flex-shrink-0"
                  aria-label="Verified teacher"
                />
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1.5">
              <h3 className="text-lg font-semibold text-gray-900 truncate max-w-[180px]">
                {teacherName}
              </h3>
              {expBadge.label === 'New' && (
                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                  New
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 mb-1.5">
              {expBadge.label !== 'New' && (
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${expBadge.bg}`}>
                  {expBadge.label}
                </span>
              )}
              <p className="text-sm font-medium text-gray-600 truncate">
                {primarySubject} Teacher
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-gray-500">
              <MapPin className="h-4 w-4 flex-shrink-0" />
              <span className="text-sm truncate">{teacher.location}</span>
            </div>
          </div>
        </div>

        {/* Tags Section */}
        <div className="mt-4">
          {teacher.tags && teacher.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {teacher.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 rounded-full bg-gray-100/80 text-gray-700 text-xs font-medium hover:bg-gray-200/80 transition-colors"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Teaching Format */}
        <div className="mt-3 flex flex-wrap gap-2">
          {teacher.tags?.some(tag => tag.toLowerCase().includes('online')) && (
            <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-medium">
              Online
            </span>
          )}
          {teacher.tags?.some(tag => tag.toLowerCase().includes('offline')) && (
            <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium">
              Home Visits
            </span>
          )}
          {teacher.tags?.some(tag => tag.toLowerCase().includes('hybrid')) && (
            <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-medium">
              Group & 1-on-1
            </span>
          )}
          {!teacher.tags?.some(tag => 
            tag.toLowerCase().includes('online') || 
            tag.toLowerCase().includes('offline') || 
            tag.toLowerCase().includes('hybrid')
          ) && (
            <>
              <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-medium">
                Online
              </span>
              <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium">
                Home Visits
              </span>
              <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-medium">
                Group & 1-on-1
              </span>
            </>
          )}
        </div>

        {/* Bottom Stats Section */}
        <div className="mt-4 pt-3 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {mounted && (
                <>
                  <StarRating rating={teacher.rating || 0} size="sm" />
                  <span className="text-sm font-medium text-gray-700">
                    {teacher.rating || ""}
                  </span>
                </>
              )}
            </div>
            <div className="text-lg font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              <span className="font-sans">₹</span>{teacher.fee}
              {!teacher.fee?.includes('/hr') && !teacher.fee?.includes('per hr') && '/hr'}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-4 flex justify-between gap-2">
          <Link 
            href={teacherProfilePath} 
            className="flex-1 block"
            onClick={(e) => {
              e.stopPropagation();
              console.log("Navigating via Link to:", teacherProfilePath);
            }}
          >
            <Button variant="outline" className="w-full bg-white hover:bg-blue-50 border-blue-200">
              View Profile
            </Button>
          </Link>
          {isUUID(teacher.id) ? (
            <FavouriteButton 
              teacherId={teacher.id} 
              className="flex-none" 
            />
          ) : (
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-2 flex-none bg-white hover:bg-red-50 border-red-200"
              onClick={(e) => {
                e.stopPropagation();
                alert("This is a demo teacher and cannot be added to favourites.");
              }}
            >
              <Heart className="h-4 w-4" />
              <span className="hidden sm:inline">Add to Favourites</span>
            </Button>
          )}
        </div>
      </div>
    );
  }
);

TeacherCard.displayName = "TeacherCard";

export default TeacherCard;
