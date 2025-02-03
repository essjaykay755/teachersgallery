"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Settings,
  Bell,
  Mail,
  Percent,
  Shield,
  Users,
  BookOpen,
  MessageSquare,
  Star
} from "lucide-react"

// Mock settings data
const notificationSettings = {
  emailNotifications: true,
  pushNotifications: true,
  messageAlerts: true,
  reviewAlerts: true,
  paymentAlerts: true,
  securityAlerts: true
}

const commissionRates = {
  standardRate: "15",
  featuredRate: "20",
  subscriptionRate: "10",
  minimumPayout: "1000",
  weeklyFeaturePrice: "49",
  monthlyFeaturePrice: "99"
}

const verificationSettings = {
  requireIdProof: true,
  requireCertificates: true,
  autoApproveTeachers: false,
  autoApproveReviews: false
}

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState("general")
  const [settings, setSettings] = useState({
    notifications: { ...notificationSettings },
    commission: { ...commissionRates },
    verification: { ...verificationSettings }
  })

  const handleNotificationToggle = (key: string) => {
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: !prev.notifications[key as keyof typeof notificationSettings]
      }
    }))
  }

  const handleCommissionChange = (key: string, value: string) => {
    setSettings(prev => ({
      ...prev,
      commission: {
        ...prev.commission,
        [key]: value
      }
    }))
  }

  const handleVerificationToggle = (key: string) => {
    setSettings(prev => ({
      ...prev,
      verification: {
        ...prev.verification,
        [key]: !prev.verification[key as keyof typeof verificationSettings]
      }
    }))
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Admin Settings</h1>
          <p className="text-gray-500">Configure system-wide settings and preferences</p>
        </div>
        <Button>Save Changes</Button>
      </div>

      {/* Settings Tabs */}
      <Card>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="general">
              <div className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                General
              </div>
            </TabsTrigger>
            <TabsTrigger value="notifications">
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                Notifications
              </div>
            </TabsTrigger>
            <TabsTrigger value="commission">
              <div className="flex items-center gap-2">
                <Percent className="h-4 w-4" />
                Commission
              </div>
            </TabsTrigger>
            <TabsTrigger value="verification">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Verification
              </div>
            </TabsTrigger>
          </TabsList>

          <div className="p-6">
            {/* General Settings */}
            <TabsContent value="general">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Platform Settings</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Platform Name</Label>
                        <Input defaultValue="TeachersGallery" />
                      </div>
                      <div className="space-y-2">
                        <Label>Support Email</Label>
                        <Input defaultValue="support@teachersgallery.com" type="email" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Platform Description</Label>
                      <textarea 
                        className="w-full min-h-[100px] p-3 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        defaultValue="Connect with the best teachers in your area"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Timezone</Label>
                      <Select defaultValue="IST">
                        <SelectTrigger>
                          <SelectValue placeholder="Select timezone" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="IST">India Standard Time (IST)</SelectItem>
                          <SelectItem value="UTC">Coordinated Universal Time (UTC)</SelectItem>
                          <SelectItem value="EST">Eastern Standard Time (EST)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-4">Features</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Teacher Registration</Label>
                        <p className="text-sm text-gray-500">Allow new teacher registrations</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Student Registration</Label>
                        <p className="text-sm text-gray-500">Allow new student registrations</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Maintenance Mode</Label>
                        <p className="text-sm text-gray-500">Put platform in maintenance mode</p>
                      </div>
                      <Switch />
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Notification Settings */}
            <TabsContent value="notifications">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Email Notifications</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center">
                          <Mail className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <Label>Email Notifications</Label>
                          <p className="text-sm text-gray-500">Receive email notifications</p>
                        </div>
                      </div>
                      <Switch 
                        checked={settings.notifications.emailNotifications}
                        onCheckedChange={() => handleNotificationToggle('emailNotifications')}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center">
                          <Users className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <Label>New User Alerts</Label>
                          <p className="text-sm text-gray-500">Get notified about new user registrations</p>
                        </div>
                      </div>
                      <Switch 
                        checked={settings.notifications.pushNotifications}
                        onCheckedChange={() => handleNotificationToggle('pushNotifications')}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center">
                          <BookOpen className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <Label>Booking Alerts</Label>
                          <p className="text-sm text-gray-500">Get notified about new bookings</p>
                        </div>
                      </div>
                      <Switch 
                        checked={settings.notifications.messageAlerts}
                        onCheckedChange={() => handleNotificationToggle('messageAlerts')}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center">
                          <MessageSquare className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <Label>Message Alerts</Label>
                          <p className="text-sm text-gray-500">Get notified about new messages</p>
                        </div>
                      </div>
                      <Switch 
                        checked={settings.notifications.reviewAlerts}
                        onCheckedChange={() => handleNotificationToggle('reviewAlerts')}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center">
                          <Star className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <Label>Review Alerts</Label>
                          <p className="text-sm text-gray-500">Get notified about new reviews</p>
                        </div>
                      </div>
                      <Switch 
                        checked={settings.notifications.paymentAlerts}
                        onCheckedChange={() => handleNotificationToggle('paymentAlerts')}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Commission Settings */}
            <TabsContent value="commission">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Featured Teacher Pricing</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Weekly Feature Price (₹)</Label>
                        <Input 
                          type="number" 
                          value={settings.commission.weeklyFeaturePrice}
                          onChange={(e) => handleCommissionChange('weeklyFeaturePrice', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Monthly Feature Price (₹)</Label>
                        <Input 
                          type="number"
                          value={settings.commission.monthlyFeaturePrice}
                          onChange={(e) => handleCommissionChange('monthlyFeaturePrice', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-4">Payment Settings</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Payment Gateway</Label>
                      <Select defaultValue="razorpay">
                        <SelectTrigger>
                          <SelectValue placeholder="Select payment gateway" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="razorpay">Razorpay</SelectItem>
                          <SelectItem value="stripe">Stripe</SelectItem>
                          <SelectItem value="paytm">Paytm</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Verification Settings */}
            <TabsContent value="verification">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Teacher Verification</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Require ID Proof</Label>
                        <p className="text-sm text-gray-500">Require teachers to submit ID proof</p>
                      </div>
                      <Switch 
                        checked={settings.verification.requireIdProof}
                        onCheckedChange={() => handleVerificationToggle('requireIdProof')}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Require Certificates</Label>
                        <p className="text-sm text-gray-500">Require teachers to submit educational certificates</p>
                      </div>
                      <Switch 
                        checked={settings.verification.requireCertificates}
                        onCheckedChange={() => handleVerificationToggle('requireCertificates')}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Auto-approve Teachers</Label>
                        <p className="text-sm text-gray-500">Automatically approve new teacher registrations</p>
                      </div>
                      <Switch 
                        checked={settings.verification.autoApproveTeachers}
                        onCheckedChange={() => handleVerificationToggle('autoApproveTeachers')}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-4">Content Moderation</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Auto-approve Reviews</Label>
                        <p className="text-sm text-gray-500">Automatically approve new reviews</p>
                      </div>
                      <Switch 
                        checked={settings.verification.autoApproveReviews}
                        onCheckedChange={() => handleVerificationToggle('autoApproveReviews')}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </Card>
    </div>
  )
} 