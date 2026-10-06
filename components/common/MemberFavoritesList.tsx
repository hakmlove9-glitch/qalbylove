"use client";

import {
  useEffect,
  useState,
} from "react";

import ProfileCard from "@/components/common/ProfileCard";
import {
  createClient,
} from "@/lib/supabase/client";


interface MemberFavoritesListProps {
  memberId: string;
}


interface FavoriteMember {

  id: string;

  name: string;

  age?: number;

  city?: string;

  image?: string;

  verified?: boolean;

  online?: boolean;

}



export default function MemberFavoritesList({

  memberId,

}: MemberFavoritesListProps) {


  const supabase =
    createClient();



  const [
    favorites,
    setFavorites,
  ] =
    useState<FavoriteMember[]>([]);



  const [
    loading,
    setLoading,
  ] =
    useState(true);





  async function loadFavorites() {


    const {
      data,
      error,
    } =
      await supabase
        .from("favorites")
        .select(`
          member_id,
          members (
            id,
            name,
            age,
            city,
            image,
            verified,
            online
          )
        `)
        .eq(
          "user_id",
          memberId
        );



    if (
      !error &&
      data
    ) {


      const result =
        data
          .map(
            (item) =>
              item.members
          )
          .filter(
            Boolean
          ) as unknown as FavoriteMember[];



      setFavorites(
        result
      );

    }



    setLoading(false);

  }







  async function removeFavorite(
    targetId: string
  ) {


    await supabase
      .from("favorites")
      .delete()
      .eq(
        "user_id",
        memberId
      )
      .eq(
        "member_id",
        targetId
      );



    loadFavorites();

  }







  useEffect(() => {


    loadFavorites();



    const channel =
      supabase
        .channel(
          `favorites-${memberId}`
        )
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "favorites",
            filter:
              `user_id=eq.${memberId}`,
          },
          () => {

            loadFavorites();

          }
        )
        .subscribe();




    return () => {

      supabase.removeChannel(
        channel
      );

    };


  }, [memberId, supabase]);







  if (loading) {

    return (

      <p>

        جاري تحميل المفضلة...

      </p>

    );

  }







  return (

    <section

      dir="rtl"

      className="
        mt-8
      "

    >

      <h2

        className="
          mb-6
          text-2xl
          font-bold
          text-rose-700
        "

      >

        الأعضاء المفضلون ❤️

      </h2>






      {
        favorites.length === 0

          ?

          (

            <div

              className="
                rounded-2xl
                bg-white
                p-6
                text-gray-500
              "

            >

              لا يوجد أعضاء في المفضلة

            </div>

          )

          :

          (

            <div

              className="
                grid
                gap-6
                md:grid-cols-3
              "

            >

              {
                favorites.map(
                  (member) => (

                    <div

                      key={
                        member.id
                      }

                      className="
                        space-y-3
                      "

                    >

                      <ProfileCard

                        id={
                          member.id
                        }

                        name={
                          member.name
                        }

                        age={
                          member.age
                        }

                        city={
                          member.city
                        }

                        image={
                          member.image
                        }

                        verified={
                          member.verified
                        }

                        online={
                          member.online
                        }

                      />



                      <button

                        onClick={() =>
                          removeFavorite(
                            member.id
                          )
                        }

                        className="
                          w-full
                          rounded-xl
                          border
                          border-red-300
                          py-2
                          text-red-600
                        "

                      >

                        إزالة من المفضلة

                      </button>


                    </div>

                  )

                )
              }


            </div>

          )
      }



    </section>

  );

}