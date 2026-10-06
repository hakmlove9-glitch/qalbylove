"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  createClient,
} from "@/lib/supabase/client";



interface MemberProfileTimelineProps {

  memberId:string;

}







interface TimelineItem {

  id:string;

  title:string;

  description:string;

  type:string;

  created_at:string;

}







export default function MemberProfileTimeline({

  memberId,

}:MemberProfileTimelineProps){



  const supabase =
    createClient();



  const [

    timeline,

    setTimeline

  ] =

  useState<TimelineItem[]>([]);



  const [

    loading,

    setLoading

  ] =

  useState(true);









  async function loadTimeline(){



    const {

      data,

      error

    } =

      await supabase

        .from("member_activity")

        .select(`

          id,

          title,

          description,

          type,

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

        .limit(50);







    if(

      !error &&

      data

    ){



      setTimeline(

        data

      );



    }







    setLoading(

      false

    );



  }









  function icon(type:string){



    switch(type){



      case "profile":

        return "👤";



      case "photo":

        return "📸";



      case "message":

        return "💌";



      case "like":

        return "❤️";



      case "favorite":

        return "⭐";



      case "verification":

        return "✅";



      default:

        return "✨";



    }



  }









  useEffect(()=>{



    loadTimeline();







    const channel =

      supabase

        .channel(

          `timeline-${memberId}`

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


            loadTimeline();


          }

        )

        .subscribe();







    return ()=>{



      supabase.removeChannel(

        channel

      );



    };



  },[memberId]);









  return (

    <section

      dir="rtl"

      className="
        bg-white
        rounded-3xl
        shadow
        p-6
      "

    >



      <h2

        className="
          text-2xl
          font-bold
          text-rose-700
          mb-6
        "

      >

        سجل الملف الزمني 📅

      </h2>







      {
        loading && (

          <p>

            جاري تحميل السجل...

          </p>

        )

      }







      {
        !loading &&

        timeline.length === 0 && (

          <p

            className="
              text-gray-500
            "

          >

            لا توجد أحداث

          </p>

        )

      }







      <div

        className="
          relative
        "

      >



        {
          timeline.map(

            item=>(


              <div

                key={item.id}

                className="
                  flex
                  gap-4
                  mb-6
                  relative
                "

              >



                <div

                  className="
                    w-10
                    h-10
                    rounded-full
                    bg-rose-50
                    flex
                    items-center
                    justify-center
                    text-xl
                  "

                >

                  {
                    icon(

                      item.type

                    )

                  }

                </div>







                <div

                  className="
                    flex-1
                    border-b
                    pb-4
                  "

                >



                  <h3

                    className="
                      font-bold
                    "

                  >

                    {item.title}

                  </h3>





                  <p

                    className="
                      text-gray-600
                      mt-1
                    "

                  >

                    {item.description}

                  </p>





                  <span

                    className="
                      text-xs
                      text-gray-400
                    "

                  >

                    {
                      new Date(

                        item.created_at

                      )

                      .toLocaleString(

                        "ar-EG"

                      )

                    }

                  </span>




                </div>




              </div>


            )

          )

        }



      </div>





    </section>

  );


}