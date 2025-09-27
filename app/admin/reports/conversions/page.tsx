"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DataTable } from "@/components/dashboard/data-table"
import { ViewModal, EditModal, CreateModal, DeleteConfirmationModal } from "@/components/modals"
import { exportToCSV } from "@/lib/export-utils"
import { 
  Target, 
  Search, 
  Filter,
  Download,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  HelpCircle,
  TrendingUp
} from "lucide-react"

// Mock data for conversions report
const conversionsData = [
  {
    id: "CONV-001",
    timestamp: "2024-01-07 14:30:25",
    affiliate: "John Doe",
    offer: "Premium Plan",
    clickId: "CLK-001",
    status: "approved",
    amount: 100.00,
    commission: 30.00,
    customerEmail: "customer1@example.com",
    country: "United States",
    source: "Social Media",
    conversionTime: "2m 15s"
  },
  {
    id: "CONV-002",
    timestamp: "2024-01-07 12:15:10",
    affiliate: "Sarah Wilson",
    offer: "Basic Plan",
    clickId: "CLK-002",
    status: "pending",
    amount: 50.00,
    commission: 15.00,
    customerEmail: "customer2@example.com",
    country: "Canada",
    source: "Email",
    conversionTime: "5m 42s"
  },
  {
    id: "CONV-003",
    timestamp: "2024-01-06 16:45:33",
    affiliate: "Mike Johnson",
    offer: "Enterprise",
    clickId: "CLK-003",
    status: "approved",
    amount: 1000.00,
    commission: 300.00,
    customerEmail: "customer3@example.com",
    country: "United Kingdom",
    source: "Direct",
    conversionTime: "1h 23m"
  },
  {
    id: "CONV-004",
    timestamp: "2024-01-06 09:20:15",
    affiliate: "Lisa Brown",
    offer: "Starter",
    clickId: "CLK-004",
    status: "declined",
    amount: 20.00,
    commission: 6.00,
    customerEmail: "customer4@example.com",
    country: "Australia",
    source: "Search Engine",
    conversionTime: "3m 18s"
  },
  {
    id: "CONV-005",
    timestamp: "2024-01-05 18:10:42",
    affiliate: "David Lee",
    offer: "Premium Plan",
    clickId: "CLK-005",
    status: "approved",
    amount: 100.00,
    commission: 30.00,
    customerEmail: "customer5@example.com",
    country: "Germany",
    source: "Social Media",
    conversionTime: "7m 55s"
  },
]

const conversionsColumns = [
  { key: "id", label: "Conversion ID", sortable: true },
  { key: "timestamp", label: "Timestamp", sortable: true },
  { key: "affiliate", label: "Affiliate", sortable: true },
  { key: "offer", label: "Offer", sortable: true },
  { key: "clickId", label: "Click ID", sortable: true },
  { 
    key: "status", 
    label: "Status", 
    sortable: true,
    render: (value: string) => {
      const statusConfig = {
        approved: { icon: CheckCircle, variant: "default" as const, color: "text-green-600" },
        pending: { icon: Clock, variant: "secondary" as const, color: "text-yellow-600" },
        declined: { icon: XCircle, variant: "destructive" as const, color: "text-red-600" }
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
  { 
    key: "amount", 
    label: "Amount", 
    sortable: true,
    render: (value: number) => `$${value.toFixed(2)}`
  },
  { 
    key: "commission", 
    label: "Commission", 
    sortable: true,
    render: (value: number) => `$${value.toFixed(2)}`
  },
  { key: "customerEmail", label: "Customer Email", sortable: true },
  { key: "country", label: "Country", sortable: true },
  { key: "conversionTime", label: "Conversion Time", sortable: true },
]

export default function ConversionsReportPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [offerFilter, setOfferFilter] = useState("all")
  const [viewModalOpen, setViewModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [selectedConversion, setSelectedConversion] = useState<any>(null)
  const [conversions, setConversions] = useState(conversionsData)

  const filteredConversions = conversions.filter(conversion => {
    const matchesSearch = conversion.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         conversion.affiliate.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         conversion.customerEmail.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || conversion.status === statusFilter
    const matchesOffer = offerFilter === "all" || conversion.offer === offerFilter
    return matchesSearch && matchesStatus && matchesOffer
  })

  const handleView = (conversion: any) => {
    setSelectedConversion(conversion)
    setViewModalOpen(true)
  }

  const handleEdit = (conversion: any) => {
    setSelectedConversion(conversion)
    setEditModalOpen(true)
  }

  const handleDelete = (conversion: any) => {
    setSelectedConversion(conversion)
    setDeleteModalOpen(true)
  }

  const handleCreate = () => {
    setCreateModalOpen(true)
  }

  const handleSaveEdit = (data: any) => {
    setConversions(prev => prev.map(conversion => 
      conversion.id === selectedConversion.id ? { ...conversion, ...data } : conversion
    ))
    setSelectedConversion(null)
  }

  const handleConfirmDelete = () => {
    setConversions(prev => prev.filter(conversion => conversion.id !== selectedConversion.id))
    setSelectedConversion(null)
    setDeleteModalOpen(false)
  }

  const handleCreateNew = (data: any) => {
    const newConversion = {
      ...data,
      id: `CONV-${Date.now()}`,
      conversionTime: new Date().toISOString(),
      clickId: `CLICK-${Date.now()}`
    }
    setConversions(prev => [...prev, newConversion])
  }

  const handleExport = () => {
    exportToCSV(filteredConversions, "conversions")
  }

  const totalConversions = conversions.length
  const approvedConversions = conversions.filter(c => c.status === "approved")
  const pendingConversions = conversions.filter(c => c.status === "pending")
  const declinedConversions = conversions.filter(c => c.status === "declined")
  const totalRevenue = conversions.reduce((sum, c) => sum + c.amount, 0)
  const totalCommissions = conversions.reduce((sum, c) => sum + c.commission, 0)

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center">
            Conversions
            <HelpCircle className="h-5 w-5 ml-2 text-slate-400" />
          </h1>
          <p className="text-slate-600">Reports &gt; Conversions</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Conversions</CardTitle>
            <Target className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalConversions}</div>
            <p className="text-xs text-slate-500">
              All time conversions
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{approvedConversions.length}</div>
            <p className="text-xs text-green-600">
              {((approvedConversions.length / totalConversions) * 100).toFixed(1)}% approval rate
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-slate-500">
              From all conversions
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Commissions</CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalCommissions.toFixed(2)}</div>
            <p className="text-xs text-slate-500">
              Paid to affiliates
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search conversions..."
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
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="declined">Declined</SelectItem>
          </SelectContent>
        </Select>
        <Select value={offerFilter} onValueChange={setOfferFilter}>
          <SelectTrigger className="w-40">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Offers</SelectItem>
            <SelectItem value="Premium Plan">Premium Plan</SelectItem>
            <SelectItem value="Basic Plan">Basic Plan</SelectItem>
            <SelectItem value="Enterprise">Enterprise</SelectItem>
            <SelectItem value="Starter">Starter</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Conversions Table */}
      <DataTable
        title="Conversion Details"
        description="Detailed conversion tracking and analysis"
        columns={conversionsColumns}
        data={filteredConversions}
        searchable={true}
        filterable={true}
        exportable={true}
        pagination={true}
        pageSize={10}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        exportFilename="conversions"
      />

      {/* Conversion Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Status Distribution</CardTitle>
            <CardDescription>Conversion status breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Approved</span>
                </div>
                <span className="font-medium">{approvedConversions.length} ({((approvedConversions.length / totalConversions) * 100).toFixed(1)}%)</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm">Pending</span>
                </div>
                <span className="font-medium">{pendingConversions.length} ({((pendingConversions.length / totalConversions) * 100).toFixed(1)}%)</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-sm">Declined</span>
                </div>
                <span className="font-medium">{declinedConversions.length} ({((declinedConversions.length / totalConversions) * 100).toFixed(1)}%)</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Performing Offers</CardTitle>
            <CardDescription>Conversion performance by offer</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {["Premium Plan", "Basic Plan", "Enterprise", "Starter"].map(offer => {
                const offerConversions = conversionsData.filter(c => c.offer === offer)
                const offerRevenue = offerConversions.reduce((sum, c) => sum + c.amount, 0)
                const count = offerConversions.length
                return (
                  <div key={offer} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-sm">{offer}</p>
                      <p className="text-xs text-slate-500">{count} conversions</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">${offerRevenue.toFixed(2)}</p>
                      <p className="text-xs text-slate-500">{((count / totalConversions) * 100).toFixed(1)}%</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Geographic Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Geographic Distribution</CardTitle>
          <CardDescription>Conversion distribution by country</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {["United States", "Canada", "United Kingdom", "Australia", "Germany"].map(country => {
              const countryConversions = conversionsData.filter(c => c.country === country)
              const countryRevenue = countryConversions.reduce((sum, c) => sum + c.amount, 0)
              const count = countryConversions.length
              const percentage = (count / totalConversions) * 100
              return (
                <div key={country} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-sm">{country}</span>
                    <span className="text-sm text-slate-500">{count} conversions</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2 mb-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-slate-500">${countryRevenue.toFixed(2)} revenue</p>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Conversion Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Conversion Insights</CardTitle>
          <CardDescription>Key metrics and performance indicators</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {((approvedConversions.length / totalConversions) * 100).toFixed(1)}%
              </div>
              <div className="text-sm text-slate-500">Approval Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                ${(totalRevenue / totalConversions).toFixed(2)}
              </div>
              <div className="text-sm text-slate-500">Average Order Value</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                ${(totalCommissions / totalConversions).toFixed(2)}
              </div>
              <div className="text-sm text-slate-500">Average Commission</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {conversionsData.reduce((sum, c) => sum + parseInt(c.conversionTime.split('m')[0]), 0) / totalConversions}
              </div>
              <div className="text-sm text-slate-500">Avg. Conversion Time (min)</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modals */}
      <ViewModal
        isOpen={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        title="Conversion Details"
        data={selectedConversion || {}}
        fields={[
          { key: "id", label: "ID", type: "text" },
          { key: "affiliate", label: "Affiliate", type: "text" },
          { key: "offer", label: "Offer", type: "text" },
          { key: "status", label: "Status", type: "status" },
          { key: "amount", label: "Amount", type: "currency" },
          { key: "commission", label: "Commission", type: "currency" },
          { key: "customerEmail", label: "Customer Email", type: "text" },
          { key: "country", label: "Country", type: "text" },
          { key: "conversionTime", label: "Conversion Time", type: "text" },
          { key: "clickId", label: "Click ID", type: "text" }
        ]}
      />

      <EditModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onSave={handleSaveEdit}
        title="Edit Conversion"
        data={selectedConversion || {}}
        fields={[
          { key: "affiliate", label: "Affiliate", type: "text", required: true },
          { key: "offer", label: "Offer", type: "text", required: true },
          { key: "amount", label: "Amount", type: "number", required: true },
          { key: "commission", label: "Commission", type: "number", required: true },
          { key: "customerEmail", label: "Customer Email", type: "email", required: true },
          { key: "country", label: "Country", type: "text", required: true },
          { 
            key: "status", 
            label: "Status", 
            type: "select", 
            options: [
              { value: "approved", label: "Approved" },
              { value: "pending", label: "Pending" },
              { value: "declined", label: "Declined" }
            ]
          }
        ]}
      />

      <CreateModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onCreate={handleCreateNew}
        title="Create New Conversion"
        fields={[
          { key: "affiliate", label: "Affiliate", type: "text", required: true },
          { key: "offer", label: "Offer", type: "text", required: true },
          { key: "amount", label: "Amount", type: "number", required: true },
          { key: "commission", label: "Commission", type: "number", required: true },
          { key: "customerEmail", label: "Customer Email", type: "email", required: true },
          { key: "country", label: "Country", type: "text", required: true },
          { 
            key: "status", 
            label: "Status", 
            type: "select", 
            options: [
              { value: "approved", label: "Approved" },
              { value: "pending", label: "Pending" },
              { value: "declined", label: "Declined" }
            ],
            defaultValue: "pending"
          }
        ]}
      />

      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Conversion"
        message="Are you sure you want to delete this conversion? This action cannot be undone."
        itemName={selectedConversion?.id}
      />
    </div>
  )
}
