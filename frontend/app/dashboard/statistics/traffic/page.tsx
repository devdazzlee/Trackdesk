"use client"

import { LineChartComponent } from "@/components/charts/line-chart"
import { BarChartComponent } from "@/components/charts/bar-chart"
import { DoughnutChartComponent } from "@/components/charts/doughnut-chart"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Download, Globe, TrendingUp, Users, MousePointer } from "lucide-react"

// Mock data for traffic analysis
const trafficOverTimeData = [
  { date: "2024-01-01", visitors: 120, pageViews: 450, bounceRate: 35.2, avgSessionTime: "2m 15s" },
  { date: "2024-01-02", visitors: 150, pageViews: 520, bounceRate: 32.8, avgSessionTime: "2m 45s" },
  { date: "2024-01-03", visitors: 180, pageViews: 680, bounceRate: 28.5, avgSessionTime: "3m 12s" },
  { date: "2024-01-04", visitors: 200, pageViews: 750, bounceRate: 26.3, avgSessionTime: "3m 35s" },
  { date: "2024-01-05", visitors: 160, pageViews: 620, bounceRate: 31.2, avgSessionTime: "2m 58s" },
  { date: "2024-01-06", visitors: 220, pageViews: 890, bounceRate: 24.7, avgSessionTime: "4m 12s" },
  { date: "2024-01-07", visitors: 190, pageViews: 720, bounceRate: 29.1, avgSessionTime: "3m 28s" },
]

const topCountriesData = [
  { country: "United States", visitors: 450, percentage: 35.2, conversionRate: 8.5 },
  { country: "Canada", visitors: 280, percentage: 21.9, conversionRate: 7.8 },
  { country: "United Kingdom", visitors: 180, percentage: 14.1, conversionRate: 9.2 },
  { country: "Australia", visitors: 120, percentage: 9.4, conversionRate: 6.7 },
  { country: "Germany", visitors: 90, percentage: 7.0, conversionRate: 8.9 },
  { country: "France", visitors: 60, percentage: 4.7, conversionRate: 7.5 },
  { country: "Japan", visitors: 50, percentage: 3.9, conversionRate: 6.2 },
  { country: "Brazil", visitors: 40, percentage: 3.1, conversionRate: 5.8 },
]

const trafficSourcesData = [
  { name: "Social Media", value: 45, color: "#3b82f6" },
  { name: "Email Marketing", value: 25, color: "#10b981" },
  { name: "Direct Traffic", value: 15, color: "#f59e0b" },
  { name: "Search Engines", value: 10, color: "#ef4444" },
  { name: "Referrals", value: 5, color: "#8b5cf6" },
]

const deviceBreakdownData = [
  { name: "Desktop", value: 63, color: "#3b82f6" },
  { name: "Mobile", value: 32, color: "#10b981" },
  { name: "Tablet", value: 5, color: "#f59e0b" },
]

const browserData = [
  { browser: "Chrome", visitors: 520, percentage: 40.6, marketShare: "65.2%" },
  { browser: "Safari", visitors: 280, percentage: 21.9, marketShare: "19.1%" },
  { browser: "Firefox", visitors: 180, percentage: 14.1, marketShare: "7.2%" },
  { browser: "Edge", visitors: 120, percentage: 9.4, marketShare: "4.3%" },
  { browser: "Other", visitors: 80, percentage: 6.3, marketShare: "4.2%" },
]

export default function TrafficAnalysisPage() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Traffic Analysis</h1>
          <p className="text-slate-600">Comprehensive analysis of your website traffic and visitor behavior</p>
        </div>
        <div className="flex items-center space-x-3">
          <Select defaultValue="30d">
            <SelectTrigger className="w-40">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
              <SelectItem value="90d">Last 90 Days</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Visitors</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,280</div>
            <p className="text-xs text-green-600">
              +12.5% from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Page Views</CardTitle>
            <MousePointer className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4,630</div>
            <p className="text-xs text-green-600">
              +8.2% from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bounce Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">29.1%</div>
            <p className="text-xs text-red-600">
              -2.3% from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Session</CardTitle>
            <Globe className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3m 28s</div>
            <p className="text-xs text-green-600">
              +15.3% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LineChartComponent
          data={trafficOverTimeData}
          title="Traffic Over Time"
          description="Visitor trends and engagement metrics"
          dataKey="date"
          xAxisKey="date"
          lines={[
            { dataKey: "visitors", stroke: "#3b82f6", name: "Visitors" },
            { dataKey: "pageViews", stroke: "#10b981", name: "Page Views" },
          ]}
        />
        <DoughnutChartComponent
          data={trafficSourcesData}
          title="Traffic Sources"
          description="Where your visitors come from"
        />
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BarChartComponent
          data={topCountriesData}
          title="Top Countries"
          description="Geographic distribution of your traffic"
          dataKey="country"
          xAxisKey="country"
          bars={[
            { dataKey: "visitors", fill: "#3b82f6", name: "Visitors" },
          ]}
        />
        <DoughnutChartComponent
          data={deviceBreakdownData}
          title="Device Breakdown"
          description="Traffic by device type"
        />
      </div>

      {/* Detailed Analysis Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Top Countries</CardTitle>
            <CardDescription>Geographic performance analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topCountriesData.slice(0, 5).map((country, index) => (
                <div key={country.country} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center text-xs font-medium">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{country.country}</p>
                      <p className="text-xs text-slate-500">{country.percentage}% of traffic</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-sm">{country.visitors} visitors</p>
                    <Badge variant="outline" className="text-xs">
                      {country.conversionRate}% conversion
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Browser Analysis</CardTitle>
            <CardDescription>Browser usage and performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {browserData.map((browser) => (
                <div key={browser.browser} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">{browser.browser}</p>
                    <p className="text-xs text-slate-500">{browser.marketShare} market share</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-sm">{browser.visitors} visitors</p>
                    <p className="text-xs text-slate-500">{browser.percentage}%</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Traffic Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Traffic Insights</CardTitle>
          <CardDescription>Key findings and recommendations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <h4 className="font-medium text-green-600">Positive Trends</h4>
              <ul className="text-sm text-slate-600 space-y-1">
                <li>• Mobile traffic increased 15%</li>
                <li>• Social media referrals up 22%</li>
                <li>• Average session time improved</li>
                <li>• Bounce rate decreased</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-yellow-600">Areas to Improve</h4>
              <ul className="text-sm text-slate-600 space-y-1">
                <li>• Search engine traffic declining</li>
                <li>• Tablet conversion rate low</li>
                <li>• Some countries underperforming</li>
                <li>• Email marketing needs boost</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-blue-600">Recommendations</h4>
              <ul className="text-sm text-slate-600 space-y-1">
                <li>• Optimize for mobile devices</li>
                <li>• Focus on social media campaigns</li>
                <li>• Improve page load speed</li>
                <li>• Target high-converting countries</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}