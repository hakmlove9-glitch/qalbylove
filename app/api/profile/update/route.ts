export const dynamic = "force-dynamic"

import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { containsDirectContactInfo, registerContactViolation } from "@/lib/content-moderation"
import { getCurrentMemberId } from "@/lib/auth"

const supabase=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.SUPABASE_SERVICE_ROLE_KEY!)
export async function PUT(request:Request){
  const memberId=await getCurrentMemberId()
  if(!memberId)return NextResponse.json({error:"يجب تسجيل الدخول"},{status:401})
  try{
    const body=await request.json()
    if(containsDirectContactInfo(body.bio)||containsDirectContactInfo(body.partner_specs)){
      const result=await registerContactViolation(memberId,"profile")
      return NextResponse.json({error:result.suspended?"تم تعليق الحساب بسبب تكرار محاولة مشاركة بيانات تواصل مباشرة.":"ممنوع كتابة أرقام الهاتف أو وسائل التواصل أو الروابط داخل الملف. تكرار المخالفة قد يؤدي إلى تعليق الحساب."},{status:403})
    }
    if(!String(body.username||"").trim())return NextResponse.json({error:"الاسم مطلوب"},{status:400})
    const age=Number(body.age||0); if(age&& (age<18||age>100))return NextResponse.json({error:"العمر يجب أن يكون بين 18 و100 سنة"},{status:400})
    const {error:mErr}=await supabase.from("members").update({username:String(body.username).trim()}).eq("id",memberId); if(mErr)throw mErr
    const detailsPayload={
      member_id:memberId, full_name:body.full_name||null, phone:body.phone||null, city:body.city||null, age:age||null,
      marital_status:body.marital_status||null, education:body.education||null, job:body.job||null, height:Number(body.height)||null,
      body_type:body.body_type||null, weight:Number(body.weight)||null, smoking:body.smoking||null, religiosity:body.religiosity||null, prayer_status:body.prayer_status||null, health_status:body.health_status||null,
      health_details:body.health_details||null, residence_type:body.residence_type||null, governorate:body.governorate||null, previous_marriage:body.previous_marriage||null,
      has_children:body.has_children===true, children_count:Number(body.children_count)||0, children_living:body.children_living||null,
      housing_plan:body.housing_plan||null, marriage_timeline:body.marriage_timeline||null, work_status:body.work_status||null,
      bio:body.bio||null, partner_specs:body.partner_specs||null, interests:Array.isArray(body.interests)?body.interests:[], personality_traits:Array.isArray(body.personality_traits)?body.personality_traits:[]
    }
    const {data:existingDetails}=await supabase.from("member_details").select("id").eq("member_id",memberId).limit(1)
    const detailsQuery=existingDetails?.length
      ? supabase.from("member_details").update(detailsPayload).eq("id",existingDetails[0].id)
      : supabase.from("member_details").insert(detailsPayload)
    const {error:dErr}=await detailsQuery; if(dErr)throw new Error("تعذر حفظ بيانات الملف الآن")

    if ("show_profile" in body || "allow_messages" in body) {
      const settingsPayload: Record<string, boolean> = {}
      if ("show_profile" in body) settingsPayload.show_profile = body.show_profile !== false
      if ("allow_messages" in body) settingsPayload.allow_messages = body.allow_messages !== false
      const {data:existingSettings}=await supabase.from("member_settings").select("member_id").eq("member_id",memberId).limit(1)
      const settingsQuery=existingSettings?.length
        ? supabase.from("member_settings").update(settingsPayload).eq("member_id",memberId)
        : supabase.from("member_settings").insert({member_id:memberId,...settingsPayload})
      const {error:sErr}=await settingsQuery; if(sErr)throw new Error("تعذر حفظ إعدادات الخصوصية الآن")
    }
    return NextResponse.json({success:true})
  }catch(error:any){console.error(error);return NextResponse.json({error:error?.message||"تعذر حفظ التعديلات"},{status:500})}
}
