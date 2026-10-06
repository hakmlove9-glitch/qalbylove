"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, MessageCircle, Search, ShieldCheck, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import MemberShell from "@/components/member/MemberShell";
import { fallbackAvatar } from "@/lib/avatar-fallback";

type Conversation = {
  memberId: string;
  member: {
    id: string;
    username: string;
    avatar_url?: string | null;
    is_online?: boolean;
  };
  lastMessage: string;
  lastMessageType?: string;
  created_at: string;
  unread: number;
};

export default function MessagesPage() {
  const [rows, setRows] = useState<Conversation[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/messages", { cache: "no-store" })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "تعذر تحميل المحادثات");
        setRows(data.conversations || []);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "تعذر تحميل المحادثات"))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const value = query.trim().toLowerCase();
    if (!value) return rows;
    return rows.filter((row) => row.member.username?.toLowerCase().includes(value));
  }, [rows, query]);

  return (
    <MemberShell title="الرسائل" subtitle="التواصل يبدأ فقط بعد تبادل الاهتمام، ويظل داخل المنصة لحماية خصوصيتكما.">
      <div className="relative overflow-hidden rounded-[34px] border border-rose-100 bg-white/95 shadow-[0_22px_70px_rgba(74,14,38,.08)]">
        <div aria-hidden="true" className="pointer-events-none absolute -left-16 -top-16 h-40 w-40 rounded-full border-[18px] border-amber-100/55" />
        <div aria-hidden="true" className="pointer-events-none absolute -bottom-20 -right-20 h-48 w-48 rounded-full bg-emerald-100/25 blur-3xl" />

        <div className="relative border-b border-rose-100 bg-gradient-to-l from-rose-50/80 via-white to-emerald-50/50 p-5 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2 text-lg font-black text-[#3b0b20]"><MessageCircle className="h-5 w-5 text-rose-600" /> محادثاتك</div>
              <p className="mt-1 text-xs font-bold leading-6 text-rose-500">لا تظهر هنا إلا المحادثات التي أصبحت متاحة بعد اهتمام متبادل حقيقي.</p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-white px-4 py-2 text-[11px] font-black text-emerald-700 shadow-sm">
              <ShieldCheck className="h-4 w-4" /> لا تشارك رقم هاتفك أو ترسل أموالًا
            </div>
          </div>

          <div className="mt-4 flex items-center rounded-2xl border border-rose-200 bg-white px-3 shadow-sm focus-within:border-rose-400">
            <Search className="h-4 w-4 text-rose-400" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} className="h-12 w-full bg-transparent px-3 text-sm font-bold outline-none" aria-label="البحث في المحادثات" placeholder="ابحث باسم العضو" />
          </div>
        </div>

        {error && <div className="m-5 rounded-2xl border border-red-100 bg-red-50 p-4 text-center text-xs font-black text-red-700">{error}</div>}

        <div className="relative p-3 sm:p-4">
          {loading ? (
            <div className="space-y-3">{[1,2,3,4].map((item) => <div key={item} className="h-20 animate-pulse rounded-3xl bg-rose-50" />)}</div>
          ) : filtered.length === 0 ? (
            <div className="py-20 text-center">
              <span className="mx-auto grid h-16 w-16 place-items-center rounded-full border border-amber-200 bg-amber-50 text-amber-700"><Sparkles className="h-6 w-6" /></span>
            <div className="mt-4 text-base font-black text-rose-700">{query ? "ملوش نتيجة البحث دي" : "لسه مفيش رسائل ❤️"}</div>
            <p className="mx-auto mt-2 max-w-md text-xs font-bold leading-6 text-rose-400">{query ? "جرّب اسمًا تانيًا أو امسح كلمة البحث." : "ابدأ بالتعرف على أعضاء مناسبين ليك. هتظهر محادثاتك هنا بعد ما يبقى الاهتمام متبادل."}</p>
            {!query && <Link href="/search" className="mt-4 inline-flex min-h-10 items-center gap-2 rounded-xl bg-rose-600 px-4 py-2 text-xs font-black text-white">اكتشف الأعضاء <ArrowLeft className="h-4 w-4" /></Link>}
            </div>
          ) : (
            <div className="grid gap-2">
              {filtered.map((row) => (
                <Link key={row.memberId} href={`/messages/${row.memberId}`} className="group flex items-center gap-3 rounded-[24px] border border-transparent p-3 transition hover:border-rose-100 hover:bg-rose-50/60">
                  <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-[20px] bg-rose-50 ring-2 ring-white shadow-sm">
                    <Image src={row.member.avatar_url || fallbackAvatar(undefined, undefined, { seed: row.member.id })} alt={row.member.username} fill className="object-cover" sizes="56px" />
                    {row.member.is_online && <span className="absolute bottom-1 right-1 h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-white" aria-label="متواجد الآن" />}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <div className="truncate text-sm font-black text-rose-900">{row.member.username}</div>
                      <div className="shrink-0 text-[10px] font-bold text-rose-400">{new Date(row.created_at).toLocaleDateString("ar-EG")}</div>
                    </div>
                    <div className="mt-1 flex items-center justify-between gap-3">
                      <p className="truncate text-[11px] font-bold text-rose-500">{row.lastMessage}</p>
                      {row.unread > 0 && <span className="grid min-h-6 min-w-6 place-items-center rounded-full bg-rose-600 px-1.5 text-[10px] font-black text-white">{row.unread}</span>}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </MemberShell>
  );
}
