"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function HelpPage() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    help_type: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    const { data, error } = await supabase
      .from("help_requests")
      .insert([form])
      .select("tracking_code")
      .single();

    setLoading(false);

    if (error) {
      console.error(error);
      setResult({
        success: false,
        message: "حدث خطأ أثناء إرسال الطلب. حاول مرة أخرى.",
      });
      return;
    }

    setResult({
      success: true,
      message: `تم إرسال طلبك بنجاح! رقم المتابعة الخاص بك هو: ${data.tracking_code}`,
    });

    setForm({
      name: "",
      phone: "",
      help_type: "",
      description: "",
    });
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

        {result?.success ? (
          <div
            style={{
              textAlign: "center",
              padding: "30px 10px",
            }}
          >
            <h2>✅ تم إرسال الطلب</h2>
            <p>{result.message}</p>
            <p style={{ color: "#666" }}>
              احتفظ برقم المتابعة لمتابعة حالة طلبك.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <label>الاسم</label>
            <input
              required
              name="name"
              value={form.name}
              onChange={handleChange}
              type="text"
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

            <label>نوع المساعدة المطلوبة</label>
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

            <label>شرح الطلب</label>
            <textarea
              required
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="اشرح لنا حاجتك..."
              rows="5"
              style={inputStyle}
            />

            <button
              type="submit"
              disabled={loading}
              style={{
                ...buttonStyle,
                opacity: loading ? 0.6 : 1,
              }}
            >
              {loading ? "جاري الإرسال..." : "إرسال طلب المساعدة"}
            </button>
          </form>
        )}

        {result && !result.success && (
          <p
            style={{
              color: "red",
              textAlign: "center",
              marginTop: "20px",
            }}
          >
            {result.message}
          </p>
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
