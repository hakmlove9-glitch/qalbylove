'use client';

import { useEffect, useState } from "react";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";

type Ad = {
  id: string;
  title: string;
  company_name: string;
  status: string;
  image_url?: string;
};

export default function AdminAdsPage() {
  const [ads, setAds] = useState<Ad[]>([]);

  async function loadAds() {
    const res = await fetch("/api/admin/ads");
    const data = await res.json();

    setAds(data.ads || []);
  }

  useEffect(() => {
    loadAds();
  }, []);

  async function updateAd(id: string, status: string) {
    await fetch("/api/admin/ads", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        adId: id,
        status,
      }),
    });

    loadAds();
  }

  return (
    <main dir="rtl" className="min-h-screen flex flex-col">

      <Header />

      <section className="flex-1 p-6">

        <div className="mx-auto max-w-5xl">

          <h1 className="mb-6 text-center text-3xl font-bold text-rose-700">
            إدارة الإعلانات
          </h1>

          <div className="grid gap-5 md:grid-cols-3">

            {ads.map((ad) => (
              <div key={ad.id} className="qalby-card p-5">

                <h2 className="text-xl font-bold text-rose-700">
                  {ad.title}
                </h2>

                <p className="mt-2">
                  الشركة: {ad.company_name}
                </p>

                <p className="mt-2">
                  الحالة: {ad.status}
                </p>

                <button
                  onClick={() => updateAd(ad.id, "approved")}
                  className="qalby-button mt-4 w-full"
                >
                  قبول الإعلان
                </button>

              </div>
            ))}

          </div>

        </div>

      </section>

      <Footer />

    </main>
  );
}
