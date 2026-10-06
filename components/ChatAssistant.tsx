"use client";

import { useState } from "react";

interface ChatAssistantProps {
  memberId?: string;
}

interface Message {
  role: "user" | "assistant";
  content: string;
}


export default function ChatAssistant({
  memberId,
}: ChatAssistantProps) {

  const [open, setOpen] = useState(false);

  const [input, setInput] = useState("");

  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState<Message[]>([]);



  async function sendMessage() {

    if (!input.trim()) return;


    const userMessage: Message = {
      role: "user",
      content: input,
    };


    setMessages((prev) => [
      ...prev,
      userMessage,
    ]);


    setInput("");

    setLoading(true);


    try {

      const response = await fetch(
        "/api/assistant",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            memberId,
            message: userMessage.content,
          }),
        }
      );


      const data = await response.json();


      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            data.reply ||
            "لم أستطع الحصول على إجابة حاليا",
        },
      ]);


    } catch (error) {

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "حدث خطأ في الاتصال بالمساعد",
        },
      ]);

    } finally {

      setLoading(false);

    }
  }



  return (
    <div>

      <button
        onClick={() => setOpen(!open)}
      >
        🤖
      </button>


      {
        open && (
          <div>

            <div>
              {
                messages.map(
                  (message, index) => (
                    <div key={index}>
                      <strong>
                        {
                          message.role === "user"
                          ? "أنت"
                          : "المساعد"
                        }
                      </strong>

                      <p>
                        {message.content}
                      </p>

                    </div>
                  )
                )
              }

              {
                loading &&
                <p>
                  جاري التفكير...
                </p>
              }

            </div>



            <input
              value={input}
              onChange={(e) =>
                setInput(e.target.value)
              }

              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  sendMessage();
                }
              }}

              placeholder="اكتب سؤالك..."
            />


            <button
              onClick={sendMessage}
            >
              إرسال
            </button>


          </div>
        )
      }

    </div>
  );
}