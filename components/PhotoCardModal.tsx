"use client";

import { useRef, useState } from "react";
import { domToPng } from "modern-screenshot";
import { Download, Loader2, X } from "lucide-react";
import type { News } from "@/app/lib/api";
import NewsPhotoCard from "@/components/NewsPhotoCard";
import { useFeedback } from "@/components/FeedbackProvider";

interface PhotoCardModalProps {
  news: News;
  onClose: () => void;
  logoUrl?: string;
}

const DEFAULT_COMMENT = "বিস্তারিত কমেন্টে";

export default function PhotoCardModal({
  news,
  onClose,
  logoUrl,
}: PhotoCardModalProps) {
  const [headline, setHeadline] = useState(news.headline);
  const [headlineFontSize, setHeadlineFontSize] = useState(65);
  const [footerBarFontSize, setFooterBarFontSize] = useState(34);
  const [centerTextFontSize, setCenterTextFontSize] = useState(28);
  const [accentColor, setAccentColor] = useState("#D9232D");
  const [imageScale, setImageScale] = useState(1);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const { showToast } = useFeedback();

  const category =
    typeof news.category === "string"
      ? news.category
      : news.category?.name || "Uncategorized";

  const dateSource = news.publishedAt || news.createdAt || new Date().toISOString();
  const date = new Date(dateSource).toLocaleDateString("bn-BD", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const handleDownload = async () => {
    if (!cardRef.current) {
      return;
    }

    setIsDownloading(true);

    try {
      const dataUrl = await domToPng(cardRef.current, {
        quality: 1,
        scale: 2,
      });

      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `news-card-${news._id}.png`;
      link.click();
      showToast({ title: "Photocard downloaded", variant: "success" });
    } catch (error) {
      console.error("Failed to export photo card", error);
      showToast({ title: "Failed to generate photocard", variant: "error" });
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="flex max-h-[95vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl md:flex-row">
        <div className="flex flex-1 items-center justify-center border-b border-gray-200 bg-gray-100 p-6 md:border-b-0 md:border-r">
          <div className="w-full max-w-md">
            <h3 className="mb-4 text-center text-sm font-bold uppercase tracking-[0.2em] text-gray-500">
              Live Preview
            </h3>
            <NewsPhotoCard
              headline={headline}
              category={category}
              imageSrc={news.imageSrc}
              logoUrl={logoUrl}
              date={date}
              commentText={DEFAULT_COMMENT}
              accentColor={accentColor}
              imageScale={imageScale}
              headlineFontSize={headlineFontSize}
              footerBarFontSize={footerBarFontSize}
              centerTextFontSize={centerTextFontSize}
              isPreview
            />
          </div>
        </div>

        <div className="w-full overflow-y-auto p-8 md:w-[28rem]">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Customize Card</h2>
            <button
              type="button"
              title="Close"
              onClick={onClose}
              className="rounded-full p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-800"
            >
              <X size={22} />
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <label className="mb-2 block text-sm font-bold uppercase text-gray-700">
                Headline
              </label>
              <textarea
                value={headline}
                onChange={(event) => setHeadline(event.target.value)}
                className="h-28 w-full rounded-xl border-2 border-gray-200 p-3 text-lg font-medium text-gray-900 outline-none transition focus:border-blue-500"
              />
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="block text-sm font-bold uppercase text-gray-700">
                  Headline Font Size
                </label>
                <span className="rounded-lg bg-blue-50 px-2 py-1 text-xs font-bold text-blue-600">
                  {headlineFontSize}px
                </span>
              </div>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="45"
                  max="100"
                  step="5"
                  value={headlineFontSize}
                  onChange={(event) => setHeadlineFontSize(Number(event.target.value))}
                  className="h-2 flex-1 cursor-pointer appearance-none rounded-lg bg-gray-200 accent-blue-600"
                />
                <button
                  type="button"
                  onClick={() => setHeadlineFontSize(65)}
                  className="text-xs font-bold text-gray-400 transition hover:text-red-500"
                >
                  RESET
                </button>
              </div>
            </div>

            {showAdvanced && (
              <>
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label className="block text-sm font-bold uppercase text-gray-700">
                      Footer Font Size
                    </label>
                    <span className="rounded-lg bg-blue-50 px-2 py-1 text-xs font-bold text-blue-600">
                      {footerBarFontSize}px
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min="20"
                      max="37"
                      step="1"
                      value={footerBarFontSize}
                      onChange={(event) => setFooterBarFontSize(Number(event.target.value))}
                      className="h-2 flex-1 cursor-pointer appearance-none rounded-lg bg-gray-200 accent-blue-600"
                    />
                    <button
                      type="button"
                      onClick={() => setFooterBarFontSize(34)}
                      className="text-xs font-bold text-gray-400 transition hover:text-red-500"
                    >
                      RESET
                    </button>
                  </div>
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label className="block text-sm font-bold uppercase text-gray-700">
                      Center Text Size
                    </label>
                    <span className="rounded-lg bg-blue-50 px-2 py-1 text-xs font-bold text-blue-600">
                      {centerTextFontSize}px
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min="20"
                      max="37"
                      step="1"
                      value={centerTextFontSize}
                      onChange={(event) => setCenterTextFontSize(Number(event.target.value))}
                      className="h-2 flex-1 cursor-pointer appearance-none rounded-lg bg-gray-200 accent-blue-600"
                    />
                    <button
                      type="button"
                      onClick={() => setCenterTextFontSize(28)}
                      className="text-xs font-bold text-gray-400 transition hover:text-red-500"
                    >
                      RESET
                    </button>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold uppercase text-gray-700">
                    Theme Color
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      type="color"
                      value={accentColor}
                      onChange={(event) => setAccentColor(event.target.value)}
                      className="h-16 w-16 cursor-pointer rounded-xl border-2 border-gray-200"
                    />
                    <input
                      type="text"
                      value={accentColor}
                      onChange={(event) => setAccentColor(event.target.value)}
                      className="flex-1 rounded-xl border-2 border-gray-200 p-3 font-mono text-gray-900 outline-none transition focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label className="block text-sm font-bold uppercase text-gray-700">
                      Image Zoom
                    </label>
                    <span className="rounded-lg bg-blue-50 px-2 py-1 text-xs font-bold text-blue-600">
                      {(imageScale * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min="1"
                      max="3"
                      step="0.01"
                      value={imageScale}
                      onChange={(event) => setImageScale(Number(event.target.value))}
                      className="h-2 flex-1 cursor-pointer appearance-none rounded-lg bg-gray-200 accent-blue-600"
                    />
                    <button
                      type="button"
                      onClick={() => setImageScale(1)}
                      className="text-xs font-bold text-gray-400 transition hover:text-red-500"
                    >
                      RESET
                    </button>
                  </div>
                </div>
              </>
            )}

            <button
              type="button"
              onClick={() => setShowAdvanced((current) => !current)}
              className="text-sm font-bold text-blue-600 transition hover:text-blue-800"
            >
              {showAdvanced ? "Hide" : "Show"} Advanced Options
            </button>

            <div className="border-t border-gray-200 pt-6">
              <button
                type="button"
                onClick={handleDownload}
                disabled={isDownloading}
                className="flex w-full items-center justify-center gap-3 rounded-xl bg-blue-600 py-4 font-bold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700 disabled:bg-blue-400"
              >
                {isDownloading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <Download size={20} />
                    <span>Download PNG</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        <NewsPhotoCard
          cardRef={cardRef}
          headline={headline}
          category={category}
          imageSrc={news.imageSrc}
          logoUrl={logoUrl}
          date={date}
          commentText={DEFAULT_COMMENT}
          accentColor={accentColor}
          imageScale={imageScale}
          headlineFontSize={headlineFontSize}
          footerBarFontSize={footerBarFontSize}
          centerTextFontSize={centerTextFontSize}
        />
      </div>
    </div>
  );
}
