export const metadata = {
  title: "منصة المساعدة",
  description: "منصة خيرية للمساعدة والتكافل في الجزائر",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
