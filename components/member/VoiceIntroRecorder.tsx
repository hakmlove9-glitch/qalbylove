"use client";

import Image from "next/image";
import { Mic, RotateCcw, Square, Trash2, Upload, Volume2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function VoiceIntroRecorder({
  initialUrl,
  gender,
}: {
  initialUrl?: string | null;
  gender?: string | null;
}) {
  const female = gender === "female" || gender === "أنثى";
  const helperName = female ? "حواء" : "آدم";
  const helperImage = female ? "/images/site-v2/assistants/female/02.webp" : "/images/site-v2/assistants/male/02.webp";

  const [url, setUrl] = useState(initialUrl || "");
  const [recording, setRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [blob, setBlob] = useState<Blob | null>(null);
  const [preview, setPreview] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      streamRef.current?.getTracks().forEach((track) => track.stop());
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  async function start() {
    setMessage("");
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") {
      setMessage("المتصفح الحالي لا يدعم التسجيل الصوتي. جرّب متصفحًا حديثًا مثل كروم أو إيدج.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const mimeType =
        MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
          ? "audio/webm;codecs=opus"
          : MediaRecorder.isTypeSupported("audio/webm")
            ? "audio/webm"
            : "";

      const recorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);
      chunksRef.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      };

      recorder.onstop = () => {
        stream.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
        const next = new Blob(chunksRef.current, { type: recorder.mimeType || "audio/webm" });
        if (next.size > 0) {
          setBlob(next);
          if (preview) URL.revokeObjectURL(preview);
          setPreview(URL.createObjectURL(next));
        }
      };

      recorderRef.current = recorder;
      recorder.start(250);
      setSeconds(0);
      setRecording(true);

      timerRef.current = setInterval(() => {
        setSeconds((value) => {
          const next = value + 1;
          if (next >= 30) {
            recorderRef.current?.stop();
            if (timerRef.current) clearInterval(timerRef.current);
            timerRef.current = null;
            setRecording(false);
            return 30;
          }
          return next;
        });
      }, 1000);
    } catch (error: any) {
      if (error?.name === "NotAllowedError") {
        setMessage("الميكروفون مرفوض من المتصفح. افتح إعدادات الموقع واسمح باستخدام الميكروفون ثم جرّب تاني.");
      } else if (error?.name === "NotFoundError") {
        setMessage("لم يتم العثور على ميكروفون متاح على الجهاز.");
      } else {
        setMessage("تعذر تشغيل الميكروفون. تأكد إنه غير مستخدم في برنامج آخر وجرّب تاني.");
      }
    }
  }

  function stop() {
    if (recorderRef.current?.state === "recording") recorderRef.current.stop();
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
    setRecording(false);
  }

  function reset() {
    if (preview) URL.revokeObjectURL(preview);
    setBlob(null);
    setPreview("");
    setSeconds(0);
    setMessage("");
  }

  async function upload() {
    if (!blob) return;
    if (seconds < 2) {
      setMessage("التسجيل قصير جدًا. سجّل جملة واضحة لمدة ثانيتين على الأقل.");
      return;
    }

    setSaving(true);
    setMessage("");
    try {
      const form = new FormData();
      form.append("audio", new File([blob], "voice-intro.webm", { type: blob.type || "audio/webm" }));
      form.append("duration", String(seconds));
      const response = await fetch("/api/profile/voice-intro", { method: "POST", body: form });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || "تعذر رفع التعريف الصوتي");
      setUrl(data.url || "");
      reset();
      setMessage("تم حفظ تعريفك الصوتي بنجاح.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "تعذر رفع التعريف الصوتي");
    } finally {
      setSaving(false);
    }
  }

  async function remove() {
    setSaving(true);
    setMessage("");
    try {
      const response = await fetch("/api/profile/voice-intro", { method: "DELETE" });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || "تعذر حذف التعريف الصوتي");
      setUrl("");
      reset();
      setMessage("تم حذف التعريف الصوتي.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "تعذر حذف التعريف الصوتي");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="rounded-[24px] border border-rose-100 bg-white p-4" dir="rtl">
      <div className="flex items-start gap-3">
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-rose-50">
          <Image src={helperImage} alt={helperName} fill className="object-contain" sizes="64px" />
        </div>
        <div>
          <div className="flex items-center gap-2 text-sm font-black text-rose-900"><Volume2 className="h-4 w-4 text-rose-600" />تعريف صوتي قصير</div>
          <p className="mt-1 text-xs font-bold leading-6 text-rose-500">
            {helperName} يقترح: «عرّف بنفسك في 15–30 ثانية: شغلك أو دراستك، حاجة بتحبها في شخصيتك، وإن هدفك زواج جاد.» من غير أرقام تليفون أو وسائل تواصل خارجية.
          </p>
        </div>
      </div>

      {url && (
        <div className="mt-4 flex items-center gap-3 rounded-2xl bg-rose-50 p-3">
          <audio controls src={url} className="h-10 w-full" />
          <button type="button" onClick={remove} disabled={saving} className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-red-50 text-red-600"><Trash2 className="h-4 w-4" /></button>
        </div>
      )}

      {!url && (
        <div className="mt-4">
          {!recording && !preview && (
            <button type="button" onClick={start} className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-3 text-xs font-black text-white">
              <Mic className="h-4 w-4" />ابدأ التسجيل
            </button>
          )}

          {recording && (
            <div className="flex items-center gap-3 rounded-2xl bg-rose-50 p-3">
              <span className="relative grid h-11 w-11 place-items-center rounded-full bg-rose-600 text-white">
                <Mic className="h-5 w-5" />
                <span className="absolute inset-0 animate-ping rounded-full bg-rose-400/35" />
              </span>
              <div className="flex-1"><div className="text-xs font-black text-rose-800">جاري التسجيل...</div><div className="text-[10px] font-bold text-rose-500">اتكلم بهدوء وبصوت واضح</div></div>
              <span className="text-sm font-black text-rose-700">00:{String(seconds).padStart(2, "0")}</span>
              <button type="button" onClick={stop} className="grid h-10 w-10 place-items-center rounded-xl bg-rose-900 text-white"><Square className="h-4 w-4" fill="currentColor" /></button>
            </div>
          )}

          {preview && (
            <div className="space-y-3">
              <audio controls src={preview} className="h-10 w-full" />
              <div className="flex flex-wrap gap-2">
                <button type="button" onClick={upload} disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2.5 text-xs font-black text-white"><Upload className="h-4 w-4" />{saving ? "جاري الحفظ..." : "حفظ التسجيل"}</button>
                <button type="button" onClick={reset} className="inline-flex items-center gap-2 rounded-xl bg-rose-100 px-4 py-2.5 text-xs font-black text-rose-600"><RotateCcw className="h-4 w-4" />تسجيل من جديد</button>
              </div>
            </div>
          )}
        </div>
      )}

      {message && <p className="mt-3 rounded-xl bg-rose-50 px-3 py-2 text-xs font-black text-rose-700">{message}</p>}
    </div>
  );
}
