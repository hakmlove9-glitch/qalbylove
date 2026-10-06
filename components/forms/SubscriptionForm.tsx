"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Plan = {
  id: string;
  name: string;
  price: number;
  duration: number;
  durationLabel: string;
  features: string[];
  popular?: boolean;
};

const PLANS: Plan[] = [
  {
    id: "basic",
    name: "الباقة الأساسية",
    price: 99,
    duration: 1,
    durationLabel: "شهر واحد",
    features: [
      "إظهار الملف للأعضاء",
      "إرسال واستقبال الرسائل",
      "إرسال الاهتمامات",
      "إضافة الأعضاء للمفضلة",
    ],
  },
  {
    id: "plus",
    name: "الباقة المميزة",
    price: 199,
    duration: 3,
    durationLabel: "3 أشهر",
    popular: true,
    features: [
      "كل مميزات الباقة الأساسية",
      "ظهور أفضل في نتائج البحث",
      "مشاهدة من زار ملفك",
      "فلاتر بحث متقدمة",
      "أولوية في الاقتراحات",
    ],
  },
  {
    id: "premium",
    name: "الباقة الملكية",
    price: 349,
    duration: 6,
    durationLabel: "6 أشهر",
    features: [
      "كل مميزات الباقة المميزة",
      "أولوية ظهور أعلى",
      "مميزات VIP",
      "تمييز الملف الشخصي",
      "دعم أولوية",
      "عروض خاصة",
    ],
  },
];

export default function SubscriptionForm() {
  const router = useRouter();

  const [selected, setSelected] =
    useState("plus");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  async function subscribe() {
    if (loading) return;

    const plan = PLANS.find(
      (item) =>
        item.id === selected
    );

    if (!plan) {
      setError(
        "الباقة غير موجودة"
      );
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(
        "/api/subscriptions/create",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            plan_id: plan.id,
            plan_name: plan.name,
            price: plan.price,
            duration_months:
              plan.duration,
          }),
        }
      );

      const data =
        await res.json();

      if (!res.ok) {
        throw new Error(
          data.error ||
            "تعذر إنشاء الاشتراك"
        );
      }

      if (!data.id) {
        throw new Error(
          "تم إنشاء الاشتراك بدون رقم تعريف"
        );
      }

      router.push(
        `/payment?subscription_id=${encodeURIComponent(
          data.id
        )}&plan=${encodeURIComponent(
          plan.id
        )}`
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "حدث خطأ أثناء إنشاء الاشتراك"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      dir="rtl"
      className="mx-auto max-w-6xl"
    >
      <div className="mb-8 text-center">

        <h1 className="text-4xl font-black text-rose-700">
          اختر باقتك 💎
        </h1>

        <p className="mt-3 text-gray-500">
          اختر الباقة المناسبة لك واستمتع
          بالمميزات المتاحة.
        </p>

      </div>

      {error && (
        <div className="mb-6 rounded-xl bg-red-50 p-4 text-center text-red-700">
          {error}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-3">

        {PLANS.map((plan) => {
          const active =
            selected === plan.id;

          return (
            <button
              key={plan.id}
              type="button"
              onClick={() =>
                setSelected(plan.id)
              }
              className={`relative rounded-3xl border-2 bg-white p-6 text-right shadow-lg transition ${
                active
                  ? "border-rose-600 ring-4 ring-rose-100"
                  : "border-gray-100"
              }`}
            >

              {plan.popular && (
                <span className="absolute -top-3 right-5 rounded-full bg-rose-600 px-4 py-1 text-sm font-bold text-white">
                  الأكثر طلبًا
                </span>
              )}

              <h2 className="text-2xl font-black text-rose-700">
                {plan.name}
              </h2>

              <div className="mt-5">
                <span className="text-4xl font-black">
                  {plan.price}
                </span>

                <span className="mr-2 text-gray-500">
                  جنيه
                </span>
              </div>

              <p className="mt-2 text-center text-gray-500">
                {plan.durationLabel}
              </p>

              <div className="my-6 h-px bg-gray-100" />

              <ul className="space-y-3 text-gray-700">
                {plan.features.map(
                  (feature) => (
                    <li
                      key={feature}
                      className="flex gap-2"
                    >
                      <span className="font-bold text-green-600">
                        ✓
                      </span>

                      <span>
                        {feature}
                      </span>
                    </li>
                  )
                )}
              </ul>

              <div
                className={`mt-7 rounded-xl p-3 text-center font-bold ${
                  active
                    ? "bg-rose-600 text-white"
                    : "bg-rose-50 text-rose-700"
                }`}
              >
                {active
                  ? "الباقة المختارة ✓"
                  : "اختيار الباقة"}
              </div>

            </button>
          );
        })}

      </div>

      <button
        type="button"
        onClick={subscribe}
        disabled={loading}
        className="qalby-button mt-8 w-full disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading
          ? "جاري تجهيز الاشتراك..."
          : "متابعة الدفع 💳"}
      </button>

    </div>
  );
}