"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

function phoneNumber(phone) {
  if (!phone) return "";
  return phone.replace(/\D/g, "").replace(/^0/, "213");
}

export default function AdminPage() {
  const [session, setSession] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [requests, setRequests] = useState([]);
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [wilayaFilter, setWilayaFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);

      if (data.session) {
        loadData();
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);

      if (newSession) {
        loadData();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function login(e) {
    e.preventDefault();

    const { error } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (error) {
      alert(
        "البريد الإلكتروني أو كلمة المرور غير صحيحة."
      );
    }
  }

  async function logout() {
    await supabase.auth.signOut();
    setRequests([]);
    setOffers([]);
  }

  async function loadData() {
    setLoading(true);

    const {
      data: requestData,
      error: requestError,
    } = await supabase
      .from("help_requests")
      .select("*")
      .order("created_at", {
        ascending: false,
      });

    const {
      data: offerData,
      error: offerError,
    } = await supabase
      .from("help_offers")
      .select("*")
      .order("created_at", {
        ascending: false,
      });

    if (requestError) {
      alert(
        `خطأ في تحميل الطلبات: ${requestError.message}`
      );
    }

    if (offerError) {
      alert(
        `خطأ في تحميل العروض: ${offerError.message}`
      );
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
      alert(
        `تعذر تحديث حالة الطلب: ${error.message}`
      );
      return;
    }

    await loadData();
  }

  async function updateOfferStatus(id, status) {
    const action =
      status === "accepted"
        ? "قبول هذا العرض"
        : "رفض هذا العرض";

    if (!confirm(`هل أنت متأكد من ${action}؟`)) {
      return;
    }

    const { error } = await supabase
      .from("help_offers")
      .update({ status })
      .eq("id", id);

    if (error) {
      alert(
        `تعذر تحديث حالة العرض: ${error.message}`
      );
      return;
    }

    await loadData();
  }

  function getRequestForOffer(offer) {
    return requests.find(
      (request) =>
        request.id === offer.help_request_id
    );
  }

  function getRequestStatus(status) {
    if (status === "approved") {
      return {
        text: "مقبول",
        icon: "✅",
        background: "#dcfce7",
        color: "#166534",
      };
    }

    if (status === "completed") {
      return {
        text: "تمت المساعدة",
        icon: "🎉",
        background: "#dbeafe",
        color: "#1d4ed8",
      };
    }

    if (status === "rejected") {
      return {
        text: "مرفوض",
        icon: "❌",
        background: "#fee2e2",
        color: "#991b1b",
      };
    }

    return {
      text: "قيد المراجعة",
      icon: "🔎",
      background: "#fef3c7",
      color: "#92400e",
    };
  }

  function getOfferStatus(status) {
    if (status === "accepted") {
      return {
        text: "مقبول",
        icon: "✅",
        background: "#dcfce7",
        color: "#166534",
      };
    }

    if (status === "rejected") {
      return {
        text: "مرفوض",
        icon: "❌",
        background: "#fee2e2",
        color: "#991b1b",
      };
    }

    return {
      text: "قيد الانتظار",
      icon: "🟡",
      background: "#fef3c7",
      color: "#92400e",
    };
  }

  const wilayas = [
    ...new Set(
      requests
        .map((item) => item.wilaya)
        .filter(Boolean)
    ),
  ].sort();

  const filteredRequests =
    requests.filter((item) => {
      const text = `
        ${item.name || ""}
        ${item.phone || ""}
        ${item.tracking_code || ""}
        ${item.help_type || ""}
        ${item.wilaya || ""}
        ${item.municipality || ""}
        ${item.description || ""}
      `.toLowerCase();

      const matchesSearch =
        text.includes(
          search.toLowerCase().trim()
        );

      const matchesWilaya =
        !wilayaFilter ||
        item.wilaya === wilayaFilter;

      const matchesStatus =
        !statusFilter ||
        item.status === statusFilter;

      return (
        matchesSearch &&
        matchesWilaya &&
        matchesStatus
      );
    });

  const pendingRequests =
    requests.filter(
      (item) =>
        item.status === "reviewing" ||
        item.status === "new"
    ).length;

  const approvedRequests =
    requests.filter(
      (item) => item.status === "approved"
    ).length;

  const completedRequests =
    requests.filter(
      (item) => item.status === "completed"
    ).length;

  const rejectedRequests =
    requests.filter(
      (item) => item.status === "rejected"
    ).length;

  const pendingOffers =
    offers.filter(
      (item) =>
        !item.status ||
        item.status === "pending"
    ).length;

  const acceptedOffers =
    offers.filter(
      (item) => item.status === "accepted"
    ).length;

  const rejectedOffers =
    offers.filter(
      (item) => item.status === "rejected"
    ).length;

  if (!session) {
    return (
      <main dir="rtl" style={mainStyle}>
        <div style={loginBoxStyle}>
          <h1>🔐 دخول الإدارة</h1>

          <p style={{ color: "#666" }}>
            لوحة إدارة منصة المساعدة
          </p>

          <form onSubmit={login}>
            <input
              type="email"
              required
              placeholder="البريد الإلكتروني"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              style={inputStyle}
            />

            <input
              type="password"
              required
              placeholder="كلمة المرور"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              style={inputStyle}
            />

            <button
              type="submit"
              style={buttonStyle}
            >
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

        <div style={headerStyle}>
          <div>
            <h1 style={{ margin: 0 }}>
              👨‍💼 لوحة الإدارة
            </h1>

            <p style={{ color: "#666" }}>
              إدارة طلبات وعروض المساعدة
            </p>
          </div>

          <div style={headerButtons}>
            <button
              onClick={loadData}
              style={refreshButton}
            >
              🔄 تحديث
            </button>

            <button
              onClick={logout}
              style={logoutButton}
            >
              تسجيل الخروج
            </button>
          </div>
        </div>

        <h2>📊 الإحصائيات</h2>

        <div style={statsContainer}>

          <div style={statCard}>
            <strong>🆘</strong>
            <span>كل الطلبات</span>
            <b>{requests.length}</b>
          </div>

          <div style={statCard}>
            <strong>🟡</strong>
            <span>قيد المراجعة</span>
            <b>{pendingRequests}</b>
          </div>

          <div style={statCard}>
            <strong>✅</strong>
            <span>طلبات مقبولة</span>
            <b>{approvedRequests}</b>
          </div>

          <div style={statCard}>
            <strong>🎉</strong>
            <span>تمت مساعدتها</span>
            <b>{completedRequests}</b>
          </div>

          <div style={statCard}>
            <strong>❌</strong>
            <span>طلبات مرفوضة</span>
            <b>{rejectedRequests}</b>
          </div>

          <div style={statCard}>
            <strong>🤲</strong>
            <span>كل العروض</span>
            <b>{offers.length}</b>
          </div>

          <div style={statCard}>
            <strong>🟡</strong>
            <span>عروض قيد الانتظار</span>
            <b>{pendingOffers}</b>
          </div>

          <div style={statCard}>
            <strong>🤝</strong>
            <span>عروض مقبولة</span>
            <b>{acceptedOffers}</b>
          </div>

          <div style={statCard}>
            <strong>❌</strong>
            <span>عروض مرفوضة</span>
            <b>{rejectedOffers}</b>
          </div>

        </div>

        <h2 style={{ marginTop: "40px" }}>
          🔎 البحث والتصفية
        </h2>

        <div style={filtersBox}>

          <input
            type="text"
            placeholder="🔎 الاسم أو الهاتف أو رقم المتابعة..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            style={filterInput}
          />

          <select
            value={wilayaFilter}
            onChange={(e) =>
              setWilayaFilter(e.target.value)
            }
            style={filterInput}
          >
            <option value="">
              📍 كل الولايات
            </option>

            {wilayas.map((wilaya) => (
              <option
                key={wilaya}
                value={wilaya}
              >
                {wilaya}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value)
            }
            style={filterInput}
          >
            <option value="">
              📋 كل الحالات
            </option>

            <option value="new">
              🆕 جديد
            </option>

            <option value="reviewing">
              🔎 قيد المراجعة
            </option>

            <option value="approved">
              ✅ مقبول
            </option>

            <option value="completed">
              🎉 تمت المساعدة
            </option>

            <option value="rejected">
              ❌ مرفوض
            </option>
          </select>

          {(search ||
            wilayaFilter ||
            statusFilter) && (
            <button
              onClick={() => {
                setSearch("");
                setWilayaFilter("");
                setStatusFilter("");
              }}
              style={clearButton}
            >
              🧹 مسح البحث
            </button>
          )}

        </div>

        <h2 style={{ marginTop: "40px" }}>
          🆘 طلبات المساعدة
        </h2>

        <p style={{ color: "#666" }}>
          عرض {filteredRequests.length} من أصل{" "}
          {requests.length} طلب
        </p>

        {loading && (
          <p>جاري التحميل...</p>
        )}

        {!loading &&
          filteredRequests.length === 0 && (
            <div style={emptyStyle}>
              لا توجد طلبات مطابقة.
            </div>
          )}

        {filteredRequests.map((item) => {
          const status =
            getRequestStatus(item.status);

          return (
            <div
              key={item.id}
              style={cardStyle}
            >

              <div style={topRowStyle}>
                <h3 style={{ margin: 0 }}>
                  🆘 {item.name}
                </h3>

                <div
                  style={{
                    ...statusBadge,
                    background:
                      status.background,
                    color: status.color,
                  }}
                >
                  {status.icon}{" "}
                  {status.text}
                </div>
              </div>

              <p>📞 {item.phone}</p>

              <div style={contactButtons}>
                <a
                  href={`tel:${item.phone}`}
                  style={callButton}
                >
                  📞 اتصال بالمحتاج
                </a>

                <a
                  href={`https://wa.me/${phoneNumber(
                    item.phone
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={whatsappButton}
                >
                  💬 واتساب
                </a>
              </div>

              <p>
                📍 {item.wilaya} -{" "}
                {item.municipality}
              </p>

              <p>
                🤝 {item.help_type}
              </p>

              <p>
                📝 {item.description}
              </p>

              <p>
                🔢 رقم المتابعة:{" "}
                <strong>
                  {item.tracking_code}
                </strong>
              </p>

              <div style={statusButtons}>

                <button
                  onClick={() =>
                    updateRequestStatus(
                      item.id,
                      "reviewing"
                    )
                  }
                  style={reviewButton}
                >
                  🔎 قيد المراجعة
                </button>

                <button
                  onClick={() =>
                    updateRequestStatus(
                      item.id,
                      "approved"
                    )
                  }
                  style={acceptButton}
                >
                  ✅ قبول الطلب
                </button>

                <button
                  onClick={() =>
                    updateRequestStatus(
                      item.id,
                      "completed"
                    )
                  }
                  style={completeButton}
                >
                  🎉 تمت المساعدة
                </button>

                <button
                  onClick={() =>
                    updateRequestStatus(
                      item.id,
                      "rejected"
                    )
                  }
                  style={rejectButton}
                >
                  ❌ رفض الطلب
                </button>

              </div>

            </div>
          );
        })}

        <h2 style={{ marginTop: "45px" }}>
          🤲 عروض المساعدة
        </h2>

        {offers.length === 0 && (
          <div style={emptyStyle}>
            لا توجد عروض مساعدة حاليًا.
          </div>
        )}

        {offers.map((offer) => {
          const request =
            getRequestForOffer(offer);

          const status =
            getOfferStatus(offer.status);

          return (
            <div
              key={offer.id}
              style={offerCardStyle}
            >

              <div style={offerHeaderStyle}>

                <div>
                  <h3 style={{ margin: 0 }}>
                    🤲 عرض مساعدة من{" "}
                    {offer.name}
                  </h3>

                  <p
                    style={{
                      marginBottom: 0,
                    }}
                  >
                    📞 {offer.phone}
                  </p>

                  <div style={contactButtons}>
                    <a
                      href={`tel:${offer.phone}`}
                      style={callButton}
                    >
                      📞 اتصال بالمتبرع
                    </a>

                    <a
                      href={`https://wa.me/${phoneNumber(
                        offer.phone
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={whatsappButton}
                    >
                      💬 واتساب
                    </a>
                  </div>
                </div>

                <div
                  style={{
                    ...statusBadge,
                    background:
                      status.background,
                    color: status.color,
                  }}
                >
                  {status.icon}{" "}
                  {status.text}
                </div>

              </div>

              <div style={sectionStyle}>

                <h4>
                  🤲 المساعدة التي يستطيع تقديمها
                </h4>

                <p>
                  <strong>النوع:</strong>{" "}
                  {offer.help_type}
                </p>

                <p>
                  <strong>التفاصيل:</strong>{" "}
                  {offer.description}
                </p>

              </div>

              <div style={requestBoxStyle}>

                <h4>
                  🆘 الحالة التي اختارها المتبرع
                </h4>

                {request ? (
                  <>
                    <p>
                      <strong>
                        اسم المحتاج:
                      </strong>{" "}
                      {request.name}
                    </p>

                    <p>
                      📞{" "}
                      <strong>
                        هاتف المحتاج:
                      </strong>{" "}
                      {request.phone}
                    </p>

                    <div style={contactButtons}>
                      <a
                        href={`tel:${request.phone}`}
                        style={callButton}
                      >
                        📞 اتصال بالمحتاج
                      </a>

                      <a
                        href={`https://wa.me/${phoneNumber(
                          request.phone
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={whatsappButton}
                      >
                        💬 واتساب
                      </a>
                    </div>

                    <p>
                      📍{" "}
                      <strong>
                        المكان:
                      </strong>{" "}
                      {request.wilaya} -{" "}
                      {request.municipality}
                    </p>

                    <p>
                      🤝{" "}
                      <strong>
                        نوع الحاجة:
                      </strong>{" "}
                      {request.help_type}
                    </p>

                    <p>
                      📝{" "}
                      <strong>
                        تفاصيل الطلب:
                      </strong>{" "}
                      {request.description}
                    </p>

                    <p>
                      🔢{" "}
                      <strong>
                        رقم المتابعة:
                      </strong>{" "}
                      {request.tracking_code}
                    </p>
                  </>
                ) : (
                  <p
                    style={{
                      color: "#b91c1c",
                    }}
                  >
                    ⚠️ لم يتم العثور على الحالة
                    المرتبطة بهذا العرض.
                  </p>
                )}

              </div>

              <div style={offerActions}>

                {offer.status !== "accepted" && (
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
                )}

                {offer.status !== "rejected" && (
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
                )}

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
  maxWidth: "1000px",
  margin: "0 auto",
};

const loginBoxStyle = {
  maxWidth: "450px",
  margin: "80px auto",
  background: "#fff",
  padding: "28px",
  borderRadius: "18px",
  boxShadow:
    "0 3px 15px rgba(0,0,0,0.08)",
  textAlign: "center",
};

const headerStyle = {
  background: "#fff",
  padding: "22px",
  borderRadius: "16px",
  boxShadow:
    "0 2px 10px rgba(0,0,0,0.06)",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "15px",
  flexWrap: "wrap",
  marginBottom: "20px",
};

const headerButtons = {
  display: "flex",
  gap: "8px",
  flexWrap: "wrap",
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

const filterInput = {
  width: "100%",
  boxSizing: "border-box",
  padding: "14px",
  border: "1px solid #ddd",
  borderRadius: "10px",
  fontSize: "16px",
  background: "#fff",
};

const filtersBox = {
  background: "#fff",
  padding: "18px",
  borderRadius: "15px",
  boxShadow:
    "0 2px 10px rgba(0,0,0,0.06)",
  display: "grid",
  gap: "10px",
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

const clearButton = {
  padding: "13px",
  border: "none",
  borderRadius: "10px",
  background: "#64748b",
  color: "#fff",
  fontSize: "15px",
  cursor: "pointer",
};

const statsContainer = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(150px, 1fr))",
  gap: "12px",
  marginBottom: "25px",
};

const statCard = {
  background: "#fff",
  padding: "18px",
  borderRadius: "14px",
  boxShadow:
    "0 2px 10px rgba(0,0,0,0.06)",
  display: "flex",
  flexDirection: "column",
  gap: "8px",
};

const cardStyle = {
  background: "#fff",
  padding: "20px",
  margin: "15px 0",
  borderRadius: "14px",
  boxShadow:
    "0 2px 10px rgba(0,0,0,0.08)",
};

const offerCardStyle = {
  ...cardStyle,
  borderRight: "5px solid #16a34a",
};

const topRowStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "10px",
  flexWrap: "wrap",
};

const offerHeaderStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: "15px",
  flexWrap: "wrap",
};

const statusBadge = {
  padding: "8px 14px",
  borderRadius: "20px",
  fontWeight: "bold",
  whiteSpace: "nowrap",
};

const contactButtons = {
  display: "flex",
  gap: "8px",
  flexWrap: "wrap",
  marginTop: "10px",
  marginBottom: "10px",
};

const callButton = {
  display: "inline-block",
  padding: "10px 14px",
  borderRadius: "8px",
  background: "#2563eb",
  color: "#fff",
  textDecoration: "none",
  fontWeight: "bold",
};

const whatsappButton = {
  display: "inline-block",
  padding: "10px 14px",
  borderRadius: "8px",
  background: "#16a34a",
  color: "#fff",
  textDecoration: "none",
  fontWeight: "bold",
};

const sectionStyle = {
  marginTop: "18px",
  padding: "15px",
  background: "#f8fafc",
  borderRadius: "12px",
};

const requestBoxStyle = {
  marginTop: "15px",
  padding: "18px",
  background: "#f0fdf4",
  border: "1px solid #bbf7d0",
  borderRadius: "12px",
};

const offerActions = {
  display: "flex",
  gap: "10px",
  flexWrap: "wrap",
  marginTop: "18px",
};

const statusButtons = {
  display: "flex",
  gap: "8px",
  flexWrap: "wrap",
  marginTop: "15px",
};

const refreshButton = {
  padding: "11px 18px",
  border: "none",
  borderRadius: "10px",
  background: "#555",
  color: "#fff",
  cursor: "pointer",
};

const logoutButton = {
  padding: "11px 18px",
  border: "none",
  borderRadius: "10px",
  background: "#dc2626",
  color: "#fff",
  cursor: "pointer",
};

const reviewButton = {
  padding: "10px 14px",
  border: "none",
  borderRadius: "8px",
  background: "#f59e0b",
  color: "#fff",
  cursor: "pointer",
};

const acceptButton = {
  padding: "10px 14px",
  border: "none",
  borderRadius: "8px",
  background: "#16a34a",
  color: "#fff",
  cursor: "pointer",
};

const completeButton = {
  padding: "10px 14px",
  border: "none",
  borderRadius: "8px",
  background: "#2563eb",
  color: "#fff",
  cursor: "pointer",
};

const rejectButton = {
  padding: "10px 14px",
  border: "none",
  borderRadius: "8px",
  background: "#dc2626",
  color: "#fff",
  cursor: "pointer",
};

const emptyStyle = {
  background: "#fff",
  padding: "20px",
  borderRadius: "14px",
  color: "#666",
  textAlign: "center",
};
