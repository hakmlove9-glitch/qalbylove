"use client";

import {
  useEffect,
  useState,
} from "react";


interface WaitingSystemProps {

  show?: boolean;

  message?: string;

}



const messages = [

  "نجهز لك تجربة مميزة ❤️",

  "نبحث عن أفضل الاقتراحات لك 💕",

  "لحظات قليلة ونكون جاهزين ✨",

  "قلبي لوڤي معك في كل خطوة 🤍",

];



const characters = [

  {
    id:
      "luna",

    name:
      "لونا",

    avatar:
      "👧",

  },

  {

    id:
      "adam",

    name:
      "آدم",

    avatar:
      "👦",

  },

];






export default function WaitingSystem({

  show = true,

  message,

}: WaitingSystemProps) {



  const [
    index,
    setIndex
  ] =
    useState(0);



  const [
    character,
    setCharacter
  ] =
    useState(
      characters[0]
    );






  useEffect(() => {



    const timer =

      setInterval(

        () => {

          setIndex(

            (value) =>

              (value + 1)

              %

              messages.length

          );

        },

        3500

      );







    const characterTimer =

      setInterval(

        () => {


          setCharacter(

            (value) =>

              value.id === "luna"

                ? characters[1]

                : characters[0]

          );

        },

        6000

      );







    return () => {


      clearInterval(
        timer
      );


      clearInterval(
        characterTimer
      );


    };



  }, []);








  if (!show) {

    return null;

  }







  return (

    <div

      dir="rtl"

      className="
        fixed
        bottom-24
        left-6
        z-40
        bg-white
        shadow-xl
        rounded-2xl
        p-4
        flex
        items-center
        gap-3
        max-w-sm
      "

    >


      <div

        className="
          w-14
          h-14
          rounded-full
          bg-rose-50
          flex
          items-center
          justify-center
          text-3xl
          animate-bounce
        "

      >

        {character.avatar}

      </div>





      <div>


        <h4

          className="
            font-bold
            text-rose-700
          "

        >

          {character.name}

        </h4>




        <p

          className="
            text-sm
            text-gray-600
          "

        >

          {
            message ||
            messages[index]
          }

        </p>



      </div>



    </div>

  );

}