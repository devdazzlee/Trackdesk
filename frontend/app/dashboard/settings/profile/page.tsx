"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Save,
  Upload,
  Edit,
  CheckCircle,
  AlertCircle
} from "lucide-react"
import { toast } from "sonner"

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [profileData, setProfileData] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    company: "Digital Marketing Agency",
    website: "https://johndoe.com",
    location: "New York, NY",
    bio: "Experienced digital marketer with 5+ years in affiliate marketing. Specializing in SaaS products and B2B services.",
    joinDate: "2024-01-01",
    status: "active",
    tier: "Gold",
    totalEarnings: 1250.00
  })

  const handleSave = async () => {
    setIsLoading(true)
    // Simulate save
    setTimeout(() => {
      setIsLoading(false)
      setIsEditing(false)
      toast.success("Profile updated successfully!")
    }, 1000)
  }

  const handleInputChange = (field: string, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Profile Settings</h1>
          <p className="text-slate-600">Manage your personal information and account details</p>
        </div>
        <div className="flex items-center space-x-3">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={isLoading}>
                <Save className="h-4 w-4 mr-2" />
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          )}
        </div>
      </div>

      {/* Profile Overview */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start space-x-6">
            <div className="relative">
              <Avatar className="w-24 h-24">
                <AvatarImage src="/placeholder-avatar.jpg" />
                <AvatarFallback className="text-2xl">JD</AvatarFallback>
              </Avatar>
              {isEditing && (
                <Button
                  size="sm"
                  variant="outline"
                  className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full p-0"
                >
                  <Upload className="h-4 w-4" />
                </Button>
              )}
            </div>
            
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h2 className="text-2xl font-bold text-slate-900">
                  {profileData.firstName} {profileData.lastName}
                </h2>
                <Badge variant="default" className="bg-green-600">
                  {profileData.status}
                </Badge>
                <Badge variant="outline" className="border-yellow-300 text-yellow-700">
                  {profileData.tier} Tier
                </Badge>
              </div>
              
              <p className="text-slate-600 mb-4">{profileData.bio}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-slate-400" />
                  <span className="text-sm text-slate-600">
                    Joined: {profileData.joinDate}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-slate-400" />
                  <span className="text-sm text-slate-600">
                    {profileData.location}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-slate-600">
                    Total Earnings: ${profileData.totalEarnings.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <User className="h-5 w-5 mr-2" />
            Personal Information
          </CardTitle>
          <CardDescription>Update your personal details and contact information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={profileData.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
                disabled={!isEditing}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={profileData.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
                disabled={!isEditing}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={profileData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                disabled={!isEditing}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={profileData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                disabled={!isEditing}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="company">Company</Label>
              <Input
                id="company"
                value={profileData.company}
                onChange={(e) => handleInputChange("company", e.target.value)}
                disabled={!isEditing}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                value={profileData.website}
                onChange={(e) => handleInputChange("website", e.target.value)}
                disabled={!isEditing}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <textarea
              id="bio"
              value={profileData.bio}
              onChange={(e) => handleInputChange("bio", e.target.value)}
              disabled={!isEditing}
              rows={4}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-slate-50 disabled:text-slate-500"
            />
          </div>
        </CardContent>
      </Card>

      {/* Account Status */}
      <Card>
        <CardHeader>
          <CardTitle>Account Status</CardTitle>
          <CardDescription>Your current account status and verification</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <h4 className="font-medium text-green-900">Email Verified</h4>
                  <p className="text-sm text-green-700">Your email address has been verified</p>
                </div>
              </div>
              <Badge variant="default" className="bg-green-600">
                Verified
              </Badge>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-blue-600" />
                <div>
                  <h4 className="font-medium text-blue-900">Account Active</h4>
                  <p className="text-sm text-blue-700">Your account is in good standing</p>
                </div>
              </div>
              <Badge variant="default" className="bg-blue-600">
                Active
              </Badge>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <AlertCircle className="h-5 w-5 text-yellow-600" />
                <div>
                  <h4 className="font-medium text-yellow-900">Phone Verification</h4>
                  <p className="text-sm text-yellow-700">Phone number not verified</p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="border-yellow-300 text-yellow-700 hover:bg-yellow-100">
                Verify
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Affiliate Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Affiliate Performance</CardTitle>
          <CardDescription>Your performance metrics and achievements</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">127</div>
              <div className="text-sm text-slate-500">Total Clicks</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">23</div>
              <div className="text-sm text-slate-500">Conversions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">18.1%</div>
              <div className="text-sm text-slate-500">Conversion Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">Gold</div>
              <div className="text-sm text-slate-500">Tier Level</div>
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
              <h4 className="font-medium text-blue-800">Profile Update Notice</h4>
              <p className="text-sm text-blue-700 mt-1">
                Changes to your email address will require verification. Some profile changes may take up to 24 hours to reflect across all systems. 
                Contact support if you need immediate assistance.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


