"use client";

import * as React from "react";
import { MapPin, CheckCircle, AlertCircle, User } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { AnimatedContainer, fadeIn } from "@/components/ui/animations";
import { StarRating } from "@/components/ui/star-rating";
import { cn } from "@/lib/utils";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface TeacherCardProps {
  teacher?: {
    id: string;
    name: string;
    subject: string;
    location: string;
    rating: number;
    reviewsCount: number;
    fee: string;
    avatarIndex: number;
    isVerified?: boolean;
    tags?: string[];
    date?: string;
    color?: string;
    featured?: boolean;
  };
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
        router.push(`/teachers/${teacher.id}`);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Navigation failed"));
      }
    }, [router, teacher?.id]);

    if (error) {
      return <ErrorCard />;
    }

    if (!mounted || isLoading || !teacher) {
      return <SkeletonCard />;
    }

    return (
      <div
        className={cn(
          "rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-200 relative group h-[240px] flex flex-col",
          teacher.color || "bg-white",
          teacher.id && "cursor-pointer hover:scale-[1.01]"
        )}
        onClick={handleClick}
        role={teacher.id ? "link" : undefined}
        tabIndex={teacher.id ? 0 : undefined}
        onKeyDown={(e) => e.key === "Enter" && handleClick()}
      >
        {teacher.featured && (
          <div className="absolute -top-1 -right-1 z-10">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-white/80"></span>
              Featured
            </span>
          </div>
        )}

        {/* Header Section */}
        <div className="flex items-start gap-4">
          <div className="relative w-20 h-20 flex-shrink-0">
            <Avatar size="lg" className="w-full h-full">
              <AvatarImage
                src={`/avatars/avatar${(teacher.avatarIndex % 8) + 1}.jpg`}
                alt={teacher.name}
              />
              <AvatarFallback>
                <User className="h-8 w-8 text-gray-400" />
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1.5">
              <h3 className="text-lg font-semibold text-gray-900 truncate">
                {teacher.name}
              </h3>
              {teacher.isVerified && (
                <CheckCircle
                  className="h-4 w-4 text-green-500 flex-shrink-0"
                  aria-label="Verified teacher"
                />
              )}
            </div>
            <p className="text-sm font-medium text-gray-600 mb-1.5">
              {teacher.subject} Teacher
            </p>
            <div className="flex items-center gap-1.5 text-gray-500">
              <MapPin className="h-4 w-4 flex-shrink-0" />
              <span className="text-sm truncate">{teacher.location}</span>
            </div>
          </div>
        </div>

        {/* Tags Section */}
        <div className="mt-3">
          {teacher.tags && teacher.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {teacher.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 rounded-lg bg-gray-100/80 text-gray-700 text-xs font-medium hover:bg-gray-200/80 transition-colors"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Bottom Stats Section */}
        <div className="mt-auto pt-2 border-t">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {mounted && (
                <>
                  <StarRating rating={teacher.rating} size="sm" />
                  <span className="text-sm font-medium text-gray-700">
                    {teacher.rating}
                  </span>
                </>
              )}
            </div>
            <div className="text-lg font-semibold text-blue-600">
              {teacher.fee}
            </div>
          </div>
        </div>
      </div>
    );
  }
);

TeacherCard.displayName = "TeacherCard";

export default TeacherCard;
