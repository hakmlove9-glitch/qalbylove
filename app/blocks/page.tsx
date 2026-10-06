"use client";

import { useEffect, useState } from "react";
import { ShieldOff, UserX } from "lucide-react";
import MemberShell from "@/components/member/MemberShell";

type Block = {
  id: string;
  blocker_id: string;
  blocked_id: string;
  created_at: string | null;
  member?: { id: string; username: string } | null;
};

export default function BlocksPage() {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => { void loadBlocks(); }, []);

  async function loadBlocks() {
    try {
      const res = await fetch("/api/blocks", { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "تعذر تحميل قائمة الحظر");
      setBlocks(data.blocks || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "تعذر تحميل قائمة الحظر");
    } finally {
      setLoading(false);
    }
  }

  async function unblock(memberId: string) {
    try {
      const res = await fetch("/api/blocks", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ blocked_id: memberId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "تعذر إلغاء الحظر");
      setBlocks((current) => current.filter((block) => block.blocked_id !== memberId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "تعذر إلغاء الحظر");
    }
  }

  return (
    <MemberShell title="قائمة الحظر" subtitle="الأعضاء الموجودون هنا لا يمكنهم التواصل معك. يمكنك إلغاء الحظر في أي وقت.">
      {error && <div className="mb-4 rounded-2xl border border-red-100 bg-red-50 p-4 text-xs font-black text-red-700">{error}</div>}
      <section className="ql-page-card p-5">
        {loading ? (
          <div className="py-14 text-center text-sm font-black text-rose-400">جاري تحميل القائمة...</div>
        ) : blocks.length === 0 ? (
          <div className="py-14 text-center">
            <ShieldOff className="mx-auto h-10 w-10 text-rose-200" />
            <h2 className="mt-4 text-xl font-black text-[#3a0c20]">لا يوجد أعضاء محظورون</h2>
            <p className="mt-2 text-sm font-bold text-rose-500">لو حظرت عضوًا سيظهر هنا ويمكنك التراجع لاحقًا.</p>
          </div>
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {blocks.map((block) => (
              <div key={block.id} className="flex items-center justify-between gap-3 rounded-2xl border border-rose-100 bg-[#fffafb] p-4">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-2xl bg-rose-50 text-rose-600"><UserX className="h-5 w-5"/></span>
                  <div>
                    <div className="text-sm font-black text-[#3a0c20]">{block.member?.username || "عضو محظور"}</div>
                    <div className="mt-1 text-[10px] font-bold text-rose-400">{block.created_at ? new Date(block.created_at).toLocaleDateString("ar-EG") : ""}</div>
                  </div>
                </div>
                <button onClick={() => void unblock(block.blocked_id)} className="rounded-xl bg-white px-3 py-2 text-[10px] font-black text-rose-700 ring-1 ring-rose-100">إلغاء الحظر</button>
              </div>
            ))}
          </div>
        )}
      </section>
    </MemberShell>
  );
}
