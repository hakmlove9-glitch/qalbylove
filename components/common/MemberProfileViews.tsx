"use client";

import {
  useEffect,
  useState,
} from "react";

import { createClient } from "@/lib/supabase/client";


interface MemberProfileViewsProps {

  memberId: string;

  viewerId: string;

}



const supabase = createClient();





export default function MemberProfileViews({

  memberId,

  viewerId,

}: MemberProfileViewsProps) {



  const [
    views,
    setViews
  ] = useState(0);





  const [
    viewed,
    setViewed
  ] = useState(false);









  async function registerView() {



    if (

      !viewerId ||

      viewerId === memberId

    ) {

      return;

    }







    const {
      data: exists
    } = await supabase

      .from("profile_views")

      .select("id")

      .eq(
        "member_id",
        memberId
      )

      .eq(
        "viewer_id",
        viewerId
      )

      .maybeSingle();








    if (!exists) {



      await supabase

        .from("profile_views")

        .insert({

          member_id: memberId,

          viewer_id: viewerId,

          created_at:

            new Date()

              .toISOString(),

        });



    }





    setViewed(true);



  }









  async function loadViews() {



    const {
      count
    } = await supabase

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







    setViews(

      count || 0

    );



  }









  useEffect(() => {



    registerView();

    loadViews();







    const channel =

      supabase

        .channel(

          `profile-views-${memberId}`

        )

        .on(

          "postgres_changes",

          {

            event: "INSERT",

            schema: "public",

            table: "profile_views",

            filter:

              `member_id=eq.${memberId}`,

          },

          () => {

            loadViews();

          }

        )

        .subscribe();







    return () => {


      supabase.removeChannel(

        channel

      );


    };



  }, [memberId, viewerId]);









  return (

    <div

      dir="rtl"

      className="
        text-sm
        text-gray-600
        flex
        items-center
        gap-2
      "

    >

      👁️


      <span>

        {views} مشاهدة للملف

      </span>



    </div>

  );


}