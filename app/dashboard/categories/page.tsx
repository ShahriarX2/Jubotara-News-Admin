"use client";
import { useEffect, useState } from "react";
import Sidebar from "../../../components/Sidebar";
import { api, Category } from "../../lib/api";
import { useRouter } from "next/navigation";
import { Trash2, Edit, Plus, Loader2, X } from "lucide-react";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const router = useRouter();

  const fetchCategories = async () => {
    try {
      const data = await api("/category");
      const categoriesArray = data.categories || data.data || data;
      setCategories(Array.isArray(categoriesArray) ? categoriesArray : []);
    } catch (err) {
      console.error("Failed to fetch categories", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    fetchCategories();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const token = localStorage.getItem("token");

    try {
      if (editingCategory) {
        await api(`/category/${editingCategory._id}`, "PATCH", { name, slug }, token || "");
      } else {
        await api("/category", "POST", { name, slug }, token || "");
      }
      setShowModal(false);
      setName("");
      setSlug("");
      setEditingCategory(null);
      fetchCategories();
    } catch (err: any) {
      alert(err.message || "Failed to save category");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (cat: Category) => {
    setEditingCategory(cat);
    setName(cat.name);
    setSlug(cat.slug);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    const token = localStorage.getItem("token");
    try {
      await api(`/category/${id}`, "DELETE", undefined, token || "");
      fetchCategories();
    } catch (err) {
      alert("Failed to delete category");
    }
  };

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />

      <main className="ml-64 p-8 w-full text-gray-900">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Categories</h1>
          <button
            onClick={() => {
              setEditingCategory(null);
              setName("");
              setSlug("");
              setShowModal(true);
            }}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors shadow-md"
          >
            <Plus size={20} />
            <span className="font-semibold">Add Category</span>
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center p-20">
            <Loader2 className="animate-spin text-blue-600" size={48} />
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden max-w-4xl">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-600 uppercase">Name</th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-600 uppercase">Slug</th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-600 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {categories.map((cat) => (
                  <tr key={cat._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium">{cat.name}</td>
                    <td className="px-6 py-4 text-gray-500">{cat.slug}</td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-3">
                        <button
                          onClick={() => handleEdit(cat)}
                          className="text-blue-600 hover:text-blue-800 transition-colors"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(cat._id)}
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
            {categories.length === 0 && (
              <div className="p-12 text-center text-gray-500">No categories found.</div>
            )}
          </div>
        )}
      </main>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-bold text-gray-800">
                {editingCategory ? "Edit Category" : "Add New Category"}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Category Name</label>
                <input
                  required
                  className="w-full border border-gray-300 rounded-lg p-2.5 text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (!editingCategory) setSlug(e.target.value.toLowerCase().replace(/\s+/g, "-"));
                  }}
                  placeholder="e.g., Politics"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Slug</label>
                <input
                  required
                  className="w-full border border-gray-300 rounded-lg p-2.5 text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="e.g., politics"
                />
              </div>
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-lg transition-all disabled:bg-blue-300"
                >
                  {submitting && <Loader2 className="animate-spin" size={18} />}
                  <span>{editingCategory ? "Update Category" : "Create Category"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
