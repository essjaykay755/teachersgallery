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

export default function AccountSettingsPage() {
  const { user, profile } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [isClient, setIsClient] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);
  const [messageNotifications, setMessageNotifications] = useState(true);
  const [reviewNotifications, setReviewNotifications] = useState(true);
  const [bookingNotifications, setBookingNotifications] = useState(true);
  
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  // Mock user data for demonstration
  const mockUser = {
    name: profile?.full_name || "Sam Fisher",
    email: user?.email || "user@example.com",
    phone: profile?.phone || "+91 9876543210",
    avatar: profile?.avatar_url || "/avatar.jpg",
    type: profile?.user_type || "teacher",
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAvatarFile(e.target.files[0]);
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
                        src={mockUser.avatar}
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
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" defaultValue={mockUser.name} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" defaultValue={mockUser.email} readOnly />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input id="phone" defaultValue={mockUser.phone} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="userType">User Type</Label>
                      <Select defaultValue={mockUser.type}>
                        <SelectTrigger id="userType">
                          <SelectValue placeholder="Select user type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="teacher">Teacher</SelectItem>
                          <SelectItem value="student">Student</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      placeholder="Tell us about yourself"
                      className="h-32"
                    />
                  </div>

                  <Button>Save Profile</Button>
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
                      <Input type="password" placeholder="Current password" />
                      <Input type="password" placeholder="New password" />
                      <Input type="password" placeholder="Confirm new password" />
                      <Button className="w-full">Update Password</Button>
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
                        checked={emailNotifications} 
                        onCheckedChange={setEmailNotifications} 
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="push-notifications">Push Notifications</Label>
                        <p className="text-sm text-gray-500">Receive push notifications</p>
                      </div>
                      <Switch 
                        id="push-notifications"
                        checked={pushNotifications} 
                        onCheckedChange={setPushNotifications} 
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="marketing-emails">Marketing Emails</Label>
                        <p className="text-sm text-gray-500">Receive marketing and promotional emails</p>
                      </div>
                      <Switch 
                        id="marketing-emails"
                        checked={marketingEmails} 
                        onCheckedChange={setMarketingEmails} 
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
                          checked={messageNotifications} 
                          onCheckedChange={setMessageNotifications} 
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="review-notifications">Reviews</Label>
                          <p className="text-sm text-gray-500">Receive notifications when you get new reviews</p>
                        </div>
                        <Switch 
                          id="review-notifications"
                          checked={reviewNotifications} 
                          onCheckedChange={setReviewNotifications} 
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="booking-notifications">Bookings</Label>
                          <p className="text-sm text-gray-500">Receive notifications for booking requests and confirmations</p>
                        </div>
                        <Switch 
                          id="booking-notifications"
                          checked={bookingNotifications} 
                          onCheckedChange={setBookingNotifications} 
                        />
                      </div>
                    </div>
                  </div>

                  <Button className="mt-6">Save Notification Settings</Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
