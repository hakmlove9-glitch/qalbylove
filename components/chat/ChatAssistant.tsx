"use client";

interface ChatAssistantMessage {
  role: "user" | "assistant";
  text: string;
}

interface ChatAssistantProps {
  messages: ChatAssistantMessage[];
  loading?: boolean;
  isOpen: boolean;
  onToggle: () => void;
  onSend?: (message: string) => void;
  value?: string;
  onChange?: (value: string) => void;
}

export default function ChatAssistant({
  messages,
  loading = false,
  isOpen,
  onToggle,
  onSend,
  value = "",
  onChange,
}: ChatAssistantProps) {
  return (
    <div
      dir="rtl"
      className="fixed bottom-6 right-24 z-40"
    >
      <button
        onClick={onToggle}
        className="w-14 h-14 rounded-full bg-white shadow-xl text-3xl"
      >
        🤖
      </button>

      {isOpen && (
        <div className="absolute bottom-16 right-0 w-80 bg-white rounded-2xl shadow-xl p-4">
          <h3 className="font-bold text-rose-700 mb-4">
            مساعد قلبي لوڤي
          </h3>

          <div className="h-60 overflow-y-auto space-y-2">
            {messages.map((item, index) => (
              <div
                key={`${item.role}-${index}`}
                className={`p-2 rounded-xl ${
                  item.role === "user"
                    ? "bg-rose-100"
                    : "bg-gray-100"
                }`}
              >
                {item.text}
              </div>
            ))}

            {loading && <p>جاري التفكير...</p>}
          </div>

          <div className="flex gap-2 mt-3">
            <input
              value={value}
              onChange={(event) =>
                onChange?.(event.target.value)
              }
              className="flex-1 border rounded-xl p-2"
              placeholder="اسأل المساعد..."
            />

            <button
              onClick={() => onSend?.(value)}
              className="bg-rose-700 text-white rounded-xl px-3"
            >
              ➤
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
