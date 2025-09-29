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
  Plug, 
  Settings, 
  Key, 
  Globe, 
  CreditCard, 
  Mail, 
  BarChart3, 
  ShoppingCart,
  Plus,
  Edit,
  Trash2,
  Eye,
  Copy,
  CheckCircle,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Save,
  TestTube,
  ExternalLink
} from "lucide-react"
import { toast } from "sonner"

// Mock data for integrations
const integrations = [
  {
    id: "INT-001",
    name: "Stripe Payment",
    type: "payment",
    status: "connected",
    description: "Process payments and payouts through Stripe",
    lastSync: "2024-01-15T14:30:00Z",
    apiCalls: 1250,
    successRate: 99.2,
    config: {
      publicKey: "pk_test_...",
      secretKey: "sk_test_...",
      webhookSecret: "whsec_..."
    }
  },
  {
    id: "INT-002",
    name: "Shopify Store",
    type: "ecommerce",
    status: "connected",
    description: "Sync products and orders from Shopify",
    lastSync: "2024-01-15T14:25:00Z",
    apiCalls: 890,
    successRate: 98.7,
    config: {
      shopDomain: "example.myshopify.com",
      apiKey: "shp_...",
      webhookSecret: "webhook_..."
    }
  },
  {
    id: "INT-003",
    name: "Mailchimp Email",
    type: "email",
    status: "connected",
    description: "Send marketing emails and newsletters",
    lastSync: "2024-01-15T14:20:00Z",
    apiCalls: 450,
    successRate: 97.8,
    config: {
      apiKey: "mailchimp_...",
      listId: "list_...",
      serverPrefix: "us1"
    }
  },
  {
    id: "INT-004",
    name: "Google Analytics",
    type: "analytics",
    status: "connected",
    description: "Track website analytics and conversions",
    lastSync: "2024-01-15T14:15:00Z",
    apiCalls: 2100,
    successRate: 99.5,
    config: {
      trackingId: "GA-XXXXXXXXX",
      measurementId: "G-XXXXXXXXX",
      apiKey: "google_..."
    }
  },
  {
    id: "INT-005",
    name: "PayPal Payment",
    type: "payment",
    status: "disconnected",
    description: "Alternative payment processing through PayPal",
    lastSync: null,
    apiCalls: 0,
    successRate: 0,
    config: {
      clientId: "paypal_...",
      clientSecret: "paypal_...",
      sandbox: true
    }
  }
]

// Mock data for webhook endpoints
const webhooks = [
  {
    id: "WH-001",
    name: "Order Created",
    url: "https://api.trackdesk.com/webhooks/order-created",
    events: ["order.created", "order.updated"],
    status: "active",
    secret: "whsec_...",
    lastTriggered: "2024-01-15T14:30:00Z",
    successRate: 98.5,
    totalCalls: 1250
  },
  {
    id: "WH-002",
    name: "Payment Processed",
    url: "https://api.trackdesk.com/webhooks/payment-processed",
    events: ["payment.completed", "payment.failed"],
    status: "active",
    secret: "whsec_...",
    lastTriggered: "2024-01-15T14:25:00Z",
    successRate: 99.2,
    totalCalls: 890
  },
  {
    id: "WH-003",
    name: "Affiliate Registered",
    url: "https://api.trackdesk.com/webhooks/affiliate-registered",
    events: ["affiliate.registered", "affiliate.approved"],
    status: "inactive",
    secret: "whsec_...",
    lastTriggered: "2024-01-10T09:00:00Z",
    successRate: 95.8,
    totalCalls: 450
  }
]

// Mock data for API keys
const apiKeys = [
  {
    id: "API-001",
    name: "Production API Key",
    key: "td_live_...",
    permissions: ["read", "write", "admin"],
    status: "active",
    lastUsed: "2024-01-15T14:30:00Z",
    usage: 15000,
    createdAt: "2024-01-01"
  },
  {
    id: "API-002",
    name: "Development API Key",
    key: "td_test_...",
    permissions: ["read", "write"],
    status: "active",
    lastUsed: "2024-01-15T14:25:00Z",
    usage: 5000,
    createdAt: "2024-01-02"
  },
  {
    id: "API-003",
    name: "Read-Only API Key",
    key: "td_read_...",
    permissions: ["read"],
    status: "revoked",
    lastUsed: "2024-01-10T09:00:00Z",
    usage: 2500,
    createdAt: "2024-01-03"
  }
]

export default function IntegrationsPage() {
  const [selectedTab, setSelectedTab] = useState("integrations")
  const [isCreating, setIsCreating] = useState(false)
  const [newIntegration, setNewIntegration] = useState({
    name: "",
    type: "",
    description: "",
    config: {}
  })

  const handleCreateIntegration = () => {
    toast.success("Integration created successfully!")
    setIsCreating(false)
  }

  const handleCreateWebhook = () => {
    toast.success("Webhook created successfully!")
    setIsCreating(false)
  }

  const handleCreateApiKey = () => {
    toast.success("API key created successfully!")
    setIsCreating(false)
  }

  const handleTestIntegration = (integrationId: string) => {
    toast.success(`Integration ${integrationId} tested successfully!`)
  }

  const handleSyncIntegration = (integrationId: string) => {
    toast.success(`Integration ${integrationId} synced successfully!`)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "connected":
        return <Badge variant="default" className="bg-green-100 text-green-800">Connected</Badge>
      case "disconnected":
        return <Badge variant="destructive">Disconnected</Badge>
      case "error":
        return <Badge variant="destructive">Error</Badge>
      case "active":
        return <Badge variant="default" className="bg-green-100 text-green-800">Active</Badge>
      case "inactive":
        return <Badge variant="secondary">Inactive</Badge>
      case "revoked":
        return <Badge variant="destructive">Revoked</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "payment":
        return <CreditCard className="h-4 w-4" />
      case "ecommerce":
        return <ShoppingCart className="h-4 w-4" />
      case "email":
        return <Mail className="h-4 w-4" />
      case "analytics":
        return <BarChart3 className="h-4 w-4" />
      default:
        return <Plug className="h-4 w-4" />
    }
  }

  const getPermissionBadge = (permission: string) => {
    switch (permission) {
      case "read":
        return <Badge variant="outline" className="text-blue-600">Read</Badge>
      case "write":
        return <Badge variant="outline" className="text-green-600">Write</Badge>
      case "admin":
        return <Badge variant="outline" className="text-red-600">Admin</Badge>
      default:
        return <Badge variant="outline">{permission}</Badge>
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center">
            <Plug className="h-6 w-6 mr-2 text-blue-600" />
            Integrations
          </h1>
          <p className="text-slate-600">Manage third-party integrations and API connections</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Sync All
          </Button>
        </div>
      </div>

      {/* Integration Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
          <TabsTrigger value="api-keys">API Keys</TabsTrigger>
        </TabsList>

        {/* Integrations */}
        <TabsContent value="integrations" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Third-Party Integrations</h2>
              <p className="text-slate-600">Connect with external services and platforms</p>
            </div>
            <Dialog open={isCreating} onOpenChange={setIsCreating}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Integration
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add New Integration</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="integrationName">Integration Name</Label>
                    <Input id="integrationName" placeholder="Enter integration name" />
                  </div>
                  <div>
                    <Label htmlFor="integrationType">Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="payment">Payment</SelectItem>
                        <SelectItem value="ecommerce">E-commerce</SelectItem>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="analytics">Analytics</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Input id="description" placeholder="Enter description" />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsCreating(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreateIntegration}>
                      <Save className="h-4 w-4 mr-2" />
                      Add Integration
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="space-y-4">
            {integrations.map((integration) => (
              <Card key={integration.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center">
                        {getTypeIcon(integration.type)}
                        <span className="ml-2">{integration.name}</span>
                        {getStatusBadge(integration.status)}
                      </CardTitle>
                      <CardDescription>
                        {integration.description}
                      </CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleTestIntegration(integration.id)}>
                        <TestTube className="h-4 w-4 mr-2" />
                        Test
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleSyncIntegration(integration.id)}>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Sync
                      </Button>
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
                        Remove
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium">Configuration</Label>
                        <div className="space-y-2 mt-2">
                          {Object.entries(integration.config).map(([key, value]) => (
                            <div key={key} className="flex items-center justify-between p-2 bg-slate-50 rounded">
                              <span className="text-sm font-medium">{key}</span>
                              <span className="text-sm text-slate-600 font-mono">
                                {typeof value === 'string' && value.length > 20 
                                  ? `${value.substring(0, 20)}...` 
                                  : value}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Performance</Label>
                        <div className="space-y-2 mt-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-slate-600">API Calls</span>
                            <span className="font-medium">{integration.apiCalls.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-slate-600">Success Rate</span>
                            <span className="font-medium text-green-600">{integration.successRate}%</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-slate-600">Last Sync</span>
                            <span className="font-medium">
                              {integration.lastSync 
                                ? new Date(integration.lastSync).toLocaleString()
                                : 'Never'
                              }
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Webhooks */}
        <TabsContent value="webhooks" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Webhook Endpoints</h2>
              <p className="text-slate-600">Manage webhook endpoints for real-time data</p>
            </div>
            <Dialog open={isCreating} onOpenChange={setIsCreating}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Webhook
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create Webhook Endpoint</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="webhookName">Webhook Name</Label>
                    <Input id="webhookName" placeholder="Enter webhook name" />
                  </div>
                  <div>
                    <Label htmlFor="webhookUrl">Endpoint URL</Label>
                    <Input id="webhookUrl" placeholder="https://your-domain.com/webhook" />
                  </div>
                  <div>
                    <Label htmlFor="webhookEvents">Events</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select events" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="order.created">Order Created</SelectItem>
                        <SelectItem value="payment.completed">Payment Completed</SelectItem>
                        <SelectItem value="affiliate.registered">Affiliate Registered</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsCreating(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreateWebhook}>
                      <Save className="h-4 w-4 mr-2" />
                      Create Webhook
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="space-y-4">
            {webhooks.map((webhook) => (
              <Card key={webhook.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center">
                        <Globe className="h-4 w-4 mr-2" />
                        {webhook.name}
                        {getStatusBadge(webhook.status)}
                      </CardTitle>
                      <CardDescription>
                        {webhook.url}
                      </CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <TestTube className="h-4 w-4 mr-2" />
                        Test
                      </Button>
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
                      <Label className="text-sm font-medium">Events</Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {webhook.events.map((event, index) => (
                          <Badge key={index} variant="outline">{event}</Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                      <div className="text-center">
                        <div className="text-lg font-semibold text-blue-600">{webhook.totalCalls}</div>
                        <div className="text-xs text-slate-500">Total Calls</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold text-green-600">{webhook.successRate}%</div>
                        <div className="text-xs text-slate-500">Success Rate</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold text-purple-600">
                          {webhook.lastTriggered 
                            ? new Date(webhook.lastTriggered).toLocaleDateString()
                            : 'Never'
                          }
                        </div>
                        <div className="text-xs text-slate-500">Last Triggered</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* API Keys */}
        <TabsContent value="api-keys" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">API Keys</h2>
              <p className="text-slate-600">Manage API keys for external access</p>
            </div>
            <Dialog open={isCreating} onOpenChange={setIsCreating}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create API Key
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create API Key</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="apiKeyName">API Key Name</Label>
                    <Input id="apiKeyName" placeholder="Enter API key name" />
                  </div>
                  <div>
                    <Label htmlFor="permissions">Permissions</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select permissions" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="read">Read Only</SelectItem>
                        <SelectItem value="read_write">Read & Write</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsCreating(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreateApiKey}>
                      <Save className="h-4 w-4 mr-2" />
                      Create API Key
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="space-y-4">
            {apiKeys.map((apiKey) => (
              <Card key={apiKey.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center">
                        <Key className="h-4 w-4 mr-2" />
                        {apiKey.name}
                        {getStatusBadge(apiKey.status)}
                      </CardTitle>
                      <CardDescription>
                        Created: {apiKey.createdAt} • Usage: {apiKey.usage.toLocaleString()} calls
                      </CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Copy className="h-4 w-4 mr-2" />
                        Copy
                      </Button>
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
                        Revoke
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium">API Key</Label>
                      <div className="flex items-center space-x-2 mt-2">
                        <Input 
                          value={apiKey.key} 
                          readOnly 
                          className="font-mono text-sm"
                        />
                        <Button variant="outline" size="sm">
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium">Permissions</Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {apiKey.permissions.map((permission, index) => (
                          <div key={index}>
                            {getPermissionBadge(permission)}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                      <div className="text-center">
                        <div className="text-lg font-semibold text-blue-600">{apiKey.usage}</div>
                        <div className="text-xs text-slate-500">Total Usage</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold text-purple-600">
                          {apiKey.lastUsed 
                            ? new Date(apiKey.lastUsed).toLocaleDateString()
                            : 'Never'
                          }
                        </div>
                        <div className="text-xs text-slate-500">Last Used</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Integration Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Integration Overview</CardTitle>
          <CardDescription>Summary of all integrations and their status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">4</div>
              <div className="text-sm text-slate-500">Connected Integrations</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">3</div>
              <div className="text-sm text-slate-500">Active Webhooks</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">3</div>
              <div className="text-sm text-slate-500">API Keys</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">98.8%</div>
              <div className="text-sm text-slate-500">Avg. Success Rate</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


