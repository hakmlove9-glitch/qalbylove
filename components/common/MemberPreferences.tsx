"use client";

import {
  useEffect,
  useState,
} from "react";

import { createClient } from "@/lib/supabase/client";


interface MemberPreferencesProps {

  memberId: string;

}



interface Preferences {

  preferred_age_min: number | null;

  preferred_age_max: number | null;

  preferred_city: string;

  preferred_gender: string;

  preferred_status: string;

  preferred_education: string;

}





const supabase = createClient();






export default function MemberPreferences({

  memberId,

}: MemberPreferencesProps) {



  const [
    preferences,
    setPreferences
  ] = useState<Preferences>({

    preferred_age_min: null,

    preferred_age_max: null,

    preferred_city: "",

    preferred_gender: "",

    preferred_status: "",

    preferred_education: "",

  });





  const [
    loading,
    setLoading
  ] = useState(true);








  async function loadPreferences() {



    const {
      data,
      error,
    } = await supabase

      .from("member_preferences")

      .select("*")

      .eq(
        "member_id",
        memberId
      )

      .maybeSingle();






    if (!error && data) {

      setPreferences(
        data as Preferences
      );

    }



    setLoading(false);

  }









  function update(

    key: keyof Preferences,

    value: string | number | null

  ) {


    setPreferences(

      old => ({

        ...old,

        [key]: value,

      })

    );

  }









  async function savePreferences() {



    await supabase

      .from("member_preferences")

      .upsert({

        member_id: memberId,

        ...preferences,

      });


  }









  useEffect(() => {



    loadPreferences();





    const channel =

      supabase

        .channel(
          `preferences-${memberId}`
        )

        .on(

          "postgres_changes",

          {

            event: "*",

            schema: "public",

            table: "member_preferences",

            filter:
              `member_id=eq.${memberId}`,

          },

          () => {

            loadPreferences();

          }

        )

        .subscribe();







    return () => {

      supabase.removeChannel(
        channel
      );

    };



  }, [memberId]);









  if (loading) {


    return (

      <p>
        جاري تحميل التفضيلات...
      </p>

    );

  }









  return (

    <section

      dir="rtl"

      className="
        bg-white
        rounded-2xl
        shadow
        p-6
      "

    >



      <h2

        className="
          text-xl
          font-bold
          text-rose-700
          mb-5
        "

      >

        تفضيلات البحث 💕

      </h2>







      <div

        className="
          grid
          md:grid-cols-2
          gap-4
        "

      >



        <input

          type="number"

          placeholder="العمر من"

          value={
            preferences.preferred_age_min ?? ""
          }

          onChange={(e)=>

            update(

              "preferred_age_min",

              e.target.value
                ? Number(e.target.value)
                : null

            )

          }

          className="
            border
            rounded-xl
            p-3
          "

        />





        <input

          type="number"

          placeholder="العمر إلى"

          value={
            preferences.preferred_age_max ?? ""
          }

          onChange={(e)=>

            update(

              "preferred_age_max",

              e.target.value
                ? Number(e.target.value)
                : null

            )

          }

          className="
            border
            rounded-xl
            p-3
          "

        />





        <input

          placeholder="المدينة"

          value={
            preferences.preferred_city
          }

          onChange={(e)=>

            update(

              "preferred_city",

              e.target.value

            )

          }

          className="
            border
            rounded-xl
            p-3
          "

        />





        <input

          placeholder="المؤهل"

          value={
            preferences.preferred_education
          }

          onChange={(e)=>

            update(

              "preferred_education",

              e.target.value

            )

          }

          className="
            border
            rounded-xl
            p-3
          "

        />





      </div>







      <button

        onClick={
          savePreferences
        }

        className="
          qalby-button
          w-full
          mt-6
        "

      >

        حفظ التفضيلات

      </button>





    </section>

  );


}