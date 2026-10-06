import Image from "next/image";
import type { ReactNode } from "react";

type Props = {
  src: string;
  alt: string;
  title?: string;
  subtitle?: string;
  badge?: ReactNode;
  footer?: ReactNode;
  aspect?: "portrait" | "landscape" | "square";
  className?: string;
};

const aspectClass = { portrait: "aspect-[4/5]", landscape: "aspect-[16/9]", square: "aspect-square" } as const;

export default function VisualImageCard({ src, alt, title, subtitle, badge, footer, aspect = "portrait", className = "" }: Props) {
  return (
    <article className={`group overflow-hidden rounded-[20px] border border-rose-100 bg-white shadow-[0_12px_32px_rgba(93,15,50,.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(93,15,50,.13)] ${className}`}>
      <div className={`relative overflow-hidden ${aspectClass[aspect]}`}>
        <Image src={src} alt={alt} fill className="object-cover transition duration-500 group-hover:scale-[1.025]" sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 260px" />
        {badge ? <div className="absolute right-2 top-2">{badge}</div> : null}
      </div>
      {(title || subtitle || footer) ? <div className="p-3">
        {title ? <h3 className="font-black text-[#681033]">{title}</h3> : null}
        {subtitle ? <p className="mt-0.5 text-xs font-bold text-rose-500">{subtitle}</p> : null}
        {footer ? <div className="mt-2">{footer}</div> : null}
      </div> : null}
    </article>
  );
}
