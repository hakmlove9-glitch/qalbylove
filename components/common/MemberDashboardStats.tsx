"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  createClient,
} from "@/lib/supabase/client";



interface MemberDashboardStatsProps {

  memberId:string;

}





interface DashboardStats {

  profileViews:number;

  messages:number;

  likes:number;

  favorites:number;

  requests:number;

}







export default function MemberDashboardStats({

  memberId,

}:MemberDashboardStatsProps){



  const supabase =
    createClient();



  const [

    stats,

    setStats

  ] =

  useState<DashboardStats>({

    profileViews:0,

    messages:0,

    likes:0,

    favorites:0,

    requests:0,

  });







  const [

    loading,

    setLoading

  ] =

  useState(true);









  async function loadStats(){



    const views =

      await supabase

        .from("profile_views")

        .select(

          "id",

          {

            count:"exact",

            head:true,

          }

        )

        .eq(

          "member_id",

          memberId

        );







    const messages =

      await supabase

        .from("messages")

        .select(

          "id",

          {

            count:"exact",

            head:true,

          }

        )

        .or(

          `sender_id.eq.${memberId},receiver_id.eq.${memberId}`

        );







    const likes =

      await supabase

        .from("likes")

        .select(

          "id",

          {

            count:"exact",

            head:true,

          }

        )

        .eq(

          "receiver_id",

          memberId

        );







    const favorites =

      await supabase

        .from("favorites")

        .select(

          "id",

          {

            count:"exact",

            head:true,

          }

        )

        .eq(

          "member_id",

          memberId

        );







    const requests =

      await supabase

        .from("member_requests")

        .select(

          "id",

          {

            count:"exact",

            head:true,

          }

        )

        .eq(

          "receiver_id",

          memberId

        );








    setStats({

      profileViews:

        views.count || 0,

      messages:

        messages.count || 0,

      likes:

        likes.count || 0,

      favorites:

        favorites.count || 0,

      requests:

        requests.count || 0,

    });





    setLoading(

      false

    );


  }









  useEffect(()=>{



    loadStats();







    const channel =

      supabase

        .channel(

          `dashboard-stats-${memberId}`

        )

        .on(

          "postgres_changes",

          {

            event:"*",

            schema:"public",

          },

          ()=>{


            loadStats();


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

        جاري تحميل الإحصائيات...

      </div>

    );


  }









  const cards = [

    {

      icon:"👁️",

      title:"المشاهدات",

      value:stats.profileViews,

    },

    {

      icon:"💌",

      title:"الرسائل",

      value:stats.messages,

    },

    {

      icon:"❤️",

      title:"الإعجابات",

      value:stats.likes,

    },

    {

      icon:"⭐",

      title:"المفضلة",

      value:stats.favorites,

    },

    {

      icon:"🤝",

      title:"طلبات التواصل",

      value:stats.requests,

    },

  ];









  return (

    <div

      dir="rtl"

      className="
        grid
        grid-cols-2
        md:grid-cols-5
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
                  text-3xl
                  mb-2
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