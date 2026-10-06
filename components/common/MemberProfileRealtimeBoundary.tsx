"use client";

import {
  ReactNode,
} from "react";

import MemberProfileRealtimeClient from "@/components/common/MemberProfileRealtimeClient";



interface MemberProfileRealtimeBoundaryProps {

  memberId:string;

  children:ReactNode;

}







export default function MemberProfileRealtimeBoundary({

  memberId,

  children,

}:MemberProfileRealtimeBoundaryProps){



  return (

    <MemberProfileRealtimeClient

      memberId={
        memberId
      }

    >

      {children}

    </MemberProfileRealtimeClient>

  );


}