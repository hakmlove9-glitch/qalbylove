"use client";



export default function MemberProfileLoading(){



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
          p-8
          w-full
          max-w-xl
          text-center
        "

      >



        <div

          className="
            w-24
            h-24
            mx-auto
            rounded-full
            bg-gray-200
            animate-pulse
            mb-5
          "

        />





        <div

          className="
            h-6
            bg-gray-200
            rounded-lg
            w-1/2
            mx-auto
            animate-pulse
            mb-4
          "

        />







        <div

          className="
            h-4
            bg-gray-200
            rounded-lg
            w-3/4
            mx-auto
            animate-pulse
          "

        />





        <p

          className="
            mt-6
            text-gray-500
          "

        >

          جاري تجهيز ملف العضو...

        </p>




      </div>




    </div>

  );


}