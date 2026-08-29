export const metadata = {
  title: "منصة المساعدة",
  description: "منصة خيرية للمساعدة والتكافل في الجزائر",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <body
        style={{
          margin: 0,
          position: "relative",
          minHeight: "100vh",
        }}
      >
        <div
          style={{
            position: "fixed",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none",
            zIndex: 9999,
            fontSize: "clamp(28px, 7vw, 80px)",
            fontWeight: "bold",
            color: "rgba(0, 0, 0, 0.06)",
            transform: "rotate(-30deg)",
            whiteSpace: "nowrap",
            userSelect: "none",
          }}
        >
          HAMZA BOUGUERRA
        </div>

        <div style={{ position: "relative", zIndex: 1 }}>
          {children}
        </div>
      </body>
    </html>
  );
}
