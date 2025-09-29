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
  Lock, 
  Key, 
  Eye, 
  EyeOff,
  UserCheck,
  Users,
  Settings,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Plus,
  Edit,
  Trash2,
  Copy,
  Download,
  Upload,
  RefreshCw,
  Save,
  QrCode,
  Smartphone,
  Mail,
  Clock,
  MapPin,
  Monitor
} from "lucide-react"
import { toast } from "sonner"

// Mock data for 2FA settings
const twoFactorSettings = {
  enabled: true,
  method: "totp", // totp, sms, email
  backupCodes: [
    "ABC123DEF456",
    "GHI789JKL012",
    "MNO345PQR678",
    "STU901VWX234",
    "YZA567BCD890"
  ],
  lastUsed: "2024-01-15T14:30:00Z",
  trustedDevices: [
    {
      id: "DEV-001",
      name: "MacBook Pro",
      type: "desktop",
      lastUsed: "2024-01-15T14:30:00Z",
      location: "New York, US",
      trusted: true
    },
    {
      id: "DEV-002",
      name: "iPhone 14",
      type: "mobile",
      lastUsed: "2024-01-15T14:25:00Z",
      location: "New York, US",
      trusted: true
    }
  ]
}

// Mock data for RBAC roles
const roles = [
  {
    id: "ROLE-001",
    name: "Super Admin",
    description: "Full system access and control",
    permissions: [
      "users.create", "users.read", "users.update", "users.delete",
      "affiliates.create", "affiliates.read", "affiliates.update", "affiliates.delete",
      "offers.create", "offers.read", "offers.update", "offers.delete",
      "payouts.create", "payouts.read", "payouts.update", "payouts.delete",
      "analytics.read", "reports.create", "reports.read", "reports.update",
      "settings.read", "settings.update", "system.admin"
    ],
    users: 2,
    status: "active",
    createdAt: "2024-01-01"
  },
  {
    id: "ROLE-002",
    name: "Affiliate Manager",
    description: "Manage affiliates and offers",
    permissions: [
      "affiliates.create", "affiliates.read", "affiliates.update",
      "offers.create", "offers.read", "offers.update",
      "analytics.read", "reports.read"
    ],
    users: 5,
    status: "active",
    createdAt: "2024-01-02"
  },
  {
    id: "ROLE-003",
    name: "Finance Manager",
    description: "Handle payouts and financial operations",
    permissions: [
      "payouts.create", "payouts.read", "payouts.update",
      "affiliates.read", "analytics.read", "reports.read"
    ],
    users: 3,
    status: "active",
    createdAt: "2024-01-03"
  },
  {
    id: "ROLE-004",
    name: "Viewer",
    description: "Read-only access to reports and analytics",
    permissions: [
      "analytics.read", "reports.read"
    ],
    users: 8,
    status: "active",
    createdAt: "2024-01-04"
  }
]

// Mock data for security logs
const securityLogs = [
  {
    id: "LOG-001",
    event: "login_success",
    user: "admin@trackdesk.com",
    ip: "192.168.1.100",
    location: "New York, US",
    device: "MacBook Pro",
    browser: "Chrome 120.0",
    timestamp: "2024-01-15T14:30:00Z",
    risk: "low"
  },
  {
    id: "LOG-002",
    event: "2fa_enabled",
    user: "manager@trackdesk.com",
    ip: "192.168.1.101",
    location: "Los Angeles, US",
    device: "iPhone 14",
    browser: "Safari 17.0",
    timestamp: "2024-01-15T14:25:00Z",
    risk: "low"
  },
  {
    id: "LOG-003",
    event: "failed_login",
    user: "unknown@trackdesk.com",
    ip: "203.0.113.1",
    location: "Unknown",
    device: "Unknown",
    browser: "Unknown",
    timestamp: "2024-01-15T14:20:00Z",
    risk: "high"
  },
  {
    id: "LOG-004",
    event: "permission_denied",
    user: "viewer@trackdesk.com",
    ip: "192.168.1.102",
    location: "Chicago, US",
    device: "Windows PC",
    browser: "Edge 120.0",
    timestamp: "2024-01-15T14:15:00Z",
    risk: "medium"
  }
]

// Mock data for encryption settings
const encryptionSettings = {
  dataEncryption: true,
  encryptionAlgorithm: "AES-256-GCM",
  keyRotation: "30 days",
  lastKeyRotation: "2024-01-01T00:00:00Z",
  encryptedFields: [
    "passwords", "api_keys", "payment_info", "personal_data"
  ],
  compliance: ["GDPR", "CCPA", "SOC2"]
}

export default function SecurityPage() {
  const [selectedTab, setSelectedTab] = useState("2fa")
  const [isCreating, setIsCreating] = useState(false)
  const [showBackupCodes, setShowBackupCodes] = useState(false)
  const [newRole, setNewRole] = useState({
    name: "",
    description: "",
    permissions: []
  })

  const handleEnable2FA = () => {
    toast.success("2FA enabled successfully!")
  }

  const handleDisable2FA = () => {
    toast.success("2FA disabled successfully!")
  }

  const handleGenerateBackupCodes = () => {
    toast.success("New backup codes generated!")
  }

  const handleCreateRole = () => {
    toast.success("Role created successfully!")
    setIsCreating(false)
  }

  const handleRevokeDevice = (deviceId: string) => {
    toast.success(`Device ${deviceId} revoked`)
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

  const getEventIcon = (event: string) => {
    switch (event) {
      case "login_success":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "failed_login":
        return <XCircle className="h-4 w-4 text-red-600" />
      case "2fa_enabled":
        return <Shield className="h-4 w-4 text-blue-600" />
      case "permission_denied":
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      default:
        return <Lock className="h-4 w-4 text-slate-600" />
    }
  }

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case "mobile":
        return <Smartphone className="h-4 w-4" />
      case "desktop":
        return <Monitor className="h-4 w-4" />
      default:
        return <Monitor className="h-4 w-4" />
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center">
            <Shield className="h-6 w-6 mr-2 text-blue-600" />
            Security
          </h1>
          <p className="text-slate-600">Two-factor authentication, role-based access control, and encryption</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Logs
          </Button>
        </div>
      </div>

      {/* Security Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="2fa">Two-Factor Auth</TabsTrigger>
          <TabsTrigger value="rbac">Role-Based Access</TabsTrigger>
          <TabsTrigger value="logs">Security Logs</TabsTrigger>
          <TabsTrigger value="encryption">Encryption</TabsTrigger>
        </TabsList>

        {/* Two-Factor Authentication */}
        <TabsContent value="2fa" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Two-Factor Authentication</h2>
              <p className="text-slate-600">Secure your account with additional authentication</p>
            </div>
            <div className="flex items-center space-x-2">
              {twoFactorSettings.enabled ? (
                <Button variant="outline" onClick={handleDisable2FA}>
                  <XCircle className="h-4 w-4 mr-2" />
                  Disable 2FA
                </Button>
              ) : (
                <Button onClick={handleEnable2FA}>
                  <Shield className="h-4 w-4 mr-2" />
                  Enable 2FA
                </Button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 2FA Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  2FA Status
                </CardTitle>
                <CardDescription>Current two-factor authentication status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Status</span>
                    <Badge variant={twoFactorSettings.enabled ? "default" : "secondary"}>
                      {twoFactorSettings.enabled ? "Enabled" : "Disabled"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Method</span>
                    <span className="font-medium">TOTP (Authenticator App)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Last Used</span>
                    <span className="font-medium">
                      {new Date(twoFactorSettings.lastUsed).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Trusted Devices</span>
                    <span className="font-medium">{twoFactorSettings.trustedDevices.length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Backup Codes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Key className="h-5 w-5 mr-2" />
                  Backup Codes
                </CardTitle>
                <CardDescription>Use these codes if you lose access to your authenticator</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Available Codes</span>
                    <span className="font-medium">{twoFactorSettings.backupCodes.length}</span>
                  </div>
                  <div className="space-y-2">
                    {showBackupCodes ? (
                      twoFactorSettings.backupCodes.map((code, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-slate-50 rounded">
                          <span className="font-mono text-sm">{code}</span>
                          <Button variant="outline" size="sm">
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-4">
                        <Button variant="outline" onClick={() => setShowBackupCodes(true)}>
                          <Eye className="h-4 w-4 mr-2" />
                          Show Backup Codes
                        </Button>
                      </div>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1" onClick={handleGenerateBackupCodes}>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Generate New
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Trusted Devices */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Smartphone className="h-5 w-5 mr-2" />
                Trusted Devices
              </CardTitle>
              <CardDescription>Devices that don't require 2FA verification</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {twoFactorSettings.trustedDevices.map((device) => (
                  <div key={device.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      {getDeviceIcon(device.type)}
                      <div>
                        <h3 className="font-medium">{device.name}</h3>
                        <p className="text-sm text-slate-600">
                          {device.location} • {new Date(device.lastUsed).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="default" className="bg-green-100 text-green-800">Trusted</Badge>
                      <Button variant="outline" size="sm" onClick={() => handleRevokeDevice(device.id)}>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Revoke
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Role-Based Access Control */}
        <TabsContent value="rbac" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Role-Based Access Control</h2>
              <p className="text-slate-600">Manage user roles and permissions</p>
            </div>
            <Dialog open={isCreating} onOpenChange={setIsCreating}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Role
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create New Role</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="roleName">Role Name</Label>
                    <Input id="roleName" placeholder="Enter role name" />
                  </div>
                  <div>
                    <Label htmlFor="roleDescription">Description</Label>
                    <Input id="roleDescription" placeholder="Enter role description" />
                  </div>
                  <div>
                    <Label>Permissions</Label>
                    <div className="space-y-2 mt-2">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" id="users-create" />
                          <Label htmlFor="users-create" className="text-sm">Users Create</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" id="users-read" />
                          <Label htmlFor="users-read" className="text-sm">Users Read</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" id="affiliates-create" />
                          <Label htmlFor="affiliates-create" className="text-sm">Affiliates Create</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" id="affiliates-read" />
                          <Label htmlFor="affiliates-read" className="text-sm">Affiliates Read</Label>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsCreating(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreateRole}>
                      <Save className="h-4 w-4 mr-2" />
                      Create Role
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="space-y-4">
            {roles.map((role) => (
              <Card key={role.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center">
                        <Users className="h-5 w-5 mr-2" />
                        {role.name}
                        <Badge variant="default" className="bg-green-100 text-green-800 ml-2">
                          {role.users} users
                        </Badge>
                      </CardTitle>
                      <CardDescription>
                        {role.description} • Created: {role.createdAt}
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
                      <Label className="text-sm font-medium">Permissions ({role.permissions.length})</Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {role.permissions.slice(0, 8).map((permission, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {permission}
                          </Badge>
                        ))}
                        {role.permissions.length > 8 && (
                          <Badge variant="secondary" className="text-xs">
                            +{role.permissions.length - 8} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Security Logs */}
        <TabsContent value="logs" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Security Logs</h2>
              <p className="text-slate-600">Monitor security events and access attempts</p>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            {securityLogs.map((log) => (
              <Card key={log.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {getEventIcon(log.event)}
                      <div>
                        <h3 className="font-medium">{log.event.replace(/_/g, ' ')}</h3>
                        <p className="text-sm text-slate-600">
                          {log.user} • {log.ip} • {log.location}
                        </p>
                        <p className="text-xs text-slate-500">
                          {log.device} • {log.browser} • {new Date(log.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getRiskBadge(log.risk)}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Encryption */}
        <TabsContent value="encryption" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Data Encryption</h2>
              <p className="text-slate-600">Encryption settings and compliance</p>
            </div>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Configure
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Lock className="h-5 w-5 mr-2" />
                  Encryption Status
                </CardTitle>
                <CardDescription>Current encryption configuration</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Data Encryption</span>
                    <Badge variant="default" className="bg-green-100 text-green-800">Enabled</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Algorithm</span>
                    <span className="font-medium">{encryptionSettings.encryptionAlgorithm}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Key Rotation</span>
                    <span className="font-medium">{encryptionSettings.keyRotation}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Last Rotation</span>
                    <span className="font-medium">
                      {new Date(encryptionSettings.lastKeyRotation).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  Compliance
                </CardTitle>
                <CardDescription>Security compliance standards</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {encryptionSettings.compliance.map((standard, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">{standard}</span>
                      <Badge variant="default" className="bg-green-100 text-green-800">Compliant</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Key className="h-5 w-5 mr-2" />
                Encrypted Fields
              </CardTitle>
              <CardDescription>Data fields that are encrypted</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {encryptionSettings.encryptedFields.map((field, index) => (
                  <div key={index} className="flex items-center space-x-2 p-3 bg-slate-50 rounded-lg">
                    <Lock className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium">{field}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}


