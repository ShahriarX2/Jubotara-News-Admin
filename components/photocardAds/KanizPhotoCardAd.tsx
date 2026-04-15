import React from "react";

const KanizPhotoCardAd = () => {
  return (
    <div
      style={{
        width: "100%",
        height: "140px",
        backgroundColor: "#ffffff",
        display: "flex",
        flexDirection: "column",
        fontFamily: "var(--font-solaiman-lipi), Arial, sans-serif",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 40px",
          position: "relative",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "25px" }}>
          <img
            src="/images/kaniz-logo.png"
            alt="Logo"
            style={{
              height: "75px",
              width: "auto",
              objectFit: "contain",
            }}
          />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: "10px" }}>
              <h2
                style={{
                  fontSize: "42px",
                  fontWeight: 900,
                  margin: 0,
                  color: "#2E3192",
                  lineHeight: 1,
                }}
              >
                কানিজ হসপিটাল এন্ড ল্যাব
              </h2>
              <span
                style={{
                  fontSize: "20px",
                  fontWeight: 600,
                  color: "#009444",
                }}
              >
                মানসম্মত স্বাস্থ্য সেবায় অনন্য
              </span>
            </div>
            <div style={{ height: "3px", backgroundColor: "#ED1C24", width: "100%", marginTop: "4px" }} />
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            backgroundColor: "#2E3192",
            color: "#ffffff",
            padding: "8px 25px",
            borderRadius: "8px",
          }}
        >
          <span style={{ fontSize: "22px", fontWeight: 600 }}>সিরিয়ালঃ</span>
          <span style={{ fontSize: "30px", fontWeight: 800 }}>০১৩২১-০৪৭৪৭৪</span>
        </div>
      </div>

      <div
        style={{
          height: "35px", // Increased for padding
          backgroundColor: "#2E3192",
          color: "#ffffff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "18px",
          fontWeight: 400,
          padding: "0 20px",
        }}
      >
        ডি.বি. রোড, শাপলা পাড়া (রংপুর গেটলক বাস কাউন্টারের বিপরীতে), সদর, গাইবান্ধা।
      </div>
    </div>
  );
};

export default KanizPhotoCardAd;
