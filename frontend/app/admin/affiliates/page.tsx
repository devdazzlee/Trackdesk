"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AdminLoading } from "@/components/ui/loading";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Users,
  UserPlus,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  TrendingUp,
  RefreshCw,
  MoreVertical,
  Edit,
  Trash2,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { config } from "@/config/config";
import { formatLastActivity, formatRelativeTime } from "@/lib/date-utils";
import { getAuthHeaders } from "@/lib/getAuthHeaders";
import { DeleteConfirmationModal } from "@/components/modals/delete-confirmation-modal";

interface Affiliate {
  id: string;
  name: string;
  email: string;
  joinDate: string;
  status: string;
  tier: string;
  commissionRate?: number;
  totalEarnings: number;
  totalClicks: number;
  totalConversions: number;
  conversionRate: number;
  lastActivity: string;
  paymentMethod: string;
  country: string;
}

export default function AffiliatesManagementPage() {
  const [affiliates, setAffiliates] = useState<Affiliate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [tierFilter, setTierFilter] = useState("all");

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedAffiliate, setSelectedAffiliate] = useState<Affiliate | null>(
    null
  );
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    affiliateId: string | null;
    affiliateName: string | null;
  }>({ isOpen: false, affiliateId: null, affiliateName: null });
  const [isDeleting, setIsDeleting] = useState(false);
  const [editForm, setEditForm] = useState({
    status: "",
    tier: "",
    commissionRate: 5,
  });

  useEffect(() => {
    fetchAffiliates();
  }, [statusFilter, tierFilter]);

  const fetchAffiliates = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== "all")
        params.append("status", statusFilter.toUpperCase());
      if (tierFilter !== "all") params.append("tier", tierFilter.toUpperCase());

      const response = await fetch(
        `${config.apiUrl}/admin/affiliates?${params.toString()}`,
        {
          headers: getAuthHeaders(),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setAffiliates(data.data || []);
      } else {
        console.error("Failed to fetch affiliates:", response.status);
        toast.error("Failed to load affiliates");
      }
    } catch (error) {
      console.error("Error fetching affiliates:", error);
      toast.error("Failed to load affiliates");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchAffiliates();
    setIsRefreshing(false);
    toast.success("Affiliates data refreshed");
  };

  const handleEditAffiliate = (affiliate: Affiliate) => {
    setSelectedAffiliate(affiliate);
    setEditForm({
      status: affiliate.status.toUpperCase(),
      tier: affiliate.tier.toUpperCase(),
      commissionRate: affiliate.commissionRate || 5,
    });
    setEditDialogOpen(true);
  };

  const handleSaveChanges = async () => {
    if (!selectedAffiliate) return;

    try {
      // Update status
      if (editForm.status !== selectedAffiliate.status.toUpperCase()) {
        const statusResponse = await fetch(
          `${config.apiUrl}/admin/affiliates/${selectedAffiliate.id}/status`,
          {
            method: "PATCH",
            headers: getAuthHeaders(),
            body: JSON.stringify({ status: editForm.status }),
          }
        );

        if (!statusResponse.ok) {
          throw new Error("Failed to update status");
        }
      }

      // Update tier and commission rate
      if (
        editForm.tier !== selectedAffiliate.tier.toUpperCase() ||
        editForm.commissionRate !== (selectedAffiliate.commissionRate || 5)
      ) {
        const tierResponse = await fetch(
          `${config.apiUrl}/admin/affiliates/${selectedAffiliate.id}/tier`,
          {
            method: "PATCH",
            headers: getAuthHeaders(),
            body: JSON.stringify({
              tier: editForm.tier,
              commissionRate: editForm.commissionRate,
            }),
          }
        );

        if (!tierResponse.ok) {
          const errorData = await tierResponse.json();

          // Handle validation errors with better messages
          if (errorData.details && Array.isArray(errorData.details)) {
            const commissionError = errorData.details.find((detail: any) =>
              detail.path?.includes("commissionRate")
            );

            if (commissionError) {
              let errorMessage = commissionError.message;

              // If no message from backend, create a user-friendly one
              if (!errorMessage) {
                if (commissionError.code === "too_big") {
                  errorMessage = `Commission rate is too large. Please enter a value less than or equal to 100%.`;
                } else if (commissionError.code === "too_small") {
                  errorMessage = `Commission rate is too small. Please enter a value greater than or equal to 0%.`;
                } else {
                  errorMessage = `Invalid commission rate. Please enter a value between 0 and 100%.`;
                }
              }

              toast.error(errorMessage);
              return;
            }
          }

          throw new Error(errorData.error || "Failed to update tier");
        }
      }

      toast.success("Affiliate updated successfully");
      setEditDialogOpen(false);
      fetchAffiliates();
    } catch (error) {
      console.error("Error updating affiliate:", error);
      toast.error("Failed to update affiliate");
    }
  };

  const handleDeleteClick = (affiliateId: string, affiliateName: string) => {
    setDeleteModal({ isOpen: true, affiliateId, affiliateName });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModal.affiliateId) return;

    setIsDeleting(true);
    try {
      const response = await fetch(
        `${config.apiUrl}/admin/affiliates/${deleteModal.affiliateId}`,
        {
          method: "DELETE",
          headers: getAuthHeaders(),
        }
      );

      if (response.ok) {
        toast.success("Affiliate deleted successfully");
        setDeleteModal({
          isOpen: false,
          affiliateId: null,
          affiliateName: null,
        });
        fetchAffiliates();
      } else {
        toast.error("Failed to delete affiliate");
      }
    } catch (error) {
      console.error("Error deleting affiliate:", error);
      toast.error("Failed to delete affiliate");
    } finally {
      setIsDeleting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusLower = status.toLowerCase();
    const variants = {
      active: "default",
      pending: "secondary",
      suspended: "destructive",
      inactive: "outline",
    } as const;

    const icons = {
      active: CheckCircle,
      pending: Clock,
      suspended: XCircle,
      inactive: Clock,
    };

    const Icon = icons[statusLower as keyof typeof icons];

    return (
      <Badge variant={variants[statusLower as keyof typeof variants]}>
        {Icon && <Icon className="w-3 h-3 mr-1" />}
        {status}
      </Badge>
    );
  };

  const filteredAffiliates = affiliates.filter(
    (aff) =>
      aff.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      aff.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return <AdminLoading message="Loading affiliates..." />;
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Manage Affiliates</h1>
          <p className="text-muted-foreground">
            View and manage all affiliate accounts
          </p>
        </div>
        <Button
          variant="outline"
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="w-full sm:w-auto"
        >
          <RefreshCw
            className={`w-4 h-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`}
          />
          {isRefreshing ? "Refreshing..." : "Refresh"}
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Affiliates
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{affiliates.length}</div>
            <p className="text-xs text-muted-foreground">
              Registered affiliates
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {
                affiliates.filter((a) => a.status.toLowerCase() === "active")
                  .length
              }
            </div>
            <p className="text-xs text-muted-foreground">Active accounts</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {
                affiliates.filter((a) => a.status.toLowerCase() === "pending")
                  .length
              }
            </div>
            <p className="text-xs text-muted-foreground">Awaiting approval</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Earnings
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              $
              {affiliates
                .reduce((sum, a) => sum + a.totalEarnings, 0)
                .toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              All-time commissions
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search affiliates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            <Select value={tierFilter} onValueChange={setTierFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Tiers" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tiers</SelectItem>
                <SelectItem value="bronze">Bronze</SelectItem>
                <SelectItem value="silver">Silver</SelectItem>
                <SelectItem value="gold">Gold</SelectItem>
                <SelectItem value="platinum">Platinum</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Affiliates Table */}
      <Card>
        <CardHeader>
          <CardTitle>Affiliates List</CardTitle>
          <CardDescription>
            {filteredAffiliates.length} affiliates found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Affiliate</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Tier</TableHead>
                  <TableHead>Earnings</TableHead>
                  <TableHead>Conversions</TableHead>
                  <TableHead>Last Activity</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAffiliates.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center py-8 text-muted-foreground"
                    >
                      No affiliates found.{" "}
                      {statusFilter !== "all" || tierFilter !== "all"
                        ? "Try adjusting your filters."
                        : ""}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAffiliates.map((affiliate) => (
                    <TableRow key={affiliate.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{affiliate.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {affiliate.email}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(affiliate.status)}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{affiliate.tier}</Badge>
                      </TableCell>
                      <TableCell className="font-medium">
                        ${affiliate.totalEarnings.toFixed(2)}
                      </TableCell>
                      <TableCell>{affiliate.totalConversions}</TableCell>
                      <TableCell className="text-sm">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="cursor-help">
                                {formatLastActivity(affiliate.lastActivity)}
                              </span>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>
                                {formatRelativeTime(affiliate.lastActivity)}
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => handleEditAffiliate(affiliate)}
                            >
                              <Edit className="w-4 h-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                handleDeleteClick(affiliate.id, affiliate.name)
                              }
                              className="text-red-600"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Affiliate Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Affiliate</DialogTitle>
            <DialogDescription>
              Update affiliate status, tier, and commission rate
            </DialogDescription>
          </DialogHeader>
          {selectedAffiliate && (
            <div className="space-y-4">
              <div>
                <Label>Affiliate</Label>
                <p className="text-sm font-medium">{selectedAffiliate.name}</p>
                <p className="text-sm text-muted-foreground">
                  {selectedAffiliate.email}
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={editForm.status}
                  onValueChange={(value) =>
                    setEditForm({ ...editForm, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="SUSPENDED">Suspended</SelectItem>
                    <SelectItem value="REJECTED">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="tier">Tier</Label>
                <Select
                  value={editForm.tier}
                  onValueChange={(value) =>
                    setEditForm({ ...editForm, tier: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue>
                      {editForm.tier &&
                        editForm.tier.charAt(0) +
                          editForm.tier.slice(1).toLowerCase()}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BRONZE">Bronze</SelectItem>
                    <SelectItem value="SILVER">Silver</SelectItem>
                    <SelectItem value="GOLD">Gold</SelectItem>
                    <SelectItem value="PLATINUM">Platinum</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="commissionRate">
                  Custom Commission Rate (%)
                </Label>
                <Input
                  id="commissionRate"
                  type="number"
                  min="0"
                  max="100"
                  value={editForm.commissionRate}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      commissionRate: parseFloat(e.target.value),
                    })
                  }
                />
                <p className="text-xs text-muted-foreground">
                  Leave at tier default or set custom rate
                </p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveChanges}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() =>
          setDeleteModal({
            isOpen: false,
            affiliateId: null,
            affiliateName: null,
          })
        }
        onConfirm={handleDeleteConfirm}
        title="Delete Affiliate?"
        message="Are you sure you want to delete this affiliate?"
        itemName={deleteModal.affiliateName || undefined}
        description="This action cannot be undone. All associated data, commissions, and links will be permanently removed."
        isLoading={isDeleting}
      />
    </div>
  );
}
