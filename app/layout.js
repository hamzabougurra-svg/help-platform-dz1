export const metadata = {
  title: "منصة يد العون",
  description: "منصة خيرية للمساعدة والتكافل في الجزائر",
  manifest: "/manifest.json",
};
export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          position: "relative",
        }}
      >
        {/* العلامة المائية */}
        <div
          style={{
            position: "fixed",
            inset: 0,
            pointerEvents: "none",
            zIndex: 0,
            overflow: "hidden",
            opacity: 0.055,
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "18%",
              left: "8%",
              transform: "rotate(-18deg)",
              fontSize: "18px",
              fontWeight: "bold",
              color: "#166534",
              whiteSpace: "nowrap",
            }}
          >
            🤲 منصة المساعدة 🇩🇿
            <br />
            <span style={{ fontSize: "12px" }}>
              HAMZA BOUGUERRA
            </span>
          </div>

          <div
            style={{
              position: "absolute",
              top: "48%",
              right: "10%",
              transform: "rotate(-18deg)",
              fontSize: "18px",
              fontWeight: "bold",
              color: "#166534",
              whiteSpace: "nowrap",
            }}
          >
            🤲 منصة المساعدة 🇩🇿
            <br />
            <span style={{ fontSize: "12px" }}>
              HAMZA BOUGUERRA
            </span>
          </div>

          <div
            style={{
              position: "absolute",
              bottom: "12%",
              left: "15%",
              transform: "rotate(-18deg)",
              fontSize: "18px",
              fontWeight: "bold",
              color: "#166534",
              whiteSpace: "nowrap",
            }}
          >
            🤲 منصة المساعدة 🇩🇿
            <br />
            <span style={{ fontSize: "12px" }}>
              HAMZA BOUGUERRA
            </span>
          </div>
        </div>

        <div style={{ position: "relative", zIndex: 1 }}>
          {children}
        </div>
      </body>
    </html>
  );
}
