"use client";

import MemberProfileBackButton from "@/components/common/MemberProfileBackButton";
import MemberProfileShareButton from "@/components/common/MemberProfileShareButton";



interface MemberProfileTopBarProps {

  memberId:string;

  name:string;

  showBack?:boolean;

}







export default function MemberProfileTopBar({

  memberId,

  name,

  showBack = true,

}:MemberProfileTopBarProps){



  return (

    <div

      dir="rtl"

      className="
        flex
        justify-between
        items-center
        mb-6
      "

    >



      {
        showBack && (

          <MemberProfileBackButton />

        )

      }







      <MemberProfileShareButton

        memberId={
          memberId
        }

        name={
          name
        }

      />




    </div>

  );


}