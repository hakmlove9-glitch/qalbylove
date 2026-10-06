"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { HeartPulse, Search, SlidersHorizontal, Sparkles, X } from "lucide-react";
import MemberShell from "./MemberShell";
import LiveMemberCard from "./LiveMemberCard";

type Mode = "all" | "online" | "new" | "premium" | "founders";

type Props = {
  title: string;
  subtitle: string;
  mode?: Mode;
  initialHealth?: string;
};

const healthOptions = ["سليم والحمد لله", "إعاقة حركية", "إعاقة بصرية", "إعاقة سمعية", "إعاقة في النطق / التخاطب", "مرض مزمن", "السكري", "ضغط الدم", "أمراض القلب", "أمراض الكلى", "أمراض الكبد", "الربو", "الصرع", "حالة صحية أخرى"];

export default function MemberDirectory({ title, subtitle, mode = "all", initialHealth = "" }: Props) {
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    city: "",
    minAge: "",
    maxAge: "",
    health: initialHealth,
  });

  async function load(filterValues = filters) {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams({ mode });
      Object.entries(filterValues).forEach(([key, value]) => value && params.set(key, value));
      const response = await fetch(`/api/search?${params.toString()}`, { cache: "no-store" });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || "تعذر تحميل الأعضاء");
      setMembers(data.members || []);
    } catch (requestError) {
      setMembers([]);
      setError(requestError instanceof Error ? requestError.message : "تعذر تحميل الأعضاء");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, initialHealth]);

  const resultTitle = useMemo(() => {
    if (loading) return "نرتب لك النتائج...";
    if (members.length === 1) return "ملف واحد أمامك";
    return `${members.length} ملفًا أمامك`;
  }, [loading, members.length]);

  const hasFilters = Object.values(filters).some(Boolean);

  function clearFilters() {
    const cleared = { city: "", minAge: "", maxAge: "", health: "" };
    setFilters(cleared);
    void load(cleared);
  }

  return (
    <MemberShell title={title} subtitle={subtitle}>
      <section className="rounded-[28px] border border-rose-100 bg-white p-4 shadow-[0_14px_34px_rgba(70,14,37,.05)]"><div className="mb-3 rounded-2xl bg-emerald-50 px-4 py-3 text-[11px] font-black text-emerald-800">نتائج الزواج تُعرض لك تلقائيًا من الجنس المقابل لحسابك.</div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex min-w-[240px] flex-1 items-center rounded-2xl bg-rose-50 px-4 ring-1 ring-transparent focus-within:ring-rose-200">
            <Search className="h-5 w-5 text-rose-400" />
            <input
              value={filters.city}
              onChange={(event) => setFilters((current) => ({ ...current, city: event.target.value }))}
              onKeyDown={(event) => event.key === "Enter" && load()}
              className="h-12 w-full bg-transparent px-3 text-sm font-bold outline-none"
              placeholder="المدينة أو المحافظة"
              aria-label="البحث حسب المدينة أو المحافظة"
            />
          </div>
          <button
            onClick={() => setAdvancedOpen((value) => !value)}
            className="flex h-12 items-center gap-2 rounded-2xl border border-rose-100 px-4 text-xs font-black text-rose-700 transition hover:bg-rose-50"
          >
            <SlidersHorizontal className="h-4 w-4" />
            بحث أدق
          </button>
          <button onClick={() => void load()} className="h-12 rounded-2xl bg-gradient-to-l from-rose-600 to-pink-500 px-6 text-xs font-black text-white shadow-lg shadow-rose-100">
            اعرض النتائج
          </button>
        </div>

        {advancedOpen && (
          <div className="mt-4 grid gap-3 border-t border-rose-100 pt-4 sm:grid-cols-2 lg:grid-cols-3">
            <Field label="العمر من">
              <input type="number" min="18" max="90" value={filters.minAge} onChange={(event) => setFilters((current) => ({ ...current, minAge: event.target.value }))} />
            </Field>
            <Field label="العمر إلى">
              <input type="number" min="18" max="90" value={filters.maxAge} onChange={(event) => setFilters((current) => ({ ...current, maxAge: event.target.value }))} />
            </Field>
            <Field label="الحالة الصحية">
              <select value={filters.health} onChange={(event) => setFilters((current) => ({ ...current, health: event.target.value }))}>
                <option value="">الكل</option>
                {healthOptions.map((option) => <option key={option}>{option}</option>)}
              </select>
            </Field>
          </div>
        )}
      </section>

      <div className="mt-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <span className="text-xs font-black text-rose-500">اختيارات متجددة</span>
          <h2 className="mt-1 text-2xl font-black">{resultTitle}</h2>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/health-cases" className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-2 text-[11px] font-black text-emerald-700">
            <HeartPulse className="h-3.5 w-3.5" /> الحالات الصحية
          </Link>
          {hasFilters && (
            <button onClick={clearFilters} className="inline-flex items-center gap-1.5 rounded-full bg-rose-100 px-3 py-2 text-[11px] font-black text-rose-600">
              <X className="h-3.5 w-3.5" /> مسح الفلاتر
            </button>
          )}
        </div>
      </div>

      {error ? (
        <div className="mt-5 rounded-[28px] border border-red-100 bg-red-50 p-8 text-center text-sm font-black text-red-700">{error}</div>
      ) : loading ? (
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => <div key={item} className="h-[265px] animate-pulse rounded-[26px] bg-white" />)}
        </div>
      ) : members.length === 0 ? (
        <div className="mt-5 rounded-[28px] border border-rose-100 bg-white p-12 text-center">
          <Sparkles className="mx-auto h-10 w-10 text-rose-300" />
          <div className="mt-3 text-lg font-black">لا توجد نتائج بهذه المعايير حاليًا.</div>
          <p className="mt-2 text-xs font-bold text-rose-600">خفّف شرطًا واحدًا وستظهر لك خيارات أكثر.</p>
        </div>
      ) : (
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {members.map((member, index) => <LiveMemberCard key={member.id} member={member} index={index} />)}
        </div>
      )}
    </MemberShell>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block text-xs font-black text-rose-600">
      <span className="mb-2 block">{label}</span>
      <div className="[&_input]:h-11 [&_input]:w-full [&_input]:rounded-xl [&_input]:border [&_input]:border-rose-200 [&_input]:px-3 [&_input]:outline-none [&_select]:h-11 [&_select]:w-full [&_select]:rounded-xl [&_select]:border [&_select]:border-rose-200 [&_select]:bg-white [&_select]:px-3 [&_select]:outline-none">
        {children}
      </div>
    </label>
  );
}
