"use client";

import { useState } from "react";

interface MemberProfileActionsProps {
  memberId: string;
  currentMemberId?: string;
}

export default function MemberProfileActions({
  memberId,
  currentMemberId,
}: MemberProfileActionsProps) {
  const [loading, setLoading] = useState(false);
  const [liked, setLiked] = useState(false);
  const [favorite, setFavorite] = useState(false);
  const [interestSent, setInterestSent] = useState(false);

  async function likeMember() {
    if (!memberId || loading) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/interests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          receiver_id: memberId,
        }),
      });

      if (response.ok) {
        setLiked(true);
        setInterestSent(true);
      }
    } catch (error) {
      console.error("Like error:", error);
    } finally {
      setLoading(false);
    }
  }

  async function addFavorite() {
    if (!memberId || loading) {
      return;
    }

    setLoading(true);

    try {
      if (favorite) {
        const response = await fetch("/api/favorites", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            favoriteMemberId: memberId,
          }),
        });

        if (response.ok) {
          setFavorite(false);
        }

        return;
      }

      const response = await fetch("/api/favorites", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          favoriteMemberId: memberId,
        }),
      });

      if (response.ok) {
        setFavorite(true);
      }
    } catch (error) {
      console.error("Favorite error:", error);
    } finally {
      setLoading(false);
    }
  }

  async function sendInterest() {
    if (!memberId || loading) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/interests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          receiver_id: memberId,
        }),
      });

      if (response.ok) {
        setInterestSent(true);
        setLiked(true);
      }
    } catch (error) {
      console.error("Interest error:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      dir="rtl"
      className="flex flex-wrap gap-3"
    >
      <button
        type="button"
        onClick={likeMember}
        disabled={loading}
        className="rounded-xl bg-pink-100 text-rose-700 px-5 py-3 font-bold disabled:opacity-50"
      >
        {liked ? "❤️ تم الاهتمام" : "🤍 إعجاب"}
      </button>

      <button
        type="button"
        onClick={addFavorite}
        disabled={loading}
        className="rounded-xl border border-rose-700 text-rose-700 px-5 py-3 font-bold disabled:opacity-50"
      >
        {favorite ? "⭐ محفوظ" : "☆ مفضلة"}
      </button>

      <button
        type="button"
        onClick={sendInterest}
        disabled={loading || interestSent}
        className="rounded-xl bg-rose-700 text-white px-5 py-3 font-bold disabled:opacity-50"
      >
        {interestSent
          ? "💌 تم إرسال الاهتمام"
          : "💌 إرسال اهتمام"}
      </button>

      {currentMemberId &&
        currentMemberId === memberId && (
          <span className="rounded-xl bg-gray-100 text-gray-500 px-5 py-3 font-bold">
            هذا ملفك الشخصي
          </span>
        )}
    </div>
  );
}