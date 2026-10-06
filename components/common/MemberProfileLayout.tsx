"use client";

import { ReactNode } from "react";

import MemberProfileActions from "@/components/common/MemberProfileActions";
import MemberProfileShareButton from "@/components/common/MemberProfileShareButton";
import MemberVerificationBadge from "@/components/common/MemberVerificationBadge";
import MemberLastSeen from "@/components/common/MemberLastSeen";

interface MemberProfileLayoutProps {
  memberId: string;
  currentMemberId: string;
  name: string;
  image?: string;
  city?: string;
  children: ReactNode;
}

export default function MemberProfileLayout({
  memberId,
  currentMemberId,
  name,
  image,
  city,
  children,
}: MemberProfileLayoutProps) {
  return (
    <main
      dir="rtl"
      className="max-w-6xl mx-auto px-4 py-8"
    >
      <section className="bg-white rounded-3xl shadow p-6 mb-8">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <img
            src={image || "/avatar.png"}
            alt={name}
            className="w-36 h-36 rounded-full object-cover"
          />

          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold text-gray-800">
                {name}
              </h1>

              <MemberVerificationBadge
                memberId={memberId}
              />
            </div>

            {city && (
              <p className="text-gray-500 mt-2">
                📍 {city}
              </p>
            )}

            <div className="mt-3">
              <MemberLastSeen
                memberId={memberId}
              />
            </div>
          </div>
        </div>

        {memberId !== currentMemberId && (
          <div className="mt-6 flex flex-wrap gap-3">
            <MemberProfileActions
              memberId={memberId}
              currentMemberId={currentMemberId}
            />

            <MemberProfileShareButton
              memberId={memberId}
              currentMemberId={currentMemberId}
              name={name}
            />
          </div>
        )}
      </section>

      {children}
    </main>
  );
}