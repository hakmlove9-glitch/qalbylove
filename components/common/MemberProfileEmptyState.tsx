"use client";



interface MemberProfileEmptyStateProps {

  icon?:string;

  title:string;

  description:string;

  actionText?:string;

  onAction?:()=>void;

}







export default function MemberProfileEmptyState({

  icon = "✨",

  title,

  description,

  actionText,

  onAction,

}:MemberProfileEmptyStateProps){



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

        {icon}

      </div>







      <h3

        className="
          text-xl
          font-bold
          text-gray-800
          mb-3
        "

      >

        {title}

      </h3>







      <p

        className="
          text-gray-500
          leading-7
        "

      >

        {description}

      </p>







      {
        actionText && (

          <button

            onClick={
              onAction
            }

            className="
              mt-5
              rounded-xl
              bg-rose-700
              text-white
              px-6
              py-3
              font-bold
            "

          >

            {actionText}

          </button>

        )

      }




    </div>

  );


}