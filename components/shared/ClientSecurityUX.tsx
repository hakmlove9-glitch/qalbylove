"use client";
import { useEffect } from "react";
export default function ClientSecurityUX(){
  useEffect(()=>{
    if(process.env.NODE_ENV!=="production") return;
    const stop=(e:MouseEvent)=>e.preventDefault();
    document.addEventListener("contextmenu",stop);
    return()=>document.removeEventListener("contextmenu",stop);
  },[]);
  return null;
}
