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
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Copy,
  Download,
  ExternalLink,
  Link as LinkIcon,
  Image,
  FileText,
  Check,
  Plus,
  Eye,
  RefreshCw,
  Sparkles,
  Trash2,
  Power,
  PowerOff,
  BarChart3,
  X,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { config } from "@/config/config";

interface AffiliateLink {
  id: string;
  name: string;
  url: string;
  shortUrl: string;
  trackingCode: string;
  campaignName: string;
  clicks: number;
  conversions: number;
  earnings: number;
  status: string;
  category?: string;
  createdAt: Date;
}

interface MarketingAsset {
  id: string;
  name: string;
  category: string;
  size: string;
  format: string;
  fileSize: string;
  downloadUrl: string;
  previewUrl: string;
  downloads: number;
  createdAt: Date;
}

interface Coupon {
  id: string;
  code: string;
  description: string;
  discount: string;
  type: string;
  minPurchase?: string;
  validUntil: string;
  uses: number;
  maxUses: number;
  commission?: string;
  status: string;
  createdAt?: Date;
}

interface LinkStats {
  link: AffiliateLink;
  clicks: {
    id: string;
    referrer?: string;
    userAgent?: string;
    ipAddress?: string;
    createdAt: Date;
  }[];
  totalClicks: number;
  totalConversions: number;
  totalEarnings: number;
  conversionRate: number;
}

export default function LinksPage() {
  const [urlInput, setUrlInput] = useState("");
  const [campaignName, setCampaignName] = useState("");
  const [customAlias, setCustomAlias] = useState("");
  const [copiedLink, setCopiedLink] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [myLinks, setMyLinks] = useState<AffiliateLink[]>([]);
  const [marketingAssets, setMarketingAssets] = useState<MarketingAsset[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);

  // New state for modals and additional features
  const [selectedLinkStats, setSelectedLinkStats] = useState<LinkStats | null>(
    null
  );
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [showCouponGenerator, setShowCouponGenerator] = useState(false);
  const [loadingStats, setLoadingStats] = useState(false);

  // Coupon generator form state
  const [couponDescription, setCouponDescription] = useState("");
  const [couponDiscountType, setCouponDiscountType] = useState<
    "PERCENTAGE" | "FIXED"
  >("PERCENTAGE");
  const [couponDiscountValue, setCouponDiscountValue] = useState("");
  const [couponMinPurchase, setCouponMinPurchase] = useState("");
  const [couponMaxUsage, setCouponMaxUsage] = useState("");
  const [isGeneratingCoupon, setIsGeneratingCoupon] = useState(false);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setIsLoading(true);
    await Promise.all([fetchMyLinks(), fetchMarketingAssets(), fetchCoupons()]);
    setIsLoading(false);
  };

  const fetchMyLinks = async () => {
    try {
      console.log("Fetching links from:", `${config.apiUrl}/links/my-links`);

      const response = await fetch(`${config.apiUrl}/links/my-links`, {
        credentials: "include",
      });

      console.log("Links fetch response status:", response.status);

      if (response.ok) {
        const data = await response.json();
        console.log("Links data received:", data);
        console.log("Number of links:", data.links?.length || 0);
        console.log(
          "Link IDs received:",
          data.links?.map((link: any) => ({ id: link.id, name: link.name }))
        );
        setMyLinks(data.links || []);
      } else {
        const error = await response.json();
        console.error("Failed to fetch links:", error.error || response.status);
        console.error("Full error response:", error);

        // If authentication fails, show empty state
        if (response.status === 401) {
          console.log("Authentication failed - showing empty state");
          setMyLinks([]);
          toast.error("Please log in to view your links");
        } else {
          toast.error(error.error || "Failed to fetch links");
        }
      }
    } catch (error) {
      console.error("Error fetching links:", error);
      console.log("Network error - showing empty state");
      setMyLinks([]);
      toast.error("Failed to fetch links - check your connection");
    }
  };

  const fetchMarketingAssets = async () => {
    try {
      const response = await fetch(`${config.apiUrl}/links/assets/banners`, {
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setMarketingAssets(data.banners || []);
      } else {
        const error = await response.json();
        console.error(
          "Failed to fetch assets:",
          error.error || response.status
        );
      }
    } catch (error) {
      console.error("Error fetching assets:", error);
    }
  };

  const fetchCoupons = async () => {
    try {
      const response = await fetch(`${config.apiUrl}/links/coupons/available`, {
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setCoupons(data.coupons || []);
      } else {
        const error = await response.json();
        console.error(
          "Failed to fetch coupons:",
          error.error || response.status
        );
      }
    } catch (error) {
      console.error("Error fetching coupons:", error);
    }
  };

  const handleGenerateLink = async () => {
    if (!urlInput.trim()) {
      toast.error("Please enter a valid URL");
      return;
    }

    // Validate custom alias format if provided
    if (customAlias && !/^[a-zA-Z0-9-_]+$/.test(customAlias)) {
      toast.error(
        "Custom alias can only contain letters, numbers, hyphens, and underscores"
      );
      return;
    }

    if (customAlias && (customAlias.length < 3 || customAlias.length > 20)) {
      toast.error("Custom alias must be between 3 and 20 characters");
      return;
    }

    setIsGenerating(true);

    try {
      console.log("Generating link:", {
        url: urlInput,
        campaignName,
        customAlias,
      });
      console.log("API URL:", `${config.apiUrl}/links/generate`);

      const response = await fetch(`${config.apiUrl}/links/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          url: urlInput,
          campaignName: campaignName || undefined,
          customAlias: customAlias || undefined,
        }),
      });

      console.log("Generate link response status:", response.status);

      if (response.ok) {
        const data = await response.json();
        console.log("Link generated successfully:", data);
        console.log("Generated link ID:", data.link?.id);
        toast.success(data.message || "Affiliate link generated successfully!");
        setUrlInput("");
        setCampaignName("");
        setCustomAlias("");
        fetchMyLinks(); // Refresh links list
      } else {
        const error = await response.json();
        console.error("Error response:", error);
        console.error("Response status:", response.status);

        // Handle authentication errors
        if (response.status === 401) {
          toast.error("Please log in to generate affiliate links");
          return;
        }

        // Show specific error messages
        if (error.details && Array.isArray(error.details)) {
          // Zod validation errors
          const messages = error.details.map((d: any) => d.message).join(", ");
          toast.error(messages);
        } else {
          toast.error(error.error || "Failed to generate link");
        }
      }
    } catch (error) {
      console.error("Error generating link:", error);
      toast.error("Failed to generate affiliate link");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyLink = (link: string, linkId: string) => {
    navigator.clipboard.writeText(link);
    setCopiedLink(linkId);
    toast.success("Link copied to clipboard!");
    setTimeout(() => setCopiedLink(null), 2000);
  };

  const handleDownloadAsset = (asset: MarketingAsset) => {
    toast.success(`Downloading ${asset.name}...`);
    // In a real app, this would trigger a download
    window.open(asset.downloadUrl, "_blank");
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchAllData();
    setIsRefreshing(false);
    toast.success("Data refreshed successfully");
  };

  const handleDeleteLink = async (linkId: string, linkName: string) => {
    console.log(
      "Delete button clicked - Link ID:",
      linkId,
      "Link Name:",
      linkName
    );

    if (!confirm(`Are you sure you want to delete "${linkName}"?`)) {
      return;
    }

    try {
      console.log(
        "Sending DELETE request to:",
        `${config.apiUrl}/links/${linkId}`
      );
      const response = await fetch(`${config.apiUrl}/links/${linkId}`, {
        method: "DELETE",
        credentials: "include",
      });

      console.log("Delete response status:", response.status);

      if (response.ok) {
        toast.success("Link deleted successfully");
        fetchMyLinks(); // Refresh links list
      } else {
        const error = await response.json();
        console.error("Delete error response:", error);
        toast.error(error.error || "Failed to delete link");
      }
    } catch (error) {
      console.error("Error deleting link:", error);
      toast.error("Failed to delete link");
    }
  };

  const handleToggleLinkStatus = async (
    linkId: string,
    currentStatus: string
  ) => {
    console.log(
      "Toggle button clicked - Link ID:",
      linkId,
      "Current Status:",
      currentStatus
    );

    const isActive = currentStatus === "Active";
    const newStatus = !isActive;

    try {
      console.log(
        "Sending PATCH request to:",
        `${config.apiUrl}/links/${linkId}/status`
      );
      const response = await fetch(`${config.apiUrl}/links/${linkId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ isActive: newStatus }),
      });

      console.log("Toggle response status:", response.status);

      if (response.ok) {
        toast.success(
          `Link ${newStatus ? "activated" : "deactivated"} successfully`
        );
        fetchMyLinks(); // Refresh links list
      } else {
        const error = await response.json();
        console.error("Toggle error response:", error);
        toast.error(error.error || "Failed to update link status");
      }
    } catch (error) {
      console.error("Error updating link status:", error);
      toast.error("Failed to update link status");
    }
  };

  const handleViewLinkStats = async (linkId: string) => {
    console.log("View Stats button clicked - Link ID:", linkId);

    setLoadingStats(true);
    setShowStatsModal(true);

    try {
      console.log(
        "Sending GET request to:",
        `${config.apiUrl}/links/stats/${linkId}`
      );
      const response = await fetch(`${config.apiUrl}/links/stats/${linkId}`, {
        credentials: "include",
      });

      console.log("Stats response status:", response.status);

      if (response.ok) {
        const data = await response.json();
        console.log("Stats data received:", data);
        setSelectedLinkStats(data.stats);
      } else {
        const error = await response.json();
        console.error("Stats error response:", error);
        toast.error(error.error || "Failed to fetch link statistics");
        setShowStatsModal(false);
      }
    } catch (error) {
      console.error("Error fetching link stats:", error);
      toast.error("Failed to fetch link statistics");
      setShowStatsModal(false);
    } finally {
      setLoadingStats(false);
    }
  };

  const handleGenerateCoupon = async () => {
    if (!couponDescription.trim()) {
      toast.error("Please enter a coupon description");
      return;
    }

    if (!couponDiscountValue || parseFloat(couponDiscountValue) <= 0) {
      toast.error("Please enter a valid discount value");
      return;
    }

    setIsGeneratingCoupon(true);

    try {
      const response = await fetch(`${config.apiUrl}/links/coupons/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          description: couponDescription,
          discountType: couponDiscountType,
          discountValue: parseFloat(couponDiscountValue),
          minPurchase: couponMinPurchase
            ? parseFloat(couponMinPurchase)
            : undefined,
          maxUsage: couponMaxUsage ? parseInt(couponMaxUsage) : undefined,
          validDays: 90, // Default 90 days
        }),
      });

      if (response.ok) {
        const data = await response.json();
        toast.success(data.message || "Coupon generated successfully!");

        // Reset form
        setCouponDescription("");
        setCouponDiscountValue("");
        setCouponMinPurchase("");
        setCouponMaxUsage("");
        setShowCouponGenerator(false);

        // Refresh coupons list
        fetchCoupons();
      } else {
        const error = await response.json();

        if (error.details && Array.isArray(error.details)) {
          const messages = error.details.map((d: any) => d.message).join(", ");
          toast.error(messages);
        } else {
          toast.error(error.error || "Failed to generate coupon");
        }
      }
    } catch (error) {
      console.error("Error generating coupon:", error);
      toast.error("Failed to generate coupon");
    } finally {
      setIsGeneratingCoupon(false);
    }
  };

  const handleDeactivateCoupon = async (
    couponId: string,
    couponCode: string
  ) => {
    if (
      !confirm(`Are you sure you want to deactivate coupon "${couponCode}"?`)
    ) {
      return;
    }

    try {
      const response = await fetch(
        `${config.apiUrl}/links/coupons/${couponId}/deactivate`,
        {
          method: "PATCH",
          credentials: "include",
        }
      );

      if (response.ok) {
        toast.success("Coupon deactivated successfully");
        fetchCoupons(); // Refresh coupons list
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to deactivate coupon");
      }
    } catch (error) {
      console.error("Error deactivating coupon:", error);
      toast.error("Failed to deactivate coupon");
    }
  };

  if (isLoading) {
    return <DataLoading message="Loading links and assets..." />;
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Links & Assets</h1>
          <p className="text-muted-foreground">
            Generate affiliate links and access marketing materials
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="w-full sm:w-auto"
          >
            <RefreshCw
              className={`w-4 h-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`}
            />
            {isRefreshing ? "Refreshing..." : "Refresh"}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="generator" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="generator">URL Generator</TabsTrigger>
          <TabsTrigger value="assets">Marketing Assets</TabsTrigger>
          <TabsTrigger value="coupons">Coupon Codes</TabsTrigger>
        </TabsList>

        {/* URL Generator Tab */}
        <TabsContent value="generator" className="space-y-6">
          {/* Link Generator Form */}
          <Card>
            <CardHeader>
              <CardTitle>Generate Affiliate Link</CardTitle>
              <CardDescription>
                Convert any URL into a trackable affiliate link
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="url">Destination URL *</Label>
                  <Input
                    id="url"
                    placeholder="https://example.com/product"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="campaign">Campaign Name (Optional)</Label>
                  <Input
                    id="campaign"
                    placeholder="Summer Sale 2024"
                    value={campaignName}
                    onChange={(e) => setCampaignName(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="alias">Custom Alias (Optional)</Label>
                <Input
                  id="alias"
                  placeholder="summer-sale"
                  value={customAlias}
                  onChange={(e) => setCustomAlias(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  3-20 characters, letters, numbers, hyphens and underscores
                  only
                </p>
              </div>
              <Button
                onClick={handleGenerateLink}
                disabled={isGenerating}
                className="w-full md:w-auto"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                {isGenerating ? "Generating..." : "Generate Affiliate Link"}
              </Button>
            </CardContent>
          </Card>

          {/* Generated Links List */}
          <Card>
            <CardHeader>
              <CardTitle>Your Generated Links</CardTitle>
              <CardDescription>
                {myLinks.length} active affiliate links
              </CardDescription>
            </CardHeader>
            <CardContent>
              {myLinks.length === 0 ? (
                <div className="text-center py-8">
                  <LinkIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Links Yet</h3>
                  <p className="text-muted-foreground">
                    Generate your first affiliate link to start earning
                    commissions
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {myLinks.map((link) => (
                    <div
                      key={link.id}
                      className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{link.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {link.campaignName}
                          </p>
                        </div>
                        <Badge
                          variant={
                            link.status === "Active" ? "default" : "secondary"
                          }
                        >
                          {link.status}
                        </Badge>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Input
                            value={link.url}
                            readOnly
                            className="flex-1 text-sm"
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCopyLink(link.url, link.id)}
                          >
                            {copiedLink === link.id ? (
                              <Check className="w-4 h-4" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </Button>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Input
                            value={link.shortUrl}
                            readOnly
                            className="flex-1 text-sm"
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              handleCopyLink(link.shortUrl, `short-${link.id}`)
                            }
                          >
                            {copiedLink === `short-${link.id}` ? (
                              <Check className="w-4 h-4" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t">
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Clicks
                          </p>
                          <p className="text-lg font-semibold">{link.clicks}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Conversions
                          </p>
                          <p className="text-lg font-semibold">
                            {link.conversions}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Earnings
                          </p>
                          <p className="text-lg font-semibold text-green-600">
                            ${link.earnings.toFixed(2)}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewLinkStats(link.id)}
                          className="flex-1"
                        >
                          <BarChart3 className="w-4 h-4 mr-2" />
                          View Stats
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handleToggleLinkStatus(link.id, link.status)
                          }
                          className="flex-1"
                        >
                          {link.status === "Active" ? (
                            <>
                              <PowerOff className="w-4 h-4 mr-2" />
                              Deactivate
                            </>
                          ) : (
                            <>
                              <Power className="w-4 h-4 mr-2" />
                              Activate
                            </>
                          )}
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteLink(link.id, link.name)}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Marketing Assets Tab */}
        <TabsContent value="assets" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Marketing Assets</CardTitle>
              <CardDescription>
                Download banners, logos, and promotional materials
              </CardDescription>
            </CardHeader>
            <CardContent>
              {marketingAssets.length === 0 ? (
                <div className="text-center py-8">
                  <Image className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    No Assets Available
                  </h3>
                  <p className="text-muted-foreground">
                    Marketing assets will be available soon
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {marketingAssets.map((asset) => (
                    <div
                      key={asset.id}
                      className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                    >
                      <div className="aspect-video bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                        <Image className="w-12 h-12 text-blue-600" />
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold mb-2">{asset.name}</h3>
                        <div className="flex flex-wrap gap-2 mb-3">
                          <Badge variant="outline">{asset.category}</Badge>
                          <Badge variant="outline">{asset.size}</Badge>
                          <Badge variant="outline">{asset.format}</Badge>
                        </div>
                        <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                          <span>{asset.fileSize}</span>
                          <span>{asset.downloads} downloads</span>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={() => handleDownloadAsset(asset)}
                          >
                            <Download className="w-4 h-4 mr-1" />
                            Download
                          </Button>
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Coupon Codes Tab */}
        <TabsContent value="coupons" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle>Available Coupon Codes</CardTitle>
                  <CardDescription>
                    Share these discount codes to boost conversions
                  </CardDescription>
                </div>
                <Button onClick={() => setShowCouponGenerator(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Generate Coupon
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {coupons.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    No Coupons Available
                  </h3>
                  <p className="text-muted-foreground">
                    Coupon codes will be available soon
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {coupons.map((coupon) => (
                    <div
                      key={coupon.id}
                      className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-semibold text-lg font-mono">
                              {coupon.code}
                            </h3>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                handleCopyLink(coupon.code, coupon.id)
                              }
                            >
                              {copiedLink === coupon.id ? (
                                <Check className="w-4 h-4 text-green-600" />
                              ) : (
                                <Copy className="w-4 h-4" />
                              )}
                            </Button>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {coupon.description}
                          </p>
                        </div>
                        <Badge
                          variant={
                            coupon.status === "Active" ? "default" : "secondary"
                          }
                        >
                          {coupon.status}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-3 border-t">
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Discount
                          </p>
                          <p className="font-semibold text-green-600">
                            {coupon.discount}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Usage</p>
                          <p className="font-semibold">
                            {coupon.uses}/{coupon.maxUses}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Valid Until
                          </p>
                          <p className="font-semibold">{coupon.validUntil}</p>
                        </div>
                      </div>

                      {coupon.status === "ACTIVE" && (
                        <div className="mt-4 pt-4 border-t">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              handleDeactivateCoupon(coupon.id, coupon.code)
                            }
                          >
                            <PowerOff className="w-4 h-4 mr-2" />
                            Deactivate Coupon
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Link Stats Modal */}
      {showStatsModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="text-2xl font-bold">Link Statistics</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowStatsModal(false);
                  setSelectedLinkStats(null);
                }}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-88px)]">
              {loadingStats ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                </div>
              ) : selectedLinkStats ? (
                <div className="space-y-6">
                  {/* Stats Overview */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card>
                      <CardContent className="pt-6">
                        <p className="text-sm text-muted-foreground">
                          Total Clicks
                        </p>
                        <p className="text-2xl font-bold">
                          {selectedLinkStats.totalClicks}
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6">
                        <p className="text-sm text-muted-foreground">
                          Conversions
                        </p>
                        <p className="text-2xl font-bold">
                          {selectedLinkStats.totalConversions}
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6">
                        <p className="text-sm text-muted-foreground">
                          Earnings
                        </p>
                        <p className="text-2xl font-bold text-green-600">
                          ${selectedLinkStats.totalEarnings.toFixed(2)}
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6">
                        <p className="text-sm text-muted-foreground">
                          Conversion Rate
                        </p>
                        <p className="text-2xl font-bold">
                          {selectedLinkStats.conversionRate.toFixed(2)}%
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Recent Clicks */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">
                      Recent Clicks
                    </h3>
                    {selectedLinkStats.clicks.length === 0 ? (
                      <p className="text-muted-foreground text-center py-8">
                        No clicks yet
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {selectedLinkStats.clicks.slice(0, 10).map((click) => (
                          <div
                            key={click.id}
                            className="p-3 border rounded-lg text-sm"
                          >
                            <div className="flex justify-between items-start gap-4">
                              <div className="flex-1 space-y-1">
                                <p className="font-medium">
                                  {click.referrer || "Direct"}
                                </p>
                                <p className="text-muted-foreground truncate">
                                  {click.userAgent?.substring(0, 60) ||
                                    "Unknown device"}
                                </p>
                              </div>
                              <div className="text-right text-muted-foreground">
                                <p>
                                  {new Date(
                                    click.createdAt
                                  ).toLocaleDateString()}
                                </p>
                                <p className="text-xs">
                                  {new Date(
                                    click.createdAt
                                  ).toLocaleTimeString()}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}

      {/* Coupon Generator Modal */}
      {showCouponGenerator && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full">
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="text-2xl font-bold">Generate Custom Coupon</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowCouponGenerator(false);
                  setCouponDescription("");
                  setCouponDiscountValue("");
                  setCouponMinPurchase("");
                  setCouponMaxUsage("");
                }}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <Label htmlFor="coupon-description">Description *</Label>
                <Input
                  id="coupon-description"
                  placeholder="e.g., 20% off on all products"
                  value={couponDescription}
                  onChange={(e) => setCouponDescription(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="discount-type">Discount Type *</Label>
                  <select
                    id="discount-type"
                    value={couponDiscountType}
                    onChange={(e) =>
                      setCouponDiscountType(
                        e.target.value as "PERCENTAGE" | "FIXED"
                      )
                    }
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    <option value="PERCENTAGE">Percentage (%)</option>
                    <option value="FIXED">Fixed Amount ($)</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="discount-value">Discount Value *</Label>
                  <Input
                    id="discount-value"
                    type="number"
                    placeholder={
                      couponDiscountType === "PERCENTAGE" ? "20" : "10"
                    }
                    value={couponDiscountValue}
                    onChange={(e) => setCouponDiscountValue(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="min-purchase">
                    Minimum Purchase (optional)
                  </Label>
                  <Input
                    id="min-purchase"
                    type="number"
                    placeholder="50"
                    value={couponMinPurchase}
                    onChange={(e) => setCouponMinPurchase(e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="max-usage">Maximum Uses (optional)</Label>
                  <Input
                    id="max-usage"
                    type="number"
                    placeholder="100"
                    value={couponMaxUsage}
                    onChange={(e) => setCouponMaxUsage(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleGenerateCoupon}
                  disabled={isGeneratingCoupon}
                  className="flex-1"
                >
                  {isGeneratingCoupon ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Generate Coupon
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowCouponGenerator(false);
                    setCouponDescription("");
                    setCouponDiscountValue("");
                    setCouponMinPurchase("");
                    setCouponMaxUsage("");
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
