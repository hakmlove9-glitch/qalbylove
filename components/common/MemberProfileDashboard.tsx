"use client";

import MemberProfileComplete from "@/components/common/MemberProfileComplete";
import MemberProfileCompletion from "@/components/common/MemberProfileCompletion";
import MemberProfileShareAnalytics from "@/components/common/MemberProfileShareAnalytics";

interface MemberProfileDashboardProps {
  memberId: string;
  currentMemberId: string;
  name: string;
  image?: string;
  city?: string;
}

export default function MemberProfileDashboard({
  memberId,
  currentMemberId,
  name,
  image,
  city,
}: MemberProfileDashboardProps) {
  return (
    <div
      dir="rtl"
      className="min-h-screen bg-gray-50 py-8"
    >
      <div className="max-w-6xl mx-auto px-4 space-y-8">
        <MemberProfileCompletion />

        <MemberProfileShareAnalytics
          memberId={memberId}
        />

        <MemberProfileComplete
          memberId={memberId}
          currentMemberId={currentMemberId}
          name={name}
          image={image}
          city={city}
        />
      </div>
    </div>
  );
}