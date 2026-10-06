"use client";

import {
  useState,
} from "react";

import {
  createClient,
} from "@/lib/supabase/client";


interface MemberProfileMenuProps {

  memberId: string;

  currentMemberId: string;

}





export default function MemberProfileMenu({

  memberId,

  currentMemberId,

}: MemberProfileMenuProps) {


  const supabase =
    createClient();


  const [
    open,
    setOpen,
  ] =
    useState(false);



  const [
    blocked,
    setBlocked,
  ] =
    useState(false);







  async function blockMember() {


    if (
      !currentMemberId ||
      !memberId
    ) {
      return;
    }



    await supabase
      .from("blocked_members")
      .insert({

        blocker_id:
          currentMemberId,

        blocked_id:
          memberId,

      });



    setBlocked(true);

  }







  async function removeBlock() {


    await supabase
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



    setBlocked(false);

  }







  async function hideProfile() {


    if (
      !currentMemberId ||
      !memberId
    ) {
      return;
    }



    await supabase
      .from("hidden_profiles")
      .insert({

        member_id:
          currentMemberId,

        hidden_member_id:
          memberId,

      });

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
            (value) => !value
          )
        }

        className="
          flex
          h-10
          w-10
          items-center
          justify-center
          rounded-full
          bg-gray-100
          text-xl
          transition
          hover:bg-gray-200
        "

      >

        ⋮

      </button>







      {
        open && (

          <div

            className="
              absolute
              left-0
              z-50
              mt-2
              w-52
              rounded-xl
              bg-white
              p-3
              shadow-xl
            "

          >


            {
              blocked

                ?

                (

                  <button

                    onClick={
                      removeBlock
                    }

                    className="
                      w-full
                      py-2
                      text-right
                      text-green-700
                    "

                  >

                    إلغاء الحظر

                  </button>

                )

                :

                (

                  <button

                    onClick={
                      blockMember
                    }

                    className="
                      w-full
                      py-2
                      text-right
                      text-red-600
                    "

                  >

                    🚫 حظر العضو

                  </button>

                )

            }







            <button

              onClick={
                hideProfile
              }

              className="
                w-full
                py-2
                text-right
                text-gray-700
              "

            >

              إخفاء الملف

            </button>







            <button

              onClick={() => {

                if (
                  navigator.share
                ) {

                  navigator.share({

                    title:
                      "ملف عضو قلبي لوڤي",

                    url:
                      window.location.href,

                  });

                }

              }}

              className="
                w-full
                py-2
                text-right
                text-gray-700
              "

            >

              مشاركة الملف

            </button>



          </div>

        )
      }



    </div>

  );

}