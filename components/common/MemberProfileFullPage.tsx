"use client";

import MemberProfileOverview from "@/components/common/MemberProfileOverview";
import MemberDashboardStats from "@/components/common/MemberDashboardStats";
import MemberNotifications from "@/components/common/MemberNotifications";
import MemberMessagesPreview from "@/components/common/MemberMessagesPreview";
import MemberRequestsList from "@/components/common/MemberRequestsList";
import MemberFavoritesList from "@/components/common/MemberFavoritesList";
import MemberProfileCompletion from "@/components/common/MemberProfileCompletion";

interface MemberProfileFullPageProps {
  memberId: string;
  currentMemberId: string;
  name: string;
  image?: string;
  city?: string;
  age?: number;
}

export default function MemberProfileFullPage({
  memberId,
  currentMemberId,
  name,
  image,
  city,
  age,
}: MemberProfileFullPageProps) {
  return (
    <main
      dir="rtl"
      className="min-h-screen bg-gray-50 py-10"
    >
      <div className="max-w-7xl mx-auto px-4 space-y-8">
        <MemberProfileCompletion />

        <MemberDashboardStats
          memberId={memberId}
        />

        <MemberProfileOverview
          memberId={memberId}
          currentMemberId={currentMemberId}
          name={name}
          image={image}
          city={city}
          age={age}
        />

        {memberId === currentMemberId && (
          <>
            <MemberNotifications
              memberId={memberId}
            />

            <MemberMessagesPreview
              memberId={memberId}
            />

            <MemberRequestsList
              memberId={memberId}
            />

            <MemberFavoritesList
              memberId={memberId}
            />
          </>
        )}
      </div>
    </main>
  );
}