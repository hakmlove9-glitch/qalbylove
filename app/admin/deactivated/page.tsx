'use client';

import { useEffect, useState } from "react";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";

type DeactivatedMember = {
  id: string;
  username: string;
  member_number: number;
  deactivated_at: string;
  reason: string;
};

export default function AdminDeactivatedPage() {
  const [members, setMembers] = useState<DeactivatedMember[]>([]);

  async function loadMembers() {
    const res = await fetch("/api/admin/deactivated");
    const data = await res.json();

    setMembers(data.members || []);
  }

  useEffect(() => {
    loadMembers();
  }, []);

  async function restoreMember(id: string) {
    await fetch("/api/admin/deactivated", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        memberId: id,
      }),
    });

    loadMembers();
  }

  return (
    <main dir="rtl" className="min-h-screen flex flex-col">

      <Header />

      <section className="flex-1 p-6">

        <div className="mx-auto max-w-5xl">

          <h1 className="mb-6 text-center text-3xl font-bold text-rose-700">
            الحسابات المغلقة مؤقتًا
          </h1>

          <div className="grid gap-5 md:grid-cols-3">

            {members.map((member) => (
              <div
                key={member.id}
                className="qalby-card p-5"
              >

                <h2 className="font-bold text-rose-700">
                  {member.username}
                </h2>

                <p className="mt-2">
                  رقم العضوية: {member.member_number}
                </p>

                <p className="mt-2">
                  السبب: {member.reason}
                </p>

                <p className="mt-2">
                  تاريخ الإغلاق: {member.deactivated_at}
                </p>

                <button
                  onClick={() => restoreMember(member.id)}
                  className="qalby-button mt-4 w-full"
                >
                  إعادة تفعيل الحساب
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
