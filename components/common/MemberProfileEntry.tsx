"use client";

import MemberProfileResponsive from "@/components/common/MemberProfileResponsive";



interface MemberProfileEntryProps {

  memberId:string;

  currentMemberId:string;

  name:string;

  image?:string;

  city?:string;

  age?:number;

}







export default function MemberProfileEntry({

  memberId,

  currentMemberId,

  name,

  image,

  city,

  age,

}:MemberProfileEntryProps){



  return (

    <MemberProfileResponsive

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

      age={
        age
      }

    />

  );


}