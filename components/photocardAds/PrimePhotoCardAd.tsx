import React from "react";

const PrimePhotoCardAd = () => {
  return (
    <div
      style={{
        width: "100%",
        height: "140px",
        display: "flex",
        flexDirection: "column",
        fontFamily: "var(--font-solaiman-lipi), Arial, sans-serif",
        overflow: "hidden",
      }}
    >
      {/* Top Tier: Dark Green Header */}
      <div
        style={{
          height: "35px", // Increased for padding
          backgroundColor: "#006a4e",
          color: "#ffffff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "20px", // Slightly larger
          fontWeight: 700,
          letterSpacing: "0.5px",
          padding: "0 20px",
        }}
      >
        সর্বোত্তম চিকিৎসা সেবার প্রত্যয়ে...
      </div>

      {/* Middle Tier: Lime Green Body */}
      <div
        style={{
          flex: 1,
          backgroundColor: "#8cc63f",
          display: "flex",
          alignItems: "center",
          padding: "0 40px",
          position: "relative",
          gap: "25px",
        }}
      >
        {/* Logo Container */}
        <div
          style={{
            height: "65px",
            width: "65px",
            backgroundColor: "#ffffff",
            borderRadius: "50%",
            padding: "5px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            zIndex: 2,
          }}
        >
          <img
            src="/images/prime-logo.png"
            alt="Logo"
            style={{
              maxWidth: "100%",
              maxHeight: "100%",
              objectFit: "contain",
            }}
          />
        </div>

        {/* Text Area */}
        <div style={{ zIndex: 2 }}>
          <h2
            style={{
              fontSize: "36px", // Adjusted for new height balance
              fontWeight: 900,
              margin: "2px 0 0",
              color: "#006a4e",
              lineHeight: 1,
            }}
          >
            প্রাইম হাসপাতাল এন্ড ডায়াগনস্টিক সেন্টার
          </h2>
          <div style={{ height: "2.5px", backgroundColor: "#ED1C24", width: "100%" }} />
          <p
            style={{
              fontSize: "18px",
              margin: "2px 0 0",
              color: "#003d2d",
              fontWeight: 600,
            }}
          >
            জেলা সদর হাসপাতাল রোড, গাইবান্ধা।
          </p>
        </div>

        {/* Decorative corner */}
        <div 
          style={{
            position: "absolute",
            right: 0,
            top: 0,
            bottom: 0,
            width: "150px",
            background: "linear-gradient(135deg, transparent 50%, rgba(255,255,255,0.15) 50%)",
            zIndex: 1,
          }}
        />
      </div>

      {/* Bottom Tier: Dark Green Footer */}
      <div
        style={{
          height: "45px", // Increased for padding
          backgroundColor: "#003d2d",
          color: "#ffffff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "24px", // Slightly larger
          fontWeight: 800,
          padding: "0 20px",
        }}
      >
        সিরিয়ালের জন্য যোগাযোগ: ০১৭০৪-২১৫৪৫৫
      </div>
    </div>
  );
};

export default PrimePhotoCardAd;
