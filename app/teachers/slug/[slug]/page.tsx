"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  MapPin,
  Star,
  CheckCircle,
  User,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { StarRating } from "@/components/ui/star-rating";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import TeacherExperienceEducation from "@/app/components/TeacherExperienceEducation";
import { DummyTeacher, dummyTeachers } from "../../../mock-data";

// Define a custom type for the transformed teacher
interface TransformedTeacher {
  id: string;
  user_id: string;
  subject: string[];
  location: string;
  fee: string;
  about: string;
  tags: string[];
  is_verified: boolean;
  rating: number;
  reviews_count: number;
  created_at: string;
  profiles?: {
    full_name: string;
    email: string;
    avatar_url: string;
  };
}

export default function TeacherProfileBySlug() {
  const router = useRouter();
  const params = useParams();
  const slug = params?.slug as string;
  
  const [teacher, setTeacher] = useState<TransformedTeacher | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Add a timeout for loading state
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (isLoading) {
        console.error("Loading timeout for teacher profile slug:", slug);
        setError("Loading timed out. Please try again.");
        setIsLoading(false);
      }
    }, 10000); // 10 seconds timeout
    
    return () => clearTimeout(timeoutId);
  }, [isLoading, slug]);

  useEffect(() => {
    if (!slug) return;
    
    console.log("Loading teacher profile for slug:", slug);
    
    // Find the teacher with the matching slug from dummy data
    const foundTeacher = dummyTeachers.find((t: DummyTeacher) => t.id === slug);
    
    if (foundTeacher) {
      console.log("Found dummy teacher:", foundTeacher.name);
      
      // Transform the dummy teacher data to match the expected format
      setTeacher({
        id: foundTeacher.id,
        user_id: foundTeacher.id,
        subject: [foundTeacher.subject],
        location: foundTeacher.location,
        fee: foundTeacher.fee,
        about: "This is a mock teacher profile created from dummy data. In a real application, this would be fetched from the database.",
        tags: foundTeacher.tags || [],
        is_verified: foundTeacher.isVerified || false,
        rating: foundTeacher.rating || 0,
        reviews_count: foundTeacher.reviewsCount || 0,
        created_at: new Date().toISOString(),
        profiles: {
          full_name: foundTeacher.name,
          email: `${slug.toLowerCase()}@example.com`,
          avatar_url: `/avatars/avatar${foundTeacher.avatarIndex || 1}.jpg`
        }
      });
    } else {
      console.error("Teacher not found for slug:", slug);
      setError("Teacher not found");
    }
    
    setIsLoading(false);
  }, [slug]);
  
  // Handle page navigation
  const goBack = () => {
    router.back();
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <Loader2 className="h-12 w-12 text-blue-500 animate-spin mb-4" />
        <p className="text-gray-600">Loading teacher profile...</p>
      </div>
    );
  }
  
  if (error || !teacher) {
    return (
      <div className="min-h-screen max-w-4xl mx-auto px-4 py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-red-700 mb-2">Error Loading Profile</h2>
          <p className="text-red-600 mb-6">{error || "Teacher not found"}</p>
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
  const avatarUrl = teacher.profiles?.avatar_url || `/avatars/avatar1.jpg`;

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
            
            <div>
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
            </div>
          </div>
        </div>
      </div>
      
      {/* Content Tabs */}
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
                <h2 className="text-xl font-semibold mb-4">Experience & Education</h2>
                <p className="text-gray-600">
                  This is a mock teacher profile. Experience and education details are not available.
                </p>
              </div>
            </Card>
          </TabsContent>
          
          {/* Reviews Tab */}
          <TabsContent value="reviews">
            <Card>
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4">Reviews</h2>
                <p className="text-gray-600">
                  This is a mock teacher profile. Reviews are not available.
                </p>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
} 