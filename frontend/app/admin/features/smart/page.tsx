"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { 
  Zap, 
  Globe, 
  Smartphone, 
  Monitor,
  Clock,
  Settings,
  Plus,
  Edit,
  Trash2,
  Eye,
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Filter,
  Save,
  Copy,
  Share
} from "lucide-react"
import { toast } from "sonner"

// Mock data for smart links
const smartLinks = [
  {
    id: "SL-001",
    name: "Premium Plan - Desktop",
    originalUrl: "https://example.com/premium",
    smartUrl: "https://aff.link/premium-desktop",
    conditions: [
      { type: "device", operator: "equals", value: "desktop" },
      { type: "country", operator: "equals", value: "US" }
    ],
    redirectUrl: "https://example.com/premium?source=desktop-us",
    clicks: 1250,
    conversions: 89,
    status: "active",
    createdAt: "2024-01-01"
  },
  {
    id: "SL-002",
    name: "Mobile App Download",
    originalUrl: "https://example.com/app",
    smartUrl: "https://aff.link/app-mobile",
    conditions: [
      { type: "device", operator: "equals", value: "mobile" },
      { type: "os", operator: "equals", value: "ios" }
    ],
    redirectUrl: "https://apps.apple.com/app/example",
    clicks: 890,
    conversions: 67,
    status: "active",
    createdAt: "2024-01-02"
  },
  {
    id: "SL-003",
    name: "EU GDPR Compliant",
    originalUrl: "https://example.com/gdpr",
    smartUrl: "https://aff.link/gdpr-eu",
    conditions: [
      { type: "country", operator: "in", value: ["DE", "FR", "IT", "ES"] },
      { type: "time", operator: "between", value: ["09:00", "17:00"] }
    ],
    redirectUrl: "https://example.com/gdpr?region=eu",
    clicks: 450,
    conversions: 34,
    status: "active",
    createdAt: "2024-01-03"
  }
]

// Mock data for targeting rules
const targetingRules = [
  {
    id: "TR-001",
    name: "US Desktop Users",
    description: "Target desktop users in the United States",
    conditions: [
      { type: "country", operator: "equals", value: "US" },
      { type: "device", operator: "equals", value: "desktop" }
    ],
    actions: [
      { type: "redirect", value: "https://example.com/us-desktop" },
      { type: "show_banner", value: "desktop-promo" }
    ],
    priority: 1,
    status: "active",
    hits: 1250,
    lastTriggered: "2024-01-15T14:30:00Z"
  },
  {
    id: "TR-002",
    name: "Mobile iOS Users",
    description: "Target iOS mobile users",
    conditions: [
      { type: "device", operator: "equals", value: "mobile" },
      { type: "os", operator: "equals", value: "ios" }
    ],
    actions: [
      { type: "redirect", value: "https://apps.apple.com/app/example" },
      { type: "show_banner", value: "ios-download" }
    ],
    priority: 2,
    status: "active",
    hits: 890,
    lastTriggered: "2024-01-15T14:25:00Z"
  },
  {
    id: "TR-003",
    name: "Business Hours EU",
    description: "Target EU users during business hours",
    conditions: [
      { type: "country", operator: "in", value: ["DE", "FR", "IT", "ES"] },
      { type: "time", operator: "between", value: ["09:00", "17:00"] }
    ],
    actions: [
      { type: "redirect", value: "https://example.com/eu-business" },
      { type: "show_banner", value: "business-hours" }
    ],
    priority: 3,
    status: "active",
    hits: 450,
    lastTriggered: "2024-01-15T14:20:00Z"
  }
]

// Mock data for dynamic content
const dynamicContent = [
  {
    id: "DC-001",
    name: "Personalized Headlines",
    description: "Show different headlines based on user location",
    type: "headline",
    variants: [
      { condition: "country=US", content: "Welcome to America's #1 Platform!" },
      { condition: "country=CA", content: "Canada's Leading Solution!" },
      { condition: "country=UK", content: "The UK's Premier Service!" },
      { condition: "default", content: "Welcome to Our Platform!" }
    ],
    status: "active",
    impressions: 12500,
    clicks: 1250,
    ctr: 10.0
  },
  {
    id: "DC-002",
    name: "Device-Specific CTAs",
    description: "Different call-to-action buttons for different devices",
    type: "cta",
    variants: [
      { condition: "device=mobile", content: "Download App" },
      { condition: "device=desktop", content: "Start Free Trial" },
      { condition: "device=tablet", content: "Get Started" }
    ],
    status: "active",
    impressions: 8900,
    clicks: 890,
    ctr: 10.0
  }
]

export default function SmartFeaturesPage() {
  const [selectedTab, setSelectedTab] = useState("smart-links")
  const [isCreating, setIsCreating] = useState(false)
  const [newRule, setNewRule] = useState({
    name: "",
    description: "",
    conditions: [],
    actions: [],
    priority: 1
  })

  const handleCreateSmartLink = () => {
    toast.success("Smart link created successfully!")
    setIsCreating(false)
  }

  const handleCreateTargetingRule = () => {
    toast.success("Targeting rule created successfully!")
    setIsCreating(false)
  }

  const handleCreateDynamicContent = () => {
    toast.success("Dynamic content created successfully!")
    setIsCreating(false)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="default" className="bg-green-100 text-green-800">Active</Badge>
      case "inactive":
        return <Badge variant="secondary">Inactive</Badge>
      case "testing":
        return <Badge variant="outline">Testing</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  const getConditionIcon = (type: string) => {
    switch (type) {
      case "device":
        return <Monitor className="h-4 w-4" />
      case "country":
        return <Globe className="h-4 w-4" />
      case "time":
        return <Clock className="h-4 w-4" />
      case "os":
        return <Smartphone className="h-4 w-4" />
      default:
        return <Settings className="h-4 w-4" />
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center">
            <Zap className="h-6 w-6 mr-2 text-blue-600" />
            Smart Features
          </h1>
          <p className="text-slate-600">Smart links, targeting rules, and dynamic content</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
          <Button variant="outline" size="sm">
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
        </div>
      </div>

      {/* Smart Features Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="smart-links">Smart Links</TabsTrigger>
          <TabsTrigger value="targeting">Targeting Rules</TabsTrigger>
          <TabsTrigger value="dynamic-content">Dynamic Content</TabsTrigger>
        </TabsList>

        {/* Smart Links */}
        <TabsContent value="smart-links" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Smart Links</h2>
              <p className="text-slate-600">Create intelligent links that adapt based on user conditions</p>
            </div>
            <Dialog open={isCreating} onOpenChange={setIsCreating}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Smart Link
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create Smart Link</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Link Name</Label>
                    <Input id="name" placeholder="Enter link name" />
                  </div>
                  <div>
                    <Label htmlFor="originalUrl">Original URL</Label>
                    <Input id="originalUrl" placeholder="https://example.com/product" />
                  </div>
                  <div>
                    <Label htmlFor="conditions">Targeting Conditions</Label>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select condition" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="device">Device Type</SelectItem>
                            <SelectItem value="country">Country</SelectItem>
                            <SelectItem value="os">Operating System</SelectItem>
                            <SelectItem value="time">Time of Day</SelectItem>
                          </SelectContent>
                        </Select>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Operator" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="equals">Equals</SelectItem>
                            <SelectItem value="not_equals">Not Equals</SelectItem>
                            <SelectItem value="in">In</SelectItem>
                            <SelectItem value="not_in">Not In</SelectItem>
                          </SelectContent>
                        </Select>
                        <Input placeholder="Value" />
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="redirectUrl">Redirect URL</Label>
                    <Input id="redirectUrl" placeholder="https://example.com/target" />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsCreating(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreateSmartLink}>
                      <Save className="h-4 w-4 mr-2" />
                      Create Link
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="space-y-4">
            {smartLinks.map((link) => (
              <Card key={link.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center">
                        {link.name}
                        {getStatusBadge(link.status)}
                      </CardTitle>
                      <CardDescription>
                        Created: {link.createdAt}
                      </CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm">
                        <Copy className="h-4 w-4 mr-2" />
                        Copy
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium">Original URL</Label>
                        <p className="text-sm text-slate-600 font-mono bg-slate-50 p-2 rounded">
                          {link.originalUrl}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Smart URL</Label>
                        <p className="text-sm text-slate-600 font-mono bg-blue-50 p-2 rounded">
                          {link.smartUrl}
                        </p>
                      </div>
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium">Targeting Conditions</Label>
                      <div className="space-y-2 mt-2">
                        {link.conditions.map((condition, index) => (
                          <div key={index} className="flex items-center space-x-2 p-2 bg-slate-50 rounded">
                            {getConditionIcon(condition.type)}
                            <span className="text-sm font-medium">{condition.type}</span>
                            <span className="text-sm text-slate-600">{condition.operator}</span>
                            <span className="text-sm font-medium">{condition.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                      <div className="text-center">
                        <div className="text-lg font-semibold text-blue-600">{link.clicks}</div>
                        <div className="text-xs text-slate-500">Clicks</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold text-green-600">{link.conversions}</div>
                        <div className="text-xs text-slate-500">Conversions</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold text-purple-600">
                          {((link.conversions / link.clicks) * 100).toFixed(1)}%
                        </div>
                        <div className="text-xs text-slate-500">Conversion Rate</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Targeting Rules */}
        <TabsContent value="targeting" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Targeting Rules</h2>
              <p className="text-slate-600">Create rules to target specific user segments</p>
            </div>
            <Dialog open={isCreating} onOpenChange={setIsCreating}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Rule
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create Targeting Rule</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="ruleName">Rule Name</Label>
                    <Input id="ruleName" placeholder="Enter rule name" />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Input id="description" placeholder="Enter description" />
                  </div>
                  <div>
                    <Label htmlFor="priority">Priority</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">High (1)</SelectItem>
                        <SelectItem value="2">Medium (2)</SelectItem>
                        <SelectItem value="3">Low (3)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsCreating(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreateTargetingRule}>
                      <Save className="h-4 w-4 mr-2" />
                      Create Rule
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="space-y-4">
            {targetingRules.map((rule) => (
              <Card key={rule.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center">
                        {rule.name}
                        {getStatusBadge(rule.status)}
                      </CardTitle>
                      <CardDescription>
                        Priority: {rule.priority} • Hits: {rule.hits}
                      </CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium">Description</Label>
                      <p className="text-sm text-slate-600 mt-1">{rule.description}</p>
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium">Conditions</Label>
                      <div className="space-y-2 mt-2">
                        {rule.conditions.map((condition, index) => (
                          <div key={index} className="flex items-center space-x-2 p-2 bg-slate-50 rounded">
                            {getConditionIcon(condition.type)}
                            <span className="text-sm font-medium">{condition.type}</span>
                            <span className="text-sm text-slate-600">{condition.operator}</span>
                            <span className="text-sm font-medium">{condition.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm font-medium">Actions</Label>
                      <div className="space-y-2 mt-2">
                        {rule.actions.map((action, index) => (
                          <div key={index} className="flex items-center space-x-2 p-2 bg-blue-50 rounded">
                            <Zap className="h-4 w-4 text-blue-600" />
                            <span className="text-sm font-medium">{action.type}</span>
                            <span className="text-sm text-slate-600">{action.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="text-sm text-slate-600">
                        Last triggered: {new Date(rule.lastTriggered).toLocaleString()}
                      </div>
                      <div className="text-sm text-slate-600">
                        Total hits: {rule.hits.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Dynamic Content */}
        <TabsContent value="dynamic-content" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Dynamic Content</h2>
              <p className="text-slate-600">Create content that changes based on user conditions</p>
            </div>
            <Dialog open={isCreating} onOpenChange={setIsCreating}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Content
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create Dynamic Content</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="contentName">Content Name</Label>
                    <Input id="contentName" placeholder="Enter content name" />
                  </div>
                  <div>
                    <Label htmlFor="contentType">Content Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="headline">Headline</SelectItem>
                        <SelectItem value="cta">Call-to-Action</SelectItem>
                        <SelectItem value="banner">Banner</SelectItem>
                        <SelectItem value="text">Text Block</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsCreating(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreateDynamicContent}>
                      <Save className="h-4 w-4 mr-2" />
                      Create Content
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="space-y-4">
            {dynamicContent.map((content) => (
              <Card key={content.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center">
                        {content.name}
                        {getStatusBadge(content.status)}
                      </CardTitle>
                      <CardDescription>
                        Type: {content.type} • CTR: {content.ctr}%
                      </CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        Preview
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm">
                        <Share className="h-4 w-4 mr-2" />
                        Share
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium">Description</Label>
                      <p className="text-sm text-slate-600 mt-1">{content.description}</p>
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium">Content Variants</Label>
                      <div className="space-y-2 mt-2">
                        {content.variants.map((variant, index) => (
                          <div key={index} className="p-3 border rounded-lg">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <Badge variant="outline">{variant.condition}</Badge>
                                <span className="text-sm font-medium">{variant.content}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                      <div className="text-center">
                        <div className="text-lg font-semibold text-blue-600">{content.impressions}</div>
                        <div className="text-xs text-slate-500">Impressions</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold text-green-600">{content.clicks}</div>
                        <div className="text-xs text-slate-500">Clicks</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold text-purple-600">{content.ctr}%</div>
                        <div className="text-xs text-slate-500">CTR</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Performance Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Smart Features Performance</CardTitle>
          <CardDescription>Overall performance metrics for smart features</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">3</div>
              <div className="text-sm text-slate-500">Active Smart Links</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">3</div>
              <div className="text-sm text-slate-500">Targeting Rules</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">2</div>
              <div className="text-sm text-slate-500">Dynamic Content</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">+25%</div>
              <div className="text-sm text-slate-500">Avg. Performance Lift</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


