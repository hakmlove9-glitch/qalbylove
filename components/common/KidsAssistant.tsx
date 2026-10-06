"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  createClient,
} from "@/lib/supabase/client";



interface Character {

  id: string;

  name: string;

  avatar: string;

  greeting: string;

  description?: string;

}




interface KidsAssistantProps {

  memberId?: string;

}





const defaultCharacters: Character[] = [

  {

    id:
      "luna",

    name:
      "لونا",

    avatar:
      "👧",

    greeting:
      "أنا لونا، سأساعدك في اكتشاف الأشخاص المناسبين لك.",

    description:
      "مساعدة لطيفة لاختيار الخطوات المناسبة.",

  },


  {

    id:
      "adam",

    name:
      "آدم",

    avatar:
      "👦",

    greeting:
      "أنا آدم، سأساعدك في استخدام قلبي لوڤي بسهولة.",

    description:
      "مساعدك في تجربة الموقع.",

  },


];






export default function KidsAssistant({

  memberId,

}: KidsAssistantProps) {



  const supabase =
    createClient();



  const [
    characters,
    setCharacters
  ] =
    useState<Character[]>(
      defaultCharacters
    );



  const [
    selected,
    setSelected
  ] =
    useState<Character>(
      defaultCharacters[0]
    );



  const [
    open,
    setOpen
  ] =
    useState(false);



  const [
    message,
    setMessage
  ] =
    useState("");







  useEffect(() => {


    loadCharacters();


  }, []);







  async function loadCharacters() {


    const {
      data,
      error,
    } =
      await supabase
        .from(
          "assistant_characters"
        )
        .select(
          "*"
        )
        .eq(
          "active",
          true
        );





    if (
      !error &&
      data &&
      data.length
    ) {


      setCharacters(
        data
      );



      setSelected(
        data[0]
      );


    }


  }








  function chooseCharacter(

    character: Character

  ) {


    setSelected(
      character
    );



    setMessage(
      character.greeting
    );


  }








  async function saveInteraction() {


    if (
      !memberId ||
      !message
    ) {

      return;

    }




    await supabase
      .from(
        "assistant_logs"
      )
      .insert({

        member_id:
          memberId,

        question:
          "kids_assistant",

        answer:
          message,

      });


  }








  return (

    <div

      dir="rtl"

      className="
        fixed
        bottom-24
        right-6
        z-40
      "

    >



      <button

        onClick={() =>
          setOpen(
            !open
          )
        }

        className="
          w-16
          h-16
          rounded-full
          bg-white
          shadow-xl
          text-4xl
        "

      >

        {selected.avatar}

      </button>







      {
        open && (

          <div

            className="
              absolute
              bottom-20
              right-0
              w-80
              bg-white
              rounded-2xl
              shadow-xl
              p-5
            "

          >


            <h3

              className="
                font-bold
                text-rose-700
                mb-4
              "

            >

              المساعد الصغير 💕

            </h3>







            <div

              className="
                flex
                gap-3
                mb-5
              "

            >

              {
                characters.map(
                  (character) => (

                    <button

                      key={
                        character.id
                      }

                      onClick={() =>
                        chooseCharacter(
                          character
                        )
                      }

                      className="
                        text-3xl
                        p-2
                        rounded-xl
                        hover:bg-rose-50
                      "

                    >

                      {character.avatar}

                    </button>

                  )
                )
              }


            </div>







            <div

              className="
                bg-rose-50
                rounded-xl
                p-4
              "

            >


              <h4
                className="
                  font-bold
                "
              >

                {selected.name}

              </h4>



              <p

                className="
                  mt-2
                  text-gray-600
                "

              >

                {
                  message ||
                  selected.greeting
                }

              </p>



            </div>







            <button

              onClick={
                saveInteraction
              }

              className="
                qalby-button
                w-full
                mt-4
              "

            >

              حفظ المحادثة

            </button>




          </div>

        )

      }



    </div>

  );

}