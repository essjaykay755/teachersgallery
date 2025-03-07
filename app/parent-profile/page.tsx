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

export default function ParentProfilePage() {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [parentProfile, setParentProfile] = useState<any>(null);
  
  // Parent profile form state
  const [childrenCount, setChildrenCount] = useState("1");
  const [childrenGrades, setChildrenGrades] = useState<string[]>([]);
  const [newChildGrade, setNewChildGrade] = useState("");
  
  useEffect(() => {
    setIsClient(true);
    
    // Load parent profile
    if (user) {
      fetchParentProfile();
    }
  }, [user]);
  
  const fetchParentProfile = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      const supabase = createClientComponentClient();
      const { data, error } = await supabase
        .from("parent_profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();
        
      if (error) {
        console.error("Error fetching parent profile:", error);
      } else if (data) {
        setParentProfile(data);
        setChildrenCount(data.children_count?.toString() || "1");
        setChildrenGrades(data.children_grades || []);
      }
    } catch (error) {
      console.error("Error fetching parent profile:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const addChildGrade = () => {
    if (newChildGrade && !childrenGrades.includes(newChildGrade)) {
      setChildrenGrades([...childrenGrades, newChildGrade]);
      setNewChildGrade("");
    }
  };
  
  const removeChildGrade = (grade: string) => {
    setChildrenGrades(childrenGrades.filter((item) => item !== grade));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    try {
      setIsLoading(true);
      const supabase = createClientComponentClient();
      
      const updateData = {
        children_count: parseInt(childrenCount),
        children_grades: childrenGrades,
      };
      
      if (parentProfile) {
        // Update existing profile
        const { error } = await supabase
          .from("parent_profiles")
          .update(updateData)
          .eq("user_id", user.id);
          
        if (error) throw error;
      } else {
        // Create new profile
        const { error } = await supabase
          .from("parent_profiles")
          .insert({
            user_id: user.id,
            ...updateData
          });
          
        if (error) throw error;
      }
      
      toast({
        title: "Success",
        description: "Parent profile saved successfully!",
        variant: "default",
      });
      fetchParentProfile(); // Refresh data
    } catch (error) {
      console.error("Error saving parent profile:", error);
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
      <h1 className="text-2xl font-bold mb-6">Parent Profile</h1>
      <Card>
        <CardHeader>
          <CardTitle>Parent Profile</CardTitle>
          <CardDescription>
            Manage your parent profile information that will be visible to teachers.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="childrenCount">Number of Children</Label>
                <Select 
                  value={childrenCount} 
                  onValueChange={setChildrenCount}
                >
                  <SelectTrigger id="childrenCount">
                    <SelectValue placeholder="Select number of children" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1</SelectItem>
                    <SelectItem value="2">2</SelectItem>
                    <SelectItem value="3">3</SelectItem>
                    <SelectItem value="4">4</SelectItem>
                    <SelectItem value="5">5+</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Children's Grades</Label>
                <div className="flex gap-2">
                  <Select 
                    value={newChildGrade} 
                    onValueChange={setNewChildGrade}
                  >
                    <SelectTrigger id="newChildGrade">
                      <SelectValue placeholder="Select a grade" />
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
                    </SelectContent>
                  </Select>
                  <Button
                    type="button"
                    onClick={addChildGrade}
                    disabled={!newChildGrade}
                  >
                    <Plus className="h-4 w-4 mr-1" /> Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {childrenGrades.map((grade) => (
                    <Badge key={grade} variant="secondary" className="gap-1">
                      {grade}
                      <button
                        type="button"
                        onClick={() => removeChildGrade(grade)}
                        className="ml-1 text-muted-foreground hover:text-foreground rounded-full"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                  {childrenGrades.length === 0 && (
                    <p className="text-sm text-muted-foreground">
                      Add your children's grades to help find suitable teachers
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