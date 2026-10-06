"use client";

import MemberProfileHero from "@/components/common/MemberProfileHero";
import MemberAbout from "@/components/common/MemberAbout";
import MemberDetails from "@/components/common/MemberDetails";
import MemberInterestTags from "@/components/common/MemberInterestTags";
import MemberCompatibility from "@/components/common/MemberCompatibility";
import MemberProfileActions from "@/components/common/MemberProfileActions";

interface MemberProfileOverviewProps {
  memberId: string;
  currentMemberId: string;
  name: string;
  image?: string;
  city?: string;
  age?: number;
}

export default function MemberProfileOverview({
  memberId,
  currentMemberId,
  name,
  image,
  city,
  age,
}: MemberProfileOverviewProps) {
  return (
    <div
      dir="rtl"
      className="space-y-8"
    >
      <MemberProfileHero
        memberId={memberId}
        currentMemberId={currentMemberId}
        name={name}
        image={image}
        city={city}
        age={age}
      />

      {memberId !== currentMemberId && (
        <MemberProfileActions
          memberId={memberId}
          currentMemberId={currentMemberId}
        />
      )}

      <MemberCompatibility
        memberId={memberId}
        currentMemberId={currentMemberId}
      />

      <MemberAbout
        memberId={memberId}
      />

      <MemberDetails
        memberId={memberId}
      />

      <MemberInterestTags
        memberId={memberId}
      />
    </div>
  );
}