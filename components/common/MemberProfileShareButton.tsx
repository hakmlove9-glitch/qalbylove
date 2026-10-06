"use client";

import {
  useState,
} from "react";

import {
  createClient,
} from "@/lib/supabase/client";



interface MemberProfileShareButtonProps {

  memberId:string;

  currentMemberId?:string;

  name:string;

}







export default function MemberProfileShareButton({

  memberId,

  currentMemberId,

  name,

}:MemberProfileShareButtonProps){



  const supabase =
    createClient();



  const [

    shared,

    setShared

  ] =

  useState(false);







  async function saveShare(){



    if(

      currentMemberId

    ){



      await supabase

        .from("profile_shares")

        .insert({

          member_id:

            memberId,

          shared_by:

            currentMemberId,

          created_at:

            new Date()

              .toISOString(),

        });



    }



  }









  async function share(){



    const url =

      `${window.location.origin}/members/${memberId}`;







    if(

      navigator.share

    ){



      await navigator.share({

        title:

          name,

        text:

          `تعرف على ${name}`,

        url,

      });



    }else{



      await navigator.clipboard.writeText(

        url

      );



    }







    await saveShare();







    setShared(

      true

    );







    setTimeout(()=>{



      setShared(

        false

      );



    },2500);



  }









  return (

    <button

      onClick={
        share
      }

      className="
        flex
        items-center
        gap-2
        rounded-xl
        bg-rose-700
        text-white
        px-6
        py-3
        font-bold
        shadow
      "

    >

      {

        shared

        ?

        "تمت المشاركة ✓"

        :

        "📤 مشاركة الملف"

      }



    </button>

  );


}