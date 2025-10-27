import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3003/api";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Forward the request to the backend
    const response = await fetch(`${BACKEND_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    // Extract cookies from the backend response
    const setCookieHeader = response.headers.get("set-cookie");
    
    // Create response with data
    const nextResponse = NextResponse.json(data);

    // Set cookies from backend if they exist
    if (setCookieHeader) {
      const cookies = setCookieHeader.split(",");
      cookies.forEach((cookie) => {
        const [nameValue, ...rest] = cookie.split(";");
        const [name, value] = nameValue.trim().split("=");
        
        if (name && value) {
          nextResponse.cookies.set(name, value, {
            httpOnly: cookie.includes("HttpOnly"),
            secure: cookie.includes("Secure"),
            sameSite: cookie.includes("SameSite=None") ? "none" : "lax",
            path: "/",
            maxAge: 7 * 24 * 60 * 60, // 7 days
          });
        }
      });
    }

    return nextResponse;
  } catch (error: any) {
    console.error("Login API error:", error);
    return NextResponse.json(
      { error: error.message || "Login failed" },
      { status: 500 }
    );
  }
}

