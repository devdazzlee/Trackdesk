"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  FileText, 
  Search, 
  Filter, 
  Download, 
  RefreshCw,
  User,
  Settings,
  CreditCard,
  LinkIcon,
  Bell,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  Calendar,
  Clock
} from "lucide-react"

// Mock data for activity logs
const activityLogs = [
  {
    id: "LOG-001",
    timestamp: "2024-01-07 14:30:00",
    user: "admin@trackdesk.com",
    action: "affiliate.approved",
    description: "Approved affiliate application for john.doe@example.com",
    ipAddress: "192.168.1.100",
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
    status: "success",
    details: {
      affiliateId: "AFF-001",
      affiliateName: "John Doe",
      affiliateEmail: "john.doe@example.com"
    }
  },
  {
    id: "LOG-002",
    timestamp: "2024-01-07 14:25:00",
    user: "admin@trackdesk.com",
    action: "payout.processed",
    description: "Processed payout of $1,250.00 for affiliate AFF-002",
    ipAddress: "192.168.1.100",
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
    status: "success",
    details: {
      affiliateId: "AFF-002",
      amount: 1250.00,
      method: "PayPal",
      transactionId: "TXN-789123"
    }
  },
  {
    id: "LOG-003",
    timestamp: "2024-01-07 14:20:00",
    user: "affiliate@example.com",
    action: "login.success",
    description: "Successful login from new IP address",
    ipAddress: "203.0.113.45",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
    status: "success",
    details: {
      affiliateId: "AFF-003",
      previousIp: "203.0.113.44"
    }
  },
  {
    id: "LOG-004",
    timestamp: "2024-01-07 14:15:00",
    user: "admin@trackdesk.com",
    action: "offer.created",
    description: "Created new offer 'Black Friday Sale 2024'",
    ipAddress: "192.168.1.100",
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
    status: "success",
    details: {
      offerId: "OFF-001",
      offerName: "Black Friday Sale 2024",
      commission: "15%"
    }
  },
  {
    id: "LOG-005",
    timestamp: "2024-01-07 14:10:00",
    user: "affiliate@example.com",
    action: "conversion.created",
    description: "New conversion recorded for offer OFF-001",
    ipAddress: "203.0.113.45",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
    status: "success",
    details: {
      conversionId: "CONV-001",
      offerId: "OFF-001",
      amount: 89.99,
      commission: 13.50
    }
  },
  {
    id: "LOG-006",
    timestamp: "2024-01-07 14:05:00",
    user: "admin@trackdesk.com",
    action: "system.settings.updated",
    description: "Updated global commission rate from 10% to 12%",
    ipAddress: "192.168.1.100",
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
    status: "success",
    details: {
      setting: "global_commission_rate",
      oldValue: "10%",
      newValue: "12%"
    }
  },
  {
    id: "LOG-007",
    timestamp: "2024-01-07 14:00:00",
    user: "affiliate@example.com",
    action: "login.failed",
    description: "Failed login attempt with incorrect password",
    ipAddress: "203.0.113.45",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
    status: "failed",
    details: {
      affiliateId: "AFF-003",
      reason: "Invalid password"
    }
  },
  {
    id: "LOG-008",
    timestamp: "2024-01-07 13:55:00",
    user: "admin@trackdesk.com",
    action: "affiliate.suspended",
    description: "Suspended affiliate AFF-004 for policy violation",
    ipAddress: "192.168.1.100",
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
    status: "success",
    details: {
      affiliateId: "AFF-004",
      reason: "Policy violation",
      suspensionDuration: "30 days"
    }
  }
]

const actionTypes = [
  { value: "all", label: "All Actions" },
  { value: "affiliate", label: "Affiliate Actions" },
  { value: "payout", label: "Payout Actions" },
  { value: "offer", label: "Offer Actions" },
  { value: "conversion", label: "Conversion Actions" },
  { value: "system", label: "System Actions" },
  { value: "login", label: "Login Actions" }
]

const statusTypes = [
  { value: "all", label: "All Status" },
  { value: "success", label: "Success" },
  { value: "failed", label: "Failed" },
  { value: "pending", label: "Pending" }
]

export default function ActivityLogsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [actionFilter, setActionFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [dateRange, setDateRange] = useState("today")

  const filteredLogs = activityLogs.filter(log => {
    const matchesSearch = log.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.action.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesAction = actionFilter === "all" || log.action.startsWith(actionFilter)
    const matchesStatus = statusFilter === "all" || log.status === statusFilter
    
    return matchesSearch && matchesAction && matchesStatus
  })

  const getActionIcon = (action: string) => {
    if (action.includes("affiliate")) return <User className="h-4 w-4" />
    if (action.includes("payout")) return <CreditCard className="h-4 w-4" />
    if (action.includes("offer")) return <LinkIcon className="h-4 w-4" />
    if (action.includes("conversion")) return <CheckCircle className="h-4 w-4" />
    if (action.includes("system")) return <Settings className="h-4 w-4" />
    if (action.includes("login")) return <Bell className="h-4 w-4" />
    return <FileText className="h-4 w-4" />
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "success":
        return <Badge variant="default" className="bg-green-600">Success</Badge>
      case "failed":
        return <Badge variant="destructive">Failed</Badge>
      case "pending":
        return <Badge variant="secondary">Pending</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getActionBadge = (action: string) => {
    const actionType = action.split(".")[0]
    switch (actionType) {
      case "affiliate":
        return <Badge variant="outline" className="border-blue-300 text-blue-700">Affiliate</Badge>
      case "payout":
        return <Badge variant="outline" className="border-green-300 text-green-700">Payout</Badge>
      case "offer":
        return <Badge variant="outline" className="border-purple-300 text-purple-700">Offer</Badge>
      case "conversion":
        return <Badge variant="outline" className="border-orange-300 text-orange-700">Conversion</Badge>
      case "system":
        return <Badge variant="outline" className="border-gray-300 text-gray-700">System</Badge>
      case "login":
        return <Badge variant="outline" className="border-yellow-300 text-yellow-700">Login</Badge>
      default:
        return <Badge variant="outline">Other</Badge>
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center">
            Activity logs
            <FileText className="h-5 w-5 ml-2 text-slate-400" />
          </h1>
          <p className="text-slate-600">Logs &gt; Activity logs</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <CardDescription>Filter activity logs by various criteria</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  id="search"
                  placeholder="Search logs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="actionFilter">Action Type</Label>
              <Select value={actionFilter} onValueChange={setActionFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Select action type" />
                </SelectTrigger>
                <SelectContent>
                  {actionTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="statusFilter">Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {statusTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="dateRange">Date Range</Label>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select date range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="yesterday">Yesterday</SelectItem>
                  <SelectItem value="last7days">Last 7 Days</SelectItem>
                  <SelectItem value="last30days">Last 30 Days</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Activity Logs */}
      <Card>
        <CardHeader>
          <CardTitle>Activity Logs</CardTitle>
          <CardDescription>
            Showing {filteredLogs.length} of {activityLogs.length} activity logs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredLogs.map((log) => (
              <div key={log.id} className="p-4 border rounded-lg hover:bg-slate-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      {getActionIcon(log.action)}
                      <h3 className="font-medium">{log.description}</h3>
                      {getStatusBadge(log.status)}
                      {getActionBadge(log.action)}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-slate-600 mb-3">
                      <div>
                        <span className="font-medium">User:</span>
                        <p className="font-mono">{log.user}</p>
                      </div>
                      <div>
                        <span className="font-medium">Action:</span>
                        <p className="font-mono">{log.action}</p>
                      </div>
                      <div>
                        <span className="font-medium">IP Address:</span>
                        <p className="font-mono">{log.ipAddress}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-500">
                      <div>
                        <span className="font-medium">Timestamp:</span>
                        <p>{log.timestamp}</p>
                      </div>
                      <div>
                        <span className="font-medium">User Agent:</span>
                        <p className="truncate">{log.userAgent}</p>
                      </div>
                    </div>
                    
                    {log.details && (
                      <div className="mt-3 p-3 bg-slate-100 rounded-lg">
                        <h4 className="font-medium text-sm mb-2">Details:</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                          {Object.entries(log.details).map(([key, value]) => (
                            <div key={key} className="flex justify-between">
                              <span className="font-medium capitalize">
                                {key.replace(/([A-Z])/g, ' $1').trim()}:
                              </span>
                              <span className="font-mono">{String(value)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="ml-4 flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total Logs</p>
                <p className="text-2xl font-bold text-slate-900">{activityLogs.length}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Successful Actions</p>
                <p className="text-2xl font-bold text-slate-900">
                  {activityLogs.filter(log => log.status === "success").length}
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
                <p className="text-sm font-medium text-slate-600">Failed Actions</p>
                <p className="text-2xl font-bold text-slate-900">
                  {activityLogs.filter(log => log.status === "failed").length}
                </p>
              </div>
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Unique Users</p>
                <p className="text-2xl font-bold text-slate-900">
                  {new Set(activityLogs.map(log => log.user)).size}
                </p>
              </div>
              <User className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
