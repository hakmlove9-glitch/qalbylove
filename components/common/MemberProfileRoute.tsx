"use client";

import {
  useParams,
} from "next/navigation";

import MemberProfilePageClient from "@/components/common/MemberProfilePageClient";



interface MemberProfileRouteProps {

  currentMemberId:string;

}







export default function MemberProfileRoute({

  currentMemberId,

}:MemberProfileRouteProps){



  const params =
    useParams();



  const memberId =

    params?.id as string;









  if(!memberId){



    return (

      <div

        className="
          p-10
          text-center
        "

      >

        لم يتم تحديد العضو

      </div>

    );


  }









  return (

    <MemberProfilePageClient

      memberId={
        memberId
      }

      currentMemberId={
        currentMemberId
      }

    />

  );


}