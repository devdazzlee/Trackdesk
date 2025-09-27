"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  FileText, 
  Download, 
  ExternalLink, 
  CheckCircle,
  AlertCircle,
  Calendar,
  User,
  DollarSign
} from "lucide-react"

// Mock terms data
const termsSections = [
  {
    id: 1,
    title: "Program Overview",
    content: "Our affiliate program allows you to earn commissions by promoting our products and services. By joining our program, you agree to comply with all terms and conditions outlined in this agreement.",
    lastUpdated: "2024-01-01",
    status: "active"
  },
  {
    id: 2,
    title: "Commission Structure",
    content: "Commissions are paid as a percentage of qualifying sales. Current commission rates are: Premium Plan (30%), Basic Plan (30%), Enterprise (30%), and Starter (30%). Commission rates may be adjusted with 30 days notice.",
    lastUpdated: "2024-01-01",
    status: "active"
  },
  {
    id: 3,
    title: "Payment Terms",
    content: "Commissions are held for a 30-day approval period before payout. Minimum payout threshold is $50.00. Payouts are processed monthly on the 1st of each month via PayPal. Failed payments will be automatically retried.",
    lastUpdated: "2024-01-01",
    status: "active"
  },
  {
    id: 4,
    title: "Prohibited Activities",
    content: "The following activities are strictly prohibited: spam marketing, false advertising, trademark infringement, cookie stuffing, self-referrals, and any activity that violates applicable laws or regulations.",
    lastUpdated: "2024-01-01",
    status: "active"
  },
  {
    id: 5,
    title: "Termination",
    content: "Either party may terminate this agreement at any time with 30 days written notice. Upon termination, all outstanding commissions will be paid according to the payment schedule. We reserve the right to terminate accounts for violations.",
    lastUpdated: "2024-01-01",
    status: "active"
  },
  {
    id: 6,
    title: "Intellectual Property",
    content: "You may use our marketing materials and trademarks only as provided in the program. You may not modify, alter, or create derivative works without written permission. All intellectual property rights remain with us.",
    lastUpdated: "2024-01-01",
    status: "active"
  }
]

const keyPoints = [
  {
    icon: DollarSign,
    title: "Commission Rates",
    description: "30% commission on all qualifying sales",
    color: "text-green-600"
  },
  {
    icon: Calendar,
    title: "Payment Schedule",
    description: "Monthly payouts on the 1st of each month",
    color: "text-blue-600"
  },
  {
    icon: User,
    title: "Account Requirements",
    description: "Valid PayPal account and completed profile",
    color: "text-purple-600"
  },
  {
    icon: CheckCircle,
    title: "Approval Period",
    description: "30-day commission approval period",
    color: "text-orange-600"
  }
]

export default function ProgramTermsPage() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Program Terms</h1>
          <p className="text-slate-600">Affiliate program terms and conditions</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
          <Button variant="outline" size="sm">
            <ExternalLink className="h-4 w-4 mr-2" />
            View Full Terms
          </Button>
        </div>
      </div>

      {/* Key Points */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {keyPoints.map((point, index) => (
          <Card key={index} className="text-center">
            <CardContent className="p-6">
              <div className={`w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3`}>
                <point.icon className={`h-6 w-6 ${point.color}`} />
              </div>
              <h3 className="font-medium text-slate-900 mb-2">{point.title}</h3>
              <p className="text-sm text-slate-600">{point.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Terms Sections */}
      <div className="space-y-6">
        {termsSections.map((section) => (
          <Card key={section.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center">
                    <FileText className="h-5 w-5 mr-2" />
                    {section.title}
                  </CardTitle>
                  <CardDescription>
                    Last updated: {section.lastUpdated}
                  </CardDescription>
                </div>
                <Badge variant={section.status === "active" ? "default" : "secondary"}>
                  {section.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 leading-relaxed">{section.content}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Important Notice */}
      <Card className="border-yellow-200 bg-yellow-50">
        <CardContent className="p-6">
          <div className="flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-yellow-800">Important Notice</h4>
              <p className="text-sm text-yellow-700 mt-1">
                These terms and conditions are subject to change. We will notify all affiliates of any changes 
                with 30 days advance notice. Continued participation in the program constitutes acceptance of 
                the updated terms.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Agreement Status */}
      <Card>
        <CardHeader>
          <CardTitle>Your Agreement Status</CardTitle>
          <CardDescription>Current status of your affiliate agreement</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <h4 className="font-medium text-green-900">Agreement Accepted</h4>
                  <p className="text-sm text-green-700">You have accepted the current terms and conditions</p>
                </div>
              </div>
              <Badge variant="default" className="bg-green-600">
                Active
              </Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
              <div>
                <h5 className="font-medium text-slate-900 mb-2">Agreement Details</h5>
                <ul className="text-sm text-slate-600 space-y-1">
                  <li>• Accepted on: January 1, 2024</li>
                  <li>• Version: 2.1</li>
                  <li>• Status: Active</li>
                  <li>• Next review: January 1, 2025</li>
                </ul>
              </div>
              <div>
                <h5 className="font-medium text-slate-900 mb-2">Key Obligations</h5>
                <ul className="text-sm text-slate-600 space-y-1">
                  <li>• Comply with marketing guidelines</li>
                  <li>• Maintain accurate account information</li>
                  <li>• Report any violations promptly</li>
                  <li>• Follow commission approval process</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle>Questions About Terms?</CardTitle>
          <CardDescription>Contact us if you have any questions about the program terms</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-slate-900 mb-2">Legal Department</h4>
              <p className="text-sm text-slate-600 mb-2">
                For questions about terms and conditions, contract interpretation, or legal matters.
              </p>
              <Button variant="outline" size="sm">
                <ExternalLink className="h-4 w-4 mr-2" />
                Contact Legal
              </Button>
            </div>
            <div>
              <h4 className="font-medium text-slate-900 mb-2">Affiliate Support</h4>
              <p className="text-sm text-slate-600 mb-2">
                For general questions about the affiliate program and account management.
              </p>
              <Button variant="outline" size="sm">
                <ExternalLink className="h-4 w-4 mr-2" />
                Contact Support
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
