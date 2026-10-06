"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  createClient,
} from "@/lib/supabase/client";



interface MemberProfileShareAnalyticsProps {

  memberId:string;

}







interface Analytics {

  total:number;

  today:number;

  week:number;

  month:number;

}







export default function MemberProfileShareAnalytics({

  memberId,

}:MemberProfileShareAnalyticsProps){



  const supabase =
    createClient();



  const [

    analytics,

    setAnalytics

  ] =

  useState<Analytics>({

    total:0,

    today:0,

    week:0,

    month:0,

  });









  async function loadAnalytics(){



    const {

      data,

      error

    } =

      await supabase

        .from("profile_shares")

        .select(

          "created_at"

        )

        .eq(

          "member_id",

          memberId

        );







    if(

      error ||

      !data

    ){

      return;

    }







    const now =

      new Date();





    const today =

      new Date(

        now

      );



    today.setHours(

      0,

      0,

      0,

      0

    );







    const week =

      new Date(

        now

      );



    week.setDate(

      week.getDate() - 7

    );







    const month =

      new Date(

        now

      );



    month.setMonth(

      month.getMonth() - 1

    );









    setAnalytics({

      total:

        data.length,



      today:

        data.filter(

          item=>

            new Date(

              item.created_at

            ) >= today

        ).length,



      week:

        data.filter(

          item=>

            new Date(

              item.created_at

            ) >= week

        ).length,



      month:

        data.filter(

          item=>

            new Date(

              item.created_at

            ) >= month

        ).length,

    });



  }









  useEffect(()=>{



    loadAnalytics();







    const channel =

      supabase

        .channel(

          `share-analytics-${memberId}`

        )

        .on(

          "postgres_changes",

          {

            event:"INSERT",

            schema:"public",

            table:"profile_shares",

            filter:

              `member_id=eq.${memberId}`

          },

          ()=>{


            loadAnalytics();


          }

        )

        .subscribe();







    return ()=>{



      supabase.removeChannel(

        channel

      );



    };



  },[memberId]);









  const cards = [

    {

      title:"إجمالي المشاركات",

      value:

        analytics.total,

      icon:"📤",

    },

    {

      title:"اليوم",

      value:

        analytics.today,

      icon:"📅",

    },

    {

      title:"آخر 7 أيام",

      value:

        analytics.week,

      icon:"📈",

    },

    {

      title:"آخر شهر",

      value:

        analytics.month,

      icon:"🗓️",

    },

  ];









  return (

    <div

      dir="rtl"

      className="
        grid
        grid-cols-2
        md:grid-cols-4
        gap-4
      "

    >

      {
        cards.map(

          (card,index)=>(


            <div

              key={index}

              className="
                bg-white
                rounded-2xl
                shadow
                p-5
                text-center
              "

            >

              <div

                className="
                  text-2xl
                "

              >

                {card.icon}

              </div>



              <strong

                className="
                  block
                  text-2xl
                  text-rose-700
                "

              >

                {card.value}

              </strong>



              <span

                className="
                  text-gray-600
                "

              >

                {card.title}

              </span>



            </div>


          )

        )

      }


    </div>

  );


}