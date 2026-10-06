'use client';

import { useState } from "react";

export default function AssistantSettings() {
  const [enabled, setEnabled] = useState(true);

  return (
    <div dir="rtl" className="qalby-card p-5">
      <h2 className="mb-4 font-bold text-rose-700">
        إعدادات المساعدات ❤️
      </h2>

      <label className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={enabled}
          onChange={(e) => setEnabled(e.target.checked)}
        />

        تشغيل المساعدات والشخصيات الصغيرة
      </label>
    </div>
  );
}
