import MemberDirectory from "@/components/member/MemberDirectory";
import FounderRemaining from "@/app/components/FounderRemaining";

export default function FoundersPage() {
  return (
    <>
      <section dir="rtl" className="mx-auto mb-5 max-w-7xl px-4 pt-6 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-[22px] border border-amber-200 bg-gradient-to-l from-white via-amber-50 to-rose-50 p-5 shadow-sm">
          <div><span className="text-[10px] font-black text-amber-700">عضوية المؤسسين</span><h2 className="mt-1 text-xl font-black text-rose-950">أول 1000 عضو في قلبي لوڤي</h2><p className="mt-1 text-[10px] font-bold text-rose-600">شارة دائمة؛ لا تحتاج إلى اشتراك مدفوع.</p></div>
          <span className="rounded-full border border-amber-200 bg-white px-4 py-2 text-xs font-black text-amber-800"><FounderRemaining compact /></span>
        </div>
      </section>
      <MemberDirectory mode="founders" title="أعضاء قلبي لوڤي المؤسسون" subtitle="أول 1000 عضو حقيقي حملوا شارة المؤسس. الشارة دائمة، ومزايا المؤسسين لا تحتاج إلى اشتراك مدفوع." />
    </>
  );
}
