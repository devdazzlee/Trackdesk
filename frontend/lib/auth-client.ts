// Client-side authentication utilities
// Types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "ADMIN" | "AFFILIATE" | "MANAGER";
  avatar?: string;
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

    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/${secureFlag};samesite=lax`;
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
    return this.user;
  }

  public isAuthenticated(): boolean {
    const token = this.getCookie(COOKIE_NAMES.ACCESS_TOKEN);
    return !!token && !!this.user;
  }

  public getToken(): string | null {
    return this.getCookie(COOKIE_NAMES.ACCESS_TOKEN);
  }

  public setAuth(token: string, user: User): void {
    this.setCookie(COOKIE_NAMES.ACCESS_TOKEN, token);
    this.setCookie(COOKIE_NAMES.USER_DATA, JSON.stringify(user));
    this.user = user;
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
      const token = this.getToken();
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch profile");
      }

      return data;
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
