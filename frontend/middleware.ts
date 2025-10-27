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

  // Skip API routes
  if (pathname.startsWith("/api")) {
    return NextResponse.next();
  }

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
    console.log("Middleware: No accessToken, redirecting to unauthorized");
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  // If accessing an auth route while authenticated, redirect to dashboard
  if (isAuthRoute && accessToken && user) {
    const redirectParam = request.nextUrl.searchParams.get("redirect");
    const redirectUrl = redirectParam || "/dashboard";
    console.log(
      "Middleware: Auth route with token, redirecting to:",
      redirectUrl
    );
    return NextResponse.redirect(new URL(redirectUrl, request.url));
  }

  // If accessing an admin route without admin privileges
  if (
    isAdminRoute &&
    (!accessToken || !user || !["ADMIN", "MANAGER"].includes(user.role))
  ) {
    console.log(
      "Middleware: Admin route without privileges, redirecting to unauthorized"
    );
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  // If accessing manager routes without proper role
  if (
    pathname.startsWith("/manager") &&
    (!accessToken || !user || !["ADMIN", "MANAGER"].includes(user.role))
  ) {
    console.log(
      "Middleware: Manager route without privileges, redirecting to unauthorized"
    );
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  // If accessing affiliate dashboard without proper role
  if (
    pathname.startsWith("/dashboard") &&
    accessToken &&
    user &&
    !["AFFILIATE", "ADMIN", "MANAGER"].includes(user.role)
  ) {
    console.log(
      "Middleware: Dashboard route without proper role, redirecting to unauthorized"
    );
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  // If accessing root path, redirect based on auth status and role
  if (pathname === "/") {
    if (accessToken && user) {
      // Role-based redirects for authenticated users
      let redirectPath = "/";
      if (user.role === "ADMIN") {
        redirectPath = "/admin";
      } else if (user.role === "MANAGER") {
        redirectPath = "/manager";
      } else if (user.role === "AFFILIATE") {
        redirectPath = "/dashboard";
      } else {
        redirectPath = "/dashboard";
      }
      console.log(
        "Middleware: Root path with auth, redirecting to:",
        redirectPath
      );
      return NextResponse.redirect(new URL(redirectPath, request.url));
    } else {
      // Allow guest users to see the home page
      console.log("Middleware: Root path without auth, allowing access");
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
