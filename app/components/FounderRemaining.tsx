"use client";

import { useEffect, useState } from "react";

export default function FounderRemaining({compact=false}:{compact?:boolean}) {
  const [remaining,setRemaining]=useState<number|null>(null);
  useEffect(()=>{
    let active=true;
    fetch("/api/founders/remaining",{cache:"no-store"})
      .then(r=>r.ok?r.json():Promise.reject())
      .then(d=>{if(active&&typeof d.remaining==="number")setRemaining(d.remaining);})
      .catch(()=>{});
    return()=>{active=false;};
  },[]);
  if(remaining===null) return <span>{compact?"يتم تحديث العدد...":"يتم تحديث عدد المؤسسين من قاعدة البيانات..."}</span>;
  if(remaining<=0) return <span>اكتمل عدد أعضاء المؤسسين</span>;
  return <span>متبقي {remaining} من 1000</span>;
}
