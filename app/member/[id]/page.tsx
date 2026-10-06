"use client";

import { useParams, useRouter } from "next/navigation";
import MemberProfileModal from "@/components/member/MemberProfileModal";

export default function MemberPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  return <MemberProfileModal memberId={params?.id || null} open onClose={() => router.back()} />;
}
