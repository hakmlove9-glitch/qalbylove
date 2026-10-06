"use client";

import { Mic, Square } from "lucide-react";
import { useRef, useState } from "react";

type Props = {
  memberId?: string;
  receiverId: string;
  onUploaded?: (url: string) => void;
  onSent?: () => void;
};

export default function VoiceRecorder({ receiverId, onUploaded, onSent }: Props) {
  const recorder = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const [recording, setRecording] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState("");

  async function startRecording() {
    setError("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const media = new MediaRecorder(stream);
      chunks.current = [];
      setDuration(0);

      media.ondataavailable = (event) => {
        if (event.data.size > 0) chunks.current.push(event.data);
      };
      media.onstop = async () => {
        const type = media.mimeType || "audio/webm";
        const blob = new Blob(chunks.current, { type });
        await uploadVoice(blob, type);
      };

      recorder.current = media;
      media.start();
      setRecording(true);
      timer.current = setInterval(() => setDuration((value) => value + 1), 1000);
    } catch {
      setError("تعذر تشغيل الميكروفون. تأكد من السماح للمتصفح باستخدامه.");
    }
  }

  function stopRecording() {
    recorder.current?.stop();
    recorder.current?.stream.getTracks().forEach((track) => track.stop());
    if (timer.current) clearInterval(timer.current);
    timer.current = null;
    setRecording(false);
  }

  async function uploadVoice(blob: Blob, type: string) {
    setUploading(true);
    setError("");
    try {
      const form = new FormData();
      form.append("receiver_id", receiverId);
      form.append("audio", new File([blob], "voice-message.webm", { type }));
      const response = await fetch("/api/messages/voice", { method: "POST", body: form });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "تعذر إرسال التسجيل الصوتي");
      onUploaded?.(data?.message?.voice_url || "");
      onSent?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "تعذر إرسال التسجيل الصوتي");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="flex items-center gap-2">
      {error && <span className="max-w-56 text-[10px] font-bold text-red-600">{error}</span>}
      {recording && <span className="rounded-full bg-red-50 px-2 py-1 text-[10px] font-black text-red-600">{duration} ث</span>}
      <button
        type="button"
        disabled={uploading}
        onClick={() => (recording ? stopRecording() : void startRecording())}
        className={`grid h-11 w-11 place-items-center rounded-2xl border transition ${
          recording
            ? "border-red-500 bg-red-500 text-white shadow-lg shadow-red-100"
            : "border-emerald-100 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
        } disabled:opacity-50`}
        aria-label={recording ? "إيقاف التسجيل" : "تسجيل رسالة صوتية"}
      >
        {recording ? <Square className="h-4 w-4" /> : <Mic className="h-5 w-5" />}
      </button>
    </div>
  );
}
