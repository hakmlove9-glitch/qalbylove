"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  createClient,
} from "@/lib/supabase/client";



interface MemberDetailsProps {

  memberId:string;

}





interface Details {

  gender:string;

  age:number | null;

  marital_status:string;

  height:string;

  weight:string;

  language:string;

  nationality:string;

}







export default function MemberDetails({

  memberId,

}:MemberDetailsProps){



  const supabase =
    createClient();



  const [

    details,

    setDetails

  ] =

  useState<Details>({

    gender:"",

    age:null,

    marital_status:"",

    height:"",

    weight:"",

    language:"",

    nationality:"",

  });







  const [

    loading,

    setLoading

  ] =

  useState(true);









  async function loadDetails(){



    const {

      data,

      error

    } =

      await supabase

        .from("members")

        .select(

          `

          gender,

          age,

          marital_status,

          height,

          weight,

          language,

          nationality

          `

        )

        .eq(

          "id",

          memberId

        )

        .single();







    if(

      !error &&

      data

    ){



      setDetails(

        data

      );



    }







    setLoading(

      false

    );



  }









  useEffect(()=>{



    loadDetails();







    const channel =

      supabase

        .channel(

          `details-${memberId}`

        )

        .on(

          "postgres_changes",

          {

            event:"UPDATE",

            schema:"public",

            table:"members",

            filter:

              `id=eq.${memberId}`

          },

          ()=>{


            loadDetails();


          }

        )

        .subscribe();







    return ()=>{



      supabase.removeChannel(

        channel

      );



    };



  },[memberId]);









  if(loading){



    return (

      <p>

        جاري تحميل التفاصيل...

      </p>

    );


  }









  const rows = [

    {

      icon:"👤",

      label:"النوع",

      value:details.gender,

    },

    {

      icon:"🎂",

      label:"العمر",

      value:details.age,

    },

    {

      icon:"💍",

      label:"الحالة الاجتماعية",

      value:details.marital_status,

    },

    {

      icon:"📏",

      label:"الطول",

      value:details.height,

    },

    {

      icon:"⚖️",

      label:"الوزن",

      value:details.weight,

    },

    {

      icon:"🗣️",

      label:"اللغة",

      value:details.language,

    },

    {

      icon:"🌍",

      label:"الجنسية",

      value:details.nationality,

    },

  ];









  return (

    <section

      dir="rtl"

      className="
        bg-white
        rounded-2xl
        shadow
        p-6
      "

    >



      <h2

        className="
          text-2xl
          font-bold
          text-rose-700
          mb-5
        "

      >

        التفاصيل الشخصية ✨

      </h2>







      <div

        className="
          grid
          md:grid-cols-2
          gap-4
        "

      >



        {
          rows.map(

            (row,index)=>(


              <div

                key={index}

                className="
                  flex
                  items-center
                  gap-3
                  bg-rose-50
                  rounded-xl
                  p-4
                "

              >

                <span>

                  {row.icon}

                </span>


                <div>


                  <p

                    className="
                      text-xs
                      text-gray-500
                    "

                  >

                    {row.label}

                  </p>


                  <p

                    className="
                      font-bold
                      text-gray-800
                    "

                  >

                    {row.value || "غير محدد"}

                  </p>



                </div>



              </div>


            )

          )

        }



      </div>




    </section>

  );


}