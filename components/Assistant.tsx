"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";


interface AssistantProps {

  memberId?: string;

}



interface AssistantMessage {

  role: "user" | "assistant";

  text: string;

}



export default function Assistant({

  memberId,

}: AssistantProps) {


  const [open, setOpen] =
    useState(false);


  const [question, setQuestion] =
    useState("");



  const [loading, setLoading] =
    useState(false);



  const [messages, setMessages] =
    useState<AssistantMessage[]>([]);



  const supabase =
    createClient();







  async function saveInteraction(

    userText: string,

    assistantText: string

  ) {


    if (!memberId) return;



    await supabase
      .from("assistant_logs")
      .insert({

        member_id:
          memberId,

        question:
          userText,

        answer:
          assistantText,

      });


  }








  async function sendQuestion() {


    if (!question.trim()) {

      return;

    }



    const current =
      question;



    setMessages(
      (prev) => [

        ...prev,

        {

          role:
            "user",

          text:
            current,

        },

      ]
    );



    setQuestion("");

    setLoading(true);





    try {


      const response =
        await fetch(
          "/api/assistant",
          {

            method:
              "POST",

            headers:
              {

                "Content-Type":
                  "application/json",

              },


            body:
              JSON.stringify({

                memberId,

                message:
                  current,

              }),

          }
        );





      const data =
        await response.json();



      const reply =
        data.reply ||
        "لم أجد إجابة حاليا";




      setMessages(
        (prev) => [

          ...prev,

          {

            role:
              "assistant",

            text:
              reply,

          },

        ]
      );




      await saveInteraction(

        current,

        reply

      );




    } catch {

      setMessages(
        (prev) => [

          ...prev,

          {

            role:
              "assistant",

            text:
              "حدث خطأ أثناء الاتصال بالمساعد",

          },

        ]
      );

    }





    setLoading(false);


  }







  return (

    <div
      className="
        fixed
        bottom-6
        left-6
        z-40
      "
      dir="rtl"
    >



      <button

        onClick={() =>
          setOpen(
            !open
          )
        }

        className="
          w-14
          h-14
          rounded-full
          bg-rose-700
          text-white
          shadow-xl
          text-2xl
        "

      >

        🤖

      </button>





      {
        open && (

          <div

            className="
              absolute
              bottom-16
              left-0
              w-80
              bg-white
              rounded-2xl
              shadow-2xl
              p-4
            "

          >



            <h3
              className="
                font-bold
                text-rose-700
                mb-4
              "
            >

              مساعد قلبي لوڤي 🤖

            </h3>





            <div

              className="
                h-60
                overflow-y-auto
                space-y-3
              "

            >


              {
                messages.map(
                  (item,index) => (

                    <div
                      key={index}
                      className="
                        p-2
                        rounded-xl
                        bg-rose-50
                      "
                    >

                      {item.text}

                    </div>

                  )
                )
              }



              {
                loading && (

                  <p>
                    جاري التفكير...
                  </p>

                )
              }



            </div>





            <div
              className="
                flex
                gap-2
                mt-4
              "
            >

              <input

                value={
                  question
                }

                onChange={(e) =>
                  setQuestion(
                    e.target.value
                  )
                }

                className="
                  flex-1
                  border
                  rounded-xl
                  p-2
                "

                placeholder="اكتب سؤالك..."

              />



              <button

                onClick={
                  sendQuestion
                }

                className="
                  bg-rose-700
                  text-white
                  px-3
                  rounded-xl
                "

              >

                إرسال

              </button>


            </div>



          </div>

        )

      }


    </div>

  );

}