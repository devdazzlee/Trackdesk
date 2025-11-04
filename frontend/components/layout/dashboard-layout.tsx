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
import { config } from "@/config/config";

interface DashboardLayoutProps {
  children: React.ReactNode;
  userType?: "affiliate" | "admin" | "manager";
}

// Helper function to get full avatar URL
const getAvatarUrl = (avatar: string | null | undefined): string => {
  if (!avatar) {
    console.log("No avatar provided, using placeholder");
    return "/placeholder-avatar.jpg";
  }

  // If avatar is already a full URL (starts with http:// or https://), return as is
  if (avatar.startsWith("http://") || avatar.startsWith("https://")) {
    console.log("Avatar is full URL:", avatar);
    return avatar;
  }

  // If avatar is a relative path, construct full URL
  // Remove leading slash if present to avoid double slashes
  const cleanPath = avatar.startsWith("/") ? avatar.slice(1) : avatar;
  const baseUrl = config.apiUrl.replace("/api", "");
  const fullUrl = `${baseUrl}/${cleanPath}`;

  console.log("Constructed avatar URL:", fullUrl, "from avatar:", avatar);
  return fullUrl;
};

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
  },
  {
    title: "My Links & Assets",
    href: "/dashboard/links",
    icon: LinkIcon,
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
  },
  {
    title: "Resources & Support",
    href: "/dashboard/resources",
    icon: BookOpen,
    subItems: [
      { title: "FAQ/Knowledge Base", href: "/dashboard/resources/faq" },
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
      { title: "Websites", href: "/dashboard/settings/websites" },
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
    title: "Manage Affiliates",
    href: "/admin/affiliates",
    icon: User,
  },
  {
    title: "Commission Management",
    href: "/admin/commissions",
    icon: DollarSign,
  },
  {
    title: "Payout Queue",
    href: "/admin/payouts",
    icon: CreditCard,
  },
  {
    title: "Offers & Creatives",
    href: "/admin/offers",
    icon: LinkIcon,
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: Settings,
    subItems: [
      { title: "Profile", href: "/admin/settings/profile" },
      { title: "System Settings", href: "/admin/settings" },
      { title: "Websites", href: "/admin/settings/websites" },
      { title: "Security", href: "/admin/settings/security" },
    ],
  },
];

export default function DashboardLayout({
  children,
  userType = "affiliate",
}: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
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
    if (userType === "admin") profilePath = "/admin/settings/profile";
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
          const hasSubItems =
            (item as any).subItems && (item as any).subItems.length > 0;
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
                  {(item as any).subItems?.map((subItem: any) => (
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
            <AvatarImage src={getAvatarUrl(user?.avatar)} />
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
              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center space-x-2"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={getAvatarUrl(user?.avatar)} />
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
