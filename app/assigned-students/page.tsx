"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/contexts/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Mail, MessageSquare } from "lucide-react";
import { AvatarWithTypeIndicator } from "@/components/ui/avatar";

// Mock student data
const MOCK_STUDENTS = [
  {
    id: "1",
    name: "Rahul Sharma",
    email: "rahul.s@example.com",
    subject: "Mathematics",
    level: "High School",
    joined: "2023-11-12",
    status: "Active",
    avatar: "/default-avatar.png"
  },
  {
    id: "2",
    name: "Priya Patel",
    email: "priya.p@example.com",
    subject: "Physics",
    level: "College",
    joined: "2023-10-05",
    status: "Active",
    avatar: "/default-avatar.png"
  },
  {
    id: "3",
    name: "Ajay Kumar",
    email: "ajay.k@example.com",
    subject: "Mathematics",
    level: "Middle School",
    joined: "2023-12-01",
    status: "Inactive",
    avatar: "/default-avatar.png"
  },
  {
    id: "4",
    name: "Sneha Reddy",
    email: "sneha.r@example.com",
    subject: "Chemistry",
    level: "High School",
    joined: "2024-01-15",
    status: "Active",
    avatar: "/default-avatar.png"
  },
  {
    id: "5",
    name: "Vikram Singh",
    email: "vikram.s@example.com",
    subject: "Computer Science",
    level: "College",
    joined: "2024-02-08",
    status: "Active",
    avatar: "/default-avatar.png"
  }
];

export default function AssignedStudentsPage() {
  const { user, profile } = useAuth();
  const [isClient, setIsClient] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [students, setStudents] = useState(MOCK_STUDENTS);
  
  useEffect(() => {
    setIsClient(true);
    
    // In a real app, you would fetch the assigned students from the API
    // For now, we're using mock data
  }, [user]);

  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleMessageStudent = (studentId: string) => {
    // In a real app, this would open a messaging interface
    console.log(`Opening messaging for student ID: ${studentId}`);
    alert(`Message interface for student ${studentId} would open here`);
  };

  const handleEmailStudent = (email: string) => {
    // In a real app, this would open an email interface
    window.open(`mailto:${email}`);
  };

  if (!isClient) {
    return null;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Students Assigned</h1>
      <Card>
        <CardHeader>
          <CardTitle>Your Students</CardTitle>
          <CardDescription>
            View and manage students assigned to you for teaching.
          </CardDescription>
          <div className="mt-4">
            <Input
              type="search"
              placeholder="Search students by name, email or subject..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-md"
            />
          </div>
        </CardHeader>
        <CardContent>
          {filteredStudents.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No students found matching your search criteria.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-2">Name</th>
                    <th className="text-left py-3 px-2">Subject</th>
                    <th className="text-left py-3 px-2">Level</th>
                    <th className="text-left py-3 px-2">Joined</th>
                    <th className="text-left py-3 px-2">Status</th>
                    <th className="text-right py-3 px-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((student) => (
                    <tr key={student.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-2">
                        <div className="flex items-center gap-3">
                          <AvatarWithTypeIndicator
                            userType="student"
                            src={student.avatar}
                            size="sm"
                            alt={student.name}
                          />
                          <div>
                            <p className="font-medium">{student.name}</p>
                            <p className="text-xs text-gray-500">{student.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-2">{student.subject}</td>
                      <td className="py-3 px-2">{student.level}</td>
                      <td className="py-3 px-2">{new Date(student.joined).toLocaleDateString()}</td>
                      <td className="py-3 px-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          student.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {student.status}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleMessageStudent(student.id)}
                          >
                            <MessageSquare className="h-4 w-4 mr-1" />
                            Message
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleEmailStudent(student.email)}
                          >
                            <Mail className="h-4 w-4 mr-1" />
                            Email
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 