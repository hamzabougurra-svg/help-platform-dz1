"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const WILAYAS = [
  [1,"أدرار"],[2,"الشلف"],[3,"الأغواط"],[4,"أم البواقي"],[5,"باتنة"],[6,"بجاية"],[7,"بسكرة"],[8,"بشار"],[9,"البليدة"],[10,"البويرة"],
  [11,"تمنراست"],[12,"تبسة"],[13,"تلمسان"],[14,"تيارت"],[15,"تيزي وزو"],[16,"الجزائر"],[17,"الجلفة"],[18,"جيجل"],[19,"سطيف"],[20,"سعيدة"],
  [21,"سكيكدة"],[22,"سيدي بلعباس"],[23,"عنابة"],[24,"قالمة"],[25,"قسنطينة"],[26,"المدية"],[27,"مستغانم"],[28,"المسيلة"],[29,"معسكر"],[30,"ورقلة"],
  [31,"وهران"],[32,"البيض"],[33,"إليزي"],[34,"برج بوعريريج"],[35,"بومرداس"],[36,"الطارف"],[37,"تندوف"],[38,"تيسمسيلت"],[39,"الوادي"],[40,"خنشلة"],
  [41,"سوق أهراس"],[42,"تيبازة"],[43,"ميلة"],[44,"عين الدفلى"],[45,"النعامة"],[46,"عين تموشنت"],[47,"غرداية"],[48,"غليزان"],[49,"تيميمون"],[50,"برج باجي مختار"],
  [51,"أولاد جلال"],[52,"بني عباس"],[53,"عين صالح"],[54,"عين قزام"],[55,"تقرت"],[56,"جانت"],[57,"المغير"],[58,"المنيعة"],[59,"أفلو"],[60,"الأبيض سيدي الشيخ"],
  [61,"العريشة"],[62,"القنطرة"],[63,"بريكة"],[64,"بوسعادة"],[65,"بئر العاتر"],[66,"قصر البخاري"],[67,"قصر الشلالة"],[68,"عين وسارة"],[69,"مسعد"],
].map(([code, name_ar]) => ({ code: String(code), name_ar }));

const COMMUNES_URL = "https://cdn.jsdelivr.net/gh/el-amin-dev/algeria-wilayas-communes@main/data/communes.json";

export default function HelpPage() {
  const [form, setForm] = useState({ name: "", phone: "", wilaya: "", municipality: "", help_type: "", description: "" });
  const [allCommunes, setAllCommunes] = useState([]);
  const [loadingCommunes, setLoadingCommunes] = useState(true);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    fetch(COMMUNES_URL)
      .then((response) => {
        if (!response.ok) throw new Error("تعذر تحميل بيانات البلديات");
        return response.json();
      })
      .then((data) => setAllCommunes(Array.isArray(data.communes) ? data.communes : []))
      .catch((error) => {
        console.error(error);
        setResult({ success: false, message: "تعذر تحميل قائمة البلديات. تحقق من اتصال الإنترنت ثم أعد المحاولة." });
      })
      .finally(() => setLoadingCommunes(false));
  }, []);

  const communes = useMemo(() => {
    if (!form.wilaya) return [];
    return allCommunes.filter((item) => String(item.wilaya_num) === form.wilaya);
  }, [allCommunes, form.wilaya]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((current) => ({ ...current, [name]: value, ...(name === "wilaya" ? { municipality: "" } : {}) }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    const selectedWilaya = WILAYAS.find((item) => item.code === form.wilaya);
    const selectedCommune = communes.find((item) => item.nom_ar === form.municipality || item.nom_fr === form.municipality);
    const payload = {
      ...form,
      wilaya: selectedWilaya?.name_ar || form.wilaya,
      municipality: selectedCommune?.nom_ar || selectedCommune?.nom_fr || form.municipality,
      status: "new",
    };
    delete payload.wilaya_code;
    const { data, error } = await supabase.from("help_requests").insert([payload]).select("tracking_code").single();
    setLoading(false);
    if (error) {
      console.error(error);
      setResult({ success: false, message: `خطأ: ${error.message}` });
      return;
    }
    setResult({ success: true, message: `تم إرسال طلبك بنجاح ✅ رقم المتابعة الخاص بك هو: ${data.tracking_code}` });
    setForm({ name: "", phone: "", wilaya: "", municipality: "", help_type: "", description: "" });
  }

  return (
    <main dir="rtl" style={mainStyle}>
      <div style={boxStyle}>
        <h1 style={{ textAlign: "center" }}>🆘 طلب مساعدة</h1>
        {result?.success ? (
          <div style={successStyle}><h2>✅ تم إرسال الطلب بنجاح</h2><p>{result.message}</p><p style={{ color: "#666" }}>احتفظ برقم المتابعة لاستخدامه لاحقًا.</p></div>
        ) : (
          <form onSubmit={handleSubmit}>
            <label>الاسم</label><input required name="name" value={form.name} onChange={handleChange} placeholder="اكتب اسمك" style={inputStyle} />
            <label>رقم الهاتف</label><input required name="phone" value={form.phone} onChange={handleChange} type="tel" inputMode="tel" placeholder="اكتب رقم الهاتف" style={inputStyle} />
            <label>الولاية</label>
            <select required name="wilaya" value={form.wilaya} onChange={handleChange} style={inputStyle}>
              <option value="">اختر الولاية — 69 ولاية</option>
              {WILAYAS.map((wilaya) => <option key={wilaya.code} value={wilaya.code}>{wilaya.code.padStart(2,"0")} — {wilaya.name_ar}</option>)}
            </select>
            <label>البلدية</label>
            <select required name="municipality" value={form.municipality} onChange={handleChange} style={inputStyle} disabled={!form.wilaya || loadingCommunes}>
              <option value="">{loadingCommunes ? "جاري تحميل البلديات..." : form.wilaya ? `اختر البلدية — ${communes.length} بلدية` : "اختر الولاية أولًا"}</option>
              {communes.map((commune) => <option key={`${commune.wilaya_num}-${commune.nom_ar}`} value={commune.nom_ar}>{commune.nom_ar}</option>)}
            </select>
            <label>نوع المساعدة المطلوبة</label>
            <select required name="help_type" value={form.help_type} onChange={handleChange} style={inputStyle}>
              <option value="">اختر نوع المساعدة</option><option value="مساعدة مالية">مساعدة مالية</option><option value="مساعدة غذائية">مساعدة غذائية</option><option value="مساعدة طبية">مساعدة طبية</option><option value="مساعدة في السكن">مساعدة في السكن</option><option value="مساعدة أخرى">مساعدة أخرى</option>
            </select>
            <label>شرح الطلب</label><textarea required name="description" value={form.description} onChange={handleChange} placeholder="اشرح لنا حاجتك..." rows="5" style={inputStyle} />
            <button type="submit" disabled={loading || loadingCommunes} style={{ ...buttonStyle, opacity: loading ? 0.6 : 1 }}>{loading ? "جاري الإرسال..." : "إرسال طلب المساعدة"}</button>
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
