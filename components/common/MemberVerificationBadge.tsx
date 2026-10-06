"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  createClient,
} from "@/lib/supabase/client";


interface MemberVerificationBadgeProps {

  memberId: string;

}





export default function MemberVerificationBadge({

  memberId,

}: MemberVerificationBadgeProps) {


  const supabase =
    createClient();



  const [
    verified,
    setVerified,
  ] =
    useState(false);



  const [
    loading,
    setLoading,
  ] =
    useState(true);







  async function checkVerification() {


    const {
      data,
      error,
    } =
      await supabase
        .from("members")
        .select(
          "verified"
        )
        .eq(
          "id",
          memberId
        )
        .single();




    if (
      !error &&
      data
    ) {

      setVerified(
        Boolean(
          data.verified
        )
      );

    }



    setLoading(false);

  }







  useEffect(() => {


    checkVerification();



    const channel =
      supabase
        .channel(
          `verification-badge-${memberId}`
        )
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "members",
            filter:
              `id=eq.${memberId}`,
          },
          () => {

            checkVerification();

          }
        )
        .subscribe();




    return () => {

      supabase.removeChannel(
        channel
      );

    };


  }, [memberId, supabase]);







  if (
    loading ||
    !verified
  ) {

    return null;

  }







  return (

    <span

      title="حساب موثّق بعد مراجعة الهوية"

      className="
        inline-flex
        h-6
        w-6
        items-center
        justify-center
        rounded-full
        bg-emerald-500
        text-sm
        font-bold
        text-white
      "

    >

      ✓

    </span>

  );

}