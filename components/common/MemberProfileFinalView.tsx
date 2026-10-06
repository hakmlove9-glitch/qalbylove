"use client";

import MemberProfileResponsive from "@/components/common/MemberProfileResponsive";


interface MemberProfileFinalViewProps {

  memberId:string;

  currentMemberId:string;

  name:string;

  image?:string;

  city?:string;

  age?:number;

}





export default function MemberProfileFinalView({

memberId,

currentMemberId,

name,

image,

city,

age,

}:MemberProfileFinalViewProps){



return (

<section

dir="rtl"

className="
space-y-8
"

>



<div

className="
relative
overflow-hidden
rounded-[45px]
bg-gradient-to-br
from-rose-700
via-pink-500
to-pink-200
p-8
shadow-2xl
"

>



<div

className="
absolute
top-0
right-0
w-64
h-64
rounded-full
bg-white/20
blur-3xl
"

/>




<div

className="
relative
z-10
flex
flex-col
md:flex-row
items-center
gap-8
text-white
"

>



<div

className="
w-40
h-40
rounded-full
overflow-hidden
border-4
border-white
shadow-xl
bg-white
"

>


{

image ?


<img

src={image}

alt={name}

className="
w-full
h-full
object-cover
"

/>



:


<div

className="
w-full
h-full
flex
items-center
justify-center
text-6xl
text-rose-600
"

>

❤️

</div>


}



</div>







<div>


<h1

className="
text-4xl
font-black
"

>

{name}

</h1>



<div

className="
mt-4
flex
flex-wrap
gap-3
"

>


{

city &&

<span

className="
bg-white/20
px-5
py-2
rounded-full
font-bold
"

>

📍 {city}

</span>

}





{

age &&

<span

className="
bg-white/20
px-5
py-2
rounded-full
font-bold
"

>

🎂 {age} سنة

</span>

}



</div>



</div>



</div>



</div>






<MemberProfileResponsive

memberId={memberId}

currentMemberId={currentMemberId}

name={name}

image={image}

city={city}

age={age}

/>



</section>

);


}