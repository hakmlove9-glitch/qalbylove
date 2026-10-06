"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  createClient,
} from "@/lib/supabase/client";



interface MemberAboutProps {

  memberId:string;

}





interface AboutData {

  bio:string;

  occupation:string;

  education:string;

  city:string;

  country:string;

}








export default function MemberAbout({

  memberId,

}:MemberAboutProps){



  const supabase =
    createClient();



  const [

    about,

    setAbout

  ] =

  useState<AboutData>({

    bio:"",

    occupation:"",

    education:"",

    city:"",

    country:"",

  });







  const [

    loading,

    setLoading

  ] =

  useState(true);









  async function loadAbout(){



    const {

      data,

      error

    } =

      await supabase

        .from("members")

        .select(

          `

          bio,

          occupation,

          education,

          city,

          country

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



      setAbout(

        data

      );



    }







    setLoading(

      false

    );



  }









  useEffect(()=>{



    loadAbout();





    const channel =

      supabase

        .channel(

          `about-${memberId}`

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


            loadAbout();


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

      <div>

        جاري تحميل البيانات...

      </div>

    );


  }









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

        عني 💕

      </h2>







      <p

        className="
          text-gray-700
          leading-8
          mb-5
        "

      >

        {
          about.bio ||

          "لم تتم إضافة نبذة شخصية بعد."

        }

      </p>







      <div

        className="
          grid
          md:grid-cols-2
          gap-4
          text-gray-600
        "

      >



        {
          about.occupation && (

            <div>

              💼 {about.occupation}

            </div>

          )

        }







        {
          about.education && (

            <div>

              🎓 {about.education}

            </div>

          )

        }







        {
          about.city && (

            <div>

              📍 {about.city}

            </div>

          )

        }







        {
          about.country && (

            <div>

              🌍 {about.country}

            </div>

          )

        }



      </div>




    </section>

  );


}