/** Same-origin path; next.config.ts rewrites to BACKEND_ORIGIN. Override only if the API sends proper CORS for this app. */
export const API_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "/api/v1";

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
  authorName?: string;
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const api = async <T = any>(
  endpoint: string,
  method: string = "GET",
  body?: Record<string, unknown> | FormData,
  token?: string,
): Promise<T> => {
  const headers: Record<string, string> = {};
  
  if (!(body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }
  
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  } else if (typeof window !== "undefined") {
    const localToken = localStorage.getItem("token");
    if (localToken) {
      headers["Authorization"] = `Bearer ${localToken}`;
    }
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
      // If not JSON, try to get text
      const text = await res.text().catch(() => "");
      if (text) errorMessage += ` - ${text.slice(0, 100)}`;
    }
    throw new Error(errorMessage);
  }

  const text = await res.text();
  if (!text) return {} as T;
  try {
    return JSON.parse(text) as T;
  } catch {
    return text as unknown as T;
  }
};
