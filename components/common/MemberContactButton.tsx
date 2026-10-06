"use client";

import {
  useState,
} from "react";

import {
  createClient,
} from "@/lib/supabase/client";



interface MemberContactButtonProps {

  memberId: string;

  currentMemberId: string;

}







export default function MemberContactButton({

  memberId,

  currentMemberId,

}: MemberContactButtonProps) {



  const supabase =
    createClient();



  const [

    loading,

    setLoading

  ] =

    useState(false);



  const [

    sent,

    setSent

  ] =

    useState(false);









  async function sendContactRequest() {



    if (

      loading ||

      sent

    ) {

      return;

    }







    setLoading(

      true

    );








    const {

      data: existing

    } =

      await supabase

        .from("member_requests")

        .select(

          "id,status"

        )

        .eq(

          "sender_id",

          currentMemberId

        )

        .eq(

          "receiver_id",

          memberId

        )

        .maybeSingle();








    if (!existing) {



      await supabase

        .from("member_requests")

        .insert({

          sender_id:

            currentMemberId,

          receiver_id:

            memberId,

          status:

            "pending",

          created_at:

            new Date()

              .toISOString(),

        });



    }








    setSent(

      true

    );



    setLoading(

      false

    );



  }









  return (

    <button

      onClick={
        sendContactRequest
      }

      disabled={
        loading ||
        sent
      }

      className="
        rounded-xl
        bg-rose-700
        text-white
        px-7
        py-3
        font-bold
        shadow
      "

    >

      {
        sent

          ?

          "تم إرسال طلب الزواج الجاد 💌"

          :

          loading

            ?

            "جاري الإرسال..."

            :

            "طلب زواج جاد ❤️"

      }


    </button>

  );


}