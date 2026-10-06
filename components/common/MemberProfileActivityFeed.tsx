"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  createClient,
} from "@/lib/supabase/client";



interface MemberProfileActivityFeedProps {

memberId:string;

}



interface Activity {

id:string;

type:string;

title:string;

description:string;

created_at:string;

}





export default function MemberProfileActivityFeed({

memberId,

}:MemberProfileActivityFeedProps){



const supabase =
createClient();



const [activities,setActivities] =
useState<Activity[]>([]);



const [loading,setLoading] =
useState(true);







async function loadActivities(){


const {

data,

error

}= await supabase

.from("member_activity")

.select(`

id,

type,

title,

description,

created_at

`)

.eq(

"member_id",

memberId

)

.order(

"created_at",

{

ascending:false

}

)

.limit(30);



if(!error && data){

setActivities(data);

}



setLoading(false);


}







function getIcon(type:string){


const icons:Record<string,string>={

like:"❤️",

favorite:"⭐",

message:"💌",

view:"👁️",

request:"🤝",

verification:"✅",

};



return icons[type] || "✨";


}







useEffect(()=>{


loadActivities();



const channel =

supabase

.channel(

`activity-feed-${memberId}`

)

.on(

"postgres_changes",

{

event:"INSERT",

schema:"public",

table:"member_activity",

filter:

`member_id=eq.${memberId}`

},

()=>{

loadActivities();

}

)

.subscribe();





return ()=>{

supabase.removeChannel(channel);

};



},[memberId,supabase]);







return (

<section

dir="rtl"

className="
rounded-[35px]
bg-white
p-6
shadow-xl
border
border-pink-100
"

>



<h2

className="
mb-6
text-2xl
font-black
text-rose-700
"

>

آخر النشاطات ✨

</h2>







{

loading && (

<p className="text-gray-400">

جاري تحميل النشاطات...

</p>

)

}







{

!loading &&
activities.length===0 && (

<p className="text-gray-500">

لا يوجد نشاط حتى الآن

</p>

)

}








<div

className="
space-y-5
"

>


{

activities.map((item)=>(


<div

key={item.id}

className="
flex
gap-4
items-start
rounded-3xl
bg-pink-50
p-5
"

>


<div

className="
text-3xl
"

>

{getIcon(item.type)}

</div>





<div>


<h4

className="
font-black
text-gray-800
"

>

{item.title}

</h4>



<p

className="
mt-2
text-gray-600
"

>

{item.description}

</p>



<span

className="
block
mt-2
text-xs
text-gray-400
"

>

{

new Date(
item.created_at
).toLocaleString(
"ar-EG"
)

}

</span>



</div>



</div>


))


}



</div>




</section>


);


}