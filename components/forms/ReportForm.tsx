"use client";

import { useState } from "react";

type Props = {
  reportedId: string;
  onSuccess?: () => void;
  onClose?: () => void;
};

const REPORT_REASONS = [
  "حساب مزيف",
  "محتوى غير لائق",
  "تحرش أو إساءة",
  "طلب أموال أو احتيال",
  "معلومات مضللة",
  "سبب آخر",
];

export default function ReportForm({
  reportedId,
  onSuccess,
  onClose,
}: Props) {
  const [reason, setReason] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  async function submitReport(
    event: React.FormEvent
  ) {
    event.preventDefault();

    if (!reason) {
      setError(
        "اختر سبب البلاغ"
      );
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch(
        "/api/reports",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            reported_id:
              reportedId,
            reason,
            description:
              description.trim(),
          }),
        }
      );

      const data =
        await res.json();

      if (!res.ok) {
        throw new Error(
          data.error ||
            "تعذر إرسال البلاغ"
        );
      }

      setSuccess(
        data.message ||
          "تم إرسال البلاغ بنجاح"
      );

      setReason("");
      setDescription("");

      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "تعذر إرسال البلاغ"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      dir="rtl"
      onSubmit={
        submitReport
      }
      className="space-y-4"
    >
      <h2 className="text-xl font-bold text-rose-700">
        🚩 الإبلاغ عن العضو
      </h2>

      {error && (
        <div className="rounded-xl bg-red-50 p-4 text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-xl bg-green-50 p-4 text-green-700">
          {success}
        </div>
      )}

      <select
        value={reason}
        onChange={(e) =>
          setReason(
            e.target.value
          )
        }
        className="w-full rounded-xl border p-3"
      >
        <option value="">
          اختر سبب البلاغ
        </option>

        {REPORT_REASONS.map(
          (item) => (
            <option
              key={item}
              value={item}
            >
              {item}
            </option>
          )
        )}
      </select>

      <textarea
        value={description}
        onChange={(e) =>
          setDescription(
            e.target.value
          )
        }
        rows={5}
        placeholder="اكتب تفاصيل إضافية إن وجدت..."
        className="w-full rounded-xl border p-3"
      />

      <div className="flex gap-3">

        <button
          type="submit"
          disabled={loading}
          className="qalby-button flex-1 disabled:opacity-50"
        >
          {loading
            ? "جاري الإرسال..."
            : "إرسال البلاغ 🚩"}
        </button>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-gray-100 px-5 py-3 font-bold"
          >
            إلغاء
          </button>
        )}

      </div>
    </form>
  );
}