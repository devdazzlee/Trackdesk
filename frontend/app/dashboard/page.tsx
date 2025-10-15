"use client";

import { useAuth } from "@/contexts/AuthContext";
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
} from "lucide-react";
import { getFullName } from "@/lib/auth-client";

export default function DashboardPage() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
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

  // Mock data - replace with real API calls
  const stats = {
    totalClicks: 12450,
    totalConversions: 342,
    conversionRate: 2.75,
    totalEarnings: 12840.5,
    pendingEarnings: 2340.75,
    activeLinks: 12,
    thisMonthClicks: 3450,
    thisMonthConversions: 89,
    thisMonthEarnings: 3420.25,
  };

  // Performance data for charts
const performanceData = [
    { date: "2024-01-01", clicks: 120, conversions: 8, earnings: 250 },
    { date: "2024-01-02", clicks: 180, conversions: 12, earnings: 420 },
    { date: "2024-01-03", clicks: 200, conversions: 18, earnings: 580 },
    { date: "2024-01-04", clicks: 150, conversions: 15, earnings: 380 },
    { date: "2024-01-05", clicks: 220, conversions: 22, earnings: 650 },
    { date: "2024-01-06", clicks: 190, conversions: 16, earnings: 480 },
    { date: "2024-01-07", clicks: 180, conversions: 14, earnings: 420 },
  ];

  // Top performing links
  const topLinks = [
    {
      id: 1,
      name: "Product Launch Campaign",
      clicks: 2450,
      conversions: 67,
      earnings: 1250.5,
      status: "Active",
    },
    {
      id: 2,
      name: "Holiday Special Offer",
      clicks: 1890,
      conversions: 45,
      earnings: 890.25,
      status: "Active",
    },
    {
      id: 3,
      name: "Email Newsletter Link",
      clicks: 1560,
      conversions: 38,
      earnings: 720.75,
      status: "Active",
    },
    {
      id: 4,
      name: "Social Media Campaign",
      clicks: 1340,
      conversions: 32,
      earnings: 610.0,
      status: "Active",
    },
    {
      id: 5,
      name: "Blog Post CTA",
      clicks: 980,
      conversions: 28,
      earnings: 450.5,
      status: "Active",
    },
  ];

  // Recent activity data
  const recentActivity = [
    {
      id: 1,
      type: "conversion",
      description: "New conversion recorded",
      amount: "+$15.50",
      time: "2 minutes ago",
      status: "success",
    },
    {
      id: 2,
      type: "link",
      description: "New affiliate link generated",
      amount: "Product X",
      time: "1 hour ago",
      status: "info",
    },
    {
      id: 3,
      type: "payout",
      description: "Payout processed successfully",
      amount: "$250.00",
      time: "2 hours ago",
      status: "success",
    },
    {
      id: 4,
      type: "click",
      description: "High traffic spike detected",
      amount: "+150 clicks",
      time: "3 hours ago",
      status: "warning",
    },
    {
      id: 5,
      type: "conversion",
      description: "Conversion rate improved",
      amount: "+2.3%",
      time: "5 hours ago",
      status: "success",
    },
  ];

  // System notifications
  const notifications = [
    {
      id: 1,
      type: "success",
      title: "Payment Processed",
      description: "Your payout of $250.00 has been processed successfully.",
      time: "2 hours ago",
      color: "bg-green-100 border-green-200 text-green-800",
    },
    {
      id: 2,
      type: "info",
      title: "New Campaign Available",
      description:
        "Check out the new product launch campaign with 15% commission.",
      time: "4 hours ago",
      color: "bg-blue-100 border-blue-200 text-blue-800",
    },
    {
      id: 3,
      type: "warning",
      title: "Link Performance Alert",
      description: "One of your links has low conversion rate this week.",
      time: "6 hours ago",
      color: "bg-yellow-100 border-yellow-200 text-yellow-800",
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
                  Last updated: {new Date().toLocaleTimeString()}
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="secondary"
                size="sm"
                className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm transition-all duration-200 hover:scale-105"
              >
                <Calendar className="h-4 w-4 mr-2" />
                Last 7 Days
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
