"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function AdminPage() {
  const [session, setSession] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [requests, setRequests] = useState([]);
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);

      if (data.session) {
        loadData();
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);

      if (session) {
        loadData();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function login(e) {
    e.preventDefault();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert("البريد الإلكتروني أو كلمة المرور غير صحيحة.");
    }
  }

  async function logout() {
    await supabase.auth.signOut();
    setRequests([]);
    setOffers([]);
  }

  async function loadData() {
    setLoading(true);

    const { data: requestData, error: requestError } = await supabase
      .from("help_requests")
      .select("*")
      .order("created_at", { ascending: false });

    const { data: offerData, error: offerError } = await supabase
      .from("help_offers")
      .select("*")
      .order("created_at", { ascending: false });

    if (requestError) {
      console.error(requestError);
    }

    if (offerError) {
      console.error(offerError);
    }

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
      console.error(error);
      alert(`تعذر تحديث الحالة: ${error.message}`);
      return;
    }

    await loadData();
  }

  function getStatusText(status) {
    switch (status) {
      case "new":
        return "🆕 جديد";

      case "reviewing":
        return "🔎 قيد المراجعة";

      case "approved":
        return "✅ مقبول";

      case "completed":
        return "🎉 تمت المساعدة";

      case "rejected":
        return "❌ مرفوض";

      default:
        return status || "غير محدد";
    }
  }

  function getCaseForOffer(offer) {
    return requests.find(
      (request) => request.id === offer.help_request_id
    );
  }

  if (!session) {
    return (
      <main dir="rtl" style={mainStyle}>
        <div style={boxStyle}>
          <h1>🔐 دخول الإدارة</h1>

          <form onSubmit={login}>
            <input
              type="email"
              required
              placeholder="البريد الإلكتروني"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={inputStyle}
            />

            <input
              type="password"
              required
              placeholder="كلمة المرور"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={inputStyle}
            />

            <button type="submit" style={buttonStyle}>
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

        <div style={{ marginBottom: "25px" }}>
          <button onClick={logout} style={logoutButton}>
            تسجيل الخروج
          </button>

          <button onClick={loadData} style={refreshButton}>
            🔄 تحديث
          </button>
        </div>

        <h2>🆘 طلبات المساعدة ({requests.length})</h2>

        {loading && <p>جاري التحميل...</p>}

        {!loading && requests.length === 0 && (
          <p>لا توجد طلبات مساعدة حاليًا.</p>
        )}

        {requests.map((item) => (
          <div key={item.id} style={cardStyle}>
            <h3>🆘 {item.name}</h3>

            <p>📞 {item.phone}</p>
            <p>
              📍 {item.wilaya} - {item.municipality}
            </p>
            <p>🤝 {item.help_type}</p>
            <p>📝 {item.description}</p>
            <p>🔢 رقم المتابعة: {item.tracking_code}</p>

            <p>
              <b>الحالة:</b> {getStatusText(item.status)}
            </p>

            <div style={statusButtons}>
              <button
                onClick={() => updateStatus(item.id, "new")}
                style={statusButton}
              >
                🆕 جديد
              </button>

              <button
                onClick={() => updateStatus(item.id, "reviewing")}
                style={statusButton}
              >
                🔎 قيد المراجعة
              </button>

              <button
                onClick={() => updateStatus(item.id, "approved")}
                style={statusButton}
              >
                ✅ مقبول
              </button>

              <button
                onClick={() => updateStatus(item.id, "completed")}
                style={statusButton}
              >
                🎉 تمت المساعدة
              </button>

              <button
                onClick={() => updateStatus(item.id, "rejected")}
                style={statusButton}
              >
                ❌ مرفوض
              </button>
            </div>
          </div>
        ))}

        <h2 style={{ marginTop: "40px" }}>
          🤲 عروض المساعدة ({offers.length})
        </h2>

        {!loading && offers.length === 0 && (
          <p>لا توجد عروض مساعدة حاليًا.</p>
        )}

        {offers.map((item) => {
          const selectedCase = getCaseForOffer(item);

          return (
            <div key={item.id} style={offerCardStyle}>
              <h3>🤲 المتبرع: {item.name}</h3>

              <p>📞 هاتف المتبرع: {item.phone}</p>
              <p>🤝 نوع المساعدة: {item.help_type}</p>
              <p>📝 تفاصيل العرض: {item.description}</p>

              <hr />

              {selectedCase ? (
                <>
                  <h3>🆘 الحالة التي اختارها</h3>

                  <p>
                    👤 صاحب الطلب: {selectedCase.name}
                  </p>

                  <p>
                    📍 {selectedCase.wilaya} -{" "}
                    {selectedCase.municipality}
                  </p>

                  <p>
                    🤝 المطلوب: {selectedCase.help_type}
                  </p>

                  <p>
                    🔢 رقم المتابعة:{" "}
                    {selectedCase.tracking_code}
                  </p>

                  <p>
                    <b>حالة الطلب:</b>{" "}
                    {getStatusText(selectedCase.status)}
                  </p>
                </>
              ) : (
                <p style={{ color: "#dc2626" }}>
                  ⚠️ لم يتم العثور على الطلب المرتبط بهذا العرض.
                </p>
              )}
            </div>
          );
        })}
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
  margin: "10px 0",
  border: "1px solid #ddd",
  borderRadius: "10px",
  fontSize: "17px",
};

const buttonStyle = {
  width: "100%",
  padding: "15px",
  marginTop: "10px",
  border: "none",
  borderRadius: "10px",
  background: "#2563eb",
  color: "#fff",
  fontSize: "17px",
};

const logoutButton = {
  padding: "12px 20px",
  marginLeft: "10px",
  border: "none",
  borderRadius: "10px",
  background: "#dc2626",
  color: "#fff",
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

const offerCardStyle = {
  background: "#ecfdf5",
  padding: "20px",
  margin: "15px 0",
  borderRadius: "14px",
  border: "1px solid #bbf7d0",
};

const statusButtons = {
  display: "flex",
  gap: "8px",
  flexWrap: "wrap",
};

const statusButton = {
  padding: "10px 14px",
  border: "none",
  borderRadius: "8px",
  background: "#2563eb",
  color: "#fff",
  cursor: "pointer",
};
