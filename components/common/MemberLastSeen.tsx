"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  createClient,
} from "@/lib/supabase/client";


interface MemberLastSeenProps {
  memberId: string;
}



export default function MemberLastSeen({
  memberId,
}: MemberLastSeenProps) {


  const supabase = createClient();


  const [lastSeen, setLastSeen] =
    useState<string | null>(null);


  const [online, setOnline] =
    useState(false);



  function updateStatus(date: string) {

    const time =
      new Date(date).getTime();


    const now =
      Date.now();


    setOnline(
      now - time < 5 * 60 * 1000
    );

  }



  async function loadLastSeen() {

    const {
      data,
      error,
    } =
      await supabase
        .from("members")
        .select("last_seen")
        .eq(
          "id",
          memberId
        )
        .single();


    if (
      !error &&
      data?.last_seen
    ) {

      setLastSeen(
        data.last_seen
      );


      updateStatus(
        data.last_seen
      );

    }

  }



  useEffect(() => {

    loadLastSeen();


    const channel =
      supabase
        .channel(
          `last-seen-${memberId}`
        )
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "members",
            filter:
              `id=eq.${memberId}`,
          },
          (payload) => {

            const item =
              payload.new as {
                last_seen?: string;
              };


            if (
              item.last_seen
            ) {

              setLastSeen(
                item.last_seen
              );


              updateStatus(
                item.last_seen
              );

            }

          }
        )
        .subscribe();



    return () => {

      supabase.removeChannel(
        channel
      );

    };


  }, [memberId, supabase]);



  return (

    <div
      dir="rtl"
      className="
        flex
        items-center
        gap-2
        text-sm
      "
    >

      <span

        className={`
          h-3
          w-3
          rounded-full
          ${
            online
              ? "bg-green-500"
              : "bg-gray-400"
          }
        `}

      />


      {
        online

          ?

          (
            <span>
              متصل الآن
            </span>
          )

          :

          (

            <span>

              {
                lastSeen

                  ?

                  `آخر ظهور ${new Date(
                    lastSeen
                  ).toLocaleString(
                    "ar-EG"
                  )}`

                  :

                  "لا يوجد نشاط"
              }

            </span>

          )
      }


    </div>

  );

}