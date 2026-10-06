'use client';

import Link from "next/link";
import HeartButton from "@/components/HeartButton";
import { fallbackAvatar } from "@/lib/avatar-fallback";

type Props = {
  id: string;
  username: string;
  memberNumber: number;
  isFounder: boolean;
  imageUrl?: string;
  planName?: string;
  heartStatus?: "empty" | "sent" | "mutual";
  gender?: string;
};

export default function MemberCard({
  id,
  username,
  memberNumber,
  isFounder,
  imageUrl,
  planName,
  heartStatus = "empty",
  gender,
}: Props) {
  const avatar = imageUrl || fallbackAvatar(gender, memberNumber, { seed: id });

  return (
    <div className="qalby-card p-5 text-center">

      <div className="mx-auto mb-4 h-32 w-32 overflow-hidden rounded-full bg-gray-100">
        <img
          src={avatar}
          alt={imageUrl ? username : "صورة مؤقتة"}
          className="h-full w-full object-cover"
        />
      </div>

      <h2 className="text-xl font-bold text-rose-700">
        {username}
      </h2>

      <p className="mt-2">
        رقم العضوية: {memberNumber}
      </p>

      {isFounder && (
        <p className="mt-2 font-bold text-yellow-700">
          ⭐ عضو مؤسس
        </p>
      )}

      {planName && (
        <p className="mt-2 font-bold text-rose-600">
          ⭐ {planName}
        </p>
      )}

      <div className="mt-4">
        <HeartButton
          memberId={id}
          initialStatus={heartStatus}
        />
      </div>

      <Link
        href={`/member/${id}`}
        className="mt-4 block qalby-button"
      >
        عرض الملف
      </Link>

    </div>
  );
}
