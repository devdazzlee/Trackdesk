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
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Globe, Plus, Copy, Check, Trash2, Info, Shield } from "lucide-react";
import { toast } from "sonner";
import { config } from "@/config/config";
import { getAuthHeaders } from "@/lib/getAuthHeaders";

interface Website {
  id: string;
  name: string;
  domain: string;
  websiteId: string; // This is the unique identifier for tracking
  description?: string | null;
  createdAt: string;
  updatedAt: string;
  status: "ACTIVE" | "PAUSED" | "INACTIVE";
  createdBy?: string | null;
}

export default function AdminWebsitesSettingsPage() {
  const [websites, setWebsites] = useState<Website[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    domain: "",
    description: "",
  });

  // Admin has full access - can create, edit, delete
  const isAdmin = true;

  useEffect(() => {
    loadWebsites();
  }, []);

  const loadWebsites = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${config.apiUrl}/websites`, {
        method: "GET",
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Failed to load websites: ${response.statusText}`);
      }

      const data = await response.json();
      if (data.success && data.websites) {
        setWebsites(data.websites);
      } else {
        setWebsites([]);
      }
    } catch (error) {
      console.error("Error loading websites:", error);
      toast.error("Failed to load websites. Please try again.");
      setWebsites([]);
    } finally {
      setIsLoading(false);
    }
  };

  const generateWebsiteId = (domain?: string): string => {
    if (domain) {
      // Convert domain to websiteId format
      return domain
        .replace(/\./g, "-")
        .replace(/https?:\/\//, "")
        .replace(/^www\./, "")
        .toLowerCase();
    }
    // Generate UUID-like ID
    return (
      "website-" +
      Math.random().toString(36).substr(2, 9) +
      "-" +
      Date.now().toString(36)
    );
  };

  const handleCreateWebsite = async () => {
    if (!formData.name || !formData.domain) {
      toast.error("Please fill in name and domain");
      return;
    }

    try {
      const websiteId = generateWebsiteId(formData.domain);
      const response = await fetch(`${config.apiUrl}/websites`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          name: formData.name,
          domain: formData.domain,
          websiteId: websiteId,
          description: formData.description || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create website");
      }
      if (data.success && data.website) {
        // Reload websites from API
        await loadWebsites();
        setFormData({ name: "", domain: "", description: "" });
        setShowCreateForm(false);
        toast.success("Website created successfully!");
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error: any) {
      console.error("Error creating website:", error);
      toast.error(
        error.message || "Failed to create website. Please try again."
      );
    }
  };

  const handleDeleteWebsite = async (id: string) => {
    if (!confirm("Are you sure you want to delete this website?")) {
      return;
    }

    try {
      const response = await fetch(`${config.apiUrl}/websites/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete website");
      }

      // Reload websites from API
      await loadWebsites();
      toast.success("Website deleted successfully");
    } catch (error: any) {
      console.error("Error deleting website:", error);
      toast.error(
        error.message || "Failed to delete website. Please try again."
      );
    }
  };

  const handleCopyWebsiteId = (websiteId: string) => {
    navigator.clipboard.writeText(websiteId);
    setCopiedId(websiteId);
    toast.success("Website ID copied to clipboard!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const copyEnvVariable = (websiteId: string) => {
    const envVar = `NEXT_PUBLIC_TRACKDESK_WEBSITE_ID=${websiteId}`;
    navigator.clipboard.writeText(envVar);
    toast.success("Environment variable copied!");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Manage Websites</h1>
          <p className="text-muted-foreground mt-2">
            Create and manage all websites. Full admin access to create, edit,
            and delete websites.
          </p>
        </div>
        <Badge
          variant="default"
          className="flex items-center gap-2 bg-green-600"
        >
          <Shield className="h-3 w-3" />
          Admin - Full Access
        </Badge>
      </div>

      {/* Info Card */}
      <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950/20">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Info className="h-5 w-5 text-blue-600" />
            <CardTitle className="text-blue-900 dark:text-blue-100">
              What is a Website ID?
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-blue-800 dark:text-blue-200">
            A <strong>Website ID</strong> is a unique identifier for each of
            your websites that you'll use in your Next.js projects. This ID
            tells Trackdesk which website the tracking events are coming from.
          </p>
          <div className="mt-4 p-3 bg-green-50 dark:bg-green-950/20 border border-green-200 rounded-lg">
            <p className="text-sm text-green-800 dark:text-green-200 flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <strong>Admin Access:</strong> You have full permissions to
              create, edit, and delete websites. All changes affect all users in
              the system.
            </p>
          </div>
          <div className="mt-4 space-y-2 text-sm">
            <p className="font-semibold text-blue-900 dark:text-blue-100">
              Use this Website ID in your{" "}
              <code className="bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded">
                .env.local
              </code>{" "}
              file:
            </p>
            <code className="block bg-blue-100 dark:bg-blue-900 p-3 rounded text-xs">
              NEXT_PUBLIC_TRACKDESK_WEBSITE_ID=your-website-id-here
            </code>
          </div>
        </CardContent>
      </Card>

      {/* Create New Website */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Your Websites</CardTitle>
              <CardDescription>
                Manage your websites and get their IDs for integration
              </CardDescription>
            </div>
            <Button
              onClick={() => setShowCreateForm(!showCreateForm)}
              variant="outline"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Website
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {showCreateForm && (
            <div className="mb-6 p-4 border rounded-lg space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Website Name *</Label>
                <Input
                  id="name"
                  placeholder="My E-commerce Store"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="domain">Domain *</Label>
                <Input
                  id="domain"
                  placeholder="mystore.com or localhost:3000"
                  value={formData.domain}
                  onChange={(e) =>
                    setFormData({ ...formData, domain: e.target.value })
                  }
                />
                <p className="text-xs text-muted-foreground">
                  Enter your domain (e.g., mystore.com) or localhost URL
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Input
                  id="description"
                  placeholder="Main production store"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleCreateWebsite}>Create Website</Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowCreateForm(false);
                    setFormData({ name: "", domain: "", description: "" });
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {/* Websites List */}
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">
              Loading websites...
            </div>
          ) : websites.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No websites yet. Click "Add Website" to create one.
            </div>
          ) : (
            <div className="space-y-4">
              {websites.map((website) => (
                <Card key={website.id} className="border">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center gap-3">
                          <Globe className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <h3 className="font-semibold text-lg">
                              {website.name}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {website.domain}
                            </p>
                          </div>
                          <Badge
                            variant={
                              website.status === "ACTIVE"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {website.status}
                          </Badge>
                        </div>

                        {website.description && (
                          <p className="text-sm text-muted-foreground">
                            {website.description}
                          </p>
                        )}

                        <Separator />

                        {/* Website ID Display */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label className="text-sm font-semibold">
                              Website ID:
                            </Label>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                handleCopyWebsiteId(website.websiteId)
                              }
                            >
                              {copiedId === website.websiteId ? (
                                <>
                                  <Check className="h-4 w-4 mr-2" />
                                  Copied!
                                </>
                              ) : (
                                <>
                                  <Copy className="h-4 w-4 mr-2" />
                                  Copy ID
                                </>
                              )}
                            </Button>
                          </div>
                          <div className="flex items-center gap-2">
                            <code className="flex-1 bg-muted px-3 py-2 rounded text-sm font-mono">
                              {website.websiteId}
                            </code>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyEnvVariable(website.websiteId)}
                          >
                            <Copy className="h-4 w-4 mr-2" />
                            Copy ENV Variable
                          </Button>
                        </div>

                        {/* Integration Instructions */}
                        <div className="mt-4 p-4 bg-muted rounded-lg">
                          <p className="text-sm font-semibold mb-2">
                            Integration Steps:
                          </p>
                          <ol className="text-xs space-y-1 text-muted-foreground list-decimal list-inside">
                            <li>
                              Create <code>.env.local</code> in your Next.js
                              project
                            </li>
                            <li>
                              Add:{" "}
                              <code>
                                NEXT_PUBLIC_TRACKDESK_WEBSITE_ID=
                                {website.websiteId}
                              </code>
                            </li>
                            <li>
                              Add:{" "}
                              <code>
                                NEXT_PUBLIC_TRACKDESK_API_URL=http://localhost:3003/api
                              </code>
                            </li>
                            <li>Restart your Next.js dev server</li>
                          </ol>
                        </div>
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteWebsite(website.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Reference */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Reference</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">1. Get Your Website ID</h4>
            <p className="text-sm text-muted-foreground">
              Create a website above and copy its Website ID. Each Next.js
              project needs its own unique Website ID.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">
              2. Add to Your Next.js Project
            </h4>
            <p className="text-sm text-muted-foreground">
              Create{" "}
              <code className="bg-muted px-2 py-1 rounded">
                frontend/.env.local
              </code>{" "}
              and add:
            </p>
            <code className="block bg-muted p-3 rounded mt-2 text-xs">
              NEXT_PUBLIC_TRACKDESK_WEBSITE_ID=your-website-id-here
              <br />
              NEXT_PUBLIC_TRACKDESK_API_URL=http://localhost:3003/api
              <br />
              NEXT_PUBLIC_TRACKDESK_DEBUG=true
            </code>
          </div>
          <div>
            <h4 className="font-semibold mb-2">3. Use Referral Codes</h4>
            <p className="text-sm text-muted-foreground">
              Affiliates can share links like:{" "}
              <code className="bg-muted px-2 py-1 rounded">
                https://your-website.com/?ref=AFF_0AGXXR
              </code>
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              The tracking script will automatically capture the referral code
              and track clicks/orders.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
