import Link from "next/link";
import { Heart, Mail, ShieldCheck } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-14 overflow-hidden bg-[linear-gradient(135deg,#350819,#4d0a25_52%,#350819)] text-white" dir="rtl">
      <div className="ql-container py-12">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-3">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white/10 text-[#ff91b1] ring-1 ring-white/10"><Heart className="h-6 w-6" fill="currentColor" /></span>
              <div><div className="text-2xl font-black">قلبي لوڤي</div><div className="text-xs font-bold text-[#f4a9bf]">حيث تبدأ حياة أجمل</div></div>
            </div>
            <p className="mt-4 max-w-xs text-sm font-bold leading-7 text-white/68">منصة زواج جاد بأسلوب محترم ومنظم، خصوصية أوضح وخطوات أبسط للوصول إلى شريك مناسب.</p>
          </div>
          <div><h4 className="text-base font-black text-[#ffb4ca]">روابط سريعة</h4><div className="mt-4 space-y-3 text-sm font-bold text-white/72"><Link className="block hover:text-white" href="/">الرئيسية</Link><Link className="block hover:text-white" href="/search">اكتشف الأعضاء</Link><Link className="block hover:text-white" href="/stories">قصص النجاح</Link><Link className="block hover:text-white" href="/founders">المؤسسون</Link></div></div>
          <div><h4 className="text-base font-black text-[#ffb4ca]">مساعدة ودعم</h4><div className="mt-4 space-y-3 text-sm font-bold text-white/72"><Link className="block hover:text-white" href="/help">مركز المساعدة</Link><Link className="block hover:text-white" href="/safety-center">مركز الأمان</Link><Link className="block hover:text-white" href="/terms">شروط الاستخدام</Link><Link className="block hover:text-white" href="/privacy">سياسة الخصوصية</Link><Link className="block hover:text-white" href="/ethics">ميثاق السلوك</Link></div></div>
          <div>
            <h4 className="text-base font-black text-[#ffb4ca]">تواصل معنا</h4>
            <p className="mt-3 text-sm font-bold leading-6 text-white/65">لو محتاج مساعدة أو عندك استفسار، صفحة التواصل توصلك مباشرة للقسم المناسب.</p>
            <Link href="/contact" className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-black text-[#64102f] shadow-lg transition hover:-translate-y-0.5">
              <Mail className="h-4 w-4" /> اتصل بنا
            </Link>
            <div className="mt-4 flex items-center gap-2 text-xs font-bold text-white/60"><ShieldCheck className="h-4 w-4 text-emerald-300" />خصوصيتك جزء أساسي من التواصل.</div>
          </div>
        </div>
        <div className="mt-10 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs font-bold text-white/45 sm:flex-row sm:items-center sm:justify-between"><span>جميع الحقوق محفوظة © 2026 قلبي لوڤي</span><Link href="/contact" className="inline-flex items-center gap-2 hover:text-white"><Mail className="h-4 w-4" />تواصل معنا</Link></div>
      </div>
    </footer>
  );
}
