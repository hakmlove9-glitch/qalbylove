"use client";

import MemberVerificationBadge from "@/components/common/MemberVerificationBadge";
import MemberLastSeen from "@/components/common/MemberLastSeen";
import MemberProfileMenu from "@/components/common/MemberProfileMenu";
import FounderBadge from "@/components/common/FounderBadge";



interface MemberProfileHeaderProps {

memberId:string;

currentMemberId:string;

name:string;

image?:string;

city?:string;

age?:number;

isFounder?:boolean;

}





export default function MemberProfileHeader({

memberId,

currentMemberId,

name,

image,

city,

age,

isFounder=false,

}:MemberProfileHeaderProps){



return (

<header

dir="rtl"

className="
relative
overflow-hidden
rounded-[40px]
bg-white/95
shadow-2xl
p-6
"

>



<div

className="
flex
flex-col
md:flex-row
justify-between
items-center
gap-6
"

>



<div

className="
flex
items-center
gap-6
"

>



<div

className="
relative
"

>


<img

src={
image || "/avatar.png"
}

alt={name}

className="
w-36
h-36
rounded-full
object-cover
border-4
border-pink-200
shadow-xl
"

/>




<div

className="
absolute
bottom-2
right-2
w-6
h-6
rounded-full
bg-green-500
border-4
border-white
"

/>





</div>







<div>



<div

className="
flex
items-center
gap-3
flex-wrap
"

>



<h1

className="
text-4xl
font-black
text-rose-700
"

>

{name}

</h1>




<MemberVerificationBadge

memberId={memberId}

/>



<FounderBadge

isFounder={isFounder}

/>



</div>








<div

className="
mt-4
flex
gap-3
flex-wrap
text-gray-600
font-bold
"

>



{

age && (

<span

className="
bg-pink-50
px-4
py-2
rounded-full
"

>

🎂 {age} سنة

</span>

)

}






{

city && (

<span

className="
bg-pink-50
px-4
py-2
rounded-full
"

>

📍 {city}

</span>

)

}



</div>







<div

className="
mt-4
"

>



<MemberLastSeen

memberId={memberId}

/>



</div>





</div>






</div>








{

memberId !== currentMemberId && (

<MemberProfileMenu

memberId={memberId}

currentMemberId={currentMemberId}

/>

)

}





</div>





</header>


);


}