"use client";

import { useState, useEffect } from "react";
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
  minPurchase: string;
  validUntil: string;
  uses: number;
  maxUses: number;
  commission: string;
  status: string;
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
      const response = await fetch(`${config.apiUrl}/links/my-links`, {
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setMyLinks(data.links || []);
      } else {
        console.error("Failed to fetch links:", response.status);
      }
    } catch (error) {
      console.error("Error fetching links:", error);
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
        console.error("Failed to fetch assets:", response.status);
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
        console.error("Failed to fetch coupons:", response.status);
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

    setIsGenerating(true);

    try {
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

      if (response.ok) {
        const data = await response.json();
        toast.success("Affiliate link generated successfully!");
        setUrlInput("");
        setCampaignName("");
        setCustomAlias("");
        fetchMyLinks(); // Refresh links list
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to generate link");
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
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
              <CardTitle>Available Coupon Codes</CardTitle>
              <CardDescription>
                Share these discount codes to boost conversions
              </CardDescription>
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

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-3 border-t">
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Discount
                          </p>
                          <p className="font-semibold text-green-600">
                            {coupon.discount}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Commission
                          </p>
                          <p className="font-semibold text-blue-600">
                            {coupon.commission}
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
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
