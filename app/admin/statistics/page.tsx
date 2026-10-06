'use client';

import { useEffect, useState } from "react";

type Stats = {
  members: number;
  activeMembers: number;
  subscriptions: number;
  messages: number;
  reports: number;
  pendingPhotos: number;
};

export default function StatisticsPage() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch("/api/admin/statistics")
      .then((res) => res.json())
      .then((data) => {
        setStats(data.stats || null);
      });
  }, []);

  if (!stats) {
    return <div className="p-6">جاري التحميل...</div>;
  }

  return (
    <main dir="rtl" className="min-h-screen p-6">
      <h1 className="mb-8 text-center text-3xl font-bold text-rose-700">
        إحصائيات الإدارة 📊
      </h1>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="qalby-card p-5">
          الأعضاء: {stats.members}
        </div>

        <div className="qalby-card p-5">
          النشطون: {stats.activeMembers}
        </div>

        <div className="qalby-card p-5">
          الاشتراكات: {stats.subscriptions}
        </div>

        <div className="qalby-card p-5">
          الرسائل: {stats.messages}
        </div>

        <div className="qalby-card p-5">
          البلاغات: {stats.reports}
        </div>

        <div className="qalby-card p-5">
          الصور المنتظرة: {stats.pendingPhotos}
        </div>
      </div>
    </main>
  );
}
