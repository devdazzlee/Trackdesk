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
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Bell, Mail, Smartphone, Save, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { config } from "@/config/config";

interface NotificationSettings {
  email: {
    newCommission: boolean;
    payoutProcessed: boolean;
    weeklyReport: boolean;
    monthlyReport: boolean;
    systemUpdates: boolean;
    marketingEmails: boolean;
  };
  push: {
    newCommission: boolean;
    payoutProcessed: boolean;
    highValueSale: boolean;
    systemAlerts: boolean;
  };
  preferences: {
    frequency: string;
    quietHours: {
      enabled: boolean;
      start: string;
      end: string;
    };
  };
}

export default function NotificationSettingsPage() {
  const [settings, setSettings] = useState<NotificationSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchNotificationSettings();
  }, []);

  const fetchNotificationSettings = async () => {
    try {
      const response = await fetch(`${config.apiUrl}/settings/notifications`, {
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setSettings(data);
      } else {
        console.error(
          "Failed to fetch notification settings:",
          response.status
        );
        toast.error("Failed to load notification settings");
      }
    } catch (error) {
      console.error("Error fetching notification settings:", error);
      toast.error("Failed to load notification settings");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!settings) return;

    setIsSaving(true);

    try {
      const response = await fetch(`${config.apiUrl}/settings/notifications`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(settings),
      });

      if (response.ok) {
        toast.success("Notification settings updated successfully");
        fetchNotificationSettings();
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to update settings");
      }
    } catch (error) {
      console.error("Error updating notification settings:", error);
      toast.error("Failed to update notification settings");
    } finally {
      setIsSaving(false);
    }
  };

  const updateEmailSetting = (
    key: keyof NotificationSettings["email"],
    value: boolean
  ) => {
    if (!settings) return;
    setSettings({
      ...settings,
      email: { ...settings.email, [key]: value },
    });
  };

  const updatePushSetting = (
    key: keyof NotificationSettings["push"],
    value: boolean
  ) => {
    if (!settings) return;
    setSettings({
      ...settings,
      push: { ...settings.push, [key]: value },
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Unable to Load Settings</h2>
          <Button onClick={fetchNotificationSettings}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">
          Notification Settings
        </h1>
        <p className="text-muted-foreground">
          Manage how you receive notifications
        </p>
      </div>

      {/* Email Notifications */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Mail className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <CardTitle>Email Notifications</CardTitle>
              <CardDescription>Receive updates via email</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <Label htmlFor="newCommission" className="font-medium">
                New Commission
              </Label>
              <p className="text-sm text-muted-foreground">
                Get notified when you earn a new commission
              </p>
            </div>
            <Switch
              id="newCommission"
              checked={settings.email.newCommission}
              onCheckedChange={(checked) =>
                updateEmailSetting("newCommission", checked)
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex-1">
              <Label htmlFor="payoutProcessed" className="font-medium">
                Payout Processed
              </Label>
              <p className="text-sm text-muted-foreground">
                Notification when your payout is processed
              </p>
            </div>
            <Switch
              id="payoutProcessed"
              checked={settings.email.payoutProcessed}
              onCheckedChange={(checked) =>
                updateEmailSetting("payoutProcessed", checked)
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex-1">
              <Label htmlFor="weeklyReport" className="font-medium">
                Weekly Report
              </Label>
              <p className="text-sm text-muted-foreground">
                Receive weekly performance summary
              </p>
            </div>
            <Switch
              id="weeklyReport"
              checked={settings.email.weeklyReport}
              onCheckedChange={(checked) =>
                updateEmailSetting("weeklyReport", checked)
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex-1">
              <Label htmlFor="monthlyReport" className="font-medium">
                Monthly Report
              </Label>
              <p className="text-sm text-muted-foreground">
                Receive monthly performance summary
              </p>
            </div>
            <Switch
              id="monthlyReport"
              checked={settings.email.monthlyReport}
              onCheckedChange={(checked) =>
                updateEmailSetting("monthlyReport", checked)
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex-1">
              <Label htmlFor="systemUpdates" className="font-medium">
                System Updates
              </Label>
              <p className="text-sm text-muted-foreground">
                Important system and feature updates
              </p>
            </div>
            <Switch
              id="systemUpdates"
              checked={settings.email.systemUpdates}
              onCheckedChange={(checked) =>
                updateEmailSetting("systemUpdates", checked)
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex-1">
              <Label htmlFor="marketingEmails" className="font-medium">
                Marketing Emails
              </Label>
              <p className="text-sm text-muted-foreground">
                Promotional offers and marketing content
              </p>
            </div>
            <Switch
              id="marketingEmails"
              checked={settings.email.marketingEmails}
              onCheckedChange={(checked) =>
                updateEmailSetting("marketingEmails", checked)
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Push Notifications */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
              <Smartphone className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <CardTitle>Push Notifications</CardTitle>
              <CardDescription>
                Receive push notifications on your devices
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <Label htmlFor="pushNewCommission" className="font-medium">
                New Commission
              </Label>
              <p className="text-sm text-muted-foreground">
                Instant notification for new earnings
              </p>
            </div>
            <Switch
              id="pushNewCommission"
              checked={settings.push.newCommission}
              onCheckedChange={(checked) =>
                updatePushSetting("newCommission", checked)
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex-1">
              <Label htmlFor="pushPayoutProcessed" className="font-medium">
                Payout Processed
              </Label>
              <p className="text-sm text-muted-foreground">
                Alert when payout is completed
              </p>
            </div>
            <Switch
              id="pushPayoutProcessed"
              checked={settings.push.payoutProcessed}
              onCheckedChange={(checked) =>
                updatePushSetting("payoutProcessed", checked)
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex-1">
              <Label htmlFor="highValueSale" className="font-medium">
                High Value Sale
              </Label>
              <p className="text-sm text-muted-foreground">
                Alert for high-value conversions
              </p>
            </div>
            <Switch
              id="highValueSale"
              checked={settings.push.highValueSale}
              onCheckedChange={(checked) =>
                updatePushSetting("highValueSale", checked)
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex-1">
              <Label htmlFor="systemAlerts" className="font-medium">
                System Alerts
              </Label>
              <p className="text-sm text-muted-foreground">
                Critical system notifications
              </p>
            </div>
            <Switch
              id="systemAlerts"
              checked={settings.push.systemAlerts}
              onCheckedChange={(checked) =>
                updatePushSetting("systemAlerts", checked)
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Notification Preferences */}
      <Card>
        <CardHeader>
          <CardTitle>Preferences</CardTitle>
          <CardDescription>
            Customize your notification experience
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="frequency">Notification Frequency</Label>
            <Select
              value={settings.preferences.frequency}
              onValueChange={(value) =>
                setSettings({
                  ...settings,
                  preferences: { ...settings.preferences, frequency: value },
                })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Immediate">Immediate</SelectItem>
                <SelectItem value="Daily Digest">Daily Digest</SelectItem>
                <SelectItem value="Weekly Digest">Weekly Digest</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3 pt-4 border-t">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label htmlFor="quietHours" className="font-medium">
                  Quiet Hours
                </Label>
                <p className="text-sm text-muted-foreground">
                  Pause notifications during specific hours
                </p>
              </div>
              <Switch
                id="quietHours"
                checked={settings.preferences.quietHours.enabled}
                onCheckedChange={(checked) =>
                  setSettings({
                    ...settings,
                    preferences: {
                      ...settings.preferences,
                      quietHours: {
                        ...settings.preferences.quietHours,
                        enabled: checked,
                      },
                    },
                  })
                }
              />
            </div>

            {settings.preferences.quietHours.enabled && (
              <div className="grid grid-cols-2 gap-4 pl-6">
                <div className="space-y-2">
                  <Label htmlFor="quietStart">Start Time</Label>
                  <Select
                    value={settings.preferences.quietHours.start}
                    onValueChange={(value) =>
                      setSettings({
                        ...settings,
                        preferences: {
                          ...settings.preferences,
                          quietHours: {
                            ...settings.preferences.quietHours,
                            start: value,
                          },
                        },
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 24 }, (_, i) => (
                        <SelectItem
                          key={i}
                          value={`${i.toString().padStart(2, "0")}:00`}
                        >
                          {i.toString().padStart(2, "0")}:00
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quietEnd">End Time</Label>
                  <Select
                    value={settings.preferences.quietHours.end}
                    onValueChange={(value) =>
                      setSettings({
                        ...settings,
                        preferences: {
                          ...settings.preferences,
                          quietHours: {
                            ...settings.preferences.quietHours,
                            end: value,
                          },
                        },
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 24 }, (_, i) => (
                        <SelectItem
                          key={i}
                          value={`${i.toString().padStart(2, "0")}:00`}
                        >
                          {i.toString().padStart(2, "0")}:00
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isSaving}>
          <Save className="w-4 h-4 mr-2" />
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}
