"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function OfferPage() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    help_type: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase
      .from("help_offers")
      .insert([form]);

    setLoading(false);

    if (error) {
      console.error(error);
      alert("حدث خطأ أثناء إرسال العرض.");
      return;
    }

    setSuccess(true);
  }

  return (
    <main dir="rtl" style={mainStyle}>
      <div style={boxStyle}>
        <h1>🤲 تقديم مساعدة</h1>

        {success ? (
          <div style={{ textAlign: "center", padding: "30px" }}>
            <h2>✅ شكرًا لك</h2>
            <p>تم تسجيل عرض المساعدة بنجاح.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <label>الاسم</label>
            <input
              required
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="اكتب اسمك"
              style={inputStyle}
            />

            <label>رقم الهاتف</label>
            <input
              required
              name="phone"
              value={form.phone}
              onChange={handleChange}
              type="tel"
              placeholder="اكتب رقم الهاتف"
              style={inputStyle}
            />

            <label>نوع المساعدة</label>
            <select
              required
              name="help_type"
              value={form.help_type}
              onChange={handleChange}
              style={inputStyle}
            >
              <option value="">اختر نوع المساعدة</option>
              <option value="مساعدة مالية">مساعدة مالية</option>
              <option value="مساعدة غذائية">مساعدة غذائية</option>
              <option value="مساعدة طبية">مساعدة طبية</option>
              <option value="مساعدة في السكن">مساعدة في السكن</option>
              <option value="مساعدة أخرى">مساعدة أخرى</option>
            </select>

            <label>تفاصيل المساعدة</label>
            <textarea
              required
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="اكتب تفاصيل المساعدة التي تريد تقديمها..."
              rows="5"
              style={inputStyle}
            />

            <button
              type="submit"
              disabled={loading}
              style={buttonStyle}
            >
              {loading ? "جاري الإرسال..." : "🤲 تقديم المساعدة"}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}

const mainStyle = {
  minHeight: "100vh",
  background: "#f5f7fa",
  padding: "30px 16px",
  fontFamily: "Arial, sans-serif",
};

const boxStyle = {
  maxWidth: "650px",
  margin: "0 auto",
  background: "#fff",
  padding: "25px",
  borderRadius: "16px",
  boxShadow: "0 3px 15px rgba(0,0,0,0.08)",
};

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
  background: "#16a34a",
  color: "#fff",
};
