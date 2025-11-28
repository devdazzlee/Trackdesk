// Get API URL with environment-aware defaults
const getApiUrl = (): string => {
  // Use environment variable if provided
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  
  // Environment-aware defaults
  const isProduction = process.env.NODE_ENV === "production";
  return isProduction 
    ? "https://trackdesk.com/api"
    : "http://localhost:3003/api";
};

// Configuration object
export const config = {
  apiUrl: getApiUrl(),
  appName: "Trackdesk",
  version: "1.0.0",
  environment: process.env.NODE_ENV || "development",
};

// Authentication configuration
export const authConfig = {
  cookieNames: {
    accessToken: "accessToken",
    userData: "userData",
  },
  tokenExpiry: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
  refreshThreshold: 24 * 60 * 60 * 1000, // 1 day in milliseconds
};
