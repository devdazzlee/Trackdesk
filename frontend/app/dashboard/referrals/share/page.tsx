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
import {
  Copy,
  Share2,
  QrCode,
  ExternalLink,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  MessageCircle,
  Mail,
  Download,
  RefreshCw,
  Clock,
  FileText,
  BarChart3,
} from "lucide-react";
import { toast } from "sonner";

interface ShareableLinks {
  referralCode: string;
  links: Record<string, string>;
  qrCode: string;
}

const platformIcons = {
  facebook: Facebook,
  twitter: Twitter,
  instagram: Instagram,
  linkedin: Linkedin,
  tiktok: MessageCircle,
};

const platformColors = {
  facebook: "bg-blue-600 hover:bg-blue-700",
  twitter: "bg-sky-500 hover:bg-sky-600",
  instagram:
    "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600",
  linkedin: "bg-blue-700 hover:bg-blue-800",
  tiktok: "bg-black hover:bg-gray-800",
};

export default function ShareReferralsPage() {
  const [shareableLinks, setShareableLinks] = useState<ShareableLinks | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [customMessage, setCustomMessage] = useState(
    "Check out this amazing offer! Use my referral code for exclusive benefits."
  );

  useEffect(() => {
    fetchShareableLinks();
  }, []);

  const fetchShareableLinks = async (isRefresh = false) => {
    if (isRefresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }

    try {
      const response = await fetch(
        "http://localhost:3003/api/referral/shareable-links",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            platforms: [
              "facebook",
              "twitter",
              "instagram",
              "linkedin",
              "tiktok",
            ],
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setShareableLinks(data);
        if (isRefresh) {
          toast.success("Links refreshed successfully!");
        }
      } else {
        console.error("Failed to fetch shareable links:", response.status);
        toast.error("Failed to load shareable links");
      }
    } catch (error) {
      console.error("Error fetching shareable links:", error);
      toast.error("Failed to load shareable links");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${label} copied to clipboard!`);
    } catch (error) {
      toast.error("Failed to copy to clipboard");
    }
  };

  const shareToPlatform = (platform: string, url: string) => {
    const encodedUrl = encodeURIComponent(url);
    const encodedMessage = encodeURIComponent(customMessage);

    const shareUrls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedMessage}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedMessage}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    };

    const shareUrl = shareUrls[platform as keyof typeof shareUrls];
    if (shareUrl) {
      window.open(shareUrl, "_blank", "width=600,height=400");
    } else {
      copyToClipboard(url, `${platform} link`);
    }
  };

  const shareViaEmail = () => {
    if (!shareableLinks) return;

    const subject = encodeURIComponent(
      "Exclusive Offer - Use My Referral Code!"
    );
    const body = encodeURIComponent(
      `${customMessage}\n\nUse my referral code: ${shareableLinks.referralCode}\n\nSign up here: ${shareableLinks.links.facebook}`
    );

    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">
            Share Your Referrals
          </h1>
          <p className="text-muted-foreground mt-1">
            Share your referral links across platforms to maximize your earnings
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => fetchShareableLinks(true)}
          disabled={isRefreshing}
          className="flex items-center gap-2 w-full sm:w-auto"
        >
          <RefreshCw
            className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`}
          />
          {isRefreshing ? "Refreshing..." : "Refresh Links"}
        </Button>
      </div>

      {shareableLinks && (
        <>
          {/* Custom Message */}
          <Card className="shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Customize Your Message</CardTitle>
              <CardDescription>
                Personalize the message that will be shared with your referral
                links
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                <Label htmlFor="customMessage" className="text-sm font-medium">
                  Custom Message
                </Label>
                <Input
                  id="customMessage"
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  placeholder="Enter your custom message..."
                  className="w-full"
                />
                <p className="text-sm text-muted-foreground">
                  This message will be included when sharing your referral links
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Your Referral Code */}
          <Card className="shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Your Referral Code</CardTitle>
              <CardDescription>
                Share this code directly or use the links below
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex gap-3">
                <Input
                  value={shareableLinks.referralCode}
                  readOnly
                  className="font-mono text-lg bg-gray-50"
                />
                <Button
                  variant="outline"
                  onClick={() =>
                    copyToClipboard(
                      shareableLinks.referralCode,
                      "Referral code"
                    )
                  }
                  className="px-4"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Platform Sharing */}
          <Card className="shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">
                Share to Social Platforms
              </CardTitle>
              <CardDescription>
                Click to share your referral links on different platforms
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                {Object.entries(shareableLinks.links).map(([platform, url]) => {
                  const Icon =
                    platformIcons[platform as keyof typeof platformIcons];
                  const colorClass =
                    platformColors[platform as keyof typeof platformColors];

                  return (
                    <div key={platform} className="space-y-3">
                      <Button
                        className={`w-full ${colorClass} text-white hover:opacity-90 transition-opacity`}
                        onClick={() => shareToPlatform(platform, url)}
                        size="lg"
                      >
                        {Icon && <Icon className="w-4 h-4 mr-2" />}
                        Share to{" "}
                        {platform.charAt(0).toUpperCase() + platform.slice(1)}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full border-gray-200 hover:bg-gray-50"
                        onClick={() => copyToClipboard(url, `${platform} link`)}
                      >
                        <Copy className="w-3 h-3 mr-2" />
                        Copy Link
                      </Button>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Direct Links */}
          <Card className="shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Direct Links</CardTitle>
              <CardDescription>
                Copy these links to share anywhere
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-4">
                {Object.entries(shareableLinks.links).map(([platform, url]) => (
                  <div key={platform} className="flex gap-3 items-center">
                    <Label className="w-24 capitalize text-sm font-medium flex items-center text-gray-600">
                      {platform}:
                    </Label>
                    <Input
                      value={url}
                      readOnly
                      className="text-xs bg-gray-50 border-gray-200 flex-1"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(url, `${platform} link`)}
                      className="px-3"
                    >
                      <Copy className="w-4 h-4 mr-1" />
                      Copy
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(url, "_blank")}
                      className="px-3"
                    >
                      <ExternalLink className="w-4 h-4 mr-1" />
                      Open
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* QR Code */}
          <Card className="shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">QR Code</CardTitle>
              <CardDescription>
                Generate a QR code for easy mobile sharing
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex flex-col sm:flex-row gap-6 items-start">
                <div className="w-40 h-40 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl flex items-center justify-center border border-blue-200">
                  <QrCode className="w-20 h-20 text-blue-500" />
                </div>
                <div className="flex-1 space-y-4">
                  <div className="flex gap-3">
                    <Input
                      value={shareableLinks.qrCode}
                      readOnly
                      className="text-xs bg-gray-50 border-gray-200 flex-1"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        copyToClipboard(shareableLinks.qrCode, "QR code link")
                      }
                      className="px-4"
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copy
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Use this QR code for offline sharing, business cards, or
                    printed materials
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-blue-600 border-blue-200 hover:bg-blue-50"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download QR Code
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Email Sharing */}
          <Card className="shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Email Sharing</CardTitle>
              <CardDescription>
                Send referral links via email to your contacts
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <Button
                onClick={shareViaEmail}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                size="lg"
              >
                <Mail className="w-4 h-4 mr-2" />
                Open Email Client
              </Button>
            </CardContent>
          </Card>

          {/* Sharing Tips */}
          <Card className="shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Sharing Tips</CardTitle>
              <CardDescription>
                Best practices for maximizing your referral success
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-800 flex items-center">
                    <Clock className="w-4 h-4 mr-2 text-blue-500" />
                    Timing
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li className="flex items-start">
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      Share during peak hours (9-11 AM, 7-9 PM)
                    </li>
                    <li className="flex items-start">
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      Post consistently but not too frequently
                    </li>
                    <li className="flex items-start">
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      Use platform-specific optimal times
                    </li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-800 flex items-center">
                    <FileText className="w-4 h-4 mr-2 text-green-500" />
                    Content
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li className="flex items-start">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      Use engaging visuals and videos
                    </li>
                    <li className="flex items-start">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      Share personal success stories
                    </li>
                    <li className="flex items-start">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      Highlight exclusive benefits
                    </li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-800 flex items-center">
                    <Share2 className="w-4 h-4 mr-2 text-purple-500" />
                    Platform Strategy
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li className="flex items-start">
                      <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      Facebook: Use groups and personal posts
                    </li>
                    <li className="flex items-start">
                      <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      Instagram: Stories and reels work best
                    </li>
                    <li className="flex items-start">
                      <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      LinkedIn: Professional networking approach
                    </li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-800 flex items-center">
                    <BarChart3 className="w-4 h-4 mr-2 text-orange-500" />
                    Tracking
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li className="flex items-start">
                      <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      Monitor which platforms perform best
                    </li>
                    <li className="flex items-start">
                      <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      A/B test different messages
                    </li>
                    <li className="flex items-start">
                      <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      Track conversion rates by source
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
