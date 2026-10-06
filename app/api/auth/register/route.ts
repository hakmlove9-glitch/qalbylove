export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { createSupabaseAdminClient } from "@/lib/supabase/client";
import { generateMemberNumber } from "@/lib/member-number";
import { containsDirectContactInfo } from "@/lib/content-moderation";
import { moderateText } from "@/lib/text-moderation";
import { createSessionSignature } from "@/lib/session";
import { fallbackAvatar } from "@/lib/avatar-fallback";

function normalizePhone(value: string) {
  const arabic = "٠١٢٣٤٥٦٧٨٩";
  const eastern = "۰۱۲۳۴۵۶۷۸۹";
  return value
    .replace(/[٠-٩]/g, d => String(arabic.indexOf(d)))
    .replace(/[۰-۹]/g, d => String(eastern.indexOf(d)))
    .replace(/[^0-9+]/g, "")
    .replace(/^00/, "+");
}

export async function POST(request: Request) {
  const supabase = createSupabaseAdminClient();

  try {
    const body = await request.json();
    const username = String(body.displayName || body.username || "").trim().normalize("NFC");
    const email = String(body.email || "").trim().toLowerCase();
    const password = String(body.password || "");
    const gender = String(body.gender || "");

    if (!body.commitmentAccepted) return NextResponse.json({ error: "وافق على ميثاق الجدية والاحترام أولًا" }, { status: 400 });
    if (!username) return NextResponse.json({ error: "اكتب الاسم الذي سيظهر للأعضاء" }, { status: 400 });
    if (Array.from(username).length > 40 || /\s/.test(username)) return NextResponse.json({ error: "اسم المستخدم لا يقبل مسافات وبحد أقصى 40 رمزًا" }, { status: 400 });
    if (username.replace(/\D/g, "").length >= 8) return NextResponse.json({ error: "لا يجوز أن يكون الاسم الظاهر رقم هاتف" }, { status: 400 });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return NextResponse.json({ error: "البريد الإلكتروني غير صحيح" }, { status: 400 });
    if (password.length < 8 || !/[A-Za-z\u0600-\u06FF]/.test(password) || !/\d/.test(password)) return NextResponse.json({ error: "كلمة المرور يجب أن تكون 8 أحرف على الأقل وتحتوي على حرف ورقم" }, { status: 400 });
    if (!["male","female"].includes(gender)) return NextResponse.json({ error: "اختر صفتك قبل متابعة التسجيل" }, { status: 400 });

    const usernameModeration = await moderateText(username, { field: "username" });
    if (!usernameModeration.allowed) {
      return NextResponse.json({ error: usernameModeration.reason || "الاسم الظاهر غير مناسب للمنصة" }, { status: 400 });
    }

    const required = [
      "displayName","fullName","phone","age","residence","maritalStatus","previousMarriage","hasChildren","housing","marriageTimeline",
      "education","workStatus","height","weight","bodyType","skinColor","hairColor","eyeColor","clothingStyle","smoking","prayer","religiosity","healthStatus","bio","partnerSpecs"
    ];
    const missing = required.filter(k => !String(body[k] ?? "").trim());
    if (missing.length) return NextResponse.json({ error: "ملفك يحتاج إلى استكمال جميع البيانات المطلوبة" }, { status: 400 });

    if (body.residence === "egypt" && (!String(body.governorate || "").trim() || !String(body.city || "").trim())) return NextResponse.json({ error: "اختر المحافظة والمدينة / المركز" }, { status: 400 });
    if (body.residence === "abroad" && (!String(body.country || "").trim() || !String(body.city || "").trim())) return NextResponse.json({ error: "اختر دولة الإقامة واكتب مدينة الإقامة" }, { status: 400 });
    if (body.hasChildren === "yes" && (!Number(body.childrenCount) || !String(body.childrenLiving || "").trim())) return NextResponse.json({ error: "أكمل بيانات الأبناء" }, { status: 400 });
    if (body.healthStatus !== "سليم والحمد لله" && !String(body.healthDetails || "").trim()) return NextResponse.json({ error: "اكتب تفاصيل الحالة الصحية باختصار" }, { status: 400 });
    if (gender === "male" && !String(body.beardStyle || "").trim()) return NextResponse.json({ error: "حدد حالة اللحية" }, { status: 400 });
    if (gender === "female" && !String(body.hijabStyle || "").trim()) return NextResponse.json({ error: "حدد حالة الحجاب" }, { status: 400 });
    const nonWorkingStatuses = new Set(["أبحث عن عمل","طالب","ربة منزل","متقاعد","لا أعمل حاليًا"]);
    if (!nonWorkingStatuses.has(String(body.workStatus)) && !String(body.job || "").trim()) {
      return NextResponse.json({ error: "اختر الوظيفة / المجال" }, { status: 400 });
    }
    if (!Array.isArray(body.interests) || body.interests.length < 3) return NextResponse.json({ error: "اختر 3 اهتمامات على الأقل" }, { status: 400 });
    if (!Array.isArray(body.personalityTraits) || body.personalityTraits.length < 3) return NextResponse.json({ error: "اختر 3 صفات على الأقل" }, { status: 400 });

    const normalizedPhone = normalizePhone(String(body.phone || ""));
    const phoneValid = body.residence === "egypt"
      ? (/^01[0125]\d{8}$/.test(normalizedPhone) || /^\+201[0125]\d{8}$/.test(normalizedPhone))
      : /^\+[1-9]\d{7,14}$/.test(normalizedPhone);
    if (!phoneValid) return NextResponse.json({ error: "رقم الهاتف غير صحيح بالنسبة لمكان الإقامة" }, { status: 400 });
    if (String(body.fullName || "").trim().split(/\s+/).filter(Boolean).length < 2) return NextResponse.json({ error: "اكتب الاسم الحقيقي من كلمتين على الأقل" }, { status: 400 });

    const age = Number(body.age), height = Number(body.height), weight = Number(body.weight);
    if (!Number.isInteger(age) || age < 18 || age > 99) return NextResponse.json({ error: "العمر يجب أن يكون بين 18 و99 سنة" }, { status: 400 });
    if (!Number.isInteger(height) || height < 130 || height > 230) return NextResponse.json({ error: "اختر طولًا صحيحًا" }, { status: 400 });
    if (!Number.isInteger(weight) || weight < 30 || weight > 200) return NextResponse.json({ error: "اختر وزنًا صحيحًا" }, { status: 400 });

    const bio = String(body.bio || "").trim();
    const partnerSpecs = String(body.partnerSpecs || "").trim();
    if (bio.length < 100) return NextResponse.json({ error: "اكتب نبذة عنك لا تقل عن 100 حرف" }, { status: 400 });
    if (partnerSpecs.length < 80) return NextResponse.json({ error: "اكتب مواصفات الشريك في 80 حرفًا على الأقل" }, { status: 400 });
    if (containsDirectContactInfo(bio) || containsDirectContactInfo(partnerSpecs)) {
      return NextResponse.json({ error: "ممنوع كتابة أرقام الهاتف أو وسائل التواصل أو الروابط داخل الملف الشخصي. أبقِ التواصل داخل قلبي لوڤي." }, { status: 400 });
    }

    for (const [label, value] of [["نبذة عنك", bio], ["مواصفات شريك الحياة", partnerSpecs]] as const) {
      const moderation = await moderateText(value);
      if (!moderation.allowed) {
        return NextResponse.json({ error: `${label}: ${moderation.reason || "النص غير مناسب للمنصة"}` }, { status: 400 });
      }
    }

    const { data: usernameAvailable, error: usernameCheckError } = await supabase.rpc("is_username_available", { candidate_username: username });
    if (!usernameCheckError && usernameAvailable === false) return NextResponse.json({ error: "هذا الاسم مستخدم بالفعل، اختر اسمًا آخر" }, { status: 409 });

    if (usernameCheckError) {
      const escaped = username.replace(/\\/g,"\\\\").replace(/%/g,"\\%").replace(/_/g,"\\_");
      const { data } = await supabase.from("members").select("id").ilike("username", escaped).limit(1);
      if (data?.length) return NextResponse.json({ error: "هذا الاسم مستخدم بالفعل، اختر اسمًا آخر" }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const { memberNumber, isFounder: founderHint } = await generateMemberNumber();

    // قاعدة البيانات هي صاحبة القرار النهائي في حجز مقعد المؤسس.
    // founderHint مجرد توقع سريع للواجهة، أما trigger قاعدة البيانات فيمنع السباقات عند التسجيل المتزامن.
    const { data: member, error: memberError } = await supabase.from("members").insert({
      username,email,password_hash:passwordHash,gender,member_number:memberNumber,is_founder:founderHint,account_status:"active"
    }).select("id,username,email,member_number,is_founder,membership_tier").single();

    if (memberError || !member) throw memberError || new Error("تعذر إنشاء الحساب");

    if (member.is_founder === true && member.membership_tier !== "founder") {
      await supabase.from("members").update({ membership_tier: "founder" }).eq("id", member.id);
    }

    const details = {
      member_id: member.id,
      display_name: String(body.displayName).trim(),
      full_name: String(body.fullName).trim(),
      phone: String(body.phone).trim(),
      phone_normalized: normalizePhone(String(body.phone).trim()),
      age, gender,
      residence_type: String(body.residence),
      governorate: String(body.governorate || "").trim(),
      city: String(body.city || "").trim(),
      country: String(body.country || "مصر").trim(),
      marital_status: String(body.maritalStatus),
      previous_marriage: String(body.previousMarriage),
      has_children: body.hasChildren === "yes",
      children_count: body.hasChildren === "yes" ? Number(body.childrenCount) : 0,
      children_living: body.hasChildren === "yes" ? String(body.childrenLiving) : "none",
      housing_plan: String(body.housing),
      marriage_timeline: String(body.marriageTimeline),
      education: String(body.education),
      job: String(body.job || body.workStatus),
      work_status: String(body.workStatus),
      height, weight,
      body_type: String(body.bodyType),
      skin_color: String(body.skinColor),
      hair_color: String(body.hairColor),
      eye_color: String(body.eyeColor),
      beard_style: gender === "male" ? String(body.beardStyle) : null,
      hijab_style: gender === "female" ? String(body.hijabStyle) : null,
      clothing_style: String(body.clothingStyle),
      smoking: String(body.smoking),
      prayer_status: String(body.prayer),
      religiosity: String(body.religiosity),
      health_status: String(body.healthStatus),
      health_details: body.healthStatus === "سليم والحمد لله" ? null : String(body.healthDetails).trim(),
      bio, partner_specs: partnerSpecs,
      interests: body.interests,
      personality_traits: body.personalityTraits,
      marriage_intent: "زواج جاد",
      avatar_url: fallbackAvatar(gender, age, { hijabStyle: body.hijabStyle, beardStyle: body.beardStyle }),
    };

    const { error: detailsError } = await supabase.from("member_details").insert(details);
    if (detailsError) {
      await supabase.from("members").delete().eq("id", member.id);
      throw detailsError;
    }

    await supabase.from("member_settings").upsert({ member_id: member.id, show_profile: true, allow_messages: true }, { onConflict:"member_id" });

    await supabase.from("notifications").insert({
      member_id: member.id,
      message: `مرحبًا بك يا ${String(body.displayName).trim()} في قلبي لوڤي. حافظ على خصوصيتك ولا تشارك رقم هاتفك أو بياناتك الحساسة مبكرًا، ولا ترسل أموالًا لأي شخص. إذا طلب منك أحد مالًا أو أساء إليك، أوقف التواصل واستخدم زر الإبلاغ فورًا. خليك واضحًا ومحترمًا وسيب التعارف ياخد وقته.`,
      read: false,
    });

    const response = NextResponse.json({ success:true, member:{ id:member.id, username:member.username, memberNumber: member.member_number, isFounder: member.is_founder === true } });
    const sessionSignature = await createSessionSignature(String(member.id));

    response.cookies.set("qalbylove_session", String(member.id), { httpOnly:true, secure:process.env.NODE_ENV==="production", sameSite:"lax", maxAge:60*60*24*30, path:"/" });
    response.cookies.set("qalbylove_session_sig", sessionSignature, { httpOnly:true, secure:process.env.NODE_ENV==="production", sameSite:"lax", maxAge:60*60*24*30, path:"/" });
    response.cookies.set("qalbylove_hidden","0",{httpOnly:true,secure:process.env.NODE_ENV==="production",sameSite:"lax",maxAge:60*60*24,path:"/"});
    return response;
  } catch (error) {
    console.error("register", error);
    return NextResponse.json({ error:"تعذر إنشاء الحساب الآن. راجع البيانات وحاول مرة أخرى." }, { status:500 });
  }
}
