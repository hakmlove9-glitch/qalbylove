"use client";

import { useState } from "react";


interface Character {

  id: string;

  name: string;

  avatar: string;

  greeting: string;

}



interface KidsAssistantProps {

  memberId?: string;

}




const characters: Character[] = [

  {

    id: "luna",

    name: "لونا",

    avatar: "👧",

    greeting:
      "أنا لونا، سأساعدك في اكتشاف الأشخاص المناسبين لك.",

  },


  {

    id: "adam",

    name: "آدم",

    avatar: "👦",

    greeting:
      "أنا آدم، سأساعدك في استخدام قلبي لوڤي بسهولة.",

  },


];





export default function KidsAssistant({

  memberId,

}: KidsAssistantProps) {


  const [
    selected,
    setSelected
  ] =
    useState<Character>(
      characters[0]
    );



  const [
    open,
    setOpen
  ] =
    useState(false);



  const [
    history,
    setHistory
  ] =
    useState<string[]>([]);





  function selectCharacter(
    character: Character
  ) {


    setSelected(
      character
    );


    setHistory(
      (prev) => [
        ...prev,
        character.greeting,
      ]
    );


  }





  function getGreeting() {


    if (!memberId) {

      return selected.greeting;

    }


    return `${selected.greeting} سعيد برؤيتك مرة أخرى.`;


  }





  return (

    <div>


      <button

        onClick={() =>
          setOpen(
            !open
          )
        }

      >

        {selected.avatar}

      </button>





      {
        open && (

          <div>


            <div>

              {
                characters.map(
                  (character) => (

                    <button

                      key={
                        character.id
                      }

                      onClick={() =>
                        selectCharacter(
                          character
                        )
                      }

                    >

                      {character.avatar}
                      {character.name}

                    </button>

                  )
                )
              }

            </div>





            <div>

              <h4>

                {selected.name}

              </h4>


              <p>

                {getGreeting()}

              </p>


            </div>





            <div>

              {
                history.map(
                  (
                    item,
                    index
                  ) => (

                    <p
                      key={index}
                    >
                      {item}
                    </p>

                  )
                )
              }

            </div>



          </div>

        )

      }



    </div>

  );


}