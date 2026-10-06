"use client";

import {
  useState,
} from "react";

import { createClient } from "@/lib/supabase/client";


interface MemberSafetyProps {

  memberId: string;

  currentMemberId: string;

}



const supabase = createClient();





export default function MemberSafety({

  memberId,

  currentMemberId,

}: MemberSafetyProps) {



  const [
    blocked,
    setBlocked
  ] = useState(false);





  const [
    loading,
    setLoading
  ] = useState(false);









  async function blockMember() {



    setLoading(true);




    const {
      error
    } = await supabase

      .from("blocked_members")

      .insert({

        blocker_id: currentMemberId,

        blocked_id: memberId,

      });





    if (!error) {

      setBlocked(true);

    }




    setLoading(false);


  }









  async function unblockMember() {



    setLoading(true);




    const {
      error
    } = await supabase

      .from("blocked_members")

      .delete()

      .eq(

        "blocker_id",

        currentMemberId

      )

      .eq(

        "blocked_id",

        memberId

      );






    if (!error) {

      setBlocked(false);

    }




    setLoading(false);


  }









  async function hideProfile() {



    await supabase

      .from("hidden_profiles")

      .insert({

        member_id: currentMemberId,

        hidden_member_id: memberId,

      });


  }









  return (

    <div

      dir="rtl"

      className="
        flex
        gap-3
        flex-wrap
      "

    >



      {

        blocked

        ?

        (

          <button

            onClick={unblockMember}

            disabled={loading}

            className="
              rounded-xl
              bg-gray-200
              px-5
              py-3
            "

          >

            إلغاء الحظر

          </button>

        )


        :


        (

          <button

            onClick={blockMember}

            disabled={loading}

            className="
              rounded-xl
              bg-gray-200
              px-5
              py-3
            "

          >

            🚫 حظر العضو

          </button>

        )


      }






      <button

        onClick={hideProfile}

        className="
          rounded-xl
          border
          border-gray-300
          px-5
          py-3
        "

      >

        إخفاء الملف

      </button>





    </div>

  );


}