"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface SearchFiltersProps {
  onResults?: (data: any[]) => void;
}

interface Filters {
  gender: string;
  city: string;
  minAge: string;
  maxAge: string;
  status: string;
}

export default function SearchFilters({
  onResults,
}: SearchFiltersProps) {
  const supabase = createClient();

  const [filters, setFilters] =
    useState<Filters>({
      gender: "",
      city: "",
      minAge: "",
      maxAge: "",
      status: "",
    });

  const [loading, setLoading] =
    useState(false);

  function update(
    key: keyof Filters,
    value: string
  ) {
    setFilters((old) => ({
      ...old,
      [key]: value,
    }));
  }

  async function search() {
    setLoading(true);

    try {
      let query = supabase
        .from("members")
        .select(`
          id,
          name,
          age,
          city,
          image,
          status,
          interests
        `);

      if (filters.gender) {
        query = query.eq(
          "gender",
          filters.gender
        );
      }

      if (filters.city) {
        query = query.eq(
          "city",
          filters.city
        );
      }

      if (filters.minAge) {
        query = query.gte(
          "age",
          Number(filters.minAge)
        );
      }

      if (filters.maxAge) {
        query = query.lte(
          "age",
          Number(filters.maxAge)
        );
      }

      if (filters.status) {
        query = query.eq(
          "status",
          filters.status
        );
      }

      const {
        data,
        error,
      } = await query;

      if (error) {
        console.error(error);
        onResults?.([]);
        return;
      }

      onResults?.(data || []);
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    const empty: Filters = {
      gender: "",
      city: "",
      minAge: "",
      maxAge: "",
      status: "",
    };

    setFilters(empty);
    onResults?.([]);
  }

  return (
    <div
      dir="rtl"
      className="qalby-card bg-white p-6"
    >
      <h2 className="mb-5 text-2xl font-bold text-rose-700">
        بحث متقدم 🔎
      </h2>

      <div className="grid gap-4 md:grid-cols-3">

        <select
          value={filters.gender}
          onChange={(e) =>
            update(
              "gender",
              e.target.value
            )
          }
          className="rounded-xl border p-3"
        >
          <option value="">
            الجنس
          </option>

          <option value="male">
            رجل
          </option>

          <option value="female">
            امرأة
          </option>
        </select>

        <input
          value={filters.city}
          onChange={(e) =>
            update(
              "city",
              e.target.value
            )
          }
          placeholder=""
          className="rounded-xl border p-3"
        />

        <select
          value={filters.status}
          onChange={(e) =>
            update(
              "status",
              e.target.value
            )
          }
          className="rounded-xl border p-3"
        >
          <option value="">
            الحالة
          </option>

          <option value="single">
            أعزب
          </option>

          <option value="active">
            نشط
          </option>
        </select>

        <input
          type="number"
          min="18"
          max="100"
          value={filters.minAge}
          onChange={(e) =>
            update(
              "minAge",
              e.target.value
            )
          }
          placeholder=""
          className="rounded-xl border p-3"
        />

        <input
          type="number"
          min="18"
          max="100"
          value={filters.maxAge}
          onChange={(e) =>
            update(
              "maxAge",
              e.target.value
            )
          }
          placeholder=""
          className="rounded-xl border p-3"
        />

      </div>

      <div className="mt-6 flex gap-3">

        <button
          type="button"
          onClick={search}
          disabled={loading}
          className="qalby-button flex-1 disabled:opacity-50"
        >
          {loading
            ? "جاري البحث..."
            : "بحث 🔍"}
        </button>

        <button
          type="button"
          onClick={reset}
          className="rounded-xl bg-gray-100 px-6 py-3 font-bold text-gray-700"
        >
          مسح
        </button>

      </div>
    </div>
  );
}