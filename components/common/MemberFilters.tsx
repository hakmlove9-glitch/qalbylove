"use client";

import {
  useState,
} from "react";

import { createClient } from "@/lib/supabase/client";


interface MemberFiltersProps {

  onFilter?:
    (
      data: unknown[]
    ) => void;

}




interface FilterState {

  gender: string;

  city: string;

  religion: string;

  education: string;

  maritalStatus: string;

  minAge: string;

  maxAge: string;

}





const supabase = createClient();






export default function MemberFilters({

  onFilter,

}: MemberFiltersProps) {



  const [
    filters,
    setFilters
  ] = useState<FilterState>({

    gender: "",

    city: "",

    religion: "",

    education: "",

    maritalStatus: "",

    minAge: "",

    maxAge: "",

  });





  const [
    loading,
    setLoading
  ] = useState(false);







  function change(

    key: keyof FilterState,

    value: string

  ) {


    setFilters(

      old => ({

        ...old,

        [key]: value,

      })

    );

  }









  async function applyFilters() {


    setLoading(true);



    let query = supabase

      .from("members")

      .select("*");





    if (filters.gender) {

      query = query.eq(
        "gender",
        filters.gender
      );

    }





    if (filters.city) {

      query = query.eq(
        "city",
        filters.city
      );

    }





    if (filters.religion) {

      query = query.eq(
        "religion",
        filters.religion
      );

    }





    if (filters.education) {

      query = query.eq(
        "education",
        filters.education
      );

    }





    if (filters.maritalStatus) {

      query = query.eq(
        "marital_status",
        filters.maritalStatus
      );

    }





    if (filters.minAge) {

      query = query.gte(
        "age",
        Number(filters.minAge)
      );

    }





    if (filters.maxAge) {

      query = query.lte(
        "age",
        Number(filters.maxAge)
      );

    }






    const {
      data,
      error
    } = await query;





    if (!error && data) {

      onFilter?.(
        data
      );

    }





    setLoading(false);


  }









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


      <h2

        className="
          text-2xl
          font-bold
          text-rose-700
          mb-5
        "

      >

        خيارات البحث المتقدم 🔎

      </h2>





      <div

        className="
          grid
          md:grid-cols-3
          gap-4
        "

      >



        <input

          value={filters.city}

          onChange={(e)=>
            change(
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

          value={filters.religion}

          onChange={(e)=>
            change(
              "religion",
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

          value={filters.education}

          onChange={(e)=>
            change(
              "education",
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





        <select

          value={filters.gender}

          onChange={(e)=>
            change(
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

          type="number"

          value={filters.minAge}

          onChange={(e)=>
            change(
              "minAge",
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

          type="number"

          value={filters.maxAge}

          onChange={(e)=>
            change(
              "maxAge",
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



      </div>





      <button

        onClick={applyFilters}

        className="
          qalby-button
          w-full
          mt-6
        "

      >

        {
          loading

          ? "جاري البحث..."

          : "تطبيق البحث ❤️"
        }


      </button>



    </div>

  );


}