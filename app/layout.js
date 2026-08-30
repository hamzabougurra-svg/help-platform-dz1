export const metadata = {
  title: "منصة المساعدة",
  description: "منصة خيرية للمساعدة والتكافل في الجزائر",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
  },
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
        {children}
      </body>
    </html>
  );
}
