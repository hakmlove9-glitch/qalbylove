"use client";

import MemberProfileCompletion from "@/components/common/MemberProfileCompletion";
import MemberDashboardStats from "@/components/common/MemberDashboardStats";
import MemberNotifications from "@/components/common/MemberNotifications";
import MemberMessagesPreview from "@/components/common/MemberMessagesPreview";

interface MemberProfileDesktopSidebarProps {
  memberId: string;
}

export default function MemberProfileDesktopSidebar({
  memberId,
}: MemberProfileDesktopSidebarProps) {
  return (
    <aside
      dir="rtl"
      className="hidden lg:block space-y-6"
    >
      <MemberProfileCompletion />

      <MemberDashboardStats
        memberId={memberId}
      />

      <MemberNotifications
        memberId={memberId}
      />

      <MemberMessagesPreview
        memberId={memberId}
      />
    </aside>
  );
}