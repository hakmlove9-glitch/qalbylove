"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";


interface SearchFilters {

  gender: string;

  city: string;

  minAge: string;

  maxAge: string;

  interest: string;

}



interface AdvancedSearchProps {

  onResults?: (data: any[]) => void;

}



export default function AdvancedSearch({
  onResults,
}: AdvancedSearchProps) {


  const supabase =
    createClient();


  const [filters, setFilters] =
    useState<SearchFilters>({
      gender: "",
      city: "",
      minAge: "",
      maxAge: "",
      interest: "",
    });



  const [loading, setLoading] =
    useState(false);



  function updateFilter(
    key: keyof SearchFilters,
    value: string
  ) {

    setFilters(
      (prev) => ({
        ...prev,
        [key]: value,
      })
    );

  }




  async function searchMembers() {

    setLoading(true);


    let query =
      supabase
        .from("members")
        .select(
          `
          id,
          name,
          age,
          city,
          image,
          interests
          `
        );




    if (filters.gender) {

      query =
        query.eq(
          "gender",
          filters.gender
        );

    }



    if (filters.city) {

      query =
        query.eq(
          "city",
          filters.city
        );

    }



    if (filters.minAge) {

      query =
        query.gte(
          "age",
          Number(filters.minAge)
        );

    }



    if (filters.maxAge) {

      query =
        query.lte(
          "age",
          Number(filters.maxAge)
        );

    }



    if (filters.interest) {

      query =
        query.contains(
          "interests",
          [
            filters.interest
          ]
        );

    }





    const {
      data,
      error,
    } =
      await query;



    if (!error && data) {

      onResults?.(data);

    }



    setLoading(false);

  }





  return (

    <div
      className="
        qalby-card
        p-6
        bg-white
      "
      dir="rtl"
    >


      <h2
        className="
          text-2xl
          font-bold
          text-rose-700
          mb-6
        "
      >
        البحث المتقدم 🔎
      </h2>




      <div
        className="
          grid
          md:grid-cols-3
          gap-4
        "
      >


        <select

          value={filters.gender}

          onChange={(e) =>
            updateFilter(
              "gender",
              e.target.value
            )
          }

          className="
            border
            rounded-xl
            p-3
          "

        >

          <option value="">
            الجنس
          </option>

          <option value="male">
            رجل
          </option>

          <option value="female">
            امرأة
          </option>


        </select>





        <input

          value={filters.city}

          onChange={(e) =>
            updateFilter(
              "city",
              e.target.value
            )
          }

          placeholder=""

          className="
            border
            rounded-xl
            p-3
          "

        />





        <input

          value={filters.interest}

          onChange={(e) =>
            updateFilter(
              "interest",
              e.target.value
            )
          }

          placeholder=""

          className="
            border
            rounded-xl
            p-3
          "

        />





        <input

          value={filters.minAge}

          onChange={(e) =>
            updateFilter(
              "minAge",
              e.target.value
            )
          }

          placeholder=""

          type="number"

          className="
            border
            rounded-xl
            p-3
          "

        />





        <input

          value={filters.maxAge}

          onChange={(e) =>
            updateFilter(
              "maxAge",
              e.target.value
            )
          }

          placeholder=""

          type="number"

          className="
            border
            rounded-xl
            p-3
          "

        />


      </div>





      <button

        onClick={searchMembers}

        disabled={loading}

        className="
          qalby-button
          mt-6
          w-full
        "

      >

        {
          loading
          ? "جاري البحث..."
          : "بحث الآن ❤️"
        }

      </button>


    </div>

  );


}