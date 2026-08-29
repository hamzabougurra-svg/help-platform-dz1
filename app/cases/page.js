"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function CasesPage() {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCases();
  }, []);

  async function loadCases() {
    const { data, error } = await supabase
      .from("help_requests")
      .select(
        "id, wilaya, municipality, help_type, description, status"
      )
      .in("status", ["reviewing", "approved"])
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
    } else {
      setCases(data || []);
    }

    setLoading(false);
  }

  function statusLabel(status) {
    if (status === "approved") {
      return "✅ مقبول";
    }

    return "🔎 قيد المراجعة";
  }

  return (
    <main dir="rtl" style={mainStyle}>
      <div style={containerStyle}>
        <h1>🤲 حالات تحتاج إلى مساعدة</h1>

        <p style={subtitleStyle}>
          اختر الحالة التي تستطيع مساعدتها، وساهم في نشر الخير 🇩🇿
        </p>

        {loading && <p>جاري تحميل الحالات...</p>}

        {!loading && cases.length === 0 && (
          <div style={emptyStyle}>
            <h2>💚 لا توجد حالات حاليًا</h2>
            <p>
              سنُظهر هنا الحالات التي تحتاج إلى مساعدة.
            </p>
          </div>
        )}

        {cases.map((item) => (
          <div key={item.id} style={cardStyle}>
            <h2>🆘 {item.help_type}</h2>

            <p>
              <b>📍 الولاية:</b> {item.wilaya}
            </p>

            <p>
              <b>🏘️ البلدية:</b> {item.municipality}
            </p>

            <p>
              <b>📝 شرح الحالة:</b>
            </p>

            <p style={descriptionStyle}>
              {item.description}
            </p>

            <div style={statusStyle}>
              {statusLabel(item.status)}
            </div>

            <a href={`/offer?case=${item.id}`} style={buttonStyle}>
              🤲 أريد المساعدة
            </a>
          </div>
        ))}
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

const containerStyle = {
  maxWidth: "750px",
  margin: "0 auto",
};

const subtitleStyle = {
  textAlign: "center",
  color: "#555",
  fontSize: "17px",
  marginBottom: "30px",
};

const cardStyle = {
  background: "#fff",
  padding: "22px",
  marginBottom: "18px",
  borderRadius: "16px",
  boxShadow: "0 3px 12px rgba(0,0,0,0.08)",
};

const descriptionStyle = {
  lineHeight: "1.8",
  color: "#444",
};

const statusStyle = {
  display: "inline-block",
  padding: "8px 12px",
  margin: "10px 0 18px",
  borderRadius: "8px",
  background: "#eef6ff",
  color: "#2563eb",
};

const buttonStyle = {
  display: "block",
  textAlign: "center",
  padding: "15px",
  borderRadius: "12px",
  background: "#16a34a",
  color: "#fff",
  textDecoration: "none",
  fontSize: "18px",
  fontWeight: "bold",
};

const emptyStyle = {
  background: "#fff",
  padding: "30px",
  borderRadius: "16px",
  textAlign: "center",
};
