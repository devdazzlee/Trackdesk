"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Home,
  BarChart3,
  Link as LinkIcon,
  DollarSign,
  BookOpen,
  Settings,
  User,
  Users,
  Bell,
  Menu,
  LogOut,
  ChevronDown,
  HelpCircle,
  CreditCard,
  Shield,
  Moon,
  Sun,
  Wrench,
  FileText,
  Send,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { getFullName, getInitials } from "@/lib/auth-client";

interface DashboardLayoutProps {
  children: React.ReactNode;
  userType?: "affiliate" | "admin" | "manager";
}

const affiliateNavItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: Home,
  },
  {
    title: "Statistics",
    href: "/dashboard/statistics",
    icon: BarChart3,
    subItems: [
      { title: "Real-Time Clicks", href: "/dashboard/statistics/clicks" },
      { title: "Conversions Log", href: "/dashboard/statistics/conversions" },
      { title: "Traffic Analysis", href: "/dashboard/statistics/traffic" },
    ],
  },
  {
    title: "My Links & Assets",
    href: "/dashboard/links",
    icon: LinkIcon,
    subItems: [
      { title: "URL Generator", href: "/dashboard/links/generator" },
      { title: "Banners & Logos", href: "/dashboard/links/banners" },
      { title: "Coupon Codes", href: "/dashboard/links/coupons" },
    ],
  },
  {
    title: "Referral System",
    href: "/dashboard/referrals",
    icon: Users,
    subItems: [
      { title: "My Referral Codes", href: "/dashboard/referrals" },
      { title: "Referral Analytics", href: "/dashboard/referrals/analytics" },
      { title: "Shareable Links", href: "/dashboard/referrals/share" },
    ],
  },
  {
    title: "Commissions & Payouts",
    href: "/dashboard/commissions",
    icon: DollarSign,
    subItems: [
      { title: "Pending Commissions", href: "/dashboard/commissions/pending" },
      { title: "Payout History", href: "/dashboard/commissions/history" },
      { title: "Payout Settings", href: "/dashboard/commissions/settings" },
    ],
  },
  {
    title: "Resources & Support",
    href: "/dashboard/resources",
    icon: BookOpen,
    subItems: [
      { title: "FAQ/Knowledge Base", href: "/dashboard/resources/faq" },
      { title: "Program Terms", href: "/dashboard/resources/terms" },
      { title: "Contact Support", href: "/dashboard/resources/support" },
    ],
  },
  {
    title: "Account Settings",
    href: "/dashboard/settings",
    icon: Settings,
    subItems: [
      { title: "Profile", href: "/dashboard/settings/profile" },
      { title: "Security", href: "/dashboard/settings/security" },
      { title: "Notifications", href: "/dashboard/settings/notifications" },
    ],
  },
];

const managerNavItems = [
  {
    title: "Manager Dashboard",
    href: "/manager",
    icon: Home,
  },
  {
    title: "Affiliate Management",
    href: "/manager/affiliates",
    icon: User,
    subItems: [
      { title: "All Affiliates", href: "/manager/affiliates/all" },
      { title: "Approval Queue", href: "/manager/affiliates/approval" },
      { title: "Performance Review", href: "/manager/affiliates/performance" },
    ],
  },
  {
    title: "Analytics & Reports",
    href: "/manager/analytics",
    icon: BarChart3,
    subItems: [
      { title: "Revenue Reports", href: "/manager/analytics/revenue" },
      { title: "Traffic Analysis", href: "/manager/analytics/traffic" },
      { title: "Conversion Reports", href: "/manager/analytics/conversions" },
    ],
  },
  {
    title: "Offer Management",
    href: "/manager/offers",
    icon: LinkIcon,
    subItems: [
      { title: "Active Offers", href: "/manager/offers/active" },
      { title: "Create Offer", href: "/manager/offers/create" },
      { title: "Performance", href: "/manager/offers/performance" },
    ],
  },
  {
    title: "Payout Management",
    href: "/manager/payouts",
    icon: DollarSign,
    subItems: [
      { title: "Pending Payouts", href: "/manager/payouts/pending" },
      { title: "Payout History", href: "/manager/payouts/history" },
      { title: "Payout Settings", href: "/manager/payouts/settings" },
    ],
  },
  {
    title: "Team Management",
    href: "/manager/team",
    icon: Users,
    subItems: [
      { title: "Team Overview", href: "/manager/team/overview" },
      { title: "Performance", href: "/manager/team/performance" },
      { title: "Assignments", href: "/manager/team/assignments" },
    ],
  },
  {
    title: "Settings",
    href: "/manager/settings",
    icon: Settings,
    subItems: [
      { title: "Profile", href: "/manager/settings/profile" },
      { title: "Security", href: "/manager/settings/security" },
      { title: "Notifications", href: "/manager/settings/notifications" },
    ],
  },
];

const adminNavItems = [
  {
    title: "Program Overview",
    href: "/admin",
    icon: BarChart3,
  },
  {
    title: "Reports",
    href: "/admin/reports",
    icon: BarChart3,
    subItems: [
      { title: "Daily report", href: "/admin/reports/daily" },
      { title: "Overview reports", href: "/admin/reports/overview" },
      { title: "Report builder", href: "/admin/reports/builder" },
      { title: "Clicks", href: "/admin/reports/clicks" },
      { title: "Conversions", href: "/admin/reports/conversions" },
    ],
  },
  {
    title: "Manage Affiliates",
    href: "/admin/affiliates",
    icon: User,
  },
  {
    title: "Payout Queue",
    href: "/admin/payouts",
    icon: CreditCard,
  },
  {
    title: "Commission Management",
    href: "/admin/commissions",
    icon: DollarSign,
    subItems: [
      { title: "All Commissions", href: "/admin/commissions" },
      { title: "Commission Analytics", href: "/admin/commissions/analytics" },
      { title: "Rate Management", href: "/admin/commissions/rates" },
    ],
  },
  {
    title: "Offers & Creatives",
    href: "/admin/offers",
    icon: LinkIcon,
  },
  {
    title: "Alerts",
    href: "/admin/alerts",
    icon: Bell,
  },
  {
    title: "Tools",
    href: "/admin/tools",
    icon: Wrench,
    subItems: [
      { title: "Payout builder", href: "/admin/tools/payout-builder" },
      { title: "Traffic control", href: "/admin/tools/traffic-control" },
      { title: "Webhooks", href: "/admin/tools/webhooks" },
      { title: "System logs", href: "/admin/tools/logs" },
    ],
  },
  {
    title: "System Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];

export default function DashboardLayout({
  children,
  userType = "affiliate",
}: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();

  const navItems =
    userType === "admin"
      ? adminNavItems
      : userType === "manager"
      ? managerNavItems
      : affiliateNavItems;

  const toggleExpanded = (title: string) => {
    setExpandedItems((prev) =>
      prev.includes(title)
        ? prev.filter((item) => item !== title)
        : [...prev, title]
    );
  };

  const isActive = (href: string) => {
    if (href === "/dashboard" || href === "/admin") {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  const handleProfileClick = () => {
    let profilePath = "/dashboard/settings/profile";
    if (userType === "admin") profilePath = "/admin/settings";
    else if (userType === "manager") profilePath = "/manager/settings/profile";
    router.push(profilePath);
  };

  const handleSettingsClick = () => {
    let settingsPath = "/dashboard/settings";
    if (userType === "admin") settingsPath = "/admin/settings";
    else if (userType === "manager") settingsPath = "/manager/settings";
    router.push(settingsPath);
  };

  const handleSupportClick = () => {
    let supportPath = "/dashboard/resources/support";
    if (userType === "admin") supportPath = "/admin/settings";
    else if (userType === "manager") supportPath = "/manager/settings";
    router.push(supportPath);
  };

  const handleViewAllNotifications = () => {
    let notificationsPath = "/dashboard/notifications";
    if (userType === "admin") notificationsPath = "/admin/notifications";
    else if (userType === "manager")
      notificationsPath = "/manager/notifications";
    router.push(notificationsPath);
  };

  // Mock notifications data
  const notifications = [
    {
      id: "1",
      title: "New conversion recorded",
      message: "You earned $15.50 from a new conversion",
      time: "2 minutes ago",
      unread: true,
    },
    {
      id: "2",
      title: "Payout processed",
      message: "Your payout of $250.00 has been processed",
      time: "1 hour ago",
      unread: true,
    },
    {
      id: "3",
      title: "New offer available",
      message: "Check out our latest Black Friday offer",
      time: "3 hours ago",
      unread: false,
    },
  ];

  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex h-16 items-center px-6 border-b">
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-teal-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">A</span>
          </div>
          <span className="font-bold text-lg">
            {userType === "admin"
              ? "Trackdesk Admin"
              : userType === "manager"
              ? "Trackdesk Manager"
              : "Trackdesk"}
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        {navItems.map((item) => {
          const hasSubItems = item.subItems && item.subItems.length > 0;
          const isExpanded = expandedItems.includes(item.title);
          const isItemActive = isActive(item.href);

          return (
            <div key={item.title}>
              {hasSubItems ? (
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start h-10 px-3 text-left font-normal",
                    isItemActive && "bg-blue-50 text-blue-700 hover:bg-blue-100"
                  )}
                  onClick={() => toggleExpanded(item.title)}
                >
                  <item.icon className="mr-3 h-4 w-4" />
                  {item.title}
                  <ChevronDown
                    className={cn(
                      "ml-auto h-4 w-4 transition-transform",
                      isExpanded && "rotate-180"
                    )}
                  />
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  asChild
                  className={cn(
                    "w-full justify-start h-10 px-3 text-left font-normal",
                    isItemActive && "bg-blue-50 text-blue-700 hover:bg-blue-100"
                  )}
                >
                  <Link href={item.href}>
                    <item.icon className="mr-3 h-4 w-4" />
                    {item.title}
                  </Link>
                </Button>
              )}

              {/* Sub Items */}
              {hasSubItems && isExpanded && (
                <div className="ml-6 mt-1 space-y-1">
                  {item.subItems?.map((subItem) => (
                    <Button
                      key={subItem.title}
                      variant="ghost"
                      asChild
                      size="sm"
                      className={cn(
                        "w-full justify-start h-8 px-3 text-left font-normal text-sm",
                        pathname === subItem.href &&
                          "bg-blue-50 text-blue-700 hover:bg-blue-100"
                      )}
                    >
                      <Link href={subItem.href}>{subItem.title}</Link>
                    </Button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* User Info */}
      <div className="p-4 border-t">
        <div className="flex items-center space-x-3 p-3 rounded-lg bg-slate-50">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user?.avatar || "/placeholder-avatar.jpg"} />
            <AvatarFallback>{user ? getInitials(user) : "U"}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-900 truncate">
              {user ? getFullName(user) : "User"}
            </p>
            <p className="text-xs text-slate-500 truncate">
              {userType === "admin"
                ? "Admin"
                : userType === "manager"
                ? "Manager"
                : "Affiliate Partner"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-screen flex overflow-hidden bg-slate-50">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col">
        <div className="flex flex-col flex-grow bg-white border-r border-slate-200">
          <SidebarContent />
        </div>
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="p-0 w-64">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className="md:hidden">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0 w-64">
                  <SidebarContent />
                </SheetContent>
              </Sheet>

              <div>
                <h1 className="text-xl font-semibold text-slate-900">
                  {userType === "admin"
                    ? "Admin Dashboard"
                    : userType === "manager"
                    ? "Manager Dashboard"
                    : "Affiliate Dashboard"}
                </h1>
                <p className="text-sm text-slate-500">
                  {userType === "admin"
                    ? "Manage your affiliate program"
                    : userType === "manager"
                    ? "Manage affiliates and performance"
                    : "Track your performance and earnings"}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <DropdownMenu
                open={notificationsOpen}
                onOpenChange={setNotificationsOpen}
              >
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="relative">
                    <Bell className="h-5 w-5" />
                    <Badge
                      variant="destructive"
                      className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                    >
                      {notifications.filter((n) => n.unread).length}
                    </Badge>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {notifications.map((notification) => (
                    <DropdownMenuItem
                      key={notification.id}
                      className="flex flex-col items-start p-3"
                    >
                      <div className="flex items-start justify-between w-full">
                        <div className="flex-1">
                          <p className="font-medium text-sm">
                            {notification.title}
                          </p>
                          <p className="text-xs text-slate-600 mt-1">
                            {notification.message}
                          </p>
                          <p className="text-xs text-slate-400 mt-1">
                            {notification.time}
                          </p>
                        </div>
                        {notification.unread && (
                          <div className="w-2 h-2 bg-blue-600 rounded-full ml-2 mt-1"></div>
                        )}
                      </div>
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-center"
                    onClick={handleViewAllNotifications}
                  >
                    <span className="text-sm text-blue-600">
                      View all notifications
                    </span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center space-x-2"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={user?.avatar || "/placeholder-avatar.jpg"}
                      />
                      <AvatarFallback>
                        {user ? getInitials(user) : "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="hidden md:block text-left">
                      <p className="text-sm font-medium">
                        {user ? getFullName(user) : "User"}
                      </p>
                      <p className="text-xs text-slate-500">
                        {userType === "admin"
                          ? "Admin"
                          : userType === "manager"
                          ? "Manager"
                          : "Affiliate"}
                      </p>
                    </div>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleProfileClick}>
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleSettingsClick}>
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleSupportClick}>
                    <HelpCircle className="mr-2 h-4 w-4" />
                    Help & Support
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <div onClick={(e) => e.stopPropagation()}>
                    <LogoutButton
                      variant="ghost"
                      className="w-full justify-start"
                      size="sm"
                    >
                      Sign out
                    </LogoutButton>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
