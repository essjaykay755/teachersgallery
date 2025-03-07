"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/contexts/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export default function StudentProfilePage() {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [studentProfile, setStudentProfile] = useState<any>(null);
  
  // Student profile form state
  const [grade, setGrade] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const [newInterest, setNewInterest] = useState("");
  
  useEffect(() => {
    setIsClient(true);
    
    // Load student profile
    if (user) {
      fetchStudentProfile();
    }
  }, [user]);
  
  const fetchStudentProfile = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      const supabase = createClientComponentClient();
      const { data, error } = await supabase
        .from("student_profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();
        
      if (error) {
        console.error("Error fetching student profile:", error);
      } else if (data) {
        setStudentProfile(data);
        setGrade(data.grade || "");
        setInterests(data.interests || []);
      }
    } catch (error) {
      console.error("Error fetching student profile:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const addInterest = () => {
    if (newInterest && !interests.includes(newInterest)) {
      setInterests([...interests, newInterest]);
      setNewInterest("");
    }
  };
  
  const removeInterest = (interest: string) => {
    setInterests(interests.filter((item) => item !== interest));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    try {
      setIsLoading(true);
      const supabase = createClientComponentClient();
      
      const updateData = {
        grade,
        interests,
      };
      
      if (studentProfile) {
        // Update existing profile
        const { error } = await supabase
          .from("student_profiles")
          .update(updateData)
          .eq("user_id", user.id);
          
        if (error) throw error;
      } else {
        // Create new profile
        const { error } = await supabase
          .from("student_profiles")
          .insert({
            user_id: user.id,
            ...updateData
          });
          
        if (error) throw error;
      }
      
      toast({
        title: "Success",
        description: "Student profile saved successfully!",
        variant: "default",
      });
      fetchStudentProfile(); // Refresh data
    } catch (error) {
      console.error("Error saving student profile:", error);
      toast({
        title: "Error",
        description: "Failed to save profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  if (!isClient) {
    return null;
  }
  
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Student Profile</h1>
      <Card>
        <CardHeader>
          <CardTitle>Student Profile</CardTitle>
          <CardDescription>
            Manage your student profile information that will be visible to teachers.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="grade">Current Grade/Class</Label>
                <Select value={grade} onValueChange={setGrade} required>
                  <SelectTrigger id="grade">
                    <SelectValue placeholder="Select your grade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1st Grade">1st Grade</SelectItem>
                    <SelectItem value="2nd Grade">2nd Grade</SelectItem>
                    <SelectItem value="3rd Grade">3rd Grade</SelectItem>
                    <SelectItem value="4th Grade">4th Grade</SelectItem>
                    <SelectItem value="5th Grade">5th Grade</SelectItem>
                    <SelectItem value="6th Grade">6th Grade</SelectItem>
                    <SelectItem value="7th Grade">7th Grade</SelectItem>
                    <SelectItem value="8th Grade">8th Grade</SelectItem>
                    <SelectItem value="9th Grade">9th Grade</SelectItem>
                    <SelectItem value="10th Grade">10th Grade</SelectItem>
                    <SelectItem value="11th Grade">11th Grade</SelectItem>
                    <SelectItem value="12th Grade">12th Grade</SelectItem>
                    <SelectItem value="College">College</SelectItem>
                    <SelectItem value="University">University</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Subjects of Interest</Label>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    value={newInterest}
                    onChange={(e) => setNewInterest(e.target.value)}
                    placeholder="Add a subject you're interested in"
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    onClick={addInterest}
                    size="sm"
                  >
                    <Plus className="h-4 w-4 mr-1" /> Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {interests.map((interest) => (
                    <Badge key={interest} variant="secondary" className="gap-1">
                      {interest}
                      <button
                        type="button"
                        onClick={() => removeInterest(interest)}
                        className="ml-1 text-muted-foreground hover:text-foreground rounded-full"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                  {interests.length === 0 && (
                    <p className="text-sm text-muted-foreground">
                      Add subjects you're interested in learning
                    </p>
                  )}
                </div>
              </div>
            </div>
            
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Profile"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 