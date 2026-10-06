"use client";

import { useEffect, useRef } from "react";

const IDLE_LIMIT = 15 * 60 * 1000;
const EVENTS: (keyof WindowEventMap)[] = ["mousemove", "mousedown", "keydown", "scroll", "touchstart", "focus"];

export default function InactivityGuard() {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const loggedIn = useRef(false);

  useEffect(() => {
    let disposed = false;

    const arm = () => {
      if (!loggedIn.current || disposed) return;
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(async () => {
        try {
          await fetch("/api/logout", { method: "POST", cache: "no-store" });
        } finally {
          window.location.href = "/login?reason=idle";
        }
      }, IDLE_LIMIT);
    };

    const check = async () => {
      try {
        const response = await fetch("/api/auth/session", { cache: "no-store" });
        loggedIn.current = response.ok;
        if (loggedIn.current) arm();
      } catch {
        loggedIn.current = false;
      }
    };

    void check();
    const onActivity = () => arm();
    EVENTS.forEach((event) => window.addEventListener(event, onActivity, { passive: true }));

    return () => {
      disposed = true;
      if (timer.current) clearTimeout(timer.current);
      EVENTS.forEach((event) => window.removeEventListener(event, onActivity));
    };
  }, []);

  return null;
}
