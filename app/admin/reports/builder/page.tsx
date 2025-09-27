"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { exportToCSV } from "@/lib/export-utils"
import { 
  BarChart3, 
  Plus, 
  Save, 
  Download,
  Eye,
  Settings,
  HelpCircle,
  Calendar,
  Filter,
  Users,
  DollarSign,
  MousePointer,
  Target
} from "lucide-react"

// Mock data for report builder
const availableMetrics = [
  { id: "clicks", name: "Clicks", icon: MousePointer, category: "Traffic" },
  { id: "conversions", name: "Conversions", icon: Target, category: "Performance" },
  { id: "revenue", name: "Revenue", icon: DollarSign, category: "Financial" },
  { id: "payout", name: "Payout", icon: DollarSign, category: "Financial" },
  { id: "profit", name: "Profit", icon: DollarSign, category: "Financial" },
  { id: "affiliates", name: "Active Affiliates", icon: Users, category: "Users" },
  { id: "conversion_rate", name: "Conversion Rate", icon: BarChart3, category: "Performance" },
  { id: "apv", name: "Average Purchase Value", icon: DollarSign, category: "Financial" },
]

const chartTypes = [
  { value: "line", label: "Line Chart", description: "Time series data" },
  { value: "bar", label: "Bar Chart", description: "Comparative data" },
  { value: "doughnut", label: "Doughnut Chart", description: "Percentage breakdown" },
  { value: "area", label: "Area Chart", description: "Filled time series" },
]

const timeRanges = [
  { value: "7d", label: "Last 7 days" },
  { value: "30d", label: "Last 30 days" },
  { value: "90d", label: "Last 90 days" },
  { value: "1y", label: "Last year" },
  { value: "custom", label: "Custom range" },
]

export default function ReportBuilderPage() {
  const [reportName, setReportName] = useState("")
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([])
  const [chartType, setChartType] = useState("line")
  const [timeRange, setTimeRange] = useState("30d")
  const [previewOpen, setPreviewOpen] = useState(false)
  const [filters, setFilters] = useState({
    affiliates: [] as string[],
    offers: [] as string[],
    countries: [] as string[],
  })

  const handleMetricToggle = (metricId: string) => {
    setSelectedMetrics(prev =>
      prev.includes(metricId)
        ? prev.filter(id => id !== metricId)
        : prev.concat(metricId)
    )
  }

  const handleSaveReport = () => {
    // Save report logic
    console.log("Saving report:", {
      name: reportName,
      metrics: selectedMetrics,
      chartType,
      timeRange,
      filters
    })
    alert("Report saved successfully!")
  }

  const handlePreview = () => {
    setPreviewOpen(true)
  }

  const handleExport = () => {
    // Generate sample data for export
    const sampleData = [
      { date: "2024-01-01", clicks: 150, conversions: 12, revenue: 1200 },
      { date: "2024-01-02", clicks: 180, conversions: 15, revenue: 1500 },
      { date: "2024-01-03", clicks: 200, conversions: 18, revenue: 1800 },
      { date: "2024-01-04", clicks: 160, conversions: 14, revenue: 1400 },
      { date: "2024-01-05", clicks: 220, conversions: 20, revenue: 2000 }
    ]
    exportToCSV(sampleData, `report-${reportName || 'custom'}`)
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center">
            Report builder
            <HelpCircle className="h-5 w-5 ml-2 text-slate-400" />
          </h1>
          <p className="text-slate-600">Reports &gt; Report builder</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm" onClick={handlePreview}>
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={handleSaveReport}>
            <Save className="h-4 w-4 mr-2" />
            Save Report
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Report Configuration */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Report Configuration</CardTitle>
              <CardDescription>Configure your custom report</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="reportName">Report Name</Label>
                <Input
                  id="reportName"
                  value={reportName}
                  onChange={(e) => setReportName(e.target.value)}
                  placeholder="Enter report name"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="chartType">Chart Type</Label>
                  <Select value={chartType} onValueChange={setChartType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {chartTypes.map(type => (
                        <SelectItem key={type.value} value={type.value}>
                          <div>
                            <div className="font-medium">{type.label}</div>
                            <div className="text-xs text-slate-500">{type.description}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timeRange">Time Range</Label>
                  <Select value={timeRange} onValueChange={setTimeRange}>
                    <SelectTrigger>
                      <Calendar className="h-4 w-4 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {timeRanges.map(range => (
                        <SelectItem key={range.value} value={range.value}>
                          {range.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Metrics Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Select Metrics</CardTitle>
              <CardDescription>Choose the metrics to include in your report</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {availableMetrics.map(metric => (
                  <div
                    key={metric.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedMetrics.includes(metric.id)
                        ? "border-blue-500 bg-blue-50"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                    onClick={() => handleMetricToggle(metric.id)}
                  >
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        checked={selectedMetrics.includes(metric.id)}
                        onChange={() => handleMetricToggle(metric.id)}
                      />
                      <metric.icon className="h-5 w-5 text-slate-600" />
                      <div>
                        <p className="font-medium text-sm">{metric.name}</p>
                        <p className="text-xs text-slate-500">{metric.category}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Filters</CardTitle>
              <CardDescription>Apply filters to your report data</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Affiliates</Label>
                <Select>
                  <SelectTrigger>
                    <Users className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Select affiliates" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Affiliates</SelectItem>
                    <SelectItem value="top">Top Performers</SelectItem>
                    <SelectItem value="active">Active Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Offers</Label>
                <Select>
                  <SelectTrigger>
                    <Target className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Select offers" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Offers</SelectItem>
                    <SelectItem value="premium">Premium Plan</SelectItem>
                    <SelectItem value="basic">Basic Plan</SelectItem>
                    <SelectItem value="enterprise">Enterprise</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Countries</Label>
                <Select>
                  <SelectTrigger>
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Select countries" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Countries</SelectItem>
                    <SelectItem value="us">United States</SelectItem>
                    <SelectItem value="ca">Canada</SelectItem>
                    <SelectItem value="uk">United Kingdom</SelectItem>
                    <SelectItem value="au">Australia</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Preview & Actions */}
        <div className="space-y-6">
          {/* Report Preview */}
          <Card>
            <CardHeader>
              <CardTitle>Report Preview</CardTitle>
              <CardDescription>Preview your custom report</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border-2 border-dashed border-slate-300 rounded-lg text-center">
                  <BarChart3 className="h-12 w-12 text-slate-400 mx-auto mb-3" />
                  <p className="text-sm text-slate-500">
                    {selectedMetrics.length > 0 
                      ? `Report with ${selectedMetrics.length} metrics`
                      : "Select metrics to preview"
                    }
                  </p>
                </div>

                {selectedMetrics.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Selected Metrics:</h4>
                    <div className="space-y-1">
                      {selectedMetrics.map(metricId => {
                        const metric = availableMetrics.find(m => m.id === metricId)
                        const IconComponent = metric?.icon
                        return (
                          <div key={metricId} className="flex items-center space-x-2 text-sm">
                            {IconComponent && <IconComponent className="h-4 w-4 text-slate-500" />}
                            <span>{metric?.name}</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common report operations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <Plus className="h-4 w-4 mr-2" />
                Create New Report
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Settings className="h-4 w-4 mr-2" />
                Report Settings
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Download className="h-4 w-4 mr-2" />
                Export Template
              </Button>
            </CardContent>
          </Card>

          {/* Report Templates */}
          <Card>
            <CardHeader>
              <CardTitle>Report Templates</CardTitle>
              <CardDescription>Pre-built report templates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 border rounded-lg hover:bg-slate-50 cursor-pointer">
                <h4 className="font-medium text-sm">Performance Overview</h4>
                <p className="text-xs text-slate-500">Clicks, conversions, revenue</p>
              </div>
              <div className="p-3 border rounded-lg hover:bg-slate-50 cursor-pointer">
                <h4 className="font-medium text-sm">Affiliate Analysis</h4>
                <p className="text-xs text-slate-500">Top performers, trends</p>
              </div>
              <div className="p-3 border rounded-lg hover:bg-slate-50 cursor-pointer">
                <h4 className="font-medium text-sm">Financial Summary</h4>
                <p className="text-xs text-slate-500">Revenue, payouts, profit</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Preview Modal */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Report Preview</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-4 bg-slate-50 rounded-lg">
              <h3 className="font-medium mb-2">Report Configuration</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Name:</span> {reportName || "Untitled Report"}
                </div>
                <div>
                  <span className="font-medium">Chart Type:</span> {chartType}
                </div>
                <div>
                  <span className="font-medium">Time Range:</span> {timeRange}
                </div>
                <div>
                  <span className="font-medium">Metrics:</span> {selectedMetrics.length} selected
                </div>
              </div>
            </div>
            
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-2">Sample Data Preview</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Date</th>
                      <th className="text-left p-2">Clicks</th>
                      <th className="text-left p-2">Conversions</th>
                      <th className="text-left p-2">Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="p-2">2024-01-01</td>
                      <td className="p-2">150</td>
                      <td className="p-2">12</td>
                      <td className="p-2">$1,200</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-2">2024-01-02</td>
                      <td className="p-2">180</td>
                      <td className="p-2">15</td>
                      <td className="p-2">$1,500</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-2">2024-01-03</td>
                      <td className="p-2">200</td>
                      <td className="p-2">18</td>
                      <td className="p-2">$1,800</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
