import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";
export default function AdamHawaGuide({gender,completion=0}:{gender?:string;completion?:number}){
 const female=gender==="female"||gender==="أنثى"; const img=female?"/images/site-v2/assistants/female/01.webp":"/images/site-v2/assistants/male/01.webp";const name=female?"حواء":"آدم";
 const text=completion<40?"خلّينا نكمّل أهم بيانات ملفك. الملف الواضح يخلّي الترشيحات أدق.":completion<80?"باقي خطوات بسيطة ونخلي ملفك أقوى في الظهور والاقتراحات.":"ملفك ممتاز. دلوقتي ركّز على التوافقات والرسائل اللي تستحق وقتك.";
 return <div className="relative overflow-hidden rounded-[30px] border border-rose-100 bg-gradient-to-br from-white to-[#fff0f6] p-5 shadow-[0_16px_45px_rgba(81,21,43,.06)]"><div className="absolute -left-10 -bottom-10 h-36 w-36 rounded-full bg-rose-100/60"/><div className="relative flex min-h-[250px] flex-col justify-between"><div><span className="ql-kicker"><Sparkles className="h-3.5 w-3.5"/>{name} معك في الخطوة التالية</span><h3 className="mt-4 text-2xl font-black">مش محتاج تدوّر… هقول لك تعمل إيه.</h3><p className="mt-3 max-w-[70%] text-sm font-bold leading-7 text-rose-500">{text}</p></div><Link href={completion<100?"/profile/edit":"/search"} className="ql-btn-secondary relative z-10 mt-5 w-fit text-xs">{completion<100?"استكمال الملف":"اكتشف اقتراحاتك"}<ArrowLeft className="h-4 w-4"/></Link><Image src={img} alt={name} width={150} height={190} className="absolute -bottom-2 left-0 h-[58%] w-auto object-contain drop-shadow-xl"/></div></div>
}
