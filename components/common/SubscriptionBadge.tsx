"use client";

import { Crown, Diamond, Gem, Medal, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type Subscription = { plan_name: string | null; end_date: string | null; is_premium: boolean | null };

type Props = { memberId: string };

const levels = [
  { match: /ملكي|royal/i, label: "عضو ملكي", cls: "from-fuchsia-600 to-violet-600 text-white", Icon: Crown },
  { match: /ماسي|diamond/i, label: "عضو ماسي", cls: "from-cyan-500 to-sky-600 text-white", Icon: Diamond },
  { match: /ذهبي|gold/i, label: "عضو ذهبي", cls: "from-amber-300 to-yellow-500 text-amber-950", Icon: Crown },
  { match: /فضي|silver/i, label: "عضو فضي", cls: "from-slate-200 to-slate-400 text-slate-800", Icon: Medal },
] as const;

export default function SubscriptionBadge({ memberId }: Props) {
  const [subscription, setSubscription] = useState<Subscription | null>(null);

  useEffect(() => {
    if (!memberId) return;
    fetch(`/api/subscriptions?member_id=${encodeURIComponent(memberId)}`, { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setSubscription(data?.subscription || null))
      .catch(() => undefined);
  }, [memberId]);

  const level = useMemo(() => {
    const name = subscription?.plan_name || "";
    return levels.find((item) => item.match.test(name));
  }, [subscription?.plan_name]);

  if (!subscription) return null;
  if (subscription.end_date && new Date(subscription.end_date).getTime() < Date.now()) return null;

  const Icon = level?.Icon || (subscription.is_premium ? Gem : Sparkles);
  const label = level?.label || subscription.plan_name || "عضوية مميزة";
  const cls = level?.cls || "from-rose-500 to-pink-600 text-white";

  return (
    <span dir="rtl" className={`inline-flex items-center gap-1.5 rounded-full bg-gradient-to-l px-3 py-1.5 text-[11px] font-black shadow-sm ${cls}`}>
      <Icon className="h-3.5 w-3.5" />
      {label}
    </span>
  );
}
