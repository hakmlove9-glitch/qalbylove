"use client";

import MemberProfilePage from "@/components/common/MemberProfilePage";
import MemberNotifications from "@/components/common/MemberNotifications";
import MemberMessagesPreview from "@/components/common/MemberMessagesPreview";
import MemberRequestsList from "@/components/common/MemberRequestsList";
import MemberFavoritesList from "@/components/common/MemberFavoritesList";



interface MemberProfileCompleteProps {

  memberId:string;

  currentMemberId:string;

  name:string;

  image?:string;

  city?:string;

}







export default function MemberProfileComplete({

  memberId,

  currentMemberId,

  name,

  image,

  city,

}:MemberProfileCompleteProps){



  return (

    <div

      className="
        space-y-8
      "

    >



      <MemberProfilePage

        memberId={
          memberId
        }

        currentMemberId={
          currentMemberId
        }

        name={
          name
        }

        image={
          image
        }

        city={
          city
        }

      />







      <div

        dir="rtl"

        className="
          max-w-6xl
          mx-auto
          px-4
          space-y-8
        "

      >



        <MemberNotifications

          memberId={
            currentMemberId
          }

        />







        <MemberMessagesPreview

          memberId={
            currentMemberId
          }

        />







        <MemberRequestsList

          memberId={
            currentMemberId
          }

        />







        <MemberFavoritesList

          memberId={
            currentMemberId
          }

        />





      </div>




    </div>

  );


}