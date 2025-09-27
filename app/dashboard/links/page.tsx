"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Copy, 
  Download, 
  ExternalLink, 
  Link as LinkIcon, 
  Image, 
  FileText,
  Check,
  Plus,
  Eye
} from "lucide-react"
import { toast } from "sonner"

// Mock data for generated links
const generatedLinks = [
  {
    id: "LINK-001",
    originalUrl: "https://example.com/premium-plan",
    affiliateUrl: "https://affiliate.example.com/ref/abc123/premium-plan",
    shortUrl: "https://aff.link/abc123",
    clicks: 45,
    conversions: 8,
    earnings: 240.00,
    createdAt: "2024-01-07",
    status: "active"
  },
  {
    id: "LINK-002",
    originalUrl: "https://example.com/basic-plan",
    affiliateUrl: "https://affiliate.example.com/ref/abc123/basic-plan",
    shortUrl: "https://aff.link/def456",
    clicks: 32,
    conversions: 5,
    earnings: 75.00,
    createdAt: "2024-01-06",
    status: "active"
  },
  {
    id: "LINK-003",
    originalUrl: "https://example.com/enterprise",
    affiliateUrl: "https://affiliate.example.com/ref/abc123/enterprise",
    shortUrl: "https://aff.link/ghi789",
    clicks: 18,
    conversions: 3,
    earnings: 900.00,
    createdAt: "2024-01-05",
    status: "active"
  },
]

// Mock data for marketing assets
const marketingAssets = [
  {
    id: "ASSET-001",
    name: "Premium Plan Banner - 728x90",
    type: "Banner",
    size: "728x90",
    format: "PNG",
    category: "Banners",
    url: "/assets/banners/premium-728x90.png",
    downloadUrl: "/download/banners/premium-728x90.png",
    affiliateUrl: "https://affiliate.example.com/ref/abc123/premium-plan"
  },
  {
    id: "ASSET-002",
    name: "Social Media Post Template",
    type: "Social Media",
    size: "1080x1080",
    format: "JPG",
    category: "Social Media",
    url: "/assets/social/premium-post.jpg",
    downloadUrl: "/download/social/premium-post.jpg",
    affiliateUrl: "https://affiliate.example.com/ref/abc123/premium-plan"
  },
  {
    id: "ASSET-003",
    name: "Email Signature Template",
    type: "Email",
    size: "600x200",
    format: "PNG",
    category: "Email Marketing",
    url: "/assets/email/signature.png",
    downloadUrl: "/download/email/signature.png",
    affiliateUrl: "https://affiliate.example.com/ref/abc123"
  },
  {
    id: "ASSET-004",
    name: "Product Logo - White Background",
    type: "Logo",
    size: "500x500",
    format: "PNG",
    category: "Logos",
    url: "/assets/logos/logo-white.png",
    downloadUrl: "/download/logos/logo-white.png",
    affiliateUrl: "https://affiliate.example.com/ref/abc123"
  },
]

// Mock data for coupon codes
const couponCodes = [
  {
    id: "COUPON-001",
    code: "AFFILIATE20",
    description: "20% off for new customers",
    discount: "20%",
    validUntil: "2024-12-31",
    usage: 45,
    maxUsage: 100,
    status: "active"
  },
  {
    id: "COUPON-002",
    code: "WELCOME10",
    description: "$10 off first purchase",
    discount: "$10",
    validUntil: "2024-06-30",
    usage: 23,
    maxUsage: 50,
    status: "active"
  },
  {
    id: "COUPON-003",
    code: "PREMIUM50",
    description: "50% off premium plans",
    discount: "50%",
    validUntil: "2024-03-31",
    usage: 12,
    maxUsage: 25,
    status: "active"
  },
]

export default function LinksPage() {
  const [urlInput, setUrlInput] = useState("")
  const [selectedOffer, setSelectedOffer] = useState("")
  const [copiedLink, setCopiedLink] = useState<string | null>(null)

  const handleGenerateLink = () => {
    if (!urlInput.trim()) {
      toast.error("Please enter a valid URL")
      return
    }
    
    // Simulate link generation
    const affiliateUrl = `https://affiliate.example.com/ref/abc123${urlInput.replace('https://example.com', '')}`
    const shortUrl = `https://aff.link/${Math.random().toString(36).substr(2, 6)}`
    
    toast.success("Affiliate link generated successfully!")
    console.log("Generated:", { originalUrl: urlInput, affiliateUrl, shortUrl })
  }

  const handleCopyLink = (link: string, linkId: string) => {
    navigator.clipboard.writeText(link)
    setCopiedLink(linkId)
    toast.success("Link copied to clipboard!")
    setTimeout(() => setCopiedLink(null), 2000)
  }

  const handleDownloadAsset = (asset: any) => {
    toast.success(`Downloading ${asset.name}...`)
    // Simulate download
    console.log("Downloading:", asset.downloadUrl)
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Links & Assets</h1>
          <p className="text-slate-600">Generate affiliate links and access marketing materials</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Generate New Link
        </Button>
      </div>

      <Tabs defaultValue="generator" className="space-y-6">
        <TabsList>
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
                Paste any product URL to create your unique affiliate link
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="url">Product URL</Label>
                <Input
                  id="url"
                  placeholder="https://example.com/product"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="offer">Target Offer (Optional)</Label>
                <Select value={selectedOffer} onValueChange={setSelectedOffer}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an offer" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="premium">Premium Plan</SelectItem>
                    <SelectItem value="basic">Basic Plan</SelectItem>
                    <SelectItem value="enterprise">Enterprise</SelectItem>
                    <SelectItem value="starter">Starter</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={handleGenerateLink} className="w-full">
                <LinkIcon className="h-4 w-4 mr-2" />
                Generate Affiliate Link
              </Button>
            </CardContent>
          </Card>

          {/* Generated Links */}
          <Card>
            <CardHeader>
              <CardTitle>Your Generated Links</CardTitle>
              <CardDescription>
                Track performance of your affiliate links
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {generatedLinks.map((link) => (
                  <div key={link.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">{link.id}</Badge>
                        <Badge variant={link.status === "active" ? "default" : "secondary"}>
                          {link.status}
                        </Badge>
                      </div>
                      <div className="text-sm text-slate-500">
                        Created: {link.createdAt}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div>
                        <Label className="text-xs text-slate-500">Original URL</Label>
                        <p className="text-sm font-mono bg-slate-50 p-2 rounded">
                          {link.originalUrl}
                        </p>
                      </div>
                      
                      <div>
                        <Label className="text-xs text-slate-500">Affiliate URL</Label>
                        <div className="flex items-center space-x-2">
                          <p className="text-sm font-mono bg-blue-50 p-2 rounded flex-1">
                            {link.affiliateUrl}
                          </p>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleCopyLink(link.affiliateUrl, link.id)}
                          >
                            {copiedLink === link.id ? (
                              <Check className="h-4 w-4" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                      
                      <div>
                        <Label className="text-xs text-slate-500">Short URL</Label>
                        <div className="flex items-center space-x-2">
                          <p className="text-sm font-mono bg-green-50 p-2 rounded flex-1">
                            {link.shortUrl}
                          </p>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleCopyLink(link.shortUrl, link.id + "-short")}
                          >
                            {copiedLink === link.id + "-short" ? (
                              <Check className="h-4 w-4" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 pt-2 border-t">
                      <div className="text-center">
                        <div className="text-lg font-semibold text-blue-600">{link.clicks}</div>
                        <div className="text-xs text-slate-500">Clicks</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold text-green-600">{link.conversions}</div>
                        <div className="text-xs text-slate-500">Conversions</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold text-emerald-600">${link.earnings}</div>
                        <div className="text-xs text-slate-500">Earnings</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Marketing Assets Tab */}
        <TabsContent value="assets" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Marketing Assets</CardTitle>
              <CardDescription>
                Download banners, logos, and other marketing materials
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {marketingAssets.map((asset) => (
                  <div key={asset.id} className="border rounded-lg p-4 space-y-3">
                    <div className="aspect-video bg-slate-100 rounded-lg flex items-center justify-center">
                      {asset.type === "Banner" ? (
                        <Image className="h-8 w-8 text-slate-400" />
                      ) : asset.type === "Logo" ? (
                        <FileText className="h-8 w-8 text-slate-400" />
                      ) : (
                        <ExternalLink className="h-8 w-8 text-slate-400" />
                      )}
                    </div>
                    
                    <div>
                      <h3 className="font-medium text-sm">{asset.name}</h3>
                      <p className="text-xs text-slate-500">{asset.size} • {asset.format}</p>
                      <Badge variant="outline" className="text-xs mt-1">
                        {asset.category}
                      </Badge>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                        onClick={() => handleDownloadAsset(asset)}
                      >
                        <Download className="h-3 w-3 mr-1" />
                        Download
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.open(asset.url, '_blank')}
                      >
                        <Eye className="h-3 w-3" />
                      </Button>
                    </div>
                    
                    <div className="pt-2 border-t">
                      <Label className="text-xs text-slate-500">Affiliate URL</Label>
                      <div className="flex items-center space-x-1 mt-1">
                        <p className="text-xs font-mono bg-slate-50 p-1 rounded flex-1 truncate">
                          {asset.affiliateUrl}
                        </p>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 w-6 p-0"
                          onClick={() => handleCopyLink(asset.affiliateUrl, asset.id)}
                        >
                          {copiedLink === asset.id ? (
                            <Check className="h-3 w-3" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Coupon Codes Tab */}
        <TabsContent value="coupons" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Coupon Codes</CardTitle>
              <CardDescription>
                Use these exclusive coupon codes to boost conversions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {couponCodes.map((coupon) => (
                  <div key={coupon.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Badge variant="outline" className="font-mono">
                          {coupon.code}
                        </Badge>
                        <Badge 
                          variant={coupon.status === "active" ? "default" : "secondary"}
                        >
                          {coupon.status}
                        </Badge>
                      </div>
                      <div className="text-sm text-slate-500">
                        Valid until: {coupon.validUntil}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-medium">{coupon.description}</h3>
                      <p className="text-sm text-slate-600">
                        Discount: <span className="font-semibold text-green-600">{coupon.discount}</span>
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-slate-500">
                        Usage: {coupon.usage}/{coupon.maxUsage}
                      </div>
                      <div className="w-24 bg-slate-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${(coupon.usage / coupon.maxUsage) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleCopyLink(coupon.code, coupon.id)}
                      className="w-full"
                    >
                      {copiedLink === coupon.id ? (
                        <>
                          <Check className="h-4 w-4 mr-2" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4 mr-2" />
                          Copy Code
                        </>
                      )}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
