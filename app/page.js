"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [installPrompt, setInstallPrompt] = useState(null);
  const [showInstall, setShowInstall] = useState(false);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js");
    }

    const handleBeforeInstallPrompt = (event) => {
      event.preventDefault();
      setInstallPrompt(event);
      setShowInstall(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
    };
  }, []);

  const handleInstall = async () => {
    if (!installPrompt) return;

    installPrompt.prompt();

    const { outcome } = await installPrompt.userChoice;

    if (outcome === "accepted") {
      setInstallPrompt(null);
      setShowInstall(false);
    }
  };

  return (
    <main dir="rtl" style={mainStyle}>
      <div style={containerStyle}>

        <div style={logo}>🤝</div>

        <h1 style={titleStyle}>منصة يد العون</h1>

        <div style={brandStyle}>
          🇩🇿 HAMZA BOUGUERRA
        </div>

        <p style={subtitleStyle}>
          معًا نساعد من يحتاج، ونصنع أثرًا جميلًا في مجتمعنا 🇩🇿
        </p>

        {showInstall && (
          <button onClick={handleInstall} style={installButton}>
            📲 تثبيت التطبيق
            <span style={buttonText}>
              أضف منصة يد العون إلى هاتفك
            </span>
          </button>
        )}

        <div style={buttonsStyle}>

          <a href="/help" style={buttonBlue}>
            🆘 أحتاج إلى مساعدة
            <span style={buttonText}>
              اطلب المساعدة بكل سهولة
            </span>
          </a>

          <a href="/offer" style={buttonGreen}>
            🤲 أريد تقديم مساعدة
            <span style={buttonText}>
              ساهم في مساعدة محتاج
            </span>
          </a>

          <a href="/track" style={buttonOrange}>
            🔎 متابعة طلب مساعدة
            <span style={buttonText}>
              تابع حالة طلبك برقم المتابعة
            </span>
          </a>

          <a href="/admin" style={buttonDark}>
            👨‍💼 لوحة الإدارة
            <span style={buttonText}>
              إدارة طلبات وعروض المساعدة
            </span>
          </a>

        </div>

        <div style={infoBox}>
          <strong style={{ fontSize: "20px" }}>
            💚 الخير يبدأ بخطوة
          </strong>

          <p style={{ lineHeight: "1.8" }}>
            هدفنا ربط الأشخاص المحتاجين بأهل الخير
            بطريقة سهلة وآمنة.
          </p>

          <p style={securityText}>
            🔒 نحترم خصوصية جميع المستخدمين.
          </p>
        </div>

        <p style={footerStyle}>
          🤲 منصة يد العون 🇩🇿
          <br />
          <span style={footerBrand}>
            HAMZA BOUGUERRA
          </span>
        </p>

      </div>
    </main>
  );
}

const mainStyle = {
  minHeight: "100vh",
  background: "linear-gradient(135deg, #eef6ff, #f0fdf4)",
  padding: "35px 16px",
  fontFamily: "Arial, sans-serif",
};

const containerStyle = {
  maxWidth: "650px",
  margin: "0 auto",
  textAlign: "center",
};

const logo = {
  width: "85px",
  height: "85px",
  margin: "10px auto 15px",
  borderRadius: "50%",
  background: "#2563eb",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "44px",
  boxShadow: "0 6px 18px rgba(37,99,235,0.25)",
};

const titleStyle = {
  fontSize: "34px",
  margin: "10px 0 5px",
  color: "#172554",
};

const brandStyle = {
  fontSize: "15px",
  fontWeight: "bold",
  color: "#16a34a",
  letterSpacing: "1px",
  marginBottom: "12px",
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
  width: "100%",
  boxSizing: "border-box",
  padding: "18px",
  borderRadius: "16px",
  textDecoration: "none",
  color: "#fff",
  fontSize: "19px",
  fontWeight: "bold",
  boxShadow: "0 5px 15px rgba(0,0,0,0.12)",
  border: "none",
};

const installButton = {
  ...buttonBase,
  background: "#7c3aed",
  marginBottom: "15px",
  cursor: "pointer",
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

const buttonDark = {
  ...buttonBase,
  background: "#334155",
};

const buttonText = {
  display: "block",
  fontSize: "14px",
  fontWeight: "normal",
  marginTop: "7px",
  opacity: 0.9,
};

const infoBox = {
  marginTop: "30px",
  padding: "20px",
  background: "#fff",
  borderRadius: "16px",
  boxShadow: "0 3px 12px rgba(0,0,0,0.06)",
  color: "#444",
};

const securityText = {
  fontSize: "13px",
  color: "#777",
  marginBottom: 0,
};

const footerStyle = {
  marginTop: "35px",
  color: "#777",
  fontSize: "14px",
  lineHeight: "1.8",
};

const footerBrand = {
  fontWeight: "bold",
  color: "#16a34a",
};
