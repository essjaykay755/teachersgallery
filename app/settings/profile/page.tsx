"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/contexts/auth";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage, AvatarWithTypeIndicator } from "@/components/ui/avatar";
import { uploadAvatar } from "@/lib/upload";
import { Loader2, User } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { StudentProfile, ParentProfile } from "@/lib/supabase";

// Form validation schema
const formSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters."),
  lastName: z.string().min(2, "Last name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address.").optional(),
  phone: z.string().optional(),
  gender: z.enum(["male", "female"], {
    required_error: "Please select your gender",
  }),
  // Student fields
  grade: z.string().optional(),
  interests: z.array(z.string()).optional(),
  // Parent fields
  childrenCount: z.number().min(1).optional(),
  childrenGrades: z.array(z.string()).optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function ProfileSettings() {
  const { user, profile, refreshProfile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [studentProfile, setStudentProfile] = useState<StudentProfile | null>(null);
  const [parentProfile, setParentProfile] = useState<ParentProfile | null>(null);
  const [interests, setInterests] = useState<string[]>([]);
  const [newInterest, setNewInterest] = useState("");
  const supabase = createClientComponentClient();
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: user?.email || "",
      phone: "",
      gender: "male",
      grade: "",
      interests: [],
      childrenCount: 1,
      childrenGrades: [],
    },
  });

  // Load profile data when component mounts
  useEffect(() => {
    if (profile) {
      console.log("Initializing profile form with profile data:", {
        id: profile.id,
        full_name: profile.full_name,
        avatar_url: profile.avatar_url
      });
      
      // Split full name into first and last name
      const nameParts = profile.full_name.split(" ");
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";
      
      // Set avatar URL from profile if it exists and isn't explicitly the default avatar
      if (profile.avatar_url && 
          profile.avatar_url !== "/default-avatar.png" && 
          profile.avatar_url !== "@default-avatar.png") {
        console.log("Setting avatar URL from profile:", profile.avatar_url);
        setAvatarUrl(profile.avatar_url);
      } else {
        console.log("No custom avatar URL found in profile, using default");
      }
      
      form.reset({
        firstName,
        lastName,
        email: profile.email || user?.email || "",
        phone: profile.phone || "",
        gender: profile.gender || "male",
        grade: studentProfile?.grade || "",
        interests: studentProfile?.interests || [],
        childrenCount: parentProfile?.children_count || 1,
        childrenGrades: parentProfile?.children_grades || [],
      });

      // Load interests if available
      if (studentProfile?.interests) {
        setInterests(studentProfile.interests);
      }
    }
  }, [profile, studentProfile, parentProfile, user, form]);

  const loadStudentProfile = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from("student_profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();
        
      if (error) {
        console.error("Error fetching student profile:", error);
      } else if (data) {
        setStudentProfile(data);
        form.setValue("grade", data.grade);
        form.setValue("interests", data.interests);
        setInterests(data.interests);
      }
    } catch (error) {
      console.error("Error fetching student profile:", error);
    }
  };

  const loadParentProfile = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from("parent_profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();
        
      if (error) {
        console.error("Error fetching parent profile:", error);
      } else if (data) {
        setParentProfile(data);
        form.setValue("childrenCount", data.children_count);
        form.setValue("childrenGrades", data.children_grades);
      }
    } catch (error) {
      console.error("Error fetching parent profile:", error);
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file (JPEG, PNG, etc.)",
        variant: "destructive"
      });
      return;
    }
    
    // Warn about large file sizes
    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "Large file detected",
        description: "Your image is larger than 2MB. It will be compressed automatically, but upload may take longer.",
        variant: "default"
      });
    }
    
    // Store the file for upload
    setAvatarFile(file);
    console.log("Avatar file selected:", file.name, file.type, `${(file.size / 1024).toFixed(2)}KB`);
    
    // Create a preview URL with timestamp to prevent caching issues
    const reader = new FileReader();
    reader.onloadend = () => {
      const previewUrl = reader.result as string;
      console.log("Setting avatar preview URL");
      
      // Clear any existing avatar URL first (to reset state)
      setAvatarUrl(null);
      
      // Set the new avatar URL after a tiny delay to ensure state reset
      setTimeout(() => {
        setAvatarUrl(previewUrl);
      }, 50);
    };
    reader.readAsDataURL(file);
  };

  const handleAddInterest = () => {
    if (newInterest.trim() && !interests.includes(newInterest.trim())) {
      const updatedInterests = [...interests, newInterest.trim()];
      setInterests(updatedInterests);
      form.setValue("interests", updatedInterests);
      setNewInterest("");
    }
  };

  const handleRemoveInterest = (interest: string) => {
    const updatedInterests = interests.filter(i => i !== interest);
    setInterests(updatedInterests);
    form.setValue("interests", updatedInterests);
  };

  const onSubmit = async (data: FormValues) => {
    if (!user || !profile) return;

    setIsLoading(true);
    
    try {
      // Upload avatar if changed - handle this first and separately
      let finalAvatarUrl = profile.avatar_url || null;
      
      if (avatarFile) {
        try {
          setIsUploading(true);
          console.log("Uploading avatar file:", avatarFile.name, `(${(avatarFile.size / 1024).toFixed(2)}KB)`);
          
          // Set a timeout for the upload operation
          const uploadTimeout = 30000; // 30 seconds
          const uploadPromise = uploadAvatar(avatarFile, user.id);
          
          // Create a promise that rejects after the timeout
          const timeoutPromise = new Promise<{ error: string }>((_, reject) => {
            setTimeout(() => reject(new Error("Avatar upload timed out")), uploadTimeout);
          });
          
          // Race the upload against the timeout
          const result = await Promise.race([uploadPromise, timeoutPromise])
            .catch(error => {
              console.error("Avatar upload failed:", error.message);
              return { error: "Upload timed out. Please try again with a smaller image." };
            });
          
          if ('error' in result) {
            // If there's an upload error, show it but continue with the profile update
            console.error("Avatar upload error:", result.error);
            toast({
              title: "Avatar upload failed",
              description: result.error,
              variant: "destructive",
            });
            // Continue without updating the avatar
          } else {
            finalAvatarUrl = result.url;
            console.log("Avatar uploaded successfully, URL:", finalAvatarUrl);
          }
        } catch (uploadError) {
          console.error("Avatar upload exception:", uploadError);
          // Show toast but continue with the profile update
          toast({
            title: "Avatar upload failed",
            description: "Your profile will be updated without the new avatar",
            variant: "destructive",
          });
          // Continue without updating the avatar
        } finally {
          setIsUploading(false);
        }
      }

      // Combine first and last name
      const fullName = `${data.firstName} ${data.lastName}`.trim();

      // Prepare profile update data - only include avatar_url if it exists
      const profileUpdate: Record<string, any> = {
        full_name: fullName,
        email: data.email || user.email,
        phone: data.phone,
        gender: data.gender,
      };
      
      // Only include avatar_url in the update if it was successfully uploaded
      if (finalAvatarUrl && finalAvatarUrl !== profile.avatar_url) {
        profileUpdate.avatar_url = finalAvatarUrl;
      }
      
      console.log("Updating profile with data:", profileUpdate);

      // Update base profile
      const { error: profileError } = await supabase
        .from("profiles")
        .update(profileUpdate)
        .eq("id", user.id);

      if (profileError) {
        console.error("Profile update error:", profileError);
        throw profileError;
      }

      // Update type-specific profile
      if (profile.user_type === "student") {
        const { error: studentError } = await supabase
          .from("student_profiles")
          .upsert({
            user_id: user.id,
            grade: data.grade,
            interests: data.interests,
          });

        if (studentError) throw studentError;
      } else if (profile.user_type === "parent") {
        const { error: parentError } = await supabase
          .from("parent_profiles")
          .upsert({
            user_id: user.id,
            children_count: data.childrenCount,
            children_grades: data.childrenGrades,
          });

        if (parentError) throw parentError;
      }

      // Refresh profile data in context and then manually update the avatar URL in state
      // to ensure it's consistent with what we just uploaded
      await refreshProfile();
      
      // If we successfully uploaded a new avatar, make sure our local state reflects that
      if (finalAvatarUrl && finalAvatarUrl !== profile.avatar_url) {
        setAvatarUrl(finalAvatarUrl);
        console.log("Updated local avatar URL state to:", finalAvatarUrl);
      }

      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Settings</CardTitle>
        <CardDescription>
          Manage your personal information and how it appears to others.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form id="profile-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Avatar section */}
            <div className="space-y-4">
              <FormLabel>Profile Picture</FormLabel>
              <div className="flex items-center gap-5">
                <AvatarWithTypeIndicator
                  key={avatarUrl || 'default'}
                  size="xl"
                  className="w-20 h-20"
                  src={avatarUrl || ""}
                  alt="Profile"
                  userType={profile?.user_type}
                  fallback={profile?.full_name ? profile.full_name.substring(0, 2).toUpperCase() : <User />}
                />
                <div>
                  <Input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleAvatarChange} 
                    className="mb-2" 
                  />
                  <p className="text-sm text-muted-foreground">
                    Upload a square image for best results. Max size 2MB.
                  </p>
                </div>
              </div>
            </div>

            {/* Basic Information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={!!user?.email} />
                  </FormControl>
                  {user?.email && (
                    <FormDescription>
                      Your email is linked to your account and cannot be changed here.
                    </FormDescription>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>
                    This will only be visible to approved contacts.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gender</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your gender" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    This information is required and will determine profile appearance.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Student-specific fields */}
            {profile?.user_type === "student" && (
              <>
                <FormField
                  control={form.control}
                  name="grade"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Grade/Class</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your grade" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Array.from({ length: 5 }, (_, i) => i + 8).map((grade) => (
                            <SelectItem key={grade} value={grade.toString()}>
                              {grade}th Grade
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-2">
                  <FormLabel>Subjects of Interest</FormLabel>
                  <div className="flex gap-2 mb-2">
                    <Input
                      value={newInterest}
                      onChange={(e) => setNewInterest(e.target.value)}
                      placeholder="Add a subject"
                      onKeyPress={(e) => e.key === "Enter" && handleAddInterest()}
                    />
                    <Button type="button" onClick={handleAddInterest}>
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {interests.map((interest) => (
                      <div
                        key={interest}
                        className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full flex items-center gap-2"
                      >
                        {interest}
                        <button
                          type="button"
                          onClick={() => handleRemoveInterest(interest)}
                          className="text-secondary-foreground/50 hover:text-secondary-foreground"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Parent-specific fields */}
            {profile?.user_type === "parent" && (
              <>
                <FormField
                  control={form.control}
                  name="childrenCount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Number of Children</FormLabel>
                      <Select
                        onValueChange={(value) => field.onChange(parseInt(value))}
                        value={field.value?.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select number of children" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Array.from({ length: 5 }, (_, i) => i + 1).map((num) => (
                            <SelectItem key={num} value={num.toString()}>
                              {num}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="childrenGrades"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Children's Grades</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          value={field.value?.join(", ") || ""}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value.split(",").map((grade) => grade.trim())
                            )
                          }
                          placeholder="e.g., 8th, 10th"
                        />
                      </FormControl>
                      <FormDescription>
                        Enter grades separated by commas
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
          </form>
        </Form>
      </CardContent>
      <CardFooter>
        <Button 
          type="submit" 
          form="profile-form" 
          disabled={isLoading || isUploading}
        >
          {(isLoading || isUploading) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Changes
        </Button>
      </CardFooter>
    </Card>
  );
} 