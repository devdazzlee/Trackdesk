"use client"

import { useState } from "react"
import { DataTable } from "@/components/dashboard/data-table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ViewModal, EditModal, CreateModal, DeleteConfirmationModal } from "@/components/modals"
import { exportToCSV } from "@/lib/export-utils"
import { 
  Users, 
  UserPlus, 
  Search, 
  Filter,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  TrendingUp
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Mock data for affiliates
const affiliatesData = [
  {
    id: "AFF-001",
    name: "John Doe",
    email: "john@example.com",
    joinDate: "2024-01-07",
    status: "active",
    tier: "Gold",
    totalEarnings: 1250.00,
    totalClicks: 127,
    totalConversions: 23,
    conversionRate: 18.1,
    lastActivity: "2024-01-07 14:30",
    paymentMethod: "PayPal",
    country: "United States"
  },
  {
    id: "AFF-002",
    name: "Sarah Wilson",
    email: "sarah@example.com",
    joinDate: "2024-01-06",
    status: "active",
    tier: "Silver",
    totalEarnings: 980.00,
    totalClicks: 98,
    totalConversions: 18,
    conversionRate: 18.4,
    lastActivity: "2024-01-07 12:15",
    paymentMethod: "PayPal",
    country: "Canada"
  },
  {
    id: "AFF-003",
    name: "Mike Johnson",
    email: "mike@example.com",
    joinDate: "2024-01-05",
    status: "pending",
    tier: "Bronze",
    totalEarnings: 0.00,
    totalClicks: 0,
    totalConversions: 0,
    conversionRate: 0,
    lastActivity: "2024-01-05 16:45",
    paymentMethod: "PayPal",
    country: "United Kingdom"
  },
  {
    id: "AFF-004",
    name: "Lisa Brown",
    email: "lisa@example.com",
    joinDate: "2024-01-04",
    status: "active",
    tier: "Silver",
    totalEarnings: 720.00,
    totalClicks: 72,
    totalConversions: 14,
    conversionRate: 19.4,
    lastActivity: "2024-01-07 09:20",
    paymentMethod: "PayPal",
    country: "Australia"
  },
  {
    id: "AFF-005",
    name: "David Lee",
    email: "david@example.com",
    joinDate: "2024-01-03",
    status: "suspended",
    tier: "Bronze",
    totalEarnings: 680.00,
    totalClicks: 68,
    totalConversions: 12,
    conversionRate: 17.6,
    lastActivity: "2024-01-03 18:10",
    paymentMethod: "PayPal",
    country: "Germany"
  },
  {
    id: "AFF-006",
    name: "Emma Davis",
    email: "emma@example.com",
    joinDate: "2024-01-02",
    status: "active",
    tier: "Gold",
    totalEarnings: 1100.00,
    totalClicks: 110,
    totalConversions: 20,
    conversionRate: 18.2,
    lastActivity: "2024-01-07 08:45",
    paymentMethod: "PayPal",
    country: "France"
  },
  {
    id: "AFF-007",
    name: "Alex Chen",
    email: "alex@example.com",
    joinDate: "2024-01-01",
    status: "active",
    tier: "Platinum",
    totalEarnings: 2100.00,
    totalClicks: 210,
    totalConversions: 38,
    conversionRate: 18.1,
    lastActivity: "2024-01-07 16:20",
    paymentMethod: "PayPal",
    country: "Japan"
  },
  {
    id: "AFF-008",
    name: "Sophia Martinez",
    email: "sophia@example.com",
    joinDate: "2023-12-30",
    status: "inactive",
    tier: "Bronze",
    totalEarnings: 450.00,
    totalClicks: 45,
    totalConversions: 8,
    conversionRate: 17.8,
    lastActivity: "2023-12-30 14:30",
    paymentMethod: "PayPal",
    country: "Brazil"
  }
]

const affiliateColumns = [
  { key: "id", label: "ID", sortable: true },
  { key: "name", label: "Name", sortable: true },
  { key: "email", label: "Email", sortable: true },
  { key: "joinDate", label: "Join Date", sortable: true },
  { 
    key: "status", 
    label: "Status", 
    sortable: true,
    render: (value: string) => {
      const statusConfig = {
        active: { icon: CheckCircle, variant: "default" as const, color: "text-green-600" },
        pending: { icon: Clock, variant: "secondary" as const, color: "text-yellow-600" },
        suspended: { icon: XCircle, variant: "destructive" as const, color: "text-red-600" },
        inactive: { icon: Clock, variant: "outline" as const, color: "text-slate-600" }
      }
      const config = statusConfig[value as keyof typeof statusConfig] || statusConfig.pending
      const Icon = config.icon
      
      return (
        <Badge variant={config.variant} className="flex items-center space-x-1">
          <Icon className="h-3 w-3" />
          <span>{value.charAt(0).toUpperCase() + value.slice(1)}</span>
        </Badge>
      )
    }
  },
  { key: "tier", label: "Tier", sortable: true },
  { 
    key: "totalEarnings", 
    label: "Total Earnings", 
    sortable: true,
    render: (value: number) => `$${value.toFixed(2)}`
  },
  { key: "totalClicks", label: "Clicks", sortable: true },
  { key: "totalConversions", label: "Conversions", sortable: true },
  { 
    key: "conversionRate", 
    label: "Conversion Rate", 
    sortable: true,
    render: (value: number) => `${value.toFixed(1)}%`
  },
  { key: "lastActivity", label: "Last Activity", sortable: true },
]

export default function ManageAffiliatesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [viewModalOpen, setViewModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [selectedAffiliate, setSelectedAffiliate] = useState<any>(null)
  const [affiliates, setAffiliates] = useState(affiliatesData)

  const filteredAffiliates = affiliates.filter(affiliate => {
    const matchesSearch = affiliate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         affiliate.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         affiliate.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || affiliate.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleView = (affiliate: any) => {
    setSelectedAffiliate(affiliate)
    setViewModalOpen(true)
  }

  const handleEdit = (affiliate: any) => {
    setSelectedAffiliate(affiliate)
    setEditModalOpen(true)
  }

  const handleDelete = (affiliate: any) => {
    setSelectedAffiliate(affiliate)
    setDeleteModalOpen(true)
  }

  const handleCreate = () => {
    setCreateModalOpen(true)
  }

  const handleSaveEdit = (data: any) => {
    setAffiliates(prev => prev.map(affiliate => 
      affiliate.id === selectedAffiliate.id ? { ...affiliate, ...data } : affiliate
    ))
    setSelectedAffiliate(null)
  }

  const handleConfirmDelete = () => {
    setAffiliates(prev => prev.filter(affiliate => affiliate.id !== selectedAffiliate.id))
    setSelectedAffiliate(null)
    setDeleteModalOpen(false)
  }

  const handleCreateNew = (data: any) => {
    const newAffiliate = {
      ...data,
      id: `AFF-${Date.now()}`,
      joinDate: new Date().toISOString().split('T')[0],
      totalEarnings: 0,
      conversionRate: 0,
      lastActivity: "Today"
    }
    setAffiliates(prev => [...prev, newAffiliate])
  }

  const handleExport = () => {
    exportToCSV(filteredAffiliates, "affiliates")
  }

  const activeAffiliates = affiliates.filter(a => a.status === "active")
  const pendingAffiliates = affiliates.filter(a => a.status === "pending")
  const totalEarnings = affiliates.reduce((sum, a) => sum + a.totalEarnings, 0)
  const totalClicks = affiliates.reduce((sum, a) => sum + a.totalClicks, 0)

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Manage Affiliates</h1>
          <p className="text-slate-600">View and manage your affiliate partners</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Filter className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={handleCreate}>
            <UserPlus className="h-4 w-4 mr-2" />
            Add New Affiliate
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Affiliates</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{affiliatesData.length}</div>
            <p className="text-xs text-slate-500">
              {activeAffiliates.length} active
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingAffiliates.length}</div>
            <p className="text-xs text-slate-500">
              Awaiting review
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalEarnings.toFixed(2)}</div>
            <p className="text-xs text-green-600">
              +15.3% this month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalClicks}</div>
            <p className="text-xs text-green-600">
              +12.5% this month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search affiliates..."
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
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="suspended">Suspended</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Affiliates Table */}
      <DataTable
        title="Affiliate Partners"
        description="Complete list of your affiliate partners"
        columns={affiliateColumns}
        data={filteredAffiliates}
        searchable={true}
        filterable={true}
        exportable={true}
        pagination={true}
        pageSize={10}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        exportFilename="affiliates"
      />

      {/* Affiliate Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Affiliates</CardTitle>
            <CardDescription>Best performing affiliates this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {affiliates
                .filter(a => a.status === "active")
                .sort((a, b) => b.totalEarnings - a.totalEarnings)
                .slice(0, 5)
                .map((affiliate, index) => (
                  <div key={affiliate.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center text-xs font-medium">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{affiliate.name}</p>
                        <p className="text-xs text-slate-500">{affiliate.tier} Tier</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-sm">${affiliate.totalEarnings.toFixed(2)}</p>
                      <p className="text-xs text-slate-500">{affiliate.conversionRate.toFixed(1)}% conversion</p>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Affiliate Status Distribution</CardTitle>
            <CardDescription>Breakdown of affiliate statuses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Active</span>
                </div>
                <span className="font-medium">{activeAffiliates.length} ({((activeAffiliates.length / affiliatesData.length) * 100).toFixed(1)}%)</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm">Pending</span>
                </div>
                <span className="font-medium">{pendingAffiliates.length} ({((pendingAffiliates.length / affiliates.length) * 100).toFixed(1)}%)</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-sm">Suspended</span>
                </div>
                <span className="font-medium">{affiliates.filter(a => a.status === "suspended").length} ({((affiliates.filter(a => a.status === "suspended").length / affiliates.length) * 100).toFixed(1)}%)</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-slate-500 rounded-full"></div>
                  <span className="text-sm">Inactive</span>
                </div>
                <span className="font-medium">{affiliates.filter(a => a.status === "inactive").length} ({((affiliates.filter(a => a.status === "inactive").length / affiliates.length) * 100).toFixed(1)}%)</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modals */}
      <ViewModal
        isOpen={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        title="Affiliate Details"
        data={selectedAffiliate || {}}
        fields={[
          { key: "id", label: "ID", type: "text" },
          { key: "name", label: "Name", type: "text" },
          { key: "email", label: "Email", type: "text" },
          { key: "status", label: "Status", type: "status" },
          { key: "joinDate", label: "Join Date", type: "date" },
          { key: "totalEarnings", label: "Total Earnings", type: "currency" },
          { key: "totalClicks", label: "Total Clicks", type: "text" },
          { key: "conversionRate", label: "Conversion Rate", type: "text" },
          { key: "lastActivity", label: "Last Activity", type: "text" }
        ]}
      />

      <EditModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onSave={handleSaveEdit}
        title="Edit Affiliate"
        data={selectedAffiliate || {}}
        fields={[
          { key: "name", label: "Name", type: "text", required: true },
          { key: "email", label: "Email", type: "email", required: true },
          { 
            key: "status", 
            label: "Status", 
            type: "select", 
            options: [
              { value: "active", label: "Active" },
              { value: "pending", label: "Pending" },
              { value: "suspended", label: "Suspended" },
              { value: "inactive", label: "Inactive" }
            ]
          }
        ]}
      />

      <CreateModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onCreate={handleCreateNew}
        title="Add New Affiliate"
        fields={[
          { key: "name", label: "Name", type: "text", required: true },
          { key: "email", label: "Email", type: "email", required: true },
          { 
            key: "status", 
            label: "Status", 
            type: "select", 
            options: [
              { value: "active", label: "Active" },
              { value: "pending", label: "Pending" },
              { value: "suspended", label: "Suspended" },
              { value: "inactive", label: "Inactive" }
            ],
            defaultValue: "pending"
          }
        ]}
      />

      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Affiliate"
        message="Are you sure you want to delete this affiliate? This action cannot be undone."
        itemName={selectedAffiliate?.name}
      />
    </div>
  )
}
