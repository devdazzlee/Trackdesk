"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Building2,
  Settings,
  Palette,
  Globe,
  Users,
  Shield,
  Crown,
  Plus,
  Edit,
  Trash2,
  Eye,
  Copy,
  Save,
  Upload,
  Download,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ExternalLink,
  Lock,
  Unlock,
} from "lucide-react";
import { toast } from "sonner";

// Mock data for white-label settings
const whiteLabelSettings = {
  companyName: "Trackdesk Pro",
  logo: "/logos/trackdesk-pro.png",
  favicon: "/favicons/trackdesk-pro.ico",
  primaryColor: "#3b82f6",
  secondaryColor: "#10b981",
  accentColor: "#f59e0b",
  customDomain: "affiliate.trackdesk.com",
  customEmail: "support@trackdesk.com",
  customSupportUrl: "https://support.trackdesk.com",
  removeBranding: true,
  customFooter: "© 2024 Trackdesk Pro. All rights reserved.",
  customTermsUrl: "https://trackdesk.com/terms",
  customPrivacyUrl: "https://trackdesk.com/privacy",
};

// Mock data for tenants
const tenants = [
  {
    id: "TENANT-001",
    name: "Acme Corporation",
    domain: "affiliate.acme.com",
    status: "active",
    plan: "enterprise",
    users: 45,
    affiliates: 1250,
    revenue: 125000,
    createdAt: "2024-01-01",
    settings: {
      branding: true,
      customDomain: true,
      apiAccess: true,
      whiteLabel: true,
    },
  },
  {
    id: "TENANT-002",
    name: "TechStart Inc",
    domain: "affiliate.techstart.com",
    status: "active",
    plan: "professional",
    users: 25,
    affiliates: 680,
    revenue: 68000,
    createdAt: "2024-01-15",
    settings: {
      branding: false,
      customDomain: true,
      apiAccess: true,
      whiteLabel: false,
    },
  },
  {
    id: "TENANT-003",
    name: "Global Solutions",
    domain: "affiliate.globalsolutions.com",
    status: "suspended",
    plan: "enterprise",
    users: 0,
    affiliates: 0,
    revenue: 0,
    createdAt: "2024-02-01",
    settings: {
      branding: true,
      customDomain: true,
      apiAccess: false,
      whiteLabel: true,
    },
  },
];

// Mock data for enterprise features
const enterpriseFeatures = [
  {
    id: "FEAT-001",
    name: "White-Label Branding",
    description: "Customize the platform with your own branding",
    status: "enabled",
    usage: "95%",
    cost: 500,
  },
  {
    id: "FEAT-002",
    name: "Custom Domain",
    description: "Use your own domain for the affiliate portal",
    status: "enabled",
    usage: "87%",
    cost: 200,
  },
  {
    id: "FEAT-003",
    name: "API Access",
    description: "Full API access for custom integrations",
    status: "enabled",
    usage: "78%",
    cost: 300,
  },
  {
    id: "FEAT-004",
    name: "Multi-Tenancy",
    description: "Support for multiple organizations",
    status: "enabled",
    usage: "92%",
    cost: 1000,
  },
  {
    id: "FEAT-005",
    name: "Advanced Analytics",
    description: "Custom analytics and reporting",
    status: "enabled",
    usage: "83%",
    cost: 400,
  },
  {
    id: "FEAT-006",
    name: "Priority Support",
    description: "24/7 priority support",
    status: "enabled",
    usage: "100%",
    cost: 600,
  },
];

export default function EnterprisePage() {
  const [selectedTab, setSelectedTab] = useState("white-label");
  const [isEditing, setIsEditing] = useState(false);
  const [settings, setSettings] = useState(whiteLabelSettings);

  const handleSaveSettings = () => {
    toast.success("Settings saved successfully!");
    setIsEditing(false);
  };

  const handleCreateTenant = () => {
    toast.success("Tenant created successfully!");
  };

  const handleSuspendTenant = (tenantId: string) => {
    toast.success(`Tenant ${tenantId} suspended`);
  };

  const handleActivateTenant = (tenantId: string) => {
    toast.success(`Tenant ${tenantId} activated`);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            Active
          </Badge>
        );
      case "suspended":
        return <Badge variant="destructive">Suspended</Badge>;
      case "pending":
        return <Badge variant="secondary">Pending</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const getPlanBadge = (plan: string) => {
    switch (plan) {
      case "enterprise":
        return (
          <Badge variant="default" className="bg-purple-100 text-purple-800">
            Enterprise
          </Badge>
        );
      case "professional":
        return (
          <Badge variant="default" className="bg-blue-100 text-blue-800">
            Professional
          </Badge>
        );
      case "basic":
        return <Badge variant="outline">Basic</Badge>;
      default:
        return <Badge variant="secondary">{plan}</Badge>;
    }
  };

  const getFeatureStatusIcon = (status: string) => {
    switch (status) {
      case "enabled":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "disabled":
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center">
            <Crown className="h-6 w-6 mr-2 text-purple-600" />
            Enterprise Features
          </h1>
          <p className="text-slate-600">
            White-labeling, multi-tenancy, and enterprise settings
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
          <Button variant="outline" size="sm">
            <Shield className="h-4 w-4 mr-2" />
            Security
          </Button>
        </div>
      </div>

      {/* Enterprise Tabs */}
      <Tabs
        value={selectedTab}
        onValueChange={setSelectedTab}
        className="space-y-6"
      >
        <TabsList>
          <TabsTrigger value="white-label">White-Label</TabsTrigger>
          <TabsTrigger value="tenants">Multi-Tenancy</TabsTrigger>
          <TabsTrigger value="features">Enterprise Features</TabsTrigger>
        </TabsList>

        {/* White-Label Settings */}
        <TabsContent value="white-label" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">White-Label Branding</h2>
              <p className="text-slate-600">
                Customize the platform with your own branding
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(true)}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Branding Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Palette className="h-5 w-5 mr-2" />
                  Branding Settings
                </CardTitle>
                <CardDescription>
                  Configure your brand appearance
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input
                    id="companyName"
                    value={settings.companyName}
                    onChange={(e) =>
                      setSettings({ ...settings, companyName: e.target.value })
                    }
                    disabled={!isEditing}
                  />
                </div>

                <div>
                  <Label htmlFor="logo">Logo URL</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="logo"
                      value={settings.logo}
                      onChange={(e) =>
                        setSettings({ ...settings, logo: e.target.value })
                      }
                      disabled={!isEditing}
                    />
                    <Button variant="outline" size="sm" disabled={!isEditing}>
                      <Upload className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="favicon">Favicon URL</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="favicon"
                      value={settings.favicon}
                      onChange={(e) =>
                        setSettings({ ...settings, favicon: e.target.value })
                      }
                      disabled={!isEditing}
                    />
                    <Button variant="outline" size="sm" disabled={!isEditing}>
                      <Upload className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="primaryColor">Primary Color</Label>
                    <Input
                      id="primaryColor"
                      type="color"
                      value={settings.primaryColor}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          primaryColor: e.target.value,
                        })
                      }
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="secondaryColor">Secondary Color</Label>
                    <Input
                      id="secondaryColor"
                      type="color"
                      value={settings.secondaryColor}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          secondaryColor: e.target.value,
                        })
                      }
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="accentColor">Accent Color</Label>
                    <Input
                      id="accentColor"
                      type="color"
                      value={settings.accentColor}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          accentColor: e.target.value,
                        })
                      }
                      disabled={!isEditing}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Domain Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Globe className="h-5 w-5 mr-2" />
                  Domain Settings
                </CardTitle>
                <CardDescription>
                  Configure custom domains and URLs
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="customDomain">Custom Domain</Label>
                  <Input
                    id="customDomain"
                    value={settings.customDomain}
                    onChange={(e) =>
                      setSettings({ ...settings, customDomain: e.target.value })
                    }
                    disabled={!isEditing}
                    placeholder="affiliate.yourcompany.com"
                  />
                </div>

                <div>
                  <Label htmlFor="customEmail">Support Email</Label>
                  <Input
                    id="customEmail"
                    value={settings.customEmail}
                    onChange={(e) =>
                      setSettings({ ...settings, customEmail: e.target.value })
                    }
                    disabled={!isEditing}
                    placeholder="support@yourcompany.com"
                  />
                </div>

                <div>
                  <Label htmlFor="customSupportUrl">Support URL</Label>
                  <Input
                    id="customSupportUrl"
                    value={settings.customSupportUrl}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        customSupportUrl: e.target.value,
                      })
                    }
                    disabled={!isEditing}
                    placeholder="https://support.yourcompany.com"
                  />
                </div>

                <div>
                  <Label htmlFor="customFooter">Footer Text</Label>
                  <Input
                    id="customFooter"
                    value={settings.customFooter}
                    onChange={(e) =>
                      setSettings({ ...settings, customFooter: e.target.value })
                    }
                    disabled={!isEditing}
                    placeholder="© 2024 Your Company. All rights reserved."
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    checked={settings.removeBranding}
                    onCheckedChange={(checked) =>
                      setSettings({ ...settings, removeBranding: checked })
                    }
                    disabled={!isEditing}
                  />
                  <Label>Remove Trackdesk Branding</Label>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Legal Pages */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Legal Pages
              </CardTitle>
              <CardDescription>
                Configure terms of service and privacy policy
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="customTermsUrl">Terms of Service URL</Label>
                  <Input
                    id="customTermsUrl"
                    value={settings.customTermsUrl}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        customTermsUrl: e.target.value,
                      })
                    }
                    disabled={!isEditing}
                    placeholder="https://yourcompany.com/terms"
                  />
                </div>
                <div>
                  <Label htmlFor="customPrivacyUrl">Privacy Policy URL</Label>
                  <Input
                    id="customPrivacyUrl"
                    value={settings.customPrivacyUrl}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        customPrivacyUrl: e.target.value,
                      })
                    }
                    disabled={!isEditing}
                    placeholder="https://yourcompany.com/privacy"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

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

        {/* Multi-Tenancy */}
        <TabsContent value="tenants" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Multi-Tenancy</h2>
              <p className="text-slate-600">
                Manage multiple organizations and tenants
              </p>
            </div>
            <Button onClick={handleCreateTenant}>
              <Plus className="h-4 w-4 mr-2" />
              Create Tenant
            </Button>
          </div>

          <div className="space-y-4">
            {tenants.map((tenant) => (
              <Card key={tenant.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center">
                        <Building2 className="h-5 w-5 mr-2" />
                        {tenant.name}
                        {getStatusBadge(tenant.status)}
                        {getPlanBadge(tenant.plan)}
                      </CardTitle>
                      <CardDescription>
                        Domain: {tenant.domain} • Created: {tenant.createdAt}
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
                      {tenant.status === "active" ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSuspendTenant(tenant.id)}
                        >
                          <Lock className="h-4 w-4 mr-2" />
                          Suspend
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleActivateTenant(tenant.id)}
                        >
                          <Unlock className="h-4 w-4 mr-2" />
                          Activate
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-lg font-semibold text-blue-600">
                          {tenant.users}
                        </div>
                        <div className="text-xs text-slate-500">Users</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold text-green-600">
                          {tenant.affiliates}
                        </div>
                        <div className="text-xs text-slate-500">Affiliates</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold text-purple-600">
                          ${tenant.revenue.toLocaleString()}
                        </div>
                        <div className="text-xs text-slate-500">Revenue</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold text-orange-600">
                          {tenant.plan}
                        </div>
                        <div className="text-xs text-slate-500">Plan</div>
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm font-medium">Features</Label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                        <div className="flex items-center space-x-2">
                          {tenant.settings.branding ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-600" />
                          )}
                          <span className="text-sm">Branding</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          {tenant.settings.customDomain ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-600" />
                          )}
                          <span className="text-sm">Custom Domain</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          {tenant.settings.apiAccess ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-600" />
                          )}
                          <span className="text-sm">API Access</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          {tenant.settings.whiteLabel ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-600" />
                          )}
                          <span className="text-sm">White Label</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Enterprise Features */}
        <TabsContent value="features" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Enterprise Features</h2>
              <p className="text-slate-600">
                Manage enterprise-level features and capabilities
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enterpriseFeatures.map((feature) => (
              <Card key={feature.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {feature.name}
                    {getFeatureStatusIcon(feature.status)}
                  </CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">Usage:</span>
                      <span className="font-medium">{feature.usage}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">Cost:</span>
                      <span className="font-medium">${feature.cost}/month</span>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Settings className="h-4 w-4 mr-2" />
                        Configure
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Feature Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Enterprise Feature Summary</CardTitle>
              <CardDescription>
                Overview of enterprise capabilities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">6</div>
                  <div className="text-sm text-slate-500">Total Features</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">6</div>
                  <div className="text-sm text-slate-500">Enabled Features</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">87%</div>
                  <div className="text-sm text-slate-500">Avg. Usage</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    $3,000
                  </div>
                  <div className="text-sm text-slate-500">Monthly Cost</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
