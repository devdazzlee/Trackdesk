"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { 
  AlertTriangle, 
  Bell, 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Filter,
  CheckCircle,
  XCircle,
  Clock
} from "lucide-react"
import { toast } from "sonner"

// Mock alerts data
const alertsData = [
  {
    id: "ALERT-001",
    title: "High Conversion Rate Detected",
    message: "Conversion rate has increased by 25% in the last 24 hours",
    type: "success",
    priority: "medium",
    status: "active",
    createdAt: "2024-01-15T10:30:00Z",
    triggeredBy: "system",
    conditions: "conversion_rate > 15%",
    actions: ["send_email", "log_event"]
  },
  {
    id: "ALERT-002",
    title: "Low Affiliate Activity",
    message: "5 affiliates have not generated any clicks in the last 7 days",
    type: "warning",
    priority: "high",
    status: "active",
    createdAt: "2024-01-15T09:15:00Z",
    triggeredBy: "system",
    conditions: "clicks = 0 AND days_since_last_activity > 7",
    actions: ["send_email", "create_task"]
  },
  {
    id: "ALERT-003",
    title: "Payment Processing Error",
    message: "Failed to process payout for affiliate ID: AFF-12345",
    type: "error",
    priority: "high",
    status: "resolved",
    createdAt: "2024-01-14T16:45:00Z",
    triggeredBy: "system",
    conditions: "payout_status = failed",
    actions: ["send_email", "create_ticket"]
  },
  {
    id: "ALERT-004",
    title: "New Affiliate Registration",
    message: "New affiliate 'John Doe' has registered and is pending approval",
    type: "info",
    priority: "low",
    status: "active",
    createdAt: "2024-01-14T14:20:00Z",
    triggeredBy: "user_action",
    conditions: "affiliate_status = pending",
    actions: ["send_email", "create_task"]
  },
  {
    id: "ALERT-005",
    title: "System Maintenance Scheduled",
    message: "Scheduled maintenance will begin in 2 hours",
    type: "info",
    priority: "medium",
    status: "active",
    createdAt: "2024-01-14T12:00:00Z",
    triggeredBy: "manual",
    conditions: "maintenance_scheduled = true",
    actions: ["send_notification"]
  }
]

export default function AlertsPage() {
  const [alerts, setAlerts] = useState(alertsData)
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newAlert, setNewAlert] = useState({
    title: "",
    message: "",
    type: "info",
    priority: "medium",
    conditions: "",
    actions: []
  })

  const filteredAlerts = alerts.filter(alert => {
    const matchesSearch = alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         alert.message.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = typeFilter === "all" || alert.type === typeFilter
    const matchesStatus = statusFilter === "all" || alert.status === statusFilter
    return matchesSearch && matchesType && matchesStatus
  })

  const handleCreateAlert = () => {
    if (!newAlert.title || !newAlert.message) {
      toast.error("Please fill in all required fields")
      return
    }

    const alert = {
      ...newAlert,
      id: `ALERT-${Date.now()}`,
      status: "active",
      createdAt: new Date().toISOString(),
      triggeredBy: "manual"
    }

    setAlerts(prev => [alert, ...prev])
    setShowCreateForm(false)
    setNewAlert({
      title: "",
      message: "",
      type: "info",
      priority: "medium",
      conditions: "",
      actions: []
    })
    toast.success("Alert created successfully!")
  }

  const handleResolveAlert = (id: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === id ? { ...alert, status: "resolved" } : alert
    ))
    toast.success("Alert resolved!")
  }

  const handleDeleteAlert = (id: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id))
    toast.success("Alert deleted!")
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "success": return "bg-green-100 text-green-800"
      case "warning": return "bg-yellow-100 text-yellow-800"
      case "error": return "bg-red-100 text-red-800"
      case "info": return "bg-blue-100 text-blue-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800"
      case "medium": return "bg-yellow-100 text-yellow-800"
      case "low": return "bg-green-100 text-green-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active": return <Clock className="h-4 w-4 text-yellow-600" />
      case "resolved": return <CheckCircle className="h-4 w-4 text-green-600" />
      default: return <XCircle className="h-4 w-4 text-gray-600" />
    }
  }

  const activeAlerts = alerts.filter(a => a.status === "active").length
  const highPriorityAlerts = alerts.filter(a => a.priority === "high" && a.status === "active").length

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">System Alerts</h1>
          <p className="text-slate-600">Monitor and manage system alerts and notifications</p>
        </div>
        <Button onClick={() => setShowCreateForm(!showCreateForm)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Alert
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Total Alerts</p>
                <p className="text-2xl font-bold">{alerts.length}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-slate-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Active Alerts</p>
                <p className="text-2xl font-bold text-yellow-600">{activeAlerts}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">High Priority</p>
                <p className="text-2xl font-bold text-red-600">{highPriorityAlerts}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Resolved</p>
                <p className="text-2xl font-bold text-green-600">{alerts.filter(a => a.status === "resolved").length}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Create Alert Form */}
      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Alert</CardTitle>
            <CardDescription>Set up a new system alert or notification</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Alert Title *</Label>
                <Input
                  id="title"
                  value={newAlert.title}
                  onChange={(e) => setNewAlert(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter alert title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Alert Type</Label>
                <Select value={newAlert.type} onValueChange={(value) => setNewAlert(prev => ({ ...prev, type: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="info">Info</SelectItem>
                    <SelectItem value="warning">Warning</SelectItem>
                    <SelectItem value="error">Error</SelectItem>
                    <SelectItem value="success">Success</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Alert Message *</Label>
              <Textarea
                id="message"
                value={newAlert.message}
                onChange={(e) => setNewAlert(prev => ({ ...prev, message: e.target.value }))}
                placeholder="Enter alert message"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select value={newAlert.priority} onValueChange={(value) => setNewAlert(prev => ({ ...prev, priority: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="conditions">Trigger Conditions</Label>
                <Input
                  id="conditions"
                  value={newAlert.conditions}
                  onChange={(e) => setNewAlert(prev => ({ ...prev, conditions: e.target.value }))}
                  placeholder="e.g., conversion_rate > 15%"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateAlert}>
                Create Alert
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search alerts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-40">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="info">Info</SelectItem>
            <SelectItem value="warning">Warning</SelectItem>
            <SelectItem value="error">Error</SelectItem>
            <SelectItem value="success">Success</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Alerts List */}
      <div className="space-y-4">
        {filteredAlerts.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <AlertTriangle className="h-12 w-12 mx-auto text-slate-400 mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">No alerts found</h3>
              <p className="text-slate-500">Try adjusting your search or filter criteria.</p>
            </CardContent>
          </Card>
        ) : (
          filteredAlerts.map((alert) => (
            <Card key={alert.id} className={`${alert.status === "active" ? "border-yellow-200 bg-yellow-50" : ""}`}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      {getStatusIcon(alert.status)}
                      <h3 className="font-semibold text-slate-900">{alert.title}</h3>
                      <Badge className={`text-xs ${getTypeColor(alert.type)}`}>
                        {alert.type}
                      </Badge>
                      <Badge className={`text-xs ${getPriorityColor(alert.priority)}`}>
                        {alert.priority}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-600 mb-2">{alert.message}</p>
                    <div className="text-xs text-slate-500">
                      <p>Triggered by: {alert.triggeredBy} • {new Date(alert.createdAt).toLocaleString()}</p>
                      {alert.conditions && <p>Conditions: {alert.conditions}</p>}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    {alert.status === "active" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleResolveAlert(alert.id)}
                        className="text-green-600 hover:text-green-700"
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Resolve
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteAlert(alert.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}