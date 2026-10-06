"use client";

import {
  useEffect,
  useState,
} from "react";

import { createClient } from "@/lib/supabase/client";


interface MemberActivityProps {
  memberId: string;
}


interface Activity {

  id: string;

  type: string;

  text: string;

  created_at: string;

}



const supabase = createClient();



export default function MemberActivity({
  memberId,
}: MemberActivityProps) {


  const [activities, setActivities] =
    useState<Activity[]>([]);


  const [loading, setLoading] =
    useState(true);




  async function loadActivity() {


    const {
      data,
      error,
    } = await supabase
      .from("member_activity")
      .select("*")
      .eq(
        "member_id",
        memberId
      )
      .order(
        "created_at",
        {
          ascending: false,
        }
      )
      .limit(20);



    if (!error && data) {

      setActivities(
        data as Activity[]
      );

    }


    setLoading(false);

  }





  useEffect(() => {


    loadActivity();



    const channel =
      supabase
        .channel(
          `activity-${memberId}`
        )
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "member_activity",
            filter:
              `member_id=eq.${memberId}`,
          },
          () => {

            loadActivity();

          }
        )
        .subscribe();




    return () => {

      supabase.removeChannel(
        channel
      );

    };


  }, [memberId]);







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
          mb-5
        "
      >
        النشاط الأخير ✨
      </h3>




      {
        loading && (

          <p>
            جاري التحميل...
          </p>

        )
      }




      {
        !loading &&
        activities.length === 0 && (

          <p
            className="
              text-gray-500
            "
          >
            لا يوجد نشاط حتى الآن
          </p>

        )
      }




      <div
        className="
          space-y-4
        "
      >


        {
          activities.map(
            (item) => (

              <div
                key={item.id}
                className="
                  border-b
                  pb-3
                "
              >

                <p
                  className="
                    text-gray-700
                  "
                >
                  {item.text}
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
                    ).toLocaleString()
                  }

                </span>


              </div>

            )
          )
        }


      </div>


    </div>

  );

}