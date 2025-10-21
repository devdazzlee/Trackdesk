"use client";

import { useState, useEffect } from "react";
import { DataLoading } from "@/components/ui/loading";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Copy,
  Plus,
  Share2,
  QrCode,
  Eye,
  TrendingUp,
  DollarSign,
  Users,
  Target,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { config } from "@/config/config";

interface ReferralCode {
  id: string;
  code: string;
  type: "SIGNUP" | "PRODUCT" | "BOTH";
  commissionRate: number;
  productId?: string;
  maxUses?: number;
  currentUses: number;
  expiresAt?: string;
  isActive: boolean;
  createdAt: string;
}

interface ReferralStats {
  totalReferrals: number;
  totalCommissions: number;
  pendingCommissions: number;
  conversionRate: number;
  topProducts: Array<{
    productId: string;
    productName: string;
    referrals: number;
    commissions: number;
  }>;
}

interface ShareableLinks {
  referralCode: string;
  links: Record<string, string>;
  qrCode: string;
}

export default function ReferralsPage() {
  const { user } = useAuth();
  const [referralCodes, setReferralCodes] = useState<ReferralCode[]>([]);
  const [stats, setStats] = useState<ReferralStats | null>(null);
  const [shareableLinks, setShareableLinks] = useState<ShareableLinks | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isCreatingCode, setIsCreatingCode] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);

  // Form state for creating referral code
  const [newCode, setNewCode] = useState({
    type: "BOTH" as "SIGNUP" | "PRODUCT" | "BOTH",
    commissionRate: 5, // Default to 5% to match affiliate tier
    productId: "",
    maxUses: "",
    expiresAt: "",
  });

  useEffect(() => {
    fetchReferralData();
  }, []);

  const fetchReferralData = async () => {
    try {
      const [codesResponse, statsResponse, linksResponse] = await Promise.all([
        fetch(`${config.apiUrl}/referral/codes`, { credentials: "include" }),
        fetch(`${config.apiUrl}/referral/stats`, { credentials: "include" }),
        fetch(`${config.apiUrl}/referral/shareable-links`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            platforms: [
              "facebook",
              "twitter",
              "instagram",
              "linkedin",
              "tiktok",
            ],
          }),
        }),
      ]);

      if (codesResponse.ok) {
        const codes = await codesResponse.json();
        setReferralCodes(codes);
      }

      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData);
      }

      if (linksResponse.ok) {
        const linksData = await linksResponse.json();
        setShareableLinks(linksData);
      }
    } catch (error) {
      console.error("Error fetching referral data:", error);
      toast.error("Failed to load referral data");
    } finally {
      setIsLoading(false);
    }
  };

  const createReferralCode = async () => {
    setIsCreatingCode(true);
    try {
      const response = await fetch(`${config.apiUrl}/referral/codes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          ...newCode,
          maxUses: newCode.maxUses ? parseInt(newCode.maxUses) : undefined,
          expiresAt: newCode.expiresAt || undefined,
        }),
      });

      if (response.ok) {
        toast.success("Referral code created successfully!");
        setShowCreateDialog(false);
        setNewCode({
          type: "BOTH",
          commissionRate: 5,
          productId: "",
          maxUses: "",
          expiresAt: "",
        });
        fetchReferralData();
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to create referral code");
      }
    } catch (error) {
      toast.error("Failed to create referral code");
    } finally {
      setIsCreatingCode(false);
    }
  };

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${label} copied to clipboard!`);
    } catch (error) {
      toast.error("Failed to copy to clipboard");
    }
  };

  const getStatusBadge = (code: ReferralCode) => {
    if (!code.isActive) return <Badge variant="destructive">Inactive</Badge>;
    if (code.expiresAt && new Date(code.expiresAt) < new Date())
      return <Badge variant="destructive">Expired</Badge>;
    if (code.maxUses && code.currentUses >= code.maxUses)
      return <Badge variant="destructive">Limit Reached</Badge>;
    return <Badge variant="default">Active</Badge>;
  };

  if (isLoading) {
    return <DataLoading message="Loading referrals..." />;
  }

  return (
    <div className="space-y-6 p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Referral System</h1>
          <p className="text-muted-foreground mt-1">
            Create and manage your referral codes to earn commissions
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            onClick={() => setShowShareDialog(true)}
            variant="outline"
            className="w-full sm:w-auto"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share Links
          </Button>
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button className="w-full sm:w-auto">
                <Plus className="w-4 h-4 mr-2" />
                Create Code
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Referral Code</DialogTitle>
                <DialogDescription>
                  Create a new referral code to track your referrals and earn
                  commissions.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="type">Type</Label>
                  <Select
                    value={newCode.type}
                    onValueChange={(value: any) =>
                      setNewCode({ ...newCode, type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SIGNUP">Signup Only</SelectItem>
                      <SelectItem value="PRODUCT">Product Only</SelectItem>
                      <SelectItem value="BOTH">Both</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="commissionRate">Commission Rate (%)</Label>
                  <Input
                    id="commissionRate"
                    type="number"
                    min="0"
                    max="100"
                    value={newCode.commissionRate}
                    onChange={(e) =>
                      setNewCode({
                        ...newCode,
                        commissionRate: parseFloat(e.target.value),
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="maxUses">Max Uses (optional)</Label>
                  <Input
                    id="maxUses"
                    type="number"
                    min="1"
                    value={newCode.maxUses}
                    onChange={(e) =>
                      setNewCode({ ...newCode, maxUses: e.target.value })
                    }
                    placeholder="Leave empty for unlimited"
                  />
                </div>
                <div>
                  <Label htmlFor="expiresAt">Expires At (optional)</Label>
                  <Input
                    id="expiresAt"
                    type="datetime-local"
                    value={newCode.expiresAt}
                    onChange={(e) =>
                      setNewCode({ ...newCode, expiresAt: e.target.value })
                    }
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setShowCreateDialog(false)}
                >
                  Cancel
                </Button>
                <Button onClick={createReferralCode} disabled={isCreatingCode}>
                  {isCreatingCode ? "Creating..." : "Create Code"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Referrals
              </CardTitle>
              <Users className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {stats.totalReferrals}
              </div>
              <p className="text-xs text-muted-foreground">
                {stats.conversionRate.toFixed(1)}% conversion rate
              </p>
            </CardContent>
          </Card>
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Earnings
              </CardTitle>
              <DollarSign className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                ${stats.totalCommissions.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">
                ${stats.pendingCommissions.toFixed(2)} pending
              </p>
            </CardContent>
          </Card>
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Conversion Rate
              </CardTitle>
              <Target className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {stats.conversionRate.toFixed(1)}%
              </div>
              <p className="text-xs text-muted-foreground">Last 30 days</p>
            </CardContent>
          </Card>
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Codes
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {
                  referralCodes.filter(
                    (c) =>
                      c.isActive &&
                      (!c.expiresAt || new Date(c.expiresAt) > new Date())
                  ).length
                }
              </div>
              <p className="text-xs text-muted-foreground">
                {referralCodes.length} total codes
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Content */}
      <Tabs defaultValue="codes" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="codes">Referral Codes</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="codes" className="space-y-6">
          <div className="grid gap-6">
            {referralCodes.map((code) => (
              <Card
                key={code.id}
                className="shadow-sm hover:shadow-md transition-shadow"
              >
                <CardHeader className="pb-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <CardTitle className="text-lg text-gray-900">
                        {code.code}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        {code.type} • {code.commissionRate}% commission •{" "}
                        {code.currentUses} uses
                        {code.maxUses && ` / ${code.maxUses}`}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(code)}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          copyToClipboard(code.code, "Referral code")
                        }
                        className="px-3"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
                    <div className="space-y-1">
                      <p className="font-medium text-gray-700">Created</p>
                      <p className="text-muted-foreground">
                        {new Date(code.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="font-medium text-gray-700">Type</p>
                      <p className="text-muted-foreground">{code.type}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="font-medium text-gray-700">Commission</p>
                      <p className="text-muted-foreground">
                        {code.commissionRate}%
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="font-medium text-gray-700">Expires</p>
                      <p className="text-muted-foreground">
                        {code.expiresAt
                          ? new Date(code.expiresAt).toLocaleDateString()
                          : "Never"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          {stats?.topProducts && stats.topProducts.length > 0 && (
            <Card className="shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Top Products</CardTitle>
                <CardDescription>
                  Your best performing products by referrals
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-4">
                  {stats.topProducts.map((product, index) => (
                    <div
                      key={product.productId}
                      className="flex items-center justify-between p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">
                            {product.productName}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {product.referrals} referrals
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600 text-lg">
                          ${product.commissions.toFixed(2)}
                        </p>
                        <p className="text-sm text-muted-foreground">earned</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Share Links Dialog */}
      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Share Your Referral Links</DialogTitle>
            <DialogDescription>
              Copy and share these links across different platforms to start
              earning commissions.
            </DialogDescription>
          </DialogHeader>
          {shareableLinks && (
            <div className="space-y-4">
              <div>
                <Label>Your Referral Code</Label>
                <div className="flex gap-2">
                  <Input value={shareableLinks.referralCode} readOnly />
                  <Button
                    variant="outline"
                    onClick={() =>
                      copyToClipboard(
                        shareableLinks.referralCode,
                        "Referral code"
                      )
                    }
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(shareableLinks.links).map(([platform, url]) => (
                  <div key={platform} className="space-y-2">
                    <Label className="capitalize">{platform}</Label>
                    <div className="flex gap-2">
                      <Input value={url} readOnly className="text-xs" />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(url, `${platform} link`)}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <Label>QR Code</Label>
                <div className="flex gap-2">
                  <Input
                    value={shareableLinks.qrCode}
                    readOnly
                    className="text-xs"
                  />
                  <Button
                    variant="outline"
                    onClick={() =>
                      copyToClipboard(shareableLinks.qrCode, "QR code link")
                    }
                  >
                    <QrCode className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setShowShareDialog(false)}>Done</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
