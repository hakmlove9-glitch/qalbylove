"use client";

import {
  useRouter,
} from "next/navigation";



interface MemberProfileBackButtonProps {

  text?:string;

}







export default function MemberProfileBackButton({

  text = "العودة",

}:MemberProfileBackButtonProps){



  const router =
    useRouter();









  return (

    <button

      onClick={()=>router.back()}

      dir="rtl"

      className="
        inline-flex
        items-center
        gap-2
        rounded-xl
        bg-gray-100
        text-gray-700
        px-5
        py-3
        font-bold
        hover:bg-gray-200
        transition
      "

    >

      ← {text}

    </button>

  );


}