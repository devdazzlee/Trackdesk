"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { 
  Bell, 
  Mail, 
  Smartphone, 
  MessageCircle,
  DollarSign,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Save
} from "lucide-react"
import { toast } from "sonner"

export default function NotificationsPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [notificationSettings, setNotificationSettings] = useState({
    // Email Notifications
    email: {
      payoutProcessed: true,
      payoutFailed: true,
      commissionApproved: true,
      commissionDeclined: true,
      monthlyReport: true,
      lowBalance: true,
      accountChanges: true,
      securityAlerts: true
    },
    // Push Notifications
    push: {
      payoutProcessed: false,
      payoutFailed: true,
      commissionApproved: true,
      commissionDeclined: true,
      lowBalance: true,
      securityAlerts: true
    },
    // SMS Notifications
    sms: {
      payoutProcessed: false,
      payoutFailed: true,
      securityAlerts: true
    },
    // Frequency Settings
    frequency: {
      email: "immediate",
      push: "immediate",
      sms: "immediate"
    }
  })

  const handleSave = async () => {
    setIsLoading(true)
    // Simulate save
    setTimeout(() => {
      setIsLoading(false)
      toast.success("Notification settings saved successfully!")
    }, 1000)
  }

  const handleEmailSettingChange = (key: string, value: boolean) => {
    setNotificationSettings(prev => ({
      ...prev,
      email: {
        ...prev.email,
        [key]: value
      }
    }))
  }

  const handlePushSettingChange = (key: string, value: boolean) => {
    setNotificationSettings(prev => ({
      ...prev,
      push: {
        ...prev.push,
        [key]: value
      }
    }))
  }

  const handleSMSSettingChange = (key: string, value: boolean) => {
    setNotificationSettings(prev => ({
      ...prev,
      sms: {
        ...prev.sms,
        [key]: value
      }
    }))
  }

  const handleFrequencyChange = (type: string, value: string) => {
    setNotificationSettings(prev => ({
      ...prev,
      frequency: {
        ...prev.frequency,
        [type]: value
      }
    }))
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Notification Settings</h1>
          <p className="text-slate-600">Manage how and when you receive notifications</p>
        </div>
        <Button onClick={handleSave} disabled={isLoading}>
          <Save className="h-4 w-4 mr-2" />
          {isLoading ? "Saving..." : "Save Settings"}
        </Button>
      </div>

      {/* Notification Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bell className="h-5 w-5 mr-2" />
            Notification Overview
          </CardTitle>
          <CardDescription>Your current notification configuration</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Mail className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-medium text-slate-900 mb-1">Email Notifications</h3>
              <Badge variant="default" className="bg-blue-600">8 Active</Badge>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Smartphone className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-medium text-slate-900 mb-1">Push Notifications</h3>
              <Badge variant="outline" className="border-green-300 text-green-700">4 Active</Badge>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <MessageCircle className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-medium text-slate-900 mb-1">SMS Notifications</h3>
              <Badge variant="outline" className="border-purple-300 text-purple-700">2 Active</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Email Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Mail className="h-5 w-5 mr-2" />
            Email Notifications
          </CardTitle>
          <CardDescription>Configure your email notification preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="payoutProcessed">Payout Processed</Label>
                <p className="text-sm text-slate-500">Get notified when your payout is processed</p>
              </div>
              <Switch
                id="payoutProcessed"
                checked={notificationSettings.email.payoutProcessed}
                onCheckedChange={(checked) => handleEmailSettingChange("payoutProcessed", checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="payoutFailed">Payout Failed</Label>
                <p className="text-sm text-slate-500">Get notified if a payout fails</p>
              </div>
              <Switch
                id="payoutFailed"
                checked={notificationSettings.email.payoutFailed}
                onCheckedChange={(checked) => handleEmailSettingChange("payoutFailed", checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="commissionApproved">Commission Approved</Label>
                <p className="text-sm text-slate-500">Get notified when commissions are approved</p>
              </div>
              <Switch
                id="commissionApproved"
                checked={notificationSettings.email.commissionApproved}
                onCheckedChange={(checked) => handleEmailSettingChange("commissionApproved", checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="commissionDeclined">Commission Declined</Label>
                <p className="text-sm text-slate-500">Get notified when commissions are declined</p>
              </div>
              <Switch
                id="commissionDeclined"
                checked={notificationSettings.email.commissionDeclined}
                onCheckedChange={(checked) => handleEmailSettingChange("commissionDeclined", checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="monthlyReport">Monthly Report</Label>
                <p className="text-sm text-slate-500">Receive monthly performance reports</p>
              </div>
              <Switch
                id="monthlyReport"
                checked={notificationSettings.email.monthlyReport}
                onCheckedChange={(checked) => handleEmailSettingChange("monthlyReport", checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="lowBalance">Low Balance Alert</Label>
                <p className="text-sm text-slate-500">Get notified when balance is low</p>
              </div>
              <Switch
                id="lowBalance"
                checked={notificationSettings.email.lowBalance}
                onCheckedChange={(checked) => handleEmailSettingChange("lowBalance", checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="accountChanges">Account Changes</Label>
                <p className="text-sm text-slate-500">Get notified of important account changes</p>
              </div>
              <Switch
                id="accountChanges"
                checked={notificationSettings.email.accountChanges}
                onCheckedChange={(checked) => handleEmailSettingChange("accountChanges", checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="securityAlerts">Security Alerts</Label>
                <p className="text-sm text-slate-500">Get notified of security-related events</p>
              </div>
              <Switch
                id="securityAlerts"
                checked={notificationSettings.email.securityAlerts}
                onCheckedChange={(checked) => handleEmailSettingChange("securityAlerts", checked)}
              />
            </div>
          </div>
          
          <div className="pt-4 border-t">
            <div className="space-y-2">
              <Label htmlFor="emailFrequency">Email Frequency</Label>
              <Select value={notificationSettings.frequency.email} onValueChange={(value) => handleFrequencyChange("email", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="immediate">Immediate</SelectItem>
                  <SelectItem value="daily">Daily Digest</SelectItem>
                  <SelectItem value="weekly">Weekly Summary</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Push Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Smartphone className="h-5 w-5 mr-2" />
            Push Notifications
          </CardTitle>
          <CardDescription>Configure your mobile push notification preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="pushPayoutProcessed">Payout Processed</Label>
                <p className="text-sm text-slate-500">Get push notifications for payouts</p>
              </div>
              <Switch
                id="pushPayoutProcessed"
                checked={notificationSettings.push.payoutProcessed}
                onCheckedChange={(checked) => handlePushSettingChange("payoutProcessed", checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="pushPayoutFailed">Payout Failed</Label>
                <p className="text-sm text-slate-500">Get push notifications for failed payouts</p>
              </div>
              <Switch
                id="pushPayoutFailed"
                checked={notificationSettings.push.payoutFailed}
                onCheckedChange={(checked) => handlePushSettingChange("payoutFailed", checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="pushCommissionApproved">Commission Approved</Label>
                <p className="text-sm text-slate-500">Get push notifications for approved commissions</p>
              </div>
              <Switch
                id="pushCommissionApproved"
                checked={notificationSettings.push.commissionApproved}
                onCheckedChange={(checked) => handlePushSettingChange("commissionApproved", checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="pushCommissionDeclined">Commission Declined</Label>
                <p className="text-sm text-slate-500">Get push notifications for declined commissions</p>
              </div>
              <Switch
                id="pushCommissionDeclined"
                checked={notificationSettings.push.commissionDeclined}
                onCheckedChange={(checked) => handlePushSettingChange("commissionDeclined", checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="pushLowBalance">Low Balance Alert</Label>
                <p className="text-sm text-slate-500">Get push notifications for low balance</p>
              </div>
              <Switch
                id="pushLowBalance"
                checked={notificationSettings.push.lowBalance}
                onCheckedChange={(checked) => handlePushSettingChange("lowBalance", checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="pushSecurityAlerts">Security Alerts</Label>
                <p className="text-sm text-slate-500">Get push notifications for security events</p>
              </div>
              <Switch
                id="pushSecurityAlerts"
                checked={notificationSettings.push.securityAlerts}
                onCheckedChange={(checked) => handlePushSettingChange("securityAlerts", checked)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SMS Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MessageCircle className="h-5 w-5 mr-2" />
            SMS Notifications
          </CardTitle>
          <CardDescription>Configure your SMS notification preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="smsPayoutProcessed">Payout Processed</Label>
                <p className="text-sm text-slate-500">Get SMS notifications for payouts</p>
              </div>
              <Switch
                id="smsPayoutProcessed"
                checked={notificationSettings.sms.payoutProcessed}
                onCheckedChange={(checked) => handleSMSSettingChange("payoutProcessed", checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="smsPayoutFailed">Payout Failed</Label>
                <p className="text-sm text-slate-500">Get SMS notifications for failed payouts</p>
              </div>
              <Switch
                id="smsPayoutFailed"
                checked={notificationSettings.sms.payoutFailed}
                onCheckedChange={(checked) => handleSMSSettingChange("payoutFailed", checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="smsSecurityAlerts">Security Alerts</Label>
                <p className="text-sm text-slate-500">Get SMS notifications for security events</p>
              </div>
              <Switch
                id="smsSecurityAlerts"
                checked={notificationSettings.sms.securityAlerts}
                onCheckedChange={(checked) => handleSMSSettingChange("securityAlerts", checked)}
              />
            </div>
          </div>
          
          <div className="p-4 bg-yellow-50 rounded-lg">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-yellow-800">SMS Notifications</h4>
                <p className="text-sm text-yellow-700 mt-1">
                  SMS notifications are only available for critical alerts. Standard messaging rates may apply.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notification History */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Notifications</CardTitle>
          <CardDescription>Your recent notification activity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium text-green-900">Payout Processed</p>
                  <p className="text-sm text-green-700">$450.00 payout completed successfully</p>
                </div>
              </div>
              <span className="text-sm text-slate-500">2 hours ago</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <DollarSign className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium text-blue-900">Commission Approved</p>
                  <p className="text-sm text-blue-700">$30.00 commission approved for Premium Plan</p>
                </div>
              </div>
              <span className="text-sm text-slate-500">1 day ago</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <TrendingUp className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="font-medium text-purple-900">Monthly Report</p>
                  <p className="text-sm text-purple-700">Your January 2024 performance report is ready</p>
                </div>
              </div>
              <span className="text-sm text-slate-500">3 days ago</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


