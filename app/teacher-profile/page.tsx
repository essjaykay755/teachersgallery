"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/contexts/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import type { TeacherProfile } from "@/lib/supabase";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

export default function TeacherProfilePage() {
  const { user, profile, refreshProfile } = useAuth();
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [teacherProfile, setTeacherProfile] = useState<TeacherProfile | null>(null);
  
  // Teacher profile form state
  const [teacherFormData, setTeacherFormData] = useState({
    subject: [] as string[],
    location: "",
    fee: "",
    about: "",
    tags: [] as string[],
    is_listed: true,
    newSubject: "",
    newTag: "",
    // New fields
    qualifications: [] as string[],
    newQualification: "",
    years_experience: "",
    teaching_style: "",
    availability: [] as string[],
    newAvailability: "",
    teaching_format: "both", // online, in-person, both
    education: "",
    gender: (profile?.gender || "male") as "male" | "female"
  });

  // Add debug logging for profile data
  useEffect(() => {
    console.log("TeacherProfilePage: Profile data:", {
      hasProfile: !!profile,
      userType: profile?.user_type,
      userId: user?.id,
      fullProfile: profile
    });

    // If profile exists but user type is not teacher, attempt to fix it
    if (profile && profile.user_type !== "teacher") {
      verifyAndFixUserType();
    }
  }, [profile, user]);

  useEffect(() => {
    setIsClient(true);
    
    // Load teacher profile
    if (user) {
      fetchTeacherProfile();
    }
  }, [user]);

  const fetchTeacherProfile = async () => {
    if (!user) return;
    
    try {
      console.log("TeacherProfilePage: Fetching teacher profile for user:", user.id);
      const supabase = createClientComponentClient();
      const { data, error } = await supabase
        .from("teacher_profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();
        
      if (error) {
        console.error("Error fetching teacher profile:", error);
      } else if (data) {
        console.log("TeacherProfilePage: Teacher profile loaded:", data);
        setTeacherProfile(data);
        // Populate form data with existing profile data
        setTeacherFormData({
          ...teacherFormData,
          subject: data.subjects ? Array.isArray(data.subjects) ? data.subjects : [data.subjects] : [],
          location: data.location || "",
          fee: data.fee || "",
          about: data.about || "",
          tags: data.tags ? Array.isArray(data.tags) ? data.tags : [data.tags] : [],
          is_listed: data.is_listed !== undefined ? data.is_listed : true,
          // New fields
          qualifications: data.qualifications ? Array.isArray(data.qualifications) ? data.qualifications : [data.qualifications] : [],
          years_experience: data.years_experience || "",
          teaching_style: data.teaching_style || "",
          availability: data.availability ? Array.isArray(data.availability) ? data.availability : [data.availability] : [],
          teaching_format: data.teaching_format || "both",
          education: data.education || "",
          gender: data.gender || "male"
        });
      } else {
        console.log("TeacherProfilePage: No existing teacher profile found");
      }
    } catch (error) {
      console.error("Error fetching teacher profile:", error);
    }
  };

  const handleAddSubject = () => {
    if (teacherFormData.newSubject.trim() !== "" && !teacherFormData.subject.includes(teacherFormData.newSubject.trim())) {
      setTeacherFormData({
        ...teacherFormData,
        subject: [...teacherFormData.subject, teacherFormData.newSubject.trim()],
        newSubject: "",
      });
    }
  };

  const handleRemoveSubject = (subject: string) => {
    setTeacherFormData({
      ...teacherFormData,
      subject: teacherFormData.subject.filter((s) => s !== subject),
    });
  };

  const handleAddTag = () => {
    if (teacherFormData.newTag.trim() !== "" && !teacherFormData.tags.includes(teacherFormData.newTag.trim())) {
      setTeacherFormData({
        ...teacherFormData,
        tags: [...teacherFormData.tags, teacherFormData.newTag.trim()],
        newTag: "",
      });
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTeacherFormData({
      ...teacherFormData,
      tags: teacherFormData.tags.filter((t) => t !== tag),
    });
  };

  // New handlers for qualifications and availability
  const handleAddQualification = () => {
    if (teacherFormData.newQualification.trim() !== "" && !teacherFormData.qualifications.includes(teacherFormData.newQualification.trim())) {
      setTeacherFormData({
        ...teacherFormData,
        qualifications: [...teacherFormData.qualifications, teacherFormData.newQualification.trim()],
        newQualification: "",
      });
    }
  };

  const handleRemoveQualification = (qualification: string) => {
    setTeacherFormData({
      ...teacherFormData,
      qualifications: teacherFormData.qualifications.filter((q) => q !== qualification),
    });
  };

  const handleAddAvailability = () => {
    if (teacherFormData.newAvailability.trim() !== "" && !teacherFormData.availability.includes(teacherFormData.newAvailability.trim())) {
      setTeacherFormData({
        ...teacherFormData,
        availability: [...teacherFormData.availability, teacherFormData.newAvailability.trim()],
        newAvailability: "",
      });
    }
  };

  const handleRemoveAvailability = (time: string) => {
    setTeacherFormData({
      ...teacherFormData,
      availability: teacherFormData.availability.filter((a) => a !== time),
    });
  };

  const handleSaveProfile = async () => {
    if (!user) {
      console.error("Cannot save profile: No user logged in");
      toast({
        title: "Error",
        description: "You must be logged in to save your profile",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    // Add a timeout to prevent infinite loading
    const saveTimeout = setTimeout(() => {
      if (isLoading) {
        setIsLoading(false);
        toast({
          title: "Timeout",
          description: "Profile save operation timed out. Please try again or contact support.",
          variant: "destructive",
        });
      }
    }, 15000); // 15 second timeout
    
    try {
      const supabase = createClientComponentClient();
      console.log("Updating profile with gender:", teacherFormData.gender);

      // First try to update the gender in the main profile table
      try {
        const { error: profileError } = await supabase
          .from("profiles")
          .update({ 
            gender: teacherFormData.gender,
            // Only include updated_at if it doesn't cause errors
            updated_at: new Date().toISOString()
          })
          .eq("id", user.id);
          
        if (profileError) {
          console.error("Error updating profile gender:", profileError);
          // If the error is about the updated_at column, try again without it
          if (profileError.message.includes("updated_at") || profileError.message.includes("column")) {
            const { error: retryError } = await supabase
              .from("profiles")
              .update({ gender: teacherFormData.gender })
              .eq("id", user.id);
              
            if (retryError) {
              console.error("Error on retry update profile gender:", retryError);
              toast({
                title: "Warning",
                description: "Could not update gender preference. Other changes will be saved.",
                variant: "default",
              });
            } else {
              console.log("Gender updated successfully on retry");
            }
          } else {
            toast({
              title: "Warning",
              description: "Could not update gender preference. Other changes will be saved.",
              variant: "default",
            });
          }
        } else {
          console.log("Gender updated successfully");
        }
      } catch (genderError) {
        console.error("Failed to update gender, continuing with rest of profile:", genderError);
        // Notify the user but continue
        toast({
          title: "Warning",
          description: "Could not update gender preference. Other changes will be saved.",
          variant: "default",
        });
      }

      // Check if the teacher profile exists
      const { data: existingProfile, error: checkError } = await supabase
        .from("teacher_profiles")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (checkError && checkError.code !== "PGRST116") {
        console.error("Error checking for existing profile:", checkError);
        toast({
          title: "Error",
          description: "Failed to check for existing profile. Please try again.",
          variant: "destructive",
        });
        clearTimeout(saveTimeout);
        setIsLoading(false);
        return;
      }

      const profileExists = !!existingProfile;
      console.log("Profile exists check:", { profileExists, existingProfile });
      
      // Basic profile data that we know exists in the database
      const baseUpdateData = {
        subjects: teacherFormData.subject,
        location: teacherFormData.location,
        fee: teacherFormData.fee,
        about: teacherFormData.about,
        tags: teacherFormData.tags,
        is_listed: teacherFormData.is_listed
      };

      // Additional fields that might not exist yet
      const additionalData = {
        qualifications: teacherFormData.qualifications,
        years_experience: teacherFormData.years_experience,
        teaching_style: teacherFormData.teaching_style,
        availability: teacherFormData.availability,
        teaching_format: teacherFormData.teaching_format,
        education: teacherFormData.education,
      };
      
      let saveSuccess = false;
      
      if (profileExists) {
        // Update existing profile
        try {
          console.log("Attempting to update profile with all fields...");
          // First try to update with all fields
          const { error } = await supabase
            .from("teacher_profiles")
            .update({ ...baseUpdateData, ...additionalData })
            .eq("user_id", user.id);
            
          if (error) {
            console.log("Full update failed, trying with base fields only:", error);
            
            // If the error is about is_listed, try without it
            if (error.message && error.message.includes("is_listed")) {
              console.log("Error about is_listed, trying without this field");
              // Try without is_listed by creating a new object without it
              const { is_listed, ...dataWithoutIsListed } = { ...baseUpdateData, ...additionalData };
              
              const { error: updatedError } = await supabase
                .from("teacher_profiles")
                .update(dataWithoutIsListed)
                .eq("user_id", user.id);
                
              if (updatedError) {
                console.error("Error updating without is_listed:", updatedError);
                // If still fails, try with just the base fields
                const { error: baseError } = await supabase
                  .from("teacher_profiles")
                  .update(baseUpdateData)
                  .eq("user_id", user.id);
                  
                if (baseError) {
                  console.error("Error updating teacher profile with base fields:", baseError);
                  toast({
                    title: "Error",
                    description: "Failed to update profile. Please try again.",
                    variant: "destructive",
                  });
                  return;
                } else {
                  saveSuccess = true;
                }
              } else {
                saveSuccess = true;
              }
            } else {
              // If error is not about is_listed, try with just the base fields
              const { error: baseError } = await supabase
                .from("teacher_profiles")
                .update(baseUpdateData)
                .eq("user_id", user.id);
                
              if (baseError) {
                console.error("Error updating teacher profile with base fields:", baseError);
                toast({
                  title: "Error",
                  description: "Failed to update profile. Please try again.",
                  variant: "destructive",
                });
                return;
              } else {
                saveSuccess = true;
              }
            }
          } else {
            saveSuccess = true;
          }
        } catch (error) {
          console.error("Error updating teacher profile:", error);
          toast({
            title: "Error",
            description: "Failed to update profile. Please try again.",
            variant: "destructive",
          });
          return;
        }
      } else {
        // Create new profile
        try {
          console.log("Attempting to create profile with all fields...");
          // First try to create with all fields
          const { error } = await supabase
            .from("teacher_profiles")
            .insert({
              user_id: user.id,
              ...baseUpdateData,
              ...additionalData
            });
            
          if (error) {
            console.log("Full insert failed, trying with base fields only:", error);
            // If that fails, try with just the base fields
            const { error: baseError } = await supabase
              .from("teacher_profiles")
              .insert({
                user_id: user.id,
                ...baseUpdateData
              });
              
            if (baseError) {
              console.error("Error creating teacher profile with base fields:", baseError);
              toast({
                title: "Error",
                description: "Failed to create profile. Please try again.",
                variant: "destructive",
              });
              return;
            }
            
            // Show a warning toast that some fields couldn't be saved
            toast({
              title: "Partial Save",
              description: "Some new fields couldn't be saved. Please contact support if this persists.",
              variant: "default",
            });
            saveSuccess = true;
          } else {
            saveSuccess = true;
            toast({
              title: "Success",
              description: "Teacher profile created successfully!",
              variant: "default",
            });
          }
        } catch (error) {
          console.error("Error creating teacher profile:", error);
          toast({
            title: "Error",
            description: "Failed to create profile. Please try again.",
            variant: "destructive",
          });
          return;
        }
      }

      // If we successfully saved anything, refresh the profile
      if (saveSuccess) {
        console.log("Profile saved successfully, refreshing data...");
        // Refresh auth context profile data
        await refreshProfile();
        // Refresh local teacher profile data
        await fetchTeacherProfile();
      }
    } catch (error) {
      console.error("Error saving teacher profile:", error);
      toast({
        title: "Error",
        description: "Failed to save profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      clearTimeout(saveTimeout);
      setIsLoading(false);
    }
  };

  // Function to verify and fix user type
  const verifyAndFixUserType = async () => {
    if (!user || !profile) return;

    try {
      console.log("TeacherProfilePage: Verifying user type");
      const supabase = createClientComponentClient();

      // First check if a teacher profile exists for this user
      const { data: teacherData, error: teacherError } = await supabase
        .from("teacher_profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (teacherError && teacherError.code !== "PGRST116") { // PGRST116 is "no rows returned"
        console.error("Error checking teacher profile:", teacherError);
        return;
      }

      // If teacher profile exists but user type is wrong, fix it
      if (teacherData && profile.user_type !== "teacher") {
        console.log("TeacherProfilePage: Found teacher profile but wrong user type. Fixing...");
        
        const { error: updateError } = await supabase
          .from("profiles")
          .update({ user_type: "teacher" })
          .eq("id", user.id);

        if (updateError) {
          console.error("Error updating user type:", updateError);
          return;
        }

        // Refresh the profile to get the updated user type
        await refreshProfile();
        
        toast({
          title: "Profile Updated",
          description: "Your account type has been corrected to Teacher.",
          variant: "default",
        });
      }
    } catch (error) {
      console.error("Error verifying user type:", error);
    }
  };

  if (!isClient) {
    return null;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Teacher Profile</h1>
      <Card>
        <CardHeader>
          <CardTitle>Teacher Profile</CardTitle>
          <CardDescription>
            Manage your teacher profile information that will be visible to students.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Profile Visibility */}
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Profile Visibility
                </Label>
                <p className="text-sm text-gray-500">
                  When turned off, your profile won't be visible in search results
                </p>
              </div>
              <Switch
                checked={teacherFormData.is_listed}
                onCheckedChange={(checked) =>
                  setTeacherFormData({ ...teacherFormData, is_listed: checked })
                }
              />
            </div>

            <div className="border-t pt-4"></div>

            {/* Gender */}
            <div>
              <Label
                htmlFor="gender"
                className="block text-sm font-medium text-gray-700"
              >
                Gender
              </Label>
              <Select
                value={teacherFormData.gender}
                onValueChange={(value: "male" | "female") =>
                  setTeacherFormData({ ...teacherFormData, gender: value })
                }
              >
                <SelectTrigger id="gender" className="mt-1">
                  <SelectValue placeholder="Select your gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-gray-500 mt-1">
                This determines the appearance of your profile card
              </p>
            </div>

            {/* Education */}
            <div>
              <Label
                htmlFor="education"
                className="block text-sm font-medium text-gray-700"
              >
                Education
              </Label>
              <Textarea
                id="education"
                rows={2}
                value={teacherFormData.education}
                onChange={(e) =>
                  setTeacherFormData({ ...teacherFormData, education: e.target.value })
                }
                className="mt-1 block w-full"
                placeholder="Describe your educational background (degrees, institutions, etc.)"
              />
            </div>

            {/* Qualifications */}
            <div>
              <Label className="block text-sm font-medium text-gray-700">
                Qualifications & Certifications
              </Label>
              <div className="mt-1 space-y-2">
                <div className="flex space-x-2">
                  <Input
                    type="text"
                    value={teacherFormData.newQualification}
                    onChange={(e) =>
                      setTeacherFormData({ ...teacherFormData, newQualification: e.target.value })
                    }
                    placeholder="Add a qualification or certification"
                    className="block w-full"
                  />
                  <Button 
                    type="button"
                    onClick={handleAddQualification}
                  >
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {teacherFormData.qualifications.map((qualification) => (
                    <span
                      key={qualification}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                    >
                      {qualification}
                      <button
                        type="button"
                        onClick={() => handleRemoveQualification(qualification)}
                        className="ml-1 inline-flex items-center p-0.5 rounded-full text-green-400 hover:bg-green-200 hover:text-green-500 focus:outline-none"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Teaching Experience */}
            <div>
              <Label
                htmlFor="years_experience"
                className="block text-sm font-medium text-gray-700"
              >
                Years of Teaching Experience
              </Label>
              <Input
                id="years_experience"
                type="number"
                min="0"
                max="50"
                value={teacherFormData.years_experience}
                onChange={(e) =>
                  setTeacherFormData({ ...teacherFormData, years_experience: e.target.value })
                }
                className="mt-1 block w-full"
                placeholder="e.g., 5"
              />
            </div>

            {/* Subjects */}
            <div>
              <Label className="block text-sm font-medium text-gray-700">
                Subjects You Teach
              </Label>
              <div className="mt-1 space-y-2">
                <div className="flex space-x-2">
                  <Input
                    type="text"
                    value={teacherFormData.newSubject}
                    onChange={(e) =>
                      setTeacherFormData({ ...teacherFormData, newSubject: e.target.value })
                    }
                    placeholder="Add a subject"
                    className="block w-full"
                  />
                  <Button 
                    type="button"
                    onClick={handleAddSubject}
                  >
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {teacherFormData.subject.map((subject) => (
                    <span
                      key={subject}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                    >
                      {subject}
                      <button
                        type="button"
                        onClick={() => handleRemoveSubject(subject)}
                        className="ml-1 inline-flex items-center p-0.5 rounded-full text-indigo-400 hover:bg-indigo-200 hover:text-indigo-500 focus:outline-none"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Teaching Format */}
            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-2">
                Teaching Format
              </Label>
              <RadioGroup 
                value={teacherFormData.teaching_format}
                onValueChange={(value) => 
                  setTeacherFormData({ ...teacherFormData, teaching_format: value })
                }
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="online" id="online" />
                  <Label htmlFor="online">Online Only</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="in-person" id="in-person" />
                  <Label htmlFor="in-person">In-Person Only</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="both" id="both" />
                  <Label htmlFor="both">Both</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Availability */}
            <div>
              <Label className="block text-sm font-medium text-gray-700">
                Availability
              </Label>
              <div className="mt-1 space-y-2">
                <div className="flex space-x-2">
                  <Input
                    type="text"
                    value={teacherFormData.newAvailability}
                    onChange={(e) =>
                      setTeacherFormData({ ...teacherFormData, newAvailability: e.target.value })
                    }
                    placeholder="e.g., Weekday evenings, Weekend mornings"
                    className="block w-full"
                  />
                  <Button 
                    type="button"
                    onClick={handleAddAvailability}
                  >
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {teacherFormData.availability.map((time) => (
                    <span
                      key={time}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
                    >
                      {time}
                      <button
                        type="button"
                        onClick={() => handleRemoveAvailability(time)}
                        className="ml-1 inline-flex items-center p-0.5 rounded-full text-purple-400 hover:bg-purple-200 hover:text-purple-500 focus:outline-none"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Location */}
            <div>
              <Label
                htmlFor="location"
                className="block text-sm font-medium text-gray-700"
              >
                Location
              </Label>
              <Input
                id="location"
                value={teacherFormData.location}
                onChange={(e) =>
                  setTeacherFormData({ ...teacherFormData, location: e.target.value })
                }
                className="mt-1 block w-full"
                placeholder="City, State or Online"
              />
            </div>

            {/* Fee Structure */}
            <div>
              <Label
                htmlFor="fee"
                className="block text-sm font-medium text-gray-700"
              >
                Fee Structure
              </Label>
              <Input
                id="fee"
                value={teacherFormData.fee}
                onChange={(e) =>
                  setTeacherFormData({ ...teacherFormData, fee: e.target.value })
                }
                placeholder="e.g., $50/hour"
                className="mt-1 block w-full"
              />
            </div>

            {/* Teaching Style */}
            <div>
              <Label
                htmlFor="teaching_style"
                className="block text-sm font-medium text-gray-700"
              >
                Teaching Style
              </Label>
              <Textarea
                id="teaching_style"
                rows={3}
                value={teacherFormData.teaching_style}
                onChange={(e) =>
                  setTeacherFormData({ ...teacherFormData, teaching_style: e.target.value })
                }
                className="mt-1 block w-full"
                placeholder="Describe your teaching approach and methods"
              />
            </div>

            {/* About You */}
            <div>
              <Label
                htmlFor="about"
                className="block text-sm font-medium text-gray-700"
              >
                About You
              </Label>
              <Textarea
                id="about"
                rows={4}
                value={teacherFormData.about}
                onChange={(e) =>
                  setTeacherFormData({ ...teacherFormData, about: e.target.value })
                }
                className="mt-1 block w-full"
                placeholder="Tell students about your teaching experience, qualifications, and teaching style"
              />
            </div>

            {/* Tags */}
            <div>
              <Label className="block text-sm font-medium text-gray-700">
                Tags
              </Label>
              <div className="mt-1 space-y-2">
                <div className="flex space-x-2">
                  <Input
                    type="text"
                    value={teacherFormData.newTag}
                    onChange={(e) =>
                      setTeacherFormData({ ...teacherFormData, newTag: e.target.value })
                    }
                    placeholder="Add a tag"
                    className="block w-full"
                  />
                  <Button
                    type="button"
                    onClick={handleAddTag}
                  >
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {teacherFormData.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-1 inline-flex items-center p-0.5 rounded-full text-indigo-400 hover:bg-indigo-200 hover:text-indigo-500 focus:outline-none"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <Button
                type="button"
                onClick={handleSaveProfile}
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? "Saving..." : "Save Teacher Profile"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 