import MemberDirectory from "@/components/member/MemberDirectory";

export default function OnlineMembersPage() {
  return (
    <MemberDirectory
      mode="online"
      title="المتواجدون الآن"
      subtitle="أعضاء كانوا نشطين خلال الدقائق الأخيرة. فرصة أفضل لبدء تواصل في الوقت المناسب."
    />
  );
}
