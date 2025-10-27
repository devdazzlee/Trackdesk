import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3003";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Forward the request to the backend
    const response = await fetch(`${BACKEND_URL}/api/auth/login`, {
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

    // Create response with data
    const nextResponse = NextResponse.json(data);

    // Extract ALL set-cookie headers from backend response
    const setCookieHeaders = response.headers.getSetCookie();

    console.log("Backend Set-Cookie headers:", setCookieHeaders);

    // Parse and set each cookie
    setCookieHeaders.forEach((cookieString) => {
      // Parse the cookie string
      const parts = cookieString.split(";").map((p) => p.trim());
      const [nameValue] = parts;
      const [name, ...valueParts] = nameValue.split("=");
      const value = valueParts.join("=");

      if (!name || !value) return;

      // Extract cookie options
      const httpOnly = parts.some((p) => p.toLowerCase().includes("httponly"));
      const secure = parts.some((p) => p.toLowerCase().includes("secure"));
      const sameSite =
        parts
          .find((p) => p.toLowerCase().startsWith("samesite"))
          ?.split("=")[1]
          ?.toLowerCase() || "lax";
      const maxAgePart = parts
        .find((p) => p.toLowerCase().startsWith("max-age"))
        ?.split("=")[1];
      const expiresPart = parts.find((p) =>
        p.toLowerCase().startsWith("expires")
      );

      console.log(`Setting cookie: ${name}`);
      console.log(
        `  httpOnly: ${httpOnly}, secure: ${secure}, sameSite: ${sameSite}`
      );

      // Set the cookie
      nextResponse.cookies.set(name, value, {
        httpOnly,
        secure: secure || process.env.NODE_ENV === "production",
        sameSite: sameSite as "strict" | "lax" | "none",
        path: "/",
        maxAge: maxAgePart ? parseInt(maxAgePart) : 7 * 24 * 60 * 60,
      });
    });

    console.log("Cookies set successfully");
    return nextResponse;
  } catch (error: any) {
    console.error("Login API error:", error);
    return NextResponse.json(
      { error: error.message || "Login failed" },
      { status: 500 }
    );
  }
}
