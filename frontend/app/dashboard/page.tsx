"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  TrendingUp,
  Users,
  DollarSign,
  Link as LinkIcon,
  Eye,
  MousePointer,
  Target,
  Calendar,
  Download,
  Bell,
  ExternalLink,
  Plus,
  Settings,
  CreditCard,
  Activity,
  ArrowUpRight,
  Clock,
  CheckCircle,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { getFullName } from "@/lib/auth-client";
import { toast } from "sonner";
import { config } from "@/config/config";

interface DashboardOverview {
  totalReferrals: number;
  totalCommissions: number;
  pendingCommissions: number;
  conversionRate: number;
  activeCodes: number;
  totalCodes: number;
  topLinks: Array<{
    id: string;
    name: string;
    clicks: number;
    conversions: number;
    earnings: number;
    status: string;
  }>;
  recentActivity: Array<{
    id: string;
    type: string;
    description: string;
    amount: string;
    time: string;
    status: string;
  }>;
  dailyStats: Array<{
    date: string;
    referrals: number;
    commissions: number;
  }>;
}

interface RealTimeStats {
  activeUsers: number;
  liveClicks: number;
  liveConversions: number;
  liveRevenue: number;
  timestamp: string;
}

export default function DashboardPage() {
  const { user, isLoading } = useAuth();
  const [dashboardData, setDashboardData] = useState<DashboardOverview | null>(
    null
  );
  const [realTimeStats, setRealTimeStats] = useState<RealTimeStats | null>(
    null
  );
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
      fetchRealTimeStats();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch(`${config.apiUrl}/dashboard/overview`, {
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setDashboardData(data);
      } else {
        console.error("Failed to fetch dashboard data:", response.status);
        toast.error("Failed to load dashboard data");
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setIsDataLoading(false);
    }
  };

  const fetchRealTimeStats = async () => {
    try {
      const response = await fetch(
        `${config.apiUrl}/dashboard/real-time-stats`,
        {
          credentials: "include",
        }
      );

      if (response.ok) {
        const data = await response.json();
        setRealTimeStats(data);
      }
    } catch (error) {
      console.error("Error fetching real-time stats:", error);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([fetchDashboardData(), fetchRealTimeStats()]);
    setIsRefreshing(false);
    toast.success("Dashboard data refreshed");
  };

  if (isLoading || isDataLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Authentication Required
          </h2>
          <p className="text-gray-600">
            Please log in to access the dashboard.
          </p>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            No Data Available
          </h2>
          <p className="text-gray-600 mb-4">Unable to load dashboard data.</p>
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

  // Use real data from API
  const stats = {
    totalClicks: dashboardData.totalReferrals,
    totalConversions: dashboardData.totalReferrals,
    conversionRate: dashboardData.conversionRate,
    totalEarnings: dashboardData.totalCommissions,
    pendingEarnings: dashboardData.pendingCommissions,
    activeLinks: dashboardData.activeCodes,
    thisMonthClicks: dashboardData.totalReferrals,
    thisMonthConversions: dashboardData.totalReferrals,
    thisMonthEarnings: dashboardData.totalCommissions,
  };

  // Use real performance data from API
  const performanceData = dashboardData.dailyStats.map((day) => ({
    date: day.date,
    clicks: day.referrals,
    conversions: day.referrals,
    earnings: day.commissions,
  }));

  // Use real top links from API
  const topLinks = dashboardData.topLinks;

  // Use real recent activity from API
  const recentActivity = dashboardData.recentActivity;

  // System notifications (mock for now - can be replaced with real notifications API)
  const notifications = [
    {
      id: 1,
      type: "success",
      title: "Dashboard Updated",
      description:
        "Your dashboard data has been refreshed with the latest information.",
      time: "Just now",
      color: "bg-green-100 border-green-200 text-green-800",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-4 md:p-6 lg:p-8 space-y-6 lg:space-y-8">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 rounded-xl lg:rounded-2xl p-6 md:p-8 text-white shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-2 md:mb-3 bg-gradient-to-r from-white to-green-100 bg-clip-text text-transparent">
                Welcome back, {user.firstName}!
              </h1>
              <p className="text-green-100 text-base md:text-lg">
                Track your affiliate performance and maximize your earnings
              </p>
              <div className="mt-4 flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-sm text-green-100">Account Active</span>
                </div>
                <div className="text-sm text-green-200">
                  {realTimeStats ? (
                    <>
                      Live: {realTimeStats.activeUsers} users,{" "}
                      {realTimeStats.liveClicks} clicks
                    </>
                  ) : (
                    `Last updated: ${new Date().toLocaleTimeString()}`
                  )}
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="secondary"
                size="sm"
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm transition-all duration-200 hover:scale-105"
              >
                <RefreshCw
                  className={`h-4 w-4 mr-2 ${
                    isRefreshing ? "animate-spin" : ""
                  }`}
                />
                {isRefreshing ? "Refreshing..." : "Refresh Data"}
              </Button>
              <Button
                variant="secondary"
                size="sm"
                className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm transition-all duration-200 hover:scale-105"
              >
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </Button>
            </div>
          </div>
        </div>

        {/* KPI Tiles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <div className="group">
            <Card className="h-full bg-white hover:bg-gradient-to-br hover:from-blue-50 hover:to-blue-100 transition-all duration-300 hover:shadow-lg hover:scale-105 border-0 shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      Total Clicks
                    </p>
                    <div className="text-3xl font-bold text-blue-600 mb-2">
                      {stats.totalClicks.toLocaleString()}
                    </div>
                    <div className="flex items-center space-x-1">
                      <ArrowUpRight className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-green-600 font-medium">
                        +{stats.thisMonthClicks.toLocaleString()}
                      </span>
                      <span className="text-xs text-gray-500">this month</span>
                    </div>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-full group-hover:bg-blue-200 transition-colors">
                    <MousePointer className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="group">
            <Card className="h-full bg-white hover:bg-gradient-to-br hover:from-green-50 hover:to-green-100 transition-all duration-300 hover:shadow-lg hover:scale-105 border-0 shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      Total Conversions
                    </p>
                    <div className="text-3xl font-bold text-green-600 mb-2">
                      {stats.totalConversions.toLocaleString()}
                    </div>
                    <div className="flex items-center space-x-1">
                      <ArrowUpRight className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-green-600 font-medium">
                        +{stats.thisMonthConversions}
                      </span>
                      <span className="text-xs text-gray-500">this month</span>
                    </div>
                  </div>
                  <div className="p-3 bg-green-100 rounded-full group-hover:bg-green-200 transition-colors">
                    <Target className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="group">
            <Card className="h-full bg-white hover:bg-gradient-to-br hover:from-purple-50 hover:to-purple-100 transition-all duration-300 hover:shadow-lg hover:scale-105 border-0 shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      Conversion Rate
                    </p>
                    <div className="text-3xl font-bold text-purple-600 mb-2">
                      {stats.conversionRate}%
                    </div>
                    <div className="flex items-center space-x-1">
                      <ArrowUpRight className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-green-600 font-medium">
                        +0.3%
                      </span>
                      <span className="text-xs text-gray-500">
                        from last month
                      </span>
                    </div>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-full group-hover:bg-purple-200 transition-colors">
                    <TrendingUp className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="group">
            <Card className="h-full bg-white hover:bg-gradient-to-br hover:from-emerald-50 hover:to-emerald-100 transition-all duration-300 hover:shadow-lg hover:scale-105 border-0 shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      Total Earnings
                    </p>
                    <div className="text-3xl font-bold text-emerald-600 mb-2">
                      ${stats.totalEarnings.toLocaleString()}
                    </div>
                    <div className="flex items-center space-x-1">
                      <ArrowUpRight className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-green-600 font-medium">
                        +${stats.thisMonthEarnings.toLocaleString()}
                      </span>
                      <span className="text-xs text-gray-500">this month</span>
                    </div>
                  </div>
                  <div className="p-3 bg-emerald-100 rounded-full group-hover:bg-emerald-200 transition-colors">
                    <DollarSign className="h-6 w-6 text-emerald-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Performance Chart and Quick Actions */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
          <div className="group">
            <Card className="bg-white hover:shadow-xl transition-all duration-300 border-0 shadow-lg hover:scale-[1.02]">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-semibold text-gray-800 flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  Performance Overview
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Your affiliate performance over the last 7 days
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="h-64 bg-gray-50 rounded-lg relative p-4">
                  <div className="relative w-full h-full">
                    {/* Y-axis labels */}
                    <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-600">
                      <span>$700</span>
                      <span>$525</span>
                      <span>$350</span>
                      <span>$175</span>
                      <span>$0</span>
                    </div>

                    {/* Chart Area */}
                    <div className="ml-12 h-full">
                      <svg className="w-full h-full" viewBox="0 0 400 200">
                        {/* Grid Lines */}
                        <defs>
                          <pattern
                            id="grid"
                            width="40"
                            height="40"
                            patternUnits="userSpaceOnUse"
                          >
                            <path
                              d="M 40 0 L 0 0 0 40"
                              fill="none"
                              stroke="#f3f4f6"
                              strokeWidth="1"
                            />
                          </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#grid)" />

                        {/* Data Points and Lines */}
                        {(() => {
                          const points = performanceData.map(
                            (point, index) => ({
                              x: (index / 6) * 350 + 25,
                              clicksY: 200 - (point.clicks / 250) * 180,
                              conversionsY:
                                200 - (point.conversions / 25) * 180,
                              earningsY: 200 - (point.earnings / 700) * 180,
                              ...point,
                            })
                          );

                          const clicksPath = points
                            .map((p) => `${p.x},${p.clicksY}`)
                            .join(" ");
                          const conversionsPath = points
                            .map((p) => `${p.x},${p.conversionsY}`)
                            .join(" ");
                          const earningsPath = points
                            .map((p) => `${p.x},${p.earningsY}`)
                            .join(" ");

                          return (
                            <>
                              {/* Lines */}
                              <polyline
                                points={clicksPath}
                                fill="none"
                                stroke="#3b82f6"
                                strokeWidth="2"
                                className="hover:stroke-blue-400 transition-colors"
                              />
                              <polyline
                                points={conversionsPath}
                                fill="none"
                                stroke="#10b981"
                                strokeWidth="2"
                                className="hover:stroke-green-400 transition-colors"
                              />
                              <polyline
                                points={earningsPath}
                                fill="none"
                                stroke="#f59e0b"
                                strokeWidth="2"
                                className="hover:stroke-orange-400 transition-colors"
                              />

                              {/* Data Points */}
                              {points.map((point, index) => (
                                <g key={index}>
                                  <circle
                                    cx={point.x}
                                    cy={point.clicksY}
                                    r="4"
                                    fill="#3b82f6"
                                    className="transition-all cursor-pointer hover:r-6"
                                  />
                                  <circle
                                    cx={point.x}
                                    cy={point.conversionsY}
                                    r="4"
                                    fill="#10b981"
                                    className="transition-all cursor-pointer hover:r-6"
                                  />
                                  <circle
                                    cx={point.x}
                                    cy={point.earningsY}
                                    r="4"
                                    fill="#f59e0b"
                                    className="transition-all cursor-pointer hover:r-6"
                                  />

                                  {/* Date labels */}
                                  <text
                                    x={point.x}
                                    y="195"
                                    textAnchor="middle"
                                    className="text-xs fill-gray-600"
                                  >
                                    {point.date.split("-")[2]}
                                  </text>
                                </g>
                              ))}
                            </>
                          );
                        })()}
                      </svg>
                    </div>
                  </div>
                </div>
                {/* Chart Legend */}
                <div className="flex items-center justify-center space-x-6 mt-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                    <span className="text-xs text-gray-600">Clicks</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                    <span className="text-xs text-gray-600">Conversions</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-orange-600 rounded-full"></div>
                    <span className="text-xs text-gray-600">Earnings ($)</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="group">
            <Card className="bg-white hover:shadow-xl transition-all duration-300 border-0 shadow-lg hover:scale-[1.02]">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-semibold text-gray-800 flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  Quick Actions
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Common affiliate tasks and tools
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <Button
                  variant="outline"
                  className="w-full justify-start h-12 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-all duration-200 group"
                >
                  <LinkIcon className="h-5 w-5 mr-3 text-blue-600 group-hover:scale-110 transition-transform" />
                  <span className="font-medium">Create New Link</span>
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start h-12 hover:bg-green-50 hover:border-green-300 hover:text-green-700 transition-all duration-200 group"
                >
                  <BarChart3 className="h-5 w-5 mr-3 text-green-600 group-hover:scale-110 transition-transform" />
                  <span className="font-medium">View Analytics</span>
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start h-12 hover:bg-purple-50 hover:border-purple-300 hover:text-purple-700 transition-all duration-200 group"
                >
                  <DollarSign className="h-5 w-5 mr-3 text-purple-600 group-hover:scale-110 transition-transform" />
                  <span className="font-medium">View Earnings</span>
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start h-12 hover:bg-orange-50 hover:border-orange-300 hover:text-orange-700 transition-all duration-200 group"
                >
                  <Settings className="h-5 w-5 mr-3 text-orange-600 group-hover:scale-110 transition-transform" />
                  <span className="font-medium">Account Settings</span>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Top Links and Recent Activity */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
          <div className="group">
            <Card className="bg-white hover:shadow-xl transition-all duration-300 border-0 shadow-lg hover:scale-[1.01]">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-semibold text-gray-800 flex items-center">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full mr-3"></div>
                  Top Performing Links
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Your best performing affiliate links
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {topLinks.map((link) => (
                    <div
                      key={link.id}
                      className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 cursor-pointer group"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900 group-hover:text-blue-700 transition-colors">
                          {link.name}
                        </h4>
                        <Badge
                          variant="secondary"
                          className="text-xs bg-green-100 text-green-800"
                        >
                          {link.status}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">Clicks</p>
                          <p className="font-semibold text-blue-600">
                            {link.clicks.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500">Conversions</p>
                          <p className="font-semibold text-green-600">
                            {link.conversions}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500">Earnings</p>
                          <p className="font-semibold text-emerald-600">
                            ${link.earnings.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="group">
            <Card className="bg-white hover:shadow-xl transition-all duration-300 border-0 shadow-lg hover:scale-[1.01]">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-semibold text-gray-800 flex items-center">
                  <div className="w-2 h-2 bg-teal-500 rounded-full mr-3"></div>
                  Recent Activity
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Your latest affiliate activities and updates
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-center justify-between py-3 border-b border-gray-100 hover:bg-gray-50 rounded-lg px-2 transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            activity.status === "success"
                              ? "bg-green-600"
                              : activity.status === "warning"
                              ? "bg-yellow-600"
                              : "bg-blue-600"
                          }`}
                        ></div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 group-hover:text-gray-700 transition-colors">
                            {activity.description}
                          </p>
                          <p className="text-xs text-gray-500">
                            {activity.time}
                          </p>
                        </div>
                      </div>
                      <Badge
                        variant="secondary"
                        className={`text-xs ${
                          activity.status === "success"
                            ? "bg-green-100 text-green-800"
                            : activity.status === "warning"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {activity.amount}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Notifications */}
        <div className="group">
          <Card className="bg-white hover:shadow-xl transition-all duration-300 border-0 shadow-lg hover:scale-[1.01]">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-semibold text-gray-800 flex items-center">
                <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                Notifications
              </CardTitle>
              <CardDescription className="text-gray-600">
                Important updates and system notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 rounded-lg border-l-4 ${notification.color} hover:shadow-md transition-all duration-200 cursor-pointer group`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <Badge
                            variant="outline"
                            className={`text-xs ${
                              notification.type === "success"
                                ? "text-green-600 border-green-200 bg-green-50"
                                : notification.type === "warning"
                                ? "text-yellow-600 border-yellow-200 bg-yellow-50"
                                : "text-blue-600 border-blue-200 bg-blue-50"
                            }`}
                          >
                            {notification.type.toUpperCase()}
                          </Badge>
                          <span className="text-sm text-gray-500">
                            {notification.time}
                          </span>
                        </div>
                        <h4 className="font-medium text-gray-900 mb-1 group-hover:text-gray-700 transition-colors">
                          {notification.title}
                        </h4>
                        <p className="text-sm text-gray-600 group-hover:text-gray-700 transition-colors">
                          {notification.description}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
