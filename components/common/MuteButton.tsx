"use client";

import {
  useEffect,
  useState,
} from "react";



interface MuteButtonProps {

  defaultMuted?: boolean;

  onChange?: (
    muted:boolean
  ) => void;

}





export default function MuteButton({

  defaultMuted = false,

  onChange,

}: MuteButtonProps) {



  const [
    muted,
    setMuted
  ] =
    useState(
      defaultMuted
    );







  useEffect(() => {


    const saved =
      localStorage.getItem(
        "qalby-muted"
      );



    if (
      saved !== null
    ) {


      setMuted(
        saved === "true"
      );


    }


  }, []);








  function toggleMute() {


    const value =
      !muted;



    setMuted(
      value
    );



    localStorage.setItem(

      "qalby-muted",

      String(
        value
      )

    );



    onChange?.(
      value
    );


  }







  return (

    <button

      type="button"

      onClick={
        toggleMute
      }

      className="
        fixed
        bottom-6
        right-28
        z-50
        w-12
        h-12
        rounded-full
        bg-white
        shadow-lg
        border
        flex
        items-center
        justify-center
        text-xl
      "

    >

      {
        muted
        ? "🔇"
        : "🔊"
      }


    </button>

  );

}