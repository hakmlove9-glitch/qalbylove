"use client";

import { useEffect, useState } from "react";
import { Bot, CheckCircle2, Save, Settings2 } from "lucide-react";

export default function AdminSettingsPage() {
  const [siteName, setSiteName] = useState("قلبي لوڤي");
  const [assistants, setAssistants] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/admin/settings", { cache: "no-store" }).then(r => r.json()).then(data => {
      if (data.settings?.site_name) setSiteName(data.settings.site_name);
      if (typeof data.settings?.assistants_enabled === "boolean") setAssistants(data.settings.assistants_enabled);
    }).catch(() => undefined);
  }, []);

  async function saveSettings() {
    setSaving(true); setSaved(false);
    const response = await fetch("/api/admin/settings", {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ siteName, assistants }),
    });
    setSaving(false); setSaved(response.ok);
  }

  return (
    <main dir="rtl" className="min-h-screen">
      <div className="mb-8 flex items-center gap-3">
        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-rose-50 text-rose-600"><Settings2 className="h-6 w-6" /></div>
        <div><h1 className="text-3xl font-black text-rose-950">إعدادات الموقع</h1><p className="mt-1 text-sm font-bold text-rose-500">إعدادات تشغيلية حقيقية تنعكس على المنصة.</p></div>
      </div>
      <div className="max-w-xl space-y-5 rounded-[28px] border border-rose-100 bg-white p-6 shadow-sm">
        <div><label className="mb-2 block text-sm font-black text-rose-700">اسم الموقع</label><input className="h-13 w-full rounded-2xl border border-rose-200 px-4 font-bold outline-none focus:border-rose-300" value={siteName} onChange={(e) => setSiteName(e.target.value)} /></div>
        <label className="flex items-center justify-between rounded-2xl border border-emerald-100 bg-emerald-50/60 p-4">
          <span className="flex items-center gap-3 text-sm font-black text-emerald-900"><Bot className="h-5 w-5" /> تشغيل مساعدي آدم وحواء</span>
          <input type="checkbox" checked={assistants} onChange={(e) => setAssistants(e.target.checked)} className="h-5 w-5 accent-emerald-600" />
        </label>
        <button disabled={saving || !siteName.trim()} onClick={saveSettings} className="flex h-13 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-l from-rose-600 to-fuchsia-600 font-black text-white shadow-lg disabled:opacity-50"><Save className="h-5 w-5" />{saving ? "جاري الحفظ…" : "حفظ الإعدادات"}</button>
        {saved && <div className="flex items-center gap-2 rounded-2xl border border-emerald-100 bg-emerald-50 p-3 text-sm font-black text-emerald-700"><CheckCircle2 className="h-5 w-5" /> تم حفظ الإعدادات.</div>}
      </div>
    </main>
  );
}
