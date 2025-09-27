"use client"

import { useState } from "react"
import { DataTable } from "@/components/dashboard/data-table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ViewModal, EditModal, CreateModal, DeleteConfirmationModal } from "@/components/modals"
import { exportToCSV } from "@/lib/export-utils"
import { 
  Tag, 
  Plus, 
  Search, 
  Filter,
  DollarSign,
  TrendingUp,
  Users,
  Calendar,
  Edit,
  Eye,
  Download
} from "lucide-react"

// Mock data for offers
const offersData = [
  {
    id: "OFFER-001",
    name: "Premium Plan",
    description: "Our most comprehensive plan with advanced features",
    category: "SaaS",
    commissionRate: 30,
    status: "active",
    startDate: "2024-01-01",
    endDate: "2024-12-31",
    totalClicks: 1250,
    totalConversions: 89,
    totalRevenue: 2670.00,
    totalCommissions: 801.00,
    conversionRate: 7.12,
    affiliates: 45
  },
  {
    id: "OFFER-002",
    name: "Basic Plan",
    description: "Essential features for small businesses",
    category: "SaaS",
    commissionRate: 30,
    status: "active",
    startDate: "2024-01-01",
    endDate: "2024-12-31",
    totalClicks: 980,
    totalConversions: 67,
    totalRevenue: 2010.00,
    totalCommissions: 603.00,
    conversionRate: 6.84,
    affiliates: 38
  },
  {
    id: "OFFER-003",
    name: "Enterprise",
    description: "Enterprise-grade solution for large organizations",
    category: "SaaS",
    commissionRate: 30,
    status: "active",
    startDate: "2024-01-01",
    endDate: "2024-12-31",
    totalClicks: 850,
    totalConversions: 58,
    totalRevenue: 1740.00,
    totalCommissions: 522.00,
    conversionRate: 6.82,
    affiliates: 32
  },
  {
    id: "OFFER-004",
    name: "Starter",
    description: "Perfect for individuals and small teams",
    category: "SaaS",
    commissionRate: 30,
    status: "active",
    startDate: "2024-01-01",
    endDate: "2024-12-31",
    totalClicks: 720,
    totalConversions: 49,
    totalRevenue: 1470.00,
    totalCommissions: 441.00,
    conversionRate: 6.81,
    affiliates: 28
  },
  {
    id: "OFFER-005",
    name: "Holiday Special",
    description: "Limited-time holiday promotion",
    category: "Promotion",
    commissionRate: 35,
    status: "active",
    startDate: "2024-12-01",
    endDate: "2024-12-31",
    totalClicks: 450,
    totalConversions: 35,
    totalRevenue: 1050.00,
    totalCommissions: 367.50,
    conversionRate: 7.78,
    affiliates: 22
  },
  {
    id: "OFFER-006",
    name: "Summer Campaign",
    description: "Summer promotion campaign",
    category: "Promotion",
    commissionRate: 25,
    status: "inactive",
    startDate: "2024-06-01",
    endDate: "2024-08-31",
    totalClicks: 320,
    totalConversions: 28,
    totalRevenue: 840.00,
    totalCommissions: 210.00,
    conversionRate: 8.75,
    affiliates: 18
  }
]

const offerColumns = [
  { key: "id", label: "Offer ID", sortable: true },
  { key: "name", label: "Offer Name", sortable: true },
  { key: "category", label: "Category", sortable: true },
  { 
    key: "commissionRate", 
    label: "Commission Rate", 
    sortable: true,
    render: (value: number) => `${value}%`
  },
  { 
    key: "status", 
    label: "Status", 
    sortable: true,
    render: (value: string) => (
      <Badge variant={value === "active" ? "default" : "secondary"}>
        {value.charAt(0).toUpperCase() + value.slice(1)}
      </Badge>
    )
  },
  { key: "totalClicks", label: "Total Clicks", sortable: true },
  { key: "totalConversions", label: "Conversions", sortable: true },
  { 
    key: "conversionRate", 
    label: "Conversion Rate", 
    sortable: true,
    render: (value: number) => `${value.toFixed(2)}%`
  },
  { 
    key: "totalRevenue", 
    label: "Total Revenue", 
    sortable: true,
    render: (value: number) => `$${value.toFixed(2)}`
  },
  { key: "affiliates", label: "Affiliates", sortable: true },
]

export default function OffersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [viewModalOpen, setViewModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [selectedOffer, setSelectedOffer] = useState<any>(null)
  const [offers, setOffers] = useState(offersData)

  const filteredOffers = offers.filter(offer => {
    const matchesSearch = offer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         offer.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         offer.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || offer.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleView = (offer: any) => {
    setSelectedOffer(offer)
    setViewModalOpen(true)
  }

  const handleEdit = (offer: any) => {
    setSelectedOffer(offer)
    setEditModalOpen(true)
  }

  const handleDelete = (offer: any) => {
    setSelectedOffer(offer)
    setDeleteModalOpen(true)
  }

  const handleCreate = () => {
    setCreateModalOpen(true)
  }

  const handleSaveEdit = (data: any) => {
    setOffers(prev => prev.map(offer => 
      offer.id === selectedOffer.id ? { ...offer, ...data } : offer
    ))
    setSelectedOffer(null)
  }

  const handleConfirmDelete = () => {
    setOffers(prev => prev.filter(offer => offer.id !== selectedOffer.id))
    setSelectedOffer(null)
    setDeleteModalOpen(false)
  }

  const handleCreateNew = (data: any) => {
    const newOffer = {
      ...data,
      id: `OFFER-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      totalRevenue: 0,
      totalCommissions: 0,
      totalClicks: 0,
      affiliates: 0
    }
    setOffers(prev => [...prev, newOffer])
  }

  const handleExport = () => {
    exportToCSV(filteredOffers, "offers")
  }

  const activeOffers = offers.filter(o => o.status === "active")
  const totalRevenue = offers.reduce((sum, o) => sum + o.totalRevenue, 0)
  const totalCommissions = offers.reduce((sum, o) => sum + o.totalCommissions, 0)
  const totalClicks = offers.reduce((sum, o) => sum + o.totalClicks, 0)

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Offers & Creatives</h1>
          <p className="text-slate-600">Manage your affiliate offers and marketing materials</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={handleCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Create New Offer
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Offers</CardTitle>
            <Tag className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{offersData.length}</div>
            <p className="text-xs text-slate-500">
              {activeOffers.length} active
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-green-600">
              +15.3% this month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Commissions</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalCommissions.toFixed(2)}</div>
            <p className="text-xs text-green-600">
              +12.5% this month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
            <Users className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalClicks}</div>
            <p className="text-xs text-green-600">
              +8.2% this month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search offers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Offers Table */}
      <DataTable
        title="Affiliate Offers"
        description="Manage your affiliate offers and campaigns"
        columns={offerColumns}
        data={filteredOffers}
        searchable={true}
        filterable={true}
        exportable={true}
        pagination={true}
        pageSize={10}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        exportFilename="offers"
      />

      {/* Top Performing Offers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Offers</CardTitle>
            <CardDescription>Best performing offers this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {offersData
                .filter(o => o.status === "active")
                .sort((a, b) => b.totalRevenue - a.totalRevenue)
                .slice(0, 5)
                .map((offer, index) => (
                  <div key={offer.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center text-xs font-medium">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{offer.name}</p>
                        <p className="text-xs text-slate-500">{offer.category}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-sm">${offer.totalRevenue.toFixed(2)}</p>
                      <p className="text-xs text-slate-500">{offer.conversionRate.toFixed(2)}% conversion</p>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Offer Categories</CardTitle>
            <CardDescription>Performance by category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {["SaaS", "Promotion"].map(category => {
                const categoryOffers = offersData.filter(o => o.category === category)
                const categoryRevenue = categoryOffers.reduce((sum, o) => sum + o.totalRevenue, 0)
                const categoryClicks = categoryOffers.reduce((sum, o) => sum + o.totalClicks, 0)
                
                return (
                  <div key={category} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-sm">{category}</p>
                      <p className="text-xs text-slate-500">{categoryOffers.length} offers</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-sm">${categoryRevenue.toFixed(2)}</p>
                      <p className="text-xs text-slate-500">{categoryClicks} clicks</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Marketing Materials */}
      <Card>
        <CardHeader>
          <CardTitle>Marketing Materials</CardTitle>
          <CardDescription>Creative assets and promotional materials</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 border-2 border-dashed border-slate-300 rounded-lg">
              <Tag className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <h3 className="font-medium text-slate-900 mb-2">Banners</h3>
              <p className="text-sm text-slate-500 mb-4">Promotional banners in various sizes</p>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download All
              </Button>
            </div>
            
            <div className="text-center p-6 border-2 border-dashed border-slate-300 rounded-lg">
              <Tag className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <h3 className="font-medium text-slate-900 mb-2">Social Media</h3>
              <p className="text-sm text-slate-500 mb-4">Social media templates and posts</p>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download All
              </Button>
            </div>
            
            <div className="text-center p-6 border-2 border-dashed border-slate-300 rounded-lg">
              <Tag className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <h3 className="font-medium text-slate-900 mb-2">Email Templates</h3>
              <p className="text-sm text-slate-500 mb-4">Email marketing templates</p>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download All
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks and operations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button variant="outline" className="h-auto p-4">
              <div className="text-center">
                <Plus className="h-6 w-6 mx-auto mb-2" />
                <div className="font-medium">Create Offer</div>
                <div className="text-xs text-slate-500">Add new affiliate offer</div>
              </div>
            </Button>
            
            <Button variant="outline" className="h-auto p-4">
              <div className="text-center">
                <Edit className="h-6 w-6 mx-auto mb-2" />
                <div className="font-medium">Edit Offers</div>
                <div className="text-xs text-slate-500">Modify existing offers</div>
              </div>
            </Button>
            
            <Button variant="outline" className="h-auto p-4">
              <div className="text-center">
                <Eye className="h-6 w-6 mx-auto mb-2" />
                <div className="font-medium">Preview</div>
                <div className="text-xs text-slate-500">Preview offer pages</div>
              </div>
            </Button>
            
            <Button variant="outline" className="h-auto p-4">
              <div className="text-center">
                <Download className="h-6 w-6 mx-auto mb-2" />
                <div className="font-medium">Export Data</div>
                <div className="text-xs text-slate-500">Download offer reports</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Modals */}
      <ViewModal
        isOpen={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        title="Offer Details"
        data={selectedOffer || {}}
        fields={[
          { key: "id", label: "ID", type: "text" },
          { key: "name", label: "Name", type: "text" },
          { key: "description", label: "Description", type: "text" },
          { key: "status", label: "Status", type: "status" },
          { key: "commission", label: "Commission", type: "currency" },
          { key: "createdAt", label: "Created At", type: "date" },
          { key: "totalRevenue", label: "Total Revenue", type: "currency" },
          { key: "totalCommissions", label: "Total Commissions", type: "currency" },
          { key: "totalClicks", label: "Total Clicks", type: "text" },
          { key: "affiliates", label: "Affiliates", type: "text" }
        ]}
      />

      <EditModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onSave={handleSaveEdit}
        title="Edit Offer"
        data={selectedOffer || {}}
        fields={[
          { key: "name", label: "Name", type: "text", required: true },
          { key: "description", label: "Description", type: "textarea", required: true },
          { key: "commission", label: "Commission", type: "number", required: true },
          { 
            key: "status", 
            label: "Status", 
            type: "select", 
            options: [
              { value: "active", label: "Active" },
              { value: "inactive", label: "Inactive" },
              { value: "paused", label: "Paused" }
            ]
          }
        ]}
      />

      <CreateModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onCreate={handleCreateNew}
        title="Create New Offer"
        fields={[
          { key: "name", label: "Name", type: "text", required: true },
          { key: "description", label: "Description", type: "textarea", required: true },
          { key: "commission", label: "Commission", type: "number", required: true },
          { 
            key: "status", 
            label: "Status", 
            type: "select", 
            options: [
              { value: "active", label: "Active" },
              { value: "inactive", label: "Inactive" },
              { value: "paused", label: "Paused" }
            ],
            defaultValue: "active"
          }
        ]}
      />

      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Offer"
        message="Are you sure you want to delete this offer? This action cannot be undone."
        itemName={selectedOffer?.name}
      />
    </div>
  )
}
