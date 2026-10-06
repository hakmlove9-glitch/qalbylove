"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  createClient,
} from "@/lib/supabase/client";


interface MemberMessagesPreviewProps {
  memberId: string;
}


interface MessagePreview {

  id: string;

  sender_id: string;

  content: string;

  type: string;

  read: boolean;

  created_at: string;

}



export default function MemberMessagesPreview({

  memberId,

}: MemberMessagesPreviewProps) {


  const supabase =
    createClient();


  const [
    messages,
    setMessages,
  ] =
    useState<MessagePreview[]>([]);



  const [
    unread,
    setUnread,
  ] =
    useState(0);




  async function loadMessages() {


    const {
      data,
      error,
    } =
      await supabase
        .from("messages")
        .select(`
          id,
          sender_id,
          content,
          type,
          read,
          created_at
        `)
        .eq(
          "receiver_id",
          memberId
        )
        .order(
          "created_at",
          {
            ascending: false,
          }
        )
        .limit(5);



    if (
      !error &&
      data
    ) {

      setMessages(
        data
      );

    }




    const {
      count,
    } =
      await supabase
        .from("messages")
        .select(
          "id",
          {
            count: "exact",
            head: true,
          }
        )
        .eq(
          "receiver_id",
          memberId
        )
        .eq(
          "read",
          false
        );



    setUnread(
      count || 0
    );

  }





  async function markAllRead() {


    await supabase
      .from("messages")
      .update({
        read: true,
      })
      .eq(
        "receiver_id",
        memberId
      )
      .eq(
        "read",
        false
      );



    loadMessages();

  }






  useEffect(() => {


    loadMessages();



    const channel =
      supabase
        .channel(
          `messages-preview-${memberId}`
        )
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "messages",
            filter:
              `receiver_id=eq.${memberId}`,
          },
          () => {

            loadMessages();

          }
        )
        .subscribe();




    return () => {

      supabase.removeChannel(
        channel
      );

    };



  }, [memberId, supabase]);







  return (

    <div

      dir="rtl"

      className="
        rounded-2xl
        bg-white
        p-6
        shadow
      "

    >

      <div

        className="
          mb-5
          flex
          items-center
          justify-between
        "

      >

        <h3

          className="
            text-xl
            font-bold
            text-rose-700
          "

        >

          آخر الرسائل 💌

        </h3>



        {
          unread > 0 && (

            <button

              onClick={
                markAllRead
              }

              className="
                text-sm
                text-rose-700
              "

            >

              {unread} غير مقروءة

            </button>

          )
        }


      </div>





      {
        messages.length === 0

          ?

          (

            <p className="text-gray-500">

              لا توجد رسائل

            </p>

          )

          :

          (

            <div
              className="
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

                      className="
                        border-b
                        pb-3
                      "

                    >

                      <p>

                        {
                          message.type === "voice"

                            ?

                            "🎤 رسالة صوتية"

                            :

                            message.content
                        }

                      </p>



                      <span

                        className="
                          text-xs
                          text-gray-400
                        "

                      >

                        {
                          new Date(
                            message.created_at
                          ).toLocaleString(
                            "ar-EG"
                          )
                        }

                      </span>


                    </div>

                  )
                )
              }


            </div>

          )
      }



    </div>

  );

}