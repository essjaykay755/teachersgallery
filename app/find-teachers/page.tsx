"use client";

import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import type { TeacherProfile } from "@/lib/supabase";

export default function FindTeachersPage() {
  const [teachers, setTeachers] = useState<TeacherProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("");
  const supabase = createClientComponentClient();

  useEffect(() => {
    loadTeachers();
  }, [searchQuery, locationFilter, subjectFilter]);

  async function loadTeachers() {
    setIsLoading(true);
    try {
      let query = supabase
        .from("teacher_profiles")
        .select(
          `
          *,
          profiles!user_id (
            full_name,
            email,
            avatar_url
          )
        `
        )
        .eq("is_verified", true)
        .order("rating", { ascending: false });

      if (locationFilter) {
        query = query.ilike("location", `%${locationFilter}%`);
      }

      if (subjectFilter) {
        query = query.contains("subject", [subjectFilter]);
      }

      if (searchQuery) {
        query = query.or(
          `subject.cs.{${searchQuery}},about.ilike.%${searchQuery}%,tags.cs.{${searchQuery}}`
        );
      }

      const { data } = await query;
      setTeachers(data || []);
    } catch (error) {
      console.error("Error loading teachers:", error);
    } finally {
      setIsLoading(false);
    }
  }

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
              <label
                htmlFor="search"
                className="block text-sm font-medium text-gray-700"
              >
                Search
              </label>
              <input
                type="text"
                id="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by subject, description, or tags"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="location"
                className="block text-sm font-medium text-gray-700"
              >
                Location
              </label>
              <input
                type="text"
                id="location"
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                placeholder="Filter by location"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="subject"
                className="block text-sm font-medium text-gray-700"
              >
                Subject
              </label>
              <input
                type="text"
                id="subject"
                value={subjectFilter}
                onChange={(e) => setSubjectFilter(e.target.value)}
                placeholder="Filter by subject"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {isLoading ? (
            <p className="text-center col-span-full text-gray-500">
              Loading...
            </p>
          ) : teachers.length > 0 ? (
            teachers.map((teacher) => (
              <div
                key={teacher.id}
                className="bg-white shadow rounded-lg overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-center">
                    <img
                      className="h-12 w-12 rounded-full"
                      src={teacher.profiles?.avatar_url || "/avatar.jpg"}
                      alt=""
                    />
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">
                        {teacher.profiles?.full_name}
                      </h3>
                      <div className="flex items-center mt-1">
                        {teacher.rating && (
                          <div className="flex items-center">
                            <span className="text-sm text-gray-600">
                              {teacher.rating}/5
                            </span>
                            <span className="mx-1 text-gray-500">·</span>
                            <span className="text-sm text-gray-600">
                              {teacher.reviews_count} reviews
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="flex flex-wrap gap-2">
                      {teacher.subject.map((subject) => (
                        <span
                          key={subject}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                        >
                          {subject}
                        </span>
                      ))}
                    </div>
                    <p className="mt-2 text-sm text-gray-600">
                      {teacher.location}
                    </p>
                    <p className="mt-1 text-sm text-gray-600">{teacher.fee}</p>
                    <p className="mt-4 text-sm text-gray-600 line-clamp-3">
                      {teacher.about}
                    </p>
                  </div>

                  <div className="mt-6">
                    <button className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                      Contact Teacher
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center col-span-full text-gray-500">
              No teachers found matching your criteria
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
