"use client";

import {
  useState,
} from "react";

import {
  createClient,
} from "@/lib/supabase/client";



interface MemberProfileShareProps {

  memberId:string;

  memberName:string;

}







export default function MemberProfileShare({

  memberId,

  memberName,

}:MemberProfileShareProps){



  const supabase =
    createClient();



  const [

    copied,

    setCopied

  ] =

  useState(false);



  const [

    shared,

    setShared

  ] =

  useState(false);









  async function registerShare(){



    await supabase

      .from("profile_shares")

      .insert({

        member_id:

          memberId,

        created_at:

          new Date()

            .toISOString(),

      });



  }









  async function copyProfile(){



    const url =

      `${window.location.origin}/members/${memberId}`;







    await navigator.clipboard.writeText(

      url

    );







    await registerShare();







    setCopied(

      true

    );



    setTimeout(()=>{


      setCopied(

        false

      );


    },2000);



  }









  async function nativeShare(){



    const url =

      `${window.location.origin}/members/${memberId}`;







    if(

      navigator.share

    ){



      await navigator.share({

        title:

          `ملف ${memberName}`,

        text:

          "شاهد هذا الملف",

        url,

      });







      await registerShare();







      setShared(

        true

      );



    }else{



      copyProfile();



    }



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
          nativeShare
        }

        className="
          rounded-xl
          bg-rose-700
          text-white
          px-6
          py-3
          font-bold
        "

      >

        📤 مشاركة الملف

      </button>








      <button

        onClick={
          copyProfile
        }

        className="
          rounded-xl
          border
          border-rose-700
          text-rose-700
          px-6
          py-3
          font-bold
        "

      >

        {
          copied

          ?

          "تم النسخ ✓"

          :

          "نسخ الرابط"

        }


      </button>








      {
        shared && (

          <span

            className="
              text-green-600
              self-center
            "

          >

            تم المشاركة

          </span>

        )

      }





    </div>

  );


}