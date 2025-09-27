"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LineChartComponent } from "@/components/charts/line-chart"
import { BarChartComponent } from "@/components/charts/bar-chart"
import { DoughnutChartComponent } from "@/components/charts/doughnut-chart"
import { 
  BarChart3, 
  Calendar, 
  TrendingUp, 
  DollarSign, 
  MousePointer, 
  Target,
  Users,
  HelpCircle,
  Download,
  Filter
} from "lucide-react"

// Mock data for overview report
const overviewData = [
  { date: "2024-01-01", clicks: 1250, conversions: 89, revenue: 2670.00, payout: 801.00, profit: 1869.00 },
  { date: "2024-01-02", clicks: 1180, conversions: 82, revenue: 2460.00, payout: 738.00, profit: 1722.00 },
  { date: "2024-01-03", clicks: 1320, conversions: 95, revenue: 2850.00, payout: 855.00, profit: 1995.00 },
  { date: "2024-01-04", clicks: 1100, conversions: 78, revenue: 2340.00, payout: 702.00, profit: 1638.00 },
  { date: "2024-01-05", clicks: 1400, conversions: 102, revenue: 3060.00, payout: 918.00, profit: 2142.00 },
  { date: "2024-01-06", clicks: 1280, conversions: 91, revenue: 2730.00, payout: 819.00, profit: 1911.00 },
  { date: "2024-01-07", clicks: 1350, conversions: 96, revenue: 2880.00, payout: 864.00, profit: 2016.00 },
]

const topAffiliatesData = [
  { name: "John Doe", clicks: 450, conversions: 32, revenue: 960.00, commission: 288.00 },
  { name: "Sarah Wilson", clicks: 380, conversions: 28, revenue: 840.00, commission: 252.00 },
  { name: "Mike Johnson", clicks: 320, conversions: 22, revenue: 660.00, commission: 198.00 },
  { name: "Lisa Brown", clicks: 280, conversions: 20, revenue: 600.00, commission: 180.00 },
  { name: "David Lee", clicks: 250, conversions: 18, revenue: 540.00, commission: 162.00 },
]

const trafficSourcesData = [
  { name: "Social Media", value: 45, color: "#3b82f6" },
  { name: "Email Marketing", value: 25, color: "#10b981" },
  { name: "Direct Traffic", value: 15, color: "#f59e0b" },
  { name: "Search Engines", value: 10, color: "#ef4444" },
  { name: "Referrals", value: 5, color: "#8b5cf6" },
]

export default function OverviewReportPage() {
  const [dateRange, setDateRange] = useState("Last 30 days")
  const [selectedMetric, setSelectedMetric] = useState("revenue")

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center">
            Overview reports
            <HelpCircle className="h-5 w-5 ml-2 text-slate-400" />
          </h1>
          <p className="text-slate-600">Reports &gt; Overview reports</p>
        </div>
        <div className="flex items-center space-x-3">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-40">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Last 7 days">Last 7 days</SelectItem>
              <SelectItem value="Last 30 days">Last 30 days</SelectItem>
              <SelectItem value="Last 90 days">Last 90 days</SelectItem>
              <SelectItem value="Last year">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
            <MousePointer className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8,880</div>
            <p className="text-xs text-green-600">
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
            <div className="text-2xl font-bold">632</div>
            <p className="text-xs text-green-600">
              +8.2% from last period
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$18,990</div>
            <p className="text-xs text-green-600">
              +15.3% from last period
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Profit</CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$13,293</div>
            <p className="text-xs text-green-600">
              +18.7% from last period
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LineChartComponent
          data={overviewData}
          title="Performance Trends"
          description="Key metrics over time"
          dataKey="date"
          xAxisKey="date"
          lines={[
            { dataKey: "clicks", stroke: "#3b82f6", name: "Clicks" },
            { dataKey: "conversions", stroke: "#10b981", name: "Conversions" },
          ]}
        />
        <DoughnutChartComponent
          data={trafficSourcesData}
          title="Traffic Sources"
          description="Distribution of traffic sources"
        />
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BarChartComponent
          data={topAffiliatesData}
          title="Top Performing Affiliates"
          description="Best performing affiliates by revenue"
          dataKey="name"
          xAxisKey="name"
          bars={[
            { dataKey: "revenue", fill: "#3b82f6", name: "Revenue" },
            { dataKey: "commission", fill: "#10b981", name: "Commission" },
          ]}
        />
        <LineChartComponent
          data={overviewData}
          title="Revenue vs Payout"
          description="Revenue and payout trends"
          dataKey="date"
          xAxisKey="date"
          lines={[
            { dataKey: "revenue", stroke: "#3b82f6", name: "Revenue" },
            { dataKey: "payout", stroke: "#ef4444", name: "Payout" },
            { dataKey: "profit", stroke: "#10b981", name: "Profit" },
          ]}
        />
      </div>

      {/* Top Affiliates Table */}
      <Card>
        <CardHeader>
          <CardTitle>Top Performing Affiliates</CardTitle>
          <CardDescription>Best performing affiliates this period</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2 font-medium">Affiliate</th>
                  <th className="text-right p-2 font-medium">Clicks</th>
                  <th className="text-right p-2 font-medium">Conversions</th>
                  <th className="text-right p-2 font-medium">Revenue</th>
                  <th className="text-right p-2 font-medium">Commission</th>
                  <th className="text-right p-2 font-medium">Conversion Rate</th>
                </tr>
              </thead>
              <tbody>
                {topAffiliatesData.map((affiliate, index) => (
                  <tr key={index} className="border-b hover:bg-slate-50">
                    <td className="p-2 font-medium">{affiliate.name}</td>
                    <td className="p-2 text-right">{affiliate.clicks}</td>
                    <td className="p-2 text-right">{affiliate.conversions}</td>
                    <td className="p-2 text-right">${affiliate.revenue.toFixed(2)}</td>
                    <td className="p-2 text-right">${affiliate.commission.toFixed(2)}</td>
                    <td className="p-2 text-right">
                      {((affiliate.conversions / affiliate.clicks) * 100).toFixed(2)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Conversion Metrics</CardTitle>
            <CardDescription>Key conversion statistics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">Overall Conversion Rate</span>
              <span className="font-semibold">7.12%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">Average Order Value</span>
              <span className="font-semibold">$30.05</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">Revenue Per Click</span>
              <span className="font-semibold">$2.14</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">Earnings Per Click</span>
              <span className="font-semibold">$0.64</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Traffic Analysis</CardTitle>
            <CardDescription>Traffic source performance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {trafficSourcesData.map((source, index) => (
              <div key={index} className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: source.color }}
                  ></div>
                  <span className="text-sm">{source.name}</span>
                </div>
                <span className="font-semibold">{source.value}%</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance Insights</CardTitle>
            <CardDescription>Key insights and trends</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 bg-green-50 rounded-lg">
              <p className="text-sm text-green-800">
                <strong>Positive Trend:</strong> Revenue increased 15.3% this period
              </p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Top Source:</strong> Social Media drives 45% of traffic
              </p>
            </div>
            <div className="p-3 bg-yellow-50 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Opportunity:</strong> Email marketing shows high conversion rates
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
