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

    // Check if we're in production/Vercel (cross-domain scenario)
    const isProduction =
      process.env.NODE_ENV === "production" || process.env.VERCEL === "1";

    if (isProduction) {
      // In production, backend won't set cookies for different domain
      // So we set them ourselves from the response data
      if (data.token && data.user) {
        const userData = {
          id: data.user.id,
          email: data.user.email,
          firstName: data.user.firstName,
          lastName: data.user.lastName,
          role: data.user.role,
          avatar: data.user.avatar,
        };

        // Set access token cookie
        nextResponse.cookies.set("accessToken", data.token, {
          httpOnly: true,
          secure: true,
          sameSite: "none",
          path: "/",
          maxAge: 7 * 24 * 60 * 60,
        });

        // Set user data cookie
        nextResponse.cookies.set("userData", JSON.stringify(userData), {
          httpOnly: false, // Allow frontend to read
          secure: true,
          sameSite: "none",
          path: "/",
          maxAge: 7 * 24 * 60 * 60,
        });

        console.log("Cookies set for production cross-domain");
      }
    } else {
      // In development (same domain), try to forward backend cookies
      const setCookieHeaders = response.headers.getSetCookie();
      console.log("Backend Set-Cookie headers:", setCookieHeaders);

      setCookieHeaders.forEach((cookieString) => {
        const parts = cookieString.split(";").map((p) => p.trim());
        const [nameValue] = parts;
        const [name, ...valueParts] = nameValue.split("=");
        const value = valueParts.join("=");

        if (!name || !value) return;

        const httpOnly = parts.some((p) =>
          p.toLowerCase().includes("httponly")
        );
        const secure = parts.some((p) => p.toLowerCase().includes("secure"));
        const sameSite =
          parts
            .find((p) => p.toLowerCase().startsWith("samesite"))
            ?.split("=")[1]
            ?.toLowerCase() || "lax";
        const maxAgePart = parts
          .find((p) => p.toLowerCase().startsWith("max-age"))
          ?.split("=")[1];

        console.log(`Setting cookie: ${name}`);

        nextResponse.cookies.set(name, value, {
          httpOnly,
          secure: secure || process.env.NODE_ENV === "production",
          sameSite: sameSite as "strict" | "lax" | "none",
          path: "/",
          maxAge: maxAgePart ? parseInt(maxAgePart) : 7 * 24 * 60 * 60,
        });
      });

      console.log("Cookies forwarded from backend in development");
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
