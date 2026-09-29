const BondhonPhotoCardAd = () => {
  return (
    <div
      style={{
        width: "100%",
        height: "140px",
        backgroundColor: "#ffffff",
        display: "flex",
        alignItems: "center",
        gap: "24px",
        padding: "0 40px",
        fontFamily: "var(--font-solaiman-lipi), Arial, sans-serif",
        overflow: "hidden",
        borderTop: "5px solid #087f5b",
      }}
    >
      <img
        src="/images/bondhon.png"
        alt="Bondhon"
        crossOrigin="anonymous"
        style={{
          width: "120px",
          height: "112px",
          objectFit: "contain",
          flexShrink: 0,
        }}
      />
      <div
        style={{
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: "5px",
        }}
      >
        <h2
          style={{
            margin: 0,
            color: "#075e45",
            fontSize: "42px",
            fontWeight: 900,
            lineHeight: 1.1,
            whiteSpace: "nowrap",
          }}
        >
          বন্ধন হাসপাতাল এন্ড ডায়াগনস্টিক সেন্টার
        </h2>
        <p
          style={{
            margin: 0,
            color: "#25352f",
            fontSize: "23px",
            lineHeight: 1.1,
            fontWeight: 700,
          }}
        >
          ডি.বি. রোড, পলাশ পাড়া মোড়, গাইবান্ধা।
        </p>
        <p
          style={{
            margin: 0,
            color: "#075e45",
            fontSize: "25px",
            fontWeight: 700,
            lineHeight: 1.1,
            whiteSpace: "nowrap",
          }}
        >
          সিরিয়ালের জন্য যোগাযোগঃ ০১৩৪৮-৯৬২১৫২, ০১৩৪৮-৯৬২১৫৩
        </p>
      </div>
    </div>
  );
};

export default BondhonPhotoCardAd;
