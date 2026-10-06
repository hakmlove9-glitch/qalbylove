"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  createClient,
} from "@/lib/supabase/client";



interface MemberProfileGalleryProps {

memberId:string;

}



interface Photo {

id:string;

url:string;

}





export default function MemberProfileGallery({

memberId,

}:MemberProfileGalleryProps){



const supabase =
createClient();



const [photos,setPhotos] =
useState<Photo[]>([]);



const [selected,setSelected] =
useState<string | null>(null);





async function loadPhotos(){


const {

data,

error

} = await supabase

.from("member_photos")

.select(`

id,

url

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

);



if(!error && data){

setPhotos(data);

}



}







useEffect(()=>{


loadPhotos();



const channel =

supabase

.channel(
`gallery-${memberId}`
)

.on(

"postgres_changes",

{

event:"*",

schema:"public",

table:"member_photos",

filter:
`member_id=eq.${memberId}`

},

()=>{

loadPhotos();

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
text-3xl
font-black
text-rose-700
"

>

معرض الصور 📸

</h2>






{

photos.length === 0 ?


<p

className="
text-gray-500
text-center
py-10
font-bold
"

>

لا توجد صور

</p>



:


<div

className="
grid
grid-cols-2
md:grid-cols-4
gap-5
"

>


{

photos.map((photo)=>(


<button

key={photo.id}

onClick={()=>setSelected(photo.url)}

className="
group
h-52
overflow-hidden
rounded-[30px]
shadow-md
"

>


<img

src={photo.url}

alt="profile"

className="
h-full
w-full
object-cover
transition
duration-500
group-hover:scale-110
"

/>



</button>


))


}



</div>



}







{

selected && (


<div

onClick={()=>setSelected(null)}

className="
fixed
inset-0
z-50
flex
items-center
justify-center
bg-black/80
p-5
"

>


<img

src={selected}

alt="preview"

className="
max-h-[90vh]
max-w-full
rounded-[35px]
shadow-2xl
"

/>


</div>


)


}





</section>


);


}