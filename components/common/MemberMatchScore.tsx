"use client";

import {
  useEffect,
  useState,
} from "react";

import { createClient } from "@/lib/supabase/client";


interface MemberMatchScoreProps {

  memberId: string;

  currentMemberId: string;

}





interface MatchData {

  score: number;

  commonInterests: string[];

  reasons: string[];

}





const supabase = createClient();







export default function MemberMatchScore({

  memberId,

  currentMemberId,

}: MemberMatchScoreProps) {



  const [
    match,
    setMatch
  ] = useState<MatchData>({

    score: 0,

    commonInterests: [],

    reasons: [],

  });





  const [
    loading,
    setLoading
  ] = useState(true);









  async function calculateMatch() {



    const {
      data: current,
      error: currentError,
    } = await supabase

      .from("members")

      .select(
        "interests,city,age"
      )

      .eq(
        "id",
        currentMemberId
      )

      .single();






    const {
      data: target,
      error: targetError,
    } = await supabase

      .from("members")

      .select(
        "interests,city,age"
      )

      .eq(
        "id",
        memberId
      )

      .single();







    if (

      currentError ||

      targetError ||

      !current ||

      !target

    ) {

      setLoading(false);

      return;

    }








    const first =
      current.interests || [];



    const second =
      target.interests || [];






    const common =
      first.filter(
        (item: string) =>
          second.includes(item)
      );







    let score = 40;







    if (

      current.city ===

      target.city

    ) {

      score += 20;

    }








    if (

      common.length

    ) {

      score +=

        common.length * 10;

    }








    if (

      score > 100

    ) {

      score = 100;

    }








    setMatch({

      score,

      commonInterests:

        common,

      reasons: [

        current.city === target.city

          ? "نفس المدينة"

          : "",



        common.length

          ? "اهتمامات مشتركة"

          : "",


      ].filter(Boolean),

    });







    setLoading(false);



  }









  useEffect(() => {

    calculateMatch();

  }, [memberId, currentMemberId]);









  if (loading) {


    return (

      <div>

        جاري حساب التوافق...

      </div>

    );

  }









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
          text-xl
          font-bold
          text-rose-700
        "

      >

        نسبة التوافق 💕

      </h3>







      <div

        className="
          mt-4
          text-4xl
          font-bold
          text-center
        "

      >

        {match.score}%

      </div>







      <div

        className="
          mt-5
          space-y-2
          text-gray-600
        "

      >

        {

          match.reasons.map(

            (reason, index) => (

              <p

                key={index}

              >

                ✓ {reason}

              </p>

            )

          )

        }



      </div>







    </div>

  );


}