"use client";

import { Ban, Heart, Sparkles, Users, UserRoundCheck } from "lucide-react";
import { useEffect, useState } from "react";
import MemberShell from "./MemberShell";
import MemberProfileModal from "./MemberProfileModal";

type Kind = "interests" | "matches" | "blocks" | "views";

const config = {
  interests: { title: "من يهتم بي", subtitle: "أشخاص أرسلوا لك اهتمامًا. خذ وقتك قبل قبول أي تواصل.", icon: Heart, endpoint: "/api/interests", key: "interests", personKey: "sender" },
  matches: { title: "توافق الاهتمام", subtitle: "أعضاء أصبح الاهتمام بينكم متبادلًا.", icon: UserRoundCheck, endpoint: "/api/matches", key: "matches", personKey: "member" },
  blocks: { title: "قائمة التجاهل", subtitle: "الحسابات التي اخترت ألا تظهر لك أو تتواصل معك.", icon: Ban, endpoint: "/api/blocks", key: "blocks", personKey: "member" },
  views: { title: "من زار بياناتي", subtitle: "آخر الأعضاء الذين شاهدوا ملفك الشخصي.", icon: Users, endpoint: "/api/profile-view", key: "views", personKey: "viewer" },
} as const;

export default function RelationshipListPage({ kind }: { kind: Kind }) {
  const itemConfig = config[kind];
  const Icon = itemConfig.icon;
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    fetch(itemConfig.endpoint, { cache: "no-store" })
      .then((response) => response.json())
      .then((data) => setRows(data?.[itemConfig.key] || []))
      .finally(() => setLoading(false));
  }, [itemConfig.endpoint, itemConfig.key]);

  async function acceptInterest(row: any) {
    const response = await fetch("/api/interests", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: row.id, status: "accepted" }) });
    if (response.ok) setRows((current) => current.map((item) => item.id === row.id ? { ...item, status: "accepted" } : item));
  }

  async function removeBlock(row: any) {
    const id = row.blocked_id || row.member?.id;
    if (!id) return;
    const response = await fetch("/api/blocks", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ blocked_id: id }) });
    if (response.ok) setRows((current) => current.filter((item) => item.id !== row.id));
  }

  return (
    <MemberShell title={itemConfig.title} subtitle={itemConfig.subtitle}>
      <section className="overflow-hidden rounded-[30px] border border-rose-100 bg-white shadow-[0_16px_42px_rgba(70,14,37,.06)]">
        <div className="flex items-center gap-3 border-b border-rose-50 bg-gradient-to-l from-rose-50/80 to-white px-5 py-4">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-white text-rose-600 shadow-sm"><Icon className="h-5 w-5" /></div>
          <div><div className="font-black text-rose-900">{itemConfig.title}</div><div className="mt-0.5 text-[11px] font-bold text-rose-400">كل شيء واضح وقابل للتصرف من نفس المكان.</div></div>
        </div>

        {loading ? (
          <div className="space-y-3 p-5">{[1,2,3,4].map((item) => <div key={item} className="h-20 animate-pulse rounded-2xl bg-rose-100" />)}</div>
        ) : rows.length === 0 ? (
          <div className="p-12 text-center"><Sparkles className="mx-auto h-9 w-9 text-rose-300" /><div className="mt-3 text-lg font-black">لا توجد عناصر هنا حتى الآن</div><p className="mt-2 text-xs font-bold text-rose-400">سنحدّث هذه القائمة تلقائيًا عندما يحدث نشاط جديد.</p></div>
        ) : (
          <div className="divide-y divide-slate-100">
            {rows.map((row) => {
              const person = row[itemConfig.personKey] || {};
              const personId = person.id || row.sender_id || row.viewer_id || row.blocked_id;
              return (
                <div key={row.id} className="flex flex-wrap items-center gap-3 px-5 py-4 transition hover:bg-rose-50/30">
                  <button type="button" onClick={() => personId && setSelected(personId)} className="min-w-0 flex-1 text-right">
                    <div className="text-sm font-black text-rose-900">{person.username || "عضو قلبي لوڤي"}</div>
                    <div className="mt-1 text-[11px] font-bold text-rose-400">{row.created_at ? new Date(row.created_at).toLocaleDateString("ar-EG") : "نشاط حديث"}</div>
                  </button>
                  {kind === "interests" && row.status !== "accepted" && <button onClick={() => acceptInterest(row)} className="rounded-xl bg-rose-600 px-4 py-2 text-[11px] font-black text-white">قبول الاهتمام</button>}
                  {kind === "interests" && row.status === "accepted" && <span className="rounded-full bg-emerald-50 px-3 py-2 text-[10px] font-black text-emerald-700">تم القبول</span>}
                  {kind === "blocks" && <button onClick={() => removeBlock(row)} className="rounded-xl border border-rose-200 px-4 py-2 text-[11px] font-black text-rose-600">إلغاء التجاهل</button>}
                  {kind !== "blocks" && <button type="button" onClick={() => personId && setSelected(personId)} className="rounded-xl border border-rose-100 px-4 py-2 text-[11px] font-black text-rose-700">فتح الملف</button>}
                </div>
              );
            })}
          </div>
        )}
      </section>
      <MemberProfileModal memberId={selected} open={Boolean(selected)} onClose={() => setSelected(null)} />
    </MemberShell>
  );
}
