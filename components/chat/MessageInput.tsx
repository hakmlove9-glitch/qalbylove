"use client";

import { Mic, SendHorizontal, Square, Trash2, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import SpeechToTextButton from "./SpeechToTextButton";

export default function MessageInput({
  disabled = false,
  onSendText,
  onSendVoice,
}: {
  disabled?: boolean;
  onSendText: (content: string) => Promise<void> | void;
  onSendVoice: (blob: Blob) => Promise<void> | void;
}) {
  const [value, setValue] = useState("");
  const [recording, setRecording] = useState(false);
  const [duration, setDuration] = useState(0);
  const [preview, setPreview] = useState<string | null>(null);
  const [voiceBlob, setVoiceBlob] = useState<Blob | null>(null);
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunks = useRef<Blob[]>([]);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
      streamRef.current?.getTracks().forEach((track) => track.stop());
      if (timer.current) clearInterval(timer.current);
    };
  }, [preview]);

  async function startRecording() {
    setError("");
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") {
      setError("المتصفح لا يدعم التسجيل الصوتي.");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const preferred = MediaRecorder.isTypeSupported("audio/webm;codecs=opus") ? "audio/webm;codecs=opus" : "audio/webm";
      const recorder = new MediaRecorder(stream, { mimeType: preferred });
      streamRef.current = stream;
      mediaRecorder.current = recorder;
      chunks.current = [];
      setDuration(0);

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunks.current.push(event.data);
      };
      recorder.onstop = () => {
        const blob = new Blob(chunks.current, { type: recorder.mimeType || "audio/webm" });
        if (preview) URL.revokeObjectURL(preview);
        const url = URL.createObjectURL(blob);
        setVoiceBlob(blob);
        setPreview(url);
        stream.getTracks().forEach((track) => track.stop());
      };

      recorder.start(250);
      setRecording(true);
      timer.current = setInterval(() => setDuration((value) => {
        const next = value + 1;
        if (next >= 60) {
          mediaRecorder.current?.stop();
          setRecording(false);
          if (timer.current) clearInterval(timer.current);
          timer.current = null;
          return 60;
        }
        return next;
      }), 1000);
    } catch {
      setError("اسمح باستخدام الميكروفون لتسجيل رسالة صوتية.");
    }
  }

  function stopRecording() {
    if (!recording) return;
    mediaRecorder.current?.stop();
    setRecording(false);
    if (timer.current) clearInterval(timer.current);
    timer.current = null;
  }

  function discardVoice() {
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    setVoiceBlob(null);
    setDuration(0);
  }

  async function submitVoice() {
    if (!voiceBlob || disabled || sending) return;
    if (duration < 1) {
      setError("التسجيل قصير جدًا. سجّل رسالة واضحة ثم أرسلها.");
      return;
    }
    setSending(true);
    setError("");
    try {
      await onSendVoice(voiceBlob);
      discardVoice();
    } catch (sendError) {
      setError(sendError instanceof Error ? sendError.message : "تعذر إرسال التسجيل الصوتي.");
    } finally {
      setSending(false);
    }
  }

  async function submitText() {
    const text = value.trim();
    if (!text || disabled || sending) return;
    setSending(true);
    setError("");
    try {
      await onSendText(text);
      setValue("");
    } catch (sendError) {
      setError(sendError instanceof Error ? sendError.message : "تعذر إرسال الرسالة.");
    } finally {
      setSending(false);
    }
  }

  const mm = String(Math.floor(duration / 60)).padStart(2, "0");
  const ss = String(duration % 60).padStart(2, "0");

  return (
    <div className="border-t border-rose-100 bg-white p-3" dir="rtl">
      {error && <div role="alert" className="mb-2 rounded-xl bg-red-50 px-3 py-2 text-[11px] font-black text-red-700">{error}</div>}

      {preview ? (
        <div className="flex items-center gap-2 rounded-2xl bg-rose-50 p-2">
          <audio controls src={preview} className="h-9 min-w-0 flex-1" />
          <button onClick={discardVoice} disabled={sending} aria-label="إلغاء التسجيل" className="grid h-9 w-9 place-items-center rounded-xl bg-white text-rose-500 disabled:opacity-50">
            <Trash2 className="h-4 w-4" />
          </button>
          <button onClick={submitVoice} disabled={disabled || sending} aria-label="إرسال التسجيل" className="grid h-9 w-9 place-items-center rounded-xl bg-rose-600 text-white disabled:opacity-50">
            <SendHorizontal className="h-4 w-4" />
          </button>
        </div>
      ) : recording ? (
        <div className="flex items-center gap-3 rounded-2xl bg-rose-50 px-3 py-2">
          <span className="relative grid h-10 w-10 place-items-center rounded-full bg-rose-600 text-white">
            <Mic className="h-4 w-4" />
            <span className="absolute inset-0 animate-ping rounded-full bg-rose-400/40" />
          </span>
          <span className="flex-1">
            <b className="block text-xs font-black text-rose-800">جاري التسجيل</b>
            <span className="text-[11px] font-bold text-rose-500">{mm}:{ss}</span>
          </span>
          <button onClick={stopRecording} className="grid h-10 w-10 place-items-center rounded-xl bg-rose-900 text-white" aria-label="إيقاف التسجيل">
            <Square className="h-4 w-4" fill="currentColor" />
          </button>
          <button
            onClick={() => {
              mediaRecorder.current?.stop();
              setRecording(false);
              if (timer.current) clearInterval(timer.current);
              timer.current = null;
              setTimeout(discardVoice, 0);
            }}
            className="grid h-10 w-10 place-items-center rounded-xl bg-white text-rose-500"
            aria-label="إلغاء التسجيل"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div className="flex items-end gap-2">
          <SpeechToTextButton onTranscript={(transcript) => setValue((current) => `${current}${current ? " " : ""}${transcript}`)} />
          <textarea
            dir="auto"
            value={value}
            disabled={disabled || sending}
            onChange={(event) => setValue(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                void submitText();
              }
            }}
            rows={1}
            placeholder="اكتب رسالتك..."
            className="max-h-28 min-h-11 flex-1 resize-none rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-bold outline-none transition focus:border-rose-300 focus:bg-white"
          />
          <button
            type="button"
            disabled={disabled}
            onClick={startRecording}
            className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-rose-100 bg-rose-50 text-rose-600 transition hover:bg-rose-100 disabled:opacity-50"
            aria-label="تسجيل رسالة صوتية"
          >
            <Mic className="h-5 w-5" />
          </button>
          <button
            type="button"
            disabled={disabled || sending || !value.trim()}
            onClick={() => void submitText()}
            className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-100 transition hover:-translate-y-0.5 disabled:translate-y-0 disabled:opacity-40"
            aria-label="إرسال الرسالة"
          >
            <SendHorizontal className="h-4.5 w-4.5" />
          </button>
        </div>
      )}
    </div>
  );
}
