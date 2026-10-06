"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  createClient,
} from "@/lib/supabase/client";



interface MemberReportHistoryProps {

  memberId:string;

}






interface Report {

  id:string;

  reason:string;

  status:string;

  created_at:string;

}








export default function MemberReportHistory({

  memberId,

}:MemberReportHistoryProps){



  const supabase =
    createClient();



  const [

    reports,

    setReports

  ] =

  useState<Report[]>([]);



  const [

    loading,

    setLoading

  ] =

  useState(true);









  async function loadReports(){



    const {

      data,

      error

    } =

      await supabase

        .from("reports")

        .select(`

          id,

          reason,

          status,

          created_at

        `)

        .eq(

          "reported_member_id",

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



      setReports(

        data

      );



    }







    setLoading(

      false

    );



  }









  useEffect(()=>{



    loadReports();







    const channel =

      supabase

        .channel(

          `reports-${memberId}`

        )

        .on(

          "postgres_changes",

          {

            event:"*",

            schema:"public",

            table:"reports",

            filter:

              `reported_member_id=eq.${memberId}`

          },

          ()=>{


            loadReports();


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

        سجل البلاغات

      </h2>







      {
        loading && (

          <p>

            جاري التحميل...

          </p>

        )

      }








      {
        !loading &&

        reports.length === 0 && (

          <p

            className="
              text-gray-500
            "

          >

            لا يوجد بلاغات

          </p>

        )

      }








      <div

        className="
          space-y-3
        "

      >

        {
          reports.map(

            report=>(


              <div

                key={
                  report.id
                }

                className="
                  border
                  rounded-xl
                  p-4
                "

              >


                <p

                  className="
                    font-bold
                  "

                >

                  {report.reason}

                </p>



                <div

                  className="
                    flex
                    justify-between
                    mt-2
                    text-sm
                    text-gray-500
                  "

                >

                  <span>

                    الحالة: {report.status}

                  </span>



                  <span>

                    {
                      new Date(

                        report.created_at

                      )

                      .toLocaleDateString(

                        "ar-EG"

                      )

                    }

                  </span>



                </div>



              </div>


            )

          )

        }



      </div>




    </section>

  );


}