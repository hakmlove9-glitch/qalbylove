import MemberDirectory from "@/components/member/MemberDirectory";

export default function SearchPage({ searchParams }: { searchParams?: { health?: string } }) {
  return (
    <MemberDirectory
      mode="all"
      initialHealth={searchParams?.health || ""}
      title="البحث عن أعضاء"
      subtitle="ابدأ بالمكان والعمر، وبعدها استخدم الفلاتر الدقيقة لو احتجت. كل النتائج أمامك بشكل واضح وسريع."
    />
  );
}
