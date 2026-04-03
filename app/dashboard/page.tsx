"use client";
import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import { api, News } from "../lib/api";
import { useRouter } from "next/navigation";
import { Trash2, Edit } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Dashboard() {
  const [news, setNews] = useState<News[]>([]);
  const [filteredNews, setFilteredNews] = useState<News[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const router = useRouter();

  useEffect(() => {
    const results = news.filter((item) =>
      item.headline.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredNews(results);
  }, [search, news]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    const fetchNews = async () => {
      setLoading(true);
      try {
        const data = await api(`/news?page=${page}&limit=10`);
        const newsArray = data.news || data.data || data;
        setNews(Array.isArray(newsArray) ? newsArray : []);
        setTotalPages(data.totalPages || 1);
      } catch (err: unknown) {
        console.error("Failed to fetch news", err);
        setNews([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [router, page]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this news?")) return;

    const token = localStorage.getItem("token");
    try {
      await api(`/news/${id}`, "DELETE", undefined, token || "");
      setNews(news.filter((n) => n._id !== id));
    } catch {
      alert("Failed to delete news");
    }
  };

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />

      <main className="ml-64 p-8 w-full">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">News Dashboard</h1>
          <div className="flex items-center space-x-4">
            <input
              type="text"
              placeholder="Search by headline..."
              className="px-4 py-2 border rounded-lg text-gray-900 outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <p className="text-sm font-medium text-gray-500 mb-1">Total News</p>
            <h3 className="text-2xl font-bold text-gray-800">{news.length}</h3>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <p className="text-sm font-medium text-gray-500 mb-1">
              Recent (7 Days)
            </p>
            <h3 className="text-2xl font-bold text-gray-800">
              {
                news.filter(
                  (n) =>
                    new Date(n.createdAt) >
                    new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                ).length
              }
            </h3>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <p className="text-sm font-medium text-gray-500 mb-1">
              Active Categories
            </p>
            <h3 className="text-2xl font-bold text-gray-800">
              {new Set(news.map((n) => (typeof n.category === "object" ? n.category.name : n.category))).size}
            </h3>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center p-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                    Headline
                  </th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                    Category
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
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-3">
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

            {/* Pagination Controls */}
            <div className="flex justify-between items-center px-6 py-4 bg-gray-50 border-t border-gray-200">
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

            {filteredNews.length === 0 && (
              <div className="p-12 text-center text-gray-500">
                No news items found.
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
