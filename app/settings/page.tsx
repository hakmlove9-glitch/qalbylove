"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Bell, Eye, EyeOff, Footprints, MessageCircle, Save, ShieldCheck, Sparkles } from "lucide-react";
import MemberShell from "@/components/member/MemberShell";

type Settings = {
  show_profile: boolean;
  allow_messages: boolean;
  hide_last_seen: boolean;
  hide_profile_views: boolean;
};

const defaults: Settings = {
  show_profile: true,
  allow_messages: true,
  hide_last_seen: false,
  hide_profile_views: false,
};

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>(defaults);
  const [canHiddenLogin, setCanHiddenLogin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/settings", { cache: "no-store" })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "تعذر تحميل الإعدادات");
        setSettings({ ...defaults, ...(data.settings || {}) });
        setCanHiddenLogin(Boolean(data.capabilities?.hidden_login));
      })
      .catch((error) => setMessage(error instanceof Error ? error.message : "تعذر تحميل الإعدادات"))
      .finally(() => setLoading(false));
  }, []);

  async function saveSettings() {
    setSaving(true);
    setMessage("");
    try {
      const response = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "تعذر حفظ الإعدادات");
      setSettings({ ...defaults, ...(data.settings || settings) });
      setMessage("تم حفظ اختيارات الخصوصية.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "تعذر حفظ الإعدادات");
    } finally {
      setSaving(false);
    }
  }

  return (
    <MemberShell title="الخصوصية والإعدادات" subtitle="اختيارات واضحة، من غير إعدادات مخفية ولا وعود شكلية.">
      <div id="visibility" className="grid gap-5 lg:grid-cols-[1fr_340px]">
        <section className="ql-page-card p-5 md:p-6">
          {loading ? (
            <div className="py-16 text-center text-sm font-black text-rose-400">جاري تحميل اختياراتك...</div>
          ) : (
            <>
              <SettingRow
                icon={settings.show_profile ? <Eye /> : <EyeOff />}
                title="إظهار الملف الشخصي"
                text="لو أوقفته، ملفك لن يظهر في البحث أو قوائم الأعضاء حتى تعيده بنفسك."
                checked={settings.show_profile}
                onChange={(value) => setSettings((current) => ({ ...current, show_profile: value }))}
              />
              <SettingRow
                icon={<MessageCircle />}
                title="استقبال الرسائل بعد الاهتمام المتبادل"
                text="إيقافها يمنع رسائل جديدة مؤقتًا، لكنه لا يلغي حسابك ولا اهتماماتك."
                checked={settings.allow_messages}
                onChange={(value) => setSettings((current) => ({ ...current, allow_messages: value }))}
              />
              <SettingRow
                icon={<EyeOff />}
                title="إخفاء آخر ظهور"
                text="يظل حسابك يعمل طبيعيًا، لكن وقت آخر نشاط لا يظهر للأعضاء."
                checked={settings.hide_last_seen}
                onChange={(value) => setSettings((current) => ({ ...current, hide_last_seen: value }))}
              />
              <SettingRow
                icon={<Footprints />}
                title="التصفح الخفي"
                text={canHiddenLogin ? "زياراتك الجديدة للملفات لن تُسجل عند تشغيل الخيار." : "ميزة متاحة للمؤسسين وللعضويات التي تشمل الدخول المتخفي."}
                checked={canHiddenLogin && settings.hide_profile_views}
                disabled={!canHiddenLogin}
                accent="gold"
                onChange={(value) => setSettings((current) => ({ ...current, hide_profile_views: value }))}
              />

              {message && <div className="mt-4 rounded-2xl border border-emerald-100 bg-emerald-50 p-3 text-xs font-black text-emerald-800">{message}</div>}
              <button onClick={() => void saveSettings()} disabled={saving} className="ql-btn-primary mt-5 w-full disabled:opacity-60">
                <Save className="h-4 w-4" /> {saving ? "جاري الحفظ..." : "حفظ الإعدادات"}
              </button>
            </>
          )}
        </section>

        <aside className="space-y-4">
          <div className="overflow-hidden rounded-[30px] border border-amber-200 bg-gradient-to-br from-[#fffdf6] via-white to-[#fff3df] p-6 shadow-[0_20px_55px_rgba(120,78,18,.10)]">
            <span className="grid h-12 w-12 place-items-center rounded-2xl border border-amber-200 bg-white text-amber-700 shadow-sm"><ShieldCheck className="h-6 w-6" /></span>
            <h2 className="mt-4 text-xl font-black text-[#4b2b10]">خصوصيتك لها معنى</h2>
            <p className="mt-2 text-xs font-bold leading-6 text-rose-600">إخفاء ملفك أو آخر ظهورك لا يغيّر بياناتك ولا يحذفها. أنت من يعيد تشغيل الظهور وقتما تريد.</p>
          </div>
          <div className="rounded-[28px] border border-emerald-100 bg-emerald-50/70 p-5">
            <div className="flex items-center gap-2 text-emerald-800"><Sparkles className="h-4 w-4" /><span className="text-sm font-black">صورك لها خصوصية منفصلة</span></div>
            <p className="mt-2 text-[11px] font-bold leading-6 text-emerald-900/70">تقدر تحدد من يشوف صورك من صفحة الصور، بدون ما تضطر تخفي ملفك كله.</p>
            <Link href="/photos" className="mt-4 inline-flex rounded-xl bg-white px-4 py-2.5 text-xs font-black text-emerald-800 shadow-sm">إدارة خصوصية الصور</Link>
          </div>
          <Link href="/notifications" className="flex items-center justify-between rounded-[24px] border border-rose-100 bg-white p-4 font-black text-[#4a0d2b] shadow-sm">
            <span className="flex items-center gap-2"><Bell className="h-4 w-4 text-rose-600" />الإشعارات</span><span className="text-rose-400">←</span>
          </Link>
        </aside>
      </div>
    </MemberShell>
  );
}

function SettingRow({ icon, title, text, checked, onChange, disabled = false, accent = "rose" }: { icon: React.ReactNode; title: string; text: string; checked: boolean; onChange: (value: boolean) => void; disabled?: boolean; accent?: "rose" | "gold" }) {
  const active = accent === "gold" ? "bg-amber-500" : "bg-rose-600";
  const iconClass = accent === "gold" ? "border-amber-100 bg-amber-50 text-amber-700" : "border-rose-100 bg-rose-50 text-rose-600";
  return (
    <div className={`mb-3 flex items-center justify-between gap-4 rounded-[24px] border p-4 last:mb-0 ${disabled ? "border-rose-100 bg-rose-50/80" : "border-rose-100 bg-[#fffafb]"}`}>
      <div className="flex items-center gap-3">
        <span className={`grid h-11 w-11 place-items-center rounded-2xl border [&>svg]:h-5 [&>svg]:w-5 ${iconClass}`}>{icon}</span>
        <div><h3 className="text-sm font-black text-[#3a0c20]">{title}</h3><p className="mt-1 max-w-xl text-[11px] font-bold leading-5 text-rose-500">{text}</p></div>
      </div>
      <button type="button" disabled={disabled} aria-pressed={checked} aria-label={title} onClick={() => onChange(!checked)} className={`relative h-7 w-12 shrink-0 rounded-full transition disabled:cursor-not-allowed disabled:opacity-40 ${checked ? active : "bg-rose-300"}`}>
        <span className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition ${checked ? "right-6" : "right-1"}`} />
      </button>
    </div>
  );
}
