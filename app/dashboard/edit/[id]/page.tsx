"use client";
import { useState, useEffect, useMemo, use } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Sidebar from "../../../../components/Sidebar";
import { api, Category, News } from "../../../lib/api";
import { Upload, X, Loader2, Save } from "lucide-react";

export default function EditNews({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [headline, setHeadline] = useState("");
  const [content, setContent] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [reporterInfo, setReporterInfo] = useState("");
  const [imageCaption, setImageCaption] = useState("");
  const [status, setStatus] = useState("published");
  const [isFeatured, setIsFeatured] = useState(false);
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");

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

        setHeadline(newsItem.headline || "");
        setContent(newsItem.content || "");
        setCategoryId(
          typeof newsItem.category === "string"
            ? newsItem.category
            : (newsItem.category as Category)?._id || "",
        );
        setReporterInfo(newsItem.reporterInfo || "");
        setImageCaption(newsItem.imageCaption || "");
        setStatus(newsItem.status || "published");
        setIsFeatured(!!newsItem.isFeatured);
        setMetaTitle(newsItem.metaTitle || "");
        setMetaDescription(newsItem.metaDescription || "");
        
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
    formData.append("reporterInfo", reporterInfo);
    formData.append("imageCaption", imageCaption);
    formData.append("status", status);
    formData.append("isFeatured", String(isFeatured));
    formData.append("metaTitle", metaTitle);
    formData.append("metaDescription", metaDescription);

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
    <div className="flex bg-gray-50 min-h-screen text-gray-900">
      <Sidebar />

      <main className="ml-64 p-8 w-full">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">
            Edit Post
          </h1>

          <form
            onSubmit={handleSubmit}
            className="space-y-8"
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column: Main Content */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
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

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Content
                    </label>
                    <textarea
                      required
                      rows={15}
                      className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-gray-900 bg-white"
                      placeholder="Write your content here..."
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                    />
                  </div>
                </div>

                {/* SEO Settings */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
                  <h3 className="text-lg font-bold text-gray-800 border-b pb-2">SEO Settings</h3>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Meta Title
                    </label>
                    <input
                      className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-gray-900 bg-white"
                      placeholder="SEO Title"
                      value={metaTitle}
                      onChange={(e) => setMetaTitle(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Meta Description
                    </label>
                    <textarea
                      rows={3}
                      className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-gray-900 bg-white"
                      placeholder="Short description for search engines..."
                      value={metaDescription}
                      onChange={(e) => setMetaDescription(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Right Column: Sidebar Options */}
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
                  <h3 className="text-lg font-bold text-gray-800 border-b pb-2">Publish Options</h3>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none bg-white text-gray-900"
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                    >
                      <option value="published">Published</option>
                      <option value="draft">Draft</option>
                    </select>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      id="isFeatured"
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                      checked={isFeatured}
                      onChange={(e) => setIsFeatured(e.target.checked)}
                    />
                    <label htmlFor="isFeatured" className="text-sm font-semibold text-gray-700 cursor-pointer">
                      Featured Post
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      required
                      className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none bg-white text-gray-900"
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
                      Reporter Info
                    </label>
                    <input
                      className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none bg-white text-gray-900"
                      placeholder="e.g., নিজস্ব প্রতিবেদক"
                      value={reporterInfo}
                      onChange={(e) => setReporterInfo(e.target.value)}
                    />
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
                  <h3 className="text-lg font-bold text-gray-800 border-b pb-2">Media</h3>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Featured Image
                    </label>
                    <div className="relative w-full aspect-video">
                      {!preview ? (
                        <label className="flex flex-col items-center justify-center w-full h-full border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                          <Upload className="w-8 h-8 text-gray-400 mb-2" />
                          <p className="text-xs text-gray-500 text-center px-2">Click to upload image</p>
                          <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={handleImageChange}
                          />
                        </label>
                      ) : (
                        <div className="relative w-full h-full group">
                          <Image
                            fill
                            src={preview}
                            alt="Preview"
                            className="object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            title="Remove image"
                            onClick={() => {
                              setPreview(null);
                              setImage(null);
                            }}
                            className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg opacity-0 group-hover:opacity-100"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Image Caption
                    </label>
                    <input
                      className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none bg-white text-gray-900 text-sm"
                      placeholder="Photo credit or caption..."
                      value={imageCaption}
                      onChange={(e) => setImageCaption(e.target.value)}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold transition-all disabled:bg-blue-300 shadow-lg shadow-blue-100 mt-4"
                >
                  {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                  <span>{loading ? "Saving..." : "Save Changes"}</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
