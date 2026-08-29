export default function Home() {
  return (
    <main dir="rtl" style={{
      minHeight: "100vh",
      fontFamily: "Arial, sans-serif",
      background: "#f5f7fa",
      padding: "30px 16px"
    }}>
      <div style={{
        maxWidth: "700px",
        margin: "0 auto",
        textAlign: "center"
      }}>
        <h1 style={{fontSize: "32px", marginBottom: "10px"}}>
          🤝 منصة المساعدة
        </h1>

        <p style={{fontSize: "18px", color: "#555"}}>
          معًا نساعد من يحتاج، ونصل الخير إلى مستحقيه.
        </p>

        <div style={{
          display: "grid",
          gap: "15px",
          marginTop: "35px"
        }}>
          <button style={buttonStyle}>
            🆘 أحتاج إلى مساعدة
          </button>

          <button style={buttonStyle}>
            🤲 أريد تقديم مساعدة
          </button>

          <button style={buttonStyle}>
            🔎 متابعة طلب مساعدة
          </button>
        </div>

        <p style={{
          marginTop: "50px",
          color: "#777",
          fontSize: "14px"
        }}>
          منصة خيرية لخدمة المجتمع الجزائري
        </p>
      </div>
    </main>
  );
}

const buttonStyle = {
  padding: "18px",
  border: "none",
  borderRadius: "14px",
  fontSize: "18px",
  cursor: "pointer",
  background: "#ffffff",
  boxShadow: "0 3px 12px rgba(0,0,0,0.08)"
};
