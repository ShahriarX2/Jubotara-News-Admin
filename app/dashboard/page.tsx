"use client";
import { useCallback, useEffect, useState } from "react";
import { api, News, Category } from "../lib/api";
import { Trash2, Edit, ImageDown, Link as LinkIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import PhotoCardModal from "@/components/PhotoCardModal";
import { useFeedback } from "@/components/FeedbackProvider";
import { EmptyState, ErrorState, LoadingState } from "@/components/DashboardState";
import { DashboardPage } from "@/components/DashboardShell";

export default function Dashboard() {
  const [news, setNews] = useState<News[]>([]);
  const [filteredNews, setFilteredNews] = useState<News[]>([]);
  const [selectedNews, setSelectedNews] = useState<News | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalNews, setTotalNews] = useState(0);
  const [recentCount, setRecentCount] = useState(0);
  const [activeCategoriesCount, setActiveCategoriesCount] = useState(0);
  const { confirm, showToast } = useFeedback();

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [selectedCategory, selectedStatus, debouncedSearch]);

  useEffect(() => {
    const results = news.filter((item) => {
      const matchesSearch = item.headline.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = selectedCategory === "all" || 
        (typeof item.category === "object" 
          ? (item.category._id === selectedCategory || item.category.name === selectedCategory) 
          : (item.category === selectedCategory));
      const matchesStatus = selectedStatus === "all" || item.status === selectedStatus;
      return matchesSearch && matchesCategory && matchesStatus;
    });
    setFilteredNews(results);
  }, [search, news, selectedCategory, selectedStatus]);

  const fetchCategories = useCallback(async () => {
    try {
      const data = await api("/category");
      const categoriesArray = data.categories || data.data || data;
      setCategories(Array.isArray(categoriesArray) ? categoriesArray : []);
      setActiveCategoriesCount(Array.isArray(categoriesArray) ? categoriesArray.length : 0);
    } catch (err) {
      console.error("Failed to fetch categories", err);
    }
  }, []);

  const fetchNews = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const queryParams = new URLSearchParams({
        page: String(page),
        limit: "10",
        category: selectedCategory,
        status: selectedStatus,
      });
      if (debouncedSearch) {
        queryParams.append("search", debouncedSearch);
      }
      const data = await api(`/news?${queryParams.toString()}`);
      const newsArray = data.news || data.data || data;
      setNews(Array.isArray(newsArray) ? newsArray : []);
      setTotalPages(data.totalPages || 1);
      
      const total = data.totalCount || data.totalNews || data.total || data.totalDocs || (Array.isArray(newsArray) ? newsArray.length : 0);
      setTotalNews(total);
      
      if (data.totalCategories) {
        setActiveCategoriesCount(data.totalCategories);
      }
      
      if (data.recentCount) {
        setRecentCount(data.recentCount);
      } else if (page === 1 && selectedCategory === "all" && !debouncedSearch) {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const recent = (newsArray as News[]).filter(
          (n) => new Date(n.createdAt) > sevenDaysAgo
        ).length;
        setRecentCount(recent);
      }
    } catch (err: unknown) {
      console.error("Failed to fetch news", err);
      setNews([]);
      setError("Unable to load news items right now.");
    } finally {
      setLoading(false);
    }
  }, [page, selectedCategory, selectedStatus, debouncedSearch]);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleDelete = async (id: string) => {
    const confirmed = await confirm({
      title: "Delete this news post?",
      description: "This action cannot be undone.",
      confirmText: "Delete",
      variant: "danger",
    });

    if (!confirmed) return;

    try {
      await api(`/news/${id}`, "DELETE");
      setNews(news.filter((n) => n._id !== id));
      showToast({ title: "News deleted", variant: "success" });
    } catch {
      showToast({ title: "Failed to delete news", variant: "error" });
    }
  };

  const handleCopyLink = (slug: string) => {
    if (!slug) {
      showToast({ title: "No slug found for this news", variant: "error" });
      return;
    }
    const url = `https://jubotaranews.com/news/${slug}`;
    navigator.clipboard.writeText(url).then(() => {
      showToast({ title: "Link copied to clipboard", variant: "success" });
    }).catch(() => {
      showToast({ title: "Failed to copy link", variant: "error" });
    });
  };

  return (
    <>
      <DashboardPage className="text-gray-900">
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <h1 className="text-3xl font-bold text-gray-800">News Dashboard</h1>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <select
              className="rounded-lg border px-4 py-2 text-gray-900 shadow-sm outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
            <select
              className="rounded-lg border px-4 py-2 text-gray-900 shadow-sm outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="pending">Pending</option>
              <option value="draft">Draft</option>
            </select>
            <input
              type="text"
              placeholder="Search by headline..."
              className="w-full rounded-lg border px-4 py-2 text-gray-900 shadow-sm outline-none focus:ring-2 focus:ring-blue-500 lg:w-80"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <p className="text-sm font-medium text-gray-500 mb-1">Total News</p>
            <h3 className="text-2xl font-bold text-gray-800">{totalNews}</h3>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <p className="text-sm font-medium text-gray-500 mb-1">
              Recent (7 Days)
            </p>
            <h3 className="text-2xl font-bold text-gray-800">
              {recentCount}
            </h3>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <p className="text-sm font-medium text-gray-500 mb-1">
              Active Categories
            </p>
            <h3 className="text-2xl font-bold text-gray-800">
              {activeCategoriesCount}
            </h3>
          </div>
        </div>

        {loading ? (
          <LoadingState label="Loading news items..." />
        ) : error ? (
          <ErrorState
            title="Could not load news"
            description={error}
            onRetry={fetchNews}
          />
        ) : filteredNews.length === 0 ? (
          <EmptyState
            title={search ? "No matching news found" : "No news items yet"}
            description={
              search
                ? "Try a different headline search."
                : "Create your first news post to populate the dashboard."
            }
          />
        ) : (
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
            <table className="min-w-180 w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                    Headline
                  </th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                    Category
                  </th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                    Author
                  </th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                    Status
                  </th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                    Views
                  </th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                    Date
                  </th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredNews.map((item) => (
                  <tr
                    key={item._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        {item.imageSrc && (
                          <Image
                            src={item.imageSrc}
                            alt=""
                            width={40}
                            height={40}
                            className="w-10 h-10 rounded object-cover shrink-0"
                          />
                        )}
                        <span className="font-medium text-gray-800 line-clamp-1">
                          {item.headline}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {typeof item.category === "object"
                        ? item.category.name
                        : item.category || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {item.authorName || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          item.status === "published"
                            ? "bg-green-100 text-green-800"
                            : item.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {item.status?.charAt(0).toUpperCase() + (item.status?.slice(1) || "") || "Draft"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
      {item.viewsCount?.toLocaleString() || 0}
    </td>
    <td className="px-6 py-4 text-sm text-gray-500">
      {new Date(item.createdAt).toLocaleDateString()}
    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-3">
                        <button
                          onClick={() => setSelectedNews(item)}
                          title="Create photocard"
                          className="text-violet-600 hover:text-violet-800 transition-colors"
                          disabled={!item.imageSrc}
                        >
                          <ImageDown size={18} />
                        </button>
                        <button
                          onClick={() => handleCopyLink(item.slug || "")}
                          title="Copy link"
                          className="text-emerald-600 hover:text-emerald-800 transition-colors"
                        >
                          <LinkIcon size={18} />
                        </button>
                        <Link
                          href={`/dashboard/edit/${item._id}`}
                          title="Edit"
                          className="text-blue-600 hover:text-blue-800 transition-colors"
                        >
                          <Edit size={18} />
                        </Link>
                        <button
                          onClick={() => handleDelete(item._id)}
                          title="Delete"
                          className="text-red-600 hover:text-red-800 transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>

            {/* Pagination Controls */}
            <div className="flex flex-col items-start gap-3 border-t border-gray-200 bg-gray-50 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors shadow-sm"
              >
                Previous
              </button>
              <span className="text-sm text-gray-600 font-medium">
                Page {page} of {totalPages}
              </span>
              <button
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors shadow-sm"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </DashboardPage>

      {selectedNews ? (
        <PhotoCardModal
          news={selectedNews}
          logoUrl="/images/logo4.png"
          onClose={() => setSelectedNews(null)}
        />
      ) : null}
    </>
  );
}
