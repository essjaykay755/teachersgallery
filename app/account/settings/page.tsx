"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/contexts/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { uploadAvatar } from "@/lib/upload";
import { Loader2 } from "lucide-react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useToast } from "@/components/ui/use-toast";

// Extend the Profile type to include the fields we need
interface ExtendedProfile {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  user_type: "teacher" | "student" | "parent" | "admin";
  avatar_url?: string;
  notification_preferences?: string | {
    email?: boolean;
    push?: boolean;
    marketing?: boolean;
    messages?: boolean;
    reviews?: boolean;
    bookings?: boolean;
  };
  created_at: string;
}

export default function AccountSettingsPage() {
  const { user, profile, refreshProfile } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [isClient, setIsClient] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    bio: ""
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    marketingEmails: false,
    messageNotifications: true,
    reviewNotifications: true,
    bookingNotifications: true
  });
  
  const supabase = createClientComponentClient();
  const { toast } = useToast();
  
  useEffect(() => {
    setIsClient(true);
    if (profile) {
      // Cast to ExtendedProfile to handle additional fields
      const extendedProfile = profile as unknown as ExtendedProfile;
      
      setFormData({
        fullName: profile.full_name || "",
        email: user?.email || "",
        phone: profile.phone || "",
        bio: "" // Set bio to empty string as it's not in the database schema
      });
      
      setAvatarUrl(profile.avatar_url || null);
      
      // Load notification preferences if available
      if (extendedProfile.notification_preferences) {
        try {
          // Check if notification_preferences is already an object or a string
          let preferences;
          if (typeof extendedProfile.notification_preferences === 'string') {
            preferences = JSON.parse(extendedProfile.notification_preferences);
          } else if (typeof extendedProfile.notification_preferences === 'object') {
            // It's already an object, use it directly
            preferences = extendedProfile.notification_preferences;
          } else {
            // Set default preferences
            preferences = {
              email: true,
              push: true,
              marketing: false,
              messages: true,
              reviews: true,
              bookings: true
            };
          }
          
          setNotificationSettings({
            emailNotifications: preferences.email ?? true,
            pushNotifications: preferences.push ?? true,
            marketingEmails: preferences.marketing ?? false,
            messageNotifications: preferences.messages ?? true,
            reviewNotifications: preferences.reviews ?? true,
            bookingNotifications: preferences.bookings ?? true
          });
        } catch (error) {
          console.error("Error parsing notification preferences:", error);
          // Use default values on error
          setNotificationSettings({
            emailNotifications: true,
            pushNotifications: true,
            marketingEmails: false,
            messageNotifications: true,
            reviewNotifications: true,
            bookingNotifications: true
          });
        }
      }
    }
  }, [profile, user]);

  if (!isClient) {
    return null;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Validate file type and size
      if (!file.type.startsWith("image/")) {
        toast({
          title: "Invalid file type",
          description: "Please select an image file (JPEG, PNG, etc.)",
          variant: "destructive"
        });
        return;
      }

      if (file.size > 2 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Image must be less than 2MB",
          variant: "destructive"
        });
        return;
      }
      
      // Set file for upload
      setAvatarFile(file);
      
      // Create object URL for preview
      const objectUrl = URL.createObjectURL(file);
      setAvatarUrl(objectUrl);
      
      console.log("Avatar file selected:", file.name, file.type, file.size, "Preview URL:", objectUrl);
    }
  };

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotificationSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Add a debug helper for toast notifications
  const showDebugToast = (message: string) => {
    console.log("Debug toast:", message);
    toast({
      title: "Debug",
      description: message,
      variant: "default",
    });
  };

  const saveProfile = async () => {
    if (!user) {
      console.error("Cannot save profile: No user is logged in");
      toast({
        title: "Error",
        description: "You must be logged in to save your profile.",
        variant: "destructive"
      });
      return;
    }
    
    // Set loading state
    setIsSaving(true);
    
    // Set a safety timeout to reset the loading state after 60 seconds (increased from 30)
    const safetyTimeout = setTimeout(() => {
      console.log("Safety timeout triggered, resetting isSaving state");
      setIsSaving(false);
      toast({
        title: "Operation timed out",
        description: "The request took too long. Please try again.",
        variant: "destructive"
      });
    }, 60000); // Increased to 60 seconds to match Supabase client timeout
    
    console.log("Starting profile save process...");
    
    try {
      // Debug info
      console.log("User object:", JSON.stringify({
        id: user.id,
        email: user.email
      }));
      
      let newAvatarUrl = profile?.avatar_url;
      
      // Upload avatar if a new one was selected
      if (avatarFile) {
        console.log("Uploading new avatar...");
        const uploadResult = await uploadAvatar(avatarFile, user.id);
        
        if ('url' in uploadResult) {
          console.log("Avatar uploaded successfully:", uploadResult.url);
          newAvatarUrl = uploadResult.url;
        } else {
          console.error("Avatar upload failed:", uploadResult.error);
          throw new Error(uploadResult.error || "Failed to upload avatar");
        }
      }
      
      // Prepare data for Supabase update - ONLY include fields that exist in database
      const updateData = {
        full_name: formData.fullName,
        phone: formData.phone,
        avatar_url: newAvatarUrl
      };
      
      console.log("Updating profile with data:", updateData);
      
      // Getting the exact user ID and clean it
      const userId = user.id.trim();
      console.log("User ID for update (cleaned):", userId);
      
      if (!userId) {
        throw new Error("Invalid user ID: empty after trimming");
      }
      
      try {
        console.log("Sending update request to Supabase...");
        // Update profile with more explicit error handling
        console.log("Supabase request URL:", `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/profiles?id=eq.${userId}`);
        
        const startTime = Date.now();
        const { data, error } = await supabase
          .from('profiles')
          .update(updateData)
          .eq('id', userId)
          .select();
        const endTime = Date.now();
        console.log(`Supabase request completed in ${endTime - startTime}ms`);
        
        if (error) {
          console.error("Supabase update error:", error);
          // Special handling for common errors
          if (error.code === 'PGRST204') {
            throw new Error(`Database schema error: ${error.message}`);
          } else if (error.message?.includes('violates row-level security policy')) {
            throw new Error('Permission denied: You do not have access to update this profile');
          } else {
            throw error;
          }
        }
        
        console.log("Profile updated successfully:", data);
        
        // Clear the safety timeout as the operation succeeded
        clearTimeout(safetyTimeout);
        
        try {
          console.log("Refreshing profile data...");
          const refreshStartTime = Date.now(); 
          await refreshProfile();
          const refreshEndTime = Date.now();
          console.log(`Profile refreshed successfully in ${refreshEndTime - refreshStartTime}ms`);
        } catch (refreshError) {
          console.error("Error refreshing profile:", refreshError);
          // Continue with success message even if refresh fails
        }
        
        console.log("Showing success toast");
        
        // Show success toast with immediate visibility
        toast({
          title: "Profile updated",
          description: "Your profile information has been updated successfully.",
          duration: 5000, // 5 seconds
        });
        
        console.log("Success toast should now be visible");
      } catch (dbError) {
        console.error("Database operation error:", dbError);
        throw dbError;
      }
      
      // Reset the loading state immediately after successful save
      setIsSaving(false);
      
    } catch (error) {
      console.error("Error updating profile:", error);
      
      // Clear the safety timeout as we're handling the error
      clearTimeout(safetyTimeout);
      
      // Show error toast
      toast({
        title: "Error",
        description: error instanceof Error 
          ? error.message
          : "There was an error updating your profile. Please try again.",
        variant: "destructive",
        duration: 7000, // 7 seconds
      });
      
      // Reset loading state
      setIsSaving(false);
    } finally {
      // In case none of the previous resets worked, ensure loading state is reset
      setTimeout(() => {
        console.log("Final isSaving state reset in finally block");
        setIsSaving(false);
      }, 100);
    }
  };

  const saveNotificationSettings = async () => {
    if (!user) {
      console.error("Cannot save notification settings: No user is logged in");
      toast({
        title: "Error",
        description: "You must be logged in to save your notification settings.",
        variant: "destructive"
      });
      return;
    }
    
    // Set loading state
    setIsSaving(true);
    
    // Set a safety timeout to reset the loading state after 60 seconds
    const safetyTimeout = setTimeout(() => {
      console.log("Safety timeout triggered, resetting isSaving state");
      setIsSaving(false);
      toast({
        title: "Operation timed out",
        description: "The request took too long. Please try again.",
        variant: "destructive"
      });
    }, 60000); // 60 seconds to match the Supabase client timeout
    
    console.log("Starting notification settings save process...");
    
    try {
      // Debug info
      console.log("User object:", JSON.stringify({
        id: user.id,
        email: user.email
      }));
      
      const notificationPreferences = JSON.stringify({
        email: notificationSettings.emailNotifications,
        push: notificationSettings.pushNotifications,
        marketing: notificationSettings.marketingEmails,
        messages: notificationSettings.messageNotifications,
        reviews: notificationSettings.reviewNotifications,
        bookings: notificationSettings.bookingNotifications
      });
      
      console.log("Updating notification settings:", notificationPreferences);
      
      // Getting the exact user ID and clean it
      const userId = user.id.trim();
      console.log("User ID for update (cleaned):", userId);
      
      if (!userId) {
        throw new Error("Invalid user ID: empty after trimming");
      }
      
      try {
        console.log("Sending update request to Supabase...");
        
        // First, check if profile exists
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('id, notification_preferences')
          .eq('id', userId)
          .single();
        
        if (profileError) {
          if (profileError.code === 'PGRST116') {
            // Profile not found
            throw new Error("Profile not found. Please complete your profile setup first.");
          } else if (profileError.message && 
                    (profileError.message.includes("column") || 
                     profileError.message.includes("notification_preferences"))) {
            // Column doesn't exist in schema, we will try the update anyway
            console.warn("notification_preferences column may not exist:", profileError.message);
          } else {
            throw new Error(`Database error: ${profileError.message}`);
          }
        }
        
        // Attempt to update the profile with notification preferences
        const { data, error } = await supabase
          .from('profiles')
          .update({
            notification_preferences: notificationPreferences
          })
          .eq('id', userId)
          .select();
        
        if (error) {
          console.error("Supabase update error:", error);
          
          // Special handling for common errors
          if (error.code === 'PGRST204' || 
              (error.message && error.message.includes("column"))) {
            
            // The column doesn't exist - suggest running the database fix script
            toast({
              title: "Database Column Missing",
              description: "The notification_preferences column is missing. Please run the database fix script provided in the COMMON_ISSUES.md file.",
              variant: "destructive"
            });
            
            throw new Error(`Database schema error: ${error.message}. The notification_preferences column might not exist.`);
          } else if (error.message?.includes('violates row-level security policy')) {
            throw new Error('Permission denied: You do not have access to update notification settings');
          } else {
            throw error;
          }
        }
        
        console.log("Notification settings updated successfully:", data);
        
        // Clear the safety timeout as the operation succeeded
        clearTimeout(safetyTimeout);
        
        // Show success message
        toast({
          title: "Settings Saved",
          description: "Your notification preferences have been updated successfully.",
          variant: "default"
        });
        
        try {
          console.log("Refreshing profile data...");
          await refreshProfile();
          console.log("Profile refreshed successfully");
        } catch (refreshError) {
          console.error("Error refreshing profile:", refreshError);
          // Continue with success message even if refresh fails
        }
        
        console.log("Showing success toast");
        
        // Show success toast with immediate visibility
        toast({
          title: "Settings Saved",
          description: "Your notification preferences have been updated successfully.",
          duration: 5000, // 5 seconds
        });
        
        console.log("Success toast should now be visible");
      } catch (dbError) {
        console.error("Database operation error:", dbError);
        throw dbError;
      }
      
      // Reset the loading state immediately after successful save
      setIsSaving(false);
      
    } catch (error) {
      console.error("Error updating notification settings:", error);
      
      // Clear the safety timeout as we're handling the error
      clearTimeout(safetyTimeout);
      
      // Show error toast
      toast({
        title: "Error",
        description: error instanceof Error 
          ? error.message
          : "There was an error updating your notification settings. Please try again.",
        variant: "destructive",
        duration: 7000, // 7 seconds
      });
      
      // Reset loading state
      setIsSaving(false);
    } finally {
      // In case none of the previous resets worked, ensure loading state is reset
      setTimeout(() => {
        console.log("Final isSaving state reset in finally block");
        setIsSaving(false);
      }, 100);
    }
  };

  const changePassword = async () => {
    if (!user) return;
    
    // Validate passwords
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Password mismatch",
        description: "New password and confirmation do not match.",
        variant: "destructive"
      });
      return;
    }
    
    if (passwordData.newPassword.length < 6) {
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters long.",
        variant: "destructive"
      });
      return;
    }
    
    setIsChangingPassword(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordData.newPassword
      });
      
      if (error) throw error;
      
      toast({
        title: "Password updated",
        description: "Your password has been updated successfully.",
      });
      
      // Clear password fields
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
    } catch (error) {
      console.error("Error changing password:", error);
      toast({
        title: "Error",
        description: "There was an error changing your password. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Account Settings</h1>
      <Card>
        <CardHeader>
          <CardTitle>Manage Account</CardTitle>
          <CardDescription>
            Manage your account settings and set your preferences.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>
                    Update your profile information visible to others.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center gap-4 py-4">
                    <div className="h-20 w-20 rounded-full overflow-hidden">
                      <img
                        src={avatarUrl || "/default-avatar.png"}
                        alt="Profile"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <Input 
                        type="file" 
                        accept="image/*"
                        onChange={handleAvatarChange}
                        className="w-full"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input 
                        id="fullName" 
                        value={formData.fullName} 
                        onChange={handleInputChange} 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email" 
                        value={formData.email} 
                        onChange={handleInputChange}
                        readOnly 
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input 
                        id="phone" 
                        value={formData.phone} 
                        onChange={handleInputChange} 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="userType">User Type</Label>
                      <div className="relative">
                        <Select defaultValue={profile?.user_type || "unknown"} disabled>
                          <SelectTrigger id="userType" className="bg-gray-100">
                            <SelectValue placeholder="Select user type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="teacher">Teacher</SelectItem>
                            <SelectItem value="student">Student</SelectItem>
                            <SelectItem value="parent">Parent</SelectItem>
                            <SelectItem value="unknown">Unknown</SelectItem>
                          </SelectContent>
                        </Select>
                        <div className="text-xs text-muted-foreground mt-1">
                          User type cannot be changed after the onboarding process.
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      placeholder="Tell us about yourself"
                      className="h-32"
                      value={formData.bio}
                      onChange={handleInputChange}
                    />
                  </div>

                  <Button onClick={saveProfile} disabled={isSaving}>
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : "Save Profile"}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security">
              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                  <CardDescription>Manage your account security</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Change Password</Label>
                    <div className="grid gap-2">
                      <Input 
                        type="password" 
                        id="currentPassword"
                        placeholder="Current password" 
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                      />
                      <Input 
                        type="password" 
                        id="newPassword"
                        placeholder="New password" 
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                      />
                      <Input 
                        type="password" 
                        id="confirmPassword"
                        placeholder="Confirm new password" 
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                      />
                      <Button 
                        className="w-full" 
                        onClick={changePassword} 
                        disabled={isChangingPassword}
                      >
                        {isChangingPassword ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Updating...
                          </>
                        ) : "Update Password"}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Two-Factor Authentication</Label>
                        <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                      </div>
                      <Switch />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Account Recovery Email</Label>
                        <p className="text-sm text-gray-500">Used to recover your account if you forget your password</p>
                      </div>
                      <Button variant="outline">Set Up</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Settings</CardTitle>
                  <CardDescription>Manage your notification preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="email-notifications">Email Notifications</Label>
                        <p className="text-sm text-gray-500">Receive notifications via email</p>
                      </div>
                      <Switch 
                        id="email-notifications"
                        checked={notificationSettings.emailNotifications} 
                        onCheckedChange={(value) => handleNotificationChange("emailNotifications", value)} 
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="push-notifications">Push Notifications</Label>
                        <p className="text-sm text-gray-500">Receive push notifications</p>
                      </div>
                      <Switch 
                        id="push-notifications"
                        checked={notificationSettings.pushNotifications} 
                        onCheckedChange={(value) => handleNotificationChange("pushNotifications", value)} 
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="marketing-emails">Marketing Emails</Label>
                        <p className="text-sm text-gray-500">Receive marketing and promotional emails</p>
                      </div>
                      <Switch 
                        id="marketing-emails"
                        checked={notificationSettings.marketingEmails} 
                        onCheckedChange={(value) => handleNotificationChange("marketingEmails", value)} 
                      />
                    </div>
                  </div>

                  <div className="border-t pt-6 mt-6">
                    <h3 className="text-lg font-medium mb-4">Notification Types</h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="message-notifications">Messages</Label>
                          <p className="text-sm text-gray-500">Receive notifications when you get new messages</p>
                        </div>
                        <Switch 
                          id="message-notifications"
                          checked={notificationSettings.messageNotifications} 
                          onCheckedChange={(value) => handleNotificationChange("messageNotifications", value)} 
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="review-notifications">Reviews</Label>
                          <p className="text-sm text-gray-500">Receive notifications for new reviews</p>
                        </div>
                        <Switch 
                          id="review-notifications"
                          checked={notificationSettings.reviewNotifications} 
                          onCheckedChange={(value) => handleNotificationChange("reviewNotifications", value)} 
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="booking-notifications">Bookings</Label>
                          <p className="text-sm text-gray-500">Receive notifications for booking updates</p>
                        </div>
                        <Switch 
                          id="booking-notifications"
                          checked={notificationSettings.bookingNotifications} 
                          onCheckedChange={(value) => handleNotificationChange("bookingNotifications", value)} 
                        />
                      </div>
                    </div>
                  </div>

                  <Button onClick={saveNotificationSettings} disabled={isSaving}>
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : "Save Notification Settings"}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
