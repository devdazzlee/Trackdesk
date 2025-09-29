"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { 
  Shield, 
  Key, 
  Smartphone, 
  Mail, 
  AlertTriangle,
  CheckCircle,
  Eye,
  EyeOff,
  Save,
  QrCode
} from "lucide-react"
import { toast } from "sonner"

export default function SecurityPage() {
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  })
  const [isLoading, setIsLoading] = useState(false)
  
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    emailVerification: true,
    loginAlerts: true,
    sessionTimeout: 30,
    passwordExpiry: 90
  })

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Simulate password change
    setTimeout(() => {
      setIsLoading(false)
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
      toast.success("Password changed successfully!")
    }, 1000)
  }

  const handleSecuritySettingChange = (key: string, value: boolean | number) => {
    setSecuritySettings(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const togglePasswordVisibility = (field: string) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field as keyof typeof prev]
    }))
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Security Settings</h1>
          <p className="text-slate-600">Manage your account security and authentication</p>
        </div>
      </div>

      {/* Security Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="h-5 w-5 mr-2" />
            Security Status
          </CardTitle>
          <CardDescription>Your current security configuration</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-medium text-slate-900 mb-1">Password Strength</h3>
              <Badge variant="default" className="bg-green-600">Strong</Badge>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <AlertTriangle className="h-6 w-6 text-yellow-600" />
              </div>
              <h3 className="font-medium text-slate-900 mb-1">Two-Factor Auth</h3>
              <Badge variant="outline" className="border-yellow-300 text-yellow-700">Disabled</Badge>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Mail className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-medium text-slate-900 mb-1">Email Verification</h3>
              <Badge variant="default" className="bg-blue-600">Enabled</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Change Password */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Key className="h-5 w-5 mr-2" />
            Change Password
          </CardTitle>
          <CardDescription>Update your account password</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordChange} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <div className="relative">
                <Input
                  id="currentPassword"
                  type={showPasswords.current ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter your current password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => togglePasswordVisibility("current")}
                >
                  {showPasswords.current ? (
                    <EyeOff className="h-4 w-4 text-slate-500" />
                  ) : (
                    <Eye className="h-4 w-4 text-slate-500" />
                  )}
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showPasswords.new ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter your new password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => togglePasswordVisibility("new")}
                >
                  {showPasswords.new ? (
                    <EyeOff className="h-4 w-4 text-slate-500" />
                  ) : (
                    <Eye className="h-4 w-4 text-slate-500" />
                  )}
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showPasswords.confirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your new password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => togglePasswordVisibility("confirm")}
                >
                  {showPasswords.confirm ? (
                    <EyeOff className="h-4 w-4 text-slate-500" />
                  ) : (
                    <Eye className="h-4 w-4 text-slate-500" />
                  )}
                </Button>
              </div>
            </div>
            
            <Button type="submit" disabled={isLoading} className="w-full">
              <Save className="h-4 w-4 mr-2" />
              {isLoading ? "Changing Password..." : "Change Password"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Two-Factor Authentication */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Smartphone className="h-5 w-5 mr-2" />
            Two-Factor Authentication
          </CardTitle>
          <CardDescription>Add an extra layer of security to your account</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
            <div>
              <h4 className="font-medium text-slate-900">Enable Two-Factor Authentication</h4>
              <p className="text-sm text-slate-600 mt-1">
                Use an authenticator app to generate verification codes
              </p>
            </div>
            <Switch
              checked={securitySettings.twoFactorAuth}
              onCheckedChange={(checked) => handleSecuritySettingChange("twoFactorAuth", checked)}
            />
          </div>
          
          {securitySettings.twoFactorAuth && (
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h5 className="font-medium text-blue-900 mb-2">Setup Instructions</h5>
                <ol className="text-sm text-blue-700 space-y-1">
                  <li>1. Download an authenticator app (Google Authenticator, Authy, etc.)</li>
                  <li>2. Scan the QR code below with your authenticator app</li>
                  <li>3. Enter the verification code to complete setup</li>
                </ol>
              </div>
              
              <div className="text-center">
                <div className="w-48 h-48 bg-slate-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <QrCode className="h-24 w-24 text-slate-400" />
                </div>
                <p className="text-sm text-slate-500 mb-4">
                  Scan this QR code with your authenticator app
                </p>
                <Button variant="outline" size="sm">
                  Generate New QR Code
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Security Preferences */}
      <Card>
        <CardHeader>
          <CardTitle>Security Preferences</CardTitle>
          <CardDescription>Configure your security settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="emailVerification">Email Verification</Label>
                <p className="text-sm text-slate-500">Require email verification for important changes</p>
              </div>
              <Switch
                id="emailVerification"
                checked={securitySettings.emailVerification}
                onCheckedChange={(checked) => handleSecuritySettingChange("emailVerification", checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="loginAlerts">Login Alerts</Label>
                <p className="text-sm text-slate-500">Get notified of new login attempts</p>
              </div>
              <Switch
                id="loginAlerts"
                checked={securitySettings.loginAlerts}
                onCheckedChange={(checked) => handleSecuritySettingChange("loginAlerts", checked)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Security Activity</CardTitle>
          <CardDescription>Your recent account activity and security events</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium text-green-900">Successful Login</p>
                  <p className="text-sm text-green-700">New York, NY • Chrome on Windows</p>
                </div>
              </div>
              <span className="text-sm text-slate-500">2 hours ago</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium text-blue-900">Email Verification</p>
                  <p className="text-sm text-blue-700">Email address verified successfully</p>
                </div>
              </div>
              <span className="text-sm text-slate-500">1 day ago</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                <div>
                  <p className="font-medium text-yellow-900">Failed Login Attempt</p>
                  <p className="text-sm text-yellow-700">Unknown location • Firefox on Mac</p>
                </div>
              </div>
              <span className="text-sm text-slate-500">3 days ago</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Tips */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-6">
          <div className="flex items-start space-x-3">
            <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-800">Security Tips</h4>
              <ul className="text-sm text-blue-700 mt-2 space-y-1">
                <li>• Use a strong, unique password for your account</li>
                <li>• Enable two-factor authentication for added security</li>
                <li>• Regularly review your account activity</li>
                <li>• Log out from shared or public computers</li>
                <li>• Keep your contact information up to date</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


