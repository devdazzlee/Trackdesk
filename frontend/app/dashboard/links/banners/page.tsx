"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  Download, 
  ExternalLink, 
  Image, 
  Copy,
  Check,
  Eye,
  Search,
  Filter,
  Grid,
  List
} from "lucide-react"
import { toast } from "sonner"

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
    affiliateUrl: "https://affiliate.example.com/ref/abc123/premium-plan",
    description: "Standard leaderboard banner for premium plan promotion",
    tags: ["premium", "banner", "728x90"]
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
    affiliateUrl: "https://affiliate.example.com/ref/abc123/premium-plan",
    description: "Instagram and Facebook post template with premium branding",
    tags: ["social", "instagram", "facebook", "square"]
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
    affiliateUrl: "https://affiliate.example.com/ref/abc123",
    description: "Professional email signature with affiliate link",
    tags: ["email", "signature", "professional"]
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
    affiliateUrl: "https://affiliate.example.com/ref/abc123",
    description: "High-resolution logo with white background",
    tags: ["logo", "white", "high-res"]
  },
  {
    id: "ASSET-005",
    name: "Basic Plan Banner - 300x250",
    type: "Banner",
    size: "300x250",
    format: "PNG",
    category: "Banners",
    url: "/assets/banners/basic-300x250.png",
    downloadUrl: "/download/banners/basic-300x250.png",
    affiliateUrl: "https://affiliate.example.com/ref/abc123/basic-plan",
    description: "Medium rectangle banner for basic plan",
    tags: ["basic", "banner", "300x250"]
  },
  {
    id: "ASSET-006",
    name: "YouTube Thumbnail Template",
    type: "Social Media",
    size: "1280x720",
    format: "PNG",
    category: "Social Media",
    url: "/assets/social/youtube-thumbnail.png",
    downloadUrl: "/download/social/youtube-thumbnail.png",
    affiliateUrl: "https://affiliate.example.com/ref/abc123",
    description: "YouTube video thumbnail template",
    tags: ["youtube", "thumbnail", "video"]
  },
]

export default function BannersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [copiedLink, setCopiedLink] = useState<string | null>(null)

  const categories = ["all", "Banners", "Social Media", "Email Marketing", "Logos"]
  
  const filteredAssets = marketingAssets.filter(asset => {
    const matchesSearch = asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         asset.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         asset.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = selectedCategory === "all" || asset.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleDownloadAsset = (asset: any) => {
    toast.success(`Downloading ${asset.name}...`)
    // Simulate download
    console.log("Downloading:", asset.downloadUrl)
  }

  const handleCopyLink = (link: string, assetId: string) => {
    navigator.clipboard.writeText(link)
    setCopiedLink(assetId)
    toast.success("Link copied to clipboard!")
    setTimeout(() => setCopiedLink(null), 2000)
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Banners & Logos</h1>
          <p className="text-slate-600">Download marketing materials and promotional assets</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("grid")}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("list")}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search assets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3 py-2 border border-slate-300 rounded-md text-sm"
        >
          {categories.map(category => (
            <option key={category} value={category}>
              {category === "all" ? "All Categories" : category}
            </option>
          ))}
        </select>
      </div>

      {/* Assets Grid/List */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAssets.map((asset) => (
            <Card key={asset.id} className="hover:shadow-lg transition-shadow">
              <div className="aspect-video bg-slate-100 rounded-t-lg flex items-center justify-center">
                {asset.type === "Banner" ? (
                  <Image className="h-8 w-8 text-slate-400" />
                ) : asset.type === "Logo" ? (
                  <ExternalLink className="h-8 w-8 text-slate-400" />
                ) : (
                  <Image className="h-8 w-8 text-slate-400" />
                )}
              </div>
              
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div>
                    <h3 className="font-medium text-sm">{asset.name}</h3>
                    <p className="text-xs text-slate-500">{asset.size} • {asset.format}</p>
                    <Badge variant="outline" className="text-xs mt-1">
                      {asset.category}
                    </Badge>
                  </div>
                  
                  <p className="text-xs text-slate-600 line-clamp-2">
                    {asset.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-1">
                    {asset.tags.slice(0, 3).map(tag => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
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
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAssets.map((asset) => (
            <Card key={asset.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-slate-100 rounded-lg flex items-center justify-center">
                    {asset.type === "Banner" ? (
                      <Image className="h-6 w-6 text-slate-400" />
                    ) : asset.type === "Logo" ? (
                      <ExternalLink className="h-6 w-6 text-slate-400" />
                    ) : (
                      <Image className="h-6 w-6 text-slate-400" />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-medium">{asset.name}</h3>
                      <Badge variant="outline" className="text-xs">
                        {asset.category}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-600 mb-2">{asset.description}</p>
                    <div className="flex items-center space-x-4 text-xs text-slate-500">
                      <span>{asset.size}</span>
                      <span>{asset.format}</span>
                      <div className="flex space-x-1">
                        {asset.tags.slice(0, 3).map(tag => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDownloadAsset(asset)}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => window.open(asset.url, '_blank')}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-blue-600">{marketingAssets.length}</div>
            <div className="text-sm text-slate-500">Total Assets</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-green-600">3</div>
            <div className="text-sm text-slate-500">Banner Sizes</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-purple-600">4</div>
            <div className="text-sm text-slate-500">Categories</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-orange-600">2</div>
            <div className="text-sm text-slate-500">Formats</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


