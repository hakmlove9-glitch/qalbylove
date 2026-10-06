"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Favorite = {
  id: string;
  favorite_id: string;
  member?: {
    id: string;
    username: string | null;
  } | null;
};

export default function FavoritesPage() {
  const [favorites, setFavorites] =
    useState<Favorite[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    loadFavorites();
  }, []);

  async function loadFavorites() {
    try {
      const response = await fetch(
        "/api/favorites",
        {
          cache: "no-store",
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "تعذر تحميل المفضلة"
        );
      }

      setFavorites(
        data.favorites || []
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "تعذر تحميل المفضلة"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      dir="rtl"
      className="min-h-screen px-5 py-10"
    >
      <div className="mx-auto max-w-6xl">

        <h1 className="mb-8 text-center text-3xl font-black text-rose-700">
          ❤️ المفضلة
        </h1>

        {loading && (
          <div className="qalby-card p-8 text-center">
            جاري تحميل المفضلة...
          </div>
        )}

        {error && (
          <div className="rounded-xl bg-red-50 p-4 text-center text-red-700">
            {error}
          </div>
        )}

        {!loading &&
          !error &&
          favorites.length === 0 && (
            <div className="qalby-card p-10 text-center">

              <div className="mb-3 text-5xl">
                ❤️
              </div>

              <h2 className="text-xl font-bold">
                لا توجد أعضاء في المفضلة
              </h2>

              <p className="mt-2 text-gray-500">
                يمكنك إضافة الأعضاء الذين
                تهتم بهم إلى المفضلة.
              </p>

            </div>
          )}

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

          {favorites.map(
            (favorite) => (
              <div
                key={favorite.id}
                className="qalby-card p-6"
              >

                <div className="mb-5 text-center text-5xl">
                  👤
                </div>

                <h2 className="text-center text-xl font-bold text-rose-700">
                  {favorite.member
                    ?.username ||
                    "عضو"}
                </h2>

                <Link
                  href={`/member/${favorite.favorite_id}`}
                  className="mt-5 block rounded-xl bg-rose-600 px-5 py-3 text-center font-bold text-white"
                >
                  عرض الملف
                </Link>

              </div>
            )
          )}

        </div>

      </div>
    </main>
  );
}