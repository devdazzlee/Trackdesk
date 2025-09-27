"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  AlertTriangle, 
  Search, 
  Filter, 
  Download, 
  RefreshCw,
  XCircle,
  CheckCircle,
  Clock,
  Eye,
  Copy,
  ExternalLink,
  Activity,
  Bug,
  Shield,
  Zap
} from "lucide-react"

// Mock data for conversion error logs
const conversionErrorLogs = [
  {
    id: "ERR-001",
    timestamp: "2024-01-07 14:30:00",
    affiliateId: "AFF-001",
    affiliateName: "John Doe",
    conversionId: "CONV-001",
    offerId: "OFF-001",
    offerName: "Black Friday Sale 2024",
    errorType: "validation_error",
    errorCode: "INVALID_CLICK_ID",
    errorMessage: "Click ID not found or expired",
    severity: "high",
    status: "unresolved",
    retryCount: 3,
    lastRetry: "2024-01-07 14:25:00",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
    ipAddress: "203.0.113.45",
    referrer: "https://example.com/landing-page",
    conversionData: {
      click_id: "CLK-123456",
      payout: 15.50,
      conversion_id: "CONV-001",
      timestamp: "2024-01-07T14:30:00Z"
    }
  },
  {
    id: "ERR-002",
    timestamp: "2024-01-07 14:25:00",
    affiliateId: "AFF-002",
    affiliateName: "Jane Smith",
    conversionId: "CONV-002",
    offerId: "OFF-002",
    offerName: "Holiday Special",
    errorType: "network_error",
    errorCode: "TIMEOUT",
    errorMessage: "Network timeout while processing conversion",
    severity: "medium",
    status: "resolved",
    retryCount: 1,
    lastRetry: "2024-01-07 14:20:00",
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
    ipAddress: "192.168.1.100",
    referrer: "https://social-media.com/post",
    conversionData: {
      click_id: "CLK-789012",
      payout: 25.00,
      conversion_id: "CONV-002",
      timestamp: "2024-01-07T14:25:00Z"
    }
  },
  {
    id: "ERR-003",
    timestamp: "2024-01-07 14:20:00",
    affiliateId: "AFF-003",
    affiliateName: "Mike Johnson",
    conversionId: "CONV-003",
    offerId: "OFF-001",
    offerName: "Black Friday Sale 2024",
    errorType: "duplicate_conversion",
    errorCode: "DUPLICATE_TRANSACTION",
    errorMessage: "Duplicate conversion detected for the same click ID",
    severity: "low",
    status: "unresolved",
    retryCount: 0,
    lastRetry: null,
    userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 15_0)",
    ipAddress: "203.0.113.46",
    referrer: "https://mobile-app.com/deep-link",
    conversionData: {
      click_id: "CLK-345678",
      payout: 12.75,
      conversion_id: "CONV-003",
      timestamp: "2024-01-07T14:20:00Z"
    }
  },
  {
    id: "ERR-004",
    timestamp: "2024-01-07 14:15:00",
    affiliateId: "AFF-004",
    affiliateName: "Sarah Wilson",
    conversionId: "CONV-004",
    offerId: "OFF-003",
    offerName: "New Year Promotion",
    errorType: "fraud_detection",
    errorCode: "SUSPICIOUS_ACTIVITY",
    errorMessage: "Conversion flagged for suspicious activity patterns",
    severity: "critical",
    status: "investigating",
    retryCount: 0,
    lastRetry: null,
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
    ipAddress: "203.0.113.47",
    referrer: "https://suspicious-site.com/fake-traffic",
    conversionData: {
      click_id: "CLK-901234",
      payout: 50.00,
      conversion_id: "CONV-004",
      timestamp: "2024-01-07T14:15:00Z"
    }
  },
  {
    id: "ERR-005",
    timestamp: "2024-01-07 14:10:00",
    affiliateId: "AFF-001",
    affiliateName: "John Doe",
    conversionId: "CONV-005",
    offerId: "OFF-002",
    offerName: "Holiday Special",
    errorType: "system_error",
    errorCode: "DATABASE_CONNECTION_FAILED",
    errorMessage: "Database connection failed while saving conversion",
    severity: "high",
    status: "resolved",
    retryCount: 2,
    lastRetry: "2024-01-07 14:05:00",
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
    ipAddress: "192.168.1.100",
    referrer: "https://example.com/landing-page",
    conversionData: {
      click_id: "CLK-567890",
      payout: 30.00,
      conversion_id: "CONV-005",
      timestamp: "2024-01-07T14:10:00Z"
    }
  }
]

const errorTypes = [
  { value: "all", label: "All Error Types" },
  { value: "validation_error", label: "Validation Error" },
  { value: "network_error", label: "Network Error" },
  { value: "duplicate_conversion", label: "Duplicate Conversion" },
  { value: "fraud_detection", label: "Fraud Detection" },
  { value: "system_error", label: "System Error" }
]

const severityTypes = [
  { value: "all", label: "All Severity" },
  { value: "critical", label: "Critical" },
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" }
]

const statusTypes = [
  { value: "all", label: "All Status" },
  { value: "unresolved", label: "Unresolved" },
  { value: "resolved", label: "Resolved" },
  { value: "investigating", label: "Investigating" }
]

export default function ConversionErrorLogsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [errorTypeFilter, setErrorTypeFilter] = useState("all")
  const [severityFilter, setSeverityFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [dateRange, setDateRange] = useState("today")

  const filteredLogs = conversionErrorLogs.filter(log => {
    const matchesSearch = log.affiliateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.offerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.conversionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.errorMessage.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesErrorType = errorTypeFilter === "all" || log.errorType === errorTypeFilter
    const matchesSeverity = severityFilter === "all" || log.severity === severityFilter
    const matchesStatus = statusFilter === "all" || log.status === statusFilter
    
    return matchesSearch && matchesErrorType && matchesSeverity && matchesStatus
  })

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "critical":
        return <XCircle className="h-4 w-4 text-red-600" />
      case "high":
        return <AlertTriangle className="h-4 w-4 text-orange-600" />
      case "medium":
        return <Clock className="h-4 w-4 text-yellow-600" />
      case "low":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      default:
        return <Bug className="h-4 w-4 text-gray-600" />
    }
  }

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "critical":
        return <Badge variant="destructive">Critical</Badge>
      case "high":
        return <Badge variant="outline" className="border-red-300 text-red-700">High</Badge>
      case "medium":
        return <Badge variant="outline" className="border-yellow-300 text-yellow-700">Medium</Badge>
      case "low":
        return <Badge variant="outline" className="border-green-300 text-green-700">Low</Badge>
      default:
        return <Badge variant="outline">{severity}</Badge>
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "resolved":
        return <Badge variant="default" className="bg-green-600">Resolved</Badge>
      case "unresolved":
        return <Badge variant="destructive">Unresolved</Badge>
      case "investigating":
        return <Badge variant="secondary">Investigating</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getErrorTypeBadge = (errorType: string) => {
    switch (errorType) {
      case "validation_error":
        return <Badge variant="outline" className="border-blue-300 text-blue-700">Validation</Badge>
      case "network_error":
        return <Badge variant="outline" className="border-purple-300 text-purple-700">Network</Badge>
      case "duplicate_conversion":
        return <Badge variant="outline" className="border-orange-300 text-orange-700">Duplicate</Badge>
      case "fraud_detection":
        return <Badge variant="outline" className="border-red-300 text-red-700">Fraud</Badge>
      case "system_error":
        return <Badge variant="outline" className="border-gray-300 text-gray-700">System</Badge>
      default:
        return <Badge variant="outline">{errorType}</Badge>
    }
  }

  const handleResolveError = (errorId: string) => {
    console.log("Resolving error:", errorId)
  }

  const handleRetryConversion = (errorId: string) => {
    console.log("Retrying conversion:", errorId)
  }

  const handleViewDetails = (errorId: string) => {
    console.log("Viewing error details:", errorId)
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center">
            Conversion error log
            <AlertTriangle className="h-5 w-5 ml-2 text-slate-400" />
          </h1>
          <p className="text-slate-600">Logs &gt; Conversion error log</p>
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
          <CardDescription>Filter conversion error logs by various criteria</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  id="search"
                  placeholder="Search errors..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="errorTypeFilter">Error Type</Label>
              <Select value={errorTypeFilter} onValueChange={setErrorTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Select error type" />
                </SelectTrigger>
                <SelectContent>
                  {errorTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="severityFilter">Severity</Label>
              <Select value={severityFilter} onValueChange={setSeverityFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Select severity" />
                </SelectTrigger>
                <SelectContent>
                  {severityTypes.map((type) => (
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

      {/* Conversion Error Logs */}
      <Card>
        <CardHeader>
          <CardTitle>Conversion Error Logs</CardTitle>
          <CardDescription>
            Showing {filteredLogs.length} of {conversionErrorLogs.length} conversion errors
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredLogs.map((log) => (
              <div key={log.id} className="p-4 border rounded-lg hover:bg-slate-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      {getSeverityIcon(log.severity)}
                      <h3 className="font-medium">{log.errorMessage}</h3>
                      {getSeverityBadge(log.severity)}
                      {getStatusBadge(log.status)}
                      {getErrorTypeBadge(log.errorType)}
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
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs text-slate-500 mb-3">
                      <div>
                        <span className="font-medium">Error Code:</span>
                        <p className="font-mono">{log.errorCode}</p>
                      </div>
                      <div>
                        <span className="font-medium">Timestamp:</span>
                        <p>{log.timestamp}</p>
                      </div>
                      <div>
                        <span className="font-medium">Retry Count:</span>
                        <p>{log.retryCount}</p>
                      </div>
                      <div>
                        <span className="font-medium">Last Retry:</span>
                        <p>{log.lastRetry || "Never"}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-500 mb-3">
                      <div>
                        <span className="font-medium">IP Address:</span>
                        <p className="font-mono">{log.ipAddress}</p>
                      </div>
                      <div>
                        <span className="font-medium">User Agent:</span>
                        <p className="truncate">{log.userAgent}</p>
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <span className="font-medium text-sm">Referrer:</span>
                      <p className="text-sm font-mono bg-slate-100 px-2 py-1 rounded mt-1 break-all">
                        {log.referrer}
                      </p>
                    </div>
                    
                    <div className="p-3 bg-slate-100 rounded-lg">
                      <h4 className="font-medium text-sm mb-2">Conversion Data:</h4>
                      <pre className="text-xs text-slate-600 overflow-x-auto">
                        {JSON.stringify(log.conversionData, null, 2)}
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
                    {log.status === "unresolved" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleResolveError(log.id)}
                      >
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                    )}
                    {log.status === "unresolved" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRetryConversion(log.id)}
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
                <p className="text-sm font-medium text-slate-600">Total Errors</p>
                <p className="text-2xl font-bold text-slate-900">{conversionErrorLogs.length}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Unresolved</p>
                <p className="text-2xl font-bold text-slate-900">
                  {conversionErrorLogs.filter(log => log.status === "unresolved").length}
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
                <p className="text-sm font-medium text-slate-600">Resolved</p>
                <p className="text-2xl font-bold text-slate-900">
                  {conversionErrorLogs.filter(log => log.status === "resolved").length}
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
                <p className="text-sm font-medium text-slate-600">Critical</p>
                <p className="text-2xl font-bold text-slate-900">
                  {conversionErrorLogs.filter(log => log.severity === "critical").length}
                </p>
              </div>
              <Shield className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
