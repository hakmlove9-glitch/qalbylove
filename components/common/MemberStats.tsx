"use client";

import {
  useEffect,
  useState,
} from "react";

import { createClient } from "@/lib/supabase/client";


interface MemberStatsProps {

  memberId: string;

}



interface Stats {

  views: number;

  likes: number;

  favorites: number;

  messages: number;

}





const supabase = createClient();





export default function MemberStats({

  memberId,

}: MemberStatsProps) {



  const [
    stats,
    setStats
  ] = useState<Stats>({

    views: 0,

    likes: 0,

    favorites: 0,

    messages: 0,

  });









  async function loadStats() {



    const { count: views } = await supabase

      .from("profile_views")

      .select(
        "id",
        {
          count: "exact",
          head: true,
        }
      )

      .eq(
        "member_id",
        memberId
      );








    const { count: likes } = await supabase

      .from("likes")

      .select(
        "id",
        {
          count: "exact",
          head: true,
        }
      )

      .eq(
        "receiver_id",
        memberId
      );








    const { count: favorites } = await supabase

      .from("favorites")

      .select(
        "id",
        {
          count: "exact",
          head: true,
        }
      )

      .eq(
        "member_id",
        memberId
      );








    const { count: messages } = await supabase

      .from("messages")

      .select(
        "id",
        {
          count: "exact",
          head: true,
        }
      )

      .eq(
        "receiver_id",
        memberId
      );









    setStats({

      views: views || 0,

      likes: likes || 0,

      favorites: favorites || 0,

      messages: messages || 0,

    });



  }









  useEffect(() => {



    loadStats();





    const channel = supabase

      .channel(
        `member-stats-${memberId}`
      )

      .on(

        "postgres_changes",

        {

          event: "*",

          schema: "public",

        },

        () => {

          loadStats();

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
        grid
        grid-cols-2
        md:grid-cols-4
        gap-4
      "

    >



      <StatCard
        value={stats.views}
        label="مشاهدة"
      />

      <StatCard
        value={stats.likes}
        label="إعجاب"
      />

      <StatCard
        value={stats.favorites}
        label="مفضلة"
      />

      <StatCard
        value={stats.messages}
        label="رسائل"
      />



    </div>

  );


}







function StatCard({

  value,

  label,

}: {

  value: number;

  label: string;

}) {


  return (

    <div

      className="
        bg-white
        rounded-2xl
        p-5
        text-center
        shadow
      "

    >

      <strong

        className="
          block
          text-2xl
          text-rose-700
        "

      >

        {value}

      </strong>


      <span>

        {label}

      </span>


    </div>

  );

}