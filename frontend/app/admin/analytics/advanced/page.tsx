"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { 
  Target, 
  TrendingUp, 
  Users, 
  Calendar,
  Download,
  Filter,
  BarChart3,
  PieChart,
  LineChart,
  Eye,
  Settings,
  Plus,
  Edit,
  Trash2,
  Copy,
  Share
} from "lucide-react"
import { toast } from "sonner"

// Mock data for funnel analysis
const funnelData = [
  { stage: "Visitors", count: 10000, percentage: 100, dropoff: 0 },
  { stage: "Landing Page", count: 8500, percentage: 85, dropoff: 15 },
  { stage: "Product View", count: 6200, percentage: 62, dropoff: 23 },
  { stage: "Add to Cart", count: 3100, percentage: 31, dropoff: 31 },
  { stage: "Checkout", count: 1800, percentage: 18, dropoff: 13 },
  { stage: "Purchase", count: 1200, percentage: 12, dropoff: 6 }
]

// Mock data for cohort analysis
const cohortData = [
  { cohort: "Jan 2024", size: 1000, retention: [100, 85, 72, 68, 65, 62, 60, 58] },
  { cohort: "Feb 2024", size: 1200, retention: [100, 88, 75, 70, 67, 64, 62, 60] },
  { cohort: "Mar 2024", size: 1100, retention: [100, 90, 78, 73, 70, 67, 65, 63] },
  { cohort: "Apr 2024", size: 1300, retention: [100, 92, 80, 75, 72, 69, 67, 65] },
  { cohort: "May 2024", size: 1400, retention: [100, 94, 82, 77, 74, 71, 69, 67] },
  { cohort: "Jun 2024", size: 1500, retention: [100, 96, 84, 79, 76, 73, 71, 69] }
]

// Mock data for attribution models
const attributionData = [
  { model: "First Click", conversions: 1200, revenue: 36000, percentage: 100 },
  { model: "Last Click", conversions: 1200, revenue: 36000, percentage: 100 },
  { model: "Linear", conversions: 1200, revenue: 36000, percentage: 100 },
  { model: "Time Decay", conversions: 1200, revenue: 36000, percentage: 100 },
  { model: "Position Based", conversions: 1200, revenue: 36000, percentage: 100 }
]

// Mock data for A/B tests
const abTests = [
  {
    id: "TEST-001",
    name: "Landing Page Headlines",
    status: "running",
    variants: [
      { name: "Control", visitors: 5000, conversions: 500, rate: 10.0 },
      { name: "Variant A", visitors: 5000, conversions: 650, rate: 13.0 }
    ],
    startDate: "2024-01-01",
    endDate: "2024-01-31",
    confidence: 95.2
  },
  {
    id: "TEST-002",
    name: "CTA Button Colors",
    status: "completed",
    variants: [
      { name: "Control", visitors: 3000, conversions: 300, rate: 10.0 },
      { name: "Variant A", visitors: 3000, conversions: 360, rate: 12.0 }
    ],
    startDate: "2023-12-01",
    endDate: "2023-12-31",
    confidence: 98.7
  }
]

export default function AdvancedAnalyticsPage() {
  const [selectedFunnel, setSelectedFunnel] = useState("conversion")
  const [selectedCohort, setSelectedCohort] = useState("monthly")
  const [selectedAttribution, setSelectedAttribution] = useState("first-click")
  const [dateRange, setDateRange] = useState("30d")

  const handleCreateFunnel = () => {
    toast.success("Funnel analysis created successfully!")
  }

  const handleCreateCohort = () => {
    toast.success("Cohort analysis created successfully!")
  }

  const handleCreateABTest = () => {
    toast.success("A/B test created successfully!")
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "running":
        return <Badge variant="default" className="bg-green-100 text-green-800">Running</Badge>
      case "completed":
        return <Badge variant="secondary">Completed</Badge>
      case "paused":
        return <Badge variant="outline">Paused</Badge>
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
            <BarChart3 className="h-6 w-6 mr-2 text-blue-600" />
            Advanced Analytics
          </h1>
          <p className="text-slate-600">Funnel analysis, cohort analysis, attribution modeling, and A/B testing</p>
        </div>
        <div className="flex items-center space-x-3">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-40">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
              <SelectItem value="90d">Last 90 Days</SelectItem>
              <SelectItem value="1y">Last Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Analytics Tabs */}
      <Tabs defaultValue="funnel" className="space-y-6">
        <TabsList>
          <TabsTrigger value="funnel">Funnel Analysis</TabsTrigger>
          <TabsTrigger value="cohort">Cohort Analysis</TabsTrigger>
          <TabsTrigger value="attribution">Attribution Models</TabsTrigger>
          <TabsTrigger value="abtesting">A/B Testing</TabsTrigger>
        </TabsList>

        {/* Funnel Analysis */}
        <TabsContent value="funnel" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Conversion Funnel</h2>
              <p className="text-slate-600">Track user journey through conversion stages</p>
            </div>
            <Button onClick={handleCreateFunnel}>
              <Plus className="h-4 w-4 mr-2" />
              Create Funnel
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Conversion Funnel Overview</CardTitle>
              <CardDescription>User flow from visitors to purchasers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {funnelData.map((stage, index) => (
                  <div key={index} className="relative">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-blue-600">{index + 1}</span>
                        </div>
                        <div>
                          <h3 className="font-medium">{stage.stage}</h3>
                          <p className="text-sm text-slate-600">{stage.count.toLocaleString()} users</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-semibold">{stage.percentage}%</div>
                        {stage.dropoff > 0 && (
                          <div className="text-sm text-red-600">-{stage.dropoff}% dropoff</div>
                        )}
                      </div>
                    </div>
                    {index < funnelData.length - 1 && (
                      <div className="absolute left-8 top-full w-0.5 h-4 bg-slate-200"></div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Funnel Performance</CardTitle>
                <CardDescription>Key metrics and insights</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Overall Conversion Rate</span>
                  <span className="font-semibold">12.0%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Best Performing Stage</span>
                  <span className="font-semibold">Landing Page (85%)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Biggest Dropoff</span>
                  <span className="font-semibold text-red-600">Add to Cart (31%)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Average Time to Convert</span>
                  <span className="font-semibold">2.5 days</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Optimization Opportunities</CardTitle>
                <CardDescription>Areas for improvement</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 bg-yellow-50 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    <strong>High Dropoff:</strong> 31% of users leave at "Add to Cart" stage
                  </p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Opportunity:</strong> Landing page has 85% retention rate
                  </p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-800">
                    <strong>Success:</strong> Checkout to purchase conversion is strong
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Cohort Analysis */}
        <TabsContent value="cohort" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Cohort Analysis</h2>
              <p className="text-slate-600">Analyze user retention over time</p>
            </div>
            <Button onClick={handleCreateCohort}>
              <Plus className="h-4 w-4 mr-2" />
              Create Cohort
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Retention Cohort Table</CardTitle>
              <CardDescription>User retention by cohort and time period</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2 font-medium">Cohort</th>
                      <th className="text-right p-2 font-medium">Size</th>
                      <th className="text-right p-2 font-medium">Week 0</th>
                      <th className="text-right p-2 font-medium">Week 1</th>
                      <th className="text-right p-2 font-medium">Week 2</th>
                      <th className="text-right p-2 font-medium">Week 3</th>
                      <th className="text-right p-2 font-medium">Week 4</th>
                      <th className="text-right p-2 font-medium">Week 5</th>
                      <th className="text-right p-2 font-medium">Week 6</th>
                      <th className="text-right p-2 font-medium">Week 7</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cohortData.map((cohort, index) => (
                      <tr key={index} className="border-b hover:bg-slate-50">
                        <td className="p-2 font-medium">{cohort.cohort}</td>
                        <td className="p-2 text-right">{cohort.size.toLocaleString()}</td>
                        {cohort.retention.map((retention, weekIndex) => (
                          <td key={weekIndex} className="p-2 text-right">
                            <span className={`px-2 py-1 rounded text-xs ${
                              retention >= 80 ? 'bg-green-100 text-green-800' :
                              retention >= 60 ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {retention}%
                            </span>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Cohort Insights</CardTitle>
                <CardDescription>Key findings from cohort analysis</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Average Retention (Week 1)</span>
                  <span className="font-semibold">91.7%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Average Retention (Week 4)</span>
                  <span className="font-semibold">72.3%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Best Performing Cohort</span>
                  <span className="font-semibold">Jun 2024</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Retention Trend</span>
                  <span className="font-semibold text-green-600">↗ Improving</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Retention Strategies</CardTitle>
                <CardDescription>Recommendations for improvement</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Week 1:</strong> Focus on onboarding experience
                  </p>
                </div>
                <div className="p-3 bg-yellow-50 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    <strong>Week 2-3:</strong> Implement re-engagement campaigns
                  </p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-800">
                    <strong>Week 4+:</strong> Build long-term value proposition
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Attribution Models */}
        <TabsContent value="attribution" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Attribution Models</h2>
              <p className="text-slate-600">Compare different attribution models</p>
            </div>
            <Button onClick={() => toast.success("Attribution model created!")}>
              <Plus className="h-4 w-4 mr-2" />
              Create Model
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Attribution Model Comparison</CardTitle>
              <CardDescription>Compare conversions and revenue across different models</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {attributionData.map((model, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-purple-600">{index + 1}</span>
                      </div>
                      <div>
                        <h3 className="font-medium">{model.model}</h3>
                        <p className="text-sm text-slate-600">{model.conversions.toLocaleString()} conversions</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold">${model.revenue.toLocaleString()}</div>
                      <div className="text-sm text-slate-600">{model.percentage}% of total</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Model Performance</CardTitle>
                <CardDescription>Key metrics by attribution model</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Most Conservative</span>
                  <span className="font-semibold">Last Click</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Most Generous</span>
                  <span className="font-semibold">First Click</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Most Balanced</span>
                  <span className="font-semibold">Linear</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Time Weighted</span>
                  <span className="font-semibold">Time Decay</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Attribution Insights</CardTitle>
                <CardDescription>Key findings and recommendations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>First Click:</strong> Great for awareness campaigns
                  </p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-800">
                    <strong>Last Click:</strong> Good for conversion optimization
                  </p>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg">
                  <p className="text-sm text-purple-800">
                    <strong>Linear:</strong> Balanced view of all touchpoints
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* A/B Testing */}
        <TabsContent value="abtesting" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">A/B Testing</h2>
              <p className="text-slate-600">Test different variations to optimize performance</p>
            </div>
            <Button onClick={handleCreateABTest}>
              <Plus className="h-4 w-4 mr-2" />
              Create Test
            </Button>
          </div>

          <div className="space-y-4">
            {abTests.map((test) => (
              <Card key={test.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center">
                        {test.name}
                        {getStatusBadge(test.status)}
                      </CardTitle>
                      <CardDescription>
                        {test.startDate} - {test.endDate}
                      </CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm">
                        <Share className="h-4 w-4 mr-2" />
                        Share
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {test.variants.map((variant, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            index === 0 ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'
                          }`}>
                            <span className="text-sm font-medium">
                              {index === 0 ? 'A' : 'B'}
                            </span>
                          </div>
                          <div>
                            <h3 className="font-medium">{variant.name}</h3>
                            <p className="text-sm text-slate-600">
                              {variant.visitors.toLocaleString()} visitors
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-semibold">{variant.conversions}</div>
                          <div className="text-sm text-slate-600">{variant.rate}% conversion</div>
                        </div>
                      </div>
                    ))}
                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="text-sm text-slate-600">
                        Statistical Confidence: {test.confidence}%
                      </div>
                      <div className="text-sm text-slate-600">
                        Test ID: {test.id}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>A/B Testing Best Practices</CardTitle>
                <CardDescription>Guidelines for successful testing</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Sample Size:</strong> Ensure adequate sample size for statistical significance
                  </p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-800">
                    <strong>Test Duration:</strong> Run tests for at least 2 weeks
                  </p>
                </div>
                <div className="p-3 bg-yellow-50 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    <strong>One Variable:</strong> Test only one variable at a time
                  </p>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg">
                  <p className="text-sm text-purple-800">
                    <strong>Statistical Significance:</strong> Aim for 95% confidence level
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Test Performance</CardTitle>
                <CardDescription>Overall A/B testing metrics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Active Tests</span>
                  <span className="font-semibold">1</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Completed Tests</span>
                  <span className="font-semibold">1</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Average Lift</span>
                  <span className="font-semibold text-green-600">+20%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Success Rate</span>
                  <span className="font-semibold text-green-600">100%</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}


