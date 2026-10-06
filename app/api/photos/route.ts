export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";
import { moderateImageBytes } from "@/lib/image-moderation";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

async function currentMemberId() {
  return cookies().get("qalbylove_session")?.value || null;
}

function safeFileName(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9._-]+/g, "-").replace(/-+/g, "-").slice(-90) || "photo.jpg";
}

async function signedEvidence(path?: string | null) {
  if (!path) return "";
  const { data } = await supabase.storage.from("moderation-evidence").createSignedUrl(path, 60 * 10);
  return data?.signedUrl || "";
}

async function notify(memberId: string, content: string) {
  try {
    await supabase.from("notifications").insert({
      member_id: memberId,
      type: "safety",
      content,
      message: content,
      action_url: "/photos",
    });
  } catch {
    // Notification failure must not block the main photo action.
  }
}

async function recordImageViolation(memberId: string, severity: string) {
  try {
    await supabase.from("moderation_violations").insert({
      member_id: memberId,
      violation_type: "image_moderation",
      source: "photo",
    });
  } catch {
    // Continue safely; the moderation decision itself still applies.
  }

  if (severity !== "high") return false;

  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const { count } = await supabase
    .from("moderation_violations")
    .select("id", { count: "exact", head: true })
    .eq("member_id", memberId)
    .eq("violation_type", "image_moderation")
    .gte("created_at", since);

  if ((count || 0) >= 3) {
    await supabase.from("members").update({ account_status: "suspended" }).eq("id", memberId);
    await notify(memberId, "تم تعليق الحساب مؤقتًا بسبب تكرار رفع صور مخالفة بوضوح. تواصل مع الإدارة إذا كنت تعتقد أن هناك خطأ.");
    return true;
  }

  return false;
}

export async function GET() {
  try {
    const memberId = await currentMemberId();
    if (!memberId) return NextResponse.json({ error: "يجب تسجيل الدخول" }, { status: 401 });

    const { data, error } = await supabase
      .from("photos")
      .select("id,image_url,is_primary,moderation_status,moderation_reason,evidence_path,created_at")
      .eq("member_id", memberId)
      .order("is_primary", { ascending: false })
      .order("created_at", { ascending: false });

    if (error) return NextResponse.json({ error: "تعذر تحميل الصور الآن" }, { status: 500 });

    const photos = await Promise.all(
      (data || []).map(async (photo: any) => ({
        ...photo,
        image_url: photo.image_url || (await signedEvidence(photo.evidence_path)),
      })),
    );

    return NextResponse.json({ photos });
  } catch (error) {
    console.error("photos-get", error);
    return NextResponse.json({ error: "تعذر تحميل الصور الآن" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const memberId = await currentMemberId();
  if (!memberId) return NextResponse.json({ error: "يجب تسجيل الدخول" }, { status: 401 });

  let evidencePath = "";
  let publicPath = "";

  try {
    const formData = await request.formData();
    const image = formData.get("image");

    if (!(image instanceof File) || image.size <= 0) {
      return NextResponse.json({ error: "اختَر صورة أولًا" }, { status: 400 });
    }

    if (!["image/jpeg", "image/png", "image/webp"].includes(image.type)) {
      return NextResponse.json({ error: "الصورة يجب أن تكون JPG أو PNG أو WEBP" }, { status: 400 });
    }

    if (image.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "حجم الصورة يجب ألا يزيد عن 5 ميجابايت" }, { status: 400 });
    }

    const { count } = await supabase
      .from("photos")
      .select("id", { count: "exact", head: true })
      .eq("member_id", memberId)
      .neq("moderation_status", "rejected");

    if ((count || 0) >= 8) {
      return NextResponse.json({ error: "يمكنك إضافة حتى 8 صور في ملفك" }, { status: 400 });
    }

    const bytes = Buffer.from(await image.arrayBuffer());
    const moderation = await moderateImageBytes({
      bytes,
      mimeType: image.type,
      fileName: image.name,
      memberId,
    });

    const fileName = `${Date.now()}-${crypto.randomUUID()}-${safeFileName(image.name)}`;

    if (moderation.status === "approved") {
      publicPath = `${memberId}/${fileName}`;
      const { error: uploadError } = await supabase.storage
        .from("member-photos")
        .upload(publicPath, bytes, {
          contentType: image.type,
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        return NextResponse.json({ error: "تعذر رفع الصورة. حاول مرة أخرى." }, { status: 500 });
      }

      const { data: publicUrl } = supabase.storage.from("member-photos").getPublicUrl(publicPath);
      const { count: approvedCount } = await supabase
        .from("photos")
        .select("id", { count: "exact", head: true })
        .eq("member_id", memberId)
        .eq("moderation_status", "approved");

      const { data: inserted, error } = await supabase
        .from("photos")
        .insert({
          member_id: memberId,
          image_url: publicUrl.publicUrl,
          storage_path: publicPath,
          moderation_status: "approved",
          moderation_reason: moderation.reason || null,
          moderation_provider: moderation.provider,
          moderation_meta: {
            severity: moderation.severity,
            categories: moderation.categories,
          },
          approved_at: new Date().toISOString(),
          is_primary: (approvedCount || 0) === 0,
        })
        .select("id,image_url,is_primary,moderation_status,moderation_reason,created_at")
        .single();

      if (error) {
        await supabase.storage.from("member-photos").remove([publicPath]).catch(() => undefined);
        return NextResponse.json({ error: "تعذر تسجيل الصورة في ملفك الآن" }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        photo: inserted,
        status: "approved",
        message: "تم فحص الصورة ونشرها تلقائيًا.",
      });
    }

    evidencePath = `${memberId}/${fileName}`;
    const { error: evidenceError } = await supabase.storage
      .from("moderation-evidence")
      .upload(evidencePath, bytes, {
        contentType: image.type,
        cacheControl: "3600",
        upsert: false,
      });

    if (evidenceError) {
      return NextResponse.json({ error: "تعذر حفظ الصورة للفحص." }, { status: 500 });
    }

    const { data: photo, error: photoError } = await supabase
      .from("photos")
      .insert({
        member_id: memberId,
        image_url: null,
        evidence_path: evidencePath,
        moderation_status: moderation.status,
        moderation_reason:
          moderation.reason ||
          (moderation.status === "rejected"
            ? "الصورة لا تتوافق مع قواعد الصور في قلبي لوڤي."
            : "الصورة تحتاج مراجعة بشرية سريعة."),
        moderation_provider: moderation.provider,
        moderation_meta: {
          severity: moderation.severity,
          categories: moderation.categories,
        },
        is_primary: false,
      })
      .select("id")
      .single();

    if (photoError || !photo) {
      await supabase.storage.from("moderation-evidence").remove([evidencePath]).catch(() => undefined);
      return NextResponse.json({ error: "تعذر تسجيل نتيجة الفحص." }, { status: 500 });
    }

    await supabase.from("moderation_events").insert({
      member_id: memberId,
      event_type: "photo",
      source: "upload",
      decision: moderation.status,
      category: "image",
      reason: moderation.reason || null,
      evidence_path: evidencePath,
      photo_id: photo.id,
      metadata: {
        provider: moderation.provider,
        severity: moderation.severity,
        categories: moderation.categories,
        mimeType: image.type,
        fileName: image.name,
      },
    });

    if (moderation.status === "rejected") {
      const suspended = await recordImageViolation(memberId, moderation.severity);
      if (!suspended) {
        await notify(memberId, "تم رفض الصورة تلقائيًا لأنها لا تتوافق مع قواعد الصور. اختر صورة شخصية محترمة وواضحة.");
      }

      return NextResponse.json(
        {
          success: false,
          status: "rejected",
          error: "الصورة لا تتوافق مع قواعد الصور في قلبي لوڤي. اختر صورة شخصية محترمة وواضحة.",
        },
        { status: 422 },
      );
    }

    await notify(memberId, "الصورة غير واضحة بما يكفي للفحص الآلي، وتم إرسالها فقط لمراجعة استثنائية.");
    return NextResponse.json({
      success: true,
      status: "pending",
      message: "الفحص الآلي لم يحسم الصورة، فانتقلت فقط للمراجعة الاستثنائية.",
    });
  } catch (error) {
    if (publicPath) await supabase.storage.from("member-photos").remove([publicPath]).catch(() => undefined);
    if (evidencePath) await supabase.storage.from("moderation-evidence").remove([evidencePath]).catch(() => undefined);
    console.error("photos-post", error);
    return NextResponse.json({ error: "تعذر رفع الصورة الآن" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const memberId = await currentMemberId();
    if (!memberId) return NextResponse.json({ error: "يجب تسجيل الدخول" }, { status: 401 });

    const body = await request.json();
    const photoId = String(body.photoId || "");
    if (!photoId) return NextResponse.json({ error: "الصورة غير محددة" }, { status: 400 });

    const { data: photo } = await supabase
      .from("photos")
      .select("id,moderation_status")
      .eq("id", photoId)
      .eq("member_id", memberId)
      .maybeSingle();

    if (!photo) return NextResponse.json({ error: "الصورة غير موجودة" }, { status: 404 });
    if (photo.moderation_status !== "approved") {
      return NextResponse.json({ error: "لا يمكن جعل الصورة أساسية قبل اجتياز الفحص." }, { status: 400 });
    }

    await supabase.from("photos").update({ is_primary: false }).eq("member_id", memberId);
    const { error } = await supabase.from("photos").update({ is_primary: true }).eq("id", photoId).eq("member_id", memberId);
    if (error) return NextResponse.json({ error: "تعذر تغيير الصورة الأساسية" }, { status: 500 });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "تعذر تغيير الصورة الأساسية" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const memberId = await currentMemberId();
    if (!memberId) return NextResponse.json({ error: "يجب تسجيل الدخول" }, { status: 401 });

    const photoId = new URL(request.url).searchParams.get("id");
    if (!photoId) return NextResponse.json({ error: "الصورة غير محددة" }, { status: 400 });

    const { data: photo } = await supabase
      .from("photos")
      .select("id,image_url,is_primary,storage_path,evidence_path")
      .eq("id", photoId)
      .eq("member_id", memberId)
      .maybeSingle();

    if (!photo) return NextResponse.json({ error: "الصورة غير موجودة" }, { status: 404 });

    const { error } = await supabase.from("photos").delete().eq("id", photoId).eq("member_id", memberId);
    if (error) return NextResponse.json({ error: "تعذر حذف الصورة" }, { status: 500 });

    if (photo.storage_path) {
      await supabase.storage.from("member-photos").remove([photo.storage_path]).catch(() => undefined);
    } else if (photo.image_url) {
      const marker = "/storage/v1/object/public/member-photos/";
      const storagePath = String(photo.image_url).split(marker)[1];
      if (storagePath) await supabase.storage.from("member-photos").remove([decodeURIComponent(storagePath)]).catch(() => undefined);
    }

    if (photo.evidence_path) {
      await supabase.storage.from("moderation-evidence").remove([photo.evidence_path]).catch(() => undefined);
    }

    if (photo.is_primary) {
      const { data: nextPhoto } = await supabase
        .from("photos")
        .select("id")
        .eq("member_id", memberId)
        .eq("moderation_status", "approved")
        .order("created_at", { ascending: true })
        .limit(1)
        .maybeSingle();

      if (nextPhoto?.id) await supabase.from("photos").update({ is_primary: true }).eq("id", nextPhoto.id);
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "تعذر حذف الصورة" }, { status: 500 });
  }
}
