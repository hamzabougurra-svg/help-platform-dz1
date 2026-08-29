"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function TrackPage() {
  const [code, setCode] = useState("");
  const [request, setRequest] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSearch(e) {
    e.preventDefault();
    setLoading(true);
    setRequest(null);
    setMessage("");

    const { data, error } = await supabase
      .from("help_requests")
      .select("tracking_code, name, wilaya, municipality, help_type, status")
      .eq("tracking_code", code.trim())
      .single();

    setLoading(false);

    if (error || !data) {
      setMessage("لم يتم العثور على طلب بهذا الرقم.");
      return;
    }

    setRequest(data);
  }

  return (
    <main dir="rtl" style={mainStyle}>
      <div style={boxStyle}>
        <h1>🔎 متابعة طلب مساعدة</h1>

        <form onSubmit={handleSearch}>
          <input
            required
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="أدخل رقم المتابعة"
            style={inputStyle}
          />

          <button disabled={loading} style={buttonStyle}>
            {loading ? "جاري البحث..." : "متابعة الطلب"}
          </button>
        </form>

        {message && (
          <p style={{ color: "red", textAlign: "center" }}>
            {message}
          </p>
        )}

        {request && (
          <div style={resultStyle}>
            <h2>✅ تم العثور على طلبك</h2>
            <p><b>رقم المتابعة:</b> {request.tracking_code}</p>
            <p><b>الاسم:</b> {request.name}</p>
            <p><b>الولاية:</b> {request.wilaya}</p>
            <p><b>البلدية:</b> {request.municipality}</p>
            <p><b>نوع المساعدة:</b> {request.help_type}</p>
            <p>
              <b>الحالة:</b>{" "}
              {request.status || "قيد المراجعة"}
            </p>
          </div>
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
  textAlign: "center",
};

const inputStyle = {
  width: "100%",
  boxSizing: "border-box",
  padding: "15px",
  margin: "20px 0 15px",
  border: "1px solid #ddd",
  borderRadius: "10px",
  fontSize: "17px",
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

const resultStyle = {
  marginTop: "25px",
  padding: "20px",
  background: "#f5f7fa",
  borderRadius: "12px",
  textAlign: "right",
};
