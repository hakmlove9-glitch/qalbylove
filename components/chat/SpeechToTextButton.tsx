"use client";

import { Mic, MicOff } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type SpeechRecognitionResult = {
  readonly [index: number]: { readonly transcript: string };
  readonly isFinal: boolean;
};

type SpeechRecognitionEvent = Event & {
  readonly resultIndex: number;
  readonly results: ArrayLike<SpeechRecognitionResult>;
};

type SpeechRecognitionInstance = {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
};

type SpeechRecognitionConstructor = new () => SpeechRecognitionInstance;
type SpeechRecognitionWindow = Window & {
  SpeechRecognition?: SpeechRecognitionConstructor;
  webkitSpeechRecognition?: SpeechRecognitionConstructor;
};

export default function SpeechToTextButton({
  onTranscript,
}: {
  onTranscript: (transcript: string) => void;
}) {
  const [listening, setListening] = useState(false);
  const [supported, setSupported] = useState(false);
  const [error, setError] = useState("");
  const recognition = useRef<SpeechRecognitionInstance | null>(null);

  useEffect(() => {
    const speechWindow = window as SpeechRecognitionWindow;
    setSupported(Boolean(speechWindow.SpeechRecognition || speechWindow.webkitSpeechRecognition));
    return () => recognition.current?.stop();
  }, []);

  function toggleListening() {
    setError("");
    if (listening) {
      recognition.current?.stop();
      return;
    }

    const speechWindow = window as SpeechRecognitionWindow;
    const SpeechRecognition = speechWindow.SpeechRecognition || speechWindow.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const instance = new SpeechRecognition();
    instance.lang = navigator.language.toLowerCase().startsWith("ar") ? "ar-EG" : "en-US";
    instance.interimResults = false;
    instance.continuous = false;
    instance.onresult = (event) => {
      const transcript = Array.from(event.results)
        .slice(event.resultIndex)
        .filter((result) => result.isFinal)
        .map((result) => result[0]?.transcript || "")
        .join(" ")
        .trim();
      if (transcript) onTranscript(transcript);
    };
    instance.onerror = () => {
      setError("تعذر استخدام الإملاء الصوتي. تحقق من إذن الميكروفون وحاول مرة أخرى.");
      setListening(false);
    };
    instance.onend = () => setListening(false);
    recognition.current = instance;

    try {
      instance.start();
      setListening(true);
    } catch {
      setError("تعذر بدء الإملاء الصوتي في هذا المتصفح.");
      setListening(false);
    }
  }

  return (
    <button
      type="button"
      disabled={!supported}
      onClick={toggleListening}
      aria-label={listening ? "إيقاف الإملاء الصوتي" : "الإملاء الصوتي"}
      title={error || (supported ? (listening ? "إيقاف الإملاء الصوتي" : "الإملاء الصوتي") : "الإملاء الصوتي غير مدعوم في هذا المتصفح")}
      className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl border transition disabled:cursor-not-allowed disabled:opacity-40 ${
        listening ? "border-rose-300 bg-rose-100 text-rose-700" : "border-rose-100 bg-rose-50 text-rose-600 hover:bg-rose-100"
      }`}
    >
      {listening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
      {error && <span className="sr-only" role="status">{error}</span>}
    </button>
  );
}
