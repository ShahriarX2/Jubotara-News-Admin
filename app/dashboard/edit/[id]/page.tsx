"use client";
import { useState, useEffect, useMemo, use } from "react";
import { useRouter } from "next/navigation";
import { api, Category, News } from "@/app/lib/api";
import { Loader2 } from "lucide-react";
import { useFeedback } from "@/components/FeedbackProvider";
import { DashboardPage } from "@/components/DashboardShell";
import NewsForm from "@/components/NewsForm";

export default function EditNews({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [headline, setHeadline] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
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
    const token = localStorage.getItem("token");

    const fetchData = async () => {
      try {
        const categoryData = await api("/category", "GET", undefined, token || "");
        const categoriesArray =
          categoryData.categories || categoryData.data || categoryData;

        setCategories(
          Array.isArray(categoriesArray) && categoriesArray.length > 0
            ? categoriesArray
            : fallbackCategories,
        );

        const response = await api(`/news/${id}`, "GET", undefined, token || "");
        const newsItem: News = response.data || response;

        setHeadline(newsItem.headline || "");
        setContent(newsItem.content || "");
        setCategory(
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

        if (newsItem.imageSrc) {
          setPreview(newsItem.imageSrc);
        }
      } catch (error) {
        console.error("Failed to fetch data", error);
        showToast({
          title: "Failed to load news data",
          variant: "error",
        });
      } finally {
        setFetchingData(false);
      }
    };

    void fetchData();
  }, [id, router, fallbackCategories, showToast]);

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

    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("headline", headline);
    formData.append("content", content);
    formData.append("category", category);
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
      await api(`/news/${id}`, "PUT", formData, token || "");
      showToast({ title: "News updated", variant: "success" });
      router.push("/dashboard");
    } catch (error: unknown) {
      showToast({
        title: "Failed to update news",
        description: error instanceof Error ? error.message : "Failed to update news",
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  if (fetchingData) {
    return (
      <DashboardPage className="flex min-h-[calc(100vh-64px)] items-center justify-center lg:min-h-screen">
          <Loader2 className="animate-spin text-blue-600" size={48} />
      </DashboardPage>
    );
  }

  return (
    <DashboardPage className="text-gray-900">
        <div className="mx-auto max-w-5xl">
          <h1 className="mb-8 text-3xl font-bold text-gray-800">Edit Post</h1>
          <NewsForm
            mode="edit"
            headline={headline}
            content={content}
            category={category}
            reporterInfo={reporterInfo}
            imageCaption={imageCaption}
            status={status}
            isFeatured={isFeatured}
            metaTitle={metaTitle}
            metaDescription={metaDescription}
            preview={preview}
            categories={categories}
            loading={loading}
            onHeadlineChange={setHeadline}
            onContentChange={setContent}
            onCategoryChange={setCategory}
            onReporterInfoChange={setReporterInfo}
            onImageCaptionChange={setImageCaption}
            onStatusChange={setStatus}
            onIsFeaturedChange={setIsFeatured}
            onMetaTitleChange={setMetaTitle}
            onMetaDescriptionChange={setMetaDescription}
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
