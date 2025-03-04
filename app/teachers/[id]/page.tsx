"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
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
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";
import { StarRating } from "@/components/ui/star-rating";
import TeacherExperienceEducation from "@/app/components/TeacherExperienceEducation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import type { TeacherProfile } from "@/lib/supabase";

// Update mock teacher data
const mockTeacher = {
  id: "priya-sharma",
  name: "Priya Sharma",
  subject: "Mathematics",
  location: "Mumbai, Maharashtra",
  fee: "₹800/hr",
  experience: [
    {
      title: "Senior Mathematics Teacher",
      institution: "Excel Academy",
      period: "2018 - Present",
      description:
        "Teaching IIT-JEE and NEET aspirants with focus on advanced mathematics.",
    },
    {
      title: "Mathematics Faculty",
      institution: "Brilliant Tutorials",
      period: "2014 - 2018",
      description:
        "Conducted classes for high school students and competitive exam preparation.",
    },
    {
      title: "Private Tutor",
      institution: "Self-employed",
      period: "2012 - 2014",
      description: "One-on-one tutoring for high school mathematics.",
    },
  ],
  education: [
    {
      degree: "M.Sc. Mathematics",
      institution: "IIT Bombay",
      year: "2012",
    },
    {
      degree: "B.Sc. Mathematics",
      institution: "St. Xavier's College",
      year: "2010",
    },
  ],
  rating: 4.8,
  reviewsCount: 124,
  students: 450,
  tags: ["Online", "10+ years", "High School", "IIT-JEE"],
  about: `Experienced Mathematics teacher specializing in IIT-JEE preparation. I have helped over 400 students achieve their academic goals with a personalized teaching approach.

My teaching methodology focuses on building strong fundamentals and problem-solving skills. I believe in making Mathematics interesting and relatable through real-world examples.`,
  achievements: [
    "100% success rate in IIT-JEE Advanced",
    "15 students ranked under AIR 1000",
    "Average improvement of 35% in student scores",
  ],
  subjects: ["Mathematics", "Physics", "IIT-JEE", "NEET"],
  avatarIndex: 1,
  isVerified: true,
  isFeatured: true,
  reviews: [
    {
      id: 1,
      student: "Rahul Kumar",
      avatar: "/avatars/avatar3.jpg",
      rating: 5,
      date: "2 weeks ago",
      comment:
        "Excellent teacher! Her teaching methodology helped me understand complex concepts easily.",
    },
    {
      id: 2,
      student: "Priya Patel",
      avatar: "/avatars/avatar4.jpg",
      rating: 4,
      date: "1 month ago",
      comment:
        "Very patient and thorough with explanations. Helped me improve my grades significantly.",
    },
    {
      id: 3,
      student: "Amit Shah",
      avatar: "/avatars/avatar5.jpg",
      rating: 5,
      date: "2 months ago",
      comment:
        "Great at explaining difficult topics. Always punctual and well-prepared for classes.",
    },
  ],
};

export default function TeacherProfile({ params }: { params: { id: string } }) {
  const [isClient, setIsClient] = useState(false);
  const [activeTab, setActiveTab] = useState("about");
  const [isFavorite, setIsFavorite] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [teacher, setTeacher] = useState<TeacherProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const supabase = createClientComponentClient();

  useEffect(() => {
    setIsClient(true);

    async function fetchTeacherProfile() {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from("teacher_profiles")
          .select(
            `
            *,
            profiles(*)
          `
          )
          .eq("id", params.id)
          .single();

        if (error) {
          console.error("Error fetching teacher profile:", error);
          return;
        }

        setTeacher(data);
      } catch (err) {
        console.error("Error in fetchTeacherProfile:", err);
      } finally {
        setIsLoading(false);
      }
    }

    if (params.id) {
      fetchTeacherProfile();
    }
  }, [params.id, supabase]);

  const totalExperience = useMemo(() => {
    // If we have real data, we'll calculate from that
    // For now, using mock data
    const currentYear = 2024; // Using a fixed year instead of dynamic calculation
    const startYear = Math.min(
      ...mockTeacher.experience.map((exp) => {
        const startYear = exp.period.split(" - ")[0];
        return parseInt(startYear);
      })
    );
    return `${currentYear - startYear}+ years`;
  }, []);

  const handleRequestContact = useCallback(
    (type: "phone" | "whatsapp") => {
      if (!isClient) return;
      console.log(`Requesting ${type} number...`);
    },
    [isClient]
  );

  const handleSubmitReview = useCallback(() => {
    if (!isClient) return;
    console.log({ rating: reviewRating, comment: reviewComment });
    setReviewComment("");
  }, [isClient, reviewRating, reviewComment]);

  const handleReport = useCallback(() => {
    if (!isClient) return;
    console.log("Reporting teacher...");
  }, [isClient]);

  // Use mock data while loading or if no data is available
  const displayTeacher = teacher || mockTeacher;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          className="mb-6 hover:bg-gray-100"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Teachers
        </Button>

        <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
          {/* Main Content */}
          <div className="space-y-8">
            {/* Basic Information Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row items-start gap-6">
                <div className="relative">
                  <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden bg-gray-100">
                    <Image
                      src={
                        teacher?.profiles?.avatar_url ||
                        `/avatars/avatar${mockTeacher.avatarIndex}.jpg`
                      }
                      alt={teacher?.profiles?.full_name || mockTeacher.name}
                      fill
                      sizes="(max-width: 640px) 96px, 128px"
                      className="object-cover"
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`absolute -bottom-3 -right-3 h-9 w-9 rounded-full bg-white shadow-md border ${
                      isFavorite
                        ? "text-red-500 hover:text-red-600"
                        : "text-gray-400 hover:text-gray-500"
                    }`}
                    onClick={() => setIsFavorite(!isFavorite)}
                  >
                    <Heart
                      className="h-5 w-5"
                      fill={isFavorite ? "currentColor" : "none"}
                    />
                  </Button>
                </div>
                <div className="flex-grow w-full">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h1 className="text-2xl font-semibold">
                          {teacher?.profiles?.full_name || mockTeacher.name}
                        </h1>
                        {(teacher?.is_verified || mockTeacher.isVerified) && (
                          <div className="flex items-center gap-1 px-2 py-1 bg-green-50 text-green-600 rounded-full text-xs font-medium">
                            <CheckCircle className="h-3.5 w-3.5" />
                            <span>Verified</span>
                          </div>
                        )}
                        {mockTeacher.isFeatured && (
                          <div className="flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                            <Star className="h-3.5 w-3.5 fill-blue-400 stroke-blue-400" />
                            <span>Featured</span>
                          </div>
                        )}
                      </div>
                      <p className="text-gray-600">
                        {teacher?.subject?.[0] || mockTeacher.subject} Teacher
                      </p>
                      <div className="flex items-center gap-2 text-gray-500 mt-2">
                        <MapPin className="h-4 w-4" />
                        <span>{teacher?.location || mockTeacher.location}</span>
                      </div>
                    </div>
                    <div className="mt-2 sm:mt-0 sm:text-right">
                      <div className="text-2xl font-semibold text-blue-600">
                        {teacher?.fee || mockTeacher.fee}
                      </div>
                      <div className="text-sm text-gray-500">per hour</div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-4 mt-4">
                    <div className="flex items-center gap-1">
                      <StarRating
                        rating={teacher?.rating || mockTeacher.rating}
                      />
                      <span className="font-medium">
                        {teacher?.rating || mockTeacher.rating}
                      </span>
                      <span className="text-gray-500">
                        ({teacher?.reviews_count || mockTeacher.reviewsCount}{" "}
                        reviews)
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-600">
                      <Clock className="h-4 w-4" />
                      <span>{totalExperience}</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-600">
                      <Users className="h-4 w-4" />
                      <span>{mockTeacher.students}+ students</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {(teacher?.tags || mockTeacher.tags).map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs Section */}
            <Card>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="w-full justify-start rounded-none border-b p-0">
                  <TabsTrigger
                    value="about"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500"
                  >
                    About
                  </TabsTrigger>
                  <TabsTrigger
                    value="experience"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500"
                  >
                    Experience
                  </TabsTrigger>
                  <TabsTrigger
                    value="reviews"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500"
                  >
                    Reviews
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="about" className="p-6">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-3">
                        About {teacher?.profiles?.full_name || mockTeacher.name}
                      </h3>
                      <p className="text-gray-700 whitespace-pre-line">
                        {teacher?.about || mockTeacher.about}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mb-3">Subjects</h3>
                      <div className="flex flex-wrap gap-2">
                        {(teacher?.subject || mockTeacher.subjects).map(
                          (subject) => (
                            <span
                              key={subject}
                              className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm"
                            >
                              {subject}
                            </span>
                          )
                        )}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mb-3">Achievements</h3>
                      <ul className="space-y-2">
                        {mockTeacher.achievements.map((achievement, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <Award className="h-5 w-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                            <span>{achievement}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="experience" className="p-6">
                  {teacher ? (
                    <TeacherExperienceEducation teacherId={teacher.id} />
                  ) : (
                    <div className="space-y-8">
                      {/* Experience Section */}
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">
                          Work Experience
                        </h3>
                        <div className="space-y-4">
                          {mockTeacher.experience.map((exp, index) => (
                            <div
                              key={index}
                              className="border border-gray-200 rounded-md p-4"
                            >
                              <h4 className="font-medium">{exp.title}</h4>
                              <p className="text-sm text-gray-600">
                                {exp.institution}
                              </p>
                              <p className="text-sm text-gray-500">
                                {exp.period}
                              </p>
                              {exp.description && (
                                <p className="mt-2 text-sm">
                                  {exp.description}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Education Section */}
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">
                          Education
                        </h3>
                        <div className="space-y-4">
                          {mockTeacher.education.map((edu, index) => (
                            <div
                              key={index}
                              className="border border-gray-200 rounded-md p-4"
                            >
                              <h4 className="font-medium">{edu.degree}</h4>
                              <p className="text-sm text-gray-600">
                                {edu.institution}
                              </p>
                              <p className="text-sm text-gray-500">
                                {edu.year}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="reviews" className="p-6">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium">Student Reviews</h3>
                      <div className="flex items-center gap-1">
                        <StarRating
                          rating={teacher?.rating || mockTeacher.rating}
                        />
                        <span className="font-medium">
                          {teacher?.rating || mockTeacher.rating}
                        </span>
                        <span className="text-gray-500">
                          ({teacher?.reviews_count || mockTeacher.reviewsCount}{" "}
                          reviews)
                        </span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {mockTeacher.reviews.map((review) => (
                        <div
                          key={review.id}
                          className="border border-gray-200 rounded-md p-4"
                        >
                          <div className="flex items-start gap-3">
                            <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-100">
                              <Image
                                src={review.avatar}
                                alt={review.student}
                                fill
                                sizes="40px"
                                className="object-cover"
                              />
                            </div>
                            <div className="flex-grow">
                              <div className="flex flex-wrap items-center justify-between gap-2">
                                <h4 className="font-medium">
                                  {review.student}
                                </h4>
                                <span className="text-sm text-gray-500">
                                  {review.date}
                                </span>
                              </div>
                              <div className="mt-1">
                                <StarRating rating={review.rating} size="sm" />
                              </div>
                              <p className="mt-2 text-gray-700">
                                {review.comment}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="border-t pt-6">
                      <h4 className="font-medium mb-3">Write a Review</h4>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Rating
                          </label>
                          <StarRating
                            rating={reviewRating}
                            interactive
                            onRatingChange={setReviewRating}
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="comment"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Your Review
                          </label>
                          <Textarea
                            id="comment"
                            value={reviewComment}
                            onChange={(e) => setReviewComment(e.target.value)}
                            placeholder="Share your experience with this teacher..."
                            rows={4}
                          />
                        </div>
                        <Button
                          onClick={handleSubmitReview}
                          disabled={!reviewComment.trim()}
                        >
                          Submit Review
                        </Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Card */}
            <Card className="p-6">
              <h3 className="text-lg font-medium mb-4">Contact Teacher</h3>
              <div className="space-y-3">
                <Button
                  className="w-full justify-start"
                  onClick={() => handleRequestContact("phone")}
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Request Phone Number
                </Button>
                <Button
                  className="w-full justify-start"
                  variant="outline"
                  onClick={() => handleRequestContact("whatsapp")}
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Message on WhatsApp
                </Button>
              </div>
              <div className="mt-4 text-sm text-gray-500">
                <p>
                  Contact information will be shared after confirmation from the
                  teacher.
                </p>
              </div>
            </Card>

            {/* Report Card */}
            <Card className="p-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
                <div>
                  <h3 className="font-medium">Report this Teacher</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    If you find any inappropriate content or behavior, please
                    report it.
                  </p>
                  <Button
                    variant="ghost"
                    className="mt-2 text-red-600 hover:text-red-700 hover:bg-red-50 p-0 h-auto"
                    onClick={handleReport}
                  >
                    Report an Issue
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
