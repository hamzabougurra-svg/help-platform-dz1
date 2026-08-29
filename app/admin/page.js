"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [requests, setRequests] = useState([]);
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(false);

  const ADMIN_PASSWORD = "DZ2026";

  async function login(e) {
    e.preventDefault();

    if (password === ADMIN_PASSWORD) {
      setLoggedIn(true);
      loadData();
    } else {
      alert("كلمة المرور غير صحيحة");
    }
  }

  async function loadData() {
    setLoading(true);

    const { data: requestData } = await supabase
      .from("help_requests")
      .select("*")
      .order("created_at", { ascending: false });

    const { data: offerData } = await supabase
      .from("help_offers")
      .select("*")
      .order("created_at", { ascending: false });

    setRequests(requestData || []);
    setOffers(offerData || []);

    setLoading(false);
  }

  async function updateStatus(id, status) {
    const { error } = await supabase
      .from("help_requests")
      .update({ status })
      .eq("id", id);

    if (error) {
      alert("حدث خطأ");
      return;
    }

    loadData();
  }

  if (!loggedIn) {
    return (
      <main dir="rtl" style={mainStyle}>
        <div style={boxStyle}>
          <h1>🔐 لوحة الإدارة</h1>

          <form onSubmit={login}>
            <input
              type="password"
              placeholder="كلمة المرور"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={inputStyle}
            />

            <button style={buttonStyle}>
              دخول
            </button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main dir="rtl" style={mainStyle}>
      <div style={containerStyle}>
        <h1>👨‍💼 لوحة الإدارة</h1>

        <button onClick={loadData} style={refreshButton}>
          🔄 تحديث
        </button>

        <h2>🆘 طلبات المساعدة</h2>

        {loading && <p>جاري التحميل...</p>}

        {requests.map((item) => (
          <div key={item.id} style={cardStyle}>
            <h3>{item.name}</h3>

            <p>📞 {item.phone}</p>
            <p>📍 {item.wilaya} - {item.municipality}</p>
            <p>🤝 {item.help_type}</p>
            <p>📝 {item.description}</p>
            <p>🔢 رقم المتابعة: {item.tracking_code}</p>

            <p>
              <b>الحالة:</b>{" "}
              {item.status || "قيد المراجعة"}
            </p>

            <div style={statusButtons}>
              <button
                onClick={() => updateStatus(item.id, "قيد المراجعة")}
              >
                قيد المراجعة
              </button>

              <button
                onClick={() => updateStatus(item.id, "مقبول")}
              >
                مقبول
              </button>

              <button
                onClick={() => updateStatus(item.id, "تمت المساعدة")}
              >
                تمت المساعدة
              </button>
            </div>
          </div>
        ))}

        <h2>🤲 عروض المساعدة</h2>

        {offers.map((item) => (
          <div key={item.id} style={cardStyle}>
            <h3>{item.name}</h3>
            <p>📞 {item.phone}</p>
            <p>🤝 {item.help_type}</p>
            <p>📝 {item.description}</p>
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
  maxWidth: "900px",
  margin: "0 auto",
};

const boxStyle = {
  maxWidth: "450px",
  margin: "80px auto",
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
  margin: "20px 0",
  border: "1px solid #ddd",
  borderRadius: "10px",
  fontSize: "17px",
};

const buttonStyle = {
  width: "100%",
  padding: "15px",
  border: "none",
  borderRadius: "10px",
  background: "#2563eb",
  color: "#fff",
  fontSize: "17px",
};

const refreshButton = {
  padding: "12px 20px",
  border: "none",
  borderRadius: "10px",
  background: "#555",
  color: "#fff",
};

const cardStyle = {
  background: "#fff",
  padding: "20px",
  margin: "15px 0",
  borderRadius: "14px",
  boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
};

const statusButtons = {
  display: "flex",
  gap: "8px",
  flexWrap: "wrap",
};
