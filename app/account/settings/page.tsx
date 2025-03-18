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
  
  // Check for missing database columns on component mount
  useEffect(() => {
    if (user) {
      // Only run once when the component mounts
      const checkColumns = async () => {
        try {
          console.log("Checking for missing database columns...");
          const response = await fetch('/api/profile/check-columns');
          
          if (response.ok) {
            const data = await response.json();
            console.log("Column check result:", data);
            
            // Show a toast if fixes were applied
            if (data.fixes_applied && data.fixes_applied.length > 0) {
              toast({
                title: "Database Updated",
                description: `Fixed missing columns: ${data.fixes_applied.join(', ')}`,
                variant: "default"
              });
              
              // Refresh profile to get updated structure
              refreshProfile();
            }
          } else {
            console.warn("Failed to check columns:", response.statusText);
          }
        } catch (error) {
          console.error("Error checking for missing columns:", error);
        }
      };
      
      checkColumns();
    }
  }, [user, toast, refreshProfile]);

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
    
    // Set a safety timeout to reset the loading state after 60 seconds
    const safetyTimeout = setTimeout(() => {
      console.log("Safety timeout triggered, resetting isSaving state");
      setIsSaving(false);
      toast({
        title: "Operation timed out",
        description: "The request took too long. Please try again.",
        variant: "destructive"
      });
    }, 60000);
    
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
      
      // Prepare data for update
      const updateData = {
        full_name: formData.fullName,
        phone: formData.phone,
        avatar_url: newAvatarUrl
      };
      
      console.log("Updating profile with data:", updateData);
      
      // Try using the API endpoint instead of direct Supabase client call
      console.log("Sending update request to API endpoint...");
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData)
      });
      
      // If the API call fails, fall back to direct Supabase client
      if (!response.ok) {
        const errorData = await response.json();
        console.warn("API update failed, error:", errorData);
        console.log("Falling back to direct Supabase client...");
        
        // Getting the exact user ID and clean it
        const userId = user.id.trim();
        console.log("User ID for update (cleaned):", userId);
        
        if (!userId) {
          throw new Error("Invalid user ID: empty after trimming");
        }
        
        // Try the direct update with more explicit error handling
        console.log("Sending direct update request to Supabase...");
        console.log("API URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);
        
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
          throw error;
        }
        
        console.log("Profile updated successfully via direct method:", data);
      } else {
        const data = await response.json();
        console.log("Profile updated successfully via API:", data);
      }
      
      // Clear the safety timeout as the operation succeeded
      clearTimeout(safetyTimeout);
      
      try {
        console.log("Refreshing profile data...");
        await refreshProfile();
        console.log("Profile refreshed successfully");
      } catch (refreshError) {
        console.error("Failed to refresh profile:", refreshError);
        // Don't throw here, as the update succeeded
      }
      
      setIsSaving(false);
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
        variant: "default"
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      
      // More detailed error handling
      let errorMessage = "An unknown error occurred";
      
      if (error instanceof Error) {
        errorMessage = error.message;
        
        // Check for specific error types
        if (errorMessage.includes("violates row-level security policy")) {
          errorMessage = "Permission denied: You don't have access to update this profile.";
        } else if (errorMessage.includes("column") || errorMessage.includes("does not exist")) {
          errorMessage = "Database schema issue: Missing column. Please run the database fix script.";
        } else if (errorMessage.includes("network") || errorMessage.includes("timeout")) {
          errorMessage = "Network error: Please check your connection and try again.";
        }
      }
      
      // Clear the safety timeout
      clearTimeout(safetyTimeout);
      
      setIsSaving(false);
      toast({
        title: "Update Failed",
        description: errorMessage,
        variant: "destructive"
      });
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
    }, 60000);
    
    console.log("Starting notification settings save process...");
    
    try {
      // Debug info
      console.log("User object:", JSON.stringify({
        id: user.id,
        email: user.email
      }));
      
      // Prepare notification preferences in JSON format
      const notificationPreferences = JSON.stringify({
        email: notificationSettings.emailNotifications,
        push: notificationSettings.pushNotifications,
        marketing: notificationSettings.marketingEmails,
        messages: notificationSettings.messageNotifications,
        reviews: notificationSettings.reviewNotifications,
        bookings: notificationSettings.bookingNotifications
      });
      
      console.log("Notification preferences to save:", notificationPreferences);
      
      // Try using API endpoint first (create if it doesn't exist)
      try {
        console.log("Attempting to save via API endpoint...");
        const response = await fetch('/api/profile/notifications', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ notification_preferences: notificationPreferences })
        });
        
        if (response.ok) {
          const data = await response.json();
          console.log("Notification settings saved via API:", data);
          
          // Success path
          clearTimeout(safetyTimeout);
          setIsSaving(false);
          
          await refreshProfile();
          
          toast({
            title: "Settings Saved",
            description: "Your notification preferences have been updated.",
            variant: "default"
          });
          
          return;
        } else {
          console.warn("API endpoint not available or returned error, falling back to direct update");
        }
      } catch (apiError) {
        console.warn("Error using API endpoint, falling back to direct update:", apiError);
      }
      
      // Fall back to direct Supabase update if API fails
      const userId = user.id.trim();
      console.log("User ID for update (cleaned):", userId);
      
      if (!userId) {
        throw new Error("Invalid user ID: empty after trimming");
      }
      
      console.log("Trying alternative approach...");
      
      // First check if the notification_preferences column exists
      try {
        console.log("Checking if profile exists and has notification_preferences column...");
        const { data, error } = await supabase
          .from('profiles')
          .select('id, notification_preferences')
          .eq('id', userId)
          .maybeSingle();
        
        // If the query succeeds (even with no data), the column exists
        console.log("Column check result:", { data, error });
        
        if (error) {
          // If the error is about the column, we need to add it
          if (error.message?.includes("column") && error.message?.includes("notification_preferences")) {
            console.warn("notification_preferences column doesn't exist.");
            throw new Error("Database schema issue: The notification_preferences column is missing.");
          }
        }
        
        // If we got this far, attempt the update
        console.log("Attempting direct update of notification preferences...");
        const updateResult = await supabase
          .from('profiles')
          .update({
            notification_preferences: notificationPreferences
          })
          .eq('id', userId);
        
        if (updateResult.error) {
          console.error("Update error:", updateResult.error);
          throw new Error(updateResult.error.message);
        }
        
        console.log("Notification settings updated successfully");
        
        clearTimeout(safetyTimeout);
        setIsSaving(false);
        
        await refreshProfile();
        
        toast({
          title: "Settings Saved",
          description: "Your notification preferences have been updated.",
          variant: "default"
        });
      } catch (error) {
        console.error("Error saving notification settings:", error);
        
        let errorMessage = "Failed to save notification settings";
        
        if (error instanceof Error) {
          errorMessage = error.message;
          
          if (errorMessage.includes("column") || errorMessage.includes("notification_preferences")) {
            errorMessage = "The database is missing required columns. Please run the database fix script from HOW_TO_FIX_PROFILE_TIMEOUT.md.";
          }
        }
        
        clearTimeout(safetyTimeout);
        setIsSaving(false);
        
        toast({
          title: "Failed to Save Settings",
          description: errorMessage,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Top-level error in saveNotificationSettings:", error);
      
      clearTimeout(safetyTimeout);
      setIsSaving(false);
      
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
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
