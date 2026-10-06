'use client';

import { useState } from "react";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";

export default function ActivatePage() {
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");

  async function activate() {
    const res = await fetch("/api/subscriptions/activate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        code,
      }),
    });

    const data = await res.json();

    if (data.success) {
      setMessage("تم تفعيل الباقة بنجاح ⭐");
    } else {
      setMessage(data.error || "حدث خطأ");
    }
  }

  return (
    <main dir="rtl" className="min-h-screen flex flex-col">

      <Header />

      <section className="flex-1 p-6">

        <div className="mx-auto max-w-xl qalby-card p-6">

          <h1 className="mb-6 text-center text-3xl font-bold text-rose-700">
            تفعيل الباقة
          </h1>

          <input
            className="mb-4 w-full rounded-xl border p-3"
            placeholder="اكتب كود الباقة"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />

          <button
            onClick={activate}
            className="qalby-button w-full"
          >
            تفعيل الكود
          </button>

          {message && (
            <p className="mt-5 text-center font-bold">
              {message}
            </p>
          )}

        </div>

      </section>

      <Footer />

    </main>
  );
}
