"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  createClient,
} from "@/lib/supabase/client";

import ChatButton from "./ChatButton";
import ChatAssistant from "./ChatAssistant";
import KidsAssistant from "./KidsAssistant";

interface SiteAssistantsProps {
  memberId?: string;
}

export default function SiteAssistants({
  memberId: initialMemberId,
}: SiteAssistantsProps) {
  const [
    memberId,
    setMemberId,
  ] = useState<string>(
    initialMemberId || ""
  );

  const supabase = createClient();

  useEffect(() => {
    if (initialMemberId) {
      setMemberId(initialMemberId);
      return;
    }

    async function getCurrentUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user?.id) {
        setMemberId(user.id);
      }
    }

    getCurrentUser();
  }, [initialMemberId, supabase]);

  return (
    <>
      <ChatButton />

      <ChatAssistant
        memberId={memberId}
      />

      <KidsAssistant
        memberId={memberId}
      />
    </>
  );
}