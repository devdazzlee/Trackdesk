"use client"

import { KPITile } from "@/components/dashboard/kpi-tile"
import { LineChartComponent } from "@/components/charts/line-chart"
import { BarChartComponent } from "@/components/charts/bar-chart"
import { DoughnutChartComponent } from "@/components/charts/doughnut-chart"
import { DataTable } from "@/components/dashboard/data-table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  Target,
  Calendar,
  Download,
  Bell,
  ExternalLink,
  UserPlus,
  CreditCard,
  BarChart3
} from "lucide-react"

// Mock data for program overview
const programPerformanceData = [
  { date: "2024-01-01", totalClicks: 5420, totalConversions: 324, totalRevenue: 9720, totalCommissions: 2916 },
  { date: "2024-01-02", totalClicks: 6150, totalConversions: 368, totalRevenue: 11040, totalCommissions: 3312 },
  { date: "2024-01-03", totalClicks: 6780, totalConversions: 406, totalRevenue: 12180, totalCommissions: 3654 },
  { date: "2024-01-04", totalClicks: 7200, totalConversions: 432, totalRevenue: 12960, totalCommissions: 3888 },
  { date: "2024-01-05", totalClicks: 6480, totalConversions: 388, totalRevenue: 11640, totalCommissions: 3492 },
  { date: "2024-01-06", totalClicks: 7920, totalConversions: 475, totalRevenue: 14250, totalCommissions: 4275 },
  { date: "2024-01-07", totalClicks: 6840, totalConversions: 410, totalRevenue: 12300, totalCommissions: 3690 },
]

const topAffiliatesData = [
  { affiliate: "John Doe", clicks: 1250, conversions: 89, revenue: 2670, commission: 801 },
  { affiliate: "Sarah Wilson", clicks: 980, conversions: 67, revenue: 2010, commission: 603 },
  { affiliate: "Mike Johnson", clicks: 850, conversions: 58, revenue: 1740, commission: 522 },
  { affiliate: "Lisa Brown", clicks: 720, conversions: 49, revenue: 1470, commission: 441 },
  { affiliate: "David Lee", clicks: 680, conversions: 46, revenue: 1380, commission: 414 },
]

const revenueBreakdownData = [
  { name: "Premium Plan", value: 45, color: "#3b82f6" },
  { name: "Basic Plan", value: 30, color: "#10b981" },
  { name: "Enterprise", value: 20, color: "#f59e0b" },
  { name: "Starter", value: 5, color: "#ef4444" },
]

const recentAffiliates = [
  {
    id: "AFF-001",
    name: "John Doe",
    email: "john@example.com",
    joinDate: "2024-01-07",
    status: "active",
    totalEarnings: 1250.00,
    lastActivity: "2024-01-07 14:30"
  },
  {
    id: "AFF-002",
    name: "Sarah Wilson",
    email: "sarah@example.com",
    joinDate: "2024-01-06",
    status: "active",
    totalEarnings: 980.00,
    lastActivity: "2024-01-07 12:15"
  },
  {
    id: "AFF-003",
    name: "Mike Johnson",
    email: "mike@example.com",
    joinDate: "2024-01-05",
    status: "pending",
    totalEarnings: 0.00,
    lastActivity: "2024-01-05 16:45"
  },
  {
    id: "AFF-004",
    name: "Lisa Brown",
    email: "lisa@example.com",
    joinDate: "2024-01-04",
    status: "active",
    totalEarnings: 720.00,
    lastActivity: "2024-01-07 09:20"
  },
  {
    id: "AFF-005",
    name: "David Lee",
    email: "david@example.com",
    joinDate: "2024-01-03",
    status: "suspended",
    totalEarnings: 680.00,
    lastActivity: "2024-01-03 18:10"
  },
]

const pendingPayouts = [
  {
    id: "PAYOUT-001",
    affiliate: "John Doe",
    amount: 450.00,
    method: "PayPal",
    status: "pending",
    requestDate: "2024-01-07",
    email: "john@example.com"
  },
  {
    id: "PAYOUT-002",
    affiliate: "Sarah Wilson",
    amount: 320.00,
    method: "PayPal",
    status: "pending",
    requestDate: "2024-01-06",
    email: "sarah@example.com"
  },
  {
    id: "PAYOUT-003",
    affiliate: "Mike Johnson",
    amount: 280.00,
    method: "PayPal",
    status: "pending",
    requestDate: "2024-01-05",
    email: "mike@example.com"
  },
]

const affiliateColumns = [
  { key: "id", label: "ID", sortable: true },
  { key: "name", label: "Name", sortable: true },
  { key: "email", label: "Email", sortable: true },
  { key: "joinDate", label: "Join Date", sortable: true },
  { 
    key: "status", 
    label: "Status", 
    sortable: true,
    render: (value: string) => (
      <Badge 
        variant={
          value === "active" ? "default" : 
          value === "pending" ? "secondary" : 
          "destructive"
        }
      >
        {value.charAt(0).toUpperCase() + value.slice(1)}
      </Badge>
    )
  },
  { 
    key: "totalEarnings", 
    label: "Total Earnings", 
    sortable: true,
    render: (value: number) => `$${value.toFixed(2)}`
  },
  { key: "lastActivity", label: "Last Activity", sortable: true },
]

const payoutColumns = [
  { key: "id", label: "Payout ID", sortable: true },
  { key: "affiliate", label: "Affiliate", sortable: true },
  { 
    key: "amount", 
    label: "Amount", 
    sortable: true,
    render: (value: number) => `$${value.toFixed(2)}`
  },
  { key: "method", label: "Method", sortable: true },
  { 
    key: "status", 
    label: "Status", 
    sortable: true,
    render: (value: string) => (
      <Badge variant="secondary">
        {value.charAt(0).toUpperCase() + value.slice(1)}
      </Badge>
    )
  },
  { key: "requestDate", label: "Request Date", sortable: true },
  { key: "email", label: "Email", sortable: true },
]

export default function AdminDashboardPage() {
  return (
    <div className="p-6 space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-teal-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-blue-100">
              Manage your affiliate program and track overall performance
            </p>
          </div>
          <div className="hidden md:block">
            <Button variant="secondary" size="sm">
              <Calendar className="h-4 w-4 mr-2" />
              Last 7 Days
            </Button>
          </div>
        </div>
      </div>

      {/* KPI Tiles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPITile
          title="Total Affiliates"
          value={127}
          change={{ value: 8.5, type: "increase", period: "last month" }}
          icon={Users}
          iconColor="text-blue-600"
          description="Active affiliate partners"
        />
        <KPITile
          title="Total Revenue"
          value={85620}
          change={{ value: 15.3, type: "increase", period: "last month" }}
          icon={DollarSign}
          iconColor="text-green-600"
          description="Revenue generated by affiliates"
        />
        <KPITile
          title="Total Commissions"
          value={25686}
          change={{ value: 15.3, type: "increase", period: "last month" }}
          icon={TrendingUp}
          iconColor="text-emerald-600"
          description="Commissions paid to affiliates"
        />
        <KPITile
          title="Conversion Rate"
          value="6.2%"
          change={{ value: 0.8, type: "increase", period: "last month" }}
          icon={Target}
          iconColor="text-purple-600"
          description="Overall program conversion rate"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LineChartComponent
          data={programPerformanceData}
          title="Program Performance"
          description="Overall program metrics over time"
          dataKey="date"
          xAxisKey="date"
          lines={[
            { dataKey: "totalClicks", stroke: "#3b82f6", name: "Total Clicks" },
            { dataKey: "totalConversions", stroke: "#10b981", name: "Total Conversions" },
            { dataKey: "totalRevenue", stroke: "#f59e0b", name: "Total Revenue ($)" },
          ]}
        />
        <DoughnutChartComponent
          data={revenueBreakdownData}
          title="Revenue by Product"
          description="Revenue distribution across products"
        />
      </div>

      {/* Additional Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BarChartComponent
          data={topAffiliatesData}
          title="Top Performing Affiliates"
          description="Best performing affiliates this month"
          dataKey="affiliate"
          xAxisKey="affiliate"
          bars={[
            { dataKey: "revenue", fill: "#3b82f6", name: "Revenue ($)" },
          ]}
        />
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              <UserPlus className="h-4 w-4 mr-2" />
              Approve New Affiliates
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <CreditCard className="h-4 w-4 mr-2" />
              Process Payouts
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <BarChart3 className="h-4 w-4 mr-2" />
              Generate Reports
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Bell className="h-4 w-4 mr-2" />
              Send Announcements
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Data Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DataTable
          title="Recent Affiliates"
          description="Latest affiliate registrations and activity"
          columns={affiliateColumns}
          data={recentAffiliates}
          searchable={true}
          filterable={true}
          exportable={true}
          pagination={true}
          pageSize={5}
        />
        
        <DataTable
          title="Pending Payouts"
          description="Affiliate payout requests awaiting approval"
          columns={payoutColumns}
          data={pendingPayouts}
          searchable={true}
          filterable={true}
          exportable={true}
          pagination={true}
          pageSize={5}
        />
      </div>

      {/* Program Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Program Statistics</CardTitle>
          <CardDescription>Key metrics and performance indicators</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">127</div>
              <div className="text-sm text-slate-500">Total Affiliates</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">$85,620</div>
              <div className="text-sm text-slate-500">Total Revenue</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-600">$25,686</div>
              <div className="text-sm text-slate-500">Total Commissions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">6.2%</div>
              <div className="text-sm text-slate-500">Conversion Rate</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bell className="h-5 w-5 mr-2" />
            System Alerts
          </CardTitle>
          <CardDescription>Important notifications and system updates</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start space-x-3 p-4 bg-yellow-50 rounded-lg">
            <div className="w-2 h-2 bg-yellow-600 rounded-full mt-2"></div>
            <div className="flex-1">
              <h4 className="font-medium text-yellow-900">3 Pending Affiliate Applications</h4>
              <p className="text-sm text-yellow-700 mt-1">
                Review and approve new affiliate applications to grow your program.
              </p>
              <p className="text-xs text-yellow-600 mt-2">2 hours ago</p>
            </div>
          </div>
          <div className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg">
            <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
            <div className="flex-1">
              <h4 className="font-medium text-blue-900">Monthly Payout Processing</h4>
              <p className="text-sm text-blue-700 mt-1">
                Process monthly payouts for 45 affiliates totaling $12,450.
              </p>
              <p className="text-xs text-blue-600 mt-2">1 day ago</p>
            </div>
          </div>
          <div className="flex items-start space-x-3 p-4 bg-green-50 rounded-lg">
            <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
            <div className="flex-1">
              <h4 className="font-medium text-green-900">Program Performance Up 15%</h4>
              <p className="text-sm text-green-700 mt-1">
                Great month! Your affiliate program generated 15% more revenue than last month.
              </p>
              <p className="text-xs text-green-600 mt-2">3 days ago</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
