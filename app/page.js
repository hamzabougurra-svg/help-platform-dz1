"use client";

export default function Home() {
  return (
    <main dir="rtl" style={mainStyle}>
      <div style={containerStyle}>
        <h1>🤝 منصة المساعدة</h1>

        <p style={subtitleStyle}>
          معًا نساعد من يحتاج، ونصل الخير إلى مستحقيه.
        </p>

        <div style={buttonsStyle}>
          <a href="/help" style={buttonStyle}>
            🆘 أحتاج إلى مساعدة
          </a>

          <a
            href="/offer"
            style={{
              ...buttonStyle,
              background: "#16a34a",
              color: "#fff",
            }}
          >
            🤲 أريد تقديم مساعدة
          </a>

          <a
            href="/track"
            style={{
              ...buttonStyle,
              background: "#f59e0b",
              color: "#fff",
            }}
          >
            🔎 متابعة طلب مساعدة
          </a>
        </div>

        <p style={footerStyle}>
          منصة خيرية لخدمة المجتمع الجزائري 🇩🇿
        </p>
      </div>
    </main>
  );
}

const mainStyle = {
  minHeight: "100vh",
  background: "#f5f7fa",
  padding: "40px 16px",
  fontFamily: "Arial, sans-serif",
};

const containerStyle = {
  maxWidth: "650px",
  margin: "0 auto",
  textAlign: "center",
};

const subtitleStyle = {
  fontSize: "18px",
  color: "#555",
  marginBottom: "35px",
};

const buttonsStyle = {
  display: "grid",
  gap: "15px",
};

const buttonStyle = {
  display: "block",
  padding: "18px",
  borderRadius: "14px",
  fontSize: "18px",
  textDecoration: "none",
  background: "#fff",
  color: "#222",
  boxShadow: "0 3px 12px rgba(0,0,0,0.08)",
};

const footerStyle = {
  marginTop: "50px",
  color: "#777",
  fontSize: "14px",
};
