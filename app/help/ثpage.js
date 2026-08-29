"use client";

import { useState } from "react";

export default function HelpPage() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    wilaya: "",
    commune: "",
    helpType: "",
    description: "",
  });

  const [message, setMessage] = useState("");

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  function handleSubmit(e) {
    e.preventDefault();
    setMessage("تم تسجيل طلبك مبدئيًا بنجاح ✅");
  }

  return (
    <main dir="rtl" style={{
      minHeight: "100vh",
      background: "#f5f7fa",
      padding: "30px 16px",
      fontFamily: "Arial, sans-serif"
    }}>
      <div style={{
        maxWidth: "650px",
        margin: "auto",
        background: "white",
        padding: "25px",
        borderRadius: "18px"
      }}>
        <h1>🆘 أحتاج إلى مساعدة</h1>

        <p>املأ المعلومات التالية لإرسال طلب المساعدة.</p>

        <form onSubmit={handleSubmit}>
          <input
            name="name"
            placeholder="الاسم الكامل"
            value={form.name}
            onChange={handleChange}
            required
            style={inputStyle}
          />

          <input
            name="phone"
            placeholder="رقم الهاتف"
            value={form.phone}
            onChange={handleChange}
            required
            style={inputStyle}
          />

          <input
            name="wilaya"
            placeholder="الولاية"
            value={form.wilaya}
            onChange={handleChange}
            required
            style={inputStyle}
          />

          <input
            name="commune"
            placeholder="البلدية"
            value={form.commune}
            onChange={handleChange}
            required
            style={inputStyle}
          />

          <input
            name="helpType"
            placeholder="نوع المساعدة"
            value={form.helpType}
            onChange={handleChange}
            required
            style={inputStyle}
          />

          <textarea
            name="description"
            placeholder="اشرح لنا حاجتك"
            value={form.description}
            onChange={handleChange}
            required
            rows="5"
            style={inputStyle}
          />

          <button type="submit" style={buttonStyle}>
            إرسال طلب المساعدة
          </button>
        </form>

        {message && (
          <p style={{ marginTop:
