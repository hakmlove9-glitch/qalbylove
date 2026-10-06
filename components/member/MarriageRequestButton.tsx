"use client";

import { HeartHandshake } from "lucide-react";
import { useState } from "react";

export default function MarriageRequestButton({ memberId }: { memberId: string }) {
    const [sent, setSent] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    async function sendRequest() {
        if (loading || sent) return;
        setLoading(true);
        setMessage("");
        try {
            const response = await fetch("/api/member-requests", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ receiver_id: memberId }),
            });
            const data = await response.json().catch(() => ({}));
            if (!response.ok) throw new Error(data.error || "تعذر إرسال الطلب");
            setSent(true);
            setMessage(data.message || "تم إرسال طلب الزواج الجاد.");
        } catch (error) {
            setMessage(error instanceof Error ? error.message : "تعذر إرسال الطلب");
        } finally {
            setLoading(false);
        }
    }

    return <div>
        <button type="button" onClick={() => void sendRequest()} disabled={loading || sent} className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2 text-[11px] font-black text-amber-800 transition hover:bg-amber-100 disabled:opacity-60">
            <HeartHandshake className="h-4 w-4" /> {sent ? "تم إرسال الطلب" : loading ? "جاري الإرسال..." : "طلب زواج جاد"}
        </button>
        {message && <p className="mt-2 text-[10px] font-bold text-rose-600" role="status">{message}</p>}
    </div>;
}