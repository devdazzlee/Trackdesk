"use client"

import { useState } from "react"
import { DataTable } from "@/components/dashboard/data-table"
import { LineChartComponent } from "@/components/charts/line-chart"
import { BarChartComponent } from "@/components/charts/bar-chart"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Download, Filter, TrendingUp, MousePointer, Target } from "lucide-react"

// Mock data for conversions log
const conversionsData = [
  {
    id: "CONV-001",
    date: "2024-01-07 14:30:25",
    clickId: "CLK-789",
    status: "approved",
    referralType: "Sale",
    commissionAmount: 30.00,
    customerValue: 100.00,
    offer: "Premium Plan",
    customerEmail: "john@example.com"
  },
  {
    id: "CONV-002",
    date: "2024-01-07 12:15:10",
    clickId: "CLK-790",
    status: "pending",
    referralType: "Sale",
    commissionAmount: 15.00,
    customerValue: 50.00,
    offer: "Basic Plan",
    customerEmail: "sarah@example.com"
  },
  {
    id: "CONV-003",
    date: "2024-01-06 16:45:33",
    clickId: "CLK-791",
    status: "approved",
    referralType: "Sale",
    commissionAmount: 300.00,
    customerValue: 1000.00,
    offer: "Enterprise",
    customerEmail: "mike@example.com"
  },
  {
    id: "CONV-004",
    date: "2024-01-06 09:20:15",
    clickId: "CLK-792",
    status: "declined",
    referralType: "Lead",
    commissionAmount: 5.00,
    customerValue: 0.00,
    offer: "Starter",
    customerEmail: "lisa@example.com"
  },
  {
    id: "CONV-005",
    date: "2024-01-05 18:10:42",
    clickId: "CLK-793",
    status: "approved",
    referralType: "Sale",
    commissionAmount: 30.00,
    customerValue: 100.00,
    offer: "Premium Plan",
    customerEmail: "david@example.com"
  },
  {
    id: "CONV-006",
    date: "2024-01-05 11:35:28",
    clickId: "CLK-794",
    status: "approved",
    referralType: "Sale",
    commissionAmount: 15.00,
    customerValue: 50.00,
    offer: "Basic Plan",
    customerEmail: "emma@example.com"
  },
  {
    id: "CONV-007",
    date: "2024-01-04 15:22:17",
    clickId: "CLK-795",
    status: "pending",
    referralType: "Lead",
    commissionAmount: 5.00,
    customerValue: 0.00,
    offer: "Starter",
    customerEmail: "alex@example.com"
  },
  {
    id: "CONV-008",
    date: "2024-01-04 08:45:55",
    clickId: "CLK-796",
    status: "approved",
    referralType: "Sale",
    commissionAmount: 30.00,
    customerValue: 100.00,
    offer: "Premium Plan",
    customerEmail: "sophia@example.com"
  },
]

// Mock data for clicks log
const clicksData = [
  {
    id: "CLK-789",
    date: "2024-01-07 14:30:25",
    source: "Social Media",
    country: "United States",
    device: "Desktop",
    browser: "Chrome",
    converted: true,
    conversionId: "CONV-001"
  },
  {
    id: "CLK-790",
    date: "2024-01-07 12:15:10",
    source: "Email",
    country: "Canada",
    device: "Mobile",
    browser: "Safari",
    converted: true,
    conversionId: "CONV-002"
  },
  {
    id: "CLK-791",
    date: "2024-01-06 16:45:33",
    source: "Direct",
    country: "United Kingdom",
    device: "Desktop",
    browser: "Firefox",
    converted: true,
    conversionId: "CONV-003"
  },
  {
    id: "CLK-792",
    date: "2024-01-06 09:20:15",
    source: "Search Engine",
    country: "Australia",
    device: "Tablet",
    browser: "Chrome",
    converted: false,
    conversionId: null
  },
  {
    id: "CLK-793",
    date: "2024-01-05 18:10:42",
    source: "Social Media",
    country: "Germany",
    device: "Mobile",
    browser: "Safari",
    converted: true,
    conversionId: "CONV-005"
  },
]

// Mock data for traffic analysis
const trafficAnalysisData = [
  { date: "2024-01-01", clicks: 120, conversions: 8, conversionRate: 6.67 },
  { date: "2024-01-02", clicks: 150, conversions: 12, conversionRate: 8.00 },
  { date: "2024-01-03", clicks: 180, conversions: 15, conversionRate: 8.33 },
  { date: "2024-01-04", clicks: 200, conversions: 18, conversionRate: 9.00 },
  { date: "2024-01-05", clicks: 160, conversions: 14, conversionRate: 8.75 },
  { date: "2024-01-06", clicks: 220, conversions: 20, conversionRate: 9.09 },
  { date: "2024-01-07", clicks: 190, conversions: 16, conversionRate: 8.42 },
]

const topSourcesData = [
  { source: "Social Media", clicks: 450, conversions: 35, rate: 7.78 },
  { source: "Email Marketing", clicks: 320, conversions: 28, rate: 8.75 },
  { source: "Direct Traffic", clicks: 280, conversions: 22, rate: 7.86 },
  { source: "Search Engines", clicks: 180, conversions: 12, rate: 6.67 },
  { source: "Referrals", clicks: 120, conversions: 8, rate: 6.67 },
]

const conversionsColumns = [
  { key: "id", label: "Conversion ID", sortable: true },
  { key: "date", label: "Date & Time", sortable: true },
  { key: "clickId", label: "Click ID", sortable: true },
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
  { key: "referralType", label: "Type", sortable: true },
  { 
    key: "commissionAmount", 
    label: "Commission", 
    sortable: true,
    render: (value: number) => `$${value.toFixed(2)}`
  },
  { 
    key: "customerValue", 
    label: "Customer Value", 
    sortable: true,
    render: (value: number) => value > 0 ? `$${value.toFixed(2)}` : "-"
  },
  { key: "offer", label: "Offer", sortable: true },
]

const clicksColumns = [
  { key: "id", label: "Click ID", sortable: true },
  { key: "date", label: "Date & Time", sortable: true },
  { key: "source", label: "Source", sortable: true },
  { key: "country", label: "Country", sortable: true },
  { key: "device", label: "Device", sortable: true },
  { key: "browser", label: "Browser", sortable: true },
  { 
    key: "converted", 
    label: "Converted", 
    sortable: true,
    render: (value: boolean) => (
      <Badge variant={value ? "default" : "secondary"}>
        {value ? "Yes" : "No"}
      </Badge>
    )
  },
  { key: "conversionId", label: "Conversion ID", sortable: true },
]

export default function StatisticsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("7d")

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Statistics & Analytics</h1>
          <p className="text-slate-600">Track your performance and analyze traffic patterns</p>
        </div>
        <div className="flex items-center space-x-3">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-40">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1d">Today</SelectItem>
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
              <SelectItem value="90d">Last 90 Days</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
            <MousePointer className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,420</div>
            <p className="text-xs text-green-600 flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" />
              +12.5% from last period
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Conversions</CardTitle>
            <Target className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">103</div>
            <p className="text-xs text-green-600 flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" />
              +8.2% from last period
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7.25%</div>
            <p className="text-xs text-green-600 flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" />
              +0.8% from last period
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LineChartComponent
          data={trafficAnalysisData}
          title="Traffic Analysis"
          description="Clicks, conversions, and conversion rate over time"
          dataKey="date"
          xAxisKey="date"
          lines={[
            { dataKey: "clicks", stroke: "#3b82f6", name: "Clicks" },
            { dataKey: "conversions", stroke: "#10b981", name: "Conversions" },
            { dataKey: "conversionRate", stroke: "#f59e0b", name: "Conversion Rate (%)" },
          ]}
        />
        <BarChartComponent
          data={topSourcesData}
          title="Top Traffic Sources"
          description="Performance by traffic source"
          dataKey="source"
          xAxisKey="source"
          bars={[
            { dataKey: "clicks", fill: "#3b82f6", name: "Clicks" },
            { dataKey: "conversions", fill: "#10b981", name: "Conversions" },
          ]}
        />
      </div>

      {/* Data Tables */}
      <Tabs defaultValue="conversions" className="space-y-6">
        <TabsList>
          <TabsTrigger value="conversions">Conversions Log</TabsTrigger>
          <TabsTrigger value="clicks">Clicks Log</TabsTrigger>
        </TabsList>
        
        <TabsContent value="conversions">
          <DataTable
            title="Conversions Log"
            description="Detailed log of all your conversions"
            columns={conversionsColumns}
            data={conversionsData}
            searchable={true}
            filterable={true}
            exportable={true}
            pagination={true}
            pageSize={10}
          />
        </TabsContent>
        
        <TabsContent value="clicks">
          <DataTable
            title="Clicks Log"
            description="Detailed log of all clicks on your affiliate links"
            columns={clicksColumns}
            data={clicksData}
            searchable={true}
            filterable={true}
            exportable={true}
            pagination={true}
            pageSize={10}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
