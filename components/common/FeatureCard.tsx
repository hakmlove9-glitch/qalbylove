import type { ReactNode } from "react";

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  accent?: string;
}

export default function FeatureCard({ icon, title, description, accent = "منصة أكثر راحة" }: FeatureCardProps) {
  return (
    <article className="group relative overflow-hidden rounded-[28px] border border-rose-100 bg-white p-6 shadow-[0_18px_55px_rgba(104,23,56,.06)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(104,23,56,.10)]">
      <div className="absolute -left-10 -top-10 h-28 w-28 rounded-full bg-rose-50 transition group-hover:scale-125" />
      <div className="relative">
        <div className="flex items-start justify-between gap-4">
          <div className="grid h-12 w-12 place-items-center rounded-2xl border border-rose-100 bg-rose-50 text-rose-600">{icon}</div>
          <span className="rounded-full bg-[#fff6f9] px-3 py-1 text-[10px] font-black text-rose-500">{accent}</span>
        </div>
        <h3 className="mt-6 text-xl font-black text-[#35101f]">{title}</h3>
        <p className="mt-3 text-sm font-semibold leading-7 text-rose-600">{description}</p>
        <div className="mt-6 h-0.5 w-10 rounded-full bg-gradient-to-l from-rose-500 to-pink-300 transition-all duration-300 group-hover:w-16" />
      </div>
    </article>
  );
}
