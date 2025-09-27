"use client"

import { useState } from "react"
import { DataTable } from "@/components/dashboard/data-table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  DollarSign, 
  CreditCard, 
  Calendar, 
  Download, 
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from "lucide-react"

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
    expectedPayout: "2024-02-01"
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
    expectedPayout: "2024-02-01"
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
    expectedPayout: "2024-02-01"
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
    expectedPayout: "2024-02-01"
  },
]

// Mock data for payout history
const payoutHistory = [
  {
    id: "PAYOUT-001",
    date: "2024-01-01",
    amount: 450.00,
    method: "PayPal",
    status: "completed",
    referenceId: "PP-123456789",
    description: "Monthly payout for December 2023"
  },
  {
    id: "PAYOUT-002",
    date: "2023-12-01",
    amount: 320.00,
    method: "PayPal",
    status: "completed",
    referenceId: "PP-987654321",
    description: "Monthly payout for November 2023"
  },
  {
    id: "PAYOUT-003",
    date: "2023-11-01",
    amount: 280.00,
    method: "PayPal",
    status: "completed",
    referenceId: "PP-456789123",
    description: "Monthly payout for October 2023"
  },
  {
    id: "PAYOUT-004",
    date: "2023-10-01",
    amount: 195.00,
    method: "PayPal",
    status: "failed",
    referenceId: "PP-789123456",
    description: "Monthly payout for September 2023"
  },
]

// Mock data for payout settings
const payoutSettings = {
  method: "PayPal",
  email: "affiliate@example.com",
  minimumPayout: 50.00,
  frequency: "Monthly",
  nextPayoutDate: "2024-02-01",
  availableBalance: 351.00,
  pendingBalance: 351.00
}

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
  { key: "description", label: "Description", sortable: true },
]

export default function CommissionsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("30d")

  const handleRequestWithdrawal = () => {
    if (payoutSettings.availableBalance >= payoutSettings.minimumPayout) {
      // Handle withdrawal request
      console.log("Requesting withdrawal...")
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Commissions & Payouts</h1>
          <p className="text-slate-600">Track your earnings and manage payouts</p>
        </div>
        <div className="flex items-center space-x-3">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
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
            <CardTitle className="text-sm font-medium">Available Balance</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${payoutSettings.availableBalance.toFixed(2)}</div>
            <p className="text-xs text-slate-500">
              Ready for withdrawal
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Commissions</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${payoutSettings.pendingBalance.toFixed(2)}</div>
            <p className="text-xs text-slate-500">
              Awaiting approval
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Paid Out</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$1,245.00</div>
            <p className="text-xs text-green-600 flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" />
              +15.3% from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Next Payout</CardTitle>
            <Calendar className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{payoutSettings.nextPayoutDate}</div>
            <p className="text-xs text-slate-500">
              Estimated date
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Payout Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Payout Settings</CardTitle>
          <CardDescription>Configure your payout preferences</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Payment Method</label>
              <div className="flex items-center space-x-2">
                <CreditCard className="h-4 w-4 text-slate-500" />
                <span className="text-sm">{payoutSettings.method}</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Payment Email</label>
              <p className="text-sm text-slate-600">{payoutSettings.email}</p>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Minimum Payout</label>
              <p className="text-sm text-slate-600">${payoutSettings.minimumPayout.toFixed(2)}</p>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Payout Frequency</label>
              <p className="text-sm text-slate-600">{payoutSettings.frequency}</p>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Available Balance</label>
              <p className="text-lg font-semibold text-green-600">
                ${payoutSettings.availableBalance.toFixed(2)}
              </p>
            </div>
            
            <div className="space-y-2">
              <Button 
                onClick={handleRequestWithdrawal}
                disabled={payoutSettings.availableBalance < payoutSettings.minimumPayout}
                className="w-full"
              >
                Request Withdrawal
              </Button>
              {payoutSettings.availableBalance < payoutSettings.minimumPayout && (
                <p className="text-xs text-slate-500 text-center">
                  Minimum ${payoutSettings.minimumPayout.toFixed(2)} required
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs for Commissions and Payouts */}
      <Tabs defaultValue="pending" className="space-y-6">
        <TabsList>
          <TabsTrigger value="pending">Pending Commissions</TabsTrigger>
          <TabsTrigger value="history">Payout History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="pending">
          <DataTable
            title="Pending Commissions"
            description="Commissions awaiting approval and payout"
            columns={pendingColumns}
            data={pendingCommissions}
            searchable={true}
            filterable={true}
            exportable={true}
            pagination={true}
            pageSize={10}
          />
        </TabsContent>
        
        <TabsContent value="history">
          <DataTable
            title="Payout History"
            description="Complete history of your payouts"
            columns={payoutColumns}
            data={payoutHistory}
            searchable={true}
            filterable={true}
            exportable={true}
            pagination={true}
            pageSize={10}
          />
        </TabsContent>
      </Tabs>

      {/* Commission Structure Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            Commission Structure
          </CardTitle>
          <CardDescription>Understanding how commissions are calculated</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium">Commission Rates</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Premium Plan</span>
                  <span className="text-sm font-medium">30%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Basic Plan</span>
                  <span className="text-sm font-medium">30%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Enterprise</span>
                  <span className="text-sm font-medium">30%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Starter</span>
                  <span className="text-sm font-medium">30%</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-medium">Payout Terms</h4>
              <div className="space-y-2 text-sm text-slate-600">
                <p>• Commissions are held for 30 days before payout</p>
                <p>• Monthly payouts on the 1st of each month</p>
                <p>• Minimum payout threshold: $50.00</p>
                <p>• PayPal payments processed within 2-3 business days</p>
                <p>• Failed payments will be retried automatically</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
