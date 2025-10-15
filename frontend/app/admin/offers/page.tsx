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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  LinkIcon,
  Plus,
  RefreshCw,
  Edit,
  Trash2,
  MoreVertical,
  TrendingUp,
  MousePointer,
  Target,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { config } from "@/config/config";

interface Offer {
  id: string;
  name: string;
  description: string;
  commissionType: string;
  commissionValue: number;
  category: string;
  status: string;
  startDate: string;
  endDate: string;
  clicks: number;
  conversions: number;
  revenue: number;
  affiliatesCount: number;
  conversionRate: number;
}

export default function OffersManagementPage() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const [newOffer, setNewOffer] = useState({
    name: "",
    description: "",
    commissionType: "Percentage",
    commissionValue: 10,
    category: "Software",
    startDate: new Date().toISOString().split("T")[0],
    endDate: "",
  });

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${config.apiUrl}/admin/offers`, {
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setOffers(data.data || []);
      } else {
        console.error("Failed to fetch offers:", response.status);
        toast.error("Failed to load offers");
      }
    } catch (error) {
      console.error("Error fetching offers:", error);
      toast.error("Failed to load offers");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchOffers();
    setIsRefreshing(false);
    toast.success("Offers data refreshed");
  };

  const handleCreateOffer = async () => {
    if (!newOffer.name || !newOffer.description) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsCreating(true);

    try {
      const response = await fetch(`${config.apiUrl}/admin/offers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(newOffer),
      });

      if (response.ok) {
        toast.success("Offer created successfully");
        setCreateDialogOpen(false);
        setNewOffer({
          name: "",
          description: "",
          commissionType: "Percentage",
          commissionValue: 10,
          category: "Software",
          startDate: new Date().toISOString().split("T")[0],
          endDate: "",
        });
        fetchOffers();
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to create offer");
      }
    } catch (error) {
      console.error("Error creating offer:", error);
      toast.error("Failed to create offer");
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteOffer = async (offerId: string) => {
    if (!confirm("Are you sure you want to delete this offer?")) return;

    try {
      const response = await fetch(`${config.apiUrl}/admin/offers/${offerId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (response.ok) {
        toast.success("Offer deleted successfully");
        fetchOffers();
      } else {
        toast.error("Failed to delete offer");
      }
    } catch (error) {
      console.error("Error deleting offer:", error);
      toast.error("Failed to delete offer");
    }
  };

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
          <h1 className="text-2xl sm:text-3xl font-bold">Offers & Creatives</h1>
          <p className="text-muted-foreground">
            Manage promotional offers and campaigns
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            onClick={() => setCreateDialogOpen(true)}
            className="w-full sm:w-auto"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Offer
          </Button>
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Offers</CardTitle>
            <LinkIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{offers.length}</div>
            <p className="text-xs text-muted-foreground">Active campaigns</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
            <MousePointer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {offers.reduce((sum, o) => sum + o.clicks, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Across all offers</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversions</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {offers.reduce((sum, o) => sum + o.conversions, 0)}
            </div>
            <p className="text-xs text-muted-foreground">Total conversions</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${offers.reduce((sum, o) => sum + o.revenue, 0).toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">Generated revenue</p>
          </CardContent>
        </Card>
      </div>

      {/* Offers Table */}
      <Card>
        <CardHeader>
          <CardTitle>Offers List</CardTitle>
          <CardDescription>{offers.length} offers configured</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Offer Name</TableHead>
                  <TableHead>Commission</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Clicks</TableHead>
                  <TableHead>Conversions</TableHead>
                  <TableHead>Revenue</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {offers.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="text-center py-8 text-muted-foreground"
                    >
                      No offers found. Create your first offer to get started.
                    </TableCell>
                  </TableRow>
                ) : (
                  offers.map((offer) => (
                    <TableRow key={offer.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{offer.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {offer.description.slice(0, 50)}...
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {offer.commissionType === "Percentage"
                            ? `${offer.commissionValue}%`
                            : `$${offer.commissionValue}`}
                        </Badge>
                      </TableCell>
                      <TableCell>{offer.category}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            offer.status === "active" ? "default" : "secondary"
                          }
                        >
                          {offer.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{offer.clicks.toLocaleString()}</TableCell>
                      <TableCell>{offer.conversions}</TableCell>
                      <TableCell className="font-medium">
                        ${offer.revenue.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Edit className="w-4 h-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDeleteOffer(offer.id)}
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

      {/* Create Offer Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Offer</DialogTitle>
            <DialogDescription>
              Add a new promotional offer for affiliates
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Offer Name *</Label>
              <Input
                id="name"
                placeholder="Premium Plan Promotion"
                value={newOffer.name}
                onChange={(e) =>
                  setNewOffer({ ...newOffer, name: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="30% commission on all premium plan sales..."
                value={newOffer.description}
                onChange={(e) =>
                  setNewOffer({ ...newOffer, description: e.target.value })
                }
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="commissionType">Commission Type *</Label>
                <Select
                  value={newOffer.commissionType}
                  onValueChange={(value) =>
                    setNewOffer({ ...newOffer, commissionType: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Percentage">Percentage</SelectItem>
                    <SelectItem value="Fixed">Fixed Amount</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="commissionValue">
                  Commission Value * (
                  {newOffer.commissionType === "Percentage" ? "%" : "$"})
                </Label>
                <Input
                  id="commissionValue"
                  type="number"
                  min="0"
                  value={newOffer.commissionValue}
                  onChange={(e) =>
                    setNewOffer({
                      ...newOffer,
                      commissionValue: parseFloat(e.target.value),
                    })
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  placeholder="Software"
                  value={newOffer.category}
                  onChange={(e) =>
                    setNewOffer({ ...newOffer, category: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date (Optional)</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={newOffer.endDate}
                  onChange={(e) =>
                    setNewOffer({ ...newOffer, endDate: e.target.value })
                  }
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setCreateDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleCreateOffer} disabled={isCreating}>
              {isCreating ? "Creating..." : "Create Offer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
