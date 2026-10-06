"use client";

import {
  useState,
} from "react";



interface MemberProfileShareMenuProps {

  memberId:string;

  name:string;

}







export default function MemberProfileShareMenu({

  memberId,

  name,

}:MemberProfileShareMenuProps){



  const [

    open,

    setOpen

  ] =

  useState(false);



  const [

    copied,

    setCopied

  ] =

  useState(false);









  const url =

    typeof window !== "undefined"

    ?

    `${window.location.origin}/members/${memberId}`

    :

    "";









  async function copyLink(){



    await navigator.clipboard.writeText(

      url

    );







    setCopied(

      true

    );







    setTimeout(()=>{



      setCopied(

        false

      );



    },2000);



  }









  function shareFacebook(){



    window.open(

      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,

      "_blank"

    );



  }









  function shareWhatsapp(){



    window.open(

      `https://wa.me/?text=${encodeURIComponent(

        `شاهد ملف ${name}: ${url}`

      )}`,

      "_blank"

    );



  }









  return (

    <div

      dir="rtl"

      className="
        relative
      "

    >



      <button

        onClick={()=>setOpen(!open)}

        className="
          rounded-xl
          bg-gray-100
          px-5
          py-3
          font-bold
        "

      >

        📤 مشاركة

      </button>







      {
        open && (

          <div

            className="
              absolute
              right-0
              mt-3
              w-56
              bg-white
              rounded-2xl
              shadow-xl
              p-4
              z-40
            "

          >



            <button

              onClick={
                shareWhatsapp
              }

              className="
                w-full
                text-right
                py-2
              "

            >

              واتساب 💚

            </button>







            <button

              onClick={
                shareFacebook
              }

              className="
                w-full
                text-right
                py-2
              "

            >

              فيسبوك 🔵

            </button>







            <button

              onClick={
                copyLink
              }

              className="
                w-full
                text-right
                py-2
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





          </div>

        )

      }




    </div>

  );


}