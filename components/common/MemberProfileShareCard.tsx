"use client";

import {
  useState,
} from "react";



interface MemberProfileShareCardProps {

  memberId:string;

  name:string;

  image?:string;

  city?:string;

}







export default function MemberProfileShareCard({

  memberId,

  name,

  image,

  city,

}:MemberProfileShareCardProps){



  const [

    copied,

    setCopied

  ] =

  useState(false);








  async function copyLink(){



    const link =

      `${window.location.origin}/members/${memberId}`;







    await navigator.clipboard.writeText(

      link

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









  async function shareProfile(){



    const link =

      `${window.location.origin}/members/${memberId}`;







    if(

      navigator.share

    ){



      await navigator.share({

        title:

          name,

        text:

          `شاهد ملف ${name}`,

        url:

          link,

      });



    }else{



      copyLink();



    }



  }









  return (

    <div

      dir="rtl"

      className="
        bg-white
        rounded-3xl
        shadow-lg
        p-5
        flex
        items-center
        gap-4
      "

    >



      <img

        src={

          image ||

          "/avatar.png"

        }

        alt={name}

        className="
          w-20
          h-20
          rounded-full
          object-cover
        "

      />







      <div

        className="
          flex-1
        "

      >



        <h3

          className="
            font-bold
            text-xl
          "

        >

          {name}

        </h3>





        {
          city && (

            <p

              className="
                text-gray-500
              "

            >

              📍 {city}

            </p>

          )

        }







        <div

          className="
            mt-3
            flex
            gap-2
          "

        >



          <button

            onClick={
              shareProfile
            }

            className="
              bg-rose-700
              text-white
              rounded-xl
              px-4
              py-2
              font-bold
            "

          >

            مشاركة

          </button>







          <button

            onClick={
              copyLink
            }

            className="
              border
              border-rose-700
              text-rose-700
              rounded-xl
              px-4
              py-2
            "

          >

            {
              copied

              ?

              "تم النسخ"

              :

              "نسخ الرابط"

            }

          </button>





        </div>



      </div>




    </div>

  );


}