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
import { Checkbox } from "@/components/ui/checkbox";
import {
  CreditCard,
  Clock,
  CheckCircle,
  XCircle,
  DollarSign,
  RefreshCw,
  Filter,
  Download,
} from "lucide-react";
import { toast } from "sonner";
import { config } from "@/config/config";
import { getAuthHeaders } from "@/lib/getAuthHeaders";

interface Payout {
  id: string;
  affiliateId: string;
  affiliateName: string;
  amount: number;
  method: string;
  status: string;
  requestDate: string;
  email: string;
  commissionsCount: number;
  processedDate?: string;
}

interface PayoutSummary {
  pending: number;
  processing: number;
  completed: number;
  totalPendingAmount: number;
}

export default function PayoutsManagementPage() {
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [summary, setSummary] = useState<PayoutSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedPayouts, setSelectedPayouts] = useState<string[]>([]);

  useEffect(() => {
    fetchPayouts();
  }, [statusFilter]);

  const fetchPayouts = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== "all") params.append("status", statusFilter);

      const response = await fetch(
        `${config.apiUrl}/admin/payouts?${params.toString()}`,
        {
          headers: getAuthHeaders(),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setPayouts(data.data || []);
        setSummary(data.summary || null);
      } else {
        console.error("Failed to fetch payouts:", response.status);
        toast.error("Failed to load payouts");
      }
    } catch (error) {
      console.error("Error fetching payouts:", error);
      toast.error("Failed to load payouts");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchPayouts();
    setIsRefreshing(false);
    toast.success("Payouts data refreshed");
  };

  const handleProcessPayout = async (payoutId: string) => {
    try {
      const response = await fetch(
        `${config.apiUrl}/admin/payouts/${payoutId}/status`,
        {
          method: "PATCH",
          headers: getAuthHeaders(),
          body: JSON.stringify({ status: "processing" }),
        }
      );

      if (response.ok) {
        toast.success("Payout marked as processing");
        fetchPayouts();
      } else {
        toast.error("Failed to process payout");
      }
    } catch (error) {
      console.error("Error processing payout:", error);
      toast.error("Failed to process payout");
    }
  };

  const handleBulkProcess = async () => {
    if (selectedPayouts.length === 0) {
      toast.error("Please select payouts to process");
      return;
    }

    try {
      const response = await fetch(
        `${config.apiUrl}/admin/payouts/process-bulk`,
        {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify({ payoutIds: selectedPayouts }),
        }
      );

      if (response.ok) {
        toast.success(`${selectedPayouts.length} payouts processed`);
        setSelectedPayouts([]);
        fetchPayouts();
      } else {
        toast.error("Failed to process payouts");
      }
    } catch (error) {
      console.error("Error processing bulk payouts:", error);
      toast.error("Failed to process bulk payouts");
    }
  };

  const getStatusBadge = (status: string) => {
    const statusLower = status.toLowerCase();
    const variants = {
      pending: "secondary",
      processing: "default",
      completed: "outline",
      failed: "destructive",
    } as const;

    const icons = {
      pending: Clock,
      processing: Clock,
      completed: CheckCircle,
      failed: XCircle,
    };

    const Icon = icons[statusLower as keyof typeof icons];

    return (
      <Badge variant={variants[statusLower as keyof typeof variants]}>
        {Icon && <Icon className="w-3 h-3 mr-1" />}
        {status}
      </Badge>
    );
  };

  if (isLoading) {
    return <AdminLoading message="Loading payouts..." />;
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Payout Queue</h1>
          <p className="text-muted-foreground">
            Process and manage affiliate payouts
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          {selectedPayouts.length > 0 && (
            <Button onClick={handleBulkProcess} className="w-full sm:w-auto">
              Process {selectedPayouts.length} Selected
            </Button>
          )}
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
      </div>

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary.pending}</div>
              <p className="text-xs text-muted-foreground">
                ${summary.totalPendingAmount.toFixed(2)} total
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Processing</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary.processing}</div>
              <p className="text-xs text-muted-foreground">In progress</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary.completed}</div>
              <p className="text-xs text-muted-foreground">Successfully paid</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Payouts
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{payouts.length}</div>
              <p className="text-xs text-muted-foreground">All time</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Payouts Table */}
      <Card>
        <CardHeader>
          <CardTitle>Payout Requests</CardTitle>
          <CardDescription>{payouts.length} payout requests</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={
                        selectedPayouts.length === payouts.length &&
                        payouts.length > 0
                      }
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedPayouts(payouts.map((p) => p.id));
                        } else {
                          setSelectedPayouts([]);
                        }
                      }}
                    />
                  </TableHead>
                  <TableHead>Payout ID</TableHead>
                  <TableHead>Affiliate</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Request Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payouts.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="text-center py-8 text-muted-foreground"
                    >
                      No payout requests found.
                    </TableCell>
                  </TableRow>
                ) : (
                  payouts.map((payout) => (
                    <TableRow key={payout.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedPayouts.includes(payout.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedPayouts([
                                ...selectedPayouts,
                                payout.id,
                              ]);
                            } else {
                              setSelectedPayouts(
                                selectedPayouts.filter((id) => id !== payout.id)
                              );
                            }
                          }}
                        />
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {payout.id}
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {payout.affiliateName}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {payout.email}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        ${payout.amount.toFixed(2)}
                      </TableCell>
                      <TableCell>{payout.method}</TableCell>
                      <TableCell>{getStatusBadge(payout.status)}</TableCell>
                      <TableCell>{payout.requestDate}</TableCell>
                      <TableCell>
                        {payout.status === "pending" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleProcessPayout(payout.id)}
                          >
                            Process
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
