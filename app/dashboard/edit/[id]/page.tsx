"use client";
import { useState, useEffect, useMemo, use } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Sidebar from "@/components/Sidebar";
import { api, Category, News } from "@/app/lib/api";
import { Upload, X, Loader2 } from "lucide-react";

export default function EditNews({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [headline, setHeadline] = useState("");
  const [content, setContent] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(true);
  const router = useRouter();

  const FALLBACK_CATEGORIES = useMemo<Category[]>(
    () => [
      { _id: "সারাদেশ", name: "সারাদেশ", slug: "all-country" },
      { _id: "রাজনীতি", name: "রাজনীতি", slug: "politics" },
      { _id: "আন্তর্জাতিক", name: "আন্তর্জাতিক", slug: "international" },
      { _id: "খেলাধুলা", name: "খেলাধুলা", slug: "sports" },
      { _id: "বিনোদন", name: "বিনোদন", slug: "entertainment" },
      { _id: "প্রযুক্তি", name: "প্রযুক্তি", slug: "tech" },
    ],
    [],
  );

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    const fetchData = async () => {
      try {
        // Fetch Categories
        const catData = await api("/category", "GET", undefined, token);
        const categoriesArray = catData.categories || catData.data || catData;
        setCategories(
          Array.isArray(categoriesArray) && categoriesArray.length > 0
            ? categoriesArray
            : FALLBACK_CATEGORIES,
        );

        // Fetch News Item
        const res = await api(`/news/${id}`, "GET", undefined, token);
        const newsItem: News = res.data || res;

        setHeadline(newsItem.headline);
        setContent(newsItem.content);
        setCategoryId(
          typeof newsItem.category === "string"
            ? newsItem.category
            : (newsItem.category as Category)._id,
        );
        if (newsItem.imageSrc) setPreview(newsItem.imageSrc);
      } catch (err) {
        console.error("Failed to fetch data", err);
        alert("Failed to load news data");
      } finally {
        setFetchingData(false);
      }
    };

    fetchData();
  }, [id, router, FALLBACK_CATEGORIES]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("headline", headline);
    formData.append("content", content);
    formData.append("category", categoryId);
    if (image) {
      formData.append("image", image);
    }

    try {
      await api(`/news/${id}`, "PATCH", formData, token || "");
      router.push("/dashboard");
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to update news");
    } finally {
      setLoading(false);
    }
  };

  if (fetchingData) {
    return (
      <div className="flex bg-gray-50 min-h-screen">
        <Sidebar />
        <main className="ml-64 p-8 w-full flex justify-center items-center">
          <Loader2 className="animate-spin text-blue-600" size={48} />
        </main>
      </div>
    );
  }

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />

      <main className="ml-64 p-8 w-full">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">Edit Post</h1>

          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 space-y-6"
          >
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Headline
              </label>
              <input
                required
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-gray-900 bg-white"
                placeholder="Enter news headline..."
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Category
                </label>
                <select
                  required
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-white text-gray-900"
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Cover Image
                </label>
                <div className="relative w-full h-32">
                  {!preview ? (
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 text-gray-400 mb-2" />
                        <p className="text-sm text-gray-500">
                          Click to upload image
                        </p>
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                    </label>
                  ) : (
                    <div className="relative w-full h-full">
                      <Image
                        fill
                        src={preview}
                        alt="Preview"
                        className="object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setPreview(null);
                          setImage(null);
                        }}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Content
              </label>
              <textarea
                required
                rows={10}
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-gray-900 bg-white"
                placeholder="Write your content here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-bold transition-all disabled:bg-blue-300 shadow-md"
              >
                {loading && <Loader2 className="animate-spin" size={20} />}
                <span>{loading ? "Updating..." : "Update Post"}</span>
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
