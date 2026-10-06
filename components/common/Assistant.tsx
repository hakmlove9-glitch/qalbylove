"use client";

import {
  useState,
  useEffect,
} from "react";

import {
  createClient,
} from "@/lib/supabase/client";



interface AssistantProps {

  memberId?: string;

}





interface ChatMessage {

  id: string;

  role:
    | "user"
    | "assistant";

  content: string;

  created_at?: string;

}






export default function Assistant({

  memberId,

}: AssistantProps) {


  const supabase =
    createClient();



  const [
    open,
    setOpen
  ] =
    useState(false);



  const [
    input,
    setInput
  ] =
    useState("");



  const [
    loading,
    setLoading
  ] =
    useState(false);



  const [
    messages,
    setMessages
  ] =
    useState<ChatMessage[]>([]);








  useEffect(() => {


    if (!memberId) {

      return;

    }



    loadHistory();




  }, [memberId]);








  async function loadHistory() {


    const {
      data,
    } =
      await supabase
        .from("assistant_logs")
        .select(
          "*"
        )
        .eq(
          "member_id",
          memberId
        )
        .order(
          "created_at",
          {
            ascending: true,
          }
        );





    if (data) {


      const history =
        data.flatMap(
          (item:any) => [

            {

              id:
                item.id,

              role:
                "user",

              content:
                item.question,

            },


            {

              id:
                `${item.id}-reply`,

              role:
                "assistant",

              content:
                item.answer,

            },


          ]

        );



      setMessages(
        history as ChatMessage[]
      );


    }


  }








  async function sendMessage() {


    if (!input.trim()) {

      return;

    }



    const question =
      input;



    setInput("");



    setMessages(
      (prev) => [

        ...prev,

        {

          id:
            Date.now()
              .toString(),

          role:
            "user",

          content:
            question,

        },

      ]
    );



    setLoading(
      true
    );






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
                  question,

              }),

          }
        );





      const result =
        await response.json();





      setMessages(
        (prev) => [

          ...prev,

          {

            id:
              Date.now()
                .toString(),

            role:
              "assistant",

            content:
              result.reply ||
              "أنا هنا لمساعدتك ❤️",

          },

        ]
      );



    } catch {


      setMessages(
        (prev) => [

          ...prev,

          {

            id:
              Date.now()
                .toString(),

            role:
              "assistant",

            content:
              "حدث خطأ، حاول مرة أخرى.",

          },

        ]
      );


    }



    setLoading(
      false
    );


  }









  return (

    <div

      dir="rtl"

      className="
        fixed
        bottom-6
        left-6
        z-40
      "

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
              shadow-xl
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

              مساعد قلبي لوڤي

            </h3>






            <div

              className="
                h-64
                overflow-y-auto
                space-y-3
              "

            >


              {
                messages.map(
                  (message) => (

                    <div

                      key={
                        message.id
                      }

                      className={`
                        p-2
                        rounded-xl
                        ${
                          message.role === "user"
                          ? "bg-rose-100"
                          : "bg-gray-100"
                        }
                      `}

                    >

                      {message.content}

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
                mt-3
              "

            >


              <input

                value={
                  input
                }

                onChange={(e) =>
                  setInput(
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
                  sendMessage
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