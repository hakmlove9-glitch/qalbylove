"use client";

import { useState } from "react";
import ReportForm from "@/components/forms/ReportForm";

type Props = {
  memberId: string;
  className?: string;
};

export default function ReportButton({
  memberId,
  className = "",
}: Props) {
  const [open, setOpen] =
    useState(false);

  return (
    <div className={className}>

      <button
        type="button"
        onClick={() =>
          setOpen(true)
        }
        className="rounded-xl bg-gray-100 px-5 py-3 font-bold text-gray-700"
      >
        🚩 إبلاغ
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">

            <ReportForm
              reportedId={
                memberId
              }
              onClose={() =>
                setOpen(false)
              }
              onSuccess={() => {
                setTimeout(() => {
                  setOpen(false);
                }, 1200);
              }}
            />

          </div>

        </div>
      )}

    </div>
  );
}