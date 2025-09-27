"use client"

import { useState } from "react"
import { DataTable } from "@/components/dashboard/data-table"
import { ViewModal, EditModal, CreateModal, DeleteConfirmationModal } from "@/components/modals"
import { exportToCSV } from "@/lib/export-utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Download, CheckCircle, XCircle, Clock, DollarSign, TrendingUp } from "lucide-react"

// Mock data for payout history
const payoutHistory = [
  {
    id: "PAYOUT-001",
    date: "2024-01-01",
    amount: 450.00,
    method: "PayPal",
    status: "completed",
    referenceId: "PP-123456789",
    description: "Monthly payout for December 2023",
    commissions: 15,
    period: "Dec 1-31, 2023"
  },
  {
    id: "PAYOUT-002",
    date: "2023-12-01",
    amount: 320.00,
    method: "PayPal",
    status: "completed",
    referenceId: "PP-987654321",
    description: "Monthly payout for November 2023",
    commissions: 12,
    period: "Nov 1-30, 2023"
  },
  {
    id: "PAYOUT-003",
    date: "2023-11-01",
    amount: 280.00,
    method: "PayPal",
    status: "completed",
    referenceId: "PP-456789123",
    description: "Monthly payout for October 2023",
    commissions: 10,
    period: "Oct 1-31, 2023"
  },
  {
    id: "PAYOUT-004",
    date: "2023-10-01",
    amount: 195.00,
    method: "PayPal",
    status: "failed",
    referenceId: "PP-789123456",
    description: "Monthly payout for September 2023",
    commissions: 8,
    period: "Sep 1-30, 2023"
  },
  {
    id: "PAYOUT-005",
    date: "2023-09-01",
    amount: 195.00,
    method: "PayPal",
    status: "completed",
    referenceId: "PP-321654987",
    description: "Retry payout for September 2023",
    commissions: 8,
    period: "Sep 1-30, 2023"
  },
  {
    id: "PAYOUT-006",
    date: "2023-08-01",
    amount: 150.00,
    method: "PayPal",
    status: "completed",
    referenceId: "PP-654987321",
    description: "Monthly payout for August 2023",
    commissions: 6,
    period: "Aug 1-31, 2023"
  },
  {
    id: "PAYOUT-007",
    date: "2023-07-01",
    amount: 120.00,
    method: "PayPal",
    status: "completed",
    referenceId: "PP-987321654",
    description: "Monthly payout for July 2023",
    commissions: 5,
    period: "Jul 1-31, 2023"
  },
  {
    id: "PAYOUT-008",
    date: "2023-06-01",
    amount: 85.00,
    method: "PayPal",
    status: "completed",
    referenceId: "PP-147258369",
    description: "Monthly payout for June 2023",
    commissions: 4,
    period: "Jun 1-30, 2023"
  },
]

const payoutColumns = [
  { key: "id", label: "Payout ID", sortable: true },
  { key: "date", label: "Date", sortable: true },
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
        failed: { icon: XCircle, variant: "destructive" as const, color: "text-red-600" },
        pending: { icon: Clock, variant: "secondary" as const, color: "text-yellow-600" }
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
  { key: "referenceId", label: "Reference ID", sortable: true },
  { key: "commissions", label: "Commissions", sortable: true },
  { key: "period", label: "Period", sortable: true },
]

export default function PayoutHistoryPage() {
  const [viewModalOpen, setViewModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [selectedPayout, setSelectedPayout] = useState<any>(null)
  const [payouts, setPayouts] = useState(payoutHistory)
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
    setEditModalOpen(false)
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
      date: new Date().toISOString().split('T')[0],
      status: "pending",
      referenceId: `REF-${Date.now()}`
    }
    setPayouts(prev => [...prev, newPayout])
    setCreateModalOpen(false)
  }

  const handleExport = () => {
    exportToCSV(payouts, "payout-history")
  }

  const completedPayouts = payouts.filter(p => p.status === "completed")
  const totalPaidOut = completedPayouts.reduce((sum, payout) => sum + payout.amount, 0)
  const averagePayout = totalPaidOut / completedPayouts.length
  const totalCommissions = payouts.reduce((sum, payout) => sum + payout.commissions, 0)

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Payout History</h1>
          <p className="text-slate-600">Complete history of your commission payouts</p>
        </div>
        <div className="flex items-center space-x-3">
          <Select defaultValue="all">
            <SelectTrigger className="w-40">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="6m">Last 6 Months</SelectItem>
              <SelectItem value="1y">Last Year</SelectItem>
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
            <CardTitle className="text-sm font-medium">Total Paid Out</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalPaidOut.toFixed(2)}</div>
            <p className="text-xs text-green-600">
              Lifetime earnings
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Payouts</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{payoutHistory.length}</div>
            <p className="text-xs text-slate-500">
              Payout transactions
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Payout</CardTitle>
            <CheckCircle className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${averagePayout.toFixed(2)}</div>
            <p className="text-xs text-slate-500">
              Per payout
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Commissions</CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCommissions}</div>
            <p className="text-xs text-slate-500">
              Commissions paid
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Payout History Table */}
      <DataTable
        title="Payout History"
        description="Complete history of your commission payouts"
        columns={payoutColumns}
        data={payouts}
        searchable={true}
        filterable={true}
        exportable={true}
        pagination={true}
        pageSize={10}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        exportFilename="payout-history"
      />

      {/* Payout Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Payout Trends</CardTitle>
            <CardDescription>Monthly payout performance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {payoutHistory.slice(0, 6).map((payout) => (
              <div key={payout.id} className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-sm">{payout.period}</p>
                  <p className="text-xs text-slate-500">{payout.commissions} commissions</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">${payout.amount.toFixed(2)}</p>
                  <Badge 
                    variant={payout.status === "completed" ? "default" : "destructive"}
                    className="text-xs"
                  >
                    {payout.status}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment Method</CardTitle>
            <CardDescription>Payout method distribution</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm">PayPal</span>
              </div>
              <span className="font-medium">100%</span>
            </div>
            <div className="text-xs text-slate-500">
              All payouts are processed through PayPal for fast and secure transfers.
            </div>
            <div className="pt-2 border-t">
              <h4 className="font-medium text-sm mb-2">Payout Schedule</h4>
              <ul className="text-xs text-slate-600 space-y-1">
                <li>• Monthly payouts on the 1st</li>
                <li>• Minimum $50 threshold</li>
                <li>• 2-3 business days processing</li>
                <li>• Automatic retry for failed payments</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payout Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Payout Statistics</CardTitle>
          <CardDescription>Key metrics and insights</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">87.5%</div>
              <div className="text-sm text-slate-500">Success Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">2.1</div>
              <div className="text-sm text-slate-500">Avg. Days to Process</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">$1,695</div>
              <div className="text-sm text-slate-500">Total Paid (2023)</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">8</div>
              <div className="text-sm text-slate-500">Months Active</div>
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
          { key: "date", label: "Date", type: "date" },
          { key: "amount", label: "Amount", type: "currency" },
          { key: "method", label: "Method", type: "text" },
          { key: "status", label: "Status", type: "status" },
          { key: "referenceId", label: "Reference ID", type: "text" },
          { key: "description", label: "Description", type: "text" },
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
          { key: "amount", label: "Amount", type: "number", required: true },
          { key: "method", label: "Method", type: "text", required: true },
          { key: "description", label: "Description", type: "textarea", required: true },
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
          { key: "amount", label: "Amount", type: "number", required: true },
          { key: "method", label: "Method", type: "text", required: true },
          { key: "description", label: "Description", type: "textarea", required: true },
          { key: "commissions", label: "Commissions", type: "number", required: true },
          { key: "period", label: "Period", type: "text", required: true }
        ]}
      />

      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Payout"
        message="Are you sure you want to delete this payout record? This action cannot be undone."
        itemName={selectedPayout?.id}
      />
    </div>
  )
}
