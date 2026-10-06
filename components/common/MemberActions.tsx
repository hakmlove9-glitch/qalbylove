"use client";

import {
  useState,
} from "react";

import {
  createClient,
} from "@/lib/supabase/client";



interface MemberActionsProps {

  memberId:string;

  currentMemberId:string;

}






export default function MemberActions({

  memberId,

  currentMemberId,

}:MemberActionsProps){



  const supabase =
    createClient();



  const [

    sending,

    setSending

  ] =

  useState(false);



  const [

    reported,

    setReported

  ] =

  useState(false);









  async function sendLike(){



    await supabase

      .from("likes")

      .upsert({

        sender_id:

          currentMemberId,

        receiver_id:

          memberId,

      });



  }








  async function sendRequest(){



    setSending(

      true

    );





    await supabase

      .from("member_requests")

      .insert({

        sender_id:

          currentMemberId,

        receiver_id:

          memberId,

        status:

          "pending",

      });






    setSending(

      false

    );


  }









  async function reportMember(){



    const reason =
      "بلاغ من العضو";




    await supabase

      .from("reports")

      .insert({

        reporter_id:

          currentMemberId,

        reported_id:

          memberId,

        reason,

        status:

          "pending",

      });





    setReported(

      true

    );


  }









  return (

    <div

      dir="rtl"

      className="
        flex
        gap-3
        flex-wrap
      "

    >



      <button

        onClick={
          sendLike
        }

        className="
          rounded-xl
          bg-pink-100
          text-rose-700
          px-5
          py-3
          font-bold
        "

      >

        ❤️ إعجاب

      </button>








      <button

        onClick={
          sendRequest
        }

        disabled={
          sending
        }

        className="
          rounded-xl
          bg-rose-700
          text-white
          px-5
          py-3
          font-bold
        "

      >

        {
          sending

          ?

          "جاري الإرسال..."

          :

          "💌 طلب تواصل"

        }


      </button>








      <button

        onClick={
          reportMember
        }

        disabled={
          reported
        }

        className="
          rounded-xl
          border
          border-gray-300
          px-5
          py-3
        "

      >

        {
          reported

          ?

          "تم البلاغ"

          :

          "⚠️ إبلاغ"

        }


      </button>




    </div>

  );


}