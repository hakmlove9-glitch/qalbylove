"use client";

import {
  ReactNode,
} from "react";

import MemberProfileRealtimeWrapper from "@/components/common/MemberProfileRealtimeWrapper";



interface MemberProfileRealtimeClientProps {

  memberId:string;

  children:ReactNode;

}







export default function MemberProfileRealtimeClient({

  memberId,

  children,

}:MemberProfileRealtimeClientProps){



  return (

    <MemberProfileRealtimeWrapper

      memberId={
        memberId
      }

    >

      {children}

    </MemberProfileRealtimeWrapper>

  );


}