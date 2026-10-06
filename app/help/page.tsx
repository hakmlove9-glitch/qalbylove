import Footer from "@/components/shared/Footer";
import Link from "next/link";
import { AlertTriangle, Flag, LockKeyhole, ShieldCheck, UserRound, MessageCircle, Heart, CreditCard, KeyRound, RotateCcw } from "lucide-react";

export default function HelpPage() {
  return (
    <main dir="rtl" className="min-h-screen">
      <section className="ql-container py-10 md:py-14">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <span className="ql-kicker"><ShieldCheck className="h-4 w-4" />المساعدة والأمان</span>
            <h1 className="mt-4 ql-section-title">خليك مطمّن… وخلي كل خطوة داخل المنصة.</h1>
            <p className="mx-auto mt-3 max-w-2xl ql-muted">لو حصل موقف مقلق، وقف التواصل واستخدم أدوات الحظر والإبلاغ فورًا.</p>
          </div>
          <div className="mt-7 grid gap-4 md:grid-cols-3">
            <Card icon={<AlertTriangle />} title="لا ترسل أموالًا" text="قلبي لوڤي لا يطلب منك تحويل أموال لأي عضو. أي طلب مالي من شخص داخل المنصة يستحق الحذر والإبلاغ." />
            <Card icon={<Flag />} title="بلّغ بسرعة" text="لو واجهت إساءة، ابتزاز، حسابًا مشبوهًا أو محاولة ضغط، أرسل بلاغًا للإدارة من ملف العضو." />
            <Card icon={<LockKeyhole />} title="احمِ خصوصيتك" text="لا تشارك كلمات المرور أو بياناتك الحساسة. استخدم إعدادات الصور والرسائل بما يناسبك." />
          </div>
          <section className="mt-8 rounded-[24px] border border-rose-100 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-black text-rose-950">مساعدة حسب موضوعك</h2>
            <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              <HelpLink href="/signup" icon={<UserRound />} title="التسجيل" />
              <HelpLink href="/myaccount" icon={<UserRound />} title="الحساب والملف" />
              <HelpLink href="/messages" icon={<MessageCircle />} title="الرسائل" />
              <HelpLink href="/who-likes-me" icon={<Heart />} title="الاهتمام والتطابق" />
              <HelpLink href="/blocks" icon={<ShieldCheck />} title="الحظر" />
              <HelpLink href="/subscriptions" icon={<CreditCard />} title="الاشتراك والتحويل" />
              <HelpLink href="/subscriptions#activation" icon={<KeyRound />} title="كود التفعيل" />
              <HelpLink href="/forgot-password" icon={<RotateCcw />} title="استعادة كلمة المرور" />
              <HelpLink href="/safety-center" icon={<Flag />} title="الإبلاغ والأمان" />
            </div>
          </section>
        </div>
      </section>
      <Footer />
    </main>
  );
}
function Card({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) { return <article className="ql-card p-6"><span className="grid h-12 w-12 place-items-center rounded-2xl bg-rose-50 text-rose-600 [&>svg]:h-5 [&>svg]:w-5">{icon}</span><h2 className="mt-4 text-lg font-black">{title}</h2><p className="mt-2 text-sm font-bold leading-7 text-rose-500">{text}</p></article> }
function HelpLink({ href, icon, title }: { href: string; icon: React.ReactNode; title: string }) { return <Link href={href} className="flex items-center gap-3 rounded-xl border border-rose-100 bg-[#fffafb] p-3 text-xs font-black text-rose-800 transition hover:border-rose-300 hover:bg-rose-50"><span className="text-rose-600 [&>svg]:h-4 [&>svg]:w-4">{icon}</span>{title}</Link> }
