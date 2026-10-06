"use client";



interface MemberProfileEmptyProps {

  title?:string;

  message?:string;

}







export default function MemberProfileEmpty({

  title = "لا يوجد محتوى",

  message = "لم يتم إضافة بيانات لهذا القسم بعد",

}:MemberProfileEmptyProps){



  return (

    <div

      dir="rtl"

      className="
        bg-white
        rounded-3xl
        shadow
        p-8
        text-center
      "

    >



      <div

        className="
          text-5xl
          mb-4
        "

      >

        📭

      </div>







      <h3

        className="
          text-xl
          font-bold
          text-gray-800
          mb-2
        "

      >

        {title}

      </h3>







      <p

        className="
          text-gray-500
        "

      >

        {message}

      </p>




    </div>

  );


}