"use client";

import {
  useEffect,
  useState,
} from "react";

import { createClient } from "@/lib/supabase/client";


interface MemberVerificationStatusProps {

  memberId: string;

}



interface Verification {

  status: string;

  created_at: string;

  reviewed_at?: string;

}





const supabase = createClient();







export default function MemberVerificationStatus({

  memberId,

}: MemberVerificationStatusProps) {



  const [
    verification,
    setVerification
  ] = useState<Verification | null>(null);





  const [
    loading,
    setLoading
  ] = useState(true);








  async function loadVerification() {



    const {
      data,
      error
    } = await supabase

      .from("verification_requests")

      .select(`

        status,

        created_at,

        reviewed_at

      `)

      .eq(
        "member_id",
        memberId
      )

      .order(
        "created_at",
        {
          ascending: false,
        }
      )

      .limit(1)

      .maybeSingle();






    if (!error && data) {

      setVerification(
        data
      );

    }



    setLoading(false);

  }








  useEffect(() => {



    loadVerification();





    const channel = supabase

      .channel(
        `verification-status-${memberId}`
      )

      .on(

        "postgres_changes",

        {

          event: "*",

          schema: "public",

          table: "verification_requests",

          filter:
            `member_id=eq.${memberId}`,

        },

        () => {

          loadVerification();

        }

      )

      .subscribe();







    return () => {

      supabase.removeChannel(
        channel
      );

    };



  }, [memberId]);









  if (loading) {


    return (

      <p>

        جاري تحميل حالة التوثيق...

      </p>

    );


  }







  if (!verification) {


    return (

      <div

        dir="rtl"

        className="
          bg-white
          rounded-xl
          p-5
          shadow
        "

      >

        <span>

          لم يتم طلب التوثيق بعد

        </span>


      </div>

    );


  }







  const statusText = {

    pending:

      "طلبك قيد المراجعة ⏳",

    approved:

      "الحساب موثق ✅",

    rejected:

      "تم رفض طلب التوثيق",

  }[verification.status] ||

  verification.status;









  return (

    <div

      dir="rtl"

      className="
        bg-white
        rounded-2xl
        shadow
        p-6
      "

    >



      <h3

        className="
          text-xl
          font-bold
          text-rose-700
          mb-3
        "

      >

        حالة التوثيق

      </h3>





      <p

        className="
          text-gray-700
          font-bold
        "

      >

        {statusText}

      </p>





      <p

        className="
          text-sm
          text-gray-500
          mt-2
        "

      >

        تاريخ الطلب:

        {" "}

        {
          new Date(
            verification.created_at
          )
          .toLocaleDateString(
            "ar-EG"
          )
        }


      </p>





    </div>

  );


}