"use client";

export default function Home() {
  return (
    <main dir="rtl" style={mainStyle}>
      <div style={containerStyle}>

        <div style={logo}>🤝</div>

        <h1 style={titleStyle}>منصة يد العون</h1>

        <p style={subtitleStyle}>
          معًا نساعد من يحتاج، ونصنع أثرًا جميلًا في مجتمعنا 🇩🇿
        </p>

        <div style={buttonsStyle}>

          <a href="/help" style={buttonBlue}>
            🆘 أحتاج إلى مساعدة
            <span>اطلب المساعدة بكل سهولة</span>
          </a>

          <a href="/offer" style={buttonGreen}>
            🤲 أريد تقديم مساعدة
            <span>ساهم في مساعدة محتاج</span>
          </a>

          <a href="/track" style={buttonOrange}>
            🔎 متابعة طلب مساعدة
            <span>تابع حالة طلبك برقم المتابعة</span>
          </a>

        </div>

        <div style={infoBox}>
          <strong>💚 الخير يبدأ بخطوة</strong>
          <p>
            هدفنا ربط الأشخاص المحتاجين بأهل الخير بطريقة سهلة وآمنة.
          </p>
        </div>

        <p style={footerStyle}>
          منصة يد العون 🇩🇿
        </p>

      </div>
    </main>
  );
}

const mainStyle = {
  minHeight: "100vh",
  background: "linear-gradient(135deg, #eef6ff, #f8fafc)",
  padding: "35px 16px",
  fontFamily: "Arial, sans-serif",
};

const containerStyle = {
  maxWidth: "650px",
  margin: "0 auto",
  textAlign: "center",
};

const logo = {
  width: "80px",
  height: "80px",
  margin: "10px auto 15px",
  borderRadius: "50%",
  background: "#2563eb",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "42px",
};

const titleStyle = {
  fontSize: "34px",
  margin: "10px 0",
  color: "#172554",
};

const subtitleStyle = {
  fontSize: "18px",
  lineHeight: "1.7",
  color: "#555",
  marginBottom: "30px",
};

const buttonsStyle = {
  display: "grid",
  gap: "15px",
};

const buttonBase = {
  display: "block",
  padding: "18px",
  borderRadius: "16px",
  textDecoration: "none",
  color: "#fff",
  fontSize: "19px",
  fontWeight: "bold",
  boxShadow: "0 5px 15px rgba(0,0,0,0.12)",
};

const buttonBlue = {
  ...buttonBase,
  background: "#2563eb",
};

const buttonGreen = {
  ...buttonBase,
  background: "#16a34a",
};

const buttonOrange = {
  ...buttonBase,
  background: "#f59e0b",
};

const infoBox = {
  marginTop: "30px",
  padding: "20px",
  background: "#fff",
  borderRadius: "16px",
  boxShadow: "0 3px 12px rgba(0,0,0,0.06)",
  color: "#444",
};

const footerStyle = {
  marginTop: "35px",
  color: "#777",
  fontSize: "14px",
};
