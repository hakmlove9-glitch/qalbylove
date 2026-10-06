"use client";

import { useEffect } from "react";

type Props = {
  viewedId: string;
};

export default function ProfileViewTracker({
  viewedId,
}: Props) {
  useEffect(() => {
    if (!viewedId) {
      return;
    }

    fetch("/api/profile-view", {
      method: "POST",
      headers: {
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify({
        viewed_id: viewedId,
      }),
    }).catch(() => {});
  }, [viewedId]);

  return null;
}