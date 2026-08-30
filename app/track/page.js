"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function TrackPage() {
  const [code, setCode] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function searchRequest(e) {
    e.preventDefault();

    setLoading(true);
    setResult(null);
    setError("");

    const trackingCode = code.trim().toUpperCase();

    const { data, error } = await supabase
      .from("help_requests")
      .select(
        "name, wilaya, municipality, help_type, description, status, tracking_code"
      )
      .eq("tracking_code", trackingCode)
      .maybeSingle();

    setLoading(false);

    if (error) {
      setError("حدث خطأ أثناء البحث. حاول مرة أخرى.");
      return;
    }

    if (!data) {
      setError("❌ لم نجد طلبًا بهذا الرقم.");
      return;
    }

    setResult(data);
  }

  function statusText(status) {
    if (status === "approved") return "✅ تم قبول الطلب";
    if (status === "completed") return "🎉 تمت المساعدة";
    if (status === "rejected") return "❌ تم رفض الطلب";
    if (status === "reviewing") return "🔎 الطلب قيد المراجعة";
    return "🆕 الطلب جديد";
  }

  return (
    <main dir="rtl" style={mainStyle}>
      <div style={boxStyle}>
        <h1>🔎 متابعة طلب المساعدة</h1>

        <p style={subtitleStyle}>
          أدخل رقم المتابعة الخاص بك لمعرفة حالة طلبك 🇩🇿
        </p>

        <form onSubmit={searchRequest}>
          <input
            required
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="مثال: DZ-7E0F0CB8"
            style={inputStyle}
          />

          <button
            type="submit"
            disabled={loading}
            style={buttonStyle}
          >
            {loading ? "جاري البحث..." : "🔎 متابعة الطلب"}
          </button>
        </form>

        {error && (
          <div style={errorStyle}>
            {error}
          </div>
        )}

        {result && (
          <div style={resultStyle}>
            <h2>📋 معلومات الطلب</h2>

            <div style={statusStyle}>
              {statusText(result.status)}
            </div>

            <p>
              <strong>🔢 رقم المتابعة:</strong>{" "}
              {result.tracking_code}
            </p>

            <p>
              <strong>📍 الولاية:</strong>{" "}
              {result.wilaya}
            </p>

            <p>
              <strong>🏘️ البلدية:</strong>{" "}
              {result.municipality}
            </p>

            <p>
              <strong>🤝 نوع المساعدة:</strong>{" "}
              {result.help_type}
            </p>

            <p>
              <strong>📝 تفاصيل الطلب:</strong>
            </p>

            <p style={descriptionStyle}>
              {result.description}
            </p>

            <p style={privacyStyle}>
              🔒 معلوماتك الشخصية محمية.
            </p>
          </div>
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
  padding: "15px",
  marginBottom: "12px",
  border: "1px solid #ddd",
  borderRadius: "10px",
  fontSize: "17px",
};

const buttonStyle = {
  width: "100%",
  padding: "15px",
  border: "none",
  borderRadius: "10px",
  background: "#16a34a",
  color: "#fff",
  fontSize: "18px",
  fontWeight: "bold",
};

const resultStyle = {
  marginTop: "25px",
  padding: "20px",
  background: "#f0fdf4",
  border: "1px solid #bbf7d0",
  borderRadius: "14px",
  lineHeight: "1.8",
};

const statusStyle = {
  display: "inline-block",
  padding: "10px 15px",
  marginBottom: "12px",
  borderRadius: "10px",
  background: "#dcfce7",
  color: "#166534",
  fontWeight: "bold",
};

const errorStyle = {
  marginTop: "18px",
  padding: "14px",
  borderRadius: "10px",
  background: "#fee2e2",
  color: "#991b1b",
  textAlign: "center",
};

const descriptionStyle = {
  background: "#fff",
  padding: "12px",
  borderRadius: "10px",
};

const privacyStyle = {
  color: "#666",
  fontSize: "14px",
};
