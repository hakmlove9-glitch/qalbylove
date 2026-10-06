"use client";

import MemberProfileLayout from "@/components/common/MemberProfileLayout";
import MemberProfileSections from "@/components/common/MemberProfileSections";
import MemberDashboardStats from "@/components/common/MemberDashboardStats";
import MemberProfileActivityFeed from "@/components/common/MemberProfileActivityFeed";
import MemberRecommendations from "@/components/common/MemberRecommendations";
import MemberCompatibility from "@/components/common/MemberCompatibility";



interface MemberProfilePageProps {

  memberId:string;

  currentMemberId:string;

  name:string;

  image?:string;

  city?:string;

}







export default function MemberProfilePage({

  memberId,

  currentMemberId,

  name,

  image,

  city,

}:MemberProfilePageProps){



  return (

    <MemberProfileLayout

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

    >



      <div

        className="
          space-y-8
        "

      >



        <MemberDashboardStats

          memberId={
            memberId
          }

        />







        <MemberCompatibility

          memberId={
            memberId
          }

          currentMemberId={
            currentMemberId
          }

        />







        <MemberProfileSections

          memberId={
            memberId
          }

        />







        <MemberProfileActivityFeed

          memberId={
            memberId
          }

        />







        <MemberRecommendations

          memberId={
            memberId
          }

        />





      </div>





    </MemberProfileLayout>

  );


}