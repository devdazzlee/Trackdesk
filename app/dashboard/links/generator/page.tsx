"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Copy, 
  Download, 
  ExternalLink, 
  Link as LinkIcon, 
  Check,
  Plus,
  Eye,
  BarChart3,
  Calendar
} from "lucide-react"
import { toast } from "sonner"

// Mock data for generated links
const generatedLinksData = [
  {
    id: "LINK-001",
    originalUrl: "https://example.com/premium-plan",
    affiliateUrl: "https://affiliate.example.com/ref/abc123/premium-plan",
    shortUrl: "https://aff.link/abc123",
    clicks: 45,
    conversions: 8,
    earnings: 240.00,
    createdAt: "2024-01-07",
    status: "active",
    offer: "Premium Plan"
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
    status: "active",
    offer: "Basic Plan"
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
    status: "active",
    offer: "Enterprise"
  },
]

export default function URLGeneratorPage() {
  const [urlInput, setUrlInput] = useState("")
  const [selectedOffer, setSelectedOffer] = useState("")
  const [copiedLink, setCopiedLink] = useState<string | null>(null)
  const [showGenerator, setShowGenerator] = useState(false)
  const [generatedLinks, setGeneratedLinks] = useState(generatedLinksData)

  const handleGenerateLink = () => {
    if (!urlInput.trim()) {
      toast.error("Please enter a valid URL")
      return
    }
    
    // Generate new affiliate link
    const affiliateUrl = `https://affiliate.example.com/ref/abc123${urlInput.replace('https://example.com', '')}`
    const shortUrl = `https://aff.link/${Math.random().toString(36).substr(2, 6)}`
    
    const newLink = {
      id: `LINK-${Date.now()}`,
      originalUrl: urlInput,
      affiliateUrl,
      shortUrl,
      clicks: 0,
      conversions: 0,
      createdAt: new Date().toISOString().split('T')[0],
      offer: selectedOffer || "Custom Link"
    }
    
    setGeneratedLinks(prev => [newLink, ...prev])
    setUrlInput("")
    setSelectedOffer("")
    
    toast.success("Affiliate link generated successfully!")
  }

  const handleCopyLink = (link: string, linkId: string) => {
    navigator.clipboard.writeText(link)
    setCopiedLink(linkId)
    toast.success("Link copied to clipboard!")
    setTimeout(() => setCopiedLink(null), 2000)
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">URL Generator</h1>
          <p className="text-slate-600">Create and manage your affiliate links</p>
        </div>
        <Button onClick={() => setShowGenerator(!showGenerator)}>
          <Plus className="h-4 w-4 mr-2" />
          Generate New Link
        </Button>
      </div>

      {/* Link Generator Form */}
      {showGenerator && (
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
      )}

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
                    <Badge variant="outline">{link.offer}</Badge>
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

      {/* Link Performance Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Links</CardTitle>
            <LinkIcon className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-slate-500">
              Active affiliate links
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
            <BarChart3 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,247</div>
            <p className="text-xs text-green-600">
              +12.5% this month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <Calendar className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7.25%</div>
            <p className="text-xs text-green-600">
              +0.8% this month
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
