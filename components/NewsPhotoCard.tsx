"use client";

import { useEffect, useRef, useState } from "react";
import KanizPhotoCardAd from "./photocardAds/KanizPhotoCardAd";
import PrimePhotoCardAd from "./photocardAds/PrimePhotoCardAd";

interface NewsPhotoCardProps {
  headline: string;
  category: string;
  imageSrc: string;
  logoUrl?: string;
  date: string;
  commentText?: string;
  accentColor?: string;
  imageScale?: number;
  headlineFontSize?: number;
  footerBarFontSize?: number;
  centerTextFontSize?: number;
  isPreview?: boolean;
  adVariant?: "kaniz" | "prime" | "none";
  cardRef?: React.RefObject<HTMLDivElement | null>;
}

export default function NewsPhotoCard({
  headline,
  category,
  imageSrc,
  logoUrl,
  date,
  commentText = "বিস্তারিত কমেন্টে",
  accentColor = "#D9232D",
  imageScale = 1,
  headlineFontSize = 65,
  footerBarFontSize = 31,
  centerTextFontSize = 28,
  isPreview = false,
  adVariant = "kaniz",
  cardRef,
}: NewsPhotoCardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (!isPreview) {
      return;
    }

    const updateScale = () => {
      if (containerRef.current) {
        setScale(containerRef.current.offsetWidth / 1080);
      }
    };

    const observer = new ResizeObserver(updateScale);

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    updateScale();

    return () => observer.disconnect();
  }, [isPreview]);

  const content = (
    <div
      ref={isPreview ? undefined : cardRef}
      style={{
        width: "1080px",
        height: "1080px",
        position: "relative",
        overflow: "hidden",
        fontFamily: "var(--font-solaiman-lipi), Arial, Helvetica, sans-serif",
        backgroundColor: "#000000",
        color: "#ffffff",
        display: "flex",
        flexDirection: "column",
        border: "1px solid rgba(255, 255, 255, 0.1)", // Very subtle border for dark mode feel
      }}
    >
      <div style={{ position: "relative", width: "1080px", height: adVariant === "none" ? "1080px" : "940px" }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
          overflow: "hidden",
          transform: adVariant === "prime" ? "translateY(-10px)" : "none",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageSrc}
          alt="Background"
          crossOrigin="anonymous"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center center",
            transform: `scale(${imageScale})`,
            transition: "transform 0.2s ease-out",
          }}
        />
      </div>

      <div
        style={{
          position: "absolute",
          insetInline: 0,
          bottom: 0,
          height: "60%",
          background: `linear-gradient(to top, ${accentColor} 0%, transparent 100%)`,
          zIndex: 2,
        }}
      />

      <div
        style={{
          position: "absolute",
          top: 0,
          right: "50px",
          zIndex: 10,
          width: "165px",
          height: "240px",
          backgroundColor: accentColor,
          borderBottomLeftRadius: "80px",
          borderBottomRightRadius: "80px",
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
          paddingBottom: "25px",
        }}
      >
        <div
          style={{
            width: "135px",
            height: "130px",
            borderRadius: "999px",
            backgroundColor: "#ffffff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            border: "4px solid white",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={logoUrl || "/images/logo4.png"}
            alt="Jubotara News"
            crossOrigin="anonymous"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              padding: "10px",
            }}
          />
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: 0,
          bottom: adVariant === "kaniz" ? "68px" : "78px",
          width: "100%",
          padding: "0 60px 30px",
          zIndex: 10,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "stretch",
            gap: "25px",
          }}
        >
          <div
            style={{
              width: "10px",
              backgroundColor: "#facc15",
              borderRadius: "2px",
              flexShrink: 0,
            }}
          />
          <h1
            style={{
              fontSize: `${headlineFontSize}px`,
              lineHeight: 1.2,
              fontWeight: 800,
              margin: 0,
              color: "#ffffff",
              textShadow: "0 4px 12px rgba(0, 0, 0, 0.8)",
              whiteSpace: "pre-wrap",
            }}
          >
            {headline}
          </h1>
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: 0,
          bottom: 0,
          width: "100%",
          height: "80px",
          backgroundColor: accentColor,
          zIndex: 10,
          display: "flex",
          alignItems: "center",
          padding: "0 60px",
          fontSize: `${footerBarFontSize}px`,
        }}
      >
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            gap: "15px",
            fontWeight: 600,
          }}
        >
          <span style={{ textTransform: "uppercase" }}>{category}</span>
          <span style={{ opacity: 0.6 }}>|</span>
          <span>{date}</span>
        </div>

        <div
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            fontWeight: 600,
            fontSize: `${centerTextFontSize}px`,
          }}
        >
          <span>{commentText}</span>
        </div>

        <div
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "flex-end",
            gap: "10px",
            alignItems: "center",
            fontWeight: 700,
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
            <path d="M2 12h20" />
          </svg>
          <span>jubotaranews.com</span>
        </div>
      </div>
      </div>
      {adVariant === "kaniz" && <KanizPhotoCardAd />}
      {adVariant === "prime" && <PrimePhotoCardAd />}
    </div>
  );

  if (isPreview) {
    return (
      <div
        ref={containerRef}
        className="relative aspect-square w-full max-w-md overflow-hidden rounded-xl border border-gray-200 bg-white"
      >
        <div
          style={{
            transform: `scale(${scale})`,
            transformOrigin: "top center",
            width: "1080px",
            height: "1080px",
            position: "absolute",
            top: 0,
            left: "50%",
            marginLeft: "-540px",
          }}
        >
          {content}
        </div>
      </div>
    );
  }

  return <div className="absolute -left-[9999px] top-0">{content}</div>;
}
