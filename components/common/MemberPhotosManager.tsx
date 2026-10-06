"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  createClient,
} from "@/lib/supabase/client";



interface MemberPhotosManagerProps {

  memberId:string;

  editable?:boolean;

}






interface Photo {

  id:string;

  url:string;

  created_at:string;

}







export default function MemberPhotosManager({

  memberId,

  editable = false,

}:MemberPhotosManagerProps){



  const supabase =
    createClient();



  const [

    photos,

    setPhotos

  ] =

  useState<Photo[]>([]);



  const [

    uploading,

    setUploading

  ] =

  useState(false);









  async function loadPhotos(){



    const {

      data,

      error

    } =

      await supabase

        .from("member_photos")

        .select("*")

        .eq(

          "member_id",

          memberId

        )

        .order(

          "created_at",

          {

            ascending:false

          }

        );







    if(

      !error &&

      data

    ){



      setPhotos(

        data

      );



    }



  }









  async function uploadPhoto(

    event:

      React.ChangeEvent<HTMLInputElement>

  ){



    const file =

      event.target.files?.[0];





    if(!file){

      return;

    }







    setUploading(

      true

    );







    const fileName =

      `${memberId}/${Date.now()}-${file.name}`;








    const {

      error

    } =

      await supabase

        .storage

        .from("profiles")

        .upload(

          fileName,

          file

        );







    if(!error){



      const {

        data

      } =

        supabase

          .storage

          .from("profiles")

          .getPublicUrl(

            fileName

          );








      await supabase

        .from("member_photos")

        .insert({

          member_id:

            memberId,

          url:

            data.publicUrl,

        });







      loadPhotos();



    }







    setUploading(

      false

    );



  }









  async function removePhoto(

    id:string

  ){



    await supabase

      .from("member_photos")

      .delete()

      .eq(

        "id",

        id

      );







    loadPhotos();



  }









  useEffect(()=>{



    loadPhotos();







    const channel =

      supabase

        .channel(

          `photos-${memberId}`

        )

        .on(

          "postgres_changes",

          {

            event:"*",

            schema:"public",

            table:"member_photos",

            filter:

              `member_id=eq.${memberId}`

          },

          ()=>{


            loadPhotos();


          }

        )

        .subscribe();







    return ()=>{



      supabase.removeChannel(

        channel

      );



    };



  },[memberId]);









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

        الصور 📸

      </h2>







      {
        editable && (

          <label

            className="
              block
              mb-5
              cursor-pointer
              bg-rose-50
              rounded-xl
              p-4
              text-center
            "

          >

            {
              uploading

              ?

              "جاري الرفع..."

              :

              "إضافة صورة جديدة"

            }


            <input

              type="file"

              accept="image/*"

              onChange={
                uploadPhoto
              }

              className="
                hidden
              "

            />

          </label>

        )

      }








      <div

        className="
          grid
          grid-cols-2
          md:grid-cols-4
          gap-4
        "

      >



        {
          photos.map(

            photo=>(


              <div

                key={photo.id}

                className="
                  relative
                  rounded-xl
                  overflow-hidden
                  h-48
                "

              >


                <img

                  src={photo.url}

                  alt="photo"

                  className="
                    w-full
                    h-full
                    object-cover
                  "

                />





                {
                  editable && (

                    <button

                      onClick={()=>removePhoto(
                        photo.id
                      )}

                      className="
                        absolute
                        top-2
                        right-2
                        bg-red-600
                        text-white
                        rounded-full
                        px-3
                      "

                    >

                      ×

                    </button>

                  )

                }


              </div>


            )

          )

        }




      </div>




    </section>

  );


}