"use client";

import MemberProfileLayoutGrid from "@/components/common/MemberProfileLayoutGrid";
import MemberProfileHero from "@/components/common/MemberProfileHero";
import MemberProfileSections from "@/components/common/MemberProfileSections";
import MemberProfileActivityFeed from "@/components/common/MemberProfileActivityFeed";
import MemberRecommendations from "@/components/common/MemberRecommendations";



interface MemberProfileMainContainerProps {

memberId:string;

currentMemberId:string;

name:string;

image?:string;

city?:string;

age?:number;

}





export default function MemberProfileMainContainer({

memberId,

currentMemberId,

name,

image,

city,

age,

}:MemberProfileMainContainerProps){



return (

<MemberProfileLayoutGrid

memberId={memberId}

>


<div

className="
space-y-8
"

>


<MemberProfileHero

memberId={memberId}

currentMemberId={currentMemberId}

name={name}

image={image}

city={city}

age={age}

/>





<MemberProfileSections

memberId={memberId}

/>





<MemberProfileActivityFeed

memberId={memberId}

/>





<MemberRecommendations

memberId={memberId}

/>



</div>



</MemberProfileLayoutGrid>


);


}