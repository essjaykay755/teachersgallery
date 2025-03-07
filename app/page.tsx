"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import TeacherCard from "@/components/teacher-card";
import {
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  SlidersHorizontal,
  X,
  Loader2,
} from "lucide-react";
import { AnimatedContainer, slideRight } from "@/components/ui/animations";
import { fetchTeachers } from "@/lib/api";
import type { TeacherProfile } from "@/lib/supabase";
import type { PaginatedResponse } from "@/lib/types";

// Fallback to dummy data only if no real data is available
import { dummyTeachers } from "@/app/mock-data";

export default function Home() {
  const [feeRange, setFeeRange] = useState([500, 5000]);
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 5; // This will be updated when using real pagination

  // New state for real teacher data
  const [teachers, setTeachers] = useState<TeacherProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalTeachers, setTotalTeachers] = useState(0);
  const [sortField, setSortField] = useState<"rating" | "created_at">("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Fetch teachers on component mount or when sort/page changes
  useEffect(() => {
    fetchRealTeachers();
  }, [currentPage, sortField, sortOrder]);

  // Function to fetch real teacher data
  async function fetchRealTeachers() {
    setIsLoading(true);
    setError(null);

    try {
      const response: PaginatedResponse<TeacherProfile> = await fetchTeachers({
        page: currentPage,
        limit: 6, // Show 6 teachers on the home page (2 rows of 3)
        sortField,
        sortOrder,
      });

      setTeachers(response.data);
      setTotalTeachers(response.metadata.total);
    } catch (err) {
      console.error("Error fetching teachers:", err);
      setError("Failed to load teachers. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  // Handle sort change
  const handleSortChange = (value: string) => {
    if (value === "latest") {
      setSortField("created_at");
      setSortOrder("desc");
    } else if (value === "oldest") {
      setSortField("created_at");
      setSortOrder("asc");
    } else if (value === "rating") {
      setSortField("rating");
      setSortOrder("desc");
    }
  };

  const FiltersContent = () => (
    <div className="space-y-6">
      {/* Subject Filter */}
      <div className="space-y-4">
        <h3 className="font-medium">Subject</h3>
        <Select defaultValue="all">
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select subject" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Subjects</SelectItem>
            <SelectItem value="math">Mathematics</SelectItem>
            <SelectItem value="physics">Physics</SelectItem>
            <SelectItem value="chemistry">Chemistry</SelectItem>
            <SelectItem value="english">English</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Location Filter */}
      <div className="space-y-4">
        <h3 className="font-medium">Location</h3>
        <Select defaultValue="all">
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select location" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Locations</SelectItem>
            <SelectItem value="mumbai">Mumbai</SelectItem>
            <SelectItem value="delhi">Delhi</SelectItem>
            <SelectItem value="bangalore">Bangalore</SelectItem>
            <SelectItem value="kolkata">Kolkata</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Fee Range Filter */}
      <div>
        <h3 className="font-medium mb-4">Fee Range (₹/hr)</h3>
        <div className="px-2">
          <Slider
            defaultValue={[500, 5000]}
            min={500}
            max={5000}
            step={100}
            value={feeRange}
            onValueChange={setFeeRange}
            className="my-4"
          />
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>₹{feeRange[0]}</span>
            <span>₹{feeRange[1]}</span>
          </div>
        </div>
      </div>

      {/* Experience Filter */}
      <div className="space-y-4">
        <h3 className="font-medium">Experience</h3>
        <Select defaultValue="all">
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select experience" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any Experience</SelectItem>
            <SelectItem value="1-5">1-5 years</SelectItem>
            <SelectItem value="5-10">5-10 years</SelectItem>
            <SelectItem value="10+">10+ years</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Teaching Mode */}
      <div className="space-y-4">
        <h3 className="font-medium">Teaching Mode</h3>
        <div className="space-y-2">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              className="rounded border-gray-300"
              defaultChecked
            />
            <span>Online</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              className="rounded border-gray-300"
              defaultChecked
            />
            <span>Offline</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" className="rounded border-gray-300" />
            <span>Hybrid</span>
          </label>
        </div>
      </div>

      {/* Availability */}
      <div className="space-y-4">
        <h3 className="font-medium">Availability</h3>
        <div className="space-y-2">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              className="rounded border-gray-300"
              defaultChecked
            />
            <span>Weekdays</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              className="rounded border-gray-300"
              defaultChecked
            />
            <span>Weekends</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" className="rounded border-gray-300" />
            <span>Evening</span>
          </label>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-[#111111] py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="rounded-3xl p-8 relative">
              <div className="relative z-10 text-center">
                <div className="inline-flex items-center justify-center p-2 bg-blue-500/10 rounded-full mb-4">
                  <GraduationCap className="w-5 h-5 text-blue-400" />
                </div>
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3 leading-tight">
                  Get your best teacher with{" "}
                  <span className="text-blue-400">TeachersGallery</span>
                </h1>
                <p className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto">
                  Find the perfect teacher for your learning journey. Choose
                  from our curated selection of experienced educators.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Filter Button */}
      <div className="lg:hidden sticky top-0 z-30 bg-white border-b">
        <div className="container mx-auto px-4 py-3">
          <Button
            variant="outline"
            className="w-full flex items-center justify-center gap-2"
            onClick={() => setShowFilters(true)}
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-64 space-y-6">
            <FiltersContent />
          </aside>

          {/* Mobile/Tablet Filter Sidebar */}
          {showFilters && (
            <div className="fixed inset-0 bg-black/50 z-40 lg:hidden">
              <AnimatedContainer
                animation={slideRight}
                className="fixed inset-y-0 right-0 w-full max-w-sm bg-white shadow-lg"
              >
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between p-4 border-b">
                    <h2 className="text-lg font-semibold">Filters</h2>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowFilters(false)}
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                  <div className="flex-1 overflow-y-auto p-4">
                    <FiltersContent />
                  </div>
                  <div className="p-4 border-t">
                    <Button
                      className="w-full"
                      onClick={() => setShowFilters(false)}
                    >
                      Apply Filters
                    </Button>
                  </div>
                </div>
              </AnimatedContainer>
            </div>
          )}

          {/* Teachers List */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-semibold">All Teachers</h2>
                <span className="rounded-full bg-gray-100 px-3 py-0.5 text-sm">
                  {totalTeachers || 0}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Sort by:</span>
                <Select 
                  defaultValue="latest" 
                  onValueChange={handleSortChange}
                >
                  <SelectTrigger className="w-[180px] border-gray-200">
                    <SelectValue placeholder="Last updated" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="latest">Newest first</SelectItem>
                    <SelectItem value="oldest">Oldest first</SelectItem>
                    <SelectItem value="rating">Highest rated</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Teachers Grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {isLoading ? (
                // Show skeletons while loading
                Array.from({ length: 6 }).map((_, index) => (
                  <TeacherCard key={`skeleton-${index}`} isLoading={true} />
                ))
              ) : error ? (
                // Show error message
                <div className="col-span-full bg-red-50 p-6 text-center rounded-lg border border-red-200">
                  <p className="text-red-600 mb-4">{error}</p>
                  <Button 
                    variant="outline" 
                    onClick={() => fetchRealTeachers()}
                  >
                    Try Again
                  </Button>
                </div>
              ) : teachers.length > 0 ? (
                // Show real teachers from database
                teachers.map((teacher) => (
                  <TeacherCard key={teacher.id} teacher={teacher} />
                ))
              ) : (
                // Fallback to dummy teachers if no real data available
                dummyTeachers.map((teacher) => {
                  // Extract experience from tags (e.g., "10+ years" -> "10+")
                  const experienceTag = teacher.tags.find(tag => tag.includes('years'));
                  const experience = experienceTag ? experienceTag.split(' ')[0] : 'New';
                  
                  const transformedTeacher = {
                    ...teacher,
                    avatarUrl: `/avatars/avatar${teacher.avatarIndex}.jpg`,
                    is_verified: teacher.isVerified,
                    subject: [teacher.subject],
                    experience: experience
                  };
                  
                  return (
                    <TeacherCard key={teacher.id} teacher={transformedTeacher} />
                  );
                })
              )}
            </div>

            {/* Pagination */}
            <div className="mt-8 flex items-center justify-center gap-3">
              <Button
                variant="outline"
                size="default"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1 || isLoading}
                className="flex items-center gap-2 h-10 px-4 transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>

              {/* Page numbers */}
              <div className="flex items-center gap-2">
                {Array.from({ length: Math.max(1, Math.ceil(totalTeachers / 6)) }, (_, i) => i + 1)
                  .filter((page) => {
                    return (
                      page === 1 ||
                      page === Math.ceil(totalTeachers / 6) ||
                      Math.abs(currentPage - page) <= 1
                    );
                  })
                  .map((page, index, array) => (
                    <React.Fragment key={page}>
                      {index > 0 && array[index - 1] !== page - 1 && (
                        <span className="px-2 text-gray-400">...</span>
                      )}
                      <Button
                        variant={currentPage === page ? "default" : "outline"}
                        size="default"
                        onClick={() => setCurrentPage(page)}
                        disabled={isLoading}
                        className="h-10 min-w-[40px] transition-colors"
                      >
                        {page}
                      </Button>
                    </React.Fragment>
                  ))}
              </div>

              <Button
                variant="outline"
                size="default"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage >= Math.ceil(totalTeachers / 6) || isLoading}
                className="flex items-center gap-2 h-10 px-4 transition-colors"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <>
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
