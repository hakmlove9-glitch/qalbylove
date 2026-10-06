"use client";

import { useEffect, useState } from "react";

type Props = {
  memberId: string;
  className?: string;
};

export default function FavoriteButton({
  memberId,
  className = "",
}: Props) {
  const [favorite, setFavorite] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [message, setMessage] =
    useState("");

  useEffect(() => {
    checkFavorite();
  }, [memberId]);

  async function checkFavorite() {
    try {
      const res = await fetch(
        "/api/favorites",
        {
          cache: "no-store",
        }
      );

      if (!res.ok) return;

      const data = await res.json();

      const exists =
        (data.favorites || []).some(
          (item: any) =>
            item.favorite_id ===
            memberId
        );

      setFavorite(exists);
    } catch {}
  }

  async function toggleFavorite() {
    if (loading) return;

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(
        "/api/favorites",
        {
          method: favorite
            ? "DELETE"
            : "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            favorite_id:
              memberId,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.error ||
            "تعذر تحديث المفضلة"
        );
      }

      setFavorite(!favorite);

      setMessage(
        favorite
          ? "تمت الإزالة"
          : "تمت الإضافة ❤️"
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
        onClick={
          toggleFavorite
        }
        disabled={loading}
        className={`rounded-xl px-5 py-3 font-bold transition ${
          favorite
            ? "bg-rose-600 text-white"
            : "bg-rose-50 text-rose-700"
        } disabled:opacity-50`}
      >
        {loading
          ? "..."
          : favorite
          ? "❤️ في المفضلة"
          : "🤍 أضف للمفضلة"}
      </button>

      {message && (
        <p className="mt-2 text-sm text-gray-500">
          {message}
        </p>
      )}

    </div>
  );
}