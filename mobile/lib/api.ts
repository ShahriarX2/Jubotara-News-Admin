import Constants from "expo-constants";

/**
 * Same REST paths as the web admin. Default matches `next.config` BACKEND_ORIGIN + /api/v1.
 * Set EXPO_PUBLIC_API_URL in `.env` (e.g. https://your-api.com/api/v1).
 */
export const API_URL =
  (Constants.expoConfig?.extra?.apiUrl as string | undefined)?.replace(/\/$/, "") ||
  process.env.EXPO_PUBLIC_API_URL?.replace(/\/$/, "") ||
  "https://api.jubotaranews.com/api/v1";

export interface Category {
  _id: string;
  name: string;
  slug: string;
}

export interface News {
  _id: string;
  headline: string;
  content: string;
  category: string | Category;
  imageSrc: string;
  reporterInfo?: string;
  imageCaption?: string;
  status?: string;
  isFeatured?: boolean;
  metaTitle?: string;
  metaDescription?: string;
  tags?: string[];
  viewsCount?: number;
  slug?: string;
  createdAt: string;
  publishedAt?: string;
  updatedAt?: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export interface TeamMember {
  _id: string;
  name: string;
  designation: string;
  image: string;
  section: string;
  isHead: boolean;
  order: number;
}

export interface Subscriber {
  _id: string;
  email: string;
  createdAt: string;
}

export interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  createdAt: string;
}

export const api = async (
  endpoint: string,
  method: string = "GET",
  body?: Record<string, unknown> | FormData,
  token?: string,
) => {
  const headers: Record<string, string> = {};

  if (!(body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${endpoint}`, {
    method,
    headers,
    body: body instanceof FormData ? body : body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    let errorMessage = `Error ${res.status}: ${res.statusText}`;
    try {
      const errorData = await res.json();
      errorMessage = errorData.message || errorData.error || errorMessage;
    } catch {
      const text = await res.text().catch(() => "");
      if (text) errorMessage += ` - ${text.slice(0, 100)}`;
    }
    throw new Error(errorMessage);
  }

  return res.json();
};
