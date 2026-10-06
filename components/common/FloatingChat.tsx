"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/app/context/AuthContext";

export default function FloatingChat() {
  const { isLoggedIn } = useAuth();

  const [open, setOpen] = useState(false);
  const [conversations, setConversations] = useState<any[]>([]);
  const [active, setActive] = useState<any>(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    if (!isLoggedIn) return;

    fetch("/api/messages")
      .then((r) => r.json())
      .then((data) => {
        setConversations(
          data.conversations || []
        );
      });

  }, [isLoggedIn]);



  async function sendMessage() {

    if (!message.trim() || !active) return;


    setLoading(true);


    await fetch("/api/messages", {

      method:"POST",

      headers:{
        "Content-Type":"application/json",
      },

      body:JSON.stringify({

        receiverId:
          active.memberId,

        content:
          message,

      }),

    });



    setMessages(prev=>[

      ...prev,

      {
        content:message,
        mine:true,
      }

    ]);


    setMessage("");

    setLoading(false);

  }



  if(!isLoggedIn) return null;



  return (

    <div
      dir="rtl"
      className="
        fixed
        bottom-6
        left-6
        z-[999]
      "
    >



      {
        open && (

          <div
            className="
              mb-4
              w-[360px]
              max-w-[90vw]
              h-[520px]
              bg-white
              rounded-[32px]
              shadow-2xl
              overflow-hidden
              border
              border-pink-100
              animate-in
            "
          >


            <div
              className="
                bg-gradient-to-r
                from-rose-600
                to-pink-400
                text-white
                p-5
                flex
                items-center
                justify-between
              "
            >

              <div>

                <h3
                  className="
                    font-black
                    text-lg
                  "
                >
                  💬 قلبي لوڤي
                </h3>

                <p
                  className="
                    text-xs
                    opacity-90
                  "
                >
                  تواصل بأمان ❤️
                </p>

              </div>


              <button
                onClick={()=>
                  setOpen(false)
                }
                className="
                  text-xl
                "
              >
                ✕
              </button>


            </div>




            {
              !active ? (

                <div
                  className="
                    p-4
                    h-[420px]
                    overflow-y-auto
                  "
                >

                  {
                    conversations.length===0 && (

                      <div
                        className="
                          text-center
                          text-gray-400
                          mt-20
                        "
                      >
                        لا توجد محادثات
                      </div>

                    )
                  }



                  {
                    conversations.map((c)=>(

                      <button

                        key={c.memberId}

                        onClick={()=>{

                          setActive(c);

                          setMessages([

                            {
                              content:
                                c.lastMessage,

                              mine:false,

                            }

                          ]);

                        }}

                        className="
                          w-full
                          p-4
                          mb-3
                          rounded-3xl
                          bg-pink-50
                          hover:bg-pink-100
                          transition
                          text-right
                        "

                      >

                        <div
                          className="
                            font-black
                            text-rose-700
                          "
                        >
                          عضو قلبي لوڤي
                        </div>


                        <div
                          className="
                            text-sm
                            text-gray-500
                            mt-1
                          "
                        >
                          {c.lastMessage}
                        </div>


                      </button>

                    ))
                  }


                </div>


              ):(


                <div
                  className="
                    flex
                    flex-col
                    h-[420px]
                  "
                >

                  <div
                    className="
                      flex-1
                      p-4
                      overflow-y-auto
                      space-y-3
                    "
                  >

                    {
                      messages.map((m,i)=>(

                        <div
                          key={i}

                          className={`
                            max-w-[80%]
                            p-3
                            rounded-3xl
                            ${
                              m.mine
                              ?
                              "bg-rose-600 text-white mr-auto"
                              :
                              "bg-gray-100 ml-auto"
                            }
                          `}
                        >

                          {m.content}

                        </div>

                      ))
                    }


                  </div>



                  <div
                    className="
                      p-3
                      border-t
                      flex
                      gap-2
                    "
                  >

                    <input

                      value={message}

                      onChange={
                        e=>
                        setMessage(e.target.value)
                      }

                      placeholder="
                      اكتب رسالة...
                      "

                      className="
                        flex-1
                        rounded-full
                        border
                        px-4
                        outline-none
                      "

                    />


                    <button

                      disabled={loading}

                      onClick={sendMessage}

                      className="
                        w-12
                        h-12
                        rounded-full
                        bg-rose-600
                        text-white
                      "

                    >

                      ➤

                    </button>


                  </div>


                </div>


              )
            }



          </div>

        )
      }




      <button

        onClick={()=>
          setOpen(!open)
        }

        className="
          w-20
          h-20
          rounded-full
          bg-gradient-to-br
          from-rose-600
          to-pink-400
          text-white
          text-4xl
          shadow-2xl
          flex
          items-center
          justify-center
          hover:scale-110
          transition
        "

      >

        💬

      </button>



    </div>

  );

}