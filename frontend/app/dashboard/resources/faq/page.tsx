"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  Search, 
  ChevronDown, 
  ChevronUp, 
  HelpCircle, 
  BookOpen, 
  MessageCircle,
  ExternalLink
} from "lucide-react"

// Mock FAQ data
const faqData = [
  {
    id: 1,
    category: "Getting Started",
    question: "How do I create my first affiliate link?",
    answer: "To create your first affiliate link, go to the 'My Links & Assets' section and click on 'URL Generator'. Paste any product URL from our website and click 'Generate Affiliate Link'. Your unique affiliate link will be created instantly.",
    tags: ["links", "generator", "beginner"]
  },
  {
    id: 2,
    category: "Getting Started",
    question: "What is the minimum payout threshold?",
    answer: "The minimum payout threshold is $50.00. Once your available balance reaches this amount, it will be included in the next scheduled payout cycle. Payouts are processed monthly on the 1st of each month.",
    tags: ["payout", "minimum", "threshold"]
  },
  {
    id: 3,
    category: "Commissions",
    question: "How are commissions calculated?",
    answer: "Commissions are calculated as a percentage of the sale amount. The commission rate varies by product: Premium Plan (30%), Basic Plan (30%), Enterprise (30%), and Starter (30%). Commissions are held for 30 days before payout to ensure customer satisfaction.",
    tags: ["commission", "calculation", "rates"]
  },
  {
    id: 4,
    category: "Commissions",
    question: "When will my commissions be paid out?",
    answer: "Commissions are held for a 30-day approval period and then included in the next monthly payout. Payouts are processed on the 1st of each month via PayPal. You'll receive an email notification when your payout is processed.",
    tags: ["payout", "schedule", "timeline"]
  },
  {
    id: 5,
    category: "Marketing Materials",
    question: "Where can I find banners and marketing materials?",
    answer: "You can find all marketing materials in the 'Banners & Logos' section under 'My Links & Assets'. We provide various banner sizes, social media templates, email signatures, and logos in different formats (PNG, JPG).",
    tags: ["banners", "materials", "download"]
  },
  {
    id: 6,
    category: "Marketing Materials",
    question: "Can I use my own marketing materials?",
    answer: "Yes, you can use your own marketing materials as long as they comply with our brand guidelines and terms of service. Make sure to include your unique affiliate link in all promotional materials.",
    tags: ["custom", "materials", "guidelines"]
  },
  {
    id: 7,
    category: "Tracking & Analytics",
    question: "How can I track my performance?",
    answer: "You can track your performance in the 'Statistics' section of your dashboard. Here you'll find real-time clicks, conversion logs, traffic analysis, and detailed reports on your affiliate performance.",
    tags: ["tracking", "analytics", "performance"]
  },
  {
    id: 8,
    category: "Tracking & Analytics",
    question: "What data is available in the conversion log?",
    answer: "The conversion log shows detailed information about each conversion including date/time, customer email, offer type, commission amount, customer value, and conversion status (approved/pending/declined).",
    tags: ["conversions", "data", "log"]
  },
  {
    id: 9,
    category: "Account Management",
    question: "How do I update my payment information?",
    answer: "You can update your payment information in the 'Payout Settings' section under 'Commissions & Payouts'. Make sure to verify your email address and keep your payment details up to date.",
    tags: ["payment", "settings", "update"]
  },
  {
    id: 10,
    category: "Account Management",
    question: "How do I change my password?",
    answer: "You can change your password in the 'Account Settings' section. Click on 'Security' and then 'Change Password'. Make sure to use a strong password and enable two-factor authentication for added security.",
    tags: ["password", "security", "account"]
  },
  {
    id: 11,
    category: "Troubleshooting",
    question: "My affiliate link is not working. What should I do?",
    answer: "First, check if the link is correctly formatted and includes your unique affiliate ID. If the link still doesn't work, try generating a new one in the URL Generator. Contact support if the issue persists.",
    tags: ["links", "troubleshooting", "support"]
  },
  {
    id: 12,
    category: "Troubleshooting",
    question: "Why was my commission declined?",
    answer: "Commissions can be declined for various reasons including customer refunds, fraudulent activity, or violation of terms. Check the conversion log for specific details. Contact support if you believe the decline was made in error.",
    tags: ["commission", "declined", "refund"]
  }
]

const categories = ["All", "Getting Started", "Commissions", "Marketing Materials", "Tracking & Analytics", "Account Management", "Troubleshooting"]

export default function FAQPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [expandedItems, setExpandedItems] = useState<number[]>([])

  const filteredFAQs = faqData.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = selectedCategory === "All" || faq.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const toggleExpanded = (id: number) => {
    setExpandedItems(prev =>
      prev.includes(id)
        ? prev.filter(item => item !== id)
        : [...prev, id]
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">FAQ / Knowledge Base</h1>
          <p className="text-slate-600">Find answers to common questions about our affiliate program</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <MessageCircle className="h-4 w-4 mr-2" />
            Contact Support
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search FAQ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3 py-2 border border-slate-300 rounded-md text-sm"
        >
          {categories.map(category => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <HelpCircle className="h-6 w-6 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-blue-600">{faqData.length}</div>
            <div className="text-sm text-slate-500">Total Questions</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <BookOpen className="h-6 w-6 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-green-600">{categories.length - 1}</div>
            <div className="text-sm text-slate-500">Categories</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <MessageCircle className="h-6 w-6 text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-purple-600">24/7</div>
            <div className="text-sm text-slate-500">Support Available</div>
          </CardContent>
        </Card>
      </div>

      {/* FAQ Items */}
      <div className="space-y-4">
        {filteredFAQs.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <HelpCircle className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">No results found</h3>
              <p className="text-slate-500 mb-4">Try adjusting your search terms or category filter</p>
              <Button variant="outline" onClick={() => {
                setSearchTerm("")
                setSelectedCategory("All")
              }}>
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        ) : (
          filteredFAQs.map((faq) => (
            <Card key={faq.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge variant="outline">{faq.category}</Badge>
                      </div>
                      <h3 className="text-lg font-medium text-slate-900 mb-2">
                        {faq.question}
                      </h3>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleExpanded(faq.id)}
                    >
                      {expandedItems.includes(faq.id) ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  
                  {expandedItems.includes(faq.id) && (
                    <div className="pt-4 border-t">
                      <p className="text-slate-600 mb-4">{faq.answer}</p>
                      <div className="flex flex-wrap gap-2">
                        {faq.tags.map(tag => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Contact Support */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-6">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <MessageCircle className="h-6 w-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-medium text-blue-900 mb-2">Still need help?</h3>
              <p className="text-blue-700 mb-4">
                Can't find the answer you're looking for? Our support team is here to help you 24/7.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Contact Support
                </Button>
                <Button variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-100">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View Documentation
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


