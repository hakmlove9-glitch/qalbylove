"use client";

import {
  ReactNode,
} from "react";

import MemberProfileRealtimeBoundary from "@/components/common/MemberProfileRealtimeBoundary";



interface MemberProfileRealtimeLayoutProps {

  memberId:string;

  children:ReactNode;

}







export default function MemberProfileRealtimeLayout({

  memberId,

  children,

}:MemberProfileRealtimeLayoutProps){



  return (

    <MemberProfileRealtimeBoundary

      memberId={
        memberId
      }

    >

      {children}

    </MemberProfileRealtimeBoundary>

  );


}