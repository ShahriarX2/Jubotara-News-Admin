"use client";
import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { api, Category } from "../../lib/api";
import { useFeedback } from "@/components/FeedbackProvider";
import { DashboardPage } from "@/components/DashboardShell";
import NewsForm from "@/components/NewsForm";
import { stripHtml } from "@/app/lib/utils";

export default function CreateNews() {
  const [headline, setHeadline] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [reporterInfo, setReporterInfo] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [imageCaption, setImageCaption] = useState("");
  const [status, setStatus] = useState("published");
  const [isFeatured, setIsFeatured] = useState(false);
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [tags, setTags] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchingCategories, setFetchingCategories] = useState(true);
  const router = useRouter();
  const { showToast } = useFeedback();

  const fallbackCategories = useMemo<Category[]>(
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
    const initializeAuthor = async () => {
      // Defer execution to avoid synchronous setState inside useEffect
      await Promise.resolve();

      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          const user = JSON.parse(storedUser);
          if (user.name) {
            setAuthorName((prev) => prev || user.name);
          }
        } catch (err) {
          console.error("Failed to parse user from localStorage", err);
        }
      }

      try {
        const data = await api("/auth/me");
        const user = data.user || data.data || data;
        if (user && user.name) {
          setAuthorName((prev) => prev || user.name);
          localStorage.setItem("user", JSON.stringify(user));
        }
      } catch (err) {
        console.error("Failed to fetch current user", err);
      }
    };

    initializeAuthor();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await api("/category");
        const categoriesArray = data.categories || data.data || data;

        if (Array.isArray(categoriesArray) && categoriesArray.length > 0) {
          setCategories(categoriesArray);
        } else {
          setCategories(fallbackCategories);
        }
      } catch (error) {
        console.error("Failed to fetch categories, using fallbacks", error);
        setCategories(fallbackCategories);
      } finally {
        setFetchingCategories(false);
      }
    };

    fetchCategories();
  }, [router, fallbackCategories]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setImage(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("headline", headline);
    formData.append("content", content);
    formData.append("category", category);
    formData.append("reporterInfo", reporterInfo);
    formData.append("authorName", authorName);
    formData.append("imageCaption", imageCaption);
    formData.append("status", status);
    formData.append("isFeatured", String(isFeatured));
    formData.append("metaTitle", metaTitle || headline);
    formData.append("metaDescription", metaDescription || stripHtml(content).slice(0, 160));

    if (tags) {
      const tagsArray = tags.split(",").map((t) => t.trim()).filter((t) => t !== "");
      tagsArray.forEach((tag) => formData.append("tags", tag));
    }

    if (image) {
      formData.append("image", image);
    }
    try {
      await api("/news", "POST", formData);
      showToast({ title: "News published", variant: "success" });
      router.push("/dashboard");
    } catch (error: unknown) {
      showToast({
        title: "Failed to publish news",
        description: error instanceof Error ? error.message : "Failed to publish news",
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardPage className="text-gray-900">
        <div className="mx-auto max-w-5xl">
          <h1 className="mb-8 text-3xl font-bold text-gray-800">Create New Post</h1>
          <NewsForm
            mode="create"
            headline={headline}
            content={content}
            category={category}
            reporterInfo={reporterInfo}
            authorName={authorName}
            imageCaption={imageCaption}
            status={status}
            isFeatured={isFeatured}
            metaTitle={metaTitle}
            metaDescription={metaDescription}
            tags={tags}
            preview={preview}
            categories={categories}
            loading={loading}
            fetchingCategories={fetchingCategories}
            onHeadlineChange={setHeadline}
            onContentChange={setContent}
            onCategoryChange={setCategory}
            onReporterInfoChange={setReporterInfo}
            onAuthorNameChange={setAuthorName}
            onImageCaptionChange={setImageCaption}
            onStatusChange={setStatus}
            onIsFeaturedChange={setIsFeatured}
            onMetaTitleChange={setMetaTitle}
            onMetaDescriptionChange={setMetaDescription}
            onTagsChange={setTags}
            onImageChange={handleImageChange}
            onRemoveImage={() => {
              setPreview(null);
              setImage(null);
            }}
            onCancel={() => router.push("/dashboard")}
            onSubmit={handleSubmit}
          />
        </div>
    </DashboardPage>
  );
}
