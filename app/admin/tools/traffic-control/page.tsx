"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { 
  Shield, 
  Plus, 
  Save, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Globe,
  Smartphone,
  Monitor,
  HelpCircle,
  Settings,
  Eye
} from "lucide-react"

// Mock data for traffic control
const trafficRules = [
  {
    id: "RULE-001",
    name: "Block Suspicious IPs",
    description: "Block IPs with suspicious activity patterns",
    type: "IP Blocking",
    status: "active",
    hits: 1250,
    lastTriggered: "2024-01-07 14:30:00"
  },
  {
    id: "RULE-002",
    name: "Rate Limiting",
    description: "Limit clicks per IP per hour",
    type: "Rate Limiting",
    status: "active",
    hits: 890,
    lastTriggered: "2024-01-07 13:45:00"
  },
  {
    id: "RULE-003",
    name: "Bot Detection",
    description: "Detect and block bot traffic",
    type: "Bot Detection",
    status: "active",
    hits: 2100,
    lastTriggered: "2024-01-07 12:20:00"
  },
  {
    id: "RULE-004",
    name: "Geographic Blocking",
    description: "Block traffic from specific countries",
    type: "Geographic",
    status: "inactive",
    hits: 0,
    lastTriggered: "Never"
  }
]

const blockedIPs = [
  { ip: "192.168.1.100", reason: "Suspicious activity", blockedAt: "2024-01-07 14:30:00", hits: 45 },
  { ip: "10.0.0.50", reason: "Bot traffic", blockedAt: "2024-01-07 13:45:00", hits: 120 },
  { ip: "172.16.0.25", reason: "Rate limit exceeded", blockedAt: "2024-01-07 12:20:00", hits: 89 },
  { ip: "203.0.113.10", reason: "Geographic restriction", blockedAt: "2024-01-06 16:30:00", hits: 67 },
]

export default function TrafficControlPage() {
  const [trafficSettings, setTrafficSettings] = useState({
    enableTrafficControl: true,
    enableBotDetection: true,
    enableRateLimiting: true,
    enableGeographicBlocking: false,
    maxClicksPerHour: 100,
    maxClicksPerDay: 1000,
    suspiciousActivityThreshold: 50
  })

  const [newRule, setNewRule] = useState({
    name: "",
    description: "",
    type: "",
    conditions: "",
    action: "block"
  })

  const [logsOpen, setLogsOpen] = useState(false)

  const handleSettingChange = (key: string, value: boolean | number) => {
    setTrafficSettings(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const [rules, setRules] = useState(trafficRules)

  const handleCreateRule = () => {
    if (!newRule.name || !newRule.description || !newRule.type) {
      alert("Please fill in all required fields")
      return
    }
    
    const rule = {
      ...newRule,
      id: `RULE-${Date.now()}`,
      status: "active",
      createdAt: new Date().toISOString().split('T')[0],
      triggeredCount: 0
    }
    
    setRules(prev => [rule, ...prev])
    alert("Traffic rule created successfully!")
    
    // Reset form
    setNewRule({
      name: "",
      description: "",
      type: "",
      conditions: "",
      action: "block"
    })
  }

  const handleViewLogs = () => {
    setLogsOpen(true)
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center">
            Traffic control
            <HelpCircle className="h-5 w-5 ml-2 text-slate-400" />
          </h1>
          <p className="text-slate-600">Tools &gt; Traffic control</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm" onClick={handleViewLogs}>
            <Eye className="h-4 w-4 mr-2" />
            View Logs
          </Button>
          <Button onClick={handleCreateRule}>
            <Plus className="h-4 w-4 mr-2" />
            Create Rule
          </Button>
        </div>
      </div>

      {/* Traffic Control Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="h-5 w-5 mr-2" />
            Traffic Control Status
          </CardTitle>
          <CardDescription>Current traffic control configuration</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-medium text-slate-900 mb-1">Traffic Control</h3>
              <Badge variant="default" className="bg-green-600">Active</Badge>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Shield className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-medium text-slate-900 mb-1">Bot Detection</h3>
              <Badge variant="default" className="bg-blue-600">Enabled</Badge>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <AlertTriangle className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-medium text-slate-900 mb-1">Rate Limiting</h3>
              <Badge variant="default" className="bg-purple-600">Active</Badge>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Globe className="h-6 w-6 text-yellow-600" />
              </div>
              <h3 className="font-medium text-slate-900 mb-1">Geo Blocking</h3>
              <Badge variant="outline" className="border-yellow-300 text-yellow-700">Disabled</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Traffic Control Rules */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Traffic Control Rules</CardTitle>
              <CardDescription>Configure traffic control and security rules</CardDescription>
            </CardHeader>
            <CardContent>
            <div className="space-y-4">
              {rules.map((rule) => (
                  <div key={rule.id} className="p-4 border rounded-lg hover:bg-slate-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-medium">{rule.name}</h3>
                          <Badge variant={rule.status === "active" ? "default" : "secondary"}>
                            {rule.status}
                          </Badge>
                          <Badge variant="outline">{rule.type}</Badge>
                        </div>
                        <p className="text-sm text-slate-600 mb-2">{rule.description}</p>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-xs text-slate-500">
                          <div>
                            <span className="font-medium">Hits:</span>
                            <p>{rule.hits}</p>
                          </div>
                          <div>
                            <span className="font-medium">Last Triggered:</span>
                            <p>{rule.lastTriggered}</p>
                          </div>
                          <div>
                            <span className="font-medium">Status:</span>
                            <p>{rule.status}</p>
                          </div>
                        </div>
                      </div>
                      <div className="ml-4 flex items-center space-x-2">
                        <Switch
                          checked={rule.status === "active"}
                          onCheckedChange={(checked) => {
                            console.log(`Rule ${rule.id} ${checked ? "activated" : "deactivated"}`)
                          }}
                        />
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
              <CardTitle>Create New Traffic Rule</CardTitle>
              <CardDescription>Set up a new traffic control rule</CardDescription>
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
                  <Label htmlFor="ruleType">Rule Type</Label>
                  <Select value={newRule.type} onValueChange={(value) => setNewRule(prev => ({ ...prev, type: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select rule type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ip-blocking">IP Blocking</SelectItem>
                      <SelectItem value="rate-limiting">Rate Limiting</SelectItem>
                      <SelectItem value="bot-detection">Bot Detection</SelectItem>
                      <SelectItem value="geographic">Geographic Blocking</SelectItem>
                      <SelectItem value="user-agent">User Agent Filtering</SelectItem>
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
                  placeholder="Describe the traffic control rule"
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
                      <SelectItem value="suspicious-activity">Suspicious Activity</SelectItem>
                      <SelectItem value="rate-limit-exceeded">Rate Limit Exceeded</SelectItem>
                      <SelectItem value="bot-traffic">Bot Traffic Detected</SelectItem>
                      <SelectItem value="geographic-restriction">Geographic Restriction</SelectItem>
                      <SelectItem value="user-agent-block">User Agent Block</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="action">Action</Label>
                  <Select value={newRule.action} onValueChange={(value) => setNewRule(prev => ({ ...prev, action: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select action" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="block">Block</SelectItem>
                      <SelectItem value="redirect">Redirect</SelectItem>
                      <SelectItem value="captcha">Show Captcha</SelectItem>
                      <SelectItem value="log">Log Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button onClick={handleCreateRule} className="w-full">
                <Save className="h-4 w-4 mr-2" />
                Create Traffic Rule
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Traffic Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Traffic Settings</CardTitle>
              <CardDescription>Configure traffic control parameters</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="enableTrafficControl">Enable Traffic Control</Label>
                  <p className="text-xs text-slate-500">Master switch for all traffic control</p>
                </div>
                <Switch
                  id="enableTrafficControl"
                  checked={trafficSettings.enableTrafficControl}
                  onCheckedChange={(checked) => handleSettingChange("enableTrafficControl", checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="enableBotDetection">Bot Detection</Label>
                  <p className="text-xs text-slate-500">Detect and block bot traffic</p>
                </div>
                <Switch
                  id="enableBotDetection"
                  checked={trafficSettings.enableBotDetection}
                  onCheckedChange={(checked) => handleSettingChange("enableBotDetection", checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="enableRateLimiting">Rate Limiting</Label>
                  <p className="text-xs text-slate-500">Limit clicks per IP</p>
                </div>
                <Switch
                  id="enableRateLimiting"
                  checked={trafficSettings.enableRateLimiting}
                  onCheckedChange={(checked) => handleSettingChange("enableRateLimiting", checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="enableGeographicBlocking">Geographic Blocking</Label>
                  <p className="text-xs text-slate-500">Block traffic from specific countries</p>
                </div>
                <Switch
                  id="enableGeographicBlocking"
                  checked={trafficSettings.enableGeographicBlocking}
                  onCheckedChange={(checked) => handleSettingChange("enableGeographicBlocking", checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Rate Limiting Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Rate Limiting</CardTitle>
              <CardDescription>Configure rate limiting parameters</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="maxClicksPerHour">Max Clicks Per Hour</Label>
                <Input
                  id="maxClicksPerHour"
                  type="number"
                  value={trafficSettings.maxClicksPerHour}
                  onChange={(e) => handleSettingChange("maxClicksPerHour", parseInt(e.target.value))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="maxClicksPerDay">Max Clicks Per Day</Label>
                <Input
                  id="maxClicksPerDay"
                  type="number"
                  value={trafficSettings.maxClicksPerDay}
                  onChange={(e) => handleSettingChange("maxClicksPerDay", parseInt(e.target.value))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="suspiciousActivityThreshold">Suspicious Activity Threshold</Label>
                <Input
                  id="suspiciousActivityThreshold"
                  type="number"
                  value={trafficSettings.suspiciousActivityThreshold}
                  onChange={(e) => handleSettingChange("suspiciousActivityThreshold", parseInt(e.target.value))}
                />
              </div>
            </CardContent>
          </Card>

          {/* Blocked IPs */}
          <Card>
            <CardHeader>
              <CardTitle>Blocked IPs</CardTitle>
              <CardDescription>Currently blocked IP addresses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {blockedIPs.map((blockedIP, index) => (
                  <div key={index} className="p-3 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium text-sm">{blockedIP.ip}</p>
                        <p className="text-xs text-slate-500">{blockedIP.reason}</p>
                      </div>
                      <Badge variant="destructive" className="text-xs">
                        Blocked
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center text-xs text-slate-500">
                      <span>{blockedIP.hits} hits</span>
                      <span>{blockedIP.blockedAt}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Traffic Logs Modal */}
      <Dialog open={logsOpen} onOpenChange={setLogsOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Traffic Control Logs</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-4 bg-slate-50 rounded-lg">
              <h3 className="font-medium mb-2">Recent Traffic Events</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center p-2 bg-white rounded border">
                  <div>
                    <span className="font-medium">IP Blocked:</span> 192.168.1.100
                    <span className="text-sm text-slate-500 ml-2">- Suspicious activity detected</span>
                  </div>
                  <span className="text-sm text-slate-500">2 minutes ago</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-white rounded border">
                  <div>
                    <span className="font-medium">Rate Limit:</span> 203.0.113.45
                    <span className="text-sm text-slate-500 ml-2">- Exceeded 100 clicks/hour</span>
                  </div>
                  <span className="text-sm text-slate-500">5 minutes ago</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-white rounded border">
                  <div>
                    <span className="font-medium">Bot Detected:</span> 10.0.0.50
                    <span className="text-sm text-slate-500 ml-2">- Automated traffic pattern</span>
                  </div>
                  <span className="text-sm text-slate-500">8 minutes ago</span>
                </div>
              </div>
            </div>
            
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-2">Traffic Statistics</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="text-center">
                  <div className="font-bold text-lg text-red-600">45</div>
                  <div className="text-slate-500">Blocked Today</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-lg text-yellow-600">12</div>
                  <div className="text-slate-500">Rate Limited</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-lg text-blue-600">8</div>
                  <div className="text-slate-500">Bot Detected</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-lg text-green-600">2,450</div>
                  <div className="text-slate-500">Legitimate Traffic</div>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
