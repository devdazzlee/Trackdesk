"use client";

import { useState, useEffect } from "react";
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
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Settings,
  Save,
  DollarSign,
  Shield,
} from "lucide-react";
import { toast } from "sonner";
import { config } from "@/config/config";
import { getAuthHeaders } from "@/lib/getAuthHeaders";


export default function SystemSettingsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [settings, setSettings] = useState<{
    general: any;
    commission: {
      defaultRate: number;
      minimumPayout: number;
      payoutFrequency: string;
      approvalPeriod: number;
      cookieDuration: number;
    } | null;
    affiliate: any;
    security: any;
    notifications: any;
  }>({
    // General Settings
    general: {
      programName: "AffiliateHub",
      programDescription: "Professional affiliate management platform",
      timezone: "America/New_York",
      currency: "USD",
      language: "en",
    },
    // Commission Settings - will be loaded from API
    commission: null,
    // Affiliate Settings
    affiliate: {
      autoApprove: false,
      requireApproval: true,
      maxAffiliates: 1000,
      allowSelfReferrals: false,
      tierBasedCommissions: true,
    },
    // Security Settings
    security: {
      twoFactorRequired: false,
      ipWhitelist: false,
      sessionTimeout: 30,
      passwordPolicy: "strong",
      auditLogging: true,
    },
    // Notification Settings
    notifications: {
      emailNotifications: true,
      adminAlerts: true,
      affiliateWelcome: true,
      payoutNotifications: true,
      systemMaintenance: true,
    },
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch(`${config.apiUrl}/system/settings`, {
        headers: getAuthHeaders(),
        cache: "no-cache", // Prevent caching
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Fetched settings data:", data); // Debug log
        
        // Commission settings must come from API - no fallback
        if (!data.commission) {
          console.error("Commission settings not found in API response");
          toast.error("Commission settings not found. Please refresh the page.");
          return;
        }
        
        setSettings({
          general: data.general || {
            programName: "Trackdesk",
            programDescription: "Professional affiliate management platform",
            timezone: "America/New_York",
            currency: "USD",
            language: "en",
          },
          commission: data.commission,
          affiliate: data.affiliate || {
            autoApprove: false,
            requireApproval: true,
            maxAffiliates: 1000,
            allowSelfReferrals: false,
            tierBasedCommissions: true,
          },
          security: data.security || {
            twoFactorRequired: false,
            ipWhitelist: false,
            sessionTimeout: 30,
            passwordPolicy: "strong",
            auditLogging: true,
          },
          notifications: data.notifications || {
            emailNotifications: true,
            adminAlerts: true,
            affiliateWelcome: true,
            payoutNotifications: true,
            systemMaintenance: true,
          },
        });

      } else {
        console.error("Failed to fetch settings:", response.status);
        toast.error("Failed to load settings");
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
      toast.error("Failed to load settings");
    }
  };


  const handleSaveGeneral = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${config.apiUrl}/system/settings/general`, {
        method: "PUT",
        headers: getAuthHeaders(),
        cache: "no-cache", // Prevent caching
        body: JSON.stringify(settings.general),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("General settings update response:", data); // Debug log
        toast.success(data.message || "General settings updated successfully!");
        // Force refresh settings after successful update
        await fetchSettings();
      } else {
        const error = await response.json();
        console.error("General settings update error:", error);
        toast.error(error.error || "Failed to update general settings");
      }
    } catch (error) {
      console.error("Error updating general settings:", error);
      toast.error("Failed to update general settings");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveCommission = async () => {
    // Always update all affiliates when commission rate changes
    await saveCommissionSettings(true);
  };

  const saveCommissionSettings = async (updateAffiliates: boolean) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${config.apiUrl}/system/settings/commission`,
        {
          method: "PUT",
          headers: getAuthHeaders(),
          cache: "no-cache",
          body: JSON.stringify({
            ...settings.commission,
            updateAffiliates,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("Commission update response:", data);

        let message =
          data.message || "Commission settings updated successfully!";
        if (data.impact?.updatedAffiliates > 0) {
          message += ` (${data.impact.updatedAffiliates} affiliates updated)`;
        }

        toast.success(message);
        await fetchSettings();
      } else {
        const error = await response.json();
        console.error("Commission update error:", error);

        // Handle validation errors with better messages
        if (error.details && Array.isArray(error.details)) {
          const defaultRateError = error.details.find((detail: any) =>
            detail.path?.includes("defaultRate")
          );

          if (defaultRateError) {
            let errorMessage = defaultRateError.message;

            // If no message from backend, create a user-friendly one
            if (
              !errorMessage ||
              errorMessage === "Rate must be between 0 and 100"
            ) {
              if (defaultRateError.code === "too_big") {
                errorMessage = `Commission rate is too large. Please enter a value less than or equal to 100%.`;
              } else if (defaultRateError.code === "too_small") {
                errorMessage = `Commission rate is too small. Please enter a value greater than or equal to 0%.`;
              } else {
                errorMessage = `Invalid commission rate. Please enter a value between 0 and 100%.`;
              }
            }

            toast.error(errorMessage);
            return;
          }
        }

        toast.error(error.error || "Failed to update commission settings");
      }
    } catch (error) {
      console.error("Error updating commission settings:", error);
      toast.error("Failed to update commission settings");
    } finally {
      setIsLoading(false);
    }
  };


  const handleSettingChange = (section: string, key: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [key]: value,
      },
    }));
  };

  // Don't render commission settings if not loaded from API
  if (!settings.commission) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">System Settings</h1>
            <p className="text-slate-600">
              Configure your affiliate program settings
            </p>
          </div>
          <Badge variant="secondary" className="flex items-center gap-2">
            <Shield className="h-3 w-3" />
            Admin
          </Badge>
        </div>
        <div className="text-center py-8">
          <p className="text-muted-foreground">Loading commission settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">System Settings</h1>
          <p className="text-slate-600">
            Configure your affiliate program settings
          </p>
        </div>
        <Badge variant="secondary" className="flex items-center gap-2">
          <Shield className="h-3 w-3" />
          Admin
        </Badge>
      </div>

      {/* General Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <Settings className="h-5 w-5 mr-2" />
                General Settings
              </CardTitle>
              <CardDescription>Basic program configuration</CardDescription>
            </div>
            <Button onClick={handleSaveGeneral} disabled={isLoading} size="sm">
              <Save className="h-4 w-4 mr-2" />
              {isLoading ? "Saving..." : "Save"}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="programName">Program Name</Label>
              <Input
                id="programName"
                value={settings.general.programName}
                onChange={(e) =>
                  handleSettingChange("general", "programName", e.target.value)
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <Select
                value={settings.general.timezone}
                onValueChange={(value) =>
                  handleSettingChange("general", "timezone", value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="America/New_York">
                    Eastern Time (ET)
                  </SelectItem>
                  <SelectItem value="America/Chicago">
                    Central Time (CT)
                  </SelectItem>
                  <SelectItem value="America/Denver">
                    Mountain Time (MT)
                  </SelectItem>
                  <SelectItem value="America/Los_Angeles">
                    Pacific Time (PT)
                  </SelectItem>
                  <SelectItem value="Europe/London">London (GMT)</SelectItem>
                  <SelectItem value="Europe/Paris">Paris (CET)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Select
                value={settings.general.currency}
                onValueChange={(value) =>
                  handleSettingChange("general", "currency", value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD - US Dollar</SelectItem>
                  <SelectItem value="EUR">EUR - Euro</SelectItem>
                  <SelectItem value="GBP">GBP - British Pound</SelectItem>
                  <SelectItem value="CAD">CAD - Canadian Dollar</SelectItem>
                  <SelectItem value="AUD">AUD - Australian Dollar</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="language">Language</Label>
              <Select
                value={settings.general.language}
                onValueChange={(value) =>
                  handleSettingChange("general", "language", value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Spanish</SelectItem>
                  <SelectItem value="fr">French</SelectItem>
                  <SelectItem value="de">German</SelectItem>
                  <SelectItem value="it">Italian</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="programDescription">Program Description</Label>
            <textarea
              id="programDescription"
              value={settings.general.programDescription}
              onChange={(e) =>
                handleSettingChange(
                  "general",
                  "programDescription",
                  e.target.value
                )
              }
              rows={4}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </CardContent>
      </Card>

      {/* Commission Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <DollarSign className="h-5 w-5 mr-2" />
                Commission Settings
              </CardTitle>
              <CardDescription>
                Configure commission rates and payout terms
              </CardDescription>
            </div>
            <Button
              onClick={handleSaveCommission}
              disabled={isLoading}
              size="sm"
            >
              <Save className="h-4 w-4 mr-2" />
              {isLoading ? "Saving..." : "Save"}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="defaultRate">Default Commission Rate (%)</Label>
              <Input
                id="defaultRate"
                type="number"
                value={settings.commission.defaultRate}
                onChange={(e) =>
                  handleSettingChange(
                    "commission",
                    "defaultRate",
                    parseInt(e.target.value)
                  )
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="minimumPayout">Minimum Payout ($)</Label>
              <Input
                id="minimumPayout"
                type="number"
                step="0.01"
                value={settings.commission.minimumPayout}
                onChange={(e) =>
                  handleSettingChange(
                    "commission",
                    "minimumPayout",
                    parseFloat(e.target.value)
                  )
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="payoutFrequency">Payout Frequency</Label>
              <Select
                value={settings.commission.payoutFrequency}
                onValueChange={(value) =>
                  handleSettingChange("commission", "payoutFrequency", value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Weekly">Weekly</SelectItem>
                  <SelectItem value="Monthly">Monthly</SelectItem>
                  <SelectItem value="Quarterly">Quarterly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="approvalPeriod">Approval Period (days)</Label>
              <Input
                id="approvalPeriod"
                type="number"
                value={settings.commission.approvalPeriod}
                onChange={(e) =>
                  handleSettingChange(
                    "commission",
                    "approvalPeriod",
                    parseInt(e.target.value)
                  )
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cookieDuration">Cookie Duration (days)</Label>
              <Input
                id="cookieDuration"
                type="number"
                value={settings.commission.cookieDuration}
                onChange={(e) =>
                  handleSettingChange(
                    "commission",
                    "cookieDuration",
                    parseInt(e.target.value)
                  )
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>

    </div>
  );
}
