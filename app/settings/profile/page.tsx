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

// Form validation schema
const formSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters."),
  lastName: z.string().min(2, "Last name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address.").optional(),
  phone: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function ProfileSettings() {
  const { user, profile, refreshProfile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const supabase = createClientComponentClient();
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: user?.email || "",
      phone: "",
    },
  });

  // Load profile data when component mounts
  useEffect(() => {
    if (profile) {
      // Split full name into first and last name
      const nameParts = profile.full_name.split(" ");
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";
      
      form.reset({
        firstName,
        lastName,
        email: profile.email || user?.email || "",
        phone: profile.phone || "",
      });

      setAvatarUrl(profile.avatar_url || null);
    }
  }, [profile, user, form]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      // Create a preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: FormValues) => {
    if (!user) return;

    setIsLoading(true);
    try {
      // Upload avatar if changed
      let finalAvatarUrl = profile?.avatar_url || null;
      if (avatarFile) {
        setIsUploading(true);
        const result = await uploadAvatar(avatarFile, user.id);
        setIsUploading(false);
        
        if ('error' in result) {
          throw new Error(`Failed to upload avatar: ${result.error}`);
        }
        
        finalAvatarUrl = result.url;
      }

      // Combine first and last name
      const fullName = `${data.firstName} ${data.lastName}`.trim();

      // Update profile in database
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: fullName,
          email: data.email || user.email,
          phone: data.phone,
          avatar_url: finalAvatarUrl,
        })
        .eq("id", user.id);

      if (error) throw error;

      // Refresh profile data in context
      await refreshProfile();

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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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