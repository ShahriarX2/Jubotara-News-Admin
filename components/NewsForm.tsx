"use client";

import Image from "next/image";
import { Upload, X, Loader2, CheckCircle2, Save } from "lucide-react";
import type { Category } from "@/app/lib/api";

interface NewsFormProps {
  mode: "create" | "edit";
  headline: string;
  content: string;
  category: string;
  reporterInfo: string;
  imageCaption: string;
  status: string;
  isFeatured: boolean;
  metaTitle: string;
  metaDescription: string;
  preview: string | null;
  categories: Category[];
  loading: boolean;
  fetchingCategories?: boolean;
  onHeadlineChange: (value: string) => void;
  onContentChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onReporterInfoChange: (value: string) => void;
  onImageCaptionChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onIsFeaturedChange: (value: boolean) => void;
  onMetaTitleChange: (value: string) => void;
  onMetaDescriptionChange: (value: string) => void;
  onImageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: () => void;
  onCancel: () => void;
  onSubmit: (event: React.FormEvent) => void;
}

export default function NewsForm({
  mode,
  headline,
  content,
  category,
  reporterInfo,
  imageCaption,
  status,
  isFeatured,
  metaTitle,
  metaDescription,
  preview,
  categories,
  loading,
  fetchingCategories = false,
  onHeadlineChange,
  onContentChange,
  onCategoryChange,
  onReporterInfoChange,
  onImageCaptionChange,
  onStatusChange,
  onIsFeaturedChange,
  onMetaTitleChange,
  onMetaDescriptionChange,
  onImageChange,
  onRemoveImage,
  onCancel,
  onSubmit,
}: NewsFormProps) {
  const isCreateMode = mode === "create";

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="space-y-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Headline
              </label>
              <input
                required
                className="w-full rounded-lg border border-gray-300 bg-white p-3 text-gray-900 outline-none transition-all focus:ring-2 focus:ring-blue-500"
                placeholder="Enter news headline..."
                value={headline}
                onChange={(event) => onHeadlineChange(event.target.value)}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Content
              </label>
              <textarea
                required
                rows={15}
                className="w-full rounded-lg border border-gray-300 bg-white p-3 text-gray-900 outline-none transition-all focus:ring-2 focus:ring-blue-500"
                placeholder="Write your content here..."
                value={content}
                onChange={(event) => onContentChange(event.target.value)}
              />
            </div>
          </div>

          <div className="space-y-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="border-b pb-2 text-lg font-bold text-gray-800">
              SEO Settings
            </h3>
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Meta Title
              </label>
              <input
                className="w-full rounded-lg border border-gray-300 bg-white p-3 text-gray-900 outline-none transition-all focus:ring-2 focus:ring-blue-500"
                placeholder={isCreateMode ? "SEO Title (defaults to headline)" : "SEO Title"}
                value={metaTitle}
                onChange={(event) => onMetaTitleChange(event.target.value)}
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Meta Description
              </label>
              <textarea
                rows={3}
                className="w-full rounded-lg border border-gray-300 bg-white p-3 text-gray-900 outline-none transition-all focus:ring-2 focus:ring-blue-500"
                placeholder="Short description for search engines..."
                value={metaDescription}
                onChange={(event) => onMetaDescriptionChange(event.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="border-b pb-2 text-lg font-bold text-gray-800">
              Publish Options
            </h3>

            <div>
              <label
                htmlFor="status"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Status
              </label>
              <select
                id="status"
                className="w-full rounded-lg border border-gray-300 bg-white p-2.5 text-gray-900 outline-none focus:ring-2 focus:ring-blue-500"
                value={status}
                onChange={(event) => onStatusChange(event.target.value)}
              >
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isFeatured"
                className="h-4 w-4 rounded text-blue-600 focus:ring-blue-500"
                checked={isFeatured}
                onChange={(event) => onIsFeaturedChange(event.target.checked)}
              />
              <label
                htmlFor="isFeatured"
                className="cursor-pointer text-sm font-semibold text-gray-700"
              >
                Featured Post
              </label>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Category
              </label>
              <select
                required
                className="w-full rounded-lg border border-gray-300 bg-white p-2.5 text-gray-900 outline-none focus:ring-2 focus:ring-blue-500"
                value={category}
                onChange={(event) => onCategoryChange(event.target.value)}
                disabled={fetchingCategories}
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category._id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Reporter Info
              </label>
              <input
                className="w-full rounded-lg border border-gray-300 bg-white p-2.5 text-gray-900 outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., নিজস্ব প্রতিবেদক"
                value={reporterInfo}
                onChange={(event) => onReporterInfoChange(event.target.value)}
              />
            </div>
          </div>

          <div className="space-y-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="border-b pb-2 text-lg font-bold text-gray-800">
              Media
            </h3>
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Featured Image
              </label>
              <div className="relative aspect-video w-full">
                {!preview ? (
                  <label className="flex h-full w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 transition-colors hover:bg-gray-50">
                    <Upload className="mb-2 h-8 w-8 text-gray-400" />
                    <p className="px-2 text-center text-xs text-gray-500">
                      {isCreateMode
                        ? "Click to upload featured image"
                        : "Click to upload image"}
                    </p>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={onImageChange}
                    />
                  </label>
                ) : (
                  <div className="group relative h-full w-full">
                    <Image
                      fill
                      src={preview}
                      alt="Preview"
                      className="rounded-lg object-cover"
                    />
                    <button
                      type="button"
                      title="Remove image"
                      onClick={onRemoveImage}
                      className="absolute top-2 right-2 rounded-full bg-red-500 p-1.5 text-white opacity-0 shadow-lg transition-colors group-hover:opacity-100 hover:bg-red-600"
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Image Caption
              </label>
              <input
                className="w-full rounded-lg border border-gray-300 bg-white p-2.5 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Photo credit or caption..."
                value={imageCaption}
                onChange={(event) => onImageCaptionChange(event.target.value)}
              />
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 rounded-xl bg-gray-100 py-4 font-bold text-gray-700 transition-all hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex flex-1 items-center justify-center space-x-2 rounded-xl bg-blue-600 py-4 font-bold text-white shadow-lg shadow-blue-100 transition-all hover:bg-blue-700 disabled:bg-blue-300 sm:flex-[2]"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : isCreateMode ? (
                <CheckCircle2 size={20} />
              ) : (
                <Save size={20} />
              )}
              <span>
                {loading
                  ? isCreateMode
                    ? "Publishing..."
                    : "Saving..."
                  : isCreateMode
                    ? "Publish News Post"
                    : "Save Changes"}
              </span>
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
