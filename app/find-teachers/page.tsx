"use client";

import { useEffect, useState, useCallback } from "react";
import { fetchTeachers } from "@/lib/api";
import type { TeacherProfile } from "@/lib/supabase";
import type { PaginatedResponse } from "@/lib/types";
import TeacherCard from "@/components/teacher-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, ArrowDown, ArrowUp, Loader2 } from "lucide-react";
import debounce from "lodash.debounce";

export default function FindTeachersPage() {
  const [teachers, setTeachers] = useState<TeacherProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [totalTeachers, setTotalTeachers] = useState(0);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [sortField, setSortField] = useState<"rating" | "created_at">("rating");

  // Create a debounced search function
  const debouncedSearch = useCallback(
    debounce(() => {
      loadTeachers(true);
    }, 500),
    [searchQuery, locationFilter, subjectFilter, sortField, sortOrder]
  );

  useEffect(() => {
    debouncedSearch();
    // Cancel the debounce on useEffect cleanup.
    return () => {
      debouncedSearch.cancel();
    };
  }, [searchQuery, locationFilter, subjectFilter, sortField, sortOrder, debouncedSearch]);

  // Effect for pagination changes
  useEffect(() => {
    loadTeachers(false);
  }, [page]);

  async function loadTeachers(resetPage = false) {
    if (resetPage && page !== 1) {
      setPage(1);
      return; // The page change will trigger another load
    }

    setIsLoading(true);
    setError(null);

    try {
      const response: PaginatedResponse<TeacherProfile> = await fetchTeachers({
        page,
        limit: 9,
        subject: subjectFilter,
        location: locationFilter,
        searchQuery,
      });

      setTeachers(resetPage ? response.data : [...teachers, ...response.data]);
      setTotalTeachers(response.metadata.total);
      setHasMore(response.metadata.hasMore);
    } catch (err) {
      console.error("Error fetching teachers:", err);
      setError("Failed to load teachers. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  const handleLoadMore = () => {
    if (hasMore && !isLoading) {
      setPage(page + 1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Find Teachers</h1>
          <p className="mt-2 text-sm text-gray-600">
            Connect with experienced teachers in your area
          </p>
        </div>

        <div className="mt-8 bg-white shadow rounded-lg p-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div>
              <Label htmlFor="search">Search</Label>
              <div className="relative mt-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <Input
                  id="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by subject or tags"
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                placeholder="Filter by location"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                value={subjectFilter}
                onChange={(e) => setSubjectFilter(e.target.value)}
                placeholder="Filter by subject"
                className="mt-1"
              />
            </div>
          </div>
        </div>

        {error && (
          <div className="mt-8 bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
            {error}
          </div>
        )}

        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm text-gray-600">
              {isLoading && page === 1
                ? "Searching for teachers..."
                : `Found ${totalTeachers} teachers`}
            </p>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSortField(sortField === "rating" ? "created_at" : "rating")}
              >
                Sort by: {sortField === "rating" ? "Rating" : "Newest"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              >
                {sortOrder === "desc" ? <ArrowDown className="h-4 w-4" /> : <ArrowUp className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {teachers.map((teacher) => (
            <TeacherCard
              key={teacher.id}
              teacher={teacher}
              isLoading={false}
            />
          ))}
          
          {isLoading && page === 1 && (
            Array.from({ length: 6 }).map((_, index) => (
              <TeacherCard key={`skeleton-${index}`} isLoading={true} />
            ))
          )}
          
          {!isLoading && teachers.length === 0 && (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500">No teachers found matching your criteria</p>
            </div>
          )}
        </div>

        {hasMore && (
          <div className="mt-8 flex justify-center">
            <Button
              variant="outline"
              onClick={handleLoadMore}
              disabled={isLoading}
              className="w-full sm:w-auto"
            >
              {isLoading && page > 1 ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading...
                </>
              ) : (
                "Load More"
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
