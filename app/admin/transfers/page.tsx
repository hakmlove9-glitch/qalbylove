'use client';

import { useEffect, useState } from "react";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";

type Transfer = {
  id: string;
  member_id: string;
  amount: number;
  method: string;
  status: string;
};

export default function AdminTransfersPage() {
  const [transfers, setTransfers] = useState<Transfer[]>([]);

  async function loadTransfers() {
    const res = await fetch("/api/admin/transfers");
    const data = await res.json();

    setTransfers(data.transfers || []);
  }

  useEffect(() => {
    loadTransfers();
  }, []);

  async function updateTransfer(id: string, status: string) {
    await fetch("/api/admin/transfers", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        transferId: id,
        status,
      }),
    });

    loadTransfers();
  }

  return (
    <main dir="rtl" className="min-h-screen flex flex-col">

      <Header />

      <section className="flex-1 p-6">

        <div className="mx-auto max-w-5xl">

          <h1 className="mb-6 text-center text-3xl font-bold text-rose-700">
            إدارة التحويلات
          </h1>

          <div className="grid gap-5 md:grid-cols-3">

            {transfers.map((transfer) => (
              <div
                key={transfer.id}
                className="qalby-card p-5"
              >

                <p>
                  رقم العضو: {transfer.member_id}
                </p>

                <p className="mt-2">
                  المبلغ: {transfer.amount}
                </p>

                <p className="mt-2">
                  طريقة التحويل: {transfer.method}
                </p>

                <p className="mt-2">
                  الحالة: {transfer.status}
                </p>

                <button
                  onClick={() => updateTransfer(transfer.id, "approved")}
                  className="qalby-button mt-4 w-full"
                >
                  قبول التحويل
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
