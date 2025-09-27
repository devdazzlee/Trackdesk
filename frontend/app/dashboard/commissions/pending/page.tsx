"use client"

import { useState } from "react"
import { DataTable } from "@/components/dashboard/data-table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ViewModal, EditModal, CreateModal, DeleteConfirmationModal } from "@/components/modals"
import { exportToCSV } from "@/lib/export-utils"
import { Calendar, Download, Clock, DollarSign, TrendingUp, AlertCircle } from "lucide-react"

// Mock data for pending commissions
const pendingCommissions = [
  {
    id: "COMM-001",
    date: "2024-01-07",
    customer: "john@example.com",
    offer: "Premium Plan",
    saleAmount: 100.00,
    commissionRate: 30,
    commissionAmount: 30.00,
    status: "pending",
    expectedPayout: "2024-02-01",
    daysPending: 1,
    clickId: "CLK-789"
  },
  {
    id: "COMM-002",
    date: "2024-01-06",
    customer: "sarah@example.com",
    offer: "Basic Plan",
    saleAmount: 50.00,
    commissionRate: 30,
    commissionAmount: 15.00,
    status: "pending",
    expectedPayout: "2024-02-01",
    daysPending: 2,
    clickId: "CLK-790"
  },
  {
    id: "COMM-003",
    date: "2024-01-05",
    customer: "mike@example.com",
    offer: "Enterprise",
    saleAmount: 1000.00,
    commissionRate: 30,
    commissionAmount: 300.00,
    status: "pending",
    expectedPayout: "2024-02-01",
    daysPending: 3,
    clickId: "CLK-791"
  },
  {
    id: "COMM-004",
    date: "2024-01-04",
    customer: "lisa@example.com",
    offer: "Starter",
    saleAmount: 20.00,
    commissionRate: 30,
    commissionAmount: 6.00,
    status: "pending",
    expectedPayout: "2024-02-01",
    daysPending: 4,
    clickId: "CLK-792"
  },
  {
    id: "COMM-005",
    date: "2024-01-03",
    customer: "david@example.com",
    offer: "Premium Plan",
    saleAmount: 100.00,
    commissionRate: 30,
    commissionAmount: 30.00,
    status: "pending",
    expectedPayout: "2024-02-01",
    daysPending: 5,
    clickId: "CLK-793"
  },
  {
    id: "COMM-006",
    date: "2024-01-02",
    customer: "emma@example.com",
    offer: "Basic Plan",
    saleAmount: 50.00,
    commissionRate: 30,
    commissionAmount: 15.00,
    status: "pending",
    expectedPayout: "2024-02-01",
    daysPending: 6,
    clickId: "CLK-794"
  },
  {
    id: "COMM-007",
    date: "2024-01-01",
    customer: "alex@example.com",
    offer: "Starter",
    saleAmount: 20.00,
    commissionRate: 30,
    commissionAmount: 6.00,
    status: "pending",
    expectedPayout: "2024-02-01",
    daysPending: 7,
    clickId: "CLK-795"
  },
]

const pendingColumns = [
  { key: "id", label: "Commission ID", sortable: true },
  { key: "date", label: "Date", sortable: true },
  { key: "customer", label: "Customer", sortable: true },
  { key: "offer", label: "Offer", sortable: true },
  { 
    key: "saleAmount", 
    label: "Sale Amount", 
    sortable: true,
    render: (value: number) => `$${value.toFixed(2)}`
  },
  { 
    key: "commissionRate", 
    label: "Rate", 
    sortable: true,
    render: (value: number) => `${value}%`
  },
  { 
    key: "commissionAmount", 
    label: "Commission", 
    sortable: true,
    render: (value: number) => `$${value.toFixed(2)}`
  },
  { 
    key: "status", 
    label: "Status", 
    sortable: true,
    render: (value: string) => (
      <Badge variant="secondary" className="flex items-center space-x-1">
        <Clock className="h-3 w-3" />
        <span>{value.charAt(0).toUpperCase() + value.slice(1)}</span>
      </Badge>
    )
  },
  { key: "expectedPayout", label: "Expected Payout", sortable: true },
  { key: "daysPending", label: "Days Pending", sortable: true },
]

export default function PendingCommissionsPage() {
  const [viewModalOpen, setViewModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [selectedCommission, setSelectedCommission] = useState<any>(null)
  const [commissions, setCommissions] = useState(pendingCommissions)

  const handleView = (commission: any) => {
    setSelectedCommission(commission)
    setViewModalOpen(true)
  }

  const handleEdit = (commission: any) => {
    setSelectedCommission(commission)
    setEditModalOpen(true)
  }

  const handleDelete = (commission: any) => {
    setSelectedCommission(commission)
    setDeleteModalOpen(true)
  }

  const handleCreate = () => {
    setCreateModalOpen(true)
  }

  const handleSaveEdit = (data: any) => {
    setCommissions(prev => prev.map(commission => 
      commission.id === selectedCommission.id ? { ...commission, ...data } : commission
    ))
    setSelectedCommission(null)
  }

  const handleConfirmDelete = () => {
    setCommissions(prev => prev.filter(commission => commission.id !== selectedCommission.id))
    setSelectedCommission(null)
    setDeleteModalOpen(false)
  }

  const handleCreateNew = (data: any) => {
    const newCommission = {
      ...data,
      id: `COMM-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      status: "pending",
      daysPending: 0
    }
    setCommissions(prev => [...prev, newCommission])
  }

  const handleExport = () => {
    exportToCSV(commissions, "pending-commissions")
  }

  const totalPendingAmount = commissions.reduce((sum, comm) => sum + comm.commissionAmount, 0)
  const averageDaysPending = Math.round(commissions.reduce((sum, comm) => sum + comm.daysPending, 0) / commissions.length)

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Pending Commissions</h1>
          <p className="text-slate-600">Commissions awaiting approval and payout</p>
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
            <CardTitle className="text-sm font-medium">Total Pending</CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalPendingAmount.toFixed(2)}</div>
            <p className="text-xs text-slate-500">
              Awaiting approval
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Number of Commissions</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingCommissions.length}</div>
            <p className="text-xs text-slate-500">
              Pending items
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Days Pending</CardTitle>
            <Calendar className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageDaysPending}</div>
            <p className="text-xs text-slate-500">
              Days waiting
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Next Payout</CardTitle>
            <DollarSign className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Feb 1</div>
            <p className="text-xs text-slate-500">
              Expected date
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Pending Commissions Table */}
      <DataTable
        title="Pending Commissions"
        description="Commissions awaiting approval and payout"
        columns={pendingColumns}
        data={commissions}
        searchable={true}
        filterable={true}
        exportable={true}
        pagination={true}
        pageSize={10}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        exportFilename="pending-commissions"
      />

      {/* Commission Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Commission Breakdown</CardTitle>
            <CardDescription>Pending commissions by offer type</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {["Premium Plan", "Basic Plan", "Enterprise", "Starter"].map(offer => {
              const offerCommissions = pendingCommissions.filter(c => c.offer === offer)
              const totalAmount = offerCommissions.reduce((sum, c) => sum + c.commissionAmount, 0)
              const count = offerCommissions.length
              
              return (
                <div key={offer} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-sm">{offer}</p>
                    <p className="text-xs text-slate-500">{count} commissions</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${totalAmount.toFixed(2)}</p>
                    <p className="text-xs text-slate-500">{((totalAmount / totalPendingAmount) * 100).toFixed(1)}%</p>
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pending Timeline</CardTitle>
            <CardDescription>Commission approval process</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-xs font-medium text-blue-600">1</span>
                </div>
                <div>
                  <p className="text-sm font-medium">Sale Completed</p>
                  <p className="text-xs text-slate-500">Customer makes purchase</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                  <span className="text-xs font-medium text-yellow-600">2</span>
                </div>
                <div>
                  <p className="text-sm font-medium">Commission Pending</p>
                  <p className="text-xs text-slate-500">30-day approval period</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-xs font-medium text-green-600">3</span>
                </div>
                <div>
                  <p className="text-sm font-medium">Approved & Paid</p>
                  <p className="text-xs text-slate-500">Monthly payout cycle</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Important Notice */}
      <Card className="border-yellow-200 bg-yellow-50">
        <CardContent className="p-6">
          <div className="flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-yellow-800">Commission Approval Process</h4>
              <p className="text-sm text-yellow-700 mt-1">
                All commissions are held for a 30-day approval period to ensure customer satisfaction and prevent fraud. 
                Commissions will be automatically approved and included in your next monthly payout unless there are any issues with the sale.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modals */}
      <ViewModal
        isOpen={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        title="Commission Details"
        data={selectedCommission || {}}
        fields={[
          { key: "id", label: "ID", type: "text" },
          { key: "date", label: "Date", type: "date" },
          { key: "customer", label: "Customer", type: "text" },
          { key: "offer", label: "Offer", type: "text" },
          { key: "saleAmount", label: "Sale Amount", type: "currency" },
          { key: "commissionRate", label: "Commission Rate", type: "text" },
          { key: "commissionAmount", label: "Commission Amount", type: "currency" },
          { key: "status", label: "Status", type: "status" },
          { key: "expectedPayout", label: "Expected Payout", type: "date" },
          { key: "daysPending", label: "Days Pending", type: "text" },
          { key: "clickId", label: "Click ID", type: "text" }
        ]}
      />

      <EditModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onSave={handleSaveEdit}
        title="Edit Commission"
        data={selectedCommission || {}}
        fields={[
          { key: "customer", label: "Customer", type: "text", required: true },
          { key: "offer", label: "Offer", type: "text", required: true },
          { key: "saleAmount", label: "Sale Amount", type: "number", required: true },
          { key: "commissionRate", label: "Commission Rate", type: "number", required: true },
          { key: "commissionAmount", label: "Commission Amount", type: "number", required: true },
          { key: "expectedPayout", label: "Expected Payout", type: "date", required: true },
          { key: "clickId", label: "Click ID", type: "text", required: true }
        ]}
      />

      <CreateModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onCreate={handleCreateNew}
        title="Create New Commission"
        fields={[
          { key: "customer", label: "Customer", type: "text", required: true },
          { key: "offer", label: "Offer", type: "text", required: true },
          { key: "saleAmount", label: "Sale Amount", type: "number", required: true },
          { key: "commissionRate", label: "Commission Rate", type: "number", required: true },
          { key: "commissionAmount", label: "Commission Amount", type: "number", required: true },
          { key: "expectedPayout", label: "Expected Payout", type: "date", required: true },
          { key: "clickId", label: "Click ID", type: "text", required: true }
        ]}
      />

      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Commission"
        message="Are you sure you want to delete this commission? This action cannot be undone."
        itemName={selectedCommission?.id}
      />
    </div>
  )
}
