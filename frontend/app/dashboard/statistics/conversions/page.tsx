"use client"

import { useState } from "react"
import { DataTable } from "@/components/dashboard/data-table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ViewModal, EditModal, CreateModal, DeleteConfirmationModal } from "@/components/modals"
import { exportToCSV } from "@/lib/export-utils"
import { Calendar, Download, Filter, Target, DollarSign, TrendingUp, Clock } from "lucide-react"

// Mock data for conversions log
const conversionsData = [
  {
    id: "CONV-001",
    date: "2024-01-07 14:30:25",
    clickId: "CLK-789",
    status: "approved",
    referralType: "Sale",
    commissionAmount: 30.00,
    customerValue: 100.00,
    offer: "Premium Plan",
    customerEmail: "john@example.com",
    conversionTime: "2m 15s"
  },
  {
    id: "CONV-002",
    date: "2024-01-07 12:15:10",
    clickId: "CLK-790",
    status: "pending",
    referralType: "Sale",
    commissionAmount: 15.00,
    customerValue: 50.00,
    offer: "Basic Plan",
    customerEmail: "sarah@example.com",
    conversionTime: "5m 42s"
  },
  {
    id: "CONV-003",
    date: "2024-01-06 16:45:33",
    clickId: "CLK-791",
    status: "approved",
    referralType: "Sale",
    commissionAmount: 300.00,
    customerValue: 1000.00,
    offer: "Enterprise",
    customerEmail: "mike@example.com",
    conversionTime: "1h 23m"
  },
  {
    id: "CONV-004",
    date: "2024-01-06 09:20:15",
    clickId: "CLK-792",
    status: "declined",
    referralType: "Lead",
    commissionAmount: 5.00,
    customerValue: 0.00,
    offer: "Starter",
    customerEmail: "lisa@example.com",
    conversionTime: "3m 18s"
  },
  {
    id: "CONV-005",
    date: "2024-01-05 18:10:42",
    clickId: "CLK-793",
    status: "approved",
    referralType: "Sale",
    commissionAmount: 30.00,
    customerValue: 100.00,
    offer: "Premium Plan",
    customerEmail: "david@example.com",
    conversionTime: "7m 55s"
  },
  {
    id: "CONV-006",
    date: "2024-01-05 11:35:28",
    clickId: "CLK-794",
    status: "approved",
    referralType: "Sale",
    commissionAmount: 15.00,
    customerValue: 50.00,
    offer: "Basic Plan",
    customerEmail: "emma@example.com",
    conversionTime: "4m 12s"
  },
  {
    id: "CONV-007",
    date: "2024-01-04 15:22:17",
    clickId: "CLK-795",
    status: "pending",
    referralType: "Lead",
    commissionAmount: 5.00,
    customerValue: 0.00,
    offer: "Starter",
    customerEmail: "alex@example.com",
    conversionTime: "2m 45s"
  },
  {
    id: "CONV-008",
    date: "2024-01-04 08:45:55",
    clickId: "CLK-796",
    status: "approved",
    referralType: "Sale",
    commissionAmount: 30.00,
    customerValue: 100.00,
    offer: "Premium Plan",
    customerEmail: "sophia@example.com",
    conversionTime: "6m 33s"
  },
]

const conversionsColumns = [
  { key: "id", label: "Conversion ID", sortable: true },
  { key: "date", label: "Date & Time", sortable: true },
  { key: "clickId", label: "Click ID", sortable: true },
  { 
    key: "status", 
    label: "Status", 
    sortable: true,
    render: (value: string) => (
      <Badge 
        variant={
          value === "approved" ? "default" : 
          value === "pending" ? "secondary" : 
          "destructive"
        }
      >
        {value.charAt(0).toUpperCase() + value.slice(1)}
      </Badge>
    )
  },
  { key: "referralType", label: "Type", sortable: true },
  { 
    key: "commissionAmount", 
    label: "Commission", 
    sortable: true,
    render: (value: number) => `$${value.toFixed(2)}`
  },
  { 
    key: "customerValue", 
    label: "Customer Value", 
    sortable: true,
    render: (value: number) => value > 0 ? `$${value.toFixed(2)}` : "-"
  },
  { key: "offer", label: "Offer", sortable: true },
  { key: "conversionTime", label: "Time to Convert", sortable: true },
]

export default function ConversionsLogPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [viewModalOpen, setViewModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [selectedConversion, setSelectedConversion] = useState<any>(null)
  const [conversions, setConversions] = useState(conversionsData)

  const filteredConversions = conversions.filter(conversion => {
    const matchesSearch = conversion.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         conversion.clickId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         conversion.customerEmail.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || conversion.status === statusFilter
    return matchesSearch && matchesStatus
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
      date: new Date().toISOString().replace('T', ' ').substring(0, 19),
      clickId: `CLK-${Date.now()}`
    }
    setConversions(prev => [...prev, newConversion])
  }

  const handleExport = () => {
    exportToCSV(filteredConversions, "conversions")
  }
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Conversions Log</h1>
          <p className="text-slate-600">Detailed log of all your conversions and their status</p>
        </div>
        <div className="flex items-center space-x-3">
          <Select defaultValue="30d">
            <SelectTrigger className="w-40">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
              <SelectItem value="90d">Last 90 Days</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={handleExport}>
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
            <div className="text-2xl font-bold">103</div>
            <p className="text-xs text-green-600">
              +8.2% from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Commission</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$3,090</div>
            <p className="text-xs text-green-600">
              +15.3% from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7.25%</div>
            <p className="text-xs text-green-600">
              +0.8% from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-slate-500">
              Awaiting approval
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Conversions Table */}
      <DataTable
        title="Conversions Log"
        description="Complete history of all your conversions"
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

      {/* Conversion Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Conversion Insights</CardTitle>
            <CardDescription>Key metrics and trends</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">Average conversion time</span>
              <span className="font-medium">4m 32s</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">Best performing offer</span>
              <span className="font-medium">Premium Plan</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">Peak conversion hours</span>
              <span className="font-medium">2-4 PM EST</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">Top traffic source</span>
              <span className="font-medium">Social Media</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Status Breakdown</CardTitle>
            <CardDescription>Conversion status distribution</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm">Approved</span>
              </div>
              <span className="font-medium">78 (75.7%)</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-sm">Pending</span>
              </div>
              <span className="font-medium">12 (11.7%)</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-sm">Declined</span>
              </div>
              <span className="font-medium">13 (12.6%)</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modals */}
      <ViewModal
        isOpen={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        title="Conversion Details"
        data={selectedConversion || {}}
        fields={[
          { key: "id", label: "ID", type: "text" },
          { key: "date", label: "Date", type: "text" },
          { key: "clickId", label: "Click ID", type: "text" },
          { key: "status", label: "Status", type: "status" },
          { key: "referralType", label: "Referral Type", type: "text" },
          { key: "commissionAmount", label: "Commission Amount", type: "currency" },
          { key: "customerValue", label: "Customer Value", type: "currency" },
          { key: "offer", label: "Offer", type: "text" },
          { key: "customerEmail", label: "Customer Email", type: "text" },
          { key: "conversionTime", label: "Conversion Time", type: "text" }
        ]}
      />

      <EditModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onSave={handleSaveEdit}
        title="Edit Conversion"
        data={selectedConversion || {}}
        fields={[
          { key: "referralType", label: "Referral Type", type: "text", required: true },
          { key: "commissionAmount", label: "Commission Amount", type: "number", required: true },
          { key: "customerValue", label: "Customer Value", type: "number", required: true },
          { key: "offer", label: "Offer", type: "text", required: true },
          { key: "customerEmail", label: "Customer Email", type: "email", required: true },
          { key: "conversionTime", label: "Conversion Time", type: "text", required: true },
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
          { key: "referralType", label: "Referral Type", type: "text", required: true },
          { key: "commissionAmount", label: "Commission Amount", type: "number", required: true },
          { key: "customerValue", label: "Customer Value", type: "number", required: true },
          { key: "offer", label: "Offer", type: "text", required: true },
          { key: "customerEmail", label: "Customer Email", type: "email", required: true },
          { key: "conversionTime", label: "Conversion Time", type: "text", required: true },
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