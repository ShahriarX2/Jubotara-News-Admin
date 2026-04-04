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
  isFeatured?: boolean;
  metaTitle?: string;
  metaDescription?: string;
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
      // If not JSON, try to get text
      const text = await res.text().catch(() => "");
      if (text) errorMessage += ` - ${text.slice(0, 100)}`;
    }
    throw new Error(errorMessage);
  }

  return res.json();
};
