"use client";

import MemberProfileHeader from "@/components/common/MemberProfileHeader";
import MemberProfileGallery from "@/components/common/MemberProfileGallery";
import MemberProfileShareButton from "@/components/common/MemberProfileShareButton";



interface MemberProfileHeroProps {

memberId:string;

currentMemberId:string;

name:string;

image?:string;

city?:string;

age?:number;

}





export default function MemberProfileHero({

memberId,

currentMemberId,

name,

image,

city,

age,

}:MemberProfileHeroProps){



return (

<section

dir="rtl"

className="
space-y-8
"

>


<div

className="
rounded-[45px]
overflow-hidden
bg-gradient-to-br
from-rose-700
via-pink-500
to-pink-200
p-6
shadow-2xl
"

>


<MemberProfileHeader

memberId={memberId}

currentMemberId={currentMemberId}

name={name}

image={image}

city={city}

age={age}

/>


</div>





<div

className="
bg-white
rounded-[40px]
shadow-xl
border
border-pink-100
p-5
"

>


<MemberProfileGallery

memberId={memberId}

/>


</div>







<div

className="
bg-white
rounded-[35px]
shadow-xl
border
border-pink-100
p-6
flex
justify-center
"

>


<MemberProfileShareButton

memberId={memberId}

currentMemberId={currentMemberId}

name={name}

/>


</div>




</section>


);


}