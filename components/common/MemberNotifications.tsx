"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  createClient,
} from "@/lib/supabase/client";



interface MemberNotificationsProps {

  memberId:string;

}







interface NotificationItem {

  id:string;

  title:string;

  message:string;

  type:string;

  read:boolean;

  created_at:string;

}







export default function MemberNotifications({

  memberId,

}:MemberNotificationsProps){



  const supabase =
    createClient();



  const [

    notifications,

    setNotifications

  ] =

  useState<NotificationItem[]>([]);



  const [

    unread,

    setUnread

  ] =

  useState(0);









  async function loadNotifications(){



    const {

      data,

      error

    } =

      await supabase

        .from("notifications")

        .select(`

          id,

          title,

          message,

          type,

          read,

          created_at

        `)

        .eq(

          "member_id",

          memberId

        )

        .order(

          "created_at",

          {

            ascending:false

          }

        )

        .limit(20);







    if(

      !error &&

      data

    ){



      setNotifications(

        data

      );



      setUnread(

        data.filter(

          item=>!

            item.read

        ).length

      );



    }



  }









  async function markRead(

    id:string

  ){



    await supabase

      .from("notifications")

      .update({

        read:true

      })

      .eq(

        "id",

        id

      );







    loadNotifications();



  }









  async function markAllRead(){



    await supabase

      .from("notifications")

      .update({

        read:true

      })

      .eq(

        "member_id",

        memberId

      )

      .eq(

        "read",

        false

      );







    loadNotifications();



  }









  useEffect(()=>{



    loadNotifications();







    const channel =

      supabase

        .channel(

          `notifications-${memberId}`

        )

        .on(

          "postgres_changes",

          {

            event:"INSERT",

            schema:"public",

            table:"notifications",

            filter:

              `member_id=eq.${memberId}`

          },

          ()=>{


            loadNotifications();


          }

        )

        .subscribe();







    return ()=>{



      supabase.removeChannel(

        channel

      );



    };



  },[memberId]);









  return (

    <section

      dir="rtl"

      className="
        bg-white
        rounded-2xl
        shadow
        p-6
      "

    >



      <div

        className="
          flex
          justify-between
          items-center
          mb-5
        "

      >



        <h2

          className="
            text-xl
            font-bold
            text-rose-700
          "

        >

          الإشعارات 🔔

        </h2>






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

              قراءة الكل

            </button>

          )

        }



      </div>








      {
        notifications.length === 0

        ?

        (

          <p

            className="
              text-gray-500
            "

          >

            لا توجد إشعارات

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
              notifications.map(

                item=>(


                  <button

                    key={
                      item.id
                    }

                    onClick={()=>markRead(
                      item.id
                    )}

                    className={`
                      w-full
                      text-right
                      rounded-xl
                      p-4
                      border
                      ${
                        item.read

                        ?

                        "bg-white"

                        :

                        "bg-rose-50"

                      }
                    `}

                  >


                    <div

                      className="
                        font-bold
                      "

                    >

                      {item.title}

                    </div>



                    <p

                      className="
                        text-gray-600
                        mt-1
                      "

                    >

                      {item.message}

                    </p>



                    <span

                      className="
                        text-xs
                        text-gray-400
                      "

                    >

                      {
                        new Date(

                          item.created_at

                        )

                        .toLocaleString(

                          "ar-EG"

                        )

                      }

                    </span>



                  </button>


                )

              )

            }



          </div>

        )

      }





    </section>

  );


}