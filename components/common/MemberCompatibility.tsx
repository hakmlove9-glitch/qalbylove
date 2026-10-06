"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  createClient,
} from "@/lib/supabase/client";



interface MemberCompatibilityProps {

  memberId:string;

  currentMemberId:string;

}






interface CompatibilityResult {

  percentage:number;

  items:string[];

  loading:boolean;

}







export default function MemberCompatibility({

  memberId,

  currentMemberId,

}:MemberCompatibilityProps){



  const supabase =
    createClient();



  const [

    result,

    setResult

  ] =

  useState<CompatibilityResult>({

    percentage:0,

    items:[],

    loading:true,

  });









  async function checkCompatibility(){



    const {

      data:user

    } =

      await supabase

        .from("members")

        .select(

          `

          interests,

          city,

          education,

          marital_status

          `

        )

        .eq(

          "id",

          currentMemberId

        )

        .single();








    const {

      data:target

    } =

      await supabase

        .from("members")

        .select(

          `

          interests,

          city,

          education,

          marital_status

          `

        )

        .eq(

          "id",

          memberId

        )

        .single();








    if(

      !user ||

      !target

    ){


      setResult({

        percentage:0,

        items:[],

        loading:false,

      });


      return;


    }








    let score = 0;



    const matches:string[] = [];








    if(

      user.city &&

      user.city === target.city

    ){


      score += 25;


      matches.push(

        "نفس المدينة"

      );


    }








    if(

      user.education &&

      user.education === target.education

    ){


      score += 20;


      matches.push(

        "تقارب المستوى التعليمي"

      );


    }








    if(

      user.marital_status &&

      user.marital_status === target.marital_status

    ){


      score += 15;


      matches.push(

        "حالة اجتماعية متشابهة"

      );


    }








    const userInterests =

      user.interests || [];



    const targetInterests =

      target.interests || [];








    const common =

      userInterests.filter(

        (item:string)=>

          targetInterests.includes(item)

      );








    if(common.length){


      score +=

        common.length * 10;



      matches.push(

        `${common.length} اهتمامات مشتركة`

      );


    }








    if(score > 100){

      score = 100;

    }








    setResult({

      percentage:score,

      items:matches,

      loading:false,

    });


  }









  useEffect(()=>{



    checkCompatibility();



  },[memberId,currentMemberId]);









  if(result.loading){


    return (

      <div

        className="
          p-4
          bg-white
          rounded-xl
        "

      >

        جاري تحليل التوافق...

      </div>

    );


  }









  return (

    <div

      dir="rtl"

      className="
        bg-white
        rounded-2xl
        shadow
        p-6
      "

    >



      <h3

        className="
          text-xl
          font-bold
          text-rose-700
        "

      >

        توافق القلوب ❤️

      </h3>







      <div

        className="
          mt-5
          text-center
        "

      >

        <span

          className="
            text-5xl
            font-bold
            text-rose-700
          "

        >

          {result.percentage}%

        </span>



      </div>







      <ul

        className="
          mt-5
          space-y-2
          text-gray-600
        "

      >

        {
          result.items.map(

            (item,index)=>(


              <li

                key={index}

              >

                ✓ {item}

              </li>


            )

          )

        }


      </ul>





    </div>

  );


}