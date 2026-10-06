"use client";

import {
  useState,
} from "react";

import { createClient } from "@/lib/supabase/client";


interface SearchFiltersProps {

  onResults?:
    (
      data: unknown[]
    ) => void;

}



interface Filters {

  gender: string;

  city: string;

  minAge: string;

  maxAge: string;

  status: string;

}




const supabase = createClient();







export default function SearchFilters({

  onResults,

}: SearchFiltersProps) {



  const [
    filters,
    setFilters
  ] = useState<Filters>({

    gender: "",

    city: "",

    minAge: "",

    maxAge: "",

    status: "",

  });







  const [
    loading,
    setLoading
  ] = useState(false);








  function update(

    key: keyof Filters,

    value: string

  ) {


    setFilters(

      old => ({

        ...old,

        [key]: value,

      })

    );


  }








  async function search() {



    setLoading(true);






    let query = supabase

      .from("members")

      .select(`

        id,

        name,

        age,

        city,

        image,

        status,

        interests

      `);







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







    if (filters.status) {

      query = query.eq(

        "status",

        filters.status

      );

    }








    const {

      data,

      error

    } = await query;







    if (!error && data) {

      onResults?.(

        data

      );

    }







    setLoading(false);



  }









  return (

    <div

      dir="rtl"

      className="
        qalby-card
        bg-white
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

        بحث متقدم 🔎

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

          onChange={(e)=>

            update(

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

          onChange={(e)=>

            update(

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







        <select

          value={filters.status}

          onChange={(e)=>

            update(

              "status",

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

            الحالة

          </option>


          <option value="single">

            أعزب

          </option>


          <option value="active">

            نشط

          </option>


        </select>







        <input

          type="number"

          value={filters.minAge}

          onChange={(e)=>

            update(

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

            update(

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

        onClick={search}

        className="
          qalby-button
          w-full
          mt-6
        "

      >

        {
          loading

          ? "جاري البحث..."

          : "بحث ❤️"
        }


      </button>




    </div>

  );


}