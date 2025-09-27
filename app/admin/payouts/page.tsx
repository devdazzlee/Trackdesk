"use client"

import { useState } from "react"
import { DataTable } from "@/components/dashboard/data-table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ViewModal, EditModal, CreateModal, DeleteConfirmationModal } from "@/components/modals"
import { exportToCSV } from "@/lib/export-utils"
import { 
  CreditCard, 
  CheckCircle, 
  XCircle, 
  Clock, 
  DollarSign,
  TrendingUp,
  Calendar,
  AlertCircle
} from "lucide-react"

// Mock data for payout queue
const payoutQueue = [
  {
    id: "PAYOUT-001",
    affiliate: "John Doe",
    amount: 450.00,
    method: "PayPal",
    status: "pending",
    requestDate: "2024-01-07",
    email: "john@example.com",
    commissions: 15,
    period: "Dec 1-31, 2023"
  },
  {
    id: "PAYOUT-002",
    affiliate: "Sarah Wilson",
    amount: 320.00,
    method: "PayPal",
    status: "pending",
    requestDate: "2024-01-06",
    email: "sarah@example.com",
    commissions: 12,
    period: "Dec 1-31, 2023"
  },
  {
    id: "PAYOUT-003",
    affiliate: "Mike Johnson",
    amount: 280.00,
    method: "PayPal",
    status: "pending",
    requestDate: "2024-01-05",
    email: "mike@example.com",
    commissions: 10,
    period: "Dec 1-31, 2023"
  },
  {
    id: "PAYOUT-004",
    affiliate: "Lisa Brown",
    amount: 195.00,
    method: "PayPal",
    status: "processing",
    requestDate: "2024-01-04",
    email: "lisa@example.com",
    commissions: 8,
    period: "Dec 1-31, 2023"
  },
  {
    id: "PAYOUT-005",
    affiliate: "David Lee",
    amount: 150.00,
    method: "PayPal",
    status: "completed",
    requestDate: "2024-01-03",
    email: "david@example.com",
    commissions: 6,
    period: "Dec 1-31, 2023"
  },
  {
    id: "PAYOUT-006",
    affiliate: "Emma Davis",
    amount: 120.00,
    method: "PayPal",
    status: "failed",
    requestDate: "2024-01-02",
    email: "emma@example.com",
    commissions: 5,
    period: "Dec 1-31, 2023"
  },
  {
    id: "PAYOUT-007",
    affiliate: "Alex Chen",
    amount: 85.00,
    method: "PayPal",
    status: "completed",
    requestDate: "2024-01-01",
    email: "alex@example.com",
    commissions: 4,
    period: "Dec 1-31, 2023"
  },
  {
    id: "PAYOUT-008",
    affiliate: "Sophia Martinez",
    amount: 75.00,
    method: "PayPal",
    status: "completed",
    requestDate: "2023-12-31",
    email: "sophia@example.com",
    commissions: 3,
    period: "Dec 1-31, 2023"
  }
]

const payoutColumns = [
  { key: "id", label: "Payout ID", sortable: true },
  { key: "affiliate", label: "Affiliate", sortable: true },
  { 
    key: "amount", 
    label: "Amount", 
    sortable: true,
    render: (value: number) => `$${value.toFixed(2)}`
  },
  { key: "method", label: "Method", sortable: true },
  { 
    key: "status", 
    label: "Status", 
    sortable: true,
    render: (value: string) => {
      const statusConfig = {
        completed: { icon: CheckCircle, variant: "default" as const, color: "text-green-600" },
        processing: { icon: Clock, variant: "secondary" as const, color: "text-blue-600" },
        pending: { icon: Clock, variant: "outline" as const, color: "text-yellow-600" },
        failed: { icon: XCircle, variant: "destructive" as const, color: "text-red-600" }
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
  { key: "requestDate", label: "Request Date", sortable: true },
  { key: "commissions", label: "Commissions", sortable: true },
  { key: "period", label: "Period", sortable: true },
]

export default function PayoutQueuePage() {
  const [viewModalOpen, setViewModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [selectedPayout, setSelectedPayout] = useState<any>(null)
  const [payouts, setPayouts] = useState(payoutQueue)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredPayouts = payouts.filter(payout => {
    const matchesSearch = payout.affiliate.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payout.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payout.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || payout.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleView = (payout: any) => {
    setSelectedPayout(payout)
    setViewModalOpen(true)
  }

  const handleEdit = (payout: any) => {
    setSelectedPayout(payout)
    setEditModalOpen(true)
  }

  const handleDelete = (payout: any) => {
    setSelectedPayout(payout)
    setDeleteModalOpen(true)
  }

  const handleCreate = () => {
    setCreateModalOpen(true)
  }

  const handleSaveEdit = (data: any) => {
    setPayouts(prev => prev.map(payout => 
      payout.id === selectedPayout.id ? { ...payout, ...data } : payout
    ))
    setSelectedPayout(null)
  }

  const handleConfirmDelete = () => {
    setPayouts(prev => prev.filter(payout => payout.id !== selectedPayout.id))
    setSelectedPayout(null)
    setDeleteModalOpen(false)
  }

  const handleCreateNew = (data: any) => {
    const newPayout = {
      ...data,
      id: `PAYOUT-${Date.now()}`,
      requestDate: new Date().toISOString().split('T')[0],
      commissions: 0,
      period: "Current Period"
    }
    setPayouts(prev => [...prev, newPayout])
  }

  const handleExport = () => {
    exportToCSV(filteredPayouts, "payouts")
  }

  const handleProcessPayouts = () => {
    // Process all pending payouts
    setPayouts(prev => prev.map(payout => 
      payout.status === "pending" ? { ...payout, status: "processing" } : payout
    ))
  }

  // Calculate derived values
  const pendingPayouts = payouts.filter(p => p.status === "pending")
  const processingPayouts = payouts.filter(p => p.status === "processing")
  const completedPayouts = payouts.filter(p => p.status === "completed")
  const totalPendingAmount = pendingPayouts.reduce((sum, p) => sum + p.amount, 0)
  const totalProcessingAmount = processingPayouts.reduce((sum, p) => sum + p.amount, 0)

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Payout Queue</h1>
          <p className="text-slate-600">Manage and process affiliate commission payouts</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm" onClick={handleExport}>
            <CreditCard className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={handleProcessPayouts}>
            <CreditCard className="h-4 w-4 mr-2" />
            Process Payouts
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Payouts</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingPayouts.length}</div>
            <p className="text-xs text-slate-500">
              ${totalPendingAmount.toFixed(2)} total
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Processing</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{processingPayouts.length}</div>
            <p className="text-xs text-slate-500">
              ${totalProcessingAmount.toFixed(2)} total
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedPayouts.length}</div>
            <p className="text-xs text-green-600">
              This month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
            <DollarSign className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${(totalPendingAmount + totalProcessingAmount).toFixed(2)}</div>
            <p className="text-xs text-slate-500">
              Pending + Processing
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Payout Queue Table */}
      <DataTable
        title="Payout Queue"
        description="Affiliate payout requests awaiting processing"
        columns={payoutColumns}
        data={filteredPayouts}
        searchable={true}
        filterable={true}
        exportable={true}
        pagination={true}
        pageSize={10}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        exportFilename="payouts"
      />

      {/* Payout Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Bulk Actions</CardTitle>
            <CardDescription>Process multiple payouts at once</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <Button className="w-full" disabled={pendingPayouts.length === 0}>
                <CheckCircle className="h-4 w-4 mr-2" />
                Approve All Pending ({pendingPayouts.length})
              </Button>
              <Button variant="outline" className="w-full" disabled={pendingPayouts.length === 0}>
                <CreditCard className="h-4 w-4 mr-2" />
                Process Selected Payouts
              </Button>
              <Button variant="outline" className="w-full">
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Monthly Payouts
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payout Statistics</CardTitle>
            <CardDescription>Monthly payout performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Total Payouts This Month</span>
                <span className="font-semibold">${(totalPendingAmount + totalProcessingAmount + completedPayouts.reduce((sum, p) => sum + p.amount, 0)).toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Average Payout Amount</span>
                <span className="font-semibold">${((totalPendingAmount + totalProcessingAmount + completedPayouts.reduce((sum, p) => sum + p.amount, 0)) / payouts.length).toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Success Rate</span>
                <span className="font-semibold text-green-600">{((completedPayouts.length / payouts.length) * 100).toFixed(1)}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Processing Time</span>
                <span className="font-semibold">2.3 days</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payout Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Payout Insights</CardTitle>
          <CardDescription>Key metrics and recommendations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <h4 className="font-medium text-green-600">Positive Trends</h4>
              <ul className="text-sm text-slate-600 space-y-1">
                <li>• 87.5% payout success rate</li>
                <li>• Average processing time improved</li>
                <li>• No failed payouts this week</li>
                <li>• All affiliates using PayPal</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-blue-600">Processing Status</h4>
              <ul className="text-sm text-slate-600 space-y-1">
                <li>• 3 payouts pending approval</li>
                <li>• 1 payout in processing</li>
                <li>• 4 payouts completed this month</li>
                <li>• 1 payout failed (retry scheduled)</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-purple-600">Recommendations</h4>
              <ul className="text-sm text-slate-600 space-y-1">
                <li>• Process pending payouts today</li>
                <li>• Review failed payout reasons</li>
                <li>• Consider batch processing</li>
                <li>• Monitor payment method trends</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Important Notice */}
      <Card className="border-yellow-200 bg-yellow-50">
        <CardContent className="p-6">
          <div className="flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-yellow-800">Payout Processing Notice</h4>
              <p className="text-sm text-yellow-700 mt-1">
                Payouts are processed within 2-3 business days. Failed payouts will be automatically retried. 
                Contact support if you need to expedite any payouts or resolve payment issues.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modals */}
      <ViewModal
        isOpen={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        title="Payout Details"
        data={selectedPayout || {}}
        fields={[
          { key: "id", label: "ID", type: "text" },
          { key: "affiliate", label: "Affiliate", type: "text" },
          { key: "email", label: "Email", type: "text" },
          { key: "amount", label: "Amount", type: "currency" },
          { key: "method", label: "Payment Method", type: "text" },
          { key: "status", label: "Status", type: "status" },
          { key: "requestDate", label: "Request Date", type: "date" },
          { key: "commissions", label: "Commissions", type: "text" },
          { key: "period", label: "Period", type: "text" }
        ]}
      />

      <EditModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onSave={handleSaveEdit}
        title="Edit Payout"
        data={selectedPayout || {}}
        fields={[
          { key: "affiliate", label: "Affiliate", type: "text", required: true },
          { key: "email", label: "Email", type: "email", required: true },
          { key: "amount", label: "Amount", type: "number", required: true },
          { 
            key: "method", 
            label: "Payment Method", 
            type: "select", 
            options: [
              { value: "PayPal", label: "PayPal" },
              { value: "Bank Transfer", label: "Bank Transfer" },
              { value: "Check", label: "Check" },
              { value: "Wire Transfer", label: "Wire Transfer" }
            ]
          },
          { 
            key: "status", 
            label: "Status", 
            type: "select", 
            options: [
              { value: "pending", label: "Pending" },
              { value: "processing", label: "Processing" },
              { value: "completed", label: "Completed" },
              { value: "failed", label: "Failed" }
            ]
          }
        ]}
      />

      <CreateModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onCreate={handleCreateNew}
        title="Create New Payout"
        fields={[
          { key: "affiliate", label: "Affiliate", type: "text", required: true },
          { key: "email", label: "Email", type: "email", required: true },
          { key: "amount", label: "Amount", type: "number", required: true },
          { 
            key: "method", 
            label: "Payment Method", 
            type: "select", 
            options: [
              { value: "PayPal", label: "PayPal" },
              { value: "Bank Transfer", label: "Bank Transfer" },
              { value: "Check", label: "Check" },
              { value: "Wire Transfer", label: "Wire Transfer" }
            ],
            defaultValue: "PayPal"
          },
          { 
            key: "status", 
            label: "Status", 
            type: "select", 
            options: [
              { value: "pending", label: "Pending" },
              { value: "processing", label: "Processing" },
              { value: "completed", label: "Completed" },
              { value: "failed", label: "Failed" }
            ],
            defaultValue: "pending"
          }
        ]}
      />

      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Payout"
        message="Are you sure you want to delete this payout? This action cannot be undone."
        itemName={selectedPayout?.affiliate}
      />
    </div>
  )
}
