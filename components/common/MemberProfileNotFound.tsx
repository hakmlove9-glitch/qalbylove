"use client";

import Link from "next/link";



interface MemberProfileNotFoundProps {

  memberId?:string;

}







export default function MemberProfileNotFound({

  memberId,

}:MemberProfileNotFoundProps){



  return (

    <div

      dir="rtl"

      className="
        min-h-screen
        bg-gray-50
        flex
        items-center
        justify-center
        p-6
      "

    >



      <div

        className="
          bg-white
          rounded-3xl
          shadow
          p-10
          text-center
          max-w-md
        "

      >



        <div

          className="
            text-6xl
            mb-5
          "

        >

          💔

        </div>







        <h1

          className="
            text-2xl
            font-bold
            text-gray-800
            mb-3
          "

        >

          الملف غير موجود

        </h1>







        <p

          className="
            text-gray-500
            leading-7
          "

        >

          ربما تم حذف هذا الملف أو أصبح غير متاح حالياً.

        </p>







        <Link

          href="/members"

          className="
            inline-block
            mt-6
            bg-rose-700
            text-white
            rounded-xl
            px-8
            py-3
            font-bold
          "

        >

          العودة للأعضاء

        </Link>




      </div>




    </div>

  );


}