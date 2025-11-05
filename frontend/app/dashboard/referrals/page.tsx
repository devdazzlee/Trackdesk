"use client";

import { useState, useEffect } from "react";
import { DataLoading } from "@/components/ui/loading";
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
import { Badge } from "@/components/ui/badge";
import { DeleteConfirmationModal } from "@/components/modals/delete-confirmation-modal";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Copy,
  Plus,
  Share2,
  QrCode,
  Eye,
  TrendingUp,
  DollarSign,
  Users,
  Target,
  Edit,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { config } from "@/config/config";
import { getAuthHeaders } from "@/lib/getAuthHeaders";

interface ReferralCode {
  id: string;
  code: string;
  commissionRate: number;
  productId?: string | null;
  maxUses?: number | null;
  currentUses: number;
  expiresAt?: string | null;
  isActive: boolean;
  createdAt: string;
}

interface ReferralStats {
  totalReferrals: number;
  totalCommissions: number;
  pendingCommissions: number;
  conversionRate: number;
  topProducts: Array<{
    productId: string;
    productName: string;
    referrals: number;
    commissions: number;
  }>;
}

interface ShareableLinks {
  referralCode: string;
  links: Record<string, string>;
  qrCode: string;
}

export default function ReferralsPage() {
  const { user } = useAuth();
  const [referralCodes, setReferralCodes] = useState<ReferralCode[]>([]);
  const [stats, setStats] = useState<ReferralStats | null>(null);
  const [shareableLinks, setShareableLinks] = useState<ShareableLinks | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isCreatingCode, setIsCreatingCode] = useState(false);
  const [isUpdatingCode, setIsUpdatingCode] = useState(false);
  const [isDeletingCode, setIsDeletingCode] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    codeId: string | null;
    codeName: string | null;
  }>({ isOpen: false, codeId: null, codeName: null });
  const [editingCode, setEditingCode] = useState<ReferralCode | null>(null);
  const [affiliateCommissionRate, setAffiliateCommissionRate] =
    useState<number>(10);

  // Form state for creating referral code
  const [newCode, setNewCode] = useState({
    commissionRate: 10, // Will be set from affiliate profile
    productId: "",
    maxUses: "",
    expiresAt: "",
  });

  useEffect(() => {
    fetchReferralData();
  }, []);

  const fetchReferralData = async () => {
    try {
      const [codesResponse, statsResponse, linksResponse, profileResponse] =
        await Promise.all([
          fetch(`${config.apiUrl}/referral/codes`, {
            headers: getAuthHeaders(),
          }),
          fetch(`${config.apiUrl}/referral/stats`, {
            headers: getAuthHeaders(),
          }),
          fetch(`${config.apiUrl}/referral/shareable-links`, {
            method: "POST",
            headers: getAuthHeaders(),
            body: JSON.stringify({
              platforms: [
                "facebook",
                "twitter",
                "instagram",
                "linkedin",
                "tiktok",
              ],
            }),
          }),
          fetch(`${config.apiUrl}/settings/profile`, {
            headers: getAuthHeaders(),
          }),
        ]);

      if (codesResponse.ok) {
        const codes = await codesResponse.json();
        // Use the actual commissionRate from database - don't transform it
        const formattedCodes = codes.map((code: any) => ({
          ...code,
          // Use the actual commissionRate from database response
          // Only default to 0 if it's truly undefined/null
          commissionRate:
            code.commissionRate != null ? Number(code.commissionRate) : 0,
        }));
        setReferralCodes(formattedCodes);
      }

      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData);
      }

      if (linksResponse.ok) {
        const linksData = await linksResponse.json();
        setShareableLinks(linksData);
      }

      // Fetch affiliate profile to get commission rate
      if (profileResponse.ok) {
        const profileData = await profileResponse.json();
        if (profileData.affiliate?.commissionRate) {
          const commissionRate = profileData.affiliate.commissionRate;
          setAffiliateCommissionRate(commissionRate);
          // Update newCode with actual commission rate
          setNewCode((prev) => ({
            ...prev,
            commissionRate: commissionRate,
          }));
        }
      }
    } catch (error) {
      console.error("Error fetching referral data:", error);
      toast.error("Failed to load referral data");
    } finally {
      setIsLoading(false);
    }
  };

  const createReferralCode = async () => {
    setIsCreatingCode(true);
    try {
      const response = await fetch(`${config.apiUrl}/referral/codes`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          commissionRate: newCode.commissionRate,
          maxUses: newCode.maxUses ? parseInt(newCode.maxUses) : undefined,
          expiresAt: newCode.expiresAt || undefined,
        }),
      });

      if (response.ok) {
        toast.success("Referral code created successfully!");
        setShowCreateDialog(false);
        setNewCode({
          commissionRate: affiliateCommissionRate,
          productId: "",
          maxUses: "",
          expiresAt: "",
        });
        fetchReferralData();
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to create referral code");
      }
    } catch (error) {
      toast.error("Failed to create referral code");
    } finally {
      setIsCreatingCode(false);
    }
  };

  const handleEditClick = (code: ReferralCode) => {
    // Use the actual commissionRate from the code object
    // This should be the value from the database
    setEditingCode({
      ...code,
      commissionRate:
        code.commissionRate != null ? Number(code.commissionRate) : 0,
    });
    setShowEditDialog(true);
  };

  const handleUpdateReferralCode = async () => {
    if (!editingCode) return;

    setIsUpdatingCode(true);
    try {
      // Format expiresAt for datetime-local input
      let expiresAtValue: string | null = null;
      if (editingCode.expiresAt) {
        const date = new Date(editingCode.expiresAt);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");
        expiresAtValue = `${year}-${month}-${day}T${hours}:${minutes}`;
      }

      const response = await fetch(
        `${config.apiUrl}/referral/codes/${editingCode.id}`,
        {
          method: "PUT",
          headers: getAuthHeaders(),
          body: JSON.stringify({
            // Commission rate is not sent in update - it's controlled by admin only
            productId: editingCode.productId || null,
            maxUses: editingCode.maxUses || null,
            expiresAt: expiresAtValue || null,
            isActive: editingCode.isActive,
          }),
        }
      );

      if (response.ok) {
        toast.success("Referral code updated successfully!");
        setShowEditDialog(false);
        setEditingCode(null);
        fetchReferralData();
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to update referral code");
      }
    } catch (error) {
      console.error("Error updating referral code:", error);
      toast.error("Failed to update referral code");
    } finally {
      setIsUpdatingCode(false);
    }
  };

  const handleDeleteClick = (codeId: string, codeName: string) => {
    setDeleteModal({ isOpen: true, codeId, codeName });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModal.codeId) return;

    setIsDeletingCode(true);
    try {
      const response = await fetch(
        `${config.apiUrl}/referral/codes/${deleteModal.codeId}`,
        {
          method: "DELETE",
          headers: getAuthHeaders(),
        }
      );

      if (response.ok) {
        toast.success("Referral code deleted successfully!");
        setDeleteModal({ isOpen: false, codeId: null, codeName: null });
        fetchReferralData();
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to delete referral code");
      }
    } catch (error) {
      console.error("Error deleting referral code:", error);
      toast.error("Failed to delete referral code");
    } finally {
      setIsDeletingCode(false);
    }
  };

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${label} copied to clipboard!`);
    } catch (error) {
      toast.error("Failed to copy to clipboard");
    }
  };

  const getStatusBadge = (code: ReferralCode) => {
    if (!code.isActive) return <Badge variant="destructive">Inactive</Badge>;
    if (code.expiresAt && new Date(code.expiresAt) < new Date())
      return <Badge variant="destructive">Expired</Badge>;
    if (code.maxUses && code.currentUses >= code.maxUses)
      return <Badge variant="destructive">Limit Reached</Badge>;
    return <Badge variant="default">Active</Badge>;
  };

  if (isLoading) {
    return <DataLoading message="Loading referrals..." />;
  }

  return (
    <div className="space-y-6 p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Referral System</h1>
          <p className="text-muted-foreground mt-1">
            Create and manage your referral codes to earn commissions
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            onClick={() => setShowShareDialog(true)}
            variant="outline"
            className="w-full sm:w-auto"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share Links
          </Button>
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button className="w-full sm:w-auto">
                <Plus className="w-4 h-4 mr-2" />
                Create Code
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Referral Code</DialogTitle>
                <DialogDescription>
                  Create a new referral code to track your referrals and earn
                  commissions.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="commissionRate">Commission Rate (%)</Label>
                  <Input
                    id="commissionRate"
                    type="number"
                    min="0"
                    max="100"
                    value={newCode.commissionRate}
                    disabled
                    className="bg-muted"
                    readOnly
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Your commission rate: {affiliateCommissionRate}% (Only
                    admins can change this)
                  </p>
                </div>
                <div>
                  <Label htmlFor="maxUses">Max Uses (optional)</Label>
                  <Input
                    id="maxUses"
                    type="number"
                    min="1"
                    value={newCode.maxUses}
                    onChange={(e) =>
                      setNewCode({ ...newCode, maxUses: e.target.value })
                    }
                    placeholder="Leave empty for unlimited"
                  />
                </div>
                <div>
                  <Label htmlFor="expiresAt">Expires At (optional)</Label>
                  <Input
                    id="expiresAt"
                    type="datetime-local"
                    value={newCode.expiresAt}
                    onChange={(e) =>
                      setNewCode({ ...newCode, expiresAt: e.target.value })
                    }
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setShowCreateDialog(false)}
                >
                  Cancel
                </Button>
                <Button onClick={createReferralCode} disabled={isCreatingCode}>
                  {isCreatingCode ? "Creating..." : "Create Code"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Referrals
              </CardTitle>
              <Users className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {stats.totalReferrals}
              </div>
              <p className="text-xs text-muted-foreground">
                {stats.conversionRate.toFixed(1)}% conversion rate
              </p>
            </CardContent>
          </Card>
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Earnings
              </CardTitle>
              <DollarSign className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                ${stats.totalCommissions.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">
                ${stats.pendingCommissions.toFixed(2)} pending
              </p>
            </CardContent>
          </Card>
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Conversion Rate
              </CardTitle>
              <Target className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {stats.conversionRate.toFixed(1)}%
              </div>
              <p className="text-xs text-muted-foreground">Last 30 days</p>
            </CardContent>
          </Card>
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Codes
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {
                  referralCodes.filter(
                    (c) =>
                      c.isActive &&
                      (!c.expiresAt || new Date(c.expiresAt) > new Date())
                  ).length
                }
              </div>
              <p className="text-xs text-muted-foreground">
                {referralCodes.length} total codes
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Content - Referral Codes List */}
      <div className="space-y-6">
        <div className="grid gap-6">
          {referralCodes.length === 0 ? (
            <Card className="shadow-sm">
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">
                  No referral codes yet. Create your first referral code to get
                  started!
                </p>
              </CardContent>
            </Card>
          ) : (
            referralCodes.map((code) => (
              <Card
                key={code.id}
                className="shadow-sm hover:shadow-md transition-shadow"
              >
                <CardHeader className="pb-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex-1">
                      <CardTitle className="text-lg text-gray-900">
                        {code.code}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        {code.commissionRate}% commission • {code.currentUses}{" "}
                        uses
                        {code.maxUses && ` / ${code.maxUses}`}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(code)}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          copyToClipboard(code.code, "Referral code")
                        }
                        className="px-3"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditClick(code)}
                        className="px-3 hover:bg-blue-50"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteClick(code.id, code.code)}
                        className="px-3 text-destructive hover:text-destructive hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6 text-sm">
                    <div className="space-y-1">
                      <p className="font-medium text-gray-700">Created</p>
                      <p className="text-muted-foreground">
                        {new Date(code.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="font-medium text-gray-700">Commission</p>
                      <p className="text-muted-foreground">
                        {code.commissionRate}%
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="font-medium text-gray-700">Expires</p>
                      <p className="text-muted-foreground">
                        {code.expiresAt
                          ? new Date(code.expiresAt).toLocaleDateString()
                          : "Never"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Share Links Dialog */}
      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Share Your Referral Links</DialogTitle>
            <DialogDescription>
              Copy and share these links across different platforms to start
              earning commissions.
            </DialogDescription>
          </DialogHeader>
          {shareableLinks && (
            <div className="space-y-4">
              <div>
                <Label>Your Referral Code</Label>
                <div className="flex gap-2">
                  <Input value={shareableLinks.referralCode} readOnly />
                  <Button
                    variant="outline"
                    onClick={() =>
                      copyToClipboard(
                        shareableLinks.referralCode,
                        "Referral code"
                      )
                    }
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(shareableLinks.links).map(([platform, url]) => (
                  <div key={platform} className="space-y-2">
                    <Label className="capitalize">{platform}</Label>
                    <div className="flex gap-2">
                      <Input value={url} readOnly className="text-xs" />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(url, `${platform} link`)}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <Label>QR Code</Label>
                <div className="flex gap-2">
                  <Input
                    value={shareableLinks.qrCode}
                    readOnly
                    className="text-xs"
                  />
                  <Button
                    variant="outline"
                    onClick={() =>
                      copyToClipboard(shareableLinks.qrCode, "QR code link")
                    }
                  >
                    <QrCode className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setShowShareDialog(false)}>Done</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Referral Code Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Referral Code</DialogTitle>
            <DialogDescription>
              Update your referral code settings. Changes will be saved
              immediately.
            </DialogDescription>
          </DialogHeader>
          {editingCode && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="editCode">Referral Code</Label>
                <Input
                  id="editCode"
                  value={editingCode.code}
                  disabled
                  className="bg-muted"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Referral code cannot be changed
                </p>
              </div>
              <div>
                <Label htmlFor="editCommissionRate">Commission Rate (%)</Label>
                <Input
                  id="editCommissionRate"
                  type="number"
                  min="0"
                  max="100"
                  value={editingCode.commissionRate}
                  disabled
                  className="bg-muted"
                  readOnly
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Your commission rate: {editingCode.commissionRate}% (Only
                  admins can change this)
                </p>
              </div>
              <div>
                <Label htmlFor="editMaxUses">Max Uses (optional)</Label>
                <Input
                  id="editMaxUses"
                  type="number"
                  min="1"
                  value={editingCode.maxUses || ""}
                  onChange={(e) =>
                    setEditingCode({
                      ...editingCode,
                      maxUses: e.target.value
                        ? parseInt(e.target.value)
                        : undefined,
                    })
                  }
                  placeholder="Leave empty for unlimited"
                />
              </div>
              <div>
                <Label htmlFor="editExpiresAt">Expires At (optional)</Label>
                <Input
                  id="editExpiresAt"
                  type="datetime-local"
                  value={
                    editingCode.expiresAt
                      ? (() => {
                          const date = new Date(editingCode.expiresAt);
                          const year = date.getFullYear();
                          const month = String(date.getMonth() + 1).padStart(
                            2,
                            "0"
                          );
                          const day = String(date.getDate()).padStart(2, "0");
                          const hours = String(date.getHours()).padStart(
                            2,
                            "0"
                          );
                          const minutes = String(date.getMinutes()).padStart(
                            2,
                            "0"
                          );
                          return `${year}-${month}-${day}T${hours}:${minutes}`;
                        })()
                      : ""
                  }
                  onChange={(e) =>
                    setEditingCode({
                      ...editingCode,
                      expiresAt: e.target.value || undefined,
                    })
                  }
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="editIsActive"
                  checked={editingCode.isActive}
                  onChange={(e) =>
                    setEditingCode({
                      ...editingCode,
                      isActive: e.target.checked,
                    })
                  }
                  className="h-4 w-4 rounded border-gray-300"
                />
                <Label htmlFor="editIsActive" className="cursor-pointer">
                  Active
                </Label>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowEditDialog(false);
                setEditingCode(null);
              }}
              disabled={isUpdatingCode}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdateReferralCode}
              disabled={isUpdatingCode}
            >
              {isUpdatingCode ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Updating...
                </>
              ) : (
                <>
                  <Edit className="w-4 h-4 mr-2" />
                  Update Code
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() =>
          setDeleteModal({ isOpen: false, codeId: null, codeName: null })
        }
        onConfirm={handleDeleteConfirm}
        title="Delete Referral Code?"
        message="Are you sure you want to delete this referral code?"
        itemName={deleteModal.codeName || undefined}
        description="This action cannot be undone. Referral codes that have been used cannot be deleted."
        isLoading={isDeletingCode}
        confirmText="Delete"
      />
    </div>
  );
}
