'use client';

import { useEffect, useState } from "react";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";

type BlockedMember = {
  id: string;
  member_id: string;
  reason: string;
  created_at: string;
  status: string;
};

export default function AdminBlockedPage() {
  const [blocked, setBlocked] = useState<BlockedMember[]>([]);

  async function loadBlocked() {
    const res = await fetch("/api/admin/blocked");
    const data = await res.json();

    setBlocked(data.blocked || []);
  }

  useEffect(() => {
    loadBlocked();
  }, []);

  async function restoreMember(id: string) {
    await fetch("/api/admin/blocked", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        memberId: id,
        status: "active",
      }),
    });

    loadBlocked();
  }

  return (
    <main dir="rtl" className="min-h-screen flex flex-col">

      <Header />

      <section className="flex-1 p-6">

        <div className="mx-auto max-w-5xl">

          <h1 className="mb-6 text-center text-3xl font-bold text-rose-700">
            قائمة المحظورين
          </h1>

          <div className="grid gap-5 md:grid-cols-3">

            {blocked.map((member) => (
              <div key={member.id} className="qalby-card p-5">

                <p>
                  العضو: {member.member_id}
                </p>

                <p className="mt-2">
                  السبب: {member.reason}
                </p>

                <p className="mt-2">
                  الحالة: {member.status}
                </p>

                <button
                  onClick={() => restoreMember(member.member_id)}
                  className="qalby-button mt-4 w-full"
                >
                  إعادة تفعيل العضو
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
