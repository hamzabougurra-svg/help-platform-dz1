"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function OfferPage() {
  const [cases, setCases] = useState([]);
  const [loadingCases, setLoadingCases] = useState(true);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    help_type: "",
    description: "",
    help_request_id: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    loadCases();
  }, []);

  async function loadCases() {
    const { data, error } = await supabase
      .from("help_requests")
      .select(
        "id, wilaya, municipality, help_type, description, status"
      )
      .in("status", ["new", "reviewing", "approved"])
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
    } else {
      setCases(data || []);
    }

    setLoadingCases(false);
  }

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.help_request_id) {
      alert("يرجى اختيار الحالة التي تريد مساعدتها.");
      return;
    }

    setLoading(true);
    setSuccess(false);

    const { error } = await supabase
      .from("help_offers")
      .insert([
        {
          name: form.name,
          phone: form.phone,
          help_type: form.help_type,
          description: form.description,
          help_request_id: form.help_request_id,
        },
      ]);

    setLoading(false);

    if (error) {
      console.error(error);
      alert(`خطأ: ${error.message}`);
      return;
    }

    setSuccess(true);

    setForm({
      name: "",
      phone: "",
      help_type: "",
      description: "",
      help_request_id: "",
    });
  }

  return (
    <main dir="rtl" style={mainStyle}>
      <div style={boxStyle}>
        <h1>🤲 أريد تقديم مساعدة</h1>

        <p style={subtitleStyle}>
          اختر الحالة التي تستطيع مساعدتها، ثم اترك معلوماتك للتواصل معك.
        </p>

        {success ? (
          <div style={successStyle}>
            <h2>✅ تم إرسال عرض المساعدة</h2>

            <p>
              جزاك الله خيرًا ❤️
            </p>

            <p>
              تم تسجيل عرضك بنجاح، وسيتم التواصل معك عند الحاجة.
            </p>

            <button
              onClick={() => setSuccess(false)}
              style={buttonStyle}
            >
              تقديم عرض مساعدة آخر
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <label>اختر الحالة</label>

            <select
              required
              name="help_request_id"
              value={form.help_request_id}
              onChange={handleChange}
              style={inputStyle}
            >
              <option value="">
                {loadingCases
                  ? "جاري تحميل الحالات..."
                  : "اختر الحالة التي تريد مساعدتها"}
              </option>

              {cases.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.wilaya} - {item.municipality} |{" "}
                  {item.help_type}
                </option>
              ))}
            </select>

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
              type="tel"
              value={form.phone}
              onChange={handleChange}
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
              placeholder="اكتب كيف تستطيع المساعدة..."
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
              {loading
                ? "جاري الإرسال..."
                : "🤲 إرسال عرض المساعدة"}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}

const mainStyle = {
  minHeight: "100vh",
  background: "linear-gradient(135deg, #ecfdf5, #f8fafc)",
  padding: "30px 16px",
  fontFamily: "Arial, sans-serif",
};

const boxStyle = {
  maxWidth: "650px",
  margin: "0 auto",
  background: "#fff",
  padding: "28px",
  borderRadius: "18px",
  boxShadow: "0 4px 18px rgba(0,0,0,0.08)",
};

const subtitleStyle = {
  textAlign: "center",
  color: "#555",
  lineHeight: "1.7",
  marginBottom: "25px",
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
  background: "#16a34a",
  color: "#fff",
  fontSize: "18px",
  fontWeight: "bold",
  cursor: "pointer",
};

const successStyle = {
  textAlign: "center",
  padding: "25px 5px",
};
