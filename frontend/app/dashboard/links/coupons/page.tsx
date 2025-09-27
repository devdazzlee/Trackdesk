"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  Copy, 
  Check,
  Plus,
  Calendar,
  Percent,
  DollarSign,
  Users,
  TrendingUp
} from "lucide-react"
import { toast } from "sonner"

// Mock data for coupon codes
const couponCodes = [
  {
    id: "COUPON-001",
    code: "AFFILIATE20",
    description: "20% off for new customers",
    discount: "20%",
    discountType: "percentage",
    validUntil: "2024-12-31",
    usage: 45,
    maxUsage: 100,
    status: "active",
    createdAt: "2024-01-01",
    revenue: 1250.00
  },
  {
    id: "COUPON-002",
    code: "WELCOME10",
    description: "$10 off first purchase",
    discount: "$10",
    discountType: "fixed",
    validUntil: "2024-06-30",
    usage: 23,
    maxUsage: 50,
    status: "active",
    createdAt: "2024-01-01",
    revenue: 690.00
  },
  {
    id: "COUPON-003",
    code: "PREMIUM50",
    description: "50% off premium plans",
    discount: "50%",
    discountType: "percentage",
    validUntil: "2024-03-31",
    usage: 12,
    maxUsage: 25,
    status: "active",
    createdAt: "2024-01-01",
    revenue: 1800.00
  },
  {
    id: "COUPON-004",
    code: "STARTER15",
    description: "15% off starter plans",
    discount: "15%",
    discountType: "percentage",
    validUntil: "2024-04-30",
    usage: 8,
    maxUsage: 30,
    status: "active",
    createdAt: "2024-01-01",
    revenue: 240.00
  },
  {
    id: "COUPON-005",
    code: "SUMMER25",
    description: "25% off summer promotion",
    discount: "25%",
    discountType: "percentage",
    validUntil: "2024-02-29",
    usage: 35,
    maxUsage: 75,
    status: "expired",
    createdAt: "2024-01-01",
    revenue: 875.00
  },
]

export default function CouponsPage() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [coupons, setCoupons] = useState(couponCodes)
  const [newCoupon, setNewCoupon] = useState({
    code: "",
    description: "",
    discount: "",
    discountType: "percentage",
    validUntil: "",
    maxUsage: ""
  })

  const filteredCoupons = couponCodes.filter(coupon =>
    coupon.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    coupon.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleCopyCode = (code: string, couponId: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(couponId)
    toast.success("Coupon code copied to clipboard!")
    setTimeout(() => setCopiedCode(null), 2000)
  }

  const handleCreateCoupon = () => {
    if (!newCoupon.code || !newCoupon.description || !newCoupon.discount) {
      toast.error("Please fill in all required fields")
      return
    }
    
    const coupon = {
      ...newCoupon,
      id: `COUPON-${Date.now()}`,
      status: "active",
      usage: 0,
      maxUsage: parseInt(newCoupon.maxUsage) || 0,
      revenue: 0,
      createdAt: new Date().toISOString().split('T')[0]
    }
    
    setCoupons(prev => [coupon, ...prev])
    setShowCreateForm(false)
    toast.success("Coupon created successfully!")
    
    // Reset form
    setNewCoupon({
      code: "",
      description: "",
      discount: "",
      discountType: "percentage",
      validUntil: "",
      maxUsage: ""
    })
    setShowCreateForm(false)
  }

  const activeCoupons = couponCodes.filter(c => c.status === "active")
  const totalUsage = couponCodes.reduce((sum, c) => sum + c.usage, 0)
  const totalRevenue = couponCodes.reduce((sum, c) => sum + c.revenue, 0)

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Coupon Codes</h1>
          <p className="text-slate-600">Manage and track your promotional coupon codes</p>
        </div>
        <Button onClick={() => setShowCreateForm(!showCreateForm)}>
          <Plus className="h-4 w-4 mr-2" />
          Create New Coupon
        </Button>
      </div>

      {/* Create Coupon Form */}
      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Coupon</CardTitle>
            <CardDescription>
              Create a new promotional coupon code for your affiliates
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="code">Coupon Code *</Label>
                <Input
                  id="code"
                  value={newCoupon.code}
                  onChange={(e) => setNewCoupon(prev => ({ ...prev, code: e.target.value }))}
                  placeholder="e.g., AFFILIATE20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="discount">Discount *</Label>
                <Input
                  id="discount"
                  value={newCoupon.discount}
                  onChange={(e) => setNewCoupon(prev => ({ ...prev, discount: e.target.value }))}
                  placeholder="e.g., 20 or 20%"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Input
                id="description"
                value={newCoupon.description}
                onChange={(e) => setNewCoupon(prev => ({ ...prev, description: e.target.value }))}
                placeholder="e.g., 20% off for new customers"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="validUntil">Valid Until</Label>
                <Input
                  id="validUntil"
                  type="date"
                  value={newCoupon.validUntil}
                  onChange={(e) => setNewCoupon(prev => ({ ...prev, validUntil: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxUsage">Max Usage</Label>
                <Input
                  id="maxUsage"
                  type="number"
                  value={newCoupon.maxUsage}
                  onChange={(e) => setNewCoupon(prev => ({ ...prev, maxUsage: e.target.value }))}
                  placeholder="Leave empty for unlimited"
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateCoupon}>
                Create Coupon
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Coupons</CardTitle>
            <Percent className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeCoupons.length}</div>
            <p className="text-xs text-slate-500">
              Currently available
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Usage</CardTitle>
            <Users className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsage}</div>
            <p className="text-xs text-green-600">
              +12.5% this month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue Generated</CardTitle>
            <DollarSign className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toFixed(0)}</div>
            <p className="text-xs text-green-600">
              +15.3% this month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Discount</CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24%</div>
            <p className="text-xs text-slate-500">
              Average discount rate
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Input
            placeholder="Search coupon codes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Coupon Codes */}
      <div className="space-y-4">
        {filteredCoupons.map((coupon) => (
          <Card key={coupon.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <Badge variant="outline" className="font-mono text-lg px-3 py-1">
                      {coupon.code}
                    </Badge>
                    <Badge 
                      variant={coupon.status === "active" ? "default" : "secondary"}
                    >
                      {coupon.status}
                    </Badge>
                    <Badge variant="outline">
                      {coupon.discountType === "percentage" ? "Percentage" : "Fixed Amount"}
                    </Badge>
                  </div>
                  
                  <h3 className="font-medium text-lg mb-2">{coupon.description}</h3>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <Label className="text-xs text-slate-500">Discount</Label>
                      <p className="font-semibold text-green-600">{coupon.discount}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-slate-500">Valid Until</Label>
                      <p className="text-sm">{coupon.validUntil}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-slate-500">Usage</Label>
                      <p className="text-sm">{coupon.usage}/{coupon.maxUsage}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-slate-500">Revenue</Label>
                      <p className="font-semibold text-green-600">${coupon.revenue.toFixed(0)}</p>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <Label className="text-xs text-slate-500">Usage Progress</Label>
                    <div className="w-full bg-slate-200 rounded-full h-2 mt-1">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${(coupon.usage / coupon.maxUsage) * 100}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      {((coupon.usage / coupon.maxUsage) * 100).toFixed(1)}% used
                    </p>
                  </div>
                </div>
                
                <div className="ml-6">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleCopyCode(coupon.code, coupon.id)}
                    className="w-full"
                  >
                    {copiedCode === coupon.id ? (
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
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Coupon Performance Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Coupon Performance Insights</CardTitle>
          <CardDescription>Key metrics and recommendations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <h4 className="font-medium text-green-600">Top Performers</h4>
              <ul className="text-sm text-slate-600 space-y-1">
                <li>• PREMIUM50: $1,800 revenue</li>
                <li>• AFFILIATE20: $1,250 revenue</li>
                <li>• WELCOME10: $690 revenue</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-blue-600">Usage Trends</h4>
              <ul className="text-sm text-slate-600 space-y-1">
                <li>• 45% of coupons near limit</li>
                <li>• Weekend usage +25%</li>
                <li>• Mobile users prefer % discounts</li>
                <li>• Desktop users prefer fixed amounts</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-purple-600">Recommendations</h4>
              <ul className="text-sm text-slate-600 space-y-1">
                <li>• Create more percentage discounts</li>
                <li>• Extend popular coupon validity</li>
                <li>• Target mobile users with % off</li>
                <li>• Create seasonal promotions</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
