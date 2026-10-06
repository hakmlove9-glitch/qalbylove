"use client";

import {
  useState,
} from "react";

import {
  createClient,
} from "@/lib/supabase/client";



interface MemberVerificationProps {

  memberId:string;

}





export default function MemberVerification({

  memberId,

}:MemberVerificationProps){



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







  async function requestVerification(){



    setLoading(

      true

    );







    const {

      error

    } =

      await supabase

        .from("verification_requests")

        .insert({

          member_id:

            memberId,

          status:

            "pending",

        });







    if(!error){


      setSent(

        true

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
        bg-white
        rounded-2xl
        shadow
        p-6
      "

    >



      <h3

        className="
          text-xl
          font-bold
          text-rose-700
          mb-3
        "

      >

        توثيق الحساب ✅

      </h3>







      <p

        className="
          text-gray-600
          leading-7
        "

      >

        اطلب توثيق ملفك لزيادة ثقة الأعضاء في حسابك.

      </p>







      <button

        onClick={
          requestVerification
        }

        disabled={
          loading ||
          sent
        }

        className="
          qalby-button
          mt-5
          w-full
        "

      >

        {
          sent

          ?

          "تم إرسال الطلب"

          :

          loading

          ?

          "جاري الإرسال..."

          :

          "طلب التوثيق"

        }


      </button>




    </div>

  );


}