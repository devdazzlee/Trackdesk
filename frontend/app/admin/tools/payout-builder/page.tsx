"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { 
  CreditCard, 
  Plus, 
  Save, 
  Download,
  Eye,
  Settings,
  HelpCircle,
  DollarSign,
  Users,
  Calendar,
  CheckCircle
} from "lucide-react"

// Mock data for payout builder
const payoutRules = [
  {
    id: "RULE-001",
    name: "Standard Monthly Payout",
    description: "Monthly payout for all affiliates",
    conditions: "Balance &gt;= $50",
    amount: "Full Balance",
    frequency: "Monthly",
    dayOfMonth: 1,
    paymentMethod: "PayPal",
    status: "active",
    affiliates: 45,
    totalPayout: 2500.00,
    createdAt: "2024-01-01"
  },
  {
    id: "RULE-002",
    name: "Weekly Top Performers",
    description: "Weekly payout for top 10 affiliates",
    conditions: "Top 10 by revenue",
    amount: "Full Balance",
    frequency: "Weekly",
    dayOfWeek: "Monday",
    paymentMethod: "PayPal",
    status: "active",
    affiliates: 10,
    totalPayout: 1200.00,
    createdAt: "2024-01-01"
  },
  {
    id: "RULE-003",
    name: "Emergency Payout",
    description: "Emergency payout for urgent cases",
    conditions: "Manual approval",
    amount: "Custom Amount",
    frequency: "On Demand",
    paymentMethod: "Bank Transfer",
    status: "inactive",
    affiliates: 0,
    totalPayout: 0.00,
    createdAt: "2024-01-01"
  }
]

export default function PayoutBuilderPage() {
  const [selectedRule, setSelectedRule] = useState<string | null>(null)
  const [newRule, setNewRule] = useState({
    name: "",
    description: "",
    conditions: "",
    amount: "",
    frequency: "",
    paymentMethod: "",
    dayOfMonth: 1,
    dayOfWeek: "Monday"
  })

  const [previewOpen, setPreviewOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [rules, setRules] = useState(payoutRules)

  const handleCreateRule = () => {
    if (!newRule.name || !newRule.description || !newRule.amount) {
      alert("Please fill in all required fields")
      return
    }
    
    // Create rule object based on frequency type
    const baseRule = {
      id: `RULE-${Date.now()}`,
      name: newRule.name,
      description: newRule.description,
      conditions: newRule.conditions,
      amount: newRule.amount,
      frequency: newRule.frequency,
      paymentMethod: newRule.paymentMethod,
      status: "active",
      affiliates: 0,
      totalPayout: 0.00,
      createdAt: new Date().toISOString().split('T')[0]
    }

    const rule = newRule.frequency === "Weekly" 
      ? { ...baseRule, dayOfWeek: newRule.dayOfWeek }
      : { ...baseRule, dayOfMonth: newRule.dayOfMonth }
    
    setRules(prev => [rule, ...prev])
    setNewRule({
      name: "",
      description: "",
      conditions: "",
      amount: "",
      frequency: "",
      paymentMethod: "",
      dayOfMonth: 1,
      dayOfWeek: "Monday"
    })
    alert("Payout rule created successfully!")
  }

  const handlePreview = () => {
    setPreviewOpen(true)
  }

  const handleExportReport = () => {
    // Simulate export
    alert("Payout report exported successfully!")
  }

  const handleSchedulePayout = () => {
    // Simulate schedule
    alert("Payout scheduled successfully!")
  }

  const handleEditRule = (ruleId: string) => {
    setSelectedRule(ruleId)
    // Load rule data for editing
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center">
            Payout builder
            <HelpCircle className="h-5 w-5 ml-2 text-slate-400" />
          </h1>
          <p className="text-slate-600">Tools &gt; Payout builder</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm" onClick={handlePreview}>
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
          <Button onClick={handleCreateRule}>
            <Plus className="h-4 w-4 mr-2" />
            Create Rule
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Payout Rules List */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Payout Rules</CardTitle>
              <CardDescription>Configure automated payout rules</CardDescription>
            </CardHeader>
            <CardContent>
            <div className="space-y-4">
              {rules.map((rule) => (
                  <div
                    key={rule.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedRule === rule.id
                        ? "border-blue-500 bg-blue-50"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                    onClick={() => handleEditRule(rule.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-medium">{rule.name}</h3>
                          <Badge variant={rule.status === "active" ? "default" : "secondary"}>
                            {rule.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-600 mb-2">{rule.description}</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-slate-500">
                          <div>
                            <span className="font-medium">Frequency:</span>
                            <p>{rule.frequency}</p>
                          </div>
                          <div>
                            <span className="font-medium">Amount:</span>
                            <p>{rule.amount}</p>
                          </div>
                          <div>
                            <span className="font-medium">Method:</span>
                            <p>{rule.paymentMethod}</p>
                          </div>
                          <div>
                            <span className="font-medium">Affiliates:</span>
                            <p>{rule.affiliates}</p>
                          </div>
                        </div>
                      </div>
                      <div className="ml-4">
                        <Button variant="outline" size="sm">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Create New Rule */}
          <Card>
            <CardHeader>
              <CardTitle>Create New Payout Rule</CardTitle>
              <CardDescription>Set up a new automated payout rule</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="ruleName">Rule Name</Label>
                  <Input
                    id="ruleName"
                    value={newRule.name}
                    onChange={(e) => setNewRule(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter rule name"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="frequency">Frequency</Label>
                  <Select value={newRule.frequency} onValueChange={(value) => setNewRule(prev => ({ ...prev, frequency: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="on-demand">On Demand</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <textarea
                  id="description"
                  value={newRule.description}
                  onChange={(e) => setNewRule(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Describe the payout rule"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="conditions">Conditions</Label>
                  <Select value={newRule.conditions} onValueChange={(value) => setNewRule(prev => ({ ...prev, conditions: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select conditions" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="balance-50">Balance &gt;= $50</SelectItem>
                      <SelectItem value="balance-100">Balance &gt;= $100</SelectItem>
                      <SelectItem value="top-performers">Top 10 Performers</SelectItem>
                      <SelectItem value="manual">Manual Approval</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount</Label>
                  <Select value={newRule.amount} onValueChange={(value) => setNewRule(prev => ({ ...prev, amount: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select amount" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full">Full Balance</SelectItem>
                      <SelectItem value="custom">Custom Amount</SelectItem>
                      <SelectItem value="percentage">Percentage of Balance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="paymentMethod">Payment Method</Label>
                <Select value={newRule.paymentMethod} onValueChange={(value) => setNewRule(prev => ({ ...prev, paymentMethod: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="paypal">PayPal</SelectItem>
                    <SelectItem value="bank-transfer">Bank Transfer</SelectItem>
                    <SelectItem value="wire-transfer">Wire Transfer</SelectItem>
                    <SelectItem value="check">Check</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={handleCreateRule} className="w-full">
                <Save className="h-4 w-4 mr-2" />
                Create Payout Rule
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Payout Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Payout Summary</CardTitle>
              <CardDescription>Current payout status</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">$12,450</div>
                <div className="text-sm text-slate-500">Total Pending</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">45</div>
                <div className="text-sm text-slate-500">Affiliates</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">3</div>
                <div className="text-sm text-slate-500">Active Rules</div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common payout operations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <CreditCard className="h-4 w-4 mr-2" />
                Process Payouts
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={handleSchedulePayout}>
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Payout
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={handleExportReport}>
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
            </CardContent>
          </Card>

          {/* Payout History */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Payouts</CardTitle>
              <CardDescription>Last 5 payout transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { date: "2024-01-01", amount: "$4,500", status: "completed", affiliates: 45 },
                  { date: "2023-12-01", amount: "$3,200", status: "completed", affiliates: 38 },
                  { date: "2023-11-01", amount: "$2,800", status: "completed", affiliates: 32 },
                  { date: "2023-10-01", amount: "$1,950", status: "completed", affiliates: 28 },
                  { date: "2023-09-01", amount: "$1,200", status: "completed", affiliates: 22 },
                ].map((payout, index) => (
                  <div key={index} className="flex justify-between items-center p-2 border rounded">
                    <div>
                      <p className="text-sm font-medium">{payout.date}</p>
                      <p className="text-xs text-slate-500">{payout.affiliates} affiliates</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold">{payout.amount}</p>
                      <Badge variant="default" className="text-xs">
                        {payout.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Preview Modal */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Payout Rules Preview</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-4 bg-slate-50 rounded-lg">
              <h3 className="font-medium mb-2">Payout Summary</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Total Rules:</span> {rules.length}
                </div>
                <div>
                  <span className="font-medium">Active Rules:</span> {rules.filter(r => r.status === "active").length}
                </div>
                <div>
                  <span className="font-medium">Total Affiliates:</span> {rules.reduce((sum, r) => sum + r.affiliates, 0)}
                </div>
                <div>
                  <span className="font-medium">Total Payout:</span> ${rules.reduce((sum, r) => sum + r.totalPayout, 0).toFixed(2)}
                </div>
              </div>
            </div>

            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-2">Rules Preview</h3>
              <div className="space-y-3">
                {rules.slice(0, 3).map((rule) => (
                  <div key={rule.id} className="p-3 bg-white border rounded">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{rule.name}</h4>
                        <p className="text-sm text-slate-600">{rule.description}</p>
                        <div className="text-xs text-slate-500 mt-1">
                          Frequency: {rule.frequency} • Amount: ${rule.totalPayout}
                        </div>
                      </div>
                      <Badge variant={rule.status === "active" ? "default" : "secondary"}>
                        {rule.status}
                      </Badge>
                    </div>
                  </div>
                ))}
                {rules.length > 3 && (
                  <div className="text-center text-sm text-slate-500">
                    ... and {rules.length - 3} more rules
                  </div>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
