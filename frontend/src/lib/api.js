import axios from "axios";

const configuredBackendUrl = process.env.REACT_APP_BACKEND_URL?.trim();

if (!configuredBackendUrl) {
  throw new Error(
    "REACT_APP_BACKEND_URL is required to run Auto-AI."
  );
}

export const BACKEND_URL = configuredBackendUrl.replace(/\/$/, "");
export const API = `${BACKEND_URL}/api`;

export const api = axios.create({
  baseURL: API,
  timeout: 60000,
});

export const PREVIEW_READ_ONLY = process.env.REACT_APP_PREVIEW_READ_ONLY === "true" || BACKEND_URL === "https://auto-ai-staging-backend.onrender.com";

function enforcePreviewReadOnly(config) {
  if (PREVIEW_READ_ONLY && !["get", "head", "options"].includes((config.method || "get").toLowerCase())) {
    return Promise.reject(new Error("This private preview is read-only until its staging backend is verified."));
  }
  return config;
}

api.interceptors.request.use(enforcePreviewReadOnly);

export const USER_TOKEN_KEY = "autoai_token";
export const ADMIN_TOKEN_KEY = "autoai_admin_token";

function isAdminApiCall(url = "") {
  return url.startsWith("/admin") || url.startsWith("admin") || url.startsWith("/v1/admin") || url.startsWith("v1/admin");
}

// Admin routes carry the admin session token; everything else uses the user token.
api.interceptors.request.use((config) => {
  const key = isAdminApiCall(config.url || "") ? ADMIN_TOKEN_KEY : USER_TOKEN_KEY;
  const token = localStorage.getItem(key);
  if (token) {
    config.headers = { ...config.headers, Authorization: `Bearer ${token}` };
  }
  return config;
});

export const adminApi = axios.create({
  baseURL: API,
  timeout: 60000,
});

// Dealer dashboards read lead data that is admin-gated on the server.
adminApi.interceptors.request.use(enforcePreviewReadOnly);
adminApi.interceptors.request.use((config) => {
  const token = localStorage.getItem(ADMIN_TOKEN_KEY);
  if (token) {
    config.headers = { ...config.headers, Authorization: `Bearer ${token}` };
  }
  return config;
});

export const formatINR = (n) => {
  if (n == null) return "-";
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(2)} Cr`;
  if (n >= 100000) return `₹${(n / 100000).toFixed(2)} L`;
  return `₹${n.toLocaleString("en-IN")}`;
};

export function createIdempotencyKey() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  const random = Math.random().toString(36).slice(2);
  return `${Date.now()}-${random}-${Date.now()}`;
}
