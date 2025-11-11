import { notFound } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LinkContinueButton } from "./LinkContinueButton";

interface PublicLinkResponse {
  success: boolean;
  link?: {
    id: string;
    name: string;
    originalUrl: string;
    shortUrl: string;
    trackingCode: string;
    createdAt: string;
    affiliate: {
      id: string;
      name: string;
    } | null;
    stats: {
      clicks: number;
      conversions: number;
      earnings: number;
      revenue: number;
      conversionRate: number;
    };
  };
}

async function fetchPublicLink(slug: string) {
  const apiBaseEnv = process.env.NEXT_PUBLIC_API_URL || "/api";
  const origin =
    process.env.NEXT_PUBLIC_APP_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

  const apiBase = apiBaseEnv.startsWith("http")
    ? apiBaseEnv.replace(/\/$/, "")
    : `${origin.replace(/\/$/, "")}${apiBaseEnv.startsWith("/") ? "" : "/"}${apiBaseEnv.replace(/^\//, "")}`;

  const response = await fetch(`${apiBase}/links/public/${slug}`, {
    cache: "no-store",
  });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error("Failed to fetch link details");
  }

  return (await response.json()) as PublicLinkResponse;
}

export default async function LinkLandingPage({
  params,
}: {
  params: { slug: string };
}) {
  const data = await fetchPublicLink(params.slug);

  if (!data?.success || !data.link) {
    notFound();
  }

  const { link } = data;
  const createdAt = new Date(link.createdAt);
  let hostname = link.originalUrl;
  try {
    hostname = new URL(link.originalUrl).hostname;
  } catch (error) {
    // keep original url string if parsing fails
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4 py-16">
      <Card className="w-full max-w-2xl border-slate-700 bg-slate-900/80 text-slate-100 shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl sm:text-3xl font-bold flex items-center justify-between">
            <span>{link.name}</span>
            <Badge variant="outline" className="text-slate-200 border-slate-500">
              {hostname}
            </Badge>
          </CardTitle>
          <CardDescription className="text-slate-300">
            Created on {createdAt.toLocaleDateString()} &middot; Tracking code:{" "}
            <span className="font-semibold">{link.trackingCode}</span>
          </CardDescription>
          {link.affiliate && (
            <p className="text-sm text-slate-400">
              Shared by <span className="font-medium">{link.affiliate.name}</span>
            </p>
          )}
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <StatBox label="Clicks" value={link.stats.clicks} />
            <StatBox label="Conversions" value={link.stats.conversions} />
            <StatBox
              label="Revenue"
              value={`$${link.stats.revenue.toFixed(2)}`}
            />
            <StatBox
              label="Conversion Rate"
              value={`${link.stats.conversionRate.toFixed(1)}%`}
            />
          </div>

          <div className="rounded-lg border border-slate-700 bg-slate-800/70 p-4 space-y-2">
            <p className="text-sm text-slate-300">Destination URL</p>
            <p className="break-all text-slate-100 font-medium">
              {link.originalUrl}
            </p>
          </div>

          <LinkContinueButton trackingCode={link.trackingCode} />
        </CardContent>
      </Card>
    </div>
  );
}

function StatBox({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-lg border border-slate-700 bg-slate-800/60 p-4">
      <p className="text-xs uppercase tracking-wide text-slate-400">{label}</p>
      <p className="text-2xl font-semibold text-slate-100 mt-2">{value}</p>
    </div>
  );
}

