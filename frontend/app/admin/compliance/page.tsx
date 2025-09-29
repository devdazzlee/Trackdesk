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
  Shield, 
  FileText, 
  Download, 
  Upload, 
  Eye, 
  Trash2, 
  Edit, 
  Plus,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  User,
  Database,
  Lock,
  Globe,
  Settings,
  Save,
  Search,
  Filter,
  Calendar,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Activity
} from "lucide-react"
import { toast } from "sonner"

// Mock data for GDPR compliance
const gdprSettings = {
  enabled: true,
  dataRetentionPeriod: "7 years",
  consentRequired: true,
  rightToErasure: true,
  dataPortability: true,
  privacyPolicyUrl: "https://trackdesk.com/privacy",
  termsOfServiceUrl: "https://trackdesk.com/terms",
  cookieConsent: true,
  dataProcessingBasis: "consent",
  dpoEmail: "dpo@trackdesk.com"
}

// Mock data for data requests
const dataRequests = [
  {
    id: "REQ-001",
    type: "data_export",
    user: "john.doe@example.com",
    status: "completed",
    requestedAt: "2024-01-10T10:00:00Z",
    completedAt: "2024-01-10T14:30:00Z",
    dataSize: "2.3 MB",
    downloadUrl: "https://trackdesk.com/downloads/req-001.zip"
  },
  {
    id: "REQ-002",
    type: "data_deletion",
    user: "jane.smith@example.com",
    status: "pending",
    requestedAt: "2024-01-12T09:15:00Z",
    completedAt: null,
    dataSize: null,
    downloadUrl: null
  },
  {
    id: "REQ-003",
    type: "data_correction",
    user: "bob.wilson@example.com",
    status: "in_progress",
    requestedAt: "2024-01-14T16:45:00Z",
    completedAt: null,
    dataSize: null,
    downloadUrl: null
  }
]

// Mock data for audit trails
const auditTrails = [
  {
    id: "AUDIT-001",
    action: "user_login",
    user: "admin@trackdesk.com",
    resource: "User Account",
    details: "Successful login from 192.168.1.100",
    ipAddress: "192.168.1.100",
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
    timestamp: "2024-01-15T14:30:00Z",
    risk: "low"
  },
  {
    id: "AUDIT-002",
    action: "data_export",
    user: "manager@trackdesk.com",
    resource: "Affiliate Data",
    details: "Exported 1,250 affiliate records",
    ipAddress: "192.168.1.101",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
    timestamp: "2024-01-15T14:25:00Z",
    risk: "medium"
  },
  {
    id: "AUDIT-003",
    action: "permission_change",
    user: "admin@trackdesk.com",
    resource: "User Role",
    details: "Changed role permissions for user manager@trackdesk.com",
    ipAddress: "192.168.1.100",
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
    timestamp: "2024-01-15T14:20:00Z",
    risk: "high"
  },
  {
    id: "AUDIT-004",
    action: "data_deletion",
    user: "system@trackdesk.com",
    resource: "User Data",
    details: "Deleted user data for GDPR request REQ-002",
    ipAddress: "192.168.1.102",
    userAgent: "Trackdesk System",
    timestamp: "2024-01-15T14:15:00Z",
    risk: "high"
  }
]

// Mock data for compliance reports
const complianceReports = [
  {
    id: "REPORT-001",
    name: "GDPR Compliance Report",
    type: "gdpr",
    period: "Q4 2023",
    status: "completed",
    generatedAt: "2024-01-01T00:00:00Z",
    findings: [
      { category: "Data Processing", status: "compliant", issues: 0 },
      { category: "Consent Management", status: "compliant", issues: 0 },
      { category: "Data Retention", status: "compliant", issues: 0 },
      { category: "Right to Erasure", status: "compliant", issues: 0 }
    ]
  },
  {
    id: "REPORT-002",
    name: "SOC 2 Type II Report",
    type: "soc2",
    period: "2023",
    status: "in_progress",
    generatedAt: "2024-01-15T00:00:00Z",
    findings: [
      { category: "Security", status: "compliant", issues: 0 },
      { category: "Availability", status: "compliant", issues: 0 },
      { category: "Processing Integrity", status: "compliant", issues: 0 },
      { category: "Confidentiality", status: "compliant", issues: 0 }
    ]
  }
]

export default function CompliancePage() {
  const [selectedTab, setSelectedTab] = useState("gdpr")
  const [isEditing, setIsEditing] = useState(false)
  const [settings, setSettings] = useState(gdprSettings)

  const handleSaveSettings = () => {
    toast.success("Compliance settings saved!")
    setIsEditing(false)
  }

  const handleProcessRequest = (requestId: string) => {
    toast.success(`Request ${requestId} processed successfully!`)
  }

  const handleGenerateReport = () => {
    toast.success("Compliance report generated!")
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge variant="default" className="bg-green-100 text-green-800">Completed</Badge>
      case "pending":
        return <Badge variant="secondary">Pending</Badge>
      case "in_progress":
        return <Badge variant="default" className="bg-blue-100 text-blue-800">In Progress</Badge>
      case "compliant":
        return <Badge variant="default" className="bg-green-100 text-green-800">Compliant</Badge>
      case "non_compliant":
        return <Badge variant="destructive">Non-Compliant</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case "low":
        return <Badge variant="default" className="bg-green-100 text-green-800">Low</Badge>
      case "medium":
        return <Badge variant="default" className="bg-yellow-100 text-yellow-800">Medium</Badge>
      case "high":
        return <Badge variant="destructive">High</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  const getActionIcon = (action: string) => {
    switch (action) {
      case "user_login":
        return <User className="h-4 w-4 text-green-600" />
      case "data_export":
        return <Download className="h-4 w-4 text-blue-600" />
      case "permission_change":
        return <Settings className="h-4 w-4 text-yellow-600" />
      case "data_deletion":
        return <Trash2 className="h-4 w-4 text-red-600" />
      default:
        return <Activity className="h-4 w-4 text-slate-600" />
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center">
            <Shield className="h-6 w-6 mr-2 text-blue-600" />
            Compliance
          </h1>
          <p className="text-slate-600">GDPR compliance, audit trails, and regulatory reporting</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
          <Button variant="outline" size="sm" onClick={handleGenerateReport}>
            <FileText className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
        </div>
      </div>

      {/* Compliance Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="gdpr">GDPR</TabsTrigger>
          <TabsTrigger value="requests">Data Requests</TabsTrigger>
          <TabsTrigger value="audit">Audit Trails</TabsTrigger>
          <TabsTrigger value="reports">Compliance Reports</TabsTrigger>
        </TabsList>

        {/* GDPR Compliance */}
        <TabsContent value="gdpr" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">GDPR Compliance</h2>
              <p className="text-slate-600">General Data Protection Regulation settings</p>
            </div>
            <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Settings
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  GDPR Settings
                </CardTitle>
                <CardDescription>Configure GDPR compliance settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">GDPR Enabled</span>
                  <Switch
                    checked={settings.enabled}
                    onCheckedChange={(checked) => setSettings({...settings, enabled: checked})}
                    disabled={!isEditing}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Consent Required</span>
                  <Switch
                    checked={settings.consentRequired}
                    onCheckedChange={(checked) => setSettings({...settings, consentRequired: checked})}
                    disabled={!isEditing}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Right to Erasure</span>
                  <Switch
                    checked={settings.rightToErasure}
                    onCheckedChange={(checked) => setSettings({...settings, rightToErasure: checked})}
                    disabled={!isEditing}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Data Portability</span>
                  <Switch
                    checked={settings.dataPortability}
                    onCheckedChange={(checked) => setSettings({...settings, dataPortability: checked})}
                    disabled={!isEditing}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Cookie Consent</span>
                  <Switch
                    checked={settings.cookieConsent}
                    onCheckedChange={(checked) => setSettings({...settings, cookieConsent: checked})}
                    disabled={!isEditing}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Legal Documents
                </CardTitle>
                <CardDescription>Privacy policy and terms of service</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="dataRetention">Data Retention Period</Label>
                  <Input 
                    id="dataRetention" 
                    value={settings.dataRetentionPeriod}
                    onChange={(e) => setSettings({...settings, dataRetentionPeriod: e.target.value})}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="privacyPolicy">Privacy Policy URL</Label>
                  <Input 
                    id="privacyPolicy" 
                    value={settings.privacyPolicyUrl}
                    onChange={(e) => setSettings({...settings, privacyPolicyUrl: e.target.value})}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="termsOfService">Terms of Service URL</Label>
                  <Input 
                    id="termsOfService" 
                    value={settings.termsOfServiceUrl}
                    onChange={(e) => setSettings({...settings, termsOfServiceUrl: e.target.value})}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="dpoEmail">DPO Email</Label>
                  <Input 
                    id="dpoEmail" 
                    value={settings.dpoEmail}
                    onChange={(e) => setSettings({...settings, dpoEmail: e.target.value})}
                    disabled={!isEditing}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          {isEditing && (
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveSettings}>
                <Save className="h-4 w-4 mr-2" />
                Save Settings
              </Button>
            </div>
          )}
        </TabsContent>

        {/* Data Requests */}
        <TabsContent value="requests" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Data Requests</h2>
              <p className="text-slate-600">Manage GDPR data subject requests</p>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            {dataRequests.map((request) => (
              <Card key={request.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center">
                        <FileText className="h-5 w-5 mr-2" />
                        {request.type.replace(/_/g, ' ').toUpperCase()}
                        {getStatusBadge(request.status)}
                      </CardTitle>
                      <CardDescription>
                        User: {request.user} • Requested: {new Date(request.requestedAt).toLocaleString()}
                      </CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                      {request.status === "pending" && (
                        <Button variant="outline" size="sm" onClick={() => handleProcessRequest(request.id)}>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Process
                        </Button>
                      )}
                      {request.downloadUrl && (
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-lg font-semibold text-blue-600">
                        {request.completedAt ? new Date(request.completedAt).toLocaleDateString() : 'N/A'}
                      </div>
                      <div className="text-xs text-slate-500">Completed</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold text-green-600">
                        {request.dataSize || 'N/A'}
                      </div>
                      <div className="text-xs text-slate-500">Data Size</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold text-purple-600">
                        {request.type.replace(/_/g, ' ')}
                      </div>
                      <div className="text-xs text-slate-500">Request Type</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold text-orange-600">
                        {request.id}
                      </div>
                      <div className="text-xs text-slate-500">Request ID</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Audit Trails */}
        <TabsContent value="audit" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Audit Trails</h2>
              <p className="text-slate-600">Track all system activities and changes</p>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            {auditTrails.map((audit) => (
              <Card key={audit.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {getActionIcon(audit.action)}
                      <div>
                        <h3 className="font-medium">{audit.action.replace(/_/g, ' ')}</h3>
                        <p className="text-sm text-slate-600">
                          {audit.user} • {audit.resource} • {audit.details}
                        </p>
                        <p className="text-xs text-slate-500">
                          {audit.ipAddress} • {audit.userAgent} • {new Date(audit.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getRiskBadge(audit.risk)}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Compliance Reports */}
        <TabsContent value="reports" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Compliance Reports</h2>
              <p className="text-slate-600">Generate and view compliance reports</p>
            </div>
            <Button onClick={handleGenerateReport}>
              <Plus className="h-4 w-4 mr-2" />
              Generate Report
            </Button>
          </div>

          <div className="space-y-4">
            {complianceReports.map((report) => (
              <Card key={report.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center">
                        <FileText className="h-5 w-5 mr-2" />
                        {report.name}
                        {getStatusBadge(report.status)}
                      </CardTitle>
                      <CardDescription>
                        Type: {report.type.toUpperCase()} • Period: {report.period} • Generated: {new Date(report.generatedAt).toLocaleString()}
                      </CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium">Compliance Findings</Label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                        {report.findings.map((finding, index) => (
                          <div key={index} className="text-center p-3 border rounded-lg">
                            <div className="text-sm font-medium">{finding.category}</div>
                            <div className="mt-1">
                              {finding.status === "compliant" ? (
                                <CheckCircle className="h-4 w-4 text-green-600 mx-auto" />
                              ) : (
                                <XCircle className="h-4 w-4 text-red-600 mx-auto" />
                              )}
                            </div>
                            <div className="text-xs text-slate-600 mt-1">
                              {finding.issues} issues
                            </div>
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
      </Tabs>
    </div>
  )
}


