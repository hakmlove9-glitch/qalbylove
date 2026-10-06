"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function NotificationBell() {
  const [count, setCount] =
    useState(0);

  useEffect(() => {
    loadCount();

    const timer =
      setInterval(
        loadCount,
        10000
      );

    return () =>
      clearInterval(timer);
  }, []);

  async function loadCount() {
    try {
      const res = await fetch(
        "/api/notifications",
        {
          cache: "no-store",
        }
      );

      if (!res.ok) return;

      const data = await res.json();

      setCount(
        Number(
          data.unreadCount || 0
        )
      );
    } catch {}
  }

  return (
    <Link
      href="/notifications"
      aria-label="الإشعارات"
      className="relative inline-flex items-center justify-center rounded-xl p-3 transition hover:bg-rose-50"
    >
      <span className="text-2xl">
        🔔
      </span>

      {count > 0 && (
        <span className="absolute -right-1 -top-1 min-w-[22px] rounded-full bg-rose-600 px-1.5 py-0.5 text-center text-xs font-bold text-white">
          {count > 99
            ? "99+"
            : count}
        </span>
      )}
    </Link>
  );
}