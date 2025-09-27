"use client"

import { useState } from "react"
import { KPITile } from "@/components/dashboard/kpi-tile"
import { LineChartComponent } from "@/components/charts/line-chart"
import { BarChartComponent } from "@/components/charts/bar-chart"
import { DoughnutChartComponent } from "@/components/charts/doughnut-chart"
import { DataTable } from "@/components/dashboard/data-table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  MousePointer, 
  Target, 
  DollarSign, 
  TrendingUp,
  Calendar,
  Download,
  Bell,
  ExternalLink
} from "lucide-react"

// Mock data
const performanceData = [
  { date: "2024-01-01", clicks: 120, conversions: 8, earnings: 240 },
  { date: "2024-01-02", clicks: 150, conversions: 12, earnings: 360 },
  { date: "2024-01-03", clicks: 180, conversions: 15, earnings: 450 },
  { date: "2024-01-04", clicks: 200, conversions: 18, earnings: 540 },
  { date: "2024-01-05", clicks: 160, conversions: 14, earnings: 420 },
  { date: "2024-01-06", clicks: 220, conversions: 20, earnings: 600 },
  { date: "2024-01-07", clicks: 190, conversions: 16, earnings: 480 },
]

const topOffersData = [
  { offer: "Premium Plan", clicks: 450, conversions: 35, revenue: 1050 },
  { offer: "Basic Plan", clicks: 320, conversions: 28, revenue: 840 },
  { offer: "Enterprise", clicks: 180, conversions: 12, revenue: 3600 },
  { offer: "Starter", clicks: 280, conversions: 22, revenue: 440 },
]

const trafficSourceData = [
  { name: "Social Media", value: 45, color: "#3b82f6" },
  { name: "Email Marketing", value: 25, color: "#10b981" },
  { name: "Direct Traffic", value: 20, color: "#f59e0b" },
  { name: "Search Engines", value: 10, color: "#ef4444" },
]

const recentConversions = [
  {
    id: "CONV-001",
    date: "2024-01-07",
    customer: "john@example.com",
    offer: "Premium Plan",
    amount: 30.00,
    status: "approved",
    clickId: "CLK-789"
  },
  {
    id: "CONV-002",
    date: "2024-01-07",
    customer: "sarah@example.com",
    offer: "Basic Plan",
    amount: 15.00,
    status: "pending",
    clickId: "CLK-790"
  },
  {
    id: "CONV-003",
    date: "2024-01-06",
    customer: "mike@example.com",
    offer: "Enterprise",
    amount: 300.00,
    status: "approved",
    clickId: "CLK-791"
  },
  {
    id: "CONV-004",
    date: "2024-01-06",
    customer: "lisa@example.com",
    offer: "Starter",
    amount: 10.00,
    status: "declined",
    clickId: "CLK-792"
  },
  {
    id: "CONV-005",
    date: "2024-01-05",
    customer: "david@example.com",
    offer: "Premium Plan",
    amount: 30.00,
    status: "approved",
    clickId: "CLK-793"
  },
]

const conversionColumns = [
  { key: "id", label: "ID", sortable: true },
  { key: "date", label: "Date", sortable: true },
  { key: "customer", label: "Customer", sortable: true },
  { key: "offer", label: "Offer", sortable: true },
  { 
    key: "amount", 
    label: "Amount", 
    sortable: true,
    render: (value: number) => `$${value.toFixed(2)}`
  },
  { 
    key: "status", 
    label: "Status", 
    sortable: true,
    render: (value: string) => (
      <Badge 
        variant={
          value === "approved" ? "default" : 
          value === "pending" ? "secondary" : 
          "destructive"
        }
      >
        {value.charAt(0).toUpperCase() + value.slice(1)}
      </Badge>
    )
  },
]

export default function DashboardPage() {
  const [dateRange, setDateRange] = useState("7d")

  const handleDownloadMaterials = () => {
    // Navigate to marketing materials page
    window.location.href = "/dashboard/links/banners"
  }

  const handleViewProgramUpdates = () => {
    // Navigate to program updates page
    window.location.href = "/dashboard/resources/updates"
  }
  return (
    <div className="p-6 space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-teal-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Welcome back, John!</h1>
            <p className="text-blue-100">
              Here's your performance overview for the last 7 days
            </p>
          </div>
          <div className="hidden md:block">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white text-sm"
            >
              <option value="1d">Today</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
              <option value="1y">Last Year</option>
            </select>
          </div>
        </div>
      </div>

      {/* KPI Tiles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPITile
          title="Total Clicks"
          value={1420}
          change={{ value: 12.5, type: "increase", period: "last week" }}
          icon={MousePointer}
          iconColor="text-blue-600"
          description="Unique clicks this month"
        />
        <KPITile
          title="Total Conversions"
          value={103}
          change={{ value: 8.2, type: "increase", period: "last week" }}
          icon={Target}
          iconColor="text-green-600"
          description="Successful conversions"
        />
        <KPITile
          title="Total Earned"
          value={3090}
          change={{ value: 15.3, type: "increase", period: "last week" }}
          icon={DollarSign}
          iconColor="text-emerald-600"
          description="Lifetime earnings"
        />
        <KPITile
          title="Available to Withdraw"
          value={450}
          change={{ value: 0, type: "increase", period: "last week" }}
          icon={TrendingUp}
          iconColor="text-purple-600"
          description="Ready for payout"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LineChartComponent
          data={performanceData}
          title="Performance Over Time"
          description="Clicks, conversions, and earnings trend"
          dataKey="date"
          xAxisKey="date"
          lines={[
            { dataKey: "clicks", stroke: "#3b82f6", name: "Clicks" },
            { dataKey: "conversions", stroke: "#10b981", name: "Conversions" },
            { dataKey: "earnings", stroke: "#f59e0b", name: "Earnings ($)" },
          ]}
        />
        <DoughnutChartComponent
          data={trafficSourceData}
          title="Traffic Sources"
          description="Where your traffic comes from"
        />
      </div>

      {/* Additional Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BarChartComponent
          data={topOffersData}
          title="Top Performing Offers"
          description="Best converting offers this month"
          dataKey="offer"
          xAxisKey="offer"
          bars={[
            { dataKey: "conversions", fill: "#3b82f6", name: "Conversions" },
          ]}
        />
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start" onClick={() => window.location.href = "/dashboard/links/generator"}>
              <ExternalLink className="h-4 w-4 mr-2" />
              Generate New Affiliate Link
            </Button>
            <Button variant="outline" className="w-full justify-start" onClick={handleDownloadMaterials}>
              <Download className="h-4 w-4 mr-2" />
              Download Marketing Materials
            </Button>
            <Button variant="outline" className="w-full justify-start" onClick={handleViewProgramUpdates}>
              <Bell className="h-4 w-4 mr-2" />
              View Program Updates
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Conversions */}
      <DataTable
        title="Recent Conversions"
        description="Your latest conversion activity"
        columns={conversionColumns}
        data={recentConversions}
        searchable={true}
        filterable={true}
        exportable={true}
        pagination={true}
        pageSize={5}
      />

      {/* Announcements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bell className="h-5 w-5 mr-2" />
            Program Announcements
          </CardTitle>
          <CardDescription>Latest updates from the affiliate program</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg">
            <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
            <div className="flex-1">
              <h4 className="font-medium text-blue-900">New Christmas Offer Banners Available!</h4>
              <p className="text-sm text-blue-700 mt-1">
                Download our latest holiday-themed banners and social media templates to boost your conversions this season.
              </p>
              <p className="text-xs text-blue-600 mt-2">2 hours ago</p>
            </div>
          </div>
          <div className="flex items-start space-x-3 p-4 bg-green-50 rounded-lg">
            <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
            <div className="flex-1">
              <h4 className="font-medium text-green-900">Commission Rate Increased to 30%</h4>
              <p className="text-sm text-green-700 mt-1">
                Great news! We've increased the commission rate for all affiliates starting this month.
              </p>
              <p className="text-xs text-green-600 mt-2">1 day ago</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
