"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DataTable } from "@/components/dashboard/data-table"
import { ViewModal, EditModal, CreateModal, DeleteConfirmationModal } from "@/components/modals"
import { exportToCSV } from "@/lib/export-utils"
import { 
  MousePointer, 
  Search, 
  Filter,
  Download,
  Calendar,
  Globe,
  Smartphone,
  Monitor,
  HelpCircle,
  ExternalLink
} from "lucide-react"

// Mock data for clicks report
const clicksData = [
  {
    id: "CLK-001",
    timestamp: "2024-01-07 14:30:25",
    affiliate: "John Doe",
    offer: "Premium Plan",
    source: "Social Media",
    country: "United States",
    city: "New York",
    device: "Desktop",
    browser: "Chrome",
    os: "Windows 10",
    ip: "192.168.1.1",
    converted: true,
    conversionId: "CONV-001",
    revenue: 100.00
  },
  {
    id: "CLK-002",
    timestamp: "2024-01-07 14:28:15",
    affiliate: "Sarah Wilson",
    offer: "Basic Plan",
    source: "Email",
    country: "Canada",
    city: "Toronto",
    device: "Mobile",
    browser: "Safari",
    os: "iOS 17",
    ip: "192.168.1.2",
    converted: false,
    conversionId: null,
    revenue: 0.00
  },
  {
    id: "CLK-003",
    timestamp: "2024-01-07 14:25:42",
    affiliate: "Mike Johnson",
    offer: "Enterprise",
    source: "Direct",
    country: "United Kingdom",
    city: "London",
    device: "Desktop",
    browser: "Firefox",
    os: "macOS",
    ip: "192.168.1.3",
    converted: true,
    conversionId: "CONV-002",
    revenue: 1000.00
  },
  {
    id: "CLK-004",
    timestamp: "2024-01-07 14:22:18",
    affiliate: "Lisa Brown",
    offer: "Starter",
    source: "Search Engine",
    country: "Australia",
    city: "Sydney",
    device: "Tablet",
    browser: "Chrome",
    os: "Android",
    ip: "192.168.1.4",
    converted: false,
    conversionId: null,
    revenue: 0.00
  },
  {
    id: "CLK-005",
    timestamp: "2024-01-07 14:20:33",
    affiliate: "David Lee",
    offer: "Premium Plan",
    source: "Social Media",
    country: "Germany",
    city: "Berlin",
    device: "Mobile",
    browser: "Safari",
    os: "iOS 17",
    ip: "192.168.1.5",
    converted: true,
    conversionId: "CONV-003",
    revenue: 100.00
  },
]

const clicksColumns = [
  { key: "id", label: "Click ID", sortable: true },
  { key: "timestamp", label: "Timestamp", sortable: true },
  { key: "affiliate", label: "Affiliate", sortable: true },
  { key: "offer", label: "Offer", sortable: true },
  { key: "source", label: "Source", sortable: true },
  { key: "country", label: "Country", sortable: true },
  { key: "city", label: "City", sortable: true },
  { key: "device", label: "Device", sortable: true },
  { key: "browser", label: "Browser", sortable: true },
  { 
    key: "converted", 
    label: "Converted", 
    sortable: true,
    render: (value: boolean) => (
      <Badge variant={value ? "default" : "secondary"}>
        {value ? "Yes" : "No"}
      </Badge>
    )
  },
  { 
    key: "revenue", 
    label: "Revenue", 
    sortable: true,
    render: (value: number) => value > 0 ? `$${value.toFixed(2)}` : "-"
  },
]

export default function ClicksReportPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [sourceFilter, setSourceFilter] = useState("all")
  const [deviceFilter, setDeviceFilter] = useState("all")
  const [viewModalOpen, setViewModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [selectedClick, setSelectedClick] = useState<any>(null)
  const [clicks, setClicks] = useState(clicksData)

  const filteredClicks = clicks.filter(click => {
    const matchesSearch = click.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         click.affiliate.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         click.offer.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSource = sourceFilter === "all" || click.source === sourceFilter
    const matchesDevice = deviceFilter === "all" || click.device === deviceFilter
    return matchesSearch && matchesSource && matchesDevice
  })

  const handleView = (click: any) => {
    setSelectedClick(click)
    setViewModalOpen(true)
  }

  const handleEdit = (click: any) => {
    setSelectedClick(click)
    setEditModalOpen(true)
  }

  const handleDelete = (click: any) => {
    setSelectedClick(click)
    setDeleteModalOpen(true)
  }

  const handleCreate = () => {
    setCreateModalOpen(true)
  }

  const handleSaveEdit = (data: any) => {
    setClicks(prev => prev.map(click => 
      click.id === selectedClick.id ? { ...click, ...data } : click
    ))
    setSelectedClick(null)
  }

  const handleConfirmDelete = () => {
    setClicks(prev => prev.filter(click => click.id !== selectedClick.id))
    setSelectedClick(null)
    setDeleteModalOpen(false)
  }

  const handleCreateNew = (data: any) => {
    const newClick = {
      ...data,
      id: `CLK-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      converted: false,
      revenue: 0
    }
    setClicks(prev => [...prev, newClick])
  }

  const handleExport = () => {
    exportToCSV(filteredClicks, "clicks")
  }

  const totalClicks = clicks.length
  const convertedClicks = clicks.filter(c => c.converted).length
  const conversionRate = (convertedClicks / totalClicks) * 100
  const totalRevenue = clicks.reduce((sum, c) => sum + c.revenue, 0)

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center">
            Clicks
            <HelpCircle className="h-5 w-5 ml-2 text-slate-400" />
          </h1>
          <p className="text-slate-600">Reports &gt; Clicks</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
            <MousePointer className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalClicks}</div>
            <p className="text-xs text-slate-500">
              All time clicks
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Converted Clicks</CardTitle>
            <Globe className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{convertedClicks}</div>
            <p className="text-xs text-green-600">
              {conversionRate.toFixed(2)}% conversion rate
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mobile Clicks</CardTitle>
            <Smartphone className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {clicksData.filter(c => c.device === "Mobile").length}
            </div>
            <p className="text-xs text-slate-500">
              {((clicksData.filter(c => c.device === "Mobile").length / totalClicks) * 100).toFixed(1)}% of total
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <Monitor className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-slate-500">
              From converted clicks
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search clicks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={sourceFilter} onValueChange={setSourceFilter}>
          <SelectTrigger className="w-40">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sources</SelectItem>
            <SelectItem value="Social Media">Social Media</SelectItem>
            <SelectItem value="Email">Email</SelectItem>
            <SelectItem value="Direct">Direct</SelectItem>
            <SelectItem value="Search Engine">Search Engine</SelectItem>
          </SelectContent>
        </Select>
        <Select value={deviceFilter} onValueChange={setDeviceFilter}>
          <SelectTrigger className="w-40">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Devices</SelectItem>
            <SelectItem value="Desktop">Desktop</SelectItem>
            <SelectItem value="Mobile">Mobile</SelectItem>
            <SelectItem value="Tablet">Tablet</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Clicks Table */}
      <DataTable
        title="Click Details"
        description="Detailed click tracking and analysis"
        columns={clicksColumns}
        data={filteredClicks}
        searchable={true}
        filterable={true}
        exportable={true}
        pagination={true}
        pageSize={10}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        exportFilename="clicks"
      />

      {/* Click Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Top Traffic Sources</CardTitle>
            <CardDescription>Click distribution by source</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {["Social Media", "Email", "Direct", "Search Engine"].map(source => {
                const count = clicksData.filter(c => c.source === source).length
                const percentage = (count / totalClicks) * 100
                return (
                  <div key={source} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-sm">{source}</p>
                      <p className="text-xs text-slate-500">{count} clicks</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{percentage.toFixed(1)}%</p>
                      <div className="w-20 bg-slate-200 rounded-full h-2 mt-1">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Device Breakdown</CardTitle>
            <CardDescription>Click distribution by device type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {["Desktop", "Mobile", "Tablet"].map(device => {
                const count = clicksData.filter(c => c.device === device).length
                const percentage = (count / totalClicks) * 100
                return (
                  <div key={device} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-sm">{device}</p>
                      <p className="text-xs text-slate-500">{count} clicks</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{percentage.toFixed(1)}%</p>
                      <div className="w-20 bg-slate-200 rounded-full h-2 mt-1">
                        <div 
                          className="bg-green-600 h-2 rounded-full" 
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Geographic Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Geographic Distribution</CardTitle>
          <CardDescription>Click distribution by country</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {["United States", "Canada", "United Kingdom", "Australia", "Germany"].map(country => {
              const count = clicksData.filter(c => c.country === country).length
              const percentage = (count / totalClicks) * 100
              return (
                <div key={country} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-sm">{country}</span>
                    <span className="text-sm text-slate-500">{count} clicks</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div 
                      className="bg-purple-600 h-2 rounded-full" 
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">{percentage.toFixed(1)}%</p>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Modals */}
      <ViewModal
        isOpen={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        title="Click Details"
        data={selectedClick || {}}
        fields={[
          { key: "id", label: "ID", type: "text" },
          { key: "timestamp", label: "Timestamp", type: "text" },
          { key: "affiliate", label: "Affiliate", type: "text" },
          { key: "offer", label: "Offer", type: "text" },
          { key: "source", label: "Source", type: "text" },
          { key: "device", label: "Device", type: "text" },
          { key: "country", label: "Country", type: "text" },
          { key: "ip", label: "IP Address", type: "text" },
          { key: "converted", label: "Converted", type: "badge" },
          { key: "revenue", label: "Revenue", type: "currency" }
        ]}
      />

      <EditModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onSave={handleSaveEdit}
        title="Edit Click"
        data={selectedClick || {}}
        fields={[
          { key: "affiliate", label: "Affiliate", type: "text", required: true },
          { key: "offer", label: "Offer", type: "text", required: true },
          { key: "source", label: "Source", type: "text", required: true },
          { key: "device", label: "Device", type: "text", required: true },
          { key: "country", label: "Country", type: "text", required: true },
          { key: "ip", label: "IP Address", type: "text", required: true },
          { key: "converted", label: "Converted", type: "switch" },
          { key: "revenue", label: "Revenue", type: "number" }
        ]}
      />

      <CreateModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onCreate={handleCreateNew}
        title="Create New Click"
        fields={[
          { key: "affiliate", label: "Affiliate", type: "text", required: true },
          { key: "offer", label: "Offer", type: "text", required: true },
          { key: "source", label: "Source", type: "text", required: true },
          { key: "device", label: "Device", type: "text", required: true },
          { key: "country", label: "Country", type: "text", required: true },
          { key: "ip", label: "IP Address", type: "text", required: true },
          { key: "converted", label: "Converted", type: "switch", defaultValue: false },
          { key: "revenue", label: "Revenue", type: "number", defaultValue: 0 }
        ]}
      />

      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Click"
        message="Are you sure you want to delete this click? This action cannot be undone."
        itemName={selectedClick?.id}
      />
    </div>
  )
}
