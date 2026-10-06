import Link from "next/link";
import { MessageCircle, ShieldCheck } from "lucide-react";
import { SUPPORT_WHATSAPP_MESSAGE, SUPPORT_WHATSAPP_PHONE } from "@/lib/constants";

export default function ContactPage() {
  const message = encodeURIComponent(SUPPORT_WHATSAPP_MESSAGE);

  return <main dir="rtl" className="mx-auto min-h-[65vh] max-w-5xl px-4 py-10 sm:px-6 sm:py-16">
    <section className="overflow-hidden rounded-[24px] border border-rose-100 bg-white shadow-[0_18px_48px_rgba(76,12,40,.07)]">
      <div className="bg-gradient-to-l from-[#4d0b28] to-[#a7154d] p-6 text-white sm:p-9"><MessageCircle className="h-8 w-8 text-rose-200" /><h1 className="mt-4 text-3xl font-black">اتصل بنا</h1><p className="mt-2 text-sm font-bold leading-7 text-rose-100">فريق قلبي لوڤي جاهز يساعدك في الحساب أو الاستخدام أو التفعيل.</p></div>
      <div className="p-6 sm:p-9"><p className="text-sm font-bold leading-7 text-rose-700">تواصل معنا عبر واتساب برسالة مباشرة. لا ترسل كلمة مرورك أو بيانات محفظتك في المحادثة.</p><Link href={`https://wa.me/${SUPPORT_WHATSAPP_PHONE}?text=${message}`} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex min-h-12 items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-black text-white shadow-sm"><MessageCircle className="h-5 w-5" />محادثة واتساب</Link><div className="mt-5 flex items-start gap-2 rounded-xl bg-amber-50 p-3 text-[10px] font-bold leading-5 text-amber-800"><ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />لا تشارك كلمات المرور أو أكواد التفعيل أو بيانات الدفع مع أي شخص.</div><Link href="/help" className="mt-5 inline-block text-xs font-black text-rose-700">مركز المساعدة</Link></div>
    </section>
  </main>;
}