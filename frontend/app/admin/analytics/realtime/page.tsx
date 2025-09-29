"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Activity, 
  Zap, 
  Globe, 
  Smartphone, 
  Monitor,
  Clock,
  TrendingUp,
  Users,
  MousePointer,
  Target,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw,
  Settings,
  Bell,
  Eye,
  Filter
} from "lucide-react"
import { toast } from "sonner"

// Mock data for real-time analytics
const realTimeData = {
  activeUsers: 127,
  liveClicks: 23,
  liveConversions: 3,
  liveRevenue: 89.50,
  topCountries: [
    { country: "United States", clicks: 45, percentage: 35 },
    { country: "Canada", clicks: 28, percentage: 22 },
    { country: "United Kingdom", clicks: 19, percentage: 15 },
    { country: "Germany", clicks: 15, percentage: 12 },
    { country: "Australia", clicks: 12, percentage: 9 }
  ],
  topDevices: [
    { device: "Desktop", clicks: 67, percentage: 52 },
    { device: "Mobile", clicks: 45, percentage: 35 },
    { device: "Tablet", clicks: 16, percentage: 13 }
  ],
  topBrowsers: [
    { browser: "Chrome", clicks: 78, percentage: 61 },
    { browser: "Safari", clicks: 28, percentage: 22 },
    { browser: "Firefox", clicks: 15, percentage: 12 },
    { browser: "Edge", clicks: 7, percentage: 5 }
  ]
}

const liveActivity = [
  {
    id: "ACT-001",
    type: "click",
    user: "John Doe",
    action: "Clicked Premium Plan link",
    timestamp: "2024-01-15T14:30:25Z",
    location: "New York, US",
    device: "Desktop",
    status: "success"
  },
  {
    id: "ACT-002",
    type: "conversion",
    user: "Sarah Wilson",
    action: "Converted Basic Plan",
    timestamp: "2024-01-15T14:28:15Z",
    location: "Toronto, CA",
    device: "Mobile",
    status: "success"
  },
  {
    id: "ACT-003",
    type: "click",
    user: "Mike Johnson",
    action: "Clicked Enterprise link",
    timestamp: "2024-01-15T14:25:42Z",
    location: "London, UK",
    device: "Desktop",
    status: "success"
  },
  {
    id: "ACT-004",
    type: "fraud",
    user: "Suspicious User",
    action: "Blocked suspicious activity",
    timestamp: "2024-01-15T14:22:10Z",
    location: "Unknown",
    device: "Unknown",
    status: "blocked"
  }
]

export default function RealTimeAnalyticsPage() {
  const [isLive, setIsLive] = useState(true)
  const [refreshInterval, setRefreshInterval] = useState(5)
  const [selectedMetric, setSelectedMetric] = useState("all")
  const [filterCountry, setFilterCountry] = useState("all")
  const [filterDevice, setFilterDevice] = useState("all")

  // Simulate real-time updates
  useEffect(() => {
    if (!isLive) return

    const interval = setInterval(() => {
      // Simulate real-time data updates
      toast.success("Real-time data updated", {
        duration: 1000
      })
    }, refreshInterval * 1000)

    return () => clearInterval(interval)
  }, [isLive, refreshInterval])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "blocked":
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return <Activity className="h-4 w-4 text-blue-600" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "success":
        return <Badge variant="default" className="bg-green-100 text-green-800">Success</Badge>
      case "blocked":
        return <Badge variant="destructive">Blocked</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center">
            <Activity className="h-6 w-6 mr-2 text-blue-600" />
            Real-Time Analytics
          </h1>
          <p className="text-slate-600">Live tracking and monitoring dashboard</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <Switch
              checked={isLive}
              onCheckedChange={setIsLive}
            />
            <Label className="text-sm">
              {isLive ? (
                <span className="flex items-center text-green-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                  Live
                </span>
              ) : (
                <span className="text-slate-500">Paused</span>
              )}
            </Label>
          </div>
          <Select value={refreshInterval.toString()} onValueChange={(value) => setRefreshInterval(parseInt(value))}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 second</SelectItem>
              <SelectItem value="5">5 seconds</SelectItem>
              <SelectItem value="10">10 seconds</SelectItem>
              <SelectItem value="30">30 seconds</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Live Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{realTimeData.activeUsers}</div>
            <p className="text-xs text-green-600 flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" />
              +12% from last hour
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Live Clicks</CardTitle>
            <MousePointer className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{realTimeData.liveClicks}</div>
            <p className="text-xs text-green-600 flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" />
              +8% from last hour
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Live Conversions</CardTitle>
            <Target className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{realTimeData.liveConversions}</div>
            <p className="text-xs text-green-600 flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" />
              +15% from last hour
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Live Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${realTimeData.liveRevenue}</div>
            <p className="text-xs text-green-600 flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" />
              +22% from last hour
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Live Activity Feed */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bell className="h-5 w-5 mr-2" />
            Live Activity Feed
          </CardTitle>
          <CardDescription>Real-time activity monitoring</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {liveActivity.map((activity) => (
              <div key={activity.id} className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-slate-50 transition-colors">
                <div className="flex-shrink-0">
                  {getStatusIcon(activity.status)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-slate-900 truncate">
                      {activity.user}
                    </p>
                    <div className="flex items-center space-x-2">
                      {getStatusBadge(activity.status)}
                      <span className="text-xs text-slate-500">
                        {new Date(activity.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 mt-1">
                    {activity.action}
                  </p>
                  <div className="flex items-center space-x-4 mt-2 text-xs text-slate-500">
                    <span className="flex items-center">
                      <Globe className="h-3 w-3 mr-1" />
                      {activity.location}
                    </span>
                    <span className="flex items-center">
                      {activity.device === "Desktop" ? (
                        <Monitor className="h-3 w-3 mr-1" />
                      ) : activity.device === "Mobile" ? (
                        <Smartphone className="h-3 w-3 mr-1" />
                      ) : (
                        <Activity className="h-3 w-3 mr-1" />
                      )}
                      {activity.device}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Analytics Tabs */}
      <Tabs defaultValue="countries" className="space-y-6">
        <TabsList>
          <TabsTrigger value="countries">Top Countries</TabsTrigger>
          <TabsTrigger value="devices">Device Types</TabsTrigger>
          <TabsTrigger value="browsers">Browsers</TabsTrigger>
        </TabsList>

        <TabsContent value="countries">
          <Card>
            <CardHeader>
              <CardTitle>Top Countries (Last Hour)</CardTitle>
              <CardDescription>Geographic distribution of traffic</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {realTimeData.topCountries.map((country, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-medium w-8">{index + 1}</span>
                      <Globe className="h-4 w-4 text-slate-400" />
                      <span className="text-sm">{country.country}</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-slate-600">{country.clicks} clicks</span>
                      <div className="w-24 bg-slate-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${country.percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium w-12 text-right">{country.percentage}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="devices">
          <Card>
            <CardHeader>
              <CardTitle>Device Types (Last Hour)</CardTitle>
              <CardDescription>Traffic by device category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {realTimeData.topDevices.map((device, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-medium w-8">{index + 1}</span>
                      {device.device === "Desktop" ? (
                        <Monitor className="h-4 w-4 text-slate-400" />
                      ) : device.device === "Mobile" ? (
                        <Smartphone className="h-4 w-4 text-slate-400" />
                      ) : (
                        <Activity className="h-4 w-4 text-slate-400" />
                      )}
                      <span className="text-sm">{device.device}</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-slate-600">{device.clicks} clicks</span>
                      <div className="w-24 bg-slate-200 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full" 
                          style={{ width: `${device.percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium w-12 text-right">{device.percentage}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="browsers">
          <Card>
            <CardHeader>
              <CardTitle>Browser Types (Last Hour)</CardTitle>
              <CardDescription>Traffic by browser</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {realTimeData.topBrowsers.map((browser, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-medium w-8">{index + 1}</span>
                      <Activity className="h-4 w-4 text-slate-400" />
                      <span className="text-sm">{browser.browser}</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-slate-600">{browser.clicks} clicks</span>
                      <div className="w-24 bg-slate-200 rounded-full h-2">
                        <div 
                          className="bg-purple-600 h-2 rounded-full" 
                          style={{ width: `${browser.percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium w-12 text-right">{browser.percentage}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Fraud Detection Alerts */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="flex items-center text-red-600">
            <AlertTriangle className="h-5 w-5 mr-2" />
            Fraud Detection Alerts
          </CardTitle>
          <CardDescription>Real-time security monitoring</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <XCircle className="h-5 w-5 text-red-600" />
                <div>
                  <p className="text-sm font-medium text-red-900">Suspicious Click Pattern</p>
                  <p className="text-xs text-red-700">Multiple clicks from same IP in short time</p>
                </div>
              </div>
              <Badge variant="destructive">Blocked</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                <div>
                  <p className="text-sm font-medium text-yellow-900">Unusual Traffic Spike</p>
                  <p className="text-xs text-yellow-700">Traffic increased by 300% in last 5 minutes</p>
                </div>
              </div>
              <Badge variant="secondary">Monitoring</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


