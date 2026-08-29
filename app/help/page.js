"use client";

import { useState } from "react";

export default function HelpPage() {
  const [sent, setSent] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setSent(true);
  }

  return (
    <main
      dir="rtl"
      style={{
        minHeight: "100vh",
        background: "#f5f7fa",
        padding: "30px 16px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "650px",
          margin: "0 auto",
          background: "#fff",
          padding: "25px",
          borderRadius: "16px",
          boxShadow: "0 3px 15px rgba(0,0,0,0.08)",
        }}
      >
        <h1 style={{ textAlign: "center" }}>🆘 طلب مساعدة</h1>

        {sent ? (
          <div style={{ textAlign: "center", padding: "30px 0" }}>
            <h2>✅ تم إرسال طلبك</h2>
            <p>سنتابع طلب المساعدة ونسعى لإيصاله إلى أهل الخير.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <label>الاسم</label>
            <input
              required
              type="text"
              placeholder="اكتب اسمك"
              style={inputStyle}
            />

            <label>رقم الهاتف</label>
            <input
              required
              type="tel"
              placeholder="اكتب رقم الهاتف"
              style={inputStyle}
            />

            <label>نوع المساعدة المطلوبة</label>
            <select required style={inputStyle} defaultValue="">
              <option value="" disabled>
                اختر نوع المساعدة
              </option>
              <option>مساعدة مالية</option>
              <option>مساعدة غذائية</option>
              <option>مساعدة طبية</option>
              <option>مساعدة في السكن</option>
              <option>مساعدة أخرى</option>
            </select>

            <label>شرح الطلب</label>
            <textarea
              required
              placeholder="اشرح لنا حاجتك..."
              rows="5"
              style={inputStyle}
            />

            <button type="submit" style={buttonStyle}>
              إرسال طلب المساعدة
            </button>
          </form>
        )}
      </div>
    </main>
  );
}

const inputStyle = {
  width: "100%",
  boxSizing: "border-box",
  padding: "14px",
  marginTop: "8px",
  marginBottom: "18px",
  border: "1px solid #ddd",
  borderRadius: "10px",
  fontSize: "16px",
};

const buttonStyle = {
  width: "100%",
  padding: "16px",
  border: "none",
  borderRadius: "12px",
  fontSize: "18px",
  cursor: "pointer",
  background: "#2563eb",
  color: "#fff",
};
