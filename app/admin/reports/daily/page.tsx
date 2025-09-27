"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { LineChartComponent } from "@/components/charts/line-chart"
import { 
  BarChart3, 
  Calendar, 
  TrendingUp, 
  DollarSign, 
  MousePointer, 
  Target,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  Edit,
  Filter
} from "lucide-react"

// Mock data for daily report
const dailyReportData = [
  { date: "2024-01-01", clicks: 0, conversions: 0, revenue: 0, payout: 0, profit: 0, conversionRate: 0, apv: 0, acv: 0, rpc: 0, epc: 0 },
  { date: "2024-01-02", clicks: 0, conversions: 0, revenue: 0, payout: 0, profit: 0, conversionRate: 0, apv: 0, acv: 0, rpc: 0, epc: 0 },
  { date: "2024-01-03", clicks: 0, conversions: 0, revenue: 0, payout: 0, profit: 0, conversionRate: 0, apv: 0, acv: 0, rpc: 0, epc: 0 },
  { date: "2024-01-04", clicks: 0, conversions: 0, revenue: 0, payout: 0, profit: 0, conversionRate: 0, apv: 0, acv: 0, rpc: 0, epc: 0 },
  { date: "2024-01-05", clicks: 0, conversions: 0, revenue: 0, payout: 0, profit: 0, conversionRate: 0, apv: 0, acv: 0, rpc: 0, epc: 0 },
  { date: "2024-01-06", clicks: 0, conversions: 0, revenue: 0, payout: 0, profit: 0, conversionRate: 0, apv: 0, acv: 0, rpc: 0, epc: 0 },
  { date: "2024-01-07", clicks: 0, conversions: 0, revenue: 0, payout: 0, profit: 0, conversionRate: 0, apv: 0, acv: 0, rpc: 0, epc: 0 },
]

const conversionStatuses = [
  "All Statuses",
  "Approved",
  "Pending", 
  "Declined"
]

export default function DailyReportPage() {
  const [comparePrevious, setComparePrevious] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState("All Statuses")
  const [dateRange, setDateRange] = useState("08/26/2025 - 09/25/2025")

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center">
            Daily report
            <HelpCircle className="h-5 w-5 ml-2 text-slate-400" />
          </h1>
          <p className="text-slate-600">Reports &gt; Daily report</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-slate-400" />
            <span className="text-sm text-slate-600">{dateRange}</span>
            <Button variant="ghost" size="sm">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {conversionStatuses.map(status => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Edit className="h-4 w-4 mr-2" />
            Edit columns
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clicks</CardTitle>
            <MousePointer className="h-4 w-4 text-pink-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <div className="w-full bg-slate-200 rounded-full h-2 mt-2">
              <div className="bg-pink-600 h-2 rounded-full" style={{ width: "0%" }}></div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversions</CardTitle>
            <Target className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <div className="w-full bg-slate-200 rounded-full h-2 mt-2">
              <div className="bg-orange-600 h-2 rounded-full" style={{ width: "0%" }}></div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$0</div>
            <div className="w-full bg-slate-200 rounded-full h-2 mt-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: "0%" }}></div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Payout</CardTitle>
            <TrendingUp className="h-4 w-4 text-cyan-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$0</div>
            <div className="w-full bg-slate-200 rounded-full h-2 mt-2">
              <div className="bg-cyan-600 h-2 rounded-full" style={{ width: "0%" }}></div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profit</CardTitle>
            <BarChart3 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$0</div>
            <div className="w-full bg-slate-200 rounded-full h-2 mt-2">
              <div className="bg-green-600 h-2 rounded-full" style={{ width: "0%" }}></div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Compare Toggle */}
      <div className="flex items-center space-x-2">
        <Switch
          id="compare"
          checked={comparePrevious}
          onCheckedChange={setComparePrevious}
        />
        <Label htmlFor="compare" className="text-sm">Compare (Previous period)</Label>
      </div>

      {/* Line Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Over Time</CardTitle>
          <CardDescription>Daily metrics visualization</CardDescription>
        </CardHeader>
        <CardContent>
          <LineChartComponent
            data={dailyReportData}
            title=""
            description=""
            dataKey="date"
            xAxisKey="date"
            lines={[
              { dataKey: "revenue", stroke: "#3b82f6", name: "Revenue" },
              { dataKey: "payout", stroke: "#06b6d4", name: "Payout" },
              { dataKey: "profit", stroke: "#10b981", name: "Profit" },
            ]}
          />
        </CardContent>
      </Card>

      {/* Data Table */}
      <Card>
        <CardHeader>
          <CardTitle>Daily Breakdown</CardTitle>
          <CardDescription>Detailed day-by-day metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2 font-medium">Date</th>
                  <th className="text-right p-2 font-medium">Clicks</th>
                  <th className="text-right p-2 font-medium">Conversions</th>
                  <th className="text-right p-2 font-medium">Revenue</th>
                  <th className="text-right p-2 font-medium">Payout</th>
                  <th className="text-right p-2 font-medium">MLM commission</th>
                  <th className="text-right p-2 font-medium">Profit</th>
                  <th className="text-right p-2 font-medium">Conversion rate</th>
                  <th className="text-right p-2 font-medium">APV</th>
                  <th className="text-right p-2 font-medium">ACV</th>
                  <th className="text-right p-2 font-medium">RPC</th>
                  <th className="text-right p-2 font-medium">EPC</th>
                </tr>
              </thead>
              <tbody>
                {dailyReportData.map((row, index) => (
                  <tr key={index} className="border-b hover:bg-slate-50">
                    <td className="p-2">{row.date}</td>
                    <td className="p-2 text-right">{row.clicks}</td>
                    <td className="p-2 text-right">{row.conversions}</td>
                    <td className="p-2 text-right">${row.revenue.toFixed(2)}</td>
                    <td className="p-2 text-right">${row.payout.toFixed(2)}</td>
                    <td className="p-2 text-right">$0.00</td>
                    <td className="p-2 text-right">${row.profit.toFixed(2)}</td>
                    <td className="p-2 text-right">{row.conversionRate.toFixed(2)}%</td>
                    <td className="p-2 text-right">${row.apv.toFixed(2)}</td>
                    <td className="p-2 text-right">${row.acv.toFixed(2)}</td>
                    <td className="p-2 text-right">${row.rpc.toFixed(2)}</td>
                    <td className="p-2 text-right">${row.epc.toFixed(2)}</td>
                  </tr>
                ))}
                <tr className="border-b-2 font-semibold bg-slate-50">
                  <td className="p-2">Total</td>
                  <td className="p-2 text-right">0</td>
                  <td className="p-2 text-right">0</td>
                  <td className="p-2 text-right">$0.00</td>
                  <td className="p-2 text-right">$0.00</td>
                  <td className="p-2 text-right">$0.00</td>
                  <td className="p-2 text-right">$0.00</td>
                  <td className="p-2 text-right">0.00%</td>
                  <td className="p-2 text-right">$0.00</td>
                  <td className="p-2 text-right">$0.00</td>
                  <td className="p-2 text-right">$0.00</td>
                  <td className="p-2 text-right">$0.00</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
