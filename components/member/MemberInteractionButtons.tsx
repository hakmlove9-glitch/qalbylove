"use client";

import { Ban, Heart, MessageCircle, ShieldAlert, UserMinus } from "lucide-react";
import { useEffect, useState } from "react";

export type InteractionState = {
  interested: boolean;
  favorite: boolean;
  blocked: boolean;
  mutual: boolean;
};

export default function MemberInteractionButtons({
  memberId,
  memberName,
  initial,
  onReport,
  authenticated = true,
}: {
  memberId: string;
  memberName: string;
  initial?: Partial<InteractionState>;
  onReport: () => void;
  authenticated?: boolean;
}) {
  const [state, setState] = useState<InteractionState>({
    interested: Boolean(initial?.interested),
    favorite: Boolean(initial?.favorite),
    blocked: Boolean(initial?.blocked),
    mutual: Boolean(initial?.mutual),
  });
  const [busy, setBusy] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  function goSignup() {
    window.location.href = `/signup?next=${encodeURIComponent(`/member/${memberId}`)}`;
  }

  function requireSignup(response: Response) {
    if (response.status !== 401) return false;
    goSignup();
    return true;
  }

  useEffect(() => {
    if (initial) return;
    fetch(`/api/interactions/status?member_id=${encodeURIComponent(memberId)}`, { cache: "no-store" })
      .then((response) => response.json())
      .then((data) => data?.state && setState(data.state))
      .catch(() => undefined);
  }, [initial, memberId]);

  async function toggleInterest() {
    if (!authenticated) { goSignup(); return; }
    setBusy("interest");
    setMessage("");
    try {
      if (state.interested) {
        setMessage("تم إرسال اهتمامك لهذا العضو بالفعل.");
        return;
      }
      const response = await fetch("/api/interests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ receiver_id: memberId }),
      });
      if (requireSignup(response)) return;
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || "تعذر إرسال الاهتمام");
      const statusResponse = await fetch(`/api/interactions/status?member_id=${encodeURIComponent(memberId)}`, { cache: "no-store" });
      const statusData = statusResponse.ok ? await statusResponse.json() : null;
      setState((current) => ({ ...current, interested: true, mutual: Boolean(statusData?.state?.mutual) }));
      setMessage(data?.message || "تم إرسال الاهتمام.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "تعذر إرسال الاهتمام");
    } finally {
      setBusy(null);
    }
  }

  async function toggleFavorite() {
    if (!authenticated) { goSignup(); return; }
    setBusy("favorite");
    setMessage("");
    try {
      const response = await fetch("/api/favorites", {
        method: state.favorite ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ favorite_id: memberId }),
      });
      if (requireSignup(response)) return;
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || "تعذر تحديث قائمة الاهتمام");
      setState((current) => ({ ...current, favorite: !current.favorite }));
      setMessage(data?.message || "تم تحديث قائمة الاهتمام.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "تعذر تحديث قائمة الاهتمام");
    } finally {
      setBusy(null);
    }
  }

  async function toggleBlock() {
    if (!authenticated) { goSignup(); return; }
    const prompt = state.blocked ? "هل تريد إلغاء حظر هذا العضو؟" : "هل تريد حظر هذا العضو ومنعه من التواصل معك؟";
    if (!window.confirm(prompt)) return;
    setBusy("block");
    setMessage("");
    try {
      const response = await fetch("/api/blocks", {
        method: state.blocked ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ blocked_id: memberId }),
      });
      if (requireSignup(response)) return;
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || "تعذر تحديث قائمة الحظر");
      setState((current) => ({ ...current, blocked: !current.blocked }));
      setMessage(data?.message || "تم تحديث قائمة الحظر.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "تعذر تحديث قائمة التجاهل");
    } finally {
      setBusy(null);
    }
  }

  return (
    <div>
      <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
        <button
          type="button"
          disabled={busy === "interest" || state.blocked}
          onClick={toggleInterest}
          className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl px-4 text-xs font-black transition ${state.interested ? "bg-rose-600 text-white shadow-lg shadow-rose-100" : "border border-rose-200 bg-white text-rose-700 hover:bg-rose-50"}`}
        >
          <Heart className={`h-4 w-4 ${state.interested ? "animate-pulse" : ""}`} fill={state.interested ? "currentColor" : "none"} />
          {state.interested ? "تم الاهتمام" : "إرسال اهتمام"}
        </button>

        <button
          type="button"
          disabled={authenticated && (!state.mutual || state.blocked)}
          onClick={() => {
            if (!authenticated) { goSignup(); return; }
            if (state.mutual) window.dispatchEvent(new CustomEvent("qalbylove:open-chat", { detail: { memberId, memberName } }));
          }}
          title={!authenticated ? "أنشئ حسابك المجاني للتفاعل" : state.mutual ? "فتح المحادثة" : "الرسائل متاحة بعد الاهتمام المتبادل"}
          className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl px-4 text-xs font-black transition ${!authenticated ? "border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100" : state.mutual && !state.blocked ? "bg-emerald-500 text-white shadow-lg shadow-emerald-100 hover:bg-emerald-600" : "cursor-not-allowed border border-rose-200 bg-rose-100 text-rose-400"}`}
        >
          <MessageCircle className="h-4 w-4" />
          {!authenticated ? "رسالة" : state.mutual ? "رسالة" : "بعد التوافق"}
        </button>

        <button type="button" disabled={busy === "favorite" || state.blocked} onClick={toggleFavorite} className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl border px-4 text-xs font-black transition ${state.favorite ? "border-pink-200 bg-pink-50 text-pink-700" : "border-rose-200 bg-white text-rose-600 hover:bg-rose-50"}`}>
          <UserMinus className="h-4 w-4" />
          {state.favorite ? "في قائمة الاهتمام" : "أضف لقائمة الاهتمام"}
        </button>

        <button type="button" disabled={busy === "block"} onClick={toggleBlock} className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl border px-4 text-xs font-black transition ${state.blocked ? "border-rose-800 bg-rose-800 text-white" : "border-rose-200 bg-white text-rose-600 hover:bg-rose-50"}`}>
          <Ban className="h-4 w-4" />
          {state.blocked ? "إلغاء الحظر" : "حظر العضو"}
        </button>

        <button type="button" onClick={() => authenticated ? onReport() : goSignup()} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl border border-amber-200 bg-amber-50 px-4 text-xs font-black text-amber-800 transition hover:bg-amber-100">
          <ShieldAlert className="h-4 w-4" />
          إبلاغ
        </button>
      </div>
      {!authenticated ? <div className="mt-3 rounded-2xl bg-emerald-50 px-4 py-3 text-xs font-black text-emerald-700">يمكنك مشاهدة الملف كاملًا بدون تسجيل. أنشئ حسابك المجاني فقط عندما تريد إرسال اهتمام أو رسالة أو إبلاغ.</div> : state.mutual ? <div className="mt-3 rounded-2xl bg-emerald-50 px-4 py-3 text-xs font-black text-emerald-700">يوجد توافق اهتمام بينكما. تم فتح الرسائل النصية والصوتية بينكما.</div> : <div className="mt-3 rounded-2xl bg-amber-50 px-4 py-3 text-xs font-black text-amber-800">المحادثة مغلقة حتى يصبح الاهتمام متبادلًا؛ لا يمكن إرسال رسالة قبل ذلك.</div>}
      {message && <div className="mt-3 text-xs font-black text-rose-500">{message}</div>}
    </div>
  );
}
