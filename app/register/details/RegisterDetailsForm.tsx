"use client";

import {
  useState,
} from "react";

import {
  useRouter,
  useSearchParams,
} from "next/navigation";


const Star = () => (
  <span
    style={{
      color: "#d10000",
      marginRight: 3,
    }}
  >
    *
  </span>
);



export default function RegisterDetailsForm() {


  const searchParams =
    useSearchParams();


  const router =
    useRouter();



  const gender =
    searchParams.get("gender") ||
    "male";



  const isFemale =
    gender === "female";



  const [
    form,
    setForm,
  ] =
    useState({

      fullName: "",

      governorate: "",

      age: "",

      phone: "",

      email: "",

      password: "",

      confirmPassword: "",

    });



  const [
    error,
    setError,
  ] =
    useState("");



  const [
    loading,
    setLoading,
  ] =
    useState(false);





  const handleAgeChange =
    (value: string) => {

      const numbers =
        value
          .replace(
            /[^0-9]/g,
            ""
          )
          .slice(0, 2);



      if (!numbers) {

        setForm({
          ...form,
          age: "",
        });

        return;

      }



      let age =
        Number(numbers);



      if (age > 99) {

        age = 99;

      }



      setForm({

        ...form,

        age:
          age.toString(),

      });

    };







  const handlePhoneChange =
    (value: string) => {

      setForm({

        ...form,

        phone:
          value
            .replace(
              /[^0-9]/g,
              ""
            )
            .slice(0, 11),

      });

    };







  async function handleSubmit(
    e: React.FormEvent
  ) {


    e.preventDefault();


    setError("");



    const age =
      Number(form.age);



    if (
      !age ||
      age < 18 ||
      age > 99
    ) {

      setError(
        "السن من 18 إلى 99 فقط"
      );

      return;

    }



    if (
      form.phone.length !== 11
    ) {

      setError(
        "رقم المحمول يجب أن يكون 11 رقم"
      );

      return;

    }



    if (
      form.password !==
      form.confirmPassword
    ) {

      setError(
        "كلمة المرور غير متطابقة"
      );

      return;

    }



    setLoading(true);



    try {


      const res =
        await fetch(
          "/api/auth/register",
          {

            method:
              "POST",

            headers: {

              "Content-Type":
                "application/json",

            },

            body:
              JSON.stringify({

                ...form,

                gender,

                age,

              }),

          }
        );



      const data =
        await res.json();



      if (!res.ok) {

        setError(
          data.error ||
          "حدث خطأ"
        );

        setLoading(false);

        return;

      }



      router.push(
        "/login?registered=1"
      );


    } catch (err: any) {


      setError(
        err.message
      );


      setLoading(false);


    }

  }







  const inputStyle = {

    width: "100%",

    padding:
      "12px 14px",

    borderRadius:
      10,

    border:
      "1px solid #ddd",

    fontSize:
      14,

  };







  return (

    <div
      dir="rtl"
      style={{
        background:"#fdf2f3",
        minHeight:"100vh",
        padding:"30px 20px",
      }}
    >

      <div
        style={{
          maxWidth:520,
          margin:"0 auto",
          background:"white",
          padding:35,
          borderRadius:20,
          boxShadow:
            "0 10px 30px rgba(0,0,0,.07)",
        }}
      >

        <h2
          style={{
            textAlign:"center",
            color:"#7a102c",
            fontWeight:900,
            marginBottom:25,
          }}
        >

          إنشاء حساب جديد - {isFemale ? "زوجة" : "زوج"}

        </h2>





        <form
          onSubmit={handleSubmit}
          style={{
            display:"flex",
            flexDirection:"column",
            gap:16,
          }}
        >

          <input
            placeholder=""
            value={form.fullName}
            onChange={(e)=>
              setForm({
                ...form,
                fullName:e.target.value,
              })
            }
            style={inputStyle}
          />



          <select
            value={gender}
            disabled
            style={inputStyle}
          >

            <option value="male">
              ذكر
            </option>

            <option value="female">
              أنثى
            </option>

          </select>



          <input
            placeholder=""
            value={form.governorate}
            onChange={(e)=>
              setForm({
                ...form,
                governorate:e.target.value,
              })
            }
            style={inputStyle}
          />



          <input
            placeholder=""
            value={form.age}
            onChange={(e)=>
              handleAgeChange(
                e.target.value
              )
            }
            style={inputStyle}
          />



          <input
            placeholder=""
            value={form.phone}
            onChange={(e)=>
              handlePhoneChange(
                e.target.value
              )
            }
            style={inputStyle}
          />



          <input
            type="email"
            placeholder=""
            value={form.email}
            onChange={(e)=>
              setForm({
                ...form,
                email:e.target.value,
              })
            }
            style={inputStyle}
          />



          <input
            type="password"
            placeholder=""
            value={form.password}
            onChange={(e)=>
              setForm({
                ...form,
                password:e.target.value,
              })
            }
            style={inputStyle}
          />



          <input
            type="password"
            placeholder=""
            value={form.confirmPassword}
            onChange={(e)=>
              setForm({
                ...form,
                confirmPassword:e.target.value,
              })
            }
            style={inputStyle}
          />



          {
            error && (

              <div
                style={{
                  color:"#d10000",
                  textAlign:"center",
                }}
              >

                {error}

              </div>

            )
          }





          <button
            disabled={loading}
            type="submit"
            className="qalby-button"
          >

            {
              loading
                ? "جاري التسجيل..."
                : "إنشاء الحساب"
            }

          </button>



        </form>


      </div>


    </div>

  );

}