"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Bell, Search, Filter, Calendar, ExternalLink, Download } from "lucide-react"

// Mock data for program updates
const programUpdates = [
  {
    id: "UPDATE-001",
    title: "New Black Friday Campaign Launched",
    description: "We've launched our biggest Black Friday campaign with up to 70% off on all products. New banners and promotional materials are available.",
    date: "2024-01-15",
    type: "campaign",
    priority: "high",
    status: "active",
    attachments: ["banner-1920x1080.png", "social-media-kit.zip"],
    read: false
  },
  {
    id: "UPDATE-002",
    title: "Commission Structure Updated",
    description: "We've updated our commission structure to better reward top performers. Check your new rates in the dashboard.",
    date: "2024-01-10",
    type: "policy",
    priority: "medium",
    status: "active",
    attachments: ["commission-schedule.pdf"],
    read: false
  },
  {
    id: "UPDATE-003",
    title: "New Product Categories Added",
    description: "We've added 5 new product categories to our catalog. Explore the new opportunities for higher commissions.",
    date: "2024-01-05",
    type: "product",
    priority: "medium",
    status: "active",
    attachments: ["product-catalog.pdf"],
    read: true
  },
  {
    id: "UPDATE-004",
    title: "Payment Processing Upgrade",
    description: "We've upgraded our payment processing system for faster and more secure payouts. New payment methods are now available.",
    date: "2023-12-28",
    type: "system",
    priority: "low",
    status: "completed",
    attachments: ["payment-guide.pdf"],
    read: true
  },
  {
    id: "UPDATE-005",
    title: "Holiday Schedule Notice",
    description: "Our support team will have reduced hours during the holiday season. Check the updated schedule.",
    date: "2023-12-20",
    type: "announcement",
    priority: "low",
    status: "completed",
    attachments: ["holiday-schedule.pdf"],
    read: true
  }
]

export default function ProgramUpdatesPage() {
  const [updates, setUpdates] = useState(programUpdates)
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")

  const filteredUpdates = updates.filter(update => {
    const matchesSearch = update.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         update.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = typeFilter === "all" || update.type === typeFilter
    const matchesPriority = priorityFilter === "all" || update.priority === priorityFilter
    return matchesSearch && matchesType && matchesPriority
  })

  const handleMarkAsRead = (id: string) => {
    setUpdates(prev => prev.map(update => 
      update.id === id ? { ...update, read: true } : update
    ))
  }

  const handleMarkAllAsRead = () => {
    setUpdates(prev => prev.map(update => ({ ...update, read: true })))
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "campaign": return "bg-purple-100 text-purple-800"
      case "policy": return "bg-blue-100 text-blue-800"
      case "product": return "bg-green-100 text-green-800"
      case "system": return "bg-orange-100 text-orange-800"
      case "announcement": return "bg-gray-100 text-gray-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800"
      case "medium": return "bg-yellow-100 text-yellow-800"
      case "low": return "bg-green-100 text-green-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const unreadCount = updates.filter(u => !u.read).length

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Program Updates</h1>
          <p className="text-slate-600">Stay updated with the latest program news and announcements</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm" onClick={handleMarkAllAsRead}>
            <Bell className="h-4 w-4 mr-2" />
            Mark All Read
          </Button>
        </div>
      </div>

      {/* Summary Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bell className="h-5 w-5 mr-2" />
            Updates Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{updates.length}</div>
              <div className="text-sm text-slate-500">Total Updates</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{unreadCount}</div>
              <div className="text-sm text-slate-500">Unread</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{updates.filter(u => u.status === "active").length}</div>
              <div className="text-sm text-slate-500">Active</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{updates.filter(u => u.priority === "high").length}</div>
              <div className="text-sm text-slate-500">High Priority</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search updates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-40">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="campaign">Campaign</SelectItem>
            <SelectItem value="policy">Policy</SelectItem>
            <SelectItem value="product">Product</SelectItem>
            <SelectItem value="system">System</SelectItem>
            <SelectItem value="announcement">Announcement</SelectItem>
          </SelectContent>
        </Select>
        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priorities</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Updates List */}
      <div className="space-y-4">
        {filteredUpdates.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Bell className="h-12 w-12 mx-auto text-slate-400 mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">No updates found</h3>
              <p className="text-slate-500">Try adjusting your search or filter criteria.</p>
            </CardContent>
          </Card>
        ) : (
          filteredUpdates.map((update) => (
            <Card key={update.id} className={`${!update.read ? 'border-blue-200 bg-blue-50' : ''}`}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-3">
                      <h3 className={`text-lg font-semibold ${!update.read ? 'text-slate-900' : 'text-slate-700'}`}>
                        {update.title}
                      </h3>
                      {!update.read && (
                        <Badge variant="default" className="bg-blue-600 text-white text-xs">
                          New
                        </Badge>
                      )}
                      <Badge className={`text-xs ${getTypeColor(update.type)}`}>
                        {update.type}
                      </Badge>
                      <Badge className={`text-xs ${getPriorityColor(update.priority)}`}>
                        {update.priority}
                      </Badge>
                    </div>
                    <p className="text-slate-600 mb-4">{update.description}</p>
                    <div className="flex items-center space-x-4 text-sm text-slate-500">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(update.date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center">
                        <Badge variant={update.status === "active" ? "default" : "secondary"}>
                          {update.status}
                        </Badge>
                      </div>
                    </div>
                    {update.attachments && update.attachments.length > 0 && (
                      <div className="mt-4">
                        <p className="text-sm font-medium text-slate-700 mb-2">Attachments:</p>
                        <div className="flex flex-wrap gap-2">
                          {update.attachments.map((attachment, index) => (
                            <Button
                              key={index}
                              variant="outline"
                              size="sm"
                              className="text-xs"
                            >
                              <Download className="h-3 w-3 mr-1" />
                              {attachment}
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    {!update.read && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleMarkAsRead(update.id)}
                        className="text-green-600 hover:text-green-700"
                      >
                        Mark as Read
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}