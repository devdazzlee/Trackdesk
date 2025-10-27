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
import { AdminLoading } from "@/components/ui/loading";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DollarSign,
  TrendingUp,
  Users,
  CheckCircle,
  Clock,
  XCircle,
  Filter,
  Download,
  Eye,
  Edit,
} from "lucide-react";
import { toast } from "sonner";
import { getAuthHeaders } from "@/lib/getAuthHeaders";

interface Commission {
  id: string;
  amount: number;
  rate: number;
  status: "PENDING" | "APPROVED" | "PAID" | "CANCELLED";
  createdAt: string;
  payoutDate?: string;
  affiliate: {
    id: string;
    user: {
      firstName: string;
      lastName: string;
      email: string;
    };
  };
  conversion?: {
    orderValue: number;
    offer: {
      name: string;
      description: string;
    };
  };
}

interface CommissionAnalytics {
  period: string;
  totalCommissions: number;
  totalAmount: number;
  statusBreakdown: Array<{
    status: string;
    _sum: { commissionAmount: number };
    _count: { id: number };
  }>;
  topAffiliates: Array<{
    affiliateId: string;
    affiliateName: string;
    affiliateEmail: string;
    _sum: { commissionAmount: number };
    _count: { id: number };
  }>;
  dailyStats: Array<{
    createdAt: string;
    _sum: { commissionAmount: number };
    _count: { id: number };
  }>;
}

export default function CommissionsPage() {
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [analytics, setAnalytics] = useState<CommissionAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCommissions, setSelectedCommissions] = useState<string[]>([]);
  const [showBulkUpdateDialog, setShowBulkUpdateDialog] = useState(false);
  const [bulkStatus, setBulkStatus] = useState<
    "PENDING" | "APPROVED" | "PAID" | "CANCELLED"
  >("PENDING");
  const [bulkNotes, setBulkNotes] = useState("");
  const [filters, setFilters] = useState({
    status: "all",
    affiliateId: "",
    dateFrom: "",
    dateTo: "",
    sortBy: "createdAt",
    sortOrder: "desc",
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
  });

  useEffect(() => {
    fetchCommissions();
    fetchAnalytics();
  }, [filters, pagination.page]);

  const fetchCommissions = async () => {
    try {
      const filteredFilters: any = { ...filters };
      if (filteredFilters.status === "all") {
        delete filteredFilters.status;
      }

      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...filteredFilters,
      });

      const response = await fetch(
        `http://localhost:3003/api/commission-management?${params}`,
        {
          headers: getAuthHeaders(),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setCommissions(data.data || data.commissions || []);
        setPagination(
          data.pagination || {
            page: 1,
            limit: 20,
            total: 0,
            pages: 0,
          }
        );
      } else {
        console.error("Failed to fetch commissions:", response.status);
        toast.error("Failed to load commissions");
      }
    } catch (error) {
      console.error("Error fetching commissions:", error);
      toast.error("Failed to load commissions");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const response = await fetch(
        "http://localhost:3003/api/commission-management/analytics?period=30d",
        {
          headers: getAuthHeaders(),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setAnalytics(data);
      }
    } catch (error) {
      console.error("Error fetching analytics:", error);
    }
  };

  const updateCommissionStatus = async (
    commissionId: string,
    status: string,
    notes?: string
  ) => {
    try {
      const response = await fetch(
        `http://localhost:3003/api/commission-management/${commissionId}/status`,
        {
          method: "PATCH",
          headers: getAuthHeaders(),
          body: JSON.stringify({ status, notes }),
        }
      );

      if (response.ok) {
        toast.success("Commission status updated successfully");
        fetchCommissions();
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to update commission status");
      }
    } catch (error) {
      toast.error("Failed to update commission status");
    }
  };

  const bulkUpdateStatus = async () => {
    if (selectedCommissions.length === 0) {
      toast.error("Please select commissions to update");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:3003/api/commission-management/bulk-status",
        {
          method: "PATCH",
          headers: getAuthHeaders(),
          body: JSON.stringify({
            commissionIds: selectedCommissions,
            status: bulkStatus,
            notes: bulkNotes,
          }),
        }
      );

      if (response.ok) {
        toast.success(
          `${selectedCommissions.length} commissions updated successfully`
        );
        setSelectedCommissions([]);
        setShowBulkUpdateDialog(false);
        setBulkNotes("");
        fetchCommissions();
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to update commissions");
      }
    } catch (error) {
      toast.error("Failed to update commissions");
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedCommissions(commissions.map((c) => c.id));
    } else {
      setSelectedCommissions([]);
    }
  };

  const handleSelectCommission = (commissionId: string, checked: boolean) => {
    if (checked) {
      setSelectedCommissions([...selectedCommissions, commissionId]);
    } else {
      setSelectedCommissions(
        selectedCommissions.filter((id) => id !== commissionId)
      );
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      PENDING: "secondary",
      APPROVED: "default",
      PAID: "default",
      CANCELLED: "destructive",
    } as const;

    const icons = {
      PENDING: Clock,
      APPROVED: CheckCircle,
      PAID: CheckCircle,
      CANCELLED: XCircle,
    };

    const Icon = icons[status as keyof typeof icons];

    return (
      <Badge variant={variants[status as keyof typeof variants]}>
        <Icon className="w-3 h-3 mr-1" />
        {status}
      </Badge>
    );
  };

  if (isLoading) {
    return <AdminLoading message="Loading commissions..." />;
  }

  return (
    <div className="space-y-6 p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">
            Commission Management
          </h1>
          <p className="text-muted-foreground">
            Manage affiliate commissions and payouts
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          {selectedCommissions.length > 0 && (
            <Button
              onClick={() => setShowBulkUpdateDialog(true)}
              className="w-full sm:w-auto"
            >
              Update {selectedCommissions.length} Selected
            </Button>
          )}
          <Button variant="outline" className="w-full sm:w-auto">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Analytics Cards */}
      {analytics && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Commissions
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {analytics.totalCommissions}
              </div>
              <p className="text-xs text-muted-foreground">
                ${analytics.totalAmount.toFixed(2)} total value
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Paid Commissions
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {analytics.statusBreakdown.find((s) => s.status === "PAID")
                  ?._count.id || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                $
                {analytics.statusBreakdown
                  .find((s) => s.status === "PAID")
                  ?._sum.commissionAmount.toFixed(2) || "0.00"}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {analytics.statusBreakdown.find((s) => s.status === "PENDING")
                  ?._count.id || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                $
                {analytics.statusBreakdown
                  .find((s) => s.status === "PENDING")
                  ?._sum.commissionAmount.toFixed(2) || "0.00"}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Top Affiliates
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {analytics.topAffiliates.length}
              </div>
              <p className="text-xs text-muted-foreground">Active performers</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
            <div>
              <Label htmlFor="status">Status</Label>
              <Select
                value={filters.status}
                onValueChange={(value) =>
                  setFilters({ ...filters, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="APPROVED">Approved</SelectItem>
                  <SelectItem value="PAID">Paid</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="dateFrom">From Date</Label>
              <Input
                id="dateFrom"
                type="date"
                value={filters.dateFrom}
                onChange={(e) =>
                  setFilters({ ...filters, dateFrom: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="dateTo">To Date</Label>
              <Input
                id="dateTo"
                type="date"
                value={filters.dateTo}
                onChange={(e) =>
                  setFilters({ ...filters, dateTo: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="sortBy">Sort By</Label>
              <Select
                value={filters.sortBy}
                onValueChange={(value) =>
                  setFilters({ ...filters, sortBy: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="createdAt">Date Created</SelectItem>
                  <SelectItem value="amount">Amount</SelectItem>
                  <SelectItem value="status">Status</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="sortOrder">Order</Label>
              <Select
                value={filters.sortOrder}
                onValueChange={(value) =>
                  setFilters({ ...filters, sortOrder: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="desc">Descending</SelectItem>
                  <SelectItem value="asc">Ascending</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button
                onClick={() => {
                  setFilters({
                    status: "all",
                    affiliateId: "",
                    dateFrom: "",
                    dateTo: "",
                    sortBy: "createdAt",
                    sortOrder: "desc",
                  });
                  setPagination({ ...pagination, page: 1 });
                }}
                variant="outline"
              >
                <Filter className="w-4 h-4 mr-2" />
                Clear
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Commissions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Commissions</CardTitle>
          <CardDescription>
            Manage and track affiliate commission payments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={
                        selectedCommissions.length === commissions.length &&
                        commissions.length > 0
                      }
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead>Affiliate</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Rate</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {commissions.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center py-8 text-muted-foreground"
                    >
                      No commissions found. Create some referral codes to
                      generate commissions.
                    </TableCell>
                  </TableRow>
                ) : (
                  commissions.map((commission) => (
                    <TableRow key={commission.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedCommissions.includes(commission.id)}
                          onCheckedChange={(checked) =>
                            handleSelectCommission(
                              commission.id,
                              checked as boolean
                            )
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {commission.affiliate.user.firstName}{" "}
                            {commission.affiliate.user.lastName}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {commission.affiliate.user.email}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        ${commission.amount.toFixed(2)}
                      </TableCell>
                      <TableCell>{commission.rate}%</TableCell>
                      <TableCell>{getStatusBadge(commission.status)}</TableCell>
                      <TableCell>
                        {new Date(commission.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                          }
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              updateCommissionStatus(commission.id, "APPROVED")
                            }
                            disabled={
                              commission.status === "APPROVED" ||
                              commission.status === "PAID"
                            }
                          >
                            Approve
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              updateCommissionStatus(commission.id, "PAID")
                            }
                            disabled={commission.status === "PAID"}
                          >
                            Mark Paid
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4">
              <div className="text-sm text-muted-foreground text-center sm:text-left">
                Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
                {Math.min(pagination.page * pagination.limit, pagination.total)}{" "}
                of {pagination.total} commissions
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setPagination({ ...pagination, page: pagination.page - 1 })
                  }
                  disabled={pagination.page === 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setPagination({ ...pagination, page: pagination.page + 1 })
                  }
                  disabled={pagination.page === pagination.pages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Bulk Update Dialog */}
      <Dialog
        open={showBulkUpdateDialog}
        onOpenChange={setShowBulkUpdateDialog}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Bulk Update Commissions</DialogTitle>
            <DialogDescription>
              Update the status of {selectedCommissions.length} selected
              commissions.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="bulkStatus">New Status</Label>
              <Select
                value={bulkStatus}
                onValueChange={(value: any) => setBulkStatus(value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="APPROVED">Approved</SelectItem>
                  <SelectItem value="PAID">Paid</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="bulkNotes">Notes (optional)</Label>
              <Input
                id="bulkNotes"
                value={bulkNotes}
                onChange={(e) => setBulkNotes(e.target.value)}
                placeholder="Add notes about this bulk update..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowBulkUpdateDialog(false)}
            >
              Cancel
            </Button>
            <Button onClick={bulkUpdateStatus}>
              Update {selectedCommissions.length} Commissions
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
