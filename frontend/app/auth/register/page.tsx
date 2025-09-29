"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, EyeOff, ArrowLeft, Check } from "lucide-react"

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [agreedToTerms, setAgreedToTerms] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!agreedToTerms) return
    setIsLoading(true)
    // Handle registration logic here
    setTimeout(() => setIsLoading(false), 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo and Back Button */}
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center text-slate-600 hover:text-slate-900 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
        </div>

        {/* Registration Card */}
        <Card className="shadow-xl border-0">
          <CardHeader className="space-y-2 text-center">
            <div className="mx-auto w-12 h-12 bg-gradient-to-r from-blue-600 to-teal-600 rounded-lg flex items-center justify-center mb-4">
              <span className="text-white font-bold text-xl">A</span>
            </div>
            <CardTitle className="text-2xl font-bold">Join Our Affiliate Program</CardTitle>
            <CardDescription>
              Start earning commissions by promoting our products
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Enter your full name"
                  required
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  required
                  className="h-11"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="website">Website/Social Media URL</Label>
                <Input
                  id="website"
                  type="url"
                  placeholder="https://yourwebsite.com"
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="paymentEmail">Payment Email (PayPal)</Label>
                <Input
                  id="paymentEmail"
                  type="email"
                  placeholder="paypal@example.com"
                  required
                  className="h-11"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a strong password"
                    required
                    className="h-11 pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-11 px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-slate-500" />
                    ) : (
                      <Eye className="h-4 w-4 text-slate-500" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    required
                    className="h-11 pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-11 px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-slate-500" />
                    ) : (
                      <Eye className="h-4 w-4 text-slate-500" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="flex items-start space-x-2">
                <Checkbox
                  id="terms"
                  checked={agreedToTerms}
                  onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                  className="mt-1"
                />
                <Label htmlFor="terms" className="text-sm text-slate-600 leading-relaxed">
                  I agree to the{" "}
                  <Link href="/terms" className="text-blue-600 hover:text-blue-700">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="text-blue-600 hover:text-blue-700">
                    Privacy Policy
                  </Link>
                </Label>
              </div>

              <Button
                type="submit"
                className="w-full h-11 bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 disabled:opacity-50"
                disabled={isLoading || !agreedToTerms}
              >
                {isLoading ? "Creating Account..." : "Create Affiliate Account"}
              </Button>
            </form>

            <Separator className="my-6" />

            <div className="text-center space-y-4">
              <p className="text-sm text-slate-600">
                Already have an account?{" "}
                <Link
                  href="/auth/login"
                  className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Benefits Section */}
        <Card className="shadow-lg border-0 bg-gradient-to-r from-blue-50 to-teal-50">
          <CardContent className="p-6">
            <h3 className="font-semibold text-slate-900 mb-4">Why Join Our Affiliate Program?</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                  <Check className="h-3 w-3 text-green-600" />
                </div>
                <span className="text-sm text-slate-700">Competitive commission rates up to 30%</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                  <Check className="h-3 w-3 text-green-600" />
                </div>
                <span className="text-sm text-slate-700">Real-time tracking and analytics</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                  <Check className="h-3 w-3 text-green-600" />
                </div>
                <span className="text-sm text-slate-700">Marketing materials and support</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                  <Check className="h-3 w-3 text-green-600" />
                </div>
                <span className="text-sm text-slate-700">Monthly payouts via PayPal</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


