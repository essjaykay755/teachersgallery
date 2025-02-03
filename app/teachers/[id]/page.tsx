"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, MapPin, Star, Clock, Users, Award, CheckCircle, Phone, MessageSquare, Heart, Briefcase, GraduationCap, School } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import Navbar from "@/components/navbar"
import { Textarea } from "@/components/ui/textarea"

// Update mock teacher data
const teacher = {
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
      description: "Teaching IIT-JEE and NEET aspirants with focus on advanced mathematics."
    },
    {
      title: "Mathematics Faculty",
      institution: "Brilliant Tutorials",
      period: "2014 - 2018",
      description: "Conducted classes for high school students and competitive exam preparation."
    },
    {
      title: "Private Tutor",
      institution: "Self-employed",
      period: "2012 - 2014",
      description: "One-on-one tutoring for high school mathematics."
    }
  ],
  education: [
    {
      degree: "M.Sc. Mathematics",
      institution: "IIT Bombay",
      year: "2012"
    },
    {
      degree: "B.Sc. Mathematics",
      institution: "St. Xavier's College",
      year: "2010"
    }
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
      comment: "Excellent teacher! Her teaching methodology helped me understand complex concepts easily.",
    },
    {
      id: 2,
      student: "Priya Patel",
      avatar: "/avatars/avatar4.jpg",
      rating: 4,
      date: "1 month ago",
      comment: "Very patient and thorough with explanations. Helped me improve my grades significantly.",
    },
    {
      id: 3,
      student: "Amit Shah",
      avatar: "/avatars/avatar5.jpg",
      rating: 5,
      date: "2 months ago",
      comment: "Great at explaining difficult topics. Always punctual and well-prepared for classes.",
    }
  ]
}

export default function TeacherProfile() {
  const [activeTab, setActiveTab] = useState("about")
  const [isFavorite, setIsFavorite] = useState(false)
  const [reviewRating, setReviewRating] = useState(5)
  const [reviewComment, setReviewComment] = useState("")
  const router = useRouter()

  const calculateTotalExperience = () => {
    const currentYear = new Date().getFullYear()
    const startYear = Math.min(...teacher.experience.map(exp => {
      const startYear = exp.period.split(" - ")[0]
      return parseInt(startYear)
    }))
    return `${currentYear - startYear}+ years`
  }

  const handleRequestContact = (type: 'phone' | 'whatsapp') => {
    // Add logic to request contact
    console.log(`Requesting ${type} number...`)
  }

  const handleSubmitReview = () => {
    // Add logic to submit review
    console.log({ rating: reviewRating, comment: reviewComment })
    setReviewComment("")
  }

  const renderStars = (rating: number, interactive: boolean = false) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            className={`${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-transform`}
            onClick={() => interactive && setReviewRating(star)}
            type={interactive ? "button" : undefined}
          >
            <Star
              className={`h-5 w-5 ${
                star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
              }`}
            />
          </button>
        ))}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Back Button and Main Content */}
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
                      src={`/avatars/avatar${teacher.avatarIndex}.jpg`}
                      alt={teacher.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`absolute -bottom-3 -right-3 h-9 w-9 rounded-full bg-white shadow-md border ${
                      isFavorite ? 'text-red-500 hover:text-red-600' : 'text-gray-400 hover:text-gray-500'
                    }`}
                    onClick={() => setIsFavorite(!isFavorite)}
                  >
                    <Heart className="h-5 w-5" fill={isFavorite ? "currentColor" : "none"} />
                  </Button>
                </div>
                <div className="flex-grow w-full">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h1 className="text-2xl font-semibold">{teacher.name}</h1>
                        {teacher.isVerified && (
                          <div className="flex items-center gap-1 px-2 py-1 bg-green-50 text-green-600 rounded-full text-xs font-medium">
                            <CheckCircle className="h-3.5 w-3.5" />
                            <span>Verified</span>
                          </div>
                        )}
                        {teacher.isFeatured && (
                          <div className="flex items-center gap-1 px-2 py-1 bg-yellow-50 text-yellow-700 rounded-full text-xs font-medium">
                            <Star className="h-3.5 w-3.5 fill-yellow-400 stroke-yellow-400" />
                            <span>Featured</span>
                          </div>
                        )}
                      </div>
                      <p className="text-gray-600">{teacher.subject} Teacher</p>
                      <div className="flex items-center gap-2 text-gray-500 mt-2">
                        <MapPin className="h-4 w-4" />
                        <span>{teacher.location}</span>
                      </div>
                    </div>
                    <div className="mt-2 sm:mt-0 sm:text-right">
                      <div className="text-2xl font-semibold text-blue-600">{teacher.fee}</div>
                      <div className="text-sm text-gray-500">per hour</div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-4 mt-4">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-400" />
                      <span className="font-medium">{teacher.rating}</span>
                      <span className="text-gray-500">({teacher.reviewsCount} reviews)</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-600">
                      <Clock className="h-4 w-4" />
                      <span>{calculateTotalExperience()}</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-600">
                      <Users className="h-4 w-4" />
                      <span>{teacher.students}+ students</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {teacher.tags.map((tag) => (
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
                      <h3 className="font-medium mb-2">About Me</h3>
                      <p className="text-gray-600 whitespace-pre-line">{teacher.about}</p>
                    </div>
                    <div>
                      <h3 className="font-medium mb-2">Achievements</h3>
                      <ul className="space-y-2">
                        {teacher.achievements.map((achievement) => (
                          <li key={achievement} className="flex items-start gap-2">
                            <Award className="h-5 w-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-600">{achievement}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-medium mb-2">Subjects</h3>
                      <div className="flex flex-wrap gap-2">
                        {teacher.subjects.map((subject) => (
                          <span
                            key={subject}
                            className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-sm"
                          >
                            {subject}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="experience" className="p-6">
                  <div className="space-y-8">
                    {/* Verification Status */}
                    <div className="flex items-center gap-4 p-4 bg-green-50 rounded-lg">
                      <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                        <CheckCircle className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">Verified Teacher</h4>
                        <p className="text-sm text-gray-600">
                          Background and credentials verified by TeachersGallery
                        </p>
                      </div>
                    </div>

                    {/* Education */}
                    <div>
                      <h3 className="font-medium mb-4 flex items-center gap-2">
                        <GraduationCap className="h-5 w-5" />
                        Education
                      </h3>
                      <div className="space-y-4">
                        {teacher.education.map((edu, index) => (
                          <div key={index} className="flex items-start gap-3">
                            <div className="h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                              <School className="h-4 w-4 text-blue-500" />
                            </div>
                            <div>
                              <h4 className="font-medium">{edu.degree}</h4>
                              <p className="text-sm text-gray-600">{edu.institution}</p>
                              <p className="text-sm text-gray-500">{edu.year}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Work Experience */}
                    <div>
                      <h3 className="font-medium mb-4 flex items-center gap-2">
                        <Briefcase className="h-5 w-5" />
                        Teaching Experience
                      </h3>
                      <div className="space-y-6">
                        {teacher.experience.map((exp, index) => (
                          <div key={index} className="relative pl-6 pb-6 last:pb-0">
                            {index !== teacher.experience.length - 1 && (
                              <div className="absolute left-[11px] top-3 bottom-0 w-[2px] bg-gray-200" />
                            )}
                            <div className="flex items-start gap-4">
                              <div className="absolute left-0 top-[10px] h-[10px] w-[10px] rounded-full bg-blue-500 ring-4 ring-blue-50" />
                              <div className="flex-grow pt-1">
                                <h4 className="font-medium">{exp.title}</h4>
                                <p className="text-sm text-gray-600">{exp.institution}</p>
                                <p className="text-sm text-gray-500 mt-1">{exp.period}</p>
                                <p className="text-sm text-gray-600 mt-2">{exp.description}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="reviews" className="p-6">
                  <div className="space-y-8">
                    {/* Review Summary */}
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-3xl font-bold">{teacher.rating}</span>
                          {renderStars(teacher.rating)}
                        </div>
                        <p className="text-sm text-gray-500 mt-1">Based on {teacher.reviewsCount} reviews</p>
                      </div>
                      <Button onClick={() => document.getElementById('write-review')?.focus()}>
                        Write a Review
                      </Button>
                    </div>

                    {/* Review List */}
                    <div className="space-y-6">
                      {teacher.reviews.map((review) => (
                        <div key={review.id} className="border-b pb-6 last:border-0">
                          <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                              <Image
                                src={review.avatar}
                                alt={review.student}
                                width={40}
                                height={40}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-grow">
                              <div className="flex items-center justify-between">
                                <h4 className="font-medium">{review.student}</h4>
                                <span className="text-sm text-gray-500">{review.date}</span>
                              </div>
                              {renderStars(review.rating)}
                              <p className="text-gray-600 mt-2">{review.comment}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Write Review */}
                    <div className="border-t pt-6">
                      <h3 className="font-medium mb-4">Write a Review</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Rating</label>
                          {renderStars(reviewRating, true)}
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Your Review</label>
                          <Textarea
                            id="write-review"
                            placeholder="Share your experience with this teacher..."
                            value={reviewComment}
                            onChange={(e) => setReviewComment(e.target.value)}
                            className="min-h-[100px]"
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
            <Card className="p-6 space-y-4 sticky top-8">
              <h3 className="font-medium">Contact {teacher.name.split(" ")[0]}</h3>
              <Button 
                variant="outline" 
                className="w-full flex items-center justify-center gap-2"
                onClick={() => handleRequestContact('phone')}
              >
                <Phone className="h-4 w-4" />
                Request Phone Number
              </Button>
              <Button 
                variant="outline" 
                className="w-full flex items-center justify-center gap-2"
                onClick={() => handleRequestContact('whatsapp')}
              >
                <MessageSquare className="h-4 w-4" />
                Request WhatsApp
              </Button>
              <Button className="w-full">
                Send Message
              </Button>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
} 