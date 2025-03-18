"use client";

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  MapPin,
  Star,
  Clock,
  Users,
  Award,
  CheckCircle,
  Phone,
  MessageSquare,
  Heart,
  Briefcase,
  GraduationCap,
  School,
  AlertTriangle,
  User,
  Loader2,
} from "lucide-react";
import Image from "next/image";
import { useRouter, useParams } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";
import { StarRating } from "@/components/ui/star-rating";
import TeacherExperienceEducation from "@/app/components/TeacherExperienceEducation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import type { TeacherProfile, TeacherExperience, TeacherEducation, Review } from "@/lib/supabase";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import FavouriteButton from "@/components/favourite-button";
import { fetchTeacherProfile } from "@/lib/api";

export default function TeacherProfile() {
  const router = useRouter();
  const params = useParams();
  const teacherId = params?.id as string;
  
  const [teacher, setTeacher] = useState<TeacherProfile | null>(null);
  const [experiences, setExperiences] = useState<TeacherExperience[]>([]);
  const [educations, setEducations] = useState<TeacherEducation[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeoutWarning, setTimeoutWarning] = useState(false);

  // Create a reference for tracking if the component is mounted
  const isMountedRef = useRef(true);
  
  // Improved timeout mechanism with warning and escalation
  useEffect(() => {
    let warningTimeoutId: NodeJS.Timeout | null = null;
    let errorTimeoutId: NodeJS.Timeout | null = null;
    
    if (isLoading) {
      // First timeout - just show a warning after 10 seconds
      warningTimeoutId = setTimeout(() => {
        if (isMountedRef.current && isLoading) {
          console.log("Profile taking longer than expected to load:", teacherId);
          setTimeoutWarning(true);
        }
      }, 10000);
      
      // Second timeout - show error after 45 seconds (increased from 30s to match API timeout)
      errorTimeoutId = setTimeout(() => {
        if (isMountedRef.current && isLoading) {
          console.error("Loading timeout for teacher profile:", teacherId);
          setError("Loading timed out. The server is taking too long to respond. Please try again later or contact support if the issue persists.");
          setIsLoading(false);
        }
      }, 45000);
    }
    
    return () => {
      // Clean up both timeouts on unmount or when loading state changes
      if (warningTimeoutId) clearTimeout(warningTimeoutId);
      if (errorTimeoutId) clearTimeout(errorTimeoutId);
    };
  }, [isLoading, teacherId]);

  // Set isMounted to false when component unmounts
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Enhanced fetch with better error handling and progress tracking
  useEffect(() => {
    if (!teacherId) return;
    
    let isMounted = true; // Local mounting flag
    
    async function fetchTeacherData() {
      console.log("Fetching teacher data for ID:", teacherId);
      
      setIsLoading(true);
      setError(null);
      setTimeoutWarning(false);
      
      try {
        // Simple fetch with direct call
        const teacherData = await fetchTeacherProfile(teacherId);
        
        if (!isMounted) return; // Check if still mounted
        
        if (!teacherData) {
          console.error("Teacher profile not found");
          setError("Teacher profile not found. It may have been deleted or is no longer available.");
          setIsLoading(false);
          return;
        }
        
        console.log("Teacher data loaded successfully");
        setTeacher(teacherData);
        
        // Now load secondary data
        const supabase = createClientComponentClient();
        
        try {
          // Fetch experiences
          const { data: experiences } = await supabase
            .from("teacher_experience")
            .select("*")
            .eq("teacher_id", teacherId)
            .order("created_at", { ascending: false });
          
          if (isMounted && experiences) {
            setExperiences(experiences);
          }
          
          // Fetch educations
          const { data: educations } = await supabase
            .from("teacher_education")
            .select("*")
            .eq("teacher_id", teacherId)
            .order("created_at", { ascending: false });
          
          if (isMounted && educations) {
            setEducations(educations);
          }
          
          // Fetch reviews
          const { data: reviews } = await supabase
            .from("reviews")
            .select(`
              *,
              reviewer:profiles!reviewer_id (
                full_name,
                avatar_url
              )
            `)
            .eq("teacher_id", teacherId)
            .order("created_at", { ascending: false });
          
          if (isMounted && reviews) {
            setReviews(reviews);
          }
        } catch (secondaryError) {
          console.warn("Error fetching secondary data:", secondaryError);
          // We don't fail the whole page for secondary data errors
        }
        
        // Set loading to false only if still mounted
        if (isMounted) {
          setIsLoading(false);
        }
      } catch (err) {
        if (!isMounted) return;
        
        console.error("Error loading teacher profile:", err);
        const errorMessage = err instanceof Error ? err.message : "Unknown error";
        setError(`Failed to load teacher profile: ${errorMessage}`);
        setIsLoading(false);
      }
    }
    
    fetchTeacherData();
    
    // Add a safety timeout to ensure loading state is never stuck
    const safetyTimeout = setTimeout(() => {
      if (isMounted && isLoading) {
        console.warn("Safety timeout triggered - forcing loading state to end");
        setIsLoading(false);
        setError("Loading timed out. Please try refreshing the page.");
      }
    }, 15000); // 15 second maximum loading time
    
    return () => {
      isMounted = false; // Mark as unmounted
      clearTimeout(safetyTimeout);
    };
  }, [teacherId]);
  
  // Handle page navigation
  const goBack = () => {
    router.back();
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <Loader2 className="h-12 w-12 text-blue-500 animate-spin mb-4" />
        <p className="text-gray-600">Loading teacher profile...</p>
        
        {timeoutWarning && (
          <div className="mt-4 p-3 bg-yellow-50 text-yellow-800 rounded-md max-w-md text-center">
            <p className="font-medium">This is taking longer than expected.</p>
            <p className="text-sm mt-1">We're still trying to load the profile. Please wait a moment...</p>
            <p className="text-xs mt-2 text-yellow-600">Profile ID: {teacherId}</p>
          </div>
        )}
      </div>
    );
  }
  
  if (error || !teacher) {
    return (
      <div className="min-h-screen max-w-4xl mx-auto px-4 py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-red-700 mb-2">Error Loading Profile</h2>
          <p className="text-red-600 mb-6">{error || "Teacher profile not found"}</p>
          <Button onClick={goBack} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
          </Button>
        </div>
      </div>
    );
  }
  
  const teacherName = teacher.profiles?.full_name || "Teacher";
  const primarySubject = Array.isArray(teacher.subject) && teacher.subject.length > 0 
    ? teacher.subject[0] 
    : "General";
  const avatarUrl = teacher.profiles?.avatar_url || `/avatars/avatar${(parseInt(teacher.id.slice(-2), 16) % 8) + 1}.jpg`;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Teacher Avatar and Basic Info */}
      <div className="bg-white border-b">
        <div className="max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex items-center mb-6">
            <Button
              variant="ghost"
              onClick={goBack}
              className="mr-2"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </div>

          <div className="flex flex-col md:flex-row md:items-start gap-6">
            <div className="relative">
              <Avatar size="xl" className="w-24 h-24 md:w-32 md:h-32">
                <AvatarImage
                  src={avatarUrl}
                  alt={teacherName}
                />
                <AvatarFallback>
                  <User className="h-12 w-12 text-gray-400" />
                </AvatarFallback>
              </Avatar>
              {teacher.is_verified && (
                <span className="absolute bottom-1 right-1 bg-green-500 text-white p-1 rounded-full z-10">
                  <CheckCircle className="h-4 w-4" />
                </span>
              )}
            </div>
            
            <div className="flex-1">
              <div className="flex items-center flex-wrap gap-2">
                <h1 className="text-2xl font-bold text-gray-900 mr-2">
                  {teacherName}
                </h1>
                {teacher.is_verified && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <CheckCircle className="h-3 w-3" />
                    Verified
                  </span>
                )}
                {(!teacher.rating || teacher.rating === 0) && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                    New
                  </span>
                )}
              </div>
              
              <p className="text-lg text-gray-600 mt-1">
                {primarySubject} Teacher
              </p>
              
              <div className="flex items-center mt-2 text-gray-500">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{teacher.location}</span>
              </div>
              
              <div className="flex flex-wrap items-center gap-4 mt-3">
                <div className="flex items-center">
                  <StarRating rating={teacher.rating || 0} size="md" />
                  {teacher.rating ? (
                    <span className="ml-2 text-lg font-medium text-gray-900">
                      {teacher.rating.toFixed(1)}/5
                    </span>
                  ) : (
                    <span className="ml-2 text-sm italic text-gray-500">
                      No ratings yet
                    </span>
                  )}
                  {teacher.reviews_count && teacher.reviews_count > 0 && (
                    <span className="ml-1 text-sm text-gray-500">
                      ({teacher.reviews_count} reviews)
                    </span>
                  )}
                </div>
                
                <div className="text-xl font-semibold text-blue-600">
                  ₹{teacher.fee}
                  {!teacher.fee?.includes('/hr') && !teacher.fee?.includes(' hr') && '/hr'}
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 mt-4">
                {teacher.tags && teacher.tags.map(tag => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="flex flex-col gap-3 mt-4 md:mt-0">
              <Button className="w-full md:w-auto">
                <MessageSquare className="mr-2 h-4 w-4" />
                Contact
              </Button>
              <FavouriteButton
                teacherId={teacher.id}
                className="w-full md:w-auto"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <Tabs defaultValue="about">
          <TabsList className="mb-6">
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="experience">Experience & Education</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>
          
          {/* About Tab */}
          <TabsContent value="about">
            <Card>
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4">About {teacherName}</h2>
                <p className="whitespace-pre-line text-gray-700 leading-relaxed">
                  {teacher.about}
                </p>
                
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="flex items-center text-blue-800 font-medium mb-2">
                      <Briefcase className="h-4 w-4 mr-2" />
                      Subjects
                    </h3>
                    <ul className="space-y-1">
                      {teacher.subject && teacher.subject.map(subj => (
                        <li key={subj} className="text-gray-700">• {subj}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>
          
          {/* Experience Tab */}
          <TabsContent value="experience">
            <Card>
              <div className="p-6">
                <TeacherExperienceEducation
                  teacherId={teacher.id}
                />
              </div>
            </Card>
          </TabsContent>
          
          {/* Reviews Tab */}
          <TabsContent value="reviews">
            <Card>
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4">Reviews</h2>
                
                {reviews.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    No reviews yet. Be the first to leave a review!
                  </p>
                ) : (
                  <div className="space-y-6">
                    {reviews.map((review) => (
                      <div key={review.id} className="border-b pb-6 last:border-b-0">
                        <div className="flex items-start">
                          <Avatar size="md" className="mr-4">
                            <AvatarImage
                              src={review.reviewer?.avatar_url || "/avatars/default.jpg"}
                              alt={review.reviewer?.full_name || "Reviewer"}
                            />
                            <AvatarFallback>
                              <User className="h-4 w-4" />
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center mb-2">
                              <p className="font-medium text-gray-900 mr-2">
                                {review.reviewer?.full_name || "Anonymous"}
                              </p>
                              <StarRating rating={review.rating} size="sm" />
                            </div>
                            <p className="text-sm text-gray-500 mb-2">
                              {new Date(review.created_at).toLocaleDateString()}
                            </p>
                            <p className="text-gray-700">{review.comment}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
