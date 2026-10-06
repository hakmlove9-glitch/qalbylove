"use client";

import {
  ReactNode,
} from "react";

import MemberProfilePageProvider from "@/components/common/MemberProfilePageProvider";
import MemberProfileRealtimeProvider from "@/components/common/MemberProfileRealtimeProvider";



interface MemberProfileRealtimeWrapperProps {

  memberId:string;

  children:ReactNode;

}







export default function MemberProfileRealtimeWrapper({

  memberId,

  children,

}:MemberProfileRealtimeWrapperProps){



  return (

    <MemberProfilePageProvider>



      <MemberProfileRealtimeProvider

        memberId={
          memberId
        }

      >

        {children}

      </MemberProfileRealtimeProvider>



    </MemberProfilePageProvider>

  );


}