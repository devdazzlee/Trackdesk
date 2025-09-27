"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { 
  Webhook, 
  Plus, 
  Save, 
  TestTube,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Copy,
  Trash2,
  Edit,
  Eye,
  HelpCircle,
  Settings,
  Activity
} from "lucide-react"

// Mock data for webhooks
const webhooks = [
  {
    id: "WH-001",
    name: "Conversion Notifications",
    url: "https://api.example.com/webhooks/conversions",
    events: ["conversion.created", "conversion.approved"],
    status: "active",
    lastTriggered: "2024-01-07 14:30:00",
    successRate: 98.5,
    totalCalls: 1250
  },
  {
    id: "WH-002",
    name: "Click Tracking",
    url: "https://tracking.example.com/webhooks/clicks",
    events: ["click.registered", "click.converted"],
    status: "active",
    lastTriggered: "2024-01-07 14:25:00",
    successRate: 99.2,
    totalCalls: 8900
  },
  {
    id: "WH-003",
    name: "Payout Alerts",
    url: "https://finance.example.com/webhooks/payouts",
    events: ["payout.processed", "payout.failed"],
    status: "inactive",
    lastTriggered: "2024-01-06 16:30:00",
    successRate: 95.8,
    totalCalls: 45
  },
  {
    id: "WH-004",
    name: "Affiliate Registration",
    url: "https://crm.example.com/webhooks/affiliates",
    events: ["affiliate.registered", "affiliate.approved"],
    status: "active",
    lastTriggered: "2024-01-07 12:15:00",
    successRate: 100,
    totalCalls: 23
  }
]

const webhookEvents = [
  { value: "conversion.created", label: "Conversion Created" },
  { value: "conversion.approved", label: "Conversion Approved" },
  { value: "conversion.declined", label: "Conversion Declined" },
  { value: "click.registered", label: "Click Registered" },
  { value: "click.converted", label: "Click Converted" },
  { value: "payout.processed", label: "Payout Processed" },
  { value: "payout.failed", label: "Payout Failed" },
  { value: "affiliate.registered", label: "Affiliate Registered" },
  { value: "affiliate.approved", label: "Affiliate Approved" },
  { value: "affiliate.suspended", label: "Affiliate Suspended" }
]

const recentWebhookLogs = [
  {
    id: "LOG-001",
    webhookId: "WH-001",
    event: "conversion.created",
    status: "success",
    responseTime: 245,
    timestamp: "2024-01-07 14:30:00",
    response: "200 OK"
  },
  {
    id: "LOG-002",
    webhookId: "WH-002",
    event: "click.registered",
    status: "success",
    responseTime: 189,
    timestamp: "2024-01-07 14:29:45",
    response: "200 OK"
  },
  {
    id: "LOG-003",
    webhookId: "WH-001",
    event: "conversion.approved",
    status: "failed",
    responseTime: 0,
    timestamp: "2024-01-07 14:28:30",
    response: "500 Internal Server Error"
  },
  {
    id: "LOG-004",
    webhookId: "WH-004",
    event: "affiliate.registered",
    status: "success",
    responseTime: 156,
    timestamp: "2024-01-07 14:27:15",
    response: "200 OK"
  }
]

export default function WebhooksPage() {
  const [newWebhook, setNewWebhook] = useState({
    name: "",
    url: "",
    events: [] as string[],
    secret: "",
    timeout: 30,
    retries: 3
  })

  const [selectedEvents, setSelectedEvents] = useState<string[]>([])
  const [createModalOpen, setCreateModalOpen] = useState(false)

  const handleEventToggle = (eventValue: string) => {
    setSelectedEvents(prev => 
      prev.includes(eventValue) 
        ? prev.filter(e => e !== eventValue)
        : [...prev, eventValue]
    )
  }

  const handleCreateWebhook = () => {
    const webhookData = {
      ...newWebhook,
      events: selectedEvents,
      id: `WH-${Date.now()}`,
      status: "active",
      createdAt: new Date().toISOString().split('T')[0]
    }
    setWebhooksList(prev => [...prev, webhookData])
    alert("Webhook created successfully!")
    
    // Reset form
    setNewWebhook({
      name: "",
      url: "",
      events: [],
      secret: "",
      timeout: 30,
      retries: 3
    })
    setSelectedEvents([])
    setCreateModalOpen(false)
  }

  const handleOpenCreateModal = () => {
    setCreateModalOpen(true)
  }

  const [webhooksList, setWebhooksList] = useState(webhooks)

  const handleTestWebhook = (webhookId: string) => {
    console.log("Testing webhook:", webhookId)
    alert("Webhook test sent successfully!")
  }

  const handleEditWebhook = (webhook: any) => {
    setNewWebhook(webhook)
    setSelectedEvents(webhook.events || [])
    setCreateModalOpen(true)
  }

  const handleDeleteWebhook = (webhookId: string) => {
    setWebhooksList(prev => prev.filter(w => w.id !== webhookId))
    alert("Webhook deleted successfully!")
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "inactive":
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "success":
        return <Badge variant="default" className="bg-green-600">Success</Badge>
      case "failed":
        return <Badge variant="destructive">Failed</Badge>
      default:
        return <Badge variant="secondary">Pending</Badge>
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center">
            Webhooks
            <HelpCircle className="h-5 w-5 ml-2 text-slate-400" />
          </h1>
          <p className="text-slate-600">Tools &gt; Webhooks</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <Activity className="h-4 w-4 mr-2" />
            View Logs
          </Button>
          <Button onClick={handleOpenCreateModal}>
            <Plus className="h-4 w-4 mr-2" />
            Create Webhook
          </Button>
        </div>
      </div>

      {/* Webhook Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total Webhooks</p>
                <p className="text-2xl font-bold text-slate-900">{webhooks.length}</p>
              </div>
              <Webhook className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Active Webhooks</p>
                <p className="text-2xl font-bold text-slate-900">
                  {webhooks.filter(w => w.status === "active").length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total Calls</p>
                <p className="text-2xl font-bold text-slate-900">
                  {webhooks.reduce((sum, w) => sum + w.totalCalls, 0).toLocaleString()}
                </p>
              </div>
              <Activity className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Success Rate</p>
                <p className="text-2xl font-bold text-slate-900">
                  {Math.round(webhooks.reduce((sum, w) => sum + w.successRate, 0) / webhooks.length)}%
                </p>
              </div>
              <TestTube className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Webhooks List */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Webhook Endpoints</CardTitle>
              <CardDescription>Manage your webhook endpoints and configurations</CardDescription>
            </CardHeader>
            <CardContent>
            <div className="space-y-4">
              {webhooksList.map((webhook) => (
                  <div key={webhook.id} className="p-4 border rounded-lg hover:bg-slate-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-medium">{webhook.name}</h3>
                          <div className="flex items-center space-x-1">
                            {getStatusIcon(webhook.status)}
                            <Badge variant={webhook.status === "active" ? "default" : "secondary"}>
                              {webhook.status}
                            </Badge>
                          </div>
                        </div>
                        
                        <p className="text-sm text-slate-600 mb-2 font-mono bg-slate-100 px-2 py-1 rounded">
                          {webhook.url}
                        </p>
                        
                        <div className="flex flex-wrap gap-1 mb-3">
                          {webhook.events.map((event) => (
                            <Badge key={event} variant="outline" className="text-xs">
                              {event}
                            </Badge>
                          ))}
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-slate-500">
                          <div>
                            <span className="font-medium">Success Rate:</span>
                            <p>{webhook.successRate}%</p>
                          </div>
                          <div>
                            <span className="font-medium">Total Calls:</span>
                            <p>{webhook.totalCalls.toLocaleString()}</p>
                          </div>
                          <div>
                            <span className="font-medium">Last Triggered:</span>
                            <p>{webhook.lastTriggered}</p>
                          </div>
                          <div>
                            <span className="font-medium">Status:</span>
                            <p>{webhook.status}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="ml-4 flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleTestWebhook(webhook.id)}
                        >
                          <TestTube className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleEditWebhook(webhook)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDeleteWebhook(webhook.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Create New Webhook */}
          <Card>
            <CardHeader>
              <CardTitle>Create New Webhook</CardTitle>
              <CardDescription>Set up a new webhook endpoint</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="webhookName">Webhook Name</Label>
                  <Input
                    id="webhookName"
                    value={newWebhook.name}
                    onChange={(e) => setNewWebhook(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter webhook name"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="webhookUrl">Webhook URL</Label>
                  <Input
                    id="webhookUrl"
                    value={newWebhook.url}
                    onChange={(e) => setNewWebhook(prev => ({ ...prev, url: e.target.value }))}
                    placeholder="https://api.example.com/webhooks/endpoint"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Events to Subscribe</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {webhookEvents.map((event) => (
                    <div key={event.value} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={event.value}
                        checked={selectedEvents.includes(event.value)}
                        onChange={() => handleEventToggle(event.value)}
                        className="rounded border-slate-300"
                      />
                      <Label htmlFor={event.value} className="text-sm">
                        {event.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="secret">Secret Key</Label>
                  <Input
                    id="secret"
                    value={newWebhook.secret}
                    onChange={(e) => setNewWebhook(prev => ({ ...prev, secret: e.target.value }))}
                    placeholder="Optional secret for verification"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="timeout">Timeout (seconds)</Label>
                  <Input
                    id="timeout"
                    type="number"
                    value={newWebhook.timeout}
                    onChange={(e) => setNewWebhook(prev => ({ ...prev, timeout: parseInt(e.target.value) }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="retries">Max Retries</Label>
                  <Input
                    id="retries"
                    type="number"
                    value={newWebhook.retries}
                    onChange={(e) => setNewWebhook(prev => ({ ...prev, retries: parseInt(e.target.value) }))}
                  />
                </div>
              </div>

              <Button onClick={handleCreateWebhook} className="w-full">
                <Save className="h-4 w-4 mr-2" />
                Create Webhook
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Recent Webhook Logs */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Webhook Logs</CardTitle>
              <CardDescription>Latest webhook delivery attempts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentWebhookLogs.map((log) => (
                  <div key={log.id} className="p-3 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium text-sm">{log.event}</p>
                        <p className="text-xs text-slate-500">Webhook {log.webhookId}</p>
                      </div>
                      {getStatusBadge(log.status)}
                    </div>
                    <div className="flex justify-between items-center text-xs text-slate-500">
                      <span>{log.responseTime}ms</span>
                      <span>{log.timestamp}</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">{log.response}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Webhook Documentation */}
          <Card>
            <CardHeader>
              <CardTitle>Webhook Documentation</CardTitle>
              <CardDescription>Integration guide and examples</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="p-3 bg-slate-50 rounded-lg">
                  <h4 className="font-medium text-sm mb-2">Payload Format</h4>
                  <p className="text-xs text-slate-600">
                    All webhooks send JSON payloads with event data and metadata.
                  </p>
                </div>
                
                <div className="p-3 bg-slate-50 rounded-lg">
                  <h4 className="font-medium text-sm mb-2">Authentication</h4>
                  <p className="text-xs text-slate-600">
                    Use the secret key to verify webhook authenticity with HMAC-SHA256.
                  </p>
                </div>
                
                <div className="p-3 bg-slate-50 rounded-lg">
                  <h4 className="font-medium text-sm mb-2">Retry Logic</h4>
                  <p className="text-xs text-slate-600">
                    Failed deliveries are retried with exponential backoff.
                  </p>
                </div>
              </div>
              
              <Button variant="outline" size="sm" className="w-full">
                <Copy className="h-4 w-4 mr-2" />
                Copy Example Code
              </Button>
            </CardContent>
          </Card>

          {/* Webhook Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Global Settings</CardTitle>
              <CardDescription>Configure webhook behavior</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="enableWebhooks">Enable Webhooks</Label>
                  <p className="text-xs text-slate-500">Master switch for all webhooks</p>
                </div>
                <Switch id="enableWebhooks" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="enableRetries">Enable Retries</Label>
                  <p className="text-xs text-slate-500">Retry failed webhook deliveries</p>
                </div>
                <Switch id="enableRetries" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="enableLogging">Enable Logging</Label>
                  <p className="text-xs text-slate-500">Log all webhook attempts</p>
                </div>
                <Switch id="enableLogging" defaultChecked />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Create Webhook Modal */}
      <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Webhook</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="webhook-name">Webhook Name</Label>
              <Input
                id="webhook-name"
                value={newWebhook.name}
                onChange={(e) => setNewWebhook(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter webhook name"
              />
            </div>
            
            <div>
              <Label htmlFor="webhook-url">Webhook URL</Label>
              <Input
                id="webhook-url"
                value={newWebhook.url}
                onChange={(e) => setNewWebhook(prev => ({ ...prev, url: e.target.value }))}
                placeholder="https://your-endpoint.com/webhook"
              />
            </div>
            
            <div>
              <Label htmlFor="webhook-secret">Secret Key</Label>
              <Input
                id="webhook-secret"
                value={newWebhook.secret}
                onChange={(e) => setNewWebhook(prev => ({ ...prev, secret: e.target.value }))}
                placeholder="Enter secret key for verification"
              />
            </div>
            
            <div>
              <Label>Events to Subscribe</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {[
                  { value: "conversion.created", label: "Conversion Created" },
                  { value: "affiliate.registered", label: "Affiliate Registered" },
                  { value: "payout.processed", label: "Payout Processed" },
                  { value: "offer.updated", label: "Offer Updated" }
                ].map((event) => (
                  <div key={event.value} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={event.value}
                      checked={selectedEvents.includes(event.value)}
                      onChange={() => handleEventToggle(event.value)}
                      className="rounded"
                    />
                    <Label htmlFor={event.value} className="text-sm">{event.label}</Label>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setCreateModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateWebhook}>
                Create Webhook
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
