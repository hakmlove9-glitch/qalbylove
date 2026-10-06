"use client";

import { useEffect, useState } from "react";

type Props = {
  memberId: string;
  className?: string;
};

export default function BlockButton({
  memberId,
  className = "",
}: Props) {
  const [blocked, setBlocked] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [message, setMessage] =
    useState("");

  useEffect(() => {
    checkBlocked();
  }, [memberId]);

  async function checkBlocked() {
    try {
      const res = await fetch(
        "/api/blocks",
        {
          cache: "no-store",
        }
      );

      if (!res.ok) return;

      const data =
        await res.json();

      const exists =
        (data.blocks || []).some(
          (item: any) =>
            item.blocked_id ===
            memberId
        );

      setBlocked(exists);
    } catch {}
  }

  async function toggleBlock() {
    if (loading) return;

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(
        "/api/blocks",
        {
          method: blocked
            ? "DELETE"
            : "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            blocked_id:
              memberId,
          }),
        }
      );

      const data =
        await res.json();

      if (!res.ok) {
        throw new Error(
          data.error ||
            "تعذر تحديث الحظر"
        );
      }

      setBlocked(!blocked);

      setMessage(
        blocked
          ? "تم إلغاء الحظر"
          : "تم حظر العضو"
      );

      setTimeout(() => {
        setMessage("");
      }, 1500);
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "حدث خطأ"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={className}>

      <button
        type="button"
        onClick={toggleBlock}
        disabled={loading}
        className="rounded-xl bg-gray-100 px-5 py-3 font-bold text-gray-700 disabled:opacity-50"
      >
        {loading
          ? "..."
          : blocked
          ? "إلغاء الحظر"
          : "🚫 حظر العضو"}
      </button>

      {message && (
        <p className="mt-2 text-sm text-gray-500">
          {message}
        </p>
      )}

    </div>
  );
}