"use client";

import {
  useState,
} from "react";



interface MemberProfileShareModalProps {

  memberId:string;

  name:string;

  open:boolean;

  onClose:()=>void;

}







export default function MemberProfileShareModal({

  memberId,

  name,

  open,

  onClose,

}:MemberProfileShareModalProps){



  const [

    copied,

    setCopied

  ] =

  useState(false);









  if(!open){

    return null;

  }









  const profileUrl =

    `${window.location.origin}/members/${memberId}`;









  async function copy(){



    await navigator.clipboard.writeText(

      profileUrl

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









  async function whatsappShare(){



    const text =

      encodeURIComponent(

        `شاهد ملف ${name}: ${profileUrl}`

      );







    window.open(

      `https://wa.me/?text=${text}`,

      "_blank"

    );



  }









  async function nativeShare(){



    if(

      navigator.share

    ){



      await navigator.share({

        title:

          name,

        text:

          `ملف ${name}`,

        url:

          profileUrl,

      });



    }else{



      copy();



    }



  }









  return (

    <div

      dir="rtl"

      className="
        fixed
        inset-0
        bg-black/40
        z-50
        flex
        items-center
        justify-center
      "

    >



      <div

        className="
          bg-white
          rounded-3xl
          w-96
          p-6
          shadow-xl
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


          <h3

            className="
              text-xl
              font-bold
              text-rose-700
            "

          >

            مشاركة الملف

          </h3>




          <button

            onClick={
              onClose
            }

            className="
              text-gray-500
              text-xl
            "

          >

            ×

          </button>



        </div>







        <div

          className="
            space-y-3
          "

        >



          <button

            onClick={
              nativeShare
            }

            className="
              w-full
              rounded-xl
              bg-rose-700
              text-white
              py-3
              font-bold
            "

          >

            📤 مشاركة مباشرة

          </button>








          <button

            onClick={
              whatsappShare
            }

            className="
              w-full
              rounded-xl
              bg-green-600
              text-white
              py-3
              font-bold
            "

          >

            واتساب

          </button>








          <button

            onClick={
              copy
            }

            className="
              w-full
              rounded-xl
              border
              border-rose-700
              text-rose-700
              py-3
            "

          >

            {
              copied

              ?

              "تم نسخ الرابط ✓"

              :

              "نسخ الرابط"

            }

          </button>




        </div>




      </div>



    </div>

  );


}