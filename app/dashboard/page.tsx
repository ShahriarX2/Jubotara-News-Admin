"use client";
import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import { api, News } from "../lib/api";
import { useRouter } from "next/navigation";
import { Trash2, Edit } from "lucide-react";
import Image from "next/image";

export default function Dashboard() {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    const fetchNews = async () => {
      try {
        const data = await api("/news");
        // Defensive check: API might return { news: [] }, { data: [] }, or just []
        const newsArray = data.news || data.data || data;
        setNews(Array.isArray(newsArray) ? newsArray : []);
      } catch (err: unknown) {
        console.error("Failed to fetch news", err);
        setNews([]); // Ensure it stays an array on error
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [router]);

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
          <div className="text-sm text-gray-500">Total News: {news.length}</div>
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
                {news.map((item) => (
                  <tr
                    key={item._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <Image
                          src={item.imageSrc}
                          alt=""
                          width={40}
                          height={40}
                          className="w-10 h-10 rounded object-cover shrink-0"
                        />
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
                        <button
                          title="Edit"
                          className="text-blue-600 hover:text-blue-800 transition-colors"
                        >
                          <Edit size={18} />
                        </button>
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
            {news.length === 0 && (
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
