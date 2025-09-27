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
  AlertCircle,
  CheckCircle,
  Info,
  XCircle
} from "lucide-react"
import { toast } from "sonner"

// Mock logs data
const logsData = [
  {
    id: "LOG-001",
    timestamp: "2024-01-15T10:30:00Z",
    level: "info",
    message: "User login successful",
    source: "auth",
    userId: "user-123",
    ipAddress: "192.168.1.100",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    details: {
      action: "login",
      method: "email",
      success: true
    }
  },
  {
    id: "LOG-002",
    timestamp: "2024-01-15T10:25:00Z",
    level: "warning",
    message: "Failed login attempt",
    source: "auth",
    userId: null,
    ipAddress: "192.168.1.101",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    details: {
      action: "login",
      method: "email",
      success: false,
      reason: "invalid_credentials"
    }
  },
  {
    id: "LOG-003",
    timestamp: "2024-01-15T10:20:00Z",
    level: "error",
    message: "Payment processing failed",
    source: "payment",
    userId: "user-456",
    ipAddress: "192.168.1.102",
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
    details: {
      action: "process_payment",
      amount: 150.00,
      method: "stripe",
      error: "card_declined"
    }
  },
  {
    id: "LOG-004",
    timestamp: "2024-01-15T10:15:00Z",
    level: "info",
    message: "Affiliate link generated",
    source: "affiliate",
    userId: "affiliate-789",
    ipAddress: "192.168.1.103",
    userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15",
    details: {
      action: "generate_link",
      originalUrl: "https://example.com/product",
      affiliateUrl: "https://affiliate.example.com/ref/abc123/product"
    }
  },
  {
    id: "LOG-005",
    timestamp: "2024-01-15T10:10:00Z",
    level: "success",
    message: "Conversion recorded",
    source: "conversion",
    userId: "affiliate-789",
    ipAddress: "192.168.1.104",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    details: {
      action: "record_conversion",
      conversionId: "CONV-12345",
      amount: 75.00,
      commission: 15.00
    }
  }
]

export default function LogsPage() {
  const [logs, setLogs] = useState(logsData)
  const [searchTerm, setSearchTerm] = useState("")
  const [levelFilter, setLevelFilter] = useState("all")
  const [sourceFilter, setSourceFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("all")

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (log.userId && log.userId.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesLevel = levelFilter === "all" || log.level === levelFilter
    const matchesSource = sourceFilter === "all" || log.source === sourceFilter
    return matchesSearch && matchesLevel && matchesSource
  })

  const handleRefresh = () => {
    // Simulate refresh by adding a new log entry
    const newLog = {
      id: `LOG-${Date.now()}`,
      timestamp: new Date().toISOString(),
      level: "info",
      message: "System refreshed",
      source: "system",
      userId: null,
      ipAddress: "127.0.0.1",
      userAgent: "System",
      details: {
        action: "refresh",
        method: "system",
        success: true,
        reason: "manual_refresh"
      }
    }
    
    setLogs(prev => [newLog, ...prev])
    toast.success("Logs refreshed!")
  }

  const handleExport = () => {
    // Simulate export
    toast.success("Logs exported successfully!")
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case "error": return "bg-red-100 text-red-800"
      case "warning": return "bg-yellow-100 text-yellow-800"
      case "info": return "bg-blue-100 text-blue-800"
      case "success": return "bg-green-100 text-green-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getLevelIcon = (level: string) => {
    switch (level) {
      case "error": return <XCircle className="h-4 w-4 text-red-600" />
      case "warning": return <AlertCircle className="h-4 w-4 text-yellow-600" />
      case "info": return <Info className="h-4 w-4 text-blue-600" />
      case "success": return <CheckCircle className="h-4 w-4 text-green-600" />
      default: return <Info className="h-4 w-4 text-gray-600" />
    }
  }

  const errorCount = logs.filter(l => l.level === "error").length
  const warningCount = logs.filter(l => l.level === "warning").length
  const infoCount = logs.filter(l => l.level === "info").length
  const successCount = logs.filter(l => l.level === "success").length

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">System Logs</h1>
          <p className="text-slate-600">Monitor system activity and troubleshoot issues</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Total Logs</p>
                <p className="text-2xl font-bold">{logs.length}</p>
              </div>
              <FileText className="h-8 w-8 text-slate-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Errors</p>
                <p className="text-2xl font-bold text-red-600">{errorCount}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Warnings</p>
                <p className="text-2xl font-bold text-yellow-600">{warningCount}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Info</p>
                <p className="text-2xl font-bold text-blue-600">{infoCount}</p>
              </div>
              <Info className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search logs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={levelFilter} onValueChange={setLevelFilter}>
          <SelectTrigger className="w-40">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Levels</SelectItem>
            <SelectItem value="error">Error</SelectItem>
            <SelectItem value="warning">Warning</SelectItem>
            <SelectItem value="info">Info</SelectItem>
            <SelectItem value="success">Success</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sourceFilter} onValueChange={setSourceFilter}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sources</SelectItem>
            <SelectItem value="auth">Authentication</SelectItem>
            <SelectItem value="payment">Payment</SelectItem>
            <SelectItem value="affiliate">Affiliate</SelectItem>
            <SelectItem value="conversion">Conversion</SelectItem>
          </SelectContent>
        </Select>
        <Select value={dateFilter} onValueChange={setDateFilter}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Time</SelectItem>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="yesterday">Yesterday</SelectItem>
            <SelectItem value="7d">Last 7 Days</SelectItem>
            <SelectItem value="30d">Last 30 Days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Logs List */}
      <div className="space-y-4">
        {filteredLogs.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <FileText className="h-12 w-12 mx-auto text-slate-400 mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">No logs found</h3>
              <p className="text-slate-500">Try adjusting your search or filter criteria.</p>
            </CardContent>
          </Card>
        ) : (
          filteredLogs.map((log) => (
            <Card key={log.id}>
              <CardContent className="p-4">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 mt-1">
                    {getLevelIcon(log.level)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge className={`text-xs ${getLevelColor(log.level)}`}>
                        {log.level}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {log.source}
                      </Badge>
                      <span className="text-xs text-slate-500">
                        {new Date(log.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-slate-900 mb-1">{log.message}</p>
                    <div className="text-xs text-slate-500 space-y-1">
                      {log.userId && <p>User ID: {log.userId}</p>}
                      <p>IP: {log.ipAddress}</p>
                      {log.details && Object.keys(log.details).length > 0 && (
                        <div className="mt-2 p-2 bg-slate-50 rounded text-xs">
                          <p className="font-medium mb-1">Details:</p>
                          <pre className="whitespace-pre-wrap">
                            {JSON.stringify(log.details, null, 2)}
                          </pre>
                        </div>
                      )}
                    </div>
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
