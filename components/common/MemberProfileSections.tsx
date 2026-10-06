"use client";

import {
  useState,
} from "react";

import MemberAbout from "@/components/common/MemberAbout";
import MemberDetails from "@/components/common/MemberDetails";
import MemberInterestTags from "@/components/common/MemberInterestTags";
import MemberPhotosManager from "@/components/common/MemberPhotosManager";



interface MemberProfileSectionsProps {

memberId:string;

editable?:boolean;

}





export default function MemberProfileSections({

memberId,

editable=false,

}:MemberProfileSectionsProps){



const [active,setActive] =
useState("about");





const tabs = [

{
id:"about",
title:"عني",
},

{
id:"details",
title:"التفاصيل",
},

{
id:"interests",
title:"الاهتمامات",
},

{
id:"photos",
title:"الصور",
},

];







return (

<div

dir="rtl"

className="
mt-8
"

>



<div

className="
bg-white
rounded-[35px]
shadow-xl
border
border-pink-100
p-4
flex
flex-wrap
gap-3
mb-8
"

>



{

tabs.map((tab)=>(


<button

key={tab.id}

onClick={()=>setActive(tab.id)}

className={`

rounded-full

px-6

py-3

font-black

transition

${

active===tab.id

?

"bg-rose-700 text-white shadow-lg"

:

"bg-pink-50 text-rose-700"

}

`}

>

{tab.title}

</button>


))


}



</div>







<div

className="
rounded-[35px]
bg-white
shadow-xl
border
border-pink-100
p-6
"

>




{

active==="about" && (

<MemberAbout

memberId={memberId}

/>

)

}





{

active==="details" && (

<MemberDetails

memberId={memberId}

/>

)

}





{

active==="interests" && (

<MemberInterestTags

memberId={memberId}

/>

)

}





{

active==="photos" && (

<MemberPhotosManager

memberId={memberId}

editable={editable}

/>

)

}





</div>




</div>


);


}