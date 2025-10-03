import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Define protected routes that require authentication
const protectedRoutes = [
  "/dashboard",
  "/admin",
  "/manager",
  "/profile",
  "/settings",
  "/analytics",
  "/offers",
  "/affiliates",
  "/reports",
];

// Define test routes that don't require authentication
const testRoutes = ["/test-auth", "/test-server-auth"];

// Define auth routes that should redirect if user is already authenticated
const authRoutes = [
  "/auth/login",
  "/auth/register",
  "/auth/forgot-password",
  "/auth/reset-password",
];

// Define admin-only routes
const adminRoutes = [
  "/admin",
  "/admin/affiliates",
  "/admin/offers",
  "/admin/analytics",
  "/admin/settings",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get cookies
  const accessToken = request.cookies.get("accessToken")?.value;
  const userData = request.cookies.get("userData")?.value;

  let user = null;
  try {
    user = userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error("Error parsing user data:", error);
  }

  // Check if the current route is a test route (skip authentication)
  const isTestRoute = testRoutes.some((route) => pathname.startsWith(route));

  // Check if the current route is protected
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Check if the current route is an auth route
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  // Check if the current route is an admin route
  const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route));

  // Skip authentication for test routes
  if (isTestRoute) {
    return NextResponse.next();
  }

  // If accessing a protected route without authentication
  if (isProtectedRoute && !accessToken) {
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  // If accessing an auth route while authenticated, redirect to dashboard
  if (isAuthRoute && accessToken && user) {
    const redirectParam = request.nextUrl.searchParams.get("redirect");
    const redirectUrl = redirectParam || "/dashboard";
    return NextResponse.redirect(new URL(redirectUrl, request.url));
  }

  // If accessing an admin route without admin privileges
  if (
    isAdminRoute &&
    (!accessToken || !user || !["ADMIN", "MANAGER"].includes(user.role))
  ) {
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  // If accessing manager routes without proper role
  if (
    pathname.startsWith("/manager") &&
    (!accessToken || !user || !["ADMIN", "MANAGER"].includes(user.role))
  ) {
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  // If accessing affiliate dashboard without proper role
  if (
    pathname.startsWith("/dashboard") &&
    accessToken &&
    user &&
    !["AFFILIATE", "ADMIN", "MANAGER"].includes(user.role)
  ) {
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  // If accessing root path, redirect based on auth status and role
  if (pathname === "/") {
    if (accessToken && user) {
      // Role-based redirects for authenticated users
      if (user.role === "ADMIN") {
        return NextResponse.redirect(new URL("/admin", request.url));
      } else if (user.role === "MANAGER") {
        return NextResponse.redirect(new URL("/manager", request.url));
      } else if (user.role === "AFFILIATE") {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      } else {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    } else {
      // Allow guest users to see the home page
      return NextResponse.next();
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|public|unauthorized).*)",
  ],
};
