"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { 
  Zap, 
  Settings, 
  Play, 
  Pause, 
  Edit, 
  Trash2, 
  Copy, 
  Eye, 
  Plus,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Users,
  DollarSign,
  Target,
  Bell,
  Mail,
  Calendar,
  BarChart3,
  Save,
  Filter
} from "lucide-react"
import { toast } from "sonner"

// Mock data for automation workflows
const workflows = [
  {
    id: "WF-001",
    name: "Welcome Series",
    description: "Automated welcome email sequence for new affiliates",
    trigger: "affiliate_registered",
    status: "active",
    steps: [
      { id: "step-1", type: "email", action: "send_welcome", delay: 0 },
      { id: "step-2", type: "email", action: "send_resources", delay: 24 },
      { id: "step-3", type: "email", action: "send_tips", delay: 72 }
    ],
    executions: 1250,
    successRate: 95.2,
    lastRun: "2024-01-15T14:30:00Z",
    createdAt: "2024-01-01"
  },
  {
    id: "WF-002",
    name: "Payout Processing",
    description: "Automated payout processing for approved commissions",
    trigger: "commission_approved",
    status: "active",
    steps: [
      { id: "step-1", type: "condition", action: "check_minimum", delay: 0 },
      { id: "step-2", type: "payment", action: "process_payout", delay: 0 },
      { id: "step-3", type: "email", action: "send_confirmation", delay: 0 }
    ],
    executions: 890,
    successRate: 98.7,
    lastRun: "2024-01-15T14:25:00Z",
    createdAt: "2024-01-02"
  },
  {
    id: "WF-003",
    name: "Fraud Detection",
    description: "Automated fraud detection and blocking",
    trigger: "suspicious_activity",
    status: "active",
    steps: [
      { id: "step-1", type: "analysis", action: "analyze_patterns", delay: 0 },
      { id: "step-2", type: "condition", action: "check_threshold", delay: 0 },
      { id: "step-3", type: "action", action: "block_user", delay: 0 },
      { id: "step-4", type: "notification", action: "alert_admin", delay: 0 }
    ],
    executions: 45,
    successRate: 100,
    lastRun: "2024-01-15T14:20:00Z",
    createdAt: "2024-01-03"
  }
]

// Mock data for automation rules
const rules = [
  {
    id: "RULE-001",
    name: "High Performance Reward",
    description: "Automatically increase commission rate for top performers",
    trigger: "monthly_performance_review",
    conditions: [
      { field: "conversion_rate", operator: ">=", value: "15" },
      { field: "total_clicks", operator: ">=", value: "1000" }
    ],
    actions: [
      { type: "update_commission", value: "35" },
      { type: "send_notification", value: "performance_bonus" }
    ],
    status: "active",
    executions: 12,
    lastRun: "2024-01-01T00:00:00Z"
  },
  {
    id: "RULE-002",
    name: "Inactive Affiliate Alert",
    description: "Send reminder email to inactive affiliates",
    trigger: "affiliate_inactive",
    conditions: [
      { field: "last_activity", operator: ">", value: "30_days" },
      { field: "status", operator: "==", value: "active" }
    ],
    actions: [
      { type: "send_email", value: "inactivity_reminder" },
      { type: "update_status", value: "warning" }
    ],
    status: "active",
    executions: 8,
    lastRun: "2024-01-10T09:00:00Z"
  },
  {
    id: "RULE-003",
    name: "Commission Threshold",
    description: "Automatically process payouts when threshold is reached",
    trigger: "commission_earned",
    conditions: [
      { field: "available_balance", operator: ">=", value: "50" },
      { field: "payout_method", operator: "!=", value: "none" }
    ],
    actions: [
      { type: "create_payout", value: "auto" },
      { type: "send_notification", value: "payout_processed" }
    ],
    status: "active",
    executions: 156,
    lastRun: "2024-01-15T14:30:00Z"
  }
]

// Mock data for automation templates
const templates = [
  {
    id: "TEMP-001",
    name: "New Affiliate Onboarding",
    category: "onboarding",
    description: "Complete onboarding sequence for new affiliates",
    steps: 5,
    estimatedTime: "7 days",
    popularity: 95
  },
  {
    id: "TEMP-002",
    name: "Monthly Performance Review",
    category: "performance",
    description: "Automated monthly performance analysis and rewards",
    steps: 3,
    estimatedTime: "1 day",
    popularity: 87
  },
  {
    id: "TEMP-003",
    name: "Fraud Prevention",
    category: "security",
    description: "Comprehensive fraud detection and prevention",
    steps: 4,
    estimatedTime: "Real-time",
    popularity: 92
  }
]

export default function AutomationPage() {
  const [selectedTab, setSelectedTab] = useState("workflows")
  const [isCreating, setIsCreating] = useState(false)
  const [newWorkflow, setNewWorkflow] = useState({
    name: "",
    description: "",
    trigger: "",
    steps: []
  })

  const handleCreateWorkflow = () => {
    toast.success("Workflow created successfully!")
    setIsCreating(false)
  }

  const handleCreateRule = () => {
    toast.success("Rule created successfully!")
    setIsCreating(false)
  }

  const handleRunWorkflow = (workflowId: string) => {
    toast.success(`Workflow ${workflowId} executed successfully!`)
  }

  const handlePauseWorkflow = (workflowId: string) => {
    toast.success(`Workflow ${workflowId} paused`)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="default" className="bg-green-100 text-green-800">Active</Badge>
      case "paused":
        return <Badge variant="secondary">Paused</Badge>
      case "draft":
        return <Badge variant="outline">Draft</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  const getTriggerIcon = (trigger: string) => {
    switch (trigger) {
      case "affiliate_registered":
        return <Users className="h-4 w-4" />
      case "commission_approved":
        return <DollarSign className="h-4 w-4" />
      case "suspicious_activity":
        return <AlertTriangle className="h-4 w-4" />
      case "monthly_performance_review":
        return <BarChart3 className="h-4 w-4" />
      case "affiliate_inactive":
        return <Clock className="h-4 w-4" />
      case "commission_earned":
        return <Target className="h-4 w-4" />
      default:
        return <Zap className="h-4 w-4" />
    }
  }

  const getActionIcon = (type: string) => {
    switch (type) {
      case "email":
        return <Mail className="h-4 w-4" />
      case "notification":
        return <Bell className="h-4 w-4" />
      case "payment":
        return <DollarSign className="h-4 w-4" />
      case "condition":
        return <Filter className="h-4 w-4" />
      case "analysis":
        return <BarChart3 className="h-4 w-4" />
      case "action":
        return <Zap className="h-4 w-4" />
      default:
        return <Settings className="h-4 w-4" />
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center">
            <Zap className="h-6 w-6 mr-2 text-blue-600" />
            Automation
          </h1>
          <p className="text-slate-600">Workflows, rules, and automated processes</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
          <Button variant="outline" size="sm">
            <BarChart3 className="h-4 w-4 mr-2" />
            Analytics
          </Button>
        </div>
      </div>

      {/* Automation Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="workflows">Workflows</TabsTrigger>
          <TabsTrigger value="rules">Rules</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        {/* Workflows */}
        <TabsContent value="workflows" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Automation Workflows</h2>
              <p className="text-slate-600">Create and manage automated workflows</p>
            </div>
            <Dialog open={isCreating} onOpenChange={setIsCreating}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Workflow
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create Automation Workflow</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="workflowName">Workflow Name</Label>
                    <Input id="workflowName" placeholder="Enter workflow name" />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Input id="description" placeholder="Enter description" />
                  </div>
                  <div>
                    <Label htmlFor="trigger">Trigger Event</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select trigger" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="affiliate_registered">Affiliate Registered</SelectItem>
                        <SelectItem value="commission_approved">Commission Approved</SelectItem>
                        <SelectItem value="suspicious_activity">Suspicious Activity</SelectItem>
                        <SelectItem value="monthly_review">Monthly Review</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsCreating(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreateWorkflow}>
                      <Save className="h-4 w-4 mr-2" />
                      Create Workflow
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="space-y-4">
            {workflows.map((workflow) => (
              <Card key={workflow.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center">
                        {workflow.name}
                        {getStatusBadge(workflow.status)}
                      </CardTitle>
                      <CardDescription>
                        Created: {workflow.createdAt} • Executions: {workflow.executions}
                      </CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleRunWorkflow(workflow.id)}>
                        <Play className="h-4 w-4 mr-2" />
                        Run
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handlePauseWorkflow(workflow.id)}>
                        <Pause className="h-4 w-4 mr-2" />
                        Pause
                      </Button>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm">
                        <Copy className="h-4 w-4 mr-2" />
                        Copy
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium">Description</Label>
                      <p className="text-sm text-slate-600 mt-1">{workflow.description}</p>
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium">Trigger</Label>
                      <div className="flex items-center space-x-2 mt-2 p-2 bg-slate-50 rounded">
                        {getTriggerIcon(workflow.trigger)}
                        <span className="text-sm font-medium">{workflow.trigger.replace(/_/g, ' ')}</span>
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm font-medium">Workflow Steps</Label>
                      <div className="space-y-2 mt-2">
                        {workflow.steps.map((step, index) => (
                          <div key={step.id} className="flex items-center space-x-3 p-2 border rounded-lg">
                            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-xs font-medium text-blue-600">{index + 1}</span>
                            </div>
                            {getActionIcon(step.type)}
                            <span className="text-sm font-medium">{step.type}</span>
                            <span className="text-sm text-slate-600">{step.action}</span>
                            {step.delay > 0 && (
                              <Badge variant="outline" className="ml-auto">
                                {step.delay}h delay
                              </Badge>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                      <div className="text-center">
                        <div className="text-lg font-semibold text-blue-600">{workflow.executions}</div>
                        <div className="text-xs text-slate-500">Executions</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold text-green-600">{workflow.successRate}%</div>
                        <div className="text-xs text-slate-500">Success Rate</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold text-purple-600">
                          {new Date(workflow.lastRun).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-slate-500">Last Run</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Rules */}
        <TabsContent value="rules" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Automation Rules</h2>
              <p className="text-slate-600">Create conditional rules for automated actions</p>
            </div>
            <Dialog open={isCreating} onOpenChange={setIsCreating}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Rule
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create Automation Rule</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="ruleName">Rule Name</Label>
                    <Input id="ruleName" placeholder="Enter rule name" />
                  </div>
                  <div>
                    <Label htmlFor="ruleDescription">Description</Label>
                    <Input id="ruleDescription" placeholder="Enter description" />
                  </div>
                  <div>
                    <Label htmlFor="ruleTrigger">Trigger Event</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select trigger" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="monthly_performance_review">Monthly Performance Review</SelectItem>
                        <SelectItem value="affiliate_inactive">Affiliate Inactive</SelectItem>
                        <SelectItem value="commission_earned">Commission Earned</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsCreating(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreateRule}>
                      <Save className="h-4 w-4 mr-2" />
                      Create Rule
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="space-y-4">
            {rules.map((rule) => (
              <Card key={rule.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center">
                        {rule.name}
                        {getStatusBadge(rule.status)}
                      </CardTitle>
                      <CardDescription>
                        Executions: {rule.executions} • Last Run: {new Date(rule.lastRun).toLocaleDateString()}
                      </CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium">Description</Label>
                      <p className="text-sm text-slate-600 mt-1">{rule.description}</p>
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium">Trigger</Label>
                      <div className="flex items-center space-x-2 mt-2 p-2 bg-slate-50 rounded">
                        {getTriggerIcon(rule.trigger)}
                        <span className="text-sm font-medium">{rule.trigger.replace(/_/g, ' ')}</span>
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm font-medium">Conditions</Label>
                      <div className="space-y-2 mt-2">
                        {rule.conditions.map((condition, index) => (
                          <div key={index} className="flex items-center space-x-2 p-2 bg-slate-50 rounded">
                            <Filter className="h-4 w-4 text-slate-600" />
                            <span className="text-sm font-medium">{condition.field}</span>
                            <span className="text-sm text-slate-600">{condition.operator}</span>
                            <span className="text-sm font-medium">{condition.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm font-medium">Actions</Label>
                      <div className="space-y-2 mt-2">
                        {rule.actions.map((action, index) => (
                          <div key={index} className="flex items-center space-x-2 p-2 bg-blue-50 rounded">
                            <Zap className="h-4 w-4 text-blue-600" />
                            <span className="text-sm font-medium">{action.type}</span>
                            <span className="text-sm text-slate-600">{action.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Templates */}
        <TabsContent value="templates" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Automation Templates</h2>
              <p className="text-slate-600">Pre-built automation templates to get started quickly</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((template) => (
              <Card key={template.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {template.name}
                    <Badge variant="outline">{template.category}</Badge>
                  </CardTitle>
                  <CardDescription>{template.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">Steps:</span>
                      <span className="font-medium">{template.steps}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">Duration:</span>
                      <span className="font-medium">{template.estimatedTime}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">Popularity:</span>
                      <span className="font-medium">{template.popularity}%</span>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Eye className="h-4 w-4 mr-2" />
                        Preview
                      </Button>
                      <Button size="sm" className="flex-1">
                        <Plus className="h-4 w-4 mr-2" />
                        Use Template
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Performance Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Automation Performance</CardTitle>
          <CardDescription>Overall performance metrics for automation</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">3</div>
              <div className="text-sm text-slate-500">Active Workflows</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">3</div>
              <div className="text-sm text-slate-500">Automation Rules</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">2,185</div>
              <div className="text-sm text-slate-500">Total Executions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">97.6%</div>
              <div className="text-sm text-slate-500">Success Rate</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


