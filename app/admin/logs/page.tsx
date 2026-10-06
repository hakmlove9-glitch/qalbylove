'use client';

import { useEffect, useState } from "react";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";

type Log = {
  id: string;
  action: string;
  admin_id: string;
  created_at: string;
};

export default function AdminLogsPage() {
  const [logs, setLogs] = useState<Log[]>([]);

  async function loadLogs() {
    const res = await fetch("/api/admin/logs");
    const data = await res.json();

    setLogs(data.logs || []);
  }

  useEffect(() => {
    loadLogs();
  }, []);

  return (
    <main dir="rtl" className="min-h-screen flex flex-col">

      <Header />

      <section className="flex-1 p-6">

        <div className="mx-auto max-w-5xl">

          <h1 className="mb-6 text-center text-3xl font-bold text-rose-700">
            سجل عمليات الإدارة
          </h1>

          <div className="space-y-4">

            {logs.map((log) => (
              <div
                key={log.id}
                className="qalby-card p-5"
              >

                <p>
                  العملية: {log.action}
                </p>

                <p className="mt-2">
                  المدير: {log.admin_id}
                </p>

                <p className="mt-2">
                  التاريخ: {log.created_at}
                </p>

              </div>
            ))}

          </div>

        </div>

      </section>

      <Footer />

    </main>
  );
}
