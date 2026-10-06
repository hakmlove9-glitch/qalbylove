"use client";

import { useRouter } from "next/navigation";

import MemberProfileMainContainer from "@/components/common/MemberProfileMainContainer";
import MemberProfileMobileActions from "@/components/common/MemberProfileMobileActions";



interface MemberProfileResponsiveProps {

  memberId:string;

  currentMemberId:string;

  name:string;

  image?:string;

  city?:string;

  age?:number;

}




export default function MemberProfileResponsive({

memberId,

currentMemberId,

name,

image,

city,

age,

}:MemberProfileResponsiveProps){



const router = useRouter();




function openMessage(){

router.push(
`/messages/${memberId}`
);

}




function shareProfile(){


if(
typeof navigator !== "undefined" &&
navigator.share
){

navigator.share({

title:name,

url:
`${window.location.origin}/member/${memberId}`

});


}


}




return (

<>

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


<MemberProfileMainContainer

memberId={memberId}

currentMemberId={currentMemberId}

name={name}

image={image}

city={city}

age={age}

/>


</div>





{

memberId !== currentMemberId && (

<MemberProfileMobileActions

onMessage={openMessage}

onLike={()=>{}}

onFavorite={()=>{}}

onShare={shareProfile}

/>

)

}



</>

);


}