"use client";

import { Mic, Square } from "lucide-react";

interface VoiceRecorderButtonProps {
  disabled?: boolean;
  recording?: boolean;
  duration?: number;
  onStart?: () => void;
  onStop?: () => void;
}


export default function VoiceRecorderButton({
  disabled = false,
  recording = false,
  duration = 0,
  onStart,
  onStop,
}: VoiceRecorderButtonProps) {


  function toggleRecording() {

    if (recording) {
      onStop?.();
      return;
    }

    onStart?.();
  }


  return (
    <div
      className="
        flex
        items-center
        gap-2
      "
    >

      {recording && (

        <span
          className="
            rounded-full
            bg-red-50
            px-2
            py-1
            text-xs
            text-red-500
          "
        >
          {duration}s
        </span>

      )}


      <button
        type="button"
        disabled={disabled}
        onClick={toggleRecording}
        className={`
          flex
          h-10
          w-10
          items-center
          justify-center
          rounded-full
          transition-all
          duration-300
          ${
            recording
              ? "bg-red-500 text-white animate-pulse"
              : "bg-rose-50 text-rose-600 hover:bg-rose-100"
          }
          disabled:opacity-50
        `}
        title={
          recording
            ? "إيقاف التسجيل"
            : "تسجيل رسالة صوتية"
        }
      >
        {recording ? <Square className="h-4 w-4" /> : <Mic className="h-5 w-5" />}
      </button>

    </div>
  );
}