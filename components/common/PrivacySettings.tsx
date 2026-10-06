"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  createClient,
} from "@/lib/supabase/client";



interface PrivacySettingsProps {

  memberId:string;

}





interface Settings {

  show_online:boolean;

  show_age:boolean;

  show_city:boolean;

  allow_messages:boolean;

}







export default function PrivacySettings({

  memberId,

}:PrivacySettingsProps){



  const supabase =
    createClient();



  const [

    settings,

    setSettings

  ] =

  useState<Settings>({

    show_online:true,

    show_age:true,

    show_city:true,

    allow_messages:true,

  });



  const [

    saving,

    setSaving

  ] =

  useState(false);









  async function loadSettings(){



    const {

      data,

      error

    } =

      await supabase

        .from("member_settings")

        .select("*")

        .eq(

          "member_id",

          memberId

        )

        .maybeSingle();







    if(

      !error &&

      data

    ){



      setSettings(

        data

      );



    }



  }









  useEffect(()=>{



    loadSettings();



  },[memberId]);









  function update(

    key:keyof Settings

  ){



    setSettings(

      old=>({

        ...old,

        [key]:

          !old[key],

      })

    );



  }









  async function save(){



    setSaving(

      true

    );







    await supabase

      .from("member_settings")

      .upsert({

        member_id:

          memberId,

        ...settings,

      });








    setSaving(

      false

    );



  }









  return (

    <div

      dir="rtl"

      className="
        qalby-card
        bg-white
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

        إعدادات الخصوصية 🔒

      </h2>







      <div

        className="
          space-y-4
        "

      >





        <label

          className="
            flex
            justify-between
          "

        >

          <span>
            إظهار حالة الاتصال
          </span>


          <input

            type="checkbox"

            checked={
              settings.show_online
            }

            onChange={()=>update(
              "show_online"
            )}

          />


        </label>







        <label

          className="
            flex
            justify-between
          "

        >

          <span>
            إظهار العمر
          </span>


          <input

            type="checkbox"

            checked={
              settings.show_age
            }

            onChange={()=>update(
              "show_age"
            )}

          />


        </label>







        <label

          className="
            flex
            justify-between
          "

        >

          <span>
            إظهار المدينة
          </span>


          <input

            type="checkbox"

            checked={
              settings.show_city
            }

            onChange={()=>update(
              "show_city"
            )}

          />


        </label>








        <label

          className="
            flex
            justify-between
          "

        >

          <span>
            السماح بالرسائل
          </span>


          <input

            type="checkbox"

            checked={
              settings.allow_messages
            }

            onChange={()=>update(
              "allow_messages"
            )}

          />


        </label>





      </div>







      <button

        onClick={
          save
        }

        className="
          qalby-button
          w-full
          mt-6
        "

      >

        {
          saving

          ?

          "جاري الحفظ..."

          :

          "حفظ الإعدادات"

        }


      </button>




    </div>

  );


}