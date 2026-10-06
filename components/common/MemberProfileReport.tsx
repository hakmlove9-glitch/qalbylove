"use client";

import {
  useState,
} from "react";

import {
  createClient,
} from "@/lib/supabase/client";



interface MemberProfileReportProps {

  memberId: string;

  currentMemberId: string;

}





export default function MemberProfileReport({

  memberId,

  currentMemberId,

}: MemberProfileReportProps) {


  const supabase =
    createClient();



  const [
    open,
    setOpen,
  ] =
    useState(false);



  const [
    reason,
    setReason,
  ] =
    useState("");



  const [
    sending,
    setSending,
  ] =
    useState(false);



  const [
    sent,
    setSent,
  ] =
    useState(false);







  async function sendReport() {


    if (
      !reason.trim()
    ) {

      return;

    }




    setSending(true);





    await supabase
      .from("reports")
      .insert({

        reporter_id:
          currentMemberId,

        reported_member_id:
          memberId,

        reason,

        status:
          "pending",

        created_at:
          new Date()
            .toISOString(),

      });







    setSent(true);

    setSending(false);

    setReason("");

  }







  return (

    <div

      dir="rtl"

      className="
        relative
      "

    >


      <button

        onClick={() =>
          setOpen(
            !open
          )
        }

        className="
          font-bold
          text-red-600
        "

      >

        ⚠️ إبلاغ

      </button>







      {
        open && (

          <div

            className="
              absolute
              right-0
              z-50
              mt-3
              w-80
              rounded-2xl
              bg-white
              p-5
              shadow-xl
            "

          >


            {
              sent

                ?

                (

                  <p

                    className="
                      font-bold
                      text-green-600
                    "

                  >

                    تم إرسال البلاغ للمراجعة

                  </p>

                )

                :

                (

                  <>

                    <h3

                      className="
                        mb-3
                        font-bold
                      "

                    >

                      سبب البلاغ

                    </h3>



                    <textarea

                      value={
                        reason
                      }

                      onChange={(e) =>
                        setReason(
                          e.target.value
                        )
                      }

                      placeholder="اكتب سبب البلاغ"

                      className="
                        h-24
                        w-full
                        rounded-xl
                        border
                        p-3
                      "

                    />





                    <button

                      onClick={
                        sendReport
                      }

                      disabled={
                        sending
                      }

                      className="
                        mt-3
                        w-full
                        rounded-xl
                        bg-red-600
                        py-3
                        text-white
                      "

                    >

                      {
                        sending

                          ?

                          "جاري الإرسال..."

                          :

                          "إرسال البلاغ"
                      }


                    </button>


                  </>

                )
            }



          </div>

        )
      }



    </div>

  );

}