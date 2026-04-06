"use client";
import { useEffect, useState } from "react";
import { api, Category } from "../../lib/api";
import { Trash2, Edit, Plus, Loader2, X } from "lucide-react";
import { useFeedback } from "@/components/FeedbackProvider";
import { EmptyState, ErrorState, LoadingState } from "@/components/DashboardState";
import { DashboardPage } from "@/components/DashboardShell";

const getErrorMessage = (error: unknown, fallback: string) =>
  error instanceof Error ? error.message : fallback;

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { confirm, showToast } = useFeedback();

  const fetchCategories = async () => {
    setError(null);
    try {
      const data = await api("/category");
      const categoriesArray = data.categories || data.data || data;
      setCategories(Array.isArray(categoriesArray) ? categoriesArray : []);
    } catch (err) {
      console.error("Failed to fetch categories", err);
      setError("Unable to load categories right now.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const trimmedName = name.trim();
    const finalSlug = slug.trim() || trimmedName.toLowerCase().replace(/\s+/g, '-');
    try {
      if (editingCategory) {
        await api(`/category/${editingCategory._id}`, "PUT", {
          name: trimmedName,
          slug: finalSlug,
        });
      } else {
        await api("/category", "POST", {
          name: trimmedName,
          slug: finalSlug,
        });
      }
      setShowModal(false);
      setName("");
      setSlug("");
      setEditingCategory(null);
      fetchCategories();
      showToast({
        title: editingCategory ? "Category updated" : "Category created",
        variant: "success",
      });
    } catch (error: unknown) {
      showToast({
        title: "Failed to save category",
        description: getErrorMessage(error, "Failed to save category"),
        variant: "error",
      });
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

  const handleDelete = async (cat: Category) => {
    const confirmed = await confirm({
      title: "Delete this category?",
      description: "Any news assigned to it may be affected.",
      confirmText: "Delete",
      variant: "danger",
    });

    if (!confirmed) return;
    try {
      await api(`/category/${cat._id}`, "DELETE");
      fetchCategories();
      showToast({ title: "Category deleted", variant: "success" });
    } catch {
      showToast({ title: "Failed to delete category", variant: "error" });
    }
  };

  return (
    <>
      <DashboardPage className="text-gray-900">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
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
          <LoadingState label="Loading categories..." />
        ) : error ? (
          <ErrorState
            title="Could not load categories"
            description={error}
            onRetry={fetchCategories}
          />
        ) : categories.length === 0 ? (
          <EmptyState
            title="No categories found"
            description="Create a category to organize your news posts."
          />
        ) : (
          <div className="max-w-4xl overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="min-w-[560px] w-full text-left">
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
                          onClick={() => handleDelete(cat)}
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
          </div>
        )}
      </DashboardPage>

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
    </>
  );
}
