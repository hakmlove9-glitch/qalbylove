"use client";

import { useState } from "react";


type Props = {
  onResults: (data:any) => void;
};


export default function AdvancedSearch({
  onResults,
}: Props) {


  const [loading,setLoading] = useState(false);



  async function search(){


    setLoading(true);


    const res = await fetch(
      "/api/search"
    );


    const data = await res.json();


    alert(
      "عدد الأعضاء من API: " +
      (data.members?.length || 0)
    );


    onResults(data);



    setLoading(false);

  }




  return (

    <div
      className="
        bg-white
        rounded-3xl
        shadow
        p-8
      "
    >


      <button

        onClick={search}

        className="
          w-full
          bg-rose-600
          text-white
          rounded-xl
          py-4
          font-bold
        "

      >

        {
          loading
          ? "جاري البحث..."
          : "🔎 بحث عن أعضاء"
        }


      </button>


    </div>

  );

}