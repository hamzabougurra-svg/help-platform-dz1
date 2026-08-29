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
    wilaya: "",
    municipality: "",
    help_type: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    const { error } = await supabase
      .from("help_requests")
      .insert([form]);

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
      message: "تم إرسال طلبك بنجاح ✅",
    });

    setForm({
      name: "",
      phone: "",
      wilaya: "",
      municipality: "",
      help_type: "",
      description: "",
    });
  }

  return (
    <main dir="rtl" style={mainStyle}>
      <div style={boxStyle}>
        <h1 style={{ textAlign: "center" }}>🆘 طلب مساعدة</h1>

        {result?.success ? (
          <div style={{ textAlign: "center", padding: "30px" }}>
            <h2>✅ تم إرسال الطلب بنجاح</h2>
            <p>{result.message}</p>
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

            <label>الولاية</label>
            <input
              required
              name="wilaya"
              value={form.wilaya}
              onChange={handleChange}
              placeholder="اكتب الولاية"
              style={inputStyle}
            />

            <label>البلدية</label>
            <input
              required
              name="municipality"
              value={form.municipality}
              onChange={handleChange}
              placeholder="اكتب البلدية"
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
              style={buttonStyle}
            >
              {loading ? "جاري الإرسال..." : "إرسال طلب المساعدة"}
            </button>
          </form>
        )}

        {result && !result.success && (
          <p style={{ color: "red", textAlign: "center" }}>
            {result.message}
          </p>
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
  background: "#2563eb",
  color: "#fff",
};
