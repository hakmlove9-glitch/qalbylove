"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  createClient,
} from "@/lib/supabase/client";



interface MemberProfileShareCounterProps {

  memberId:string;

}







export default function MemberProfileShareCounter({

  memberId,

}:MemberProfileShareCounterProps){



  const supabase =
    createClient();



  const [

    shares,

    setShares

  ] =

  useState(0);









  async function loadShares(){



    const {

      count,

      error

    } =

      await supabase

        .from("profile_shares")

        .select(

          "id",

          {

            count:"exact",

            head:true,

          }

        )

        .eq(

          "member_id",

          memberId

        );







    if(!error){



      setShares(

        count || 0

      );



    }



  }









  useEffect(()=>{



    loadShares();







    const channel =

      supabase

        .channel(

          `shares-counter-${memberId}`

        )

        .on(

          "postgres_changes",

          {

            event:"INSERT",

            schema:"public",

            table:"profile_shares",

            filter:

              `member_id=eq.${memberId}`

          },

          ()=>{


            loadShares();


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

    <div

      dir="rtl"

      className="
        text-sm
        text-gray-600
        flex
        items-center
        gap-2
      "

    >

      📤

      <span>

        {shares} مشاركة

      </span>



    </div>

  );


}