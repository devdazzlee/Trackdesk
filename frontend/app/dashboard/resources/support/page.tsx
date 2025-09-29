"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { 
  MessageCircle, 
  Mail, 
  Phone, 
  Clock, 
  CheckCircle,
  AlertCircle,
  FileText,
  ExternalLink,
  Send
} from "lucide-react"
import { toast } from "sonner"

// Mock support data
const supportChannels = [
  {
    id: 1,
    name: "Live Chat",
    description: "Get instant help from our support team",
    icon: MessageCircle,
    availability: "24/7",
    responseTime: "2-5 minutes",
    status: "online",
    color: "text-green-600"
  },
  {
    id: 2,
    name: "Email Support",
    description: "Send us a detailed message and we'll respond",
    icon: Mail,
    availability: "24/7",
    responseTime: "2-4 hours",
    status: "online",
    color: "text-blue-600"
  },
  {
    id: 3,
    name: "Phone Support",
    description: "Speak directly with our support team",
    icon: Phone,
    availability: "Mon-Fri 9AM-6PM EST",
    responseTime: "Immediate",
    status: "online",
    color: "text-purple-600"
  }
]

const supportCategories = [
  "Account Issues",
  "Payment Problems",
  "Technical Support",
  "Commission Questions",
  "Marketing Materials",
  "Program Terms",
  "Other"
]

const priorityLevels = [
  { value: "low", label: "Low", description: "General questions" },
  { value: "medium", label: "Medium", description: "Account or payment issues" },
  { value: "high", label: "High", description: "Urgent technical problems" },
  { value: "critical", label: "Critical", description: "System outages or security issues" }
]

export default function ContactSupportPage() {
  const [formData, setFormData] = useState({
    category: "",
    priority: "",
    subject: "",
    message: "",
    email: "affiliate@example.com"
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false)
      toast.success("Support ticket submitted successfully!")
      setFormData({
        category: "",
        priority: "",
        subject: "",
        message: "",
        email: "affiliate@example.com"
      })
    }, 2000)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Contact Support</h1>
          <p className="text-slate-600">Get help from our dedicated support team</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <FileText className="h-4 w-4 mr-2" />
            View Tickets
          </Button>
        </div>
      </div>

      {/* Support Channels */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {supportChannels.map((channel) => (
          <Card key={channel.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6 text-center">
              <div className={`w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4`}>
                <channel.icon className={`h-6 w-6 ${channel.color}`} />
              </div>
              <h3 className="font-medium text-slate-900 mb-2">{channel.name}</h3>
              <p className="text-sm text-slate-600 mb-4">{channel.description}</p>
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Availability:</span>
                  <span className="font-medium">{channel.availability}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Response Time:</span>
                  <span className="font-medium">{channel.responseTime}</span>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full"
                disabled={channel.status !== "online"}
              >
                {channel.status === "online" ? "Start Chat" : "Offline"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Support Form */}
      <Card>
        <CardHeader>
          <CardTitle>Submit a Support Ticket</CardTitle>
          <CardDescription>
            Fill out the form below and we'll get back to you as soon as possible
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {supportCategories.map(category => (
                      <SelectItem key={category} value={category.toLowerCase().replace(" ", "-")}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="priority">Priority Level</Label>
                <Select value={formData.priority} onValueChange={(value) => handleInputChange("priority", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    {priorityLevels.map(priority => (
                      <SelectItem key={priority.value} value={priority.value}>
                        <div>
                          <div className="font-medium">{priority.label}</div>
                          <div className="text-xs text-slate-500">{priority.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="Enter your email address"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                value={formData.subject}
                onChange={(e) => handleInputChange("subject", e.target.value)}
                placeholder="Brief description of your issue"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                value={formData.message}
                onChange={(e) => handleInputChange("message", e.target.value)}
                placeholder="Please provide detailed information about your issue..."
                rows={6}
              />
            </div>
            
            <Button type="submit" disabled={isSubmitting} className="w-full">
              <Send className="h-4 w-4 mr-2" />
              {isSubmitting ? "Submitting..." : "Submit Ticket"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Support Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Support Hours</CardTitle>
            <CardDescription>When you can reach our support team</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Clock className="h-5 w-5 text-blue-600" />
                <span className="font-medium">Live Chat</span>
              </div>
              <Badge variant="default" className="bg-green-600">24/7</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-blue-600" />
                <span className="font-medium">Email Support</span>
              </div>
              <Badge variant="default" className="bg-green-600">24/7</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-blue-600" />
                <span className="font-medium">Phone Support</span>
              </div>
              <Badge variant="outline">Mon-Fri 9AM-6PM EST</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Response Times</CardTitle>
            <CardDescription>How quickly we respond to different types of requests</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Critical Issues</span>
              <Badge variant="destructive">Immediate</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">High Priority</span>
              <Badge variant="default" className="bg-orange-600">2-4 hours</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Medium Priority</span>
              <Badge variant="default" className="bg-blue-600">4-8 hours</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Low Priority</span>
              <Badge variant="outline">24-48 hours</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* FAQ Quick Links */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Help</CardTitle>
          <CardDescription>Common issues and solutions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Button variant="outline" className="justify-start h-auto p-4">
              <div className="text-left">
                <div className="font-medium">Commission Not Showing</div>
                <div className="text-xs text-slate-500 mt-1">Check approval status and timeline</div>
              </div>
            </Button>
            <Button variant="outline" className="justify-start h-auto p-4">
              <div className="text-left">
                <div className="font-medium">Payment Issues</div>
                <div className="text-xs text-slate-500 mt-1">Troubleshoot payout problems</div>
              </div>
            </Button>
            <Button variant="outline" className="justify-start h-auto p-4">
              <div className="text-left">
                <div className="font-medium">Link Generation</div>
                <div className="text-xs text-slate-500 mt-1">Create and manage affiliate links</div>
              </div>
            </Button>
            <Button variant="outline" className="justify-start h-auto p-4">
              <div className="text-left">
                <div className="font-medium">Account Access</div>
                <div className="text-xs text-slate-500 mt-1">Login and security issues</div>
              </div>
            </Button>
            <Button variant="outline" className="justify-start h-auto p-4">
              <div className="text-left">
                <div className="font-medium">Marketing Materials</div>
                <div className="text-xs text-slate-500 mt-1">Download banners and assets</div>
              </div>
            </Button>
            <Button variant="outline" className="justify-start h-auto p-4">
              <div className="text-left">
                <div className="font-medium">Program Terms</div>
                <div className="text-xs text-slate-500 mt-1">Understand terms and conditions</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Emergency Contact */}
      <Card className="border-red-200 bg-red-50">
        <CardContent className="p-6">
          <div className="flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-red-800">Emergency Support</h4>
              <p className="text-sm text-red-700 mt-1 mb-3">
                For critical issues affecting your account or urgent security concerns, contact our emergency support line.
              </p>
              <Button variant="outline" className="border-red-300 text-red-700 hover:bg-red-100">
                <Phone className="h-4 w-4 mr-2" />
                Emergency Hotline: +1 (555) 123-4567
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


