"use client";

import { AlertTriangle, ShieldCheck } from "lucide-react";

export default function MemberSafetyNotice({ onReport }: { onReport?: () => void }) {
  return (
    <div className="rounded-[24px] border border-amber-200 bg-gradient-to-l from-amber-50 to-white p-4 shadow-[0_12px_32px_rgba(120,53,15,.05)]">
      <div className="flex items-start gap-3">
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-amber-100 text-amber-700">
          <ShieldCheck className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="font-black text-rose-900">سلامتك أهم من أي تعارف</div>
          <p className="mt-1 text-xs font-bold leading-6 text-rose-600">
            لا ترسل أموالًا أو بيانات مالية لأي عضو. إذا طلب منك أحد المال، أو حاول ابتزازك أو الضغط عليك، أوقف التواصل وأبلغ الإدارة فورًا.
          </p>
        </div>
        {onReport && (
          <button
            type="button"
            onClick={onReport}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-amber-200 bg-white px-3 py-2 text-[11px] font-black text-amber-800 transition hover:bg-amber-100"
          >
            <AlertTriangle className="h-3.5 w-3.5" />
            إبلاغ سريع
          </button>
        )}
      </div>
    </div>
  );
}
