"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/contexts/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Mail, MessageSquare, Calendar, Star, ExternalLink } from "lucide-react";
import Link from "next/link";
import { AvatarWithTypeIndicator } from "@/components/ui/avatar";

// Mock teacher data
const MOCK_TEACHERS = [
  {
    id: "1",
    name: "Ankit Patel",
    email: "ankit.p@example.com",
    subject: "Mathematics",
    experience: "10+ years",
    rating: 4.8,
    avatar: "/default-avatar.png"
  },
  {
    id: "2",
    name: "Sunita Sharma",
    email: "sunita.s@example.com",
    subject: "Physics",
    experience: "8 years",
    rating: 4.5,
    avatar: "/default-avatar.png"
  },
  {
    id: "3",
    name: "Rajesh Kumar",
    email: "rajesh.k@example.com",
    subject: "Chemistry",
    experience: "15 years",
    rating: 4.9,
    avatar: "/default-avatar.png"
  },
  {
    id: "4",
    name: "Priya Singh",
    email: "priya.s@example.com",
    subject: "Biology",
    experience: "6 years",
    rating: 4.3,
    avatar: "/default-avatar.png"
  },
  {
    id: "5",
    name: "Vikram Joshi",
    email: "vikram.j@example.com",
    subject: "Computer Science",
    experience: "12 years",
    rating: 4.7,
    avatar: "/default-avatar.png"
  }
];

export default function AssignedTeachersPage() {
  const { user, profile } = useAuth();
  const [isClient, setIsClient] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [teachers, setTeachers] = useState(MOCK_TEACHERS);
  
  useEffect(() => {
    setIsClient(true);
    
    // In a real app, you would fetch the assigned teachers from the API
    // For now, we're using mock data
  }, [user]);

  const filteredTeachers = teachers.filter(teacher => 
    teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    teacher.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    teacher.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleMessageTeacher = (teacherId: string) => {
    // In a real app, this would open a messaging interface
    console.log(`Opening messaging for teacher ID: ${teacherId}`);
    alert(`Message interface for teacher ${teacherId} would open here`);
  };

  const handleScheduleSession = (teacherId: string) => {
    // In a real app, this would open a scheduling interface
    console.log(`Scheduling session with teacher ID: ${teacherId}`);
    alert(`Scheduling interface for teacher ${teacherId} would open here`);
  };

  const handleEmailTeacher = (email: string) => {
    // In a real app, this would open an email interface
    window.open(`mailto:${email}`);
  };

  if (!isClient) {
    return null;
  }

  const userTypeDescription = profile?.user_type === "student" 
    ? "your learning journey" 
    : "your children's education";

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Assigned Teachers</h1>
      <Card>
        <CardHeader>
          <CardTitle>Your Teachers</CardTitle>
          <CardDescription>
            View and manage teachers assigned to help with {userTypeDescription}.
          </CardDescription>
          <div className="mt-4">
            <Input
              type="search"
              placeholder="Search teachers by name, email or subject..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-md"
            />
          </div>
        </CardHeader>
        <CardContent>
          {filteredTeachers.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No teachers found matching your search criteria.</p>
              <Button asChild className="mt-4">
                <Link href="/find-teachers">Find Teachers</Link>
              </Button>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {filteredTeachers.map((teacher) => (
                <Card key={teacher.id} className="overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-start gap-4">
                      <AvatarWithTypeIndicator
                        userType="teacher"
                        src={teacher.avatar}
                        size="lg"
                        alt={teacher.name}
                      />
                      <div>
                        <h3 className="text-lg font-semibold">{teacher.name}</h3>
                        <p className="text-sm text-gray-500">{teacher.subject} Teacher</p>
                        <div className="flex items-center gap-1 mt-1">
                          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                          <span className="text-sm">{teacher.rating} • {teacher.experience}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex flex-wrap gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleMessageTeacher(teacher.id)}
                      >
                        <MessageSquare className="h-4 w-4 mr-1" />
                        Message
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleScheduleSession(teacher.id)}
                      >
                        <Calendar className="h-4 w-4 mr-1" />
                        Schedule
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleEmailTeacher(teacher.email)}
                      >
                        <Mail className="h-4 w-4 mr-1" />
                        Email
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        asChild
                      >
                        <Link href={`/teachers/${teacher.id}`}>
                          <ExternalLink className="h-4 w-4 mr-1" />
                          View Profile
                        </Link>
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 