import type { ReactNode } from "react";

type Props = {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
};

export default function VisualSection({ eyebrow, title, description, action, children, className = "" }: Props) {
  return (
    <section className={`rounded-[28px] border border-rose-100 bg-white/90 p-4 shadow-[0_18px_50px_rgba(117,20,60,.08)] backdrop-blur-sm sm:p-6 ${className}`}>
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          {eyebrow ? <div className="mb-1 text-[10px] font-black text-rose-500">{eyebrow}</div> : null}
          <h2 className="text-xl font-black text-[#681033] sm:text-2xl">{title}</h2>
          {description ? <p className="mt-1 max-w-2xl text-xs font-bold leading-6 text-rose-500 sm:text-sm">{description}</p> : null}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}
