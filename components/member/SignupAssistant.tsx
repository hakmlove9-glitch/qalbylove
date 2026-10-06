"use client";

import Image from "next/image";
import { MessageCircle, Send, Sparkles, X } from "lucide-react";
import { useMemo, useState } from "react";

const tips = [
  "اختَر صفتك ووافق على الميثاق. بعد اختيار رجل سأكون آدم معك، وبعد اختيار امرأة ستكون حواء معك.",
  "اكتب الاسم الذي سيظهر للأعضاء. هذا الاسم فريد داخل المنصة، لذلك لو كان مستخدمًا سأخبرك فورًا.",
  "حدد عمرك ومكان إقامتك بدقة. لو كنت خارج مصر اختر دولة الإقامة.",
  "بيانات الزواج السابق والأبناء والسكن مهمة حتى تكون الصورة واضحة من البداية.",
  "اكتب مؤهلك وعملك الحقيقيين. لو لم تجد وظيفتك اختر أخرى واكتبها بنفسك.",
  "الطول والوزن والصلاة والحالة الصحية تساعد على بناء ملف واضح، والبيانات الصحية يمكن التحكم في خصوصيتها.",
  "عرّف بنفسك باحترام ووضوح، ومن غير أرقام هاتف أو روابط أو حسابات تواصل خارجية.",
  "آخر خطوة سرية: اسمك الحقيقي ورقم هاتفك للإدارة والاسترجاع فقط، ولا يظهران للأعضاء.",
];

export default function SignupAssistant({ gender, step, displayName }: { gender: "" | "male" | "female"; step: number; displayName?: string }) {
  const female = gender === "female";
  const name = female ? "حواء" : "آدم";
  const image = female ? "/images/site-v2/assistants/female/01.webp" : "/images/site-v2/assistants/male/01.webp";
  const [open,setOpen]=useState(false);
  const [message,setMessage]=useState("");
  const [reply,setReply]=useState("");
  const [loading,setLoading]=useState(false);
  const greeting=useMemo(()=>gender?`${name} معك في الخطوة ${step+1}`:"اختَر رجل أو امرأة ليظهر مساعدك المناسب",[gender,name,step]);

  async function ask(){
    const q=message.trim(); if(!q)return; setLoading(true);
    try{
      const response=await fetch("/api/assistant",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({message:q,context:"signup",gender,step,displayName})});
      const data=await response.json();
      setReply(data.reply||"أنا معك. أكمل الخطوة الحالية ولو واجهتك مشكلة اكتبها لي.");
    }catch{
      setReply("تعذر الرد الآن، لكن يمكنك إكمال الخطوة الحالية وسأظل معك.");
    }finally{
      setLoading(false);
    }
  }

  return <div className="relative mt-5 rounded-[26px] border border-white/15 bg-white/10 p-3">
    <div className="flex items-end gap-3">
      <div className="relative h-[118px] w-[92px] shrink-0"><Image src={image} alt={name} fill className="object-contain drop-shadow-xl" sizes="92px"/></div>
      <div className="min-w-0 flex-1 pb-2"><span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-black text-rose-100"><Sparkles className="h-3 w-3"/>{greeting}</span><p className="mt-2 text-[11px] font-bold leading-6 text-white/80">{tips[step]||tips[0]}</p><button type="button" onClick={()=>setOpen(v=>!v)} className="mt-2 inline-flex items-center gap-1.5 rounded-xl bg-white px-3 py-2 text-[10px] font-black text-rose-700"><MessageCircle className="h-3.5 w-3.5"/>{open?"إغلاق المساعدة":`اسأل ${name}`}</button></div>
    </div>
    {open&&<div className="mt-3 rounded-2xl bg-white p-3 text-rose-800"><div className="flex items-center justify-between"><b className="text-xs">محادثة سريعة مع {name}</b><button type="button" onClick={()=>setOpen(false)} className="grid h-7 w-7 place-items-center rounded-lg bg-rose-50"><X className="h-3.5 w-3.5"/></button></div>{reply&&<div className="mt-3 rounded-xl bg-rose-50 p-3 text-[11px] font-bold leading-6 text-rose-600">{reply}</div>}<div className="mt-3 flex gap-2"><input value={message} onChange={e=>setMessage(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"){e.preventDefault();ask();}}} className="h-10 min-w-0 flex-1 rounded-xl border border-rose-200 px-3 text-xs outline-none focus:border-rose-300" placeholder={`اسأل ${name} عن التسجيل`}/><button type="button" disabled={loading} onClick={ask} className="grid h-10 w-10 place-items-center rounded-xl bg-rose-600 text-white disabled:opacity-50"><Send className="h-4 w-4"/></button></div></div>}
  </div>;
}
