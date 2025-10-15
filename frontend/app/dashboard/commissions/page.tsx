"use client";

import { useState, useEffect } from "react";
import { DataTable } from "@/components/dashboard/data-table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DollarSign,
  CreditCard,
  Calendar,
  Download,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import { config } from "@/config/config";

interface Commission {
  id: string;
  date: string;
  customer: string;
  offer: string;
  saleAmount: number;
  commissionRate: number;
  commissionAmount: number;
  status: string;
  expectedPayout: string;
  referralCode: string;
  type: string;
}

interface PayoutHistoryItem {
  id: string;
  date: string;
  amount: number;
  status: string;
  method: string;
  transactionId: string;
  period: string;
  commissionsCount: number;
}

interface PayoutSettings {
  minimumPayout: number;
  payoutMethod: string;
  payoutEmail: string;
  payoutFrequency: string;
  taxInfo: {
    taxId: string;
    businessName: string;
    address: string;
  };
  notifications: {
    payoutProcessed: boolean;
    payoutPending: boolean;
    payoutFailed: boolean;
  };
}

export default function CommissionsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("30d");
  const [selectedTab, setSelectedTab] = useState("pending");
  const [pendingCommissions, setPendingCommissions] = useState<Commission[]>(
    []
  );
  const [payoutHistory, setPayoutHistory] = useState<PayoutHistoryItem[]>([]);
  const [payoutSettings, setPayoutSettings] = useState<PayoutSettings | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [payoutRequestAmount, setPayoutRequestAmount] = useState("");
  const [payoutRequestReason, setPayoutRequestReason] = useState("");

  useEffect(() => {
    fetchCommissionsData();
    fetchPayoutSettings();
  }, [selectedPeriod]);

  const fetchCommissionsData = async () => {
    try {
      const response = await fetch(
        `${config.apiUrl}/commissions/pending?period=${selectedPeriod}`,
        {
          credentials: "include",
        }
      );

      if (response.ok) {
        const data = await response.json();
        setPendingCommissions(data.data || []);
      } else {
        console.error("Failed to fetch commissions:", response.status);
        toast.error("Failed to load commissions data");
      }
    } catch (error) {
      console.error("Error fetching commissions:", error);
      toast.error("Failed to load commissions data");
    }
  };

  const fetchPayoutHistory = async () => {
    try {
      const response = await fetch(`${config.apiUrl}/commissions/history`, {
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setPayoutHistory(data.data || []);
      } else {
        console.error("Failed to fetch payout history:", response.status);
        toast.error("Failed to load payout history");
      }
    } catch (error) {
      console.error("Error fetching payout history:", error);
      toast.error("Failed to load payout history");
    }
  };

  const fetchPayoutSettings = async () => {
    try {
      const response = await fetch(`${config.apiUrl}/commissions/settings`, {
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setPayoutSettings(data);
      } else {
        console.error("Failed to fetch payout settings:", response.status);
      }
    } catch (error) {
      console.error("Error fetching payout settings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([
      fetchCommissionsData(),
      fetchPayoutHistory(),
      fetchPayoutSettings(),
    ]);
    setIsRefreshing(false);
    toast.success("Commissions data refreshed");
  };

  const handleRequestPayout = async () => {
    if (!payoutRequestAmount || parseFloat(payoutRequestAmount) <= 0) {
      toast.error("Please enter a valid payout amount");
      return;
    }

    try {
      const response = await fetch(
        `${config.apiUrl}/commissions/request-payout`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            amount: parseFloat(payoutRequestAmount),
            reason: payoutRequestReason,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        toast.success("Payout request submitted successfully");
        setPayoutRequestAmount("");
        setPayoutRequestReason("");
        fetchCommissionsData(); // Refresh data
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to submit payout request");
      }
    } catch (error) {
      console.error("Error requesting payout:", error);
      toast.error("Failed to submit payout request");
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: "secondary",
      completed: "default",
      failed: "destructive",
      processing: "default",
    } as const;

    const icons = {
      pending: Clock,
      completed: CheckCircle,
      failed: XCircle,
      processing: Clock,
    };

    const Icon = icons[status as keyof typeof icons];

    return (
      <Badge variant={variants[status as keyof typeof variants]}>
        <Icon className="w-3 h-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  // Calculate totals
  const totalPendingAmount = pendingCommissions.reduce(
    (sum, comm) => sum + comm.commissionAmount,
    0
  );
  const totalPaidAmount = payoutHistory
    .filter((payout) => payout.status === "completed")
    .reduce((sum, payout) => sum + payout.amount, 0);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">
            Commissions & Payouts
          </h1>
          <p className="text-muted-foreground">
            Manage your commissions and payout requests
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
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
          <Button variant="outline" className="w-full sm:w-auto">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Commissions
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${totalPendingAmount.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              {pendingCommissions.length} commissions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Paid</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${totalPaidAmount.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              {payoutHistory.filter((p) => p.status === "completed").length}{" "}
              payouts
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Next Payout</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {payoutSettings?.payoutFrequency || "Monthly"}
            </div>
            <p className="text-xs text-muted-foreground">
              {payoutSettings?.minimumPayout
                ? `Min: $${payoutSettings.minimumPayout}`
                : "No minimum"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Payout Method</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {payoutSettings?.payoutMethod || "Not Set"}
            </div>
            <p className="text-xs text-muted-foreground">
              {payoutSettings?.payoutEmail || "No email set"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs
        value={selectedTab}
        onValueChange={setSelectedTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pending">Pending Commissions</TabsTrigger>
          <TabsTrigger value="history">Payout History</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* Pending Commissions Tab */}
        <TabsContent value="pending" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle>Pending Commissions</CardTitle>
                  <CardDescription>
                    Commissions waiting to be paid out
                  </CardDescription>
                </div>
                <Select
                  value={selectedPeriod}
                  onValueChange={setSelectedPeriod}
                >
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7d">Last 7 days</SelectItem>
                    <SelectItem value="30d">Last 30 days</SelectItem>
                    <SelectItem value="90d">Last 90 days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              {pendingCommissions.length === 0 ? (
                <div className="text-center py-8">
                  <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    No Pending Commissions
                  </h3>
                  <p className="text-muted-foreground">
                    You don't have any pending commissions at the moment.
                  </p>
                </div>
              ) : (
                <div className="rounded-md border">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-4 font-medium">
                          Commission ID
                        </th>
                        <th className="text-left p-4 font-medium">Date</th>
                        <th className="text-left p-4 font-medium">Customer</th>
                        <th className="text-left p-4 font-medium">Offer</th>
                        <th className="text-left p-4 font-medium">
                          Sale Amount
                        </th>
                        <th className="text-left p-4 font-medium">
                          Commission
                        </th>
                        <th className="text-left p-4 font-medium">
                          Expected Payout
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {pendingCommissions.map((commission) => (
                        <tr
                          key={commission.id}
                          className="border-b hover:bg-muted/50"
                        >
                          <td className="p-4 font-mono text-sm">
                            {commission.id}
                          </td>
                          <td className="p-4">{commission.date}</td>
                          <td className="p-4">{commission.customer}</td>
                          <td className="p-4">{commission.offer}</td>
                          <td className="p-4">
                            ${commission.saleAmount.toFixed(2)}
                          </td>
                          <td className="p-4">
                            <div className="flex items-center space-x-2">
                              <span className="font-medium">
                                ${commission.commissionAmount.toFixed(2)}
                              </span>
                              <Badge variant="outline">
                                {commission.commissionRate}%
                              </Badge>
                            </div>
                          </td>
                          <td className="p-4">{commission.expectedPayout}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Payout Request */}
          {totalPendingAmount >= (payoutSettings?.minimumPayout || 50) && (
            <Card>
              <CardHeader>
                <CardTitle>Request Payout</CardTitle>
                <CardDescription>
                  Request a payout for your pending commissions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="amount">Amount</Label>
                    <Input
                      id="amount"
                      type="number"
                      placeholder={`Max: $${totalPendingAmount.toFixed(2)}`}
                      value={payoutRequestAmount}
                      onChange={(e) => setPayoutRequestAmount(e.target.value)}
                      max={totalPendingAmount}
                    />
                  </div>
                  <div>
                    <Label htmlFor="reason">Reason (Optional)</Label>
                    <Input
                      id="reason"
                      placeholder="Monthly payout request"
                      value={payoutRequestReason}
                      onChange={(e) => setPayoutRequestReason(e.target.value)}
                    />
                  </div>
                </div>
                <Button
                  onClick={handleRequestPayout}
                  className="w-full md:w-auto"
                >
                  Request Payout
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Payout History Tab */}
        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Payout History</CardTitle>
              <CardDescription>
                Your completed and failed payouts
              </CardDescription>
            </CardHeader>
            <CardContent>
              {payoutHistory.length === 0 ? (
                <div className="text-center py-8">
                  <CreditCard className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    No Payout History
                  </h3>
                  <p className="text-muted-foreground">
                    You haven't received any payouts yet.
                  </p>
                </div>
              ) : (
                <div className="rounded-md border">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-4 font-medium">Payout ID</th>
                        <th className="text-left p-4 font-medium">Date</th>
                        <th className="text-left p-4 font-medium">Amount</th>
                        <th className="text-left p-4 font-medium">Method</th>
                        <th className="text-left p-4 font-medium">Status</th>
                        <th className="text-left p-4 font-medium">Reference</th>
                      </tr>
                    </thead>
                    <tbody>
                      {payoutHistory.map((payout) => (
                        <tr
                          key={payout.id}
                          className="border-b hover:bg-muted/50"
                        >
                          <td className="p-4 font-mono text-sm">{payout.id}</td>
                          <td className="p-4">{payout.date}</td>
                          <td className="p-4 font-medium">
                            ${payout.amount.toFixed(2)}
                          </td>
                          <td className="p-4">{payout.method}</td>
                          <td className="p-4">
                            {getStatusBadge(payout.status)}
                          </td>
                          <td className="p-4 font-mono text-sm">
                            {payout.transactionId}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Payout Settings</CardTitle>
              <CardDescription>
                Configure your payout preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {payoutSettings && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Payout Method</Label>
                    <div className="p-3 border rounded-md bg-muted/50">
                      {payoutSettings.payoutMethod}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Payout Email</Label>
                    <div className="p-3 border rounded-md bg-muted/50">
                      {payoutSettings.payoutEmail}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Frequency</Label>
                    <div className="p-3 border rounded-md bg-muted/50">
                      {payoutSettings.payoutFrequency}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Minimum Payout</Label>
                    <div className="p-3 border rounded-md bg-muted/50">
                      ${payoutSettings.minimumPayout.toFixed(2)}
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground">
                  To update your payout settings, please contact support.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
