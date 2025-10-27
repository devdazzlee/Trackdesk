// Client-side authentication utilities
// Types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "ADMIN" | "AFFILIATE" | "MANAGER";
  avatar: string | null;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

// API Configuration
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3003/api";

// Cookie names
const COOKIE_NAMES = {
  ACCESS_TOKEN: "accessToken",
  USER_DATA: "userData",
} as const;

// Client-side authentication utilities
export class AuthClient {
  private static instance: AuthClient;
  private user: User | null = null;

  private constructor() {
    if (typeof window !== "undefined") {
      this.loadUserFromCookies();
    }
  }

  public static getInstance(): AuthClient {
    if (!AuthClient.instance) {
      AuthClient.instance = new AuthClient();
    }
    return AuthClient.instance;
  }

  private loadUserFromCookies(): void {
    try {
      const userData = this.getCookie(COOKIE_NAMES.USER_DATA);
      if (userData) {
        this.user = JSON.parse(userData);
      }
    } catch (error) {
      console.error("Error loading user from cookies:", error);
      this.user = null;
    }
  }

  private getCookie(name: string): string | null {
    if (typeof document === "undefined") return null;

    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return parts.pop()?.split(";").shift() || null;
    }
    return null;
  }

  private setCookie(name: string, value: string, days: number = 7): void {
    if (typeof document === "undefined") return;

    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);

    // Don't use secure in development (localhost)
    const isSecure = window.location.protocol === "https:";
    const secureFlag = isSecure ? ";secure" : "";

    // Use SameSite=None;Secure for Vercel production (cross-origin)
    // Use SameSite=Lax for local development (same-origin)
    const sameSite = isSecure ? "none" : "lax";
    const sameSiteFlag = `;samesite=${sameSite}`;

    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/${secureFlag}${sameSiteFlag}`;
  }

  private deleteCookie(name: string): void {
    if (typeof document === "undefined") return;

    // Don't use secure in development (localhost)
    const isSecure = window.location.protocol === "https:";
    const secureFlag = isSecure ? ";secure" : "";

    // Clear cookie with multiple attempts to ensure it's deleted
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/${secureFlag};samesite=lax`;
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/${secureFlag};samesite=strict`;
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;samesite=lax`;
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;samesite=strict`;

    console.log(`Attempting to delete cookie: ${name}`);
  }

  public getUser(): User | null {
    // Always try to reload from cookies if user is null but cookies exist
    if (!this.user && typeof window !== "undefined") {
      this.loadUserFromCookies();
    }
    return this.user;
  }

  public reloadUserFromCookies(): void {
    this.loadUserFromCookies();
  }

  public isAuthenticated(): boolean {
    // Note: accessToken is httpOnly and can't be read by JavaScript
    // So we just check if we have user data in memory or cookies
    // The actual authentication is validated on the server side
    return !!this.user || !!this.getCookie(COOKIE_NAMES.USER_DATA);
  }

  public getToken(): string | null {
    return this.getCookie(COOKIE_NAMES.ACCESS_TOKEN);
  }

  public setAuth(token: string, user: User): void {
    // Note: Cookies are now set by the backend with proper SameSite settings
    // Frontend only stores user data in memory and localStorage for persistence
    this.user = user;

    // Store in localStorage as backup (backend sets the cookies)
    if (typeof window !== "undefined") {
      localStorage.setItem("userData", JSON.stringify(user));
    }
  }

  public clearAuth(): void {
    console.log("Clearing authentication...");
    // Note: accessToken is httpOnly and can only be cleared by the server
    // Only clear userData if it's not httpOnly
    this.deleteCookie(COOKIE_NAMES.USER_DATA);
    this.user = null;
    console.log("Authentication cleared");
  }

  public async login(
    email: string,
    password: string,
    rememberMe: boolean = false
  ): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      // Set cookies will be handled by the server response
      this.setAuth(data.token, data.user);

      return data;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  }

  public async register(userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role?: "ADMIN" | "AFFILIATE" | "MANAGER";
  }): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Registration failed");
      }

      // Set cookies will be handled by the server response
      this.setAuth(data.token, data.user);

      return data;
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  }

  public async logout(): Promise<void> {
    try {
      // Call the logout API - the backend will read the HttpOnly cookie
      const response = await fetch(`${API_BASE_URL}/auth/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // This sends the HttpOnly cookie
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Logout API error:", response.statusText, errorText);
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      this.clearAuth();
    }
  }

  public async getProfile(): Promise<User> {
    try {
      console.log("🌐 AuthClient.getProfile - Making request to /auth/me");
      console.log(
        "🌐 AuthClient.getProfile - Current cookies:",
        document.cookie
      );

      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // This will send httpOnly cookies
      });

      console.log(
        "🌐 AuthClient.getProfile - Response status:",
        response.status
      );
      console.log(
        "🌐 AuthClient.getProfile - Response headers:",
        Object.fromEntries(response.headers.entries())
      );

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ error: "Failed to fetch profile" }));
        console.error("Get profile failed:", response.status, errorData);
        throw new Error(errorData.error || "Failed to fetch profile");
      }

      const data = await response.json();

      console.log("🔍 AuthClient.getProfile - Raw response from /auth/me:", {
        id: data.id,
        email: data.email,
        avatar: data.avatar,
      });

      // Ensure we return a properly formatted User object
      const user = {
        id: data.id,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role,
        avatar: data.avatar,
      };

      console.log("📦 AuthClient.getProfile - User object being returned:", {
        id: user.id,
        email: user.email,
        avatar: user.avatar,
      });

      return user;
    } catch (error) {
      console.error("Get profile error:", error);
      throw error;
    }
  }
}

// Export singleton instance
export const authClient = AuthClient.getInstance();

// Utility functions
export function isAdmin(user: User | null): boolean {
  return user?.role === "ADMIN" || user?.role === "MANAGER";
}

export function isAffiliate(user: User | null): boolean {
  return user?.role === "AFFILIATE";
}

export function getFullName(user: User | null): string {
  if (!user) return "";
  return `${user.firstName} ${user.lastName}`.trim();
}

export function getInitials(user: User | null): string {
  if (!user) return "";
  return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
}
