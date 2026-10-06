"use client";

import {
  useEffect,
  useState,
} from "react";

import { createClient } from "@/lib/supabase/client";


interface OnlineStatusProps {

  memberId: string;

}



interface MemberPresence {

  last_seen: string;

}





const supabase = createClient();







export default function OnlineStatus({

  memberId,

}: OnlineStatusProps) {



  const [
    online,
    setOnline
  ] = useState(false);




  const [
    lastSeen,
    setLastSeen
  ] = useState<string | null>(null);









  function calculateStatus(

    date: string | null

  ) {



    if (!date) {

      setOnline(false);

      return;

    }





    const last =

      new Date(
        date
      ).getTime();





    const difference =

      Date.now() - last;





    setOnline(

      difference <

      5 *

      60 *

      1000

    );



  }









  async function loadStatus() {



    if (!memberId) {

      return;

    }





    const {

      data,

      error,

    } = await supabase

      .from("members")

      .select(

        "last_seen"

      )

      .eq(

        "id",

        memberId

      )

      .single();







    if (!error && data) {



      setLastSeen(

        data.last_seen

      );



      calculateStatus(

        data.last_seen

      );


    }



  }









  async function updateMyStatus() {



    if (!memberId) {

      return;

    }





    await supabase

      .from("members")

      .update({

        last_seen:

          new Date()

            .toISOString(),

      })

      .eq(

        "id",

        memberId

      );



  }









  useEffect(() => {



    loadStatus();

    updateMyStatus();






    const timer =

      setInterval(

        () => {

          updateMyStatus();

          loadStatus();

        },

        60000

      );








    const channel = supabase

      .channel(

        `presence-${memberId}`

      )

      .on(

        "postgres_changes",

        {

          event: "UPDATE",

          schema: "public",

          table: "members",

          filter:

            `id=eq.${memberId}`,

        },

        (payload) => {



          const member =

            payload.new as MemberPresence;





          setLastSeen(

            member.last_seen

          );





          calculateStatus(

            member.last_seen

          );



        }

      )

      .subscribe();







    return () => {



      clearInterval(

        timer

      );



      supabase.removeChannel(

        channel

      );



    };



  }, [memberId]);









  return (

    <div

      dir="rtl"

      className="
        inline-flex
        items-center
        gap-2
        text-sm
      "

    >



      <span

        className={`
          w-3
          h-3
          rounded-full
          ${
            online
              ? "bg-green-500"
              : "bg-gray-400"
          }
        `}

      />




      {

        online

        ?

        <span>

          متصل الآن 🟢

        </span>


        :

        <span>

          غير متصل

          {

            lastSeen &&

            ` - ${

              new Date(

                lastSeen

              ).toLocaleString()

            }`

          }

        </span>

      }



    </div>

  );


}