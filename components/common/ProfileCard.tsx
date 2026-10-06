"use client";

import Link from "next/link";

import FounderBadge from "@/components/common/FounderBadge";



interface ProfileCardProps {

id:string;

name:string;

gender?:string;

age?:number;

city?:string;

image?:string;

verified?:boolean;

online?:boolean;

isFounder?:boolean;

bio?:string;

}



export default function ProfileCard({

id,

name,

gender,

age,

city,

image,

verified=false,

online=false,

isFounder=false,

bio,

}:ProfileCardProps){



function getAvatar(){

if(
gender === "female" ||
gender === "أنثى"
){

return "/images/site-v2/members/women-no-hijab-modest/01.webp";

}


return "/images/site-v2/members/men-clean-shaven/01.webp";

}





return (

<div

dir="rtl"

className="
bg-white
rounded-[35px]
shadow-xl
overflow-hidden
border
border-pink-100
transition-all
duration-300
hover:-translate-y-2
"

>



<div

className="
relative
h-80
bg-pink-50
"

>



<img

src={image || getAvatar()}

alt={name}

className="
w-full
h-full
object-cover
"

 />





{

online && (

<span

className="
absolute
top-4
right-4
bg-green-500
text-white
rounded-full
px-4
py-2
text-xs
font-black
shadow
"

>

🟢 متصل الآن

</span>

)

}





</div>







<div

className="
p-6
"

>



<div

className="
flex
items-center
gap-2
flex-wrap
"

>



<h3

className="
text-2xl
font-black
text-gray-900
"

>

{name}

</h3>





{

verified && (

<span

className="
text-blue-600
text-xl
"

>

✓

</span>

)

}




<FounderBadge

isFounder={isFounder}

/>



</div>







<div

className="
mt-4
space-y-2
font-bold
text-gray-600
"

>



{

age && (

<p>

🎂 العمر: {age} سنة

</p>

)

}






{

city && (

<p>

📍 {city}

</p>

)

}





{

bio && (

<p

className="
mt-3
text-sm
leading-7
text-gray-500
"

>

{bio}

</p>

)

}



</div>








<div

className="
mt-6
flex
gap-3
"

>



<Link

href={`/member/${id}`}

className="
flex-1
text-center
rounded-full
bg-gradient-to-r
from-rose-700
to-pink-500
text-white
py-4
font-black
"

>

عرض الملف 💕

</Link>






<button

className="
flex-1
rounded-full
border-2
border-rose-500
text-rose-600
font-black
py-4
hover:bg-rose-50
"

>

❤️ اهتمام

</button>



</div>






</div>





</div>


);


}