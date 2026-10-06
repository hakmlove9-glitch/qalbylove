"use client";

import {
  useState,
} from "react";



interface MemberGalleryProps {

  images:string[];

  name:string;

}






export default function MemberGallery({

  images,

  name,

}:MemberGalleryProps){



  const [

    selected,

    setSelected

  ] =

  useState(

    images?.[0] || ""

  );







  if(

    !images ||

    images.length === 0

  ){

    return (

      <div

        className="
          h-96
          rounded-3xl
          bg-rose-50
          flex
          items-center
          justify-center
          text-7xl
        "

      >

        👤

      </div>

    );

  }








  return (

    <div

      dir="rtl"

      className="
        space-y-4
      "

    >



      <div

        className="
          h-[500px]
          rounded-3xl
          overflow-hidden
          bg-white
          shadow-xl
        "

      >


        <img

          src={selected}

          alt={name}

          className="
            w-full
            h-full
            object-cover
          "

        />


      </div>








      <div

        className="
          grid
          grid-cols-4
          gap-3
        "

      >



        {
          images.map(

            (image,index)=>(


              <button

                key={index}

                onClick={()=>{

                  setSelected(

                    image

                  );

                }}

                className={`
                  h-24
                  rounded-xl
                  overflow-hidden
                  border-2
                  ${
                    selected===image

                    ?

                    "border-rose-700"

                    :

                    "border-transparent"
                  }
                `}

              >


                <img

                  src={image}

                  alt={`${name}-${index}`}

                  className="
                    w-full
                    h-full
                    object-cover
                  "

                />


              </button>


            )

          )

        }




      </div>





    </div>

  );


}