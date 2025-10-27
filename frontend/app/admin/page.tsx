"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { KPITile } from "@/components/dashboard/kpi-tile";
import { LineChartComponent } from "@/components/charts/line-chart";
import { BarChartComponent } from "@/components/charts/bar-chart";
import { DoughnutChartComponent } from "@/components/charts/doughnut-chart";
import { DataTable } from "@/components/dashboard/data-table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AdminLoading, AuthRequired } from "@/components/ui/loading";
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
  BarChart3,
  Send,
  RefreshCw,
} from "lucide-react";
import { getFullName } from "@/lib/auth-client";
import { toast } from "sonner";
import apiClient from "@/lib/api-client";
import { config } from "@/config/config";
import { formatLastActivity, formatRelativeTime } from "@/lib/date-utils";
import { Skeleton } from "@/components/ui/skeleton";

// Mock data for program overview - updated to match your chart design
const programPerformanceData = [
  {
    date: "2024-01-01",
    totalClicks: 120,
    totalConversions: 8,
    totalRevenue: 250,
    totalCommissions: 75,
  },
  {
    date: "2024-01-03",
    totalClicks: 180,
    totalConversions: 12,
    totalRevenue: 420,
    totalCommissions: 126,
  },
  {
    date: "2024-01-05",
    totalClicks: 200,
    totalConversions: 18,
    totalRevenue: 580,
    totalCommissions: 174,
  },
  {
    date: "2024-01-07",
    totalClicks: 180,
    totalConversions: 15,
    totalRevenue: 470,
    totalCommissions: 141,
  },
];

const topAffiliatesData = [
  {
    affiliate: "John Doe",
    clicks: 1250,
    conversions: 89,
    revenue: 2670,
    commission: 801,
  },
  {
    affiliate: "Sarah Wilson",
    clicks: 980,
    conversions: 67,
    revenue: 2010,
    commission: 603,
  },
  {
    affiliate: "Mike Johnson",
    clicks: 850,
    conversions: 58,
    revenue: 1740,
    commission: 522,
  },
  {
    affiliate: "Lisa Brown",
    clicks: 720,
    conversions: 49,
    revenue: 1470,
    commission: 441,
  },
  {
    affiliate: "David Lee",
    clicks: 680,
    conversions: 46,
    revenue: 1380,
    commission: 414,
  },
];

const trafficSourcesData = [
  { name: "Social Media", value: 45, color: "#3b82f6" },
  { name: "Email Marketing", value: 35, color: "#10b981" },
  { name: "Direct Traffic", value: 15, color: "#f59e0b" },
  { name: "Search Engines", value: 5, color: "#ef4444" },
];

const recentAffiliates = [
  {
    id: "AFF-001",
    name: "John Doe",
    email: "john@example.com",
    joinDate: "2024-01-07",
    status: "active",
    totalEarnings: 1250.0,
    lastActivity: "2024-01-07 14:30",
  },
  {
    id: "AFF-002",
    name: "Sarah Wilson",
    email: "sarah@example.com",
    joinDate: "2024-01-06",
    status: "active",
    totalEarnings: 980.0,
    lastActivity: "2024-01-07 12:15",
  },
  {
    id: "AFF-003",
    name: "Mike Johnson",
    email: "mike@example.com",
    joinDate: "2024-01-05",
    status: "pending",
    totalEarnings: 0.0,
    lastActivity: "2024-01-05 16:45",
  },
  {
    id: "AFF-004",
    name: "Lisa Brown",
    email: "lisa@example.com",
    joinDate: "2024-01-04",
    status: "active",
    totalEarnings: 720.0,
    lastActivity: "2024-01-07 09:20",
  },
  {
    id: "AFF-005",
    name: "David Lee",
    email: "david@example.com",
    joinDate: "2024-01-03",
    status: "suspended",
    totalEarnings: 680.0,
    lastActivity: "2024-01-03 18:10",
  },
];

const pendingPayouts = [
  {
    id: "PAYOUT-001",
    affiliate: "John Doe",
    amount: 450.0,
    method: "PayPal",
    status: "pending",
    requestDate: "2024-01-07",
    email: "john@example.com",
  },
  {
    id: "PAYOUT-002",
    affiliate: "Sarah Wilson",
    amount: 320.0,
    method: "PayPal",
    status: "pending",
    requestDate: "2024-01-06",
    email: "sarah@example.com",
  },
  {
    id: "PAYOUT-003",
    affiliate: "Mike Johnson",
    amount: 280.0,
    method: "PayPal",
    status: "pending",
    requestDate: "2024-01-05",
    email: "mike@example.com",
  },
];

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
          value === "active"
            ? "default"
            : value === "pending"
            ? "secondary"
            : "destructive"
        }
      >
        {value.charAt(0).toUpperCase() + value.slice(1)}
      </Badge>
    ),
  },
  {
    key: "totalEarnings",
    label: "Total Earnings",
    sortable: true,
    render: (value: number) => `$${value.toFixed(2)}`,
  },
  { key: "lastActivity", label: "Last Activity", sortable: true },
];

const payoutColumns = [
  { key: "id", label: "Payout ID", sortable: true },
  { key: "affiliate", label: "Affiliate", sortable: true },
  {
    key: "amount",
    label: "Amount",
    sortable: true,
    render: (value: number) => `$${value.toFixed(2)}`,
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
    ),
  },
  { key: "requestDate", label: "Request Date", sortable: true },
  { key: "email", label: "Email", sortable: true },
];

const systemAlerts = [
  {
    type: "warning",
    title: "3 Pending Affiliate Applications",
    description:
      "Review and approve new affiliate applications to grow your program.",
    time: "2 hours ago",
    color: "bg-yellow-100 border-yellow-200 text-yellow-800",
  },
  {
    type: "info",
    title: "Monthly Payout Processing",
    description: "Process monthly payouts for 45 affiliates totaling $12,450.",
    time: "1 day ago",
    color: "bg-blue-100 border-blue-200 text-blue-800",
  },
  {
    type: "success",
    title: "Program Performance Up 15%",
    description:
      "Great month! Your affiliate program generated 15% more revenue than last month.",
    time: "3 days ago",
    color: "bg-green-100 border-green-200 text-green-800",
  },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case "active":
      return <Badge className="bg-green-600 text-white">Active</Badge>;
    case "pending":
      return <Badge className="bg-yellow-600 text-white">Pending</Badge>;
    case "suspended":
      return <Badge className="bg-red-600 text-white">Suspended</Badge>;
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
};

interface AdminDashboardData {
  statistics: {
    totalAffiliates: number;
    activeAffiliates: number;
    pendingAffiliates: number;
    totalRevenue: number;
    totalCommissions: number;
    averageCommissionRate: number;
    totalClicks: number;
    totalConversions: number;
    conversionRate: number;
  };
  dailyPerformance: Array<{
    date: string;
    totalClicks: number;
    conversions: number;
    revenue: number;
  }>;
  topAffiliates: Array<{
    id: string;
    name: string;
    email: string;
    status: string;
    tier: string;
    totalEarnings: number;
    totalConversions: number;
    lastActivity: Date | string | null;
  }>;
  pendingPayouts: Array<any>;
  systemAlerts: Array<any>;
}

export default function AdminDashboardPage() {
  const { user, isLoading } = useAuth();
  const [dashboardData, setDashboardData] = useState<AdminDashboardData | null>(
    null
  );
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      const response = await apiClient.get("/admin/dashboard/overview");
      setDashboardData(response.data);
    } catch (error) {
      console.error("Error fetching admin dashboard data:", error);
      // Error toast already handled by interceptor
    } finally {
      setIsDataLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchDashboardData();
    setIsRefreshing(false);
    toast.success("Dashboard data refreshed");
  };

  if (isLoading || isDataLoading) {
    return <AdminLoading message="Loading admin dashboard..." />;
  }

  if (!user) {
    return (
      <AuthRequired
        message="Admin Access Required"
        actionText="Go to Login"
        actionUrl="/auth/login"
      />
    );
  }

  if (!dashboardData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            No Data Available
          </h2>
          <Button onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCw
              className={`w-4 h-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`}
            />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

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
          <div className="hidden md:flex items-center space-x-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw
                className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`}
              />
              {isRefreshing ? "Refreshing..." : "Refresh"}
            </Button>
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
          value={dashboardData.statistics.totalAffiliates}
          change={{ value: 8.5, type: "increase", period: "last month" }}
          icon={Users}
          iconColor="text-blue-600"
          description={`${dashboardData.statistics.activeAffiliates} active, ${dashboardData.statistics.pendingAffiliates} pending`}
        />
        <KPITile
          title="Total Revenue"
          value={Math.round(dashboardData.statistics.totalRevenue)}
          change={{ value: 15.3, type: "increase", period: "last month" }}
          icon={DollarSign}
          iconColor="text-green-600"
          description="Revenue generated by affiliates"
        />
        <KPITile
          title="Total Commissions"
          value={Math.round(dashboardData.statistics.totalCommissions)}
          change={{ value: 15.3, type: "increase", period: "last month" }}
          icon={TrendingUp}
          iconColor="text-emerald-600"
          description="Commissions paid to affiliates"
        />
        <KPITile
          title="Conversion Rate"
          value={`${(
            Math.round(dashboardData.statistics.conversionRate * 10) / 10
          ).toFixed(1)}%`}
          change={{ value: 0.8, type: "increase", period: "last month" }}
          icon={Target}
          iconColor="text-purple-600"
          description="Overall program conversion rate"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LineChartComponent
          data={dashboardData.dailyPerformance}
          title="Program Performance"
          description="Overall program metrics over time"
          dataKey="date"
          xAxisKey="date"
          lines={[
            { dataKey: "totalClicks", stroke: "#3b82f6", name: "Total Clicks" },
            {
              dataKey: "conversions",
              stroke: "#10b981",
              name: "Conversions",
            },
            {
              dataKey: "revenue",
              stroke: "#f59e0b",
              name: "Revenue ($)",
            },
          ]}
        />
        <BarChartComponent
          data={dashboardData.topAffiliates.map((aff) => ({
            affiliate: aff.name.split(" ")[0] || "Unknown",
            revenue: aff.totalEarnings,
          }))}
          title="Top Performing Affiliates"
          description="Best performing affiliates this month"
          dataKey="affiliate"
          xAxisKey="affiliate"
          bars={[{ dataKey: "revenue", fill: "#3b82f6", name: "Revenue ($)" }]}
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
          title="Top Affiliates"
          description="Top performing affiliates this month"
          columns={affiliateColumns}
          data={dashboardData.topAffiliates.map((aff) => ({
            id: aff.id,
            name: aff.name,
            email: aff.email,
            joinDate: "-",
            status: aff.status.toLowerCase(),
            tier: aff.tier,
            totalEarnings: aff.totalEarnings,
            totalClicks: 0,
            totalConversions: aff.totalConversions,
            conversionRate: 0,
            lastActivity: formatLastActivity(
              aff.lastActivity?.toString() || "Never"
            ),
            paymentMethod: "PayPal",
            country: "Unknown",
          }))}
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
          data={dashboardData.pendingPayouts}
          searchable={true}
          filterable={true}
          exportable={true}
          pagination={true}
          pageSize={5}
        />
      </div>

      {/* System Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bell className="h-5 w-5 mr-2" />
            System Alerts
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Important notifications and system updates
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {dashboardData.systemAlerts.map((alert, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border ${alert.color}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium mb-1">{alert.title}</h4>
                    <p className="text-sm opacity-90 mb-2">
                      {alert.description}
                    </p>
                    <p className="text-xs opacity-75">{alert.time}</p>
                  </div>
                  <div
                    className={`w-2 h-2 rounded-full mt-1 ${
                      alert.type === "warning"
                        ? "bg-yellow-600"
                        : alert.type === "info"
                        ? "bg-blue-600"
                        : "bg-green-600"
                    }`}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
