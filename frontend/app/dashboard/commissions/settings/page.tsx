"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { 
  CreditCard, 
  Bell, 
  Shield, 
  Save,
  AlertCircle,
  CheckCircle,
  DollarSign,
  Calendar,
  Mail
} from "lucide-react"
import { toast } from "sonner"

export default function PayoutSettingsPage() {
  const [settings, setSettings] = useState({
    paymentMethod: "PayPal",
    paymentEmail: "affiliate@example.com",
    minimumPayout: 50.00,
    frequency: "Monthly",
    notifications: {
      payoutProcessed: true,
      payoutFailed: true,
      commissionApproved: true,
      monthlyReport: true,
      lowBalance: true
    },
    security: {
      twoFactorAuth: false,
      emailVerification: true,
      loginAlerts: true
    }
  })

  const [isLoading, setIsLoading] = useState(false)

  const handleSave = async () => {
    setIsLoading(true)
    // Simulate save
    setTimeout(() => {
      setIsLoading(false)
      toast.success("Settings saved successfully!")
    }, 1000)
  }

  const handleNotificationChange = (key: string, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: value
      }
    }))
  }

  const handleSecurityChange = (key: string, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      security: {
        ...prev.security,
        [key]: value
      }
    }))
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Payout Settings</h1>
          <p className="text-slate-600">Configure your payout preferences and notification settings</p>
        </div>
        <Button onClick={handleSave} disabled={isLoading}>
          <Save className="h-4 w-4 mr-2" />
          {isLoading ? "Saving..." : "Save Settings"}
        </Button>
      </div>

      {/* Current Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
            Account Status
          </CardTitle>
          <CardDescription>Your current payout configuration</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <CreditCard className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-medium">Payment Method</h3>
              <p className="text-sm text-slate-500">{settings.paymentMethod}</p>
              <Badge variant="default" className="mt-1">Active</Badge>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-medium">Available Balance</h3>
              <p className="text-sm text-slate-500">$351.00</p>
              <Badge variant="outline" className="mt-1">Ready for payout</Badge>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Calendar className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-medium">Next Payout</h3>
              <p className="text-sm text-slate-500">February 1, 2024</p>
              <Badge variant="secondary" className="mt-1">Scheduled</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payout Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CreditCard className="h-5 w-5 mr-2" />
            Payout Configuration
          </CardTitle>
          <CardDescription>Set up your payment method and preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="paymentMethod">Payment Method</Label>
              <Select value={settings.paymentMethod} onValueChange={(value) => setSettings(prev => ({ ...prev, paymentMethod: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PayPal">PayPal</SelectItem>
                  <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                  <SelectItem value="Wire Transfer">Wire Transfer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="paymentEmail">Payment Email</Label>
              <Input
                id="paymentEmail"
                type="email"
                value={settings.paymentEmail}
                onChange={(e) => setSettings(prev => ({ ...prev, paymentEmail: e.target.value }))}
                placeholder="Enter your payment email"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="minimumPayout">Minimum Payout</Label>
              <Input
                id="minimumPayout"
                type="number"
                value={settings.minimumPayout}
                onChange={(e) => setSettings(prev => ({ ...prev, minimumPayout: parseFloat(e.target.value) }))}
                placeholder="50.00"
              />
              <p className="text-xs text-slate-500">Minimum amount required for payout</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="frequency">Payout Frequency</Label>
              <Select value={settings.frequency} onValueChange={(value) => setSettings(prev => ({ ...prev, frequency: value }))}>
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
          <CardDescription>Choose what notifications you want to receive</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="payoutProcessed">Payout Processed</Label>
                <p className="text-sm text-slate-500">Get notified when your payout is processed</p>
              </div>
              <Switch
                id="payoutProcessed"
                checked={settings.notifications.payoutProcessed}
                onCheckedChange={(checked) => handleNotificationChange("payoutProcessed", checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="payoutFailed">Payout Failed</Label>
                <p className="text-sm text-slate-500">Get notified if a payout fails</p>
              </div>
              <Switch
                id="payoutFailed"
                checked={settings.notifications.payoutFailed}
                onCheckedChange={(checked) => handleNotificationChange("payoutFailed", checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="commissionApproved">Commission Approved</Label>
                <p className="text-sm text-slate-500">Get notified when commissions are approved</p>
              </div>
              <Switch
                id="commissionApproved"
                checked={settings.notifications.commissionApproved}
                onCheckedChange={(checked) => handleNotificationChange("commissionApproved", checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="monthlyReport">Monthly Report</Label>
                <p className="text-sm text-slate-500">Receive monthly performance reports</p>
              </div>
              <Switch
                id="monthlyReport"
                checked={settings.notifications.monthlyReport}
                onCheckedChange={(checked) => handleNotificationChange("monthlyReport", checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="lowBalance">Low Balance Alert</Label>
                <p className="text-sm text-slate-500">Get notified when balance is low</p>
              </div>
              <Switch
                id="lowBalance"
                checked={settings.notifications.lowBalance}
                onCheckedChange={(checked) => handleNotificationChange("lowBalance", checked)}
              />
            </div>
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
          <CardDescription>Manage your account security preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="twoFactorAuth">Two-Factor Authentication</Label>
                <p className="text-sm text-slate-500">Add an extra layer of security to your account</p>
              </div>
              <Switch
                id="twoFactorAuth"
                checked={settings.security.twoFactorAuth}
                onCheckedChange={(checked) => handleSecurityChange("twoFactorAuth", checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="emailVerification">Email Verification</Label>
                <p className="text-sm text-slate-500">Verify important changes via email</p>
              </div>
              <Switch
                id="emailVerification"
                checked={settings.security.emailVerification}
                onCheckedChange={(checked) => handleSecurityChange("emailVerification", checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="loginAlerts">Login Alerts</Label>
                <p className="text-sm text-slate-500">Get notified of new login attempts</p>
              </div>
              <Switch
                id="loginAlerts"
                checked={settings.security.loginAlerts}
                onCheckedChange={(checked) => handleSecurityChange("loginAlerts", checked)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Important Information */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-6">
          <div className="flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-800">Important Information</h4>
              <ul className="text-sm text-blue-700 mt-2 space-y-1">
                <li>• Payout settings changes take effect from the next payout cycle</li>
                <li>• Minimum payout threshold is $50.00</li>
                <li>• PayPal payments are processed within 2-3 business days</li>
                <li>• Failed payments will be automatically retried</li>
                <li>• Contact support if you need to change payment methods</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


