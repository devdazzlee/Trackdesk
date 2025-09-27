"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { 
  Settings, 
  Save, 
  DollarSign, 
  Users, 
  Shield, 
  Bell,
  AlertCircle,
  CheckCircle,
  Calendar,
  CreditCard
} from "lucide-react"
import { toast } from "sonner"

export default function SystemSettingsPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [settings, setSettings] = useState({
    // General Settings
    general: {
      programName: "AffiliateHub",
      programDescription: "Professional affiliate management platform",
      timezone: "America/New_York",
      currency: "USD",
      language: "en"
    },
    // Commission Settings
    commission: {
      defaultRate: 30,
      minimumPayout: 50.00,
      payoutFrequency: "Monthly",
      approvalPeriod: 30,
      cookieDuration: 30
    },
    // Affiliate Settings
    affiliate: {
      autoApprove: false,
      requireApproval: true,
      maxAffiliates: 1000,
      allowSelfReferrals: false,
      tierBasedCommissions: true
    },
    // Security Settings
    security: {
      twoFactorRequired: false,
      ipWhitelist: false,
      sessionTimeout: 30,
      passwordPolicy: "strong",
      auditLogging: true
    },
    // Notification Settings
    notifications: {
      emailNotifications: true,
      adminAlerts: true,
      affiliateWelcome: true,
      payoutNotifications: true,
      systemMaintenance: true
    }
  })

  const handleSave = async () => {
    setIsLoading(true)
    // Simulate save
    setTimeout(() => {
      setIsLoading(false)
      toast.success("Settings saved successfully!")
    }, 1000)
  }

  const handleSettingChange = (section: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [key]: value
      }
    }))
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">System Settings</h1>
          <p className="text-slate-600">Configure your affiliate program settings</p>
        </div>
        <Button onClick={handleSave} disabled={isLoading}>
          <Save className="h-4 w-4 mr-2" />
          {isLoading ? "Saving..." : "Save Settings"}
        </Button>
      </div>

      {/* General Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Settings className="h-5 w-5 mr-2" />
            General Settings
          </CardTitle>
          <CardDescription>Basic program configuration</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="programName">Program Name</Label>
              <Input
                id="programName"
                value={settings.general.programName}
                onChange={(e) => handleSettingChange("general", "programName", e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <Select value={settings.general.timezone} onValueChange={(value) => handleSettingChange("general", "timezone", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                  <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                  <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                  <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                  <SelectItem value="Europe/London">London (GMT)</SelectItem>
                  <SelectItem value="Europe/Paris">Paris (CET)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Select value={settings.general.currency} onValueChange={(value) => handleSettingChange("general", "currency", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD - US Dollar</SelectItem>
                  <SelectItem value="EUR">EUR - Euro</SelectItem>
                  <SelectItem value="GBP">GBP - British Pound</SelectItem>
                  <SelectItem value="CAD">CAD - Canadian Dollar</SelectItem>
                  <SelectItem value="AUD">AUD - Australian Dollar</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="language">Language</Label>
              <Select value={settings.general.language} onValueChange={(value) => handleSettingChange("general", "language", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Spanish</SelectItem>
                  <SelectItem value="fr">French</SelectItem>
                  <SelectItem value="de">German</SelectItem>
                  <SelectItem value="it">Italian</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="programDescription">Program Description</Label>
            <textarea
              id="programDescription"
              value={settings.general.programDescription}
              onChange={(e) => handleSettingChange("general", "programDescription", e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </CardContent>
      </Card>

      {/* Commission Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <DollarSign className="h-5 w-5 mr-2" />
            Commission Settings
          </CardTitle>
          <CardDescription>Configure commission rates and payout terms</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="defaultRate">Default Commission Rate (%)</Label>
              <Input
                id="defaultRate"
                type="number"
                value={settings.commission.defaultRate}
                onChange={(e) => handleSettingChange("commission", "defaultRate", parseInt(e.target.value))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="minimumPayout">Minimum Payout ($)</Label>
              <Input
                id="minimumPayout"
                type="number"
                step="0.01"
                value={settings.commission.minimumPayout}
                onChange={(e) => handleSettingChange("commission", "minimumPayout", parseFloat(e.target.value))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="payoutFrequency">Payout Frequency</Label>
              <Select value={settings.commission.payoutFrequency} onValueChange={(value) => handleSettingChange("commission", "payoutFrequency", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Weekly">Weekly</SelectItem>
                  <SelectItem value="Monthly">Monthly</SelectItem>
                  <SelectItem value="Quarterly">Quarterly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="approvalPeriod">Approval Period (days)</Label>
              <Input
                id="approvalPeriod"
                type="number"
                value={settings.commission.approvalPeriod}
                onChange={(e) => handleSettingChange("commission", "approvalPeriod", parseInt(e.target.value))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="cookieDuration">Cookie Duration (days)</Label>
              <Input
                id="cookieDuration"
                type="number"
                value={settings.commission.cookieDuration}
                onChange={(e) => handleSettingChange("commission", "cookieDuration", parseInt(e.target.value))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Affiliate Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="h-5 w-5 mr-2" />
            Affiliate Settings
          </CardTitle>
          <CardDescription>Configure affiliate registration and management</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="autoApprove">Auto-Approve Affiliates</Label>
                <p className="text-sm text-slate-500">Automatically approve new affiliate applications</p>
              </div>
              <Switch
                id="autoApprove"
                checked={settings.affiliate.autoApprove}
                onCheckedChange={(checked) => handleSettingChange("affiliate", "autoApprove", checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="requireApproval">Require Manual Approval</Label>
                <p className="text-sm text-slate-500">Require manual approval for all applications</p>
              </div>
              <Switch
                id="requireApproval"
                checked={settings.affiliate.requireApproval}
                onCheckedChange={(checked) => handleSettingChange("affiliate", "requireApproval", checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="allowSelfReferrals">Allow Self-Referrals</Label>
                <p className="text-sm text-slate-500">Allow affiliates to refer themselves</p>
              </div>
              <Switch
                id="allowSelfReferrals"
                checked={settings.affiliate.allowSelfReferrals}
                onCheckedChange={(checked) => handleSettingChange("affiliate", "allowSelfReferrals", checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="tierBasedCommissions">Tier-Based Commissions</Label>
                <p className="text-sm text-slate-500">Enable different commission rates by tier</p>
              </div>
              <Switch
                id="tierBasedCommissions"
                checked={settings.affiliate.tierBasedCommissions}
                onCheckedChange={(checked) => handleSettingChange("affiliate", "tierBasedCommissions", checked)}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="maxAffiliates">Maximum Affiliates</Label>
            <Input
              id="maxAffiliates"
              type="number"
              value={settings.affiliate.maxAffiliates}
              onChange={(e) => handleSettingChange("affiliate", "maxAffiliates", parseInt(e.target.value))}
            />
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="h-5 w-5 mr-2" />
            Security Settings
          </CardTitle>
          <CardDescription>Configure security and access controls</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="twoFactorRequired">Require Two-Factor Authentication</Label>
                <p className="text-sm text-slate-500">Force all users to enable 2FA</p>
              </div>
              <Switch
                id="twoFactorRequired"
                checked={settings.security.twoFactorRequired}
                onCheckedChange={(checked) => handleSettingChange("security", "twoFactorRequired", checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="ipWhitelist">IP Whitelist</Label>
                <p className="text-sm text-slate-500">Restrict access to specific IP addresses</p>
              </div>
              <Switch
                id="ipWhitelist"
                checked={settings.security.ipWhitelist}
                onCheckedChange={(checked) => handleSettingChange("security", "ipWhitelist", checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="auditLogging">Audit Logging</Label>
                <p className="text-sm text-slate-500">Log all system activities</p>
              </div>
              <Switch
                id="auditLogging"
                checked={settings.security.auditLogging}
                onCheckedChange={(checked) => handleSettingChange("security", "auditLogging", checked)}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
              <Input
                id="sessionTimeout"
                type="number"
                value={settings.security.sessionTimeout}
                onChange={(e) => handleSettingChange("security", "sessionTimeout", parseInt(e.target.value))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="passwordPolicy">Password Policy</Label>
              <Select value={settings.security.passwordPolicy} onValueChange={(value) => handleSettingChange("security", "passwordPolicy", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="basic">Basic (8+ characters)</SelectItem>
                  <SelectItem value="strong">Strong (12+ chars, mixed case, numbers)</SelectItem>
                  <SelectItem value="very-strong">Very Strong (16+ chars, special chars)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bell className="h-5 w-5 mr-2" />
            Notification Settings
          </CardTitle>
          <CardDescription>Configure system notifications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="emailNotifications">Email Notifications</Label>
                <p className="text-sm text-slate-500">Send email notifications for system events</p>
              </div>
              <Switch
                id="emailNotifications"
                checked={settings.notifications.emailNotifications}
                onCheckedChange={(checked) => handleSettingChange("notifications", "emailNotifications", checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="adminAlerts">Admin Alerts</Label>
                <p className="text-sm text-slate-500">Send alerts to administrators</p>
              </div>
              <Switch
                id="adminAlerts"
                checked={settings.notifications.adminAlerts}
                onCheckedChange={(checked) => handleSettingChange("notifications", "adminAlerts", checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="affiliateWelcome">Affiliate Welcome Emails</Label>
                <p className="text-sm text-slate-500">Send welcome emails to new affiliates</p>
              </div>
              <Switch
                id="affiliateWelcome"
                checked={settings.notifications.affiliateWelcome}
                onCheckedChange={(checked) => handleSettingChange("notifications", "affiliateWelcome", checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="payoutNotifications">Payout Notifications</Label>
                <p className="text-sm text-slate-500">Notify affiliates of payout status</p>
              </div>
              <Switch
                id="payoutNotifications"
                checked={settings.notifications.payoutNotifications}
                onCheckedChange={(checked) => handleSettingChange("notifications", "payoutNotifications", checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="systemMaintenance">System Maintenance Alerts</Label>
                <p className="text-sm text-slate-500">Notify users of scheduled maintenance</p>
              </div>
              <Switch
                id="systemMaintenance"
                checked={settings.notifications.systemMaintenance}
                onCheckedChange={(checked) => handleSettingChange("notifications", "systemMaintenance", checked)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle>System Status</CardTitle>
          <CardDescription>Current system health and status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-medium text-slate-900 mb-1">System Health</h3>
              <Badge variant="default" className="bg-green-600">Operational</Badge>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-medium text-slate-900 mb-1">Last Backup</h3>
              <Badge variant="outline">2 hours ago</Badge>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <CreditCard className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-medium text-slate-900 mb-1">Payment System</h3>
              <Badge variant="default" className="bg-green-600">Connected</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Important Notice */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-6">
          <div className="flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-800">Settings Change Notice</h4>
              <p className="text-sm text-blue-700 mt-1">
                Changes to system settings may take effect immediately. Some changes may require system restart or 
                affect active users. Please review all changes carefully before saving.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
