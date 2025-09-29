"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { 
  Smartphone, 
  Monitor, 
  Tablet,
  Download,
  Upload,
  Wifi,
  WifiOff,
  Bell,
  BellOff,
  Settings,
  CheckCircle,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Eye,
  BarChart3,
  Users,
  DollarSign,
  Target
} from "lucide-react"
import { toast } from "sonner"

// Mock data for mobile analytics
const mobileAnalytics = {
  totalUsers: 1250,
  mobileUsers: 890,
  desktopUsers: 360,
  mobilePercentage: 71.2,
  topDevices: [
    { device: "iPhone 14", users: 245, percentage: 19.6 },
    { device: "Samsung Galaxy S23", users: 189, percentage: 15.1 },
    { device: "iPhone 13", users: 156, percentage: 12.5 },
    { device: "iPad Pro", users: 134, percentage: 10.7 },
    { device: "Samsung Galaxy S22", users: 98, percentage: 7.8 }
  ],
  topBrowsers: [
    { browser: "Safari Mobile", users: 456, percentage: 36.5 },
    { browser: "Chrome Mobile", users: 389, percentage: 31.1 },
    { browser: "Safari Desktop", users: 234, percentage: 18.7 },
    { browser: "Chrome Desktop", users: 171, percentage: 13.7 }
  ],
  screenSizes: [
    { size: "375x667", users: 234, percentage: 18.7 },
    { size: "414x896", users: 198, percentage: 15.8 },
    { size: "1920x1080", users: 156, percentage: 12.5 },
    { size: "390x844", users: 134, percentage: 10.7 },
    { size: "1366x768", users: 98, percentage: 7.8 }
  ]
}

// Mock data for PWA metrics
const pwaMetrics = {
  installs: 456,
  installRate: 36.5,
  activeUsers: 389,
  retentionRate: 85.3,
  averageSessionTime: "4m 32s",
  bounceRate: 12.4,
  conversionRate: 8.7,
  offlineUsage: 23.1
}

// Mock data for push notifications
const pushNotifications = [
  {
    id: "PN-001",
    title: "New Commission Earned",
    body: "You earned $25.50 from your latest conversion",
    sent: 1250,
    delivered: 1189,
    opened: 456,
    clicked: 234,
    sentAt: "2024-01-15T14:30:00Z",
    status: "sent"
  },
  {
    id: "PN-002",
    title: "Weekly Performance Report",
    body: "Your performance summary for this week is ready",
    sent: 890,
    delivered: 845,
    opened: 389,
    clicked: 156,
    sentAt: "2024-01-14T09:00:00Z",
    status: "sent"
  },
  {
    id: "PN-003",
    title: "Payout Processed",
    body: "Your payout of $150.00 has been processed",
    sent: 450,
    delivered: 423,
    opened: 234,
    clicked: 189,
    sentAt: "2024-01-13T16:45:00Z",
    status: "sent"
  }
]

export default function MobilePWAPage() {
  const [selectedTab, setSelectedTab] = useState("analytics")
  const [isOnline, setIsOnline] = useState(true)
  const [pwaInstalled, setPwaInstalled] = useState(false)
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)

  // Check online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  // Check PWA installation
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(() => {
        setPwaInstalled(true)
      })
    }
  }, [])

  const handleInstallPWA = () => {
    toast.success("PWA installation initiated!")
  }

  const handleEnableNotifications = () => {
    if ('Notification' in window) {
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          setNotificationsEnabled(true)
          toast.success("Notifications enabled!")
        } else {
          setNotificationsEnabled(false)
          toast.error("Notification permission denied")
        }
      })
    }
  }

  const handleSendTestNotification = () => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Test Notification', {
        body: 'This is a test notification from Trackdesk',
        icon: '/icons/icon-192x192.png'
      })
      toast.success("Test notification sent!")
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "sent":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "failed":
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />
    }
  }

  const getDeviceIcon = (device: string) => {
    if (device.includes('iPhone') || device.includes('iPad')) {
      return <Smartphone className="h-4 w-4" />
    } else if (device.includes('Samsung') || device.includes('Galaxy')) {
      return <Smartphone className="h-4 w-4" />
    } else if (device.includes('Desktop') || device.includes('Chrome Desktop')) {
      return <Monitor className="h-4 w-4" />
    } else {
      return <Tablet className="h-4 w-4" />
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center">
            <Smartphone className="h-6 w-6 mr-2 text-blue-600" />
            Mobile & PWA
          </h1>
          <p className="text-slate-600">Mobile analytics, PWA features, and push notifications</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            {isOnline ? (
              <Wifi className="h-4 w-4 text-green-600" />
            ) : (
              <WifiOff className="h-4 w-4 text-red-600" />
            )}
            <span className="text-sm text-slate-600">
              {isOnline ? 'Online' : 'Offline'}
            </span>
          </div>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* PWA Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Download className="h-5 w-5 mr-2" />
            PWA Status
          </CardTitle>
          <CardDescription>Progressive Web App installation and features</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{pwaMetrics.installs}</div>
              <div className="text-sm text-slate-500">PWA Installs</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{pwaMetrics.installRate}%</div>
              <div className="text-sm text-slate-500">Install Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{pwaMetrics.retentionRate}%</div>
              <div className="text-sm text-slate-500">Retention Rate</div>
            </div>
          </div>
          <div className="mt-6 flex justify-center">
            <Button onClick={handleInstallPWA} disabled={pwaInstalled}>
              <Download className="h-4 w-4 mr-2" />
              {pwaInstalled ? 'PWA Installed' : 'Install PWA'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Mobile & PWA Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="analytics">Mobile Analytics</TabsTrigger>
          <TabsTrigger value="notifications">Push Notifications</TabsTrigger>
          <TabsTrigger value="offline">Offline Support</TabsTrigger>
        </TabsList>

        {/* Mobile Analytics */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Device Distribution</CardTitle>
                <CardDescription>User devices and screen sizes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Smartphone className="h-4 w-4 text-blue-600" />
                      <span className="text-sm">Mobile</span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{mobileAnalytics.mobileUsers}</div>
                      <div className="text-sm text-slate-600">{mobileAnalytics.mobilePercentage}%</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Monitor className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Desktop</span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{mobileAnalytics.desktopUsers}</div>
                      <div className="text-sm text-slate-600">{100 - mobileAnalytics.mobilePercentage}%</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>PWA Performance</CardTitle>
                <CardDescription>Progressive Web App metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Active Users</span>
                    <span className="font-semibold">{pwaMetrics.activeUsers}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Avg. Session Time</span>
                    <span className="font-semibold">{pwaMetrics.averageSessionTime}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Bounce Rate</span>
                    <span className="font-semibold">{pwaMetrics.bounceRate}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Conversion Rate</span>
                    <span className="font-semibold">{pwaMetrics.conversionRate}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Devices</CardTitle>
                <CardDescription>Most popular devices</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mobileAnalytics.topDevices.map((device, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-sm font-medium w-6">{index + 1}</span>
                        {getDeviceIcon(device.device)}
                        <span className="text-sm">{device.device}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold">{device.users}</div>
                        <div className="text-xs text-slate-600">{device.percentage}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Browser Distribution</CardTitle>
                <CardDescription>Browser usage across devices</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mobileAnalytics.topBrowsers.map((browser, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-sm font-medium w-6">{index + 1}</span>
                        <Monitor className="h-4 w-4 text-slate-400" />
                        <span className="text-sm">{browser.browser}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold">{browser.users}</div>
                        <div className="text-xs text-slate-600">{browser.percentage}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Push Notifications */}
        <TabsContent value="notifications" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Push Notifications</h2>
              <p className="text-slate-600">Manage push notifications and engagement</p>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={handleSendTestNotification}>
                <Bell className="h-4 w-4 mr-2" />
                Send Test
              </Button>
              <Button variant="outline" size="sm" onClick={handleEnableNotifications}>
                {notificationsEnabled ? (
                  <BellOff className="h-4 w-4 mr-2" />
                ) : (
                  <Bell className="h-4 w-4 mr-2" />
                )}
                {notificationsEnabled ? 'Disable' : 'Enable'}
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            {pushNotifications.map((notification) => (
              <Card key={notification.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center">
                        {notification.title}
                        {getStatusIcon(notification.status)}
                      </CardTitle>
                      <CardDescription>
                        {notification.body} • Sent: {new Date(notification.sentAt).toLocaleString()}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-lg font-semibold text-blue-600">{notification.sent}</div>
                      <div className="text-xs text-slate-500">Sent</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold text-green-600">{notification.delivered}</div>
                      <div className="text-xs text-slate-500">Delivered</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold text-purple-600">{notification.opened}</div>
                      <div className="text-xs text-slate-500">Opened</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold text-orange-600">{notification.clicked}</div>
                      <div className="text-xs text-slate-500">Clicked</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Configure push notification preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Commission Notifications</Label>
                    <p className="text-xs text-slate-600">Get notified when you earn commissions</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Performance Reports</Label>
                    <p className="text-xs text-slate-600">Weekly performance summaries</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Payout Notifications</Label>
                    <p className="text-xs text-slate-600">When payouts are processed</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Marketing Updates</Label>
                    <p className="text-xs text-slate-600">New offers and promotional content</p>
                  </div>
                  <Switch />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Offline Support */}
        <TabsContent value="offline" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Offline Support</h2>
              <p className="text-slate-600">PWA offline capabilities and cached content</p>
            </div>
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Cache
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Offline Usage</CardTitle>
                <CardDescription>How users interact when offline</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Offline Sessions</span>
                    <span className="font-semibold">{pwaMetrics.offlineUsage}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Cached Pages</span>
                    <span className="font-semibold">15</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Cache Size</span>
                    <span className="font-semibold">2.3 MB</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Cache Hit Rate</span>
                    <span className="font-semibold text-green-600">94.2%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Service Worker Status</CardTitle>
                <CardDescription>PWA service worker information</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Service Worker</span>
                    <Badge variant="default" className="bg-green-100 text-green-800">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Cache Strategy</span>
                    <span className="font-semibold">Cache First</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Background Sync</span>
                    <Badge variant="default" className="bg-green-100 text-green-800">Enabled</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Push Support</span>
                    <Badge variant="default" className="bg-green-100 text-green-800">Supported</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Cached Content */}
          <Card>
            <CardHeader>
              <CardTitle>Cached Content</CardTitle>
              <CardDescription>Pages and resources available offline</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-2 bg-slate-50 rounded">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Dashboard</span>
                  </div>
                  <span className="text-xs text-slate-600">2.1 KB</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-slate-50 rounded">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Analytics</span>
                  </div>
                  <span className="text-xs text-slate-600">1.8 KB</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-slate-50 rounded">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Link Generator</span>
                  </div>
                  <span className="text-xs text-slate-600">1.5 KB</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-slate-50 rounded">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Commissions</span>
                  </div>
                  <span className="text-xs text-slate-600">1.2 KB</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}


