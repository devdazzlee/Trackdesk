"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Send, 
  Search, 
  Filter, 
  Download, 
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  Eye,
  Copy,
  ExternalLink,
  Activity,
  Globe,
  Smartphone
} from "lucide-react"

// Mock data for postback logs
const postbackLogs = [
  {
    id: "PB-001",
    timestamp: "2024-01-07 14:30:00",
    affiliateId: "AFF-001",
    affiliateName: "John Doe",
    conversionId: "CONV-001",
    offerId: "OFF-001",
    offerName: "Black Friday Sale 2024",
    postbackUrl: "https://advertiser.com/postback?click_id={click_id}&payout={payout}",
    status: "success",
    responseCode: 200,
    responseTime: 245,
    response: "OK",
    retryCount: 0,
    method: "GET",
    headers: {
      "User-Agent": "Trackdesk/1.0",
      "Content-Type": "application/json"
    },
    payload: {
      click_id: "CLK-123456",
      payout: 15.50,
      conversion_id: "CONV-001",
      timestamp: "2024-01-07T14:30:00Z"
    }
  },
  {
    id: "PB-002",
    timestamp: "2024-01-07 14:25:00",
    affiliateId: "AFF-002",
    affiliateName: "Jane Smith",
    conversionId: "CONV-002",
    offerId: "OFF-002",
    offerName: "Holiday Special",
    postbackUrl: "https://network.com/track?subid={subid}&amount={amount}",
    status: "failed",
    responseCode: 500,
    responseTime: 0,
    response: "Internal Server Error",
    retryCount: 2,
    method: "POST",
    headers: {
      "User-Agent": "Trackdesk/1.0",
      "Content-Type": "application/json"
    },
    payload: {
      subid: "SUB-789",
      amount: 25.00,
      conversion_id: "CONV-002",
      timestamp: "2024-01-07T14:25:00Z"
    }
  },
  {
    id: "PB-003",
    timestamp: "2024-01-07 14:20:00",
    affiliateId: "AFF-003",
    affiliateName: "Mike Johnson",
    conversionId: "CONV-003",
    offerId: "OFF-001",
    offerName: "Black Friday Sale 2024",
    postbackUrl: "https://tracker.example.com/pixel?cid={click_id}&rev={revenue}",
    status: "success",
    responseCode: 200,
    responseTime: 189,
    response: "OK",
    retryCount: 0,
    method: "GET",
    headers: {
      "User-Agent": "Trackdesk/1.0",
      "Content-Type": "application/json"
    },
    payload: {
      click_id: "CLK-789012",
      revenue: 45.99,
      conversion_id: "CONV-003",
      timestamp: "2024-01-07T14:20:00Z"
    }
  },
  {
    id: "PB-004",
    timestamp: "2024-01-07 14:15:00",
    affiliateId: "AFF-001",
    affiliateName: "John Doe",
    conversionId: "CONV-004",
    offerId: "OFF-003",
    offerName: "New Year Promotion",
    postbackUrl: "https://advertiser.com/postback?click_id={click_id}&payout={payout}",
    status: "pending",
    responseCode: null,
    responseTime: null,
    response: "Pending",
    retryCount: 0,
    method: "GET",
    headers: {
      "User-Agent": "Trackdesk/1.0",
      "Content-Type": "application/json"
    },
    payload: {
      click_id: "CLK-345678",
      payout: 12.75,
      conversion_id: "CONV-004",
      timestamp: "2024-01-07T14:15:00Z"
    }
  },
  {
    id: "PB-005",
    timestamp: "2024-01-07 14:10:00",
    affiliateId: "AFF-004",
    affiliateName: "Sarah Wilson",
    conversionId: "CONV-005",
    offerId: "OFF-002",
    offerName: "Holiday Special",
    postbackUrl: "https://network.com/track?subid={subid}&amount={amount}",
    status: "success",
    responseCode: 200,
    responseTime: 156,
    response: "OK",
    retryCount: 0,
    method: "POST",
    headers: {
      "User-Agent": "Trackdesk/1.0",
      "Content-Type": "application/json"
    },
    payload: {
      subid: "SUB-456",
      amount: 30.00,
      conversion_id: "CONV-005",
      timestamp: "2024-01-07T14:10:00Z"
    }
  }
]

const statusTypes = [
  { value: "all", label: "All Status" },
  { value: "success", label: "Success" },
  { value: "failed", label: "Failed" },
  { value: "pending", label: "Pending" }
]

const methodTypes = [
  { value: "all", label: "All Methods" },
  { value: "GET", label: "GET" },
  { value: "POST", label: "POST" },
  { value: "PUT", label: "PUT" }
]

export default function PostbackLogsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [methodFilter, setMethodFilter] = useState("all")
  const [dateRange, setDateRange] = useState("today")

  const filteredLogs = postbackLogs.filter(log => {
    const matchesSearch = log.affiliateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.offerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.conversionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.postbackUrl.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === "all" || log.status === statusFilter
    const matchesMethod = methodFilter === "all" || log.method === methodFilter
    
    return matchesSearch && matchesStatus && matchesMethod
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "failed":
        return <XCircle className="h-4 w-4 text-red-600" />
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-600" />
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-600" />
    }
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

  const getMethodBadge = (method: string) => {
    switch (method) {
      case "GET":
        return <Badge variant="outline" className="border-blue-300 text-blue-700">GET</Badge>
      case "POST":
        return <Badge variant="outline" className="border-green-300 text-green-700">POST</Badge>
      case "PUT":
        return <Badge variant="outline" className="border-purple-300 text-purple-700">PUT</Badge>
      default:
        return <Badge variant="outline">{method}</Badge>
    }
  }

  const handleRetryPostback = (postbackId: string) => {
    console.log("Retrying postback:", postbackId)
  }

  const handleViewDetails = (postbackId: string) => {
    console.log("Viewing postback details:", postbackId)
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center">
            Postbacks tracking log
            <Send className="h-5 w-5 ml-2 text-slate-400" />
          </h1>
          <p className="text-slate-600">Logs &gt; Postbacks tracking log</p>
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
          <CardDescription>Filter postback logs by various criteria</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  id="search"
                  placeholder="Search postbacks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
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
              <Label htmlFor="methodFilter">Method</Label>
              <Select value={methodFilter} onValueChange={setMethodFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Select method" />
                </SelectTrigger>
                <SelectContent>
                  {methodTypes.map((type) => (
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

      {/* Postback Logs */}
      <Card>
        <CardHeader>
          <CardTitle>Postback Logs</CardTitle>
          <CardDescription>
            Showing {filteredLogs.length} of {postbackLogs.length} postback logs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredLogs.map((log) => (
              <div key={log.id} className="p-4 border rounded-lg hover:bg-slate-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      {getStatusIcon(log.status)}
                      <h3 className="font-medium">Postback to {log.affiliateName}</h3>
                      {getStatusBadge(log.status)}
                      {getMethodBadge(log.method)}
                      {log.retryCount > 0 && (
                        <Badge variant="outline" className="border-orange-300 text-orange-700">
                          Retry {log.retryCount}
                        </Badge>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-slate-600 mb-3">
                      <div>
                        <span className="font-medium">Affiliate:</span>
                        <p>{log.affiliateName} ({log.affiliateId})</p>
                      </div>
                      <div>
                        <span className="font-medium">Offer:</span>
                        <p>{log.offerName} ({log.offerId})</p>
                      </div>
                      <div>
                        <span className="font-medium">Conversion:</span>
                        <p className="font-mono">{log.conversionId}</p>
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <span className="font-medium text-sm">Postback URL:</span>
                      <p className="text-sm font-mono bg-slate-100 px-2 py-1 rounded mt-1 break-all">
                        {log.postbackUrl}
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs text-slate-500">
                      <div>
                        <span className="font-medium">Timestamp:</span>
                        <p>{log.timestamp}</p>
                      </div>
                      <div>
                        <span className="font-medium">Response Code:</span>
                        <p>{log.responseCode || "N/A"}</p>
                      </div>
                      <div>
                        <span className="font-medium">Response Time:</span>
                        <p>{log.responseTime ? `${log.responseTime}ms` : "N/A"}</p>
                      </div>
                      <div>
                        <span className="font-medium">Response:</span>
                        <p>{log.response}</p>
                      </div>
                    </div>
                    
                    <div className="mt-3 p-3 bg-slate-100 rounded-lg">
                      <h4 className="font-medium text-sm mb-2">Payload:</h4>
                      <pre className="text-xs text-slate-600 overflow-x-auto">
                        {JSON.stringify(log.payload, null, 2)}
                      </pre>
                    </div>
                  </div>
                  
                  <div className="ml-4 flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewDetails(log.id)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    {log.status === "failed" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRetryPostback(log.id)}
                      >
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    )}
                    <Button variant="outline" size="sm">
                      <Copy className="h-4 w-4" />
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
                <p className="text-sm font-medium text-slate-600">Total Postbacks</p>
                <p className="text-2xl font-bold text-slate-900">{postbackLogs.length}</p>
              </div>
              <Send className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Successful</p>
                <p className="text-2xl font-bold text-slate-900">
                  {postbackLogs.filter(log => log.status === "success").length}
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
                <p className="text-sm font-medium text-slate-600">Failed</p>
                <p className="text-2xl font-bold text-slate-900">
                  {postbackLogs.filter(log => log.status === "failed").length}
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
                <p className="text-sm font-medium text-slate-600">Pending</p>
                <p className="text-2xl font-bold text-slate-900">
                  {postbackLogs.filter(log => log.status === "pending").length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
