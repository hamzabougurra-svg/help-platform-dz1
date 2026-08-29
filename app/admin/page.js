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

    const { data: requestData, error: requestError } =
      await supabase
        .from("help_requests")
        .select("*")
        .order("created_at", { ascending: false });

    const { data: offerData, error: offerError } =
      await supabase
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

  async function updateRequestStatus(id, status) {
    const { error } = await supabase
      .from("help_requests")
      .update({ status })
      .eq("id", id);

    if (error) {
      alert(`تعذر تحديث حالة الطلب: ${error.message}`);
      return;
    }

    await loadData();
  }

  async function updateOfferStatus(id, status) {
    const { error } = await supabase
      .from("help_offers")
      .update({ status })
      .eq("id", id);

    if (error) {
      alert(`تعذر تحديث حالة العرض: ${error.message}`);
      return;
    }

    await loadData();
  }

  function getRequestForOffer(offer) {
    return requests.find(
      (request) => request.id === offer.help_request_id
    );
  }

  function getOfferStatusLabel(status) {
    if (status === "accepted") return "✅ مقبول";
    if (status === "rejected") return "❌ مرفوض";
    return "🟡 قيد الانتظار";
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

        <div style={topButtons}>
          <button onClick={logout} style={logoutButton}>
            تسجيل الخروج
          </button>

          <button onClick={loadData} style={refreshButton}>
            🔄 تحديث
          </button>
        </div>

        <h2>
          🆘 طلبات المساعدة ({requests.length})
        </h2>

        {loading && <p>جاري التحميل...</p>}

        {!loading && requests.length === 0 && (
          <p>لا توجد طلبات مساعدة حاليًا.</p>
        )}

        {requests.map((item) => (
          <div key={item.id} style={cardStyle}>
            <h3>{item.name}</h3>

            <p>📞 {item.phone}</p>

            <p>
              📍 {item.wilaya} - {item.municipality}
            </p>

            <p>🤝 {item.help_type}</p>

            <p>📝 {item.description}</p>

            <p>
              🔢 رقم المتابعة:{" "}
              <strong>{item.tracking_code}</strong>
            </p>

            <p>
              <b>الحالة:</b>{" "}
              {item.status || "new"}
            </p>

            <div style={statusButtons}>
              <button
                onClick={() =>
                  updateRequestStatus(item.id, "reviewing")
                }
              >
                🔎 قيد المراجعة
              </button>

              <button
                onClick={() =>
                  updateRequestStatus(item.id, "approved")
                }
              >
                ✅ مقبول
              </button>

              <button
                onClick={() =>
                  updateRequestStatus(item.id, "completed")
                }
              >
                🎉 تمت المساعدة
              </button>

              <button
                onClick={() =>
                  updateRequestStatus(item.id, "rejected")
                }
              >
                ❌ مرفوض
              </button>
            </div>
          </div>
        ))}

        <h2>
          🤲 عروض المساعدة ({offers.length})
        </h2>

        {offers.length === 0 && (
          <p>لا توجد عروض مساعدة حاليًا.</p>
        )}

        {offers.map((offer) => {
          const selectedRequest =
            getRequestForOffer(offer);

          return (
            <div key={offer.id} style={cardStyle}>
              <h3>🤲 عرض من: {offer.name}</h3>

              <p>📞 {offer.phone}</p>

              <p>
                🤝 نوع المساعدة: {offer.help_type}
              </p>

              <p>
                📝 تفاصيل العرض: {offer.description}
              </p>

              <div style={caseBoxStyle}>
                <h4>🆘 الحالة التي اختارها المتبرع</h4>

                {selectedRequest ? (
                  <>
                    <p>
                      <strong>الاسم:</strong>{" "}
                      {selectedRequest.name}
                    </p>

                    <p>
                      📍 {selectedRequest.wilaya} -{" "}
                      {selectedRequest.municipality}
                    </p>

                    <p>
                      🤝 {selectedRequest.help_type}
                    </p>

                    <p>
                      🔢 رقم المتابعة:{" "}
                      {selectedRequest.tracking_code}
                    </p>
                  </>
                ) : (
                  <p>
                    ⚠️ لم يتم العثور على الحالة المرتبطة بهذا العرض.
                  </p>
                )}
              </div>

              <p>
                <strong>حالة العرض:</strong>{" "}
                {getOfferStatusLabel(offer.status)}
              </p>

              <div style={statusButtons}>
                <button
                  onClick={() =>
                    updateOfferStatus(
                      offer.id,
                      "accepted"
                    )
                  }
                  style={acceptButton}
                >
                  ✅ قبول العرض
                </button>

                <button
                  onClick={() =>
                    updateOfferStatus(
                      offer.id,
                      "rejected"
                    )
                  }
                  style={rejectButton}
                >
                  ❌ رفض العرض
                </button>
              </div>
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
  cursor: "pointer",
};

const topButtons = {
  display: "flex",
  gap: "10px",
  marginBottom: "25px",
  flexWrap: "wrap",
};

const logoutButton = {
  padding: "12px 20px",
  border: "none",
  borderRadius: "10px",
  background: "#dc2626",
  color: "#fff",
  cursor: "pointer",
};

const refreshButton = {
  padding: "12px 20px",
  border: "none",
  borderRadius: "10px",
  background: "#555",
  color: "#fff",
  cursor: "pointer",
};

const cardStyle = {
  background: "#fff",
  padding: "20px",
  margin: "15px 0",
  borderRadius: "14px",
  boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
};

const caseBoxStyle = {
  background: "#f0fdf4",
  border: "1px solid #bbf7d0",
  padding: "15px",
  borderRadius: "12px",
  marginTop: "15px",
  marginBottom: "15px",
};

const statusButtons = {
  display: "flex",
  gap: "8px",
  flexWrap: "wrap",
  marginTop: "15px",
};

const acceptButton = {
  padding: "10px 15px",
  border: "none",
  borderRadius: "8px",
  background: "#16a34a",
  color: "#fff",
  cursor: "pointer",
};

const rejectButton = {
  padding: "10px 15px",
  border: "none",
  borderRadius: "8px",
  background: "#dc2626",
  color: "#fff",
  cursor: "pointer",
};
