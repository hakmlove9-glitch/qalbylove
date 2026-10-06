"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  createClient,
} from "@/lib/supabase/client";



interface MemberInterestTagsProps {

  memberId:string;

}







interface Interest {

  id:string;

  name:string;

}








export default function MemberInterestTags({

  memberId,

}:MemberInterestTagsProps){



  const supabase =
    createClient();



  const [

    interests,

    setInterests

  ] =

  useState<Interest[]>([]);







  const [

    loading,

    setLoading

  ] =

  useState(true);









  async function loadInterests(){



    const {

      data,

      error

    } =

      await supabase

        .from("member_interests")

        .select(

          `

          id,

          name

          `

        )

        .eq(

          "member_id",

          memberId

        )

        .order(

          "name"

        );







    if(

      !error &&

      data

    ){



      setInterests(

        data

      );



    }







    setLoading(

      false

    );



  }









  useEffect(()=>{



    loadInterests();







    const channel =

      supabase

        .channel(

          `interests-${memberId}`

        )

        .on(

          "postgres_changes",

          {

            event:"*",

            schema:"public",

            table:"member_interests",

            filter:

              `member_id=eq.${memberId}`

          },

          ()=>{


            loadInterests();


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

      <p

        className="
          text-gray-500
        "

      >

        جاري تحميل الاهتمامات...

      </p>

    );


  }









  return (

    <div

      dir="rtl"

      className="
        bg-white
        rounded-2xl
        shadow
        p-5
      "

    >



      <h3

        className="
          font-bold
          text-xl
          text-rose-700
          mb-4
        "

      >

        الاهتمامات ✨

      </h3>







      <div

        className="
          flex
          flex-wrap
          gap-2
        "

      >



        {
          interests.length === 0

          ?

          (

            <span

              className="
                text-gray-500
              "

            >

              لم تتم إضافة اهتمامات

            </span>

          )

          :

          interests.map(

            item=>(

              <span

                key={item.id}

                className="
                  bg-rose-50
                  text-rose-700
                  rounded-full
                  px-4
                  py-2
                  text-sm
                  font-bold
                "

              >

                #{item.name}

              </span>

            )

          )

        }




      </div>




    </div>

  );


}