"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";


interface OnlineStatusProps {
  memberId: string;
}


export default function OnlineStatus({
  memberId,
}: OnlineStatusProps) {


  const [online, setOnline] =
    useState(false);


  const [lastSeen, setLastSeen] =
    useState<string | null>(null);


  const supabase =
    createClient();





  function checkStatus(
    date: string | null
  ) {

    if (!date) {

      setOnline(false);

      return;

    }


    const last =
      new Date(date)
        .getTime();


    const now =
      Date.now();


    const difference =
      now - last;


    setOnline(
      difference <
      5 * 60 * 1000
    );


  }







  async function loadStatus() {


    if (!memberId) return;



    const {
      data,
      error,
    } =
      await supabase
        .from("members")
        .select(
          "last_seen"
        )
        .eq(
          "id",
          memberId
        )
        .single();





    if (!error && data) {

      setLastSeen(
        data.last_seen
      );


      checkStatus(
        data.last_seen
      );

    }


  }







  useEffect(() => {


    loadStatus();




    const channel =
      supabase
        .channel(
          `presence-${memberId}`
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


            const updated =
              payload.new as {
                last_seen:
                  string;
              };



            setLastSeen(
              updated.last_seen
            );


            checkStatus(
              updated.last_seen
            );


          }
        )
        .subscribe();





    const timer =
      setInterval(
        loadStatus,
        60000
      );





    return () => {


      clearInterval(
        timer
      );


      supabase.removeChannel(
        channel
      );


    };



  }, [memberId]);







  return (

    <div>

      {
        online ? (

          <span>
            🟢 متصل الآن
          </span>

        ) : (

          <span>
            ⚪ غير متصل
            {
              lastSeen &&
              ` - آخر ظهور ${new Date(lastSeen).toLocaleString()}`
            }
          </span>

        )
      }

    </div>

  );


}