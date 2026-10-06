import { Crown } from "lucide-react";

interface FounderBadgeProps {
  isFounder: boolean;
  memberNumber?: number | null;
  compact?: boolean;
}

export default function FounderBadge({ isFounder, memberNumber, compact = false }: FounderBadgeProps) {
  if (!isFounder) return null;
  return (
    <span
      title="عضو مؤسس في قلبي لوڤي"
      className={`inline-flex items-center gap-1.5 rounded-full border border-amber-300 bg-gradient-to-l from-[#f3cf73] via-[#d79b37] to-[#b87333] font-black text-[#4c2a09] shadow-[0_6px_18px_rgba(184,115,51,.18)] ${compact ? "px-2 py-1 text-[9px]" : "px-3 py-1.5 text-[11px]"}`}
    >
      <Crown className={compact ? "h-3 w-3" : "h-3.5 w-3.5"} />
      مؤسس{memberNumber ? ` #${memberNumber}` : ""}
    </span>
  );
}
