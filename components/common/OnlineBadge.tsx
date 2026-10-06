"use client";

import {
  useEffect,
  useState,
} from "react";

import { createClient } from "@/lib/supabase/client";


interface OnlineBadgeProps {

  memberId: string;

}



interface MemberStatus {

  last_seen: string | null;

}





const supabase = createClient();








export default function OnlineBadge({

  memberId,

}: OnlineBadgeProps) {



  const [
    online,
    setOnline
  ] = useState(false);





  const [
    lastSeen,
    setLastSeen
  ] = useState<string | null>(null);








  function checkTime(
    value: string
  ) {


    const last =
      new Date(
        value
      )
      .getTime();




    const now =
      Date.now();




    const diff =
      now - last;




    setOnline(
      diff <
      5 *
      60 *
      1000
    );


  }









  async function loadStatus() {



    const {
      data,
      error
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






    if (

      !error &&

      data?.last_seen

    ) {


      setLastSeen(
        data.last_seen
      );


      checkTime(
        data.last_seen
      );


    }


  }









  useEffect(() => {



    loadStatus();






    const channel = supabase

      .channel(
        `online-${memberId}`
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


          const item =
            payload.new as MemberStatus;




          if (

            item.last_seen

          ) {


            setLastSeen(
              item.last_seen
            );



            checkTime(
              item.last_seen
            );


          }


        }

      )

      .subscribe();







    return () => {

      supabase.removeChannel(
        channel
      );

    };



  }, [memberId]);









  return (

    <span

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
            ?
            "bg-green-500"
            :
            "bg-gray-400"
          }
        `}

      />





      {

        online

        ?

        "متصل الآن"

        :

        lastSeen

        ?

        `آخر ظهور ${
          new Date(
            lastSeen
          )
          .toLocaleString()
        }`

        :

        "غير متصل"

      }




    </span>

  );


}