"use client";

import {
  useState,
} from "react";



interface MemberProfileMobileActionsProps {

  onMessage:()=>void;

  onLike:()=>void;

  onFavorite:()=>void;

  onShare:()=>void;

}







export default function MemberProfileMobileActions({

  onMessage,

  onLike,

  onFavorite,

  onShare,

}:MemberProfileMobileActionsProps){



  const [

    open,

    setOpen

  ] =

  useState(false);









  return (

    <div

      dir="rtl"

      className="
        fixed
        bottom-5
        right-5
        left-5
        md:hidden
        z-40
      "

    >



      <div

        className="
          bg-white
          rounded-3xl
          shadow-2xl
          p-3
          flex
          justify-around
          items-center
        "

      >



        <button

          onClick={
            onMessage
          }

          className="
            flex
            flex-col
            items-center
            text-rose-700
          "

        >

          💌

          <span

            className="
              text-xs
            "

          >

            رسالة

          </span>


        </button>







        <button

          onClick={
            onLike
          }

          className="
            flex
            flex-col
            items-center
          "

        >

          ❤️

          <span

            className="
              text-xs
            "

          >

            إعجاب

          </span>


        </button>







        <button

          onClick={
            onFavorite
          }

          className="
            flex
            flex-col
            items-center
          "

        >

          ⭐

          <span

            className="
              text-xs
            "

          >

            مفضلة

          </span>


        </button>







        <button

          onClick={()=>setOpen(!open)}

          className="
            flex
            flex-col
            items-center
          "

        >

          ⋮

          <span

            className="
              text-xs
            "

          >

            المزيد

          </span>


        </button>




      </div>







      {
        open && (

          <div

            className="
              absolute
              bottom-20
              right-0
              left-0
              bg-white
              rounded-2xl
              shadow-xl
              p-4
            "

          >


            <button

              onClick={
                onShare
              }

              className="
                w-full
                py-3
                text-right
              "

            >

              📤 مشاركة الملف

            </button>



          </div>

        )

      }




    </div>

  );


}