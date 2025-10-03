"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DataTable } from "@/components/dashboard/data-table"
import { LineChartComponent } from "@/components/charts/line-chart"
import { BarChartComponent } from "@/components/charts/bar-chart"
import { DoughnutChartComponent } from "@/components/charts/doughnut-chart"
import { 
  Globe, 
  Users, 
  MousePointer, 
  Target, 
  TrendingUp,
  Download,
  Copy,
  Eye,
  Settings,
  Plus,
  Trash2,
  Edit
} from "lucide-react"

// Mock data for websites
const websites = [
  {
    id: "web-001",
    name: "My E-commerce Store",
    domain: "mystore.com",
    status: "active",
    pageViews: 15420,
    uniqueVisitors: 8930,
    conversionRate: 3.2,
    lastActivity: "2024-01-07 14:30",
    createdAt: "2024-01-01"
  },
  {
    id: "web-002", 
    name: "Blog Site",
    domain: "myblog.com",
    status: "active",
    pageViews: 8920,
    uniqueVisitors: 4560,
    conversionRate: 1.8,
    lastActivity: "2024-01-07 12:15",
    createdAt: "2024-01-05"
  },
  {
    id: "web-003",
    name: "Landing Page",
    domain: "landing.example.com", 
    status: "paused",
    pageViews: 2340,
    uniqueVisitors: 1890,
    conversionRate: 5.1,
    lastActivity: "2024-01-06 18:45",
    createdAt: "2024-01-10"
  }
]

// Mock analytics data
const performanceData = [
  { date: "2024-01-01", pageViews: 1200, uniqueVisitors: 800, conversions: 24 },
  { date: "2024-01-02", pageViews: 1500, uniqueVisitors: 950, conversions: 32 },
  { date: "2024-01-03", pageViews: 1800, uniqueVisitors: 1100, conversions: 45 },
  { date: "2024-01-04", pageViews: 2000, uniqueVisitors: 1200, conversions: 52 },
  { date: "2024-01-05", pageViews: 1600, uniqueVisitors: 1000, conversions: 38 },
  { date: "2024-01-06", pageViews: 2200, uniqueVisitors: 1300, conversions: 65 },
  { date: "2024-01-07", pageViews: 1900, uniqueVisitors: 1150, conversions: 48 },
]

const topPagesData = [
  { page: "/", views: 4500, uniqueVisitors: 3200, bounceRate: 35 },
  { page: "/products", views: 3200, uniqueVisitors: 2800, bounceRate: 42 },
  { page: "/about", views: 1800, uniqueVisitors: 1600, bounceRate: 28 },
  { page: "/contact", views: 1200, uniqueVisitors: 1100, bounceRate: 55 },
]

const deviceData = [
  { name: "Desktop", value: 65, color: "#3b82f6" },
  { name: "Mobile", value: 30, color: "#10b981" },
  { name: "Tablet", value: 5, color: "#f59e0b" },
]

const websiteColumns = [
  { key: "name", label: "Website Name", sortable: true },
  { key: "domain", label: "Domain", sortable: true },
  { 
    key: "status", 
    label: "Status", 
    sortable: true,
    render: (value: string) => (
      <Badge variant={value === "active" ? "default" : "secondary"}>
        {value.charAt(0).toUpperCase() + value.slice(1)}
      </Badge>
    )
  },
  { key: "pageViews", label: "Page Views", sortable: true },
  { key: "uniqueVisitors", label: "Unique Visitors", sortable: true },
  { 
    key: "conversionRate", 
    label: "Conversion Rate", 
    sortable: true,
    render: (value: number) => `${value}%`
  },
  { key: "lastActivity", label: "Last Activity", sortable: true },
  { 
    key: "actions", 
    label: "Actions", 
    sortable: false,
    render: (value: any, row: any) => (
      <div className="flex space-x-2">
        <Button size="sm" variant="outline">
          <Eye className="h-4 w-4" />
        </Button>
        <Button size="sm" variant="outline">
          <Edit className="h-4 w-4" />
        </Button>
        <Button size="sm" variant="outline">
          <Settings className="h-4 w-4" />
        </Button>
      </div>
    )
  }
]

export default function TrackingPage() {
  const [selectedWebsite, setSelectedWebsite] = useState(websites[0])
  const [showAddWebsite, setShowAddWebsite] = useState(false)
  const [newWebsite, setNewWebsite] = useState({
    name: "",
    domain: "",
    description: ""
  })

  const handleAddWebsite = () => {
    // Add website logic here
    console.log("Adding website:", newWebsite)
    setShowAddWebsite(false)
    setNewWebsite({ name: "", domain: "", description: "" })
  }

  const copyTrackingCode = (websiteId: string) => {
    const trackingCode = `<script src="https://cdn.trackdesk.com/trackdesk.js" data-website-id="${websiteId}" data-auto-init="true"></script>`
    navigator.clipboard.writeText(trackingCode)
    // Show success message
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Website Tracking</h1>
          <p className="text-slate-600">Monitor and analyze website performance across all your properties</p>
        </div>
        <Button onClick={() => setShowAddWebsite(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Website
        </Button>
      </div>

      {/* Add Website Modal */}
      {showAddWebsite && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Website</CardTitle>
            <CardDescription>Add a new website to track with Trackdesk</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Website Name</Label>
              <Input
                id="name"
                value={newWebsite.name}
                onChange={(e) => setNewWebsite({...newWebsite, name: e.target.value})}
                placeholder="My Website"
              />
            </div>
            <div>
              <Label htmlFor="domain">Domain</Label>
              <Input
                id="domain"
                value={newWebsite.domain}
                onChange={(e) => setNewWebsite({...newWebsite, domain: e.target.value})}
                placeholder="example.com"
              />
            </div>
            <div>
              <Label htmlFor="description">Description (Optional)</Label>
              <Input
                id="description"
                value={newWebsite.description}
                onChange={(e) => setNewWebsite({...newWebsite, description: e.target.value})}
                placeholder="Brief description of your website"
              />
            </div>
            <div className="flex space-x-2">
              <Button onClick={handleAddWebsite}>Add Website</Button>
              <Button variant="outline" onClick={() => setShowAddWebsite(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* KPI Tiles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Websites</CardTitle>
            <Globe className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{websites.length}</div>
            <p className="text-xs text-slate-500">Active tracking properties</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Page Views</CardTitle>
            <MousePointer className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {websites.reduce((sum, site) => sum + site.pageViews, 0).toLocaleString()}
            </div>
            <p className="text-xs text-slate-500">Across all websites</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unique Visitors</CardTitle>
            <Users className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {websites.reduce((sum, site) => sum + site.uniqueVisitors, 0).toLocaleString()}
            </div>
            <p className="text-xs text-slate-500">Total unique users</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Conversion Rate</CardTitle>
            <Target className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(websites.reduce((sum, site) => sum + site.conversionRate, 0) / websites.length).toFixed(1)}%
            </div>
            <p className="text-xs text-slate-500">Average across all sites</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="websites" className="space-y-6">
        <TabsList>
          <TabsTrigger value="websites">Websites</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="realtime">Real-time</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="websites" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Websites</CardTitle>
              <CardDescription>Manage and monitor all your tracked websites</CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={websiteColumns}
                data={websites}
                searchable={true}
                filterable={true}
                exportable={true}
                pagination={true}
                pageSize={10}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <LineChartComponent
              data={performanceData}
              title="Performance Over Time"
              description="Page views, visitors, and conversions"
              dataKey="date"
              xAxisKey="date"
              lines={[
                { dataKey: "pageViews", stroke: "#3b82f6", name: "Page Views" },
                { dataKey: "uniqueVisitors", stroke: "#10b981", name: "Unique Visitors" },
                { dataKey: "conversions", stroke: "#f59e0b", name: "Conversions" },
              ]}
            />
            <DoughnutChartComponent
              data={deviceData}
              title="Device Distribution"
              description="Traffic by device type"
            />
          </div>

          <BarChartComponent
            data={topPagesData}
            title="Top Pages"
            description="Most visited pages across all websites"
            dataKey="page"
            xAxisKey="page"
            bars={[
              { dataKey: "views", fill: "#3b82f6", name: "Page Views" },
            ]}
          />
        </TabsContent>

        <TabsContent value="realtime" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Active Users
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">127</div>
                <p className="text-sm text-slate-500">Currently online</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MousePointer className="h-5 w-5 mr-2" />
                  Live Events
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">23</div>
                <p className="text-sm text-slate-500">Events in last minute</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="h-5 w-5 mr-2" />
                  Conversions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">5</div>
                <p className="text-sm text-slate-500">Today so far</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Live Activity Feed</CardTitle>
              <CardDescription>Real-time events from all your websites</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { time: "14:32:15", event: "Page View", page: "/products", user: "User from US" },
                  { time: "14:31:58", event: "Click", page: "/checkout", user: "User from UK" },
                  { time: "14:31:42", event: "Conversion", page: "/thank-you", user: "User from CA" },
                  { time: "14:31:25", event: "Page View", page: "/", user: "User from AU" },
                  { time: "14:31:08", event: "Form Submit", page: "/contact", user: "User from DE" },
                ].map((activity, index) => (
                  <div key={index} className="flex items-center space-x-4 p-3 bg-slate-50 rounded-lg">
                    <div className="text-sm font-mono text-slate-500">{activity.time}</div>
                    <Badge variant="outline">{activity.event}</Badge>
                    <div className="flex-1">
                      <div className="font-medium">{activity.page}</div>
                      <div className="text-sm text-slate-500">{activity.user}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Tracking Code</CardTitle>
              <CardDescription>Copy and paste this code into your website to start tracking</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-slate-100 p-4 rounded-lg">
                <code className="text-sm">
                  {`<script src="https://cdn.trackdesk.com/trackdesk.js" data-website-id="${selectedWebsite.id}" data-auto-init="true"></script>`}
                </code>
              </div>
              <Button onClick={() => copyTrackingCode(selectedWebsite.id)}>
                <Copy className="h-4 w-4 mr-2" />
                Copy Code
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tracking Settings</CardTitle>
              <CardDescription>Configure what data to collect from your websites</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Track Page Views</div>
                    <div className="text-sm text-slate-500">Monitor page visits and navigation</div>
                  </div>
                  <input type="checkbox" defaultChecked className="h-4 w-4" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Track Clicks</div>
                    <div className="text-sm text-slate-500">Monitor user interactions and clicks</div>
                  </div>
                  <input type="checkbox" defaultChecked className="h-4 w-4" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Track Scrolls</div>
                    <div className="text-sm text-slate-500">Monitor scroll behavior and engagement</div>
                  </div>
                  <input type="checkbox" defaultChecked className="h-4 w-4" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Track Forms</div>
                    <div className="text-sm text-slate-500">Monitor form submissions and interactions</div>
                  </div>
                  <input type="checkbox" defaultChecked className="h-4 w-4" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Anonymize IP Addresses</div>
                    <div className="text-sm text-slate-500">Protect user privacy by anonymizing IPs</div>
                  </div>
                  <input type="checkbox" className="h-4 w-4" />
                </div>
              </div>
              <Button>Save Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
