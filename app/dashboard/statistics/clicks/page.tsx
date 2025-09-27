"use client"

import { useState } from "react"
import { DataTable } from "@/components/dashboard/data-table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ViewModal, EditModal, CreateModal, DeleteConfirmationModal } from "@/components/modals"
import { exportToCSV } from "@/lib/export-utils"
import { Calendar, Download, Filter, MousePointer, Globe, Smartphone, Monitor } from "lucide-react"

// Mock data for real-time clicks
const clicksData = [
  {
    id: "CLK-001",
    timestamp: "2024-01-07 14:30:25",
    source: "Social Media",
    country: "United States",
    city: "New York",
    device: "Desktop",
    browser: "Chrome",
    os: "Windows 10",
    ip: "192.168.1.1",
    converted: true,
    conversionId: "CONV-001",
    offer: "Premium Plan"
  },
  {
    id: "CLK-002",
    timestamp: "2024-01-07 14:28:15",
    source: "Email",
    country: "Canada",
    city: "Toronto",
    device: "Mobile",
    browser: "Safari",
    os: "iOS 17",
    ip: "192.168.1.2",
    converted: false,
    conversionId: null,
    offer: "Basic Plan"
  },
  {
    id: "CLK-003",
    timestamp: "2024-01-07 14:25:42",
    source: "Direct",
    country: "United Kingdom",
    city: "London",
    device: "Desktop",
    browser: "Firefox",
    os: "macOS",
    ip: "192.168.1.3",
    converted: true,
    conversionId: "CONV-002",
    offer: "Enterprise"
  },
  {
    id: "CLK-004",
    timestamp: "2024-01-07 14:22:18",
    source: "Search Engine",
    country: "Australia",
    city: "Sydney",
    device: "Tablet",
    browser: "Chrome",
    os: "Android",
    ip: "192.168.1.4",
    converted: false,
    conversionId: null,
    offer: "Starter"
  },
  {
    id: "CLK-005",
    timestamp: "2024-01-07 14:20:33",
    source: "Social Media",
    country: "Germany",
    city: "Berlin",
    device: "Mobile",
    browser: "Safari",
    os: "iOS 17",
    ip: "192.168.1.5",
    converted: true,
    conversionId: "CONV-003",
    offer: "Premium Plan"
  },
  {
    id: "CLK-006",
    timestamp: "2024-01-07 14:18:55",
    source: "Referral",
    country: "France",
    city: "Paris",
    device: "Desktop",
    browser: "Edge",
    os: "Windows 11",
    ip: "192.168.1.6",
    converted: false,
    conversionId: null,
    offer: "Basic Plan"
  },
  {
    id: "CLK-007",
    timestamp: "2024-01-07 14:15:27",
    source: "Email",
    country: "Japan",
    city: "Tokyo",
    device: "Mobile",
    browser: "Chrome",
    os: "Android",
    ip: "192.168.1.7",
    converted: true,
    conversionId: "CONV-004",
    offer: "Enterprise"
  },
  {
    id: "CLK-008",
    timestamp: "2024-01-07 14:12:41",
    source: "Social Media",
    country: "Brazil",
    city: "São Paulo",
    device: "Desktop",
    browser: "Chrome",
    os: "Windows 10",
    ip: "192.168.1.8",
    converted: false,
    conversionId: null,
    offer: "Starter"
  },
]

const clicksColumns = [
  { key: "id", label: "Click ID", sortable: true },
  { key: "timestamp", label: "Timestamp", sortable: true },
  { key: "source", label: "Source", sortable: true },
  { key: "country", label: "Country", sortable: true },
  { key: "city", label: "City", sortable: true },
  { key: "device", label: "Device", sortable: true },
  { key: "browser", label: "Browser", sortable: true },
  { key: "os", label: "OS", sortable: true },
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
  { key: "conversionId", label: "Conversion ID", sortable: true },
  { key: "offer", label: "Offer", sortable: true },
]

export default function RealTimeClicksPage() {
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
                         click.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         click.country.toLowerCase().includes(searchTerm.toLowerCase())
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
      converted: false
    }
    setClicks(prev => [...prev, newClick])
  }

  const handleExport = () => {
    exportToCSV(filteredClicks, "clicks")
  }
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Real-Time Clicks</h1>
          <p className="text-slate-600">Monitor clicks on your affiliate links in real-time</p>
        </div>
        <div className="flex items-center space-x-3">
          <Select defaultValue="1h">
            <SelectTrigger className="w-40">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="15m">Last 15 minutes</SelectItem>
              <SelectItem value="1h">Last hour</SelectItem>
              <SelectItem value="24h">Last 24 hours</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
            </SelectContent>
          </Select>
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
            <div className="text-2xl font-bold">1,247</div>
            <p className="text-xs text-green-600">
              +12.5% from last hour
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unique Visitors</CardTitle>
            <Globe className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">892</div>
            <p className="text-xs text-green-600">
              +8.2% from last hour
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mobile Clicks</CardTitle>
            <Smartphone className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">456</div>
            <p className="text-xs text-slate-500">
              36.6% of total
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Desktop Clicks</CardTitle>
            <Monitor className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">791</div>
            <p className="text-xs text-slate-500">
              63.4% of total
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Real-time Clicks Table */}
      <DataTable
        title="Recent Clicks"
        description="Live feed of clicks on your affiliate links"
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

      {/* Live Status Indicator */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center space-x-3">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-slate-600">
              Live data feed active - Last updated: {new Date().toLocaleTimeString()}
            </span>
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
          { key: "source", label: "Source", type: "text" },
          { key: "country", label: "Country", type: "text" },
          { key: "city", label: "City", type: "text" },
          { key: "device", label: "Device", type: "text" },
          { key: "browser", label: "Browser", type: "text" },
          { key: "os", label: "OS", type: "text" },
          { key: "ip", label: "IP Address", type: "text" },
          { key: "converted", label: "Converted", type: "boolean" },
          { key: "conversionId", label: "Conversion ID", type: "text" },
          { key: "offer", label: "Offer", type: "text" }
        ]}
      />

      <EditModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onSave={handleSaveEdit}
        title="Edit Click"
        data={selectedClick || {}}
        fields={[
          { key: "source", label: "Source", type: "text", required: true },
          { key: "country", label: "Country", type: "text", required: true },
          { key: "city", label: "City", type: "text", required: true },
          { key: "device", label: "Device", type: "text", required: true },
          { key: "browser", label: "Browser", type: "text", required: true },
          { key: "os", label: "OS", type: "text", required: true },
          { key: "ip", label: "IP Address", type: "text", required: true },
          { key: "converted", label: "Converted", type: "boolean" },
          { key: "conversionId", label: "Conversion ID", type: "text" },
          { key: "offer", label: "Offer", type: "text", required: true }
        ]}
      />

      <CreateModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onCreate={handleCreateNew}
        title="Create New Click"
        fields={[
          { key: "source", label: "Source", type: "text", required: true },
          { key: "country", label: "Country", type: "text", required: true },
          { key: "city", label: "City", type: "text", required: true },
          { key: "device", label: "Device", type: "text", required: true },
          { key: "browser", label: "Browser", type: "text", required: true },
          { key: "os", label: "OS", type: "text", required: true },
          { key: "ip", label: "IP Address", type: "text", required: true },
          { key: "converted", label: "Converted", type: "boolean", defaultValue: false },
          { key: "conversionId", label: "Conversion ID", type: "text" },
          { key: "offer", label: "Offer", type: "text", required: true }
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