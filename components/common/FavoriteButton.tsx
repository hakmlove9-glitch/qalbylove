"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  createClient,
} from "@/lib/supabase/client";



interface FavoriteButtonProps {

  memberId:string;

  currentMemberId:string;

}






export default function FavoriteButton({

  memberId,

  currentMemberId,

}:FavoriteButtonProps){



  const supabase =
    createClient();



  const [

    favorite,

    setFavorite

  ] =

  useState(false);



  const [

    loading,

    setLoading

  ] =

  useState(false);








  async function checkFavorite(){


    const {

      data

    } =

      await supabase

        .from("favorites")

        .select(

          "id"

        )

        .eq(

          "member_id",

          memberId

        )

        .eq(

          "user_id",

          currentMemberId

        )

        .maybeSingle();





    setFavorite(

      !!data

    );


  }








  useEffect(()=>{


    if(

      currentMemberId

    ){

      checkFavorite();

    }


  },[]);








  async function toggleFavorite(){


    setLoading(

      true

    );






    if(favorite){



      await supabase

        .from("favorites")

        .delete()

        .eq(

          "member_id",

          memberId

        )

        .eq(

          "user_id",

          currentMemberId

        );





      setFavorite(

        false

      );



    }else{





      await supabase

        .from("favorites")

        .insert({

          member_id:

            memberId,

          user_id:

            currentMemberId,

        });





      setFavorite(

        true

      );


    }







    setLoading(

      false

    );


  }








  return (

    <button

      disabled={loading}

      onClick={toggleFavorite}

      className={`
        rounded-xl
        px-6
        py-3
        font-bold
        transition
        ${
          favorite

          ?

          "bg-rose-700 text-white"

          :

          "border border-rose-700 text-rose-700"

        }
      `}

    >

      {
        favorite

        ?

        "❤️ محفوظ"

        :

        "🤍 إضافة للمفضلة"

      }


    </button>

  );


}