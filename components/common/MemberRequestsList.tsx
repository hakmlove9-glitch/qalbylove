"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  createClient,
} from "@/lib/supabase/client";



interface MemberRequestsListProps {

  memberId:string;

}





interface RequestItem {

  id:string;

  sender_id:string;

  status:string;

  created_at:string;

  sender?:{

    id:string;

    name:string;

    image:string;

    age:number;

    city:string;

  };

}








export default function MemberRequestsList({

  memberId,

}:MemberRequestsListProps){



  const supabase =
    createClient();



  const [

    requests,

    setRequests

  ] =

  useState<RequestItem[]>([]);





  const [

    loading,

    setLoading

  ] =

  useState(true);









  async function loadRequests(){



    const {

      data,

      error

    } =

      await supabase

        .from("member_requests")

        .select(`

          id,

          sender_id,

          status,

          created_at,

          sender:members!member_requests_sender_id_fkey(

            id,

            name,

            image,

            age,

            city

          )

        `)

        .eq(

          "receiver_id",

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



      setRequests(

        data as unknown as RequestItem[]

      );



    }







    setLoading(

      false

    );



  }









  async function updateRequest(

    id:string,

    status:string

  ){



    await supabase

      .from("member_requests")

      .update({

        status,

      })

      .eq(

        "id",

        id

      );







    loadRequests();



  }









  useEffect(()=>{



    loadRequests();







    const channel =

      supabase

        .channel(

          `requests-${memberId}`

        )

        .on(

          "postgres_changes",

          {

            event:"*",

            schema:"public",

            table:"member_requests",

            filter:

              `receiver_id=eq.${memberId}`

          },

          ()=>{


            loadRequests();


          }

        )

        .subscribe();







    return ()=>{



      supabase.removeChannel(

        channel

      );



    };



  },[memberId]);









  if(loading){



    return (

      <p>

        جاري تحميل الطلبات...

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
          text-2xl
          font-bold
          text-rose-700
          mb-5
        "

      >

        طلبات التواصل 💌

      </h2>







      {
        requests.length === 0 && (

          <p

            className="
              text-gray-500
            "

          >

            لا توجد طلبات حالياً

          </p>

        )

      }








      <div

        className="
          space-y-4
        "

      >



        {
          requests.map(

            item=>(


              <div

                key={
                  item.id
                }

                className="
                  border
                  rounded-xl
                  p-4
                  flex
                  items-center
                  justify-between
                  gap-4
                "

              >



                <div

                  className="
                    flex
                    items-center
                    gap-3
                  "

                >



                  <img

                    src={
                      item.sender?.image ||
                      "/avatar.png"
                    }

                    className="
                      w-14
                      h-14
                      rounded-full
                      object-cover
                    "

                  />



                  <div>


                    <h4

                      className="
                        font-bold
                      "

                    >

                      {
                        item.sender?.name
                      }

                    </h4>


                    <p

                      className="
                        text-sm
                        text-gray-500
                      "

                    >

                      {
                        item.sender?.city
                      }

                    </p>


                  </div>


                </div>







                {
                  item.status === "pending"

                  ?

                  <div

                    className="
                      flex
                      gap-2
                    "

                  >

                    <button

                      onClick={()=>updateRequest(
                        item.id,
                        "accepted"
                      )}

                      className="
                        bg-green-600
                        text-white
                        rounded-xl
                        px-4
                        py-2
                      "

                    >

                      قبول

                    </button>




                    <button

                      onClick={()=>updateRequest(
                        item.id,
                        "rejected"
                      )}

                      className="
                        bg-gray-200
                        rounded-xl
                        px-4
                        py-2
                      "

                    >

                      رفض

                    </button>


                  </div>


                  :

                  <span>

                    {item.status}

                  </span>


                }



              </div>


            )

          )

        }



      </div>




    </section>

  );


}