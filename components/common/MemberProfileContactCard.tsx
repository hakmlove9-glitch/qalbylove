"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  createClient,
} from "@/lib/supabase/client";



interface MemberProfileContactCardProps {

  memberId:string;

  currentMemberId:string;

}







interface ContactState {

  requested:boolean;

  accepted:boolean;

  blocked:boolean;

}







export default function MemberProfileContactCard({

  memberId,

  currentMemberId,

}:MemberProfileContactCardProps){



  const supabase =
    createClient();



  const [

    state,

    setState

  ] =

  useState<ContactState>({

    requested:false,

    accepted:false,

    blocked:false,

  });



  const [

    loading,

    setLoading

  ] =

  useState(false);









  async function loadStatus(){



    const {

      data:request

    } =

      await supabase

        .from("member_requests")

        .select(

          "status"

        )

        .or(

          `and(sender_id.eq.${currentMemberId},receiver_id.eq.${memberId}),and(sender_id.eq.${memberId},receiver_id.eq.${currentMemberId})`

        )

        .maybeSingle();







    const {

      data:block

    } =

      await supabase

        .from("blocked_members")

        .select(

          "id"

        )

        .eq(

          "blocker_id",

          currentMemberId

        )

        .eq(

          "blocked_id",

          memberId

        )

        .maybeSingle();







    setState({

      requested:

        request?.status === "pending",

      accepted:

        request?.status === "accepted",

      blocked:

        !!block,

    });



  }









  async function sendRequest(){



    setLoading(

      true

    );







    await supabase

      .from("member_requests")

      .insert({

        sender_id:

          currentMemberId,

        receiver_id:

          memberId,

        status:

          "pending",

      });







    await loadStatus();







    setLoading(

      false

    );



  }









  async function cancelRequest(){



    setLoading(

      true

    );







    await supabase

      .from("member_requests")

      .delete()

      .eq(

        "sender_id",

        currentMemberId

      )

      .eq(

        "receiver_id",

        memberId

      );







    await loadStatus();







    setLoading(

      false

    );



  }









  async function blockMember(){



    setLoading(

      true

    );







    await supabase

      .from("blocked_members")

      .insert({

        blocker_id:

          currentMemberId,

        blocked_id:

          memberId,

      });







    await loadStatus();







    setLoading(

      false

    );



  }









  useEffect(()=>{



    loadStatus();





    const channel =

      supabase

        .channel(

          `contact-card-${memberId}`

        )

        .on(

          "postgres_changes",

          {

            event:"*",

            schema:"public",

          },

          ()=>{


            loadStatus();


          }

        )

        .subscribe();







    return ()=>{



      supabase.removeChannel(

        channel

      );



    };



  },[memberId,currentMemberId]);









  return (

    <div

      dir="rtl"

      className="
        bg-white
        rounded-2xl
        shadow
        p-5
      "

    >



      <h3

        className="
          font-bold
          text-xl
          text-rose-700
          mb-4
        "

      >

        التواصل

      </h3>







      {
        state.blocked

        ?

        (

          <p

            className="
              text-red-600
            "

          >

            تم حظر هذا العضو

          </p>

        )

        :

        (

          <div

            className="
              flex
              gap-3
              flex-wrap
            "

          >


            {
              state.accepted

              ?

              (

                <button

                  className="
                    bg-green-600
                    text-white
                    rounded-xl
                    px-6
                    py-3
                  "

                >

                  💬 فتح المحادثة

                </button>

              )

              :

              state.requested

              ?

              (

                <button

                  onClick={cancelRequest}

                  className="
                    bg-gray-200
                    rounded-xl
                    px-6
                    py-3
                  "

                >

                  إلغاء الطلب

                </button>

              )

              :

              (

                <button

                  onClick={sendRequest}

                  disabled={loading}

                  className="
                    bg-rose-700
                    text-white
                    rounded-xl
                    px-6
                    py-3
                  "

                >

                  إرسال طلب تواصل

                </button>

              )

            }







            <button

              onClick={blockMember}

              className="
                border
                border-red-300
                text-red-600
                rounded-xl
                px-6
                py-3
              "

            >

              حظر

            </button>




          </div>

        )

      }





    </div>

  );


}