"use client";

import { useMemo, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import dz from "geoalgeria";

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

  const wilayas = dz.wilayas;
  const communes = useMemo(() => {
    if (!form.wilaya) return [];
    return dz.getCommunesByWilaya(Number(form.wilaya));
  }, [form.wilaya]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((current) => ({
      ...current,
      [name]: value,
      ...(name === "wilaya" ? { municipality: "" } : {}),
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    const selectedWilaya = dz.getWilaya(Number(form.wilaya));
    const selectedCommune = communes.find(
      (item) => String(item.code) === form.municipality
    );

    const payload = {
      ...form,
      wilaya: selectedWilaya?.name_ar || selectedWilaya?.name_fr || form.wilaya,
      municipality:
        selectedCommune?.name_ar || selectedCommune?.name_fr || form.municipality,
      status: "new",
    };

    const { data, error } = await supabase
      .from("help_requests")
      .insert([payload])
      .select("tracking_code")
      .single();

    setLoading(false);

    if (error) {
      console.error(error);
      setResult({ success: false, message: `خطأ: ${error.message}` });
      return;
    }

    setResult({
      success: true,
      message: `تم إرسال طلبك بنجاح ✅ رقم المتابعة الخاص بك هو: ${data.tracking_code}`,
    });
    setForm({ name: "", phone: "", wilaya: "", municipality: "", help_type: "", description: "" });
  }

  return (
    <main dir="rtl" style={mainStyle}>
      <div style={boxStyle}>
        <h1 style={{ textAlign: "center" }}>🆘 طلب مساعدة</h1>

        {result?.success ? (
          <div style={successStyle}>
            <h2>✅ تم إرسال الطلب بنجاح</h2>
            <p>{result.message}</p>
            <p style={{ color: "#666" }}>احتفظ برقم المتابعة لاستخدامه لاحقًا.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <label>الاسم</label>
            <input required name="name" value={form.name} onChange={handleChange} placeholder="اكتب اسمك" style={inputStyle} />

            <label>رقم الهاتف</label>
            <input required name="phone" value={form.phone} onChange={handleChange} type="tel" inputMode="tel" placeholder="اكتب رقم الهاتف" style={inputStyle} />

            <label>الولاية</label>
            <select required name="wilaya" value={form.wilaya} onChange={handleChange} style={inputStyle}>
              <option value="">اختر الولاية — 69 ولاية</option>
              {wilayas.map((wilaya) => (
                <option key={wilaya.code} value={wilaya.code}>
                  {wilaya.code} — {wilaya.name_ar}
                </option>
              ))}
            </select>

            <label>البلدية</label>
            <select required name="municipality" value={form.municipality} onChange={handleChange} style={inputStyle} disabled={!form.wilaya}>
              <option value="">{form.wilaya ? `اختر البلدية — ${communes.length} بلدية` : "اختر الولاية أولًا"}</option>
              {communes.map((commune) => (
                <option key={commune.code} value={commune.code}>
                  {commune.name_ar || commune.name_fr}
                </option>
              ))}
            </select>

            <label>نوع المساعدة المطلوبة</label>
            <select required name="help_type" value={form.help_type} onChange={handleChange} style={inputStyle}>
              <option value="">اختر نوع المساعدة</option>
              <option value="مساعدة مالية">مساعدة مالية</option>
              <option value="مساعدة غذائية">مساعدة غذائية</option>
              <option value="مساعدة طبية">مساعدة طبية</option>
              <option value="مساعدة في السكن">مساعدة في السكن</option>
              <option value="مساعدة أخرى">مساعدة أخرى</option>
            </select>

            <label>شرح الطلب</label>
            <textarea required name="description" value={form.description} onChange={handleChange} placeholder="اشرح لنا حاجتك..." rows="5" style={inputStyle} />

            <button type="submit" disabled={loading} style={{ ...buttonStyle, opacity: loading ? 0.6 : 1 }}>
              {loading ? "جاري الإرسال..." : "إرسال طلب المساعدة"}
            </button>
          </form>
        )}

        {result && !result.success && <p style={errorStyle}>{result.message}</p>}
      </div>
    </main>
  );
}

const mainStyle = { minHeight: "100vh", background: "#f5f7fa", padding: "30px 16px", fontFamily: "Arial, sans-serif" };
const boxStyle = { maxWidth: "650px", margin: "0 auto", background: "#fff", padding: "25px", borderRadius: "16px", boxShadow: "0 3px 15px rgba(0,0,0,0.08)" };
const inputStyle = { width: "100%", boxSizing: "border-box", padding: "14px", marginTop: "8px", marginBottom: "18px", border: "1px solid #ddd", borderRadius: "10px", fontSize: "16px" };
const buttonStyle = { width: "100%", padding: "16px", border: "none", borderRadius: "12px", fontSize: "18px", cursor: "pointer", background: "#2563eb", color: "#fff" };
const successStyle = { textAlign: "center", padding: "30px 10px" };
const errorStyle = { color: "red", textAlign: "center", marginTop: "20px" };
