"use client";



interface MemberProfileErrorProps {

  message?:string;

}







export default function MemberProfileError({

  message = "حدث خطأ أثناء تحميل الملف",

}:MemberProfileErrorProps){



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
          text-center
          max-w-md
        "

      >



        <div

          className="
            text-5xl
            mb-4
          "

        >

          ⚠️

        </div>







        <h2

          className="
            text-xl
            font-bold
            text-gray-800
            mb-3
          "

        >

          تعذر فتح الملف

        </h2>







        <p

          className="
            text-gray-500
          "

        >

          {message}

        </p>




      </div>




    </div>

  );


}