"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import {
  Camera,
  Check,
  CheckCircle2,
  Clock3,
  Eye,
  EyeOff,
  HeartHandshake,
  ImagePlus,
  LockKeyhole,
  ShieldCheck,
  Star,
  Trash2,
  UserCheck,
  X,
  XCircle,
} from "lucide-react";
import MemberShell from "@/components/member/MemberShell";

type Photo = {
  id: string;
  image_url?: string | null;
  is_primary: boolean;
  moderation_status: "approved" | "pending" | "rejected" | string;
  moderation_reason?: string | null;
};

type AccessRequest = {
  id: string;
  requester_id?: string;
  owner_id?: string;
  memberName: string;
  status: string;
};

const privacyOptions = [
  {
    value: "all",
    title: "كل الأعضاء المناسبين",
    text: "أي عضو مسموح له أصلًا برؤية ملفك يقدر يشوف صورك.",
    Icon: Eye,
  },
  {
    value: "mutual",
    title: "الاهتمام المتبادل فقط",
    text: "الصور تظهر فقط لما يكون بينكم اهتمام متبادل.",
    Icon: HeartHandshake,
  },
  {
    value: "request",
    title: "بعد موافقتي",
    text: "العضو يرسل طلب مشاهدة، وأنت تقبل أو ترفض.",
    Icon: UserCheck,
  },
  {
    value: "private",
    title: "أنا فقط",
    text: "الصور تبقى خاصة بك ولا تظهر لأي عضو.",
    Icon: LockKeyhole,
  },
] as const;

function statusMeta(status: string) {
  if (status === "approved") return { label: "منشورة", className: "bg-emerald-50 text-emerald-700", Icon: CheckCircle2 };
  if (status === "rejected") return { label: "مرفوضة آليًا", className: "bg-red-50 text-red-700", Icon: XCircle };
  return { label: "مراجعة استثنائية", className: "bg-amber-50 text-amber-700", Icon: Clock3 };
}

export default function PhotosPage() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [visibility, setVisibility] = useState("all");
  const [incoming, setIncoming] = useState<AccessRequest[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [workingId, setWorkingId] = useState("");

  async function loadAll() {
    setLoading(true);
    try {
      const [photosResponse, privacyResponse] = await Promise.all([
        fetch("/api/photos", { cache: "no-store" }),
        fetch("/api/photos/privacy", { cache: "no-store" }),
      ]);
      const photosData = await photosResponse.json();
      const privacyData = await privacyResponse.json();

      if (!photosResponse.ok) throw new Error(photosData.error || "تعذر تحميل الصور");
      if (!privacyResponse.ok) throw new Error(privacyData.error || "تعذر تحميل إعدادات الخصوصية");

      setPhotos(photosData.photos || []);
      setVisibility(privacyData.visibility || "all");
      setIncoming((privacyData.incoming || []).filter((item: AccessRequest) => item.status === "pending"));
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "تعذر تحميل الصور");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { void loadAll(); }, []);

  useEffect(() => {
    return () => { if (preview) URL.revokeObjectURL(preview); };
  }, [preview]);

  const approvedCount = useMemo(() => photos.filter((photo) => photo.moderation_status === "approved").length, [photos]);
  const pendingCount = useMemo(() => photos.filter((photo) => photo.moderation_status === "pending").length, [photos]);

  function chooseFile(next: File | null) {
    if (preview) URL.revokeObjectURL(preview);
    setFile(next);
    setPreview(next ? URL.createObjectURL(next) : "");
    setMessage("");
  }

  async function saveVisibility(next: string) {
    setVisibility(next);
    const response = await fetch("/api/photos/privacy", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ visibility: next }),
    });
    const data = await response.json();
    if (!response.ok) setMessage(data.error || "تعذر حفظ الخصوصية");
    else setMessage("تم حفظ خصوصية الصور.");
  }

  async function answerRequest(requestId: string, action: "approve" | "reject") {
    setWorkingId(requestId);
    try {
      const response = await fetch("/api/photos/privacy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId, action }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "تعذر تحديث الطلب");
      await loadAll();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "تعذر تحديث الطلب");
    } finally {
      setWorkingId("");
    }
  }

  async function uploadPhoto() {
    if (!file) return setMessage("اختَر صورة أولًا.");

    setUploading(true);
    setMessage("");

    try {
      const form = new FormData();
      form.append("image", file);

      const response = await fetch("/api/photos", { method: "POST", body: form });
      const data = await response.json();

      if (!response.ok) {
        if (data.status === "rejected" || response.status === 422) {
          throw new Error(data.error || "الصورة لم تجتز الفحص الآلي.");
        }
        throw new Error(data.error || "تعذر رفع الصورة");
      }

      setMessage(data.message || "تم رفع الصورة.");
      chooseFile(null);
      await loadAll();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "تعذر رفع الصورة");
    } finally {
      setUploading(false);
    }
  }

  async function setPrimary(photoId: string) {
    setWorkingId(photoId);
    try {
      const response = await fetch("/api/photos", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ photoId }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "تعذر تغيير الصورة الأساسية");
      await loadAll();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "تعذر تغيير الصورة الأساسية");
    } finally {
      setWorkingId("");
    }
  }

  async function removePhoto(photoId: string) {
    if (!window.confirm("حذف هذه الصورة من ملفك؟")) return;
    setWorkingId(photoId);
    try {
      const response = await fetch(`/api/photos?id=${encodeURIComponent(photoId)}`, { method: "DELETE" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "تعذر حذف الصورة");
      await loadAll();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "تعذر حذف الصورة");
    } finally {
      setWorkingId("");
    }
  }

  return (
    <MemberShell
      title="صورتي وصوري"
      subtitle="ارفع الصورة مرة واحدة: الفحص الآلي ينشر الصورة السليمة فورًا، والإدارة تدخل فقط في الحالات غير الواضحة أو المخالفات."
    >
      <section className="overflow-hidden rounded-[32px] border border-rose-100 bg-white shadow-[0_20px_65px_rgba(78,16,45,.08)]">
        <div className="grid lg:grid-cols-[1fr_330px]">
          <div className="p-6 md:p-8">
            <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-[10px] font-black text-emerald-700">
              <ShieldCheck className="h-4 w-4" />فحص آلي قبل النشر
            </span>
            <h2 className="mt-4 text-3xl font-black text-[#4a0d2b]">صورك تنزل فورًا لما تكون سليمة</h2>
            <p className="mt-3 max-w-2xl text-sm font-bold leading-7 text-rose-500">
              الصورة المخالفة لا تُنشر، والحالات غير الواضحة فقط هي التي تنتقل للإدارة. كده العضو الطبيعي ما يستناش موافقة بشرية.
            </p>
            <div className="mt-5 flex flex-wrap gap-2 text-[10px] font-black">
              <span className="rounded-full bg-emerald-50 px-3 py-2 text-emerald-700">{approvedCount} منشورة</span>
              <span className="rounded-full bg-amber-50 px-3 py-2 text-amber-700">{pendingCount} مراجعة استثنائية</span>
              <span className="rounded-full bg-rose-50 px-3 py-2 text-rose-600">الحد الأقصى 8 صور</span>
            </div>
          </div>
          <div className="relative min-h-[250px]">
            <Image src="/images/site-v2/pages/member-photos/01.webp" alt="صور الملف الشخصي" fill className="object-cover" sizes="330px" priority />
          </div>
        </div>
      </section>

      <section className="mt-6 rounded-[30px] border border-rose-100 bg-white p-5 shadow-[0_14px_45px_rgba(78,16,45,.05)]">
        <div className="flex items-center gap-2">
          <Eye className="h-5 w-5 text-rose-600" />
          <div>
            <h3 className="text-lg font-black text-[#4a0d2b]">من يمكنه رؤية صوري؟</h3>
            <p className="mt-1 text-[11px] font-bold text-rose-500">الاختيار يطبق على الألبوم كله فورًا.</p>
          </div>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {privacyOptions.map(({ value, title, text, Icon }) => {
            const active = visibility === value;
            return (
              <button
                key={value}
                type="button"
                onClick={() => void saveVisibility(value)}
                className={`rounded-[22px] border p-4 text-right transition ${
                  active ? "border-rose-300 bg-rose-50 ring-2 ring-rose-100" : "border-rose-100 bg-rose-50 hover:border-rose-200"
                }`}
              >
                <span className={`grid h-10 w-10 place-items-center rounded-xl ${active ? "bg-rose-600 text-white" : "bg-white text-rose-500"}`}>
                  <Icon className="h-5 w-5" />
                </span>
                <div className="mt-3 flex items-center justify-between gap-2">
                  <b className="text-sm font-black text-rose-800">{title}</b>
                  {active && <Check className="h-4 w-4 text-rose-600" />}
                </div>
                <p className="mt-1 text-[10px] font-bold leading-5 text-rose-500">{text}</p>
              </button>
            );
          })}
        </div>
      </section>

      {visibility === "request" && (
        <section className="mt-6 rounded-[30px] border border-amber-100 bg-white p-5 shadow-[0_14px_45px_rgba(78,16,45,.05)]">
          <h3 className="text-lg font-black text-[#4a0d2b]">طلبات مشاهدة الصور</h3>
          {incoming.length === 0 ? (
            <div className="mt-3 rounded-2xl bg-rose-50 p-4 text-xs font-bold text-rose-500">لا توجد طلبات معلقة الآن.</div>
          ) : (
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {incoming.map((request) => (
                <div key={request.id} className="flex items-center justify-between gap-3 rounded-2xl border border-rose-100 bg-rose-50 p-3">
                  <div>
                    <div className="text-xs font-black text-rose-800">{request.memberName}</div>
                    <div className="mt-1 text-[10px] font-bold text-rose-400">طلب مشاهدة صورك</div>
                  </div>
                  <div className="flex gap-2">
                    <button disabled={workingId===request.id} onClick={()=>void answerRequest(request.id,"approve")} className="rounded-xl bg-emerald-600 px-3 py-2 text-[10px] font-black text-white">سماح</button>
                    <button disabled={workingId===request.id} onClick={()=>void answerRequest(request.id,"reject")} className="rounded-xl bg-red-50 px-3 py-2 text-[10px] font-black text-red-600">رفض</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      <section className="mt-6 grid gap-5 xl:grid-cols-[360px_1fr]">
        <div className="rounded-[28px] border border-rose-100 bg-white p-5 shadow-[0_14px_45px_rgba(78,16,45,.05)]">
          <h3 className="flex items-center gap-2 text-lg font-black text-[#4a0d2b]"><ImagePlus className="h-5 w-5 text-rose-500"/>إضافة صورة جديدة</h3>
          <label className="mt-4 flex min-h-[260px] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-[24px] border-2 border-dashed border-rose-200 bg-rose-50/45 p-4 text-center transition hover:bg-rose-50">
            {preview ? <img src={preview} alt="معاينة الصورة" className="max-h-[310px] w-full rounded-2xl object-contain"/> : <>
              <span className="grid h-16 w-16 place-items-center rounded-2xl bg-white text-rose-500 shadow-sm"><ImagePlus className="h-7 w-7"/></span>
              <b className="mt-4 text-sm font-black text-rose-700">اختَر صورة من جهازك</b>
              <span className="mt-1 text-[10px] font-bold text-rose-400">JPG أو PNG أو WEBP — حتى 5 MB</span>
            </>}
            <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={(event)=>chooseFile(event.target.files?.[0] || null)} />
          </label>
          {file && <button type="button" disabled={uploading} onClick={uploadPhoto} className="mt-4 h-12 w-full rounded-2xl bg-gradient-to-l from-[#72113f] to-[#d31f69] text-xs font-black text-white shadow-lg disabled:opacity-50">{uploading ? "جاري فحص ورفع الصورة..." : "استخدام الصورة"}</button>}
          <div className="mt-4 rounded-2xl bg-emerald-50 p-3 text-[10px] font-bold leading-5 text-emerald-800">
            <ShieldCheck className="mb-1 h-4 w-4"/>
            الصورة السليمة تنشر تلقائيًا. المخالفة تُرفض تلقائيًا، والحالة غير الواضحة فقط تذهب للمراجعة.
          </div>
        </div>

        <div className="rounded-[28px] border border-rose-100 bg-white p-5 shadow-[0_14px_45px_rgba(78,16,45,.05)]">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-lg font-black text-[#4a0d2b]">صور ملفي</h3>
            <span className="text-[10px] font-black text-rose-400">{photos.length} / 8</span>
          </div>
          {message && <div className="mt-4 rounded-2xl border border-rose-100 bg-rose-50 p-3 text-xs font-black text-rose-700">{message}</div>}
          {loading ? (
            <div className="grid min-h-[300px] place-items-center text-sm font-black text-rose-400">جاري تحميل الصور...</div>
          ) : photos.length === 0 ? (
            <div className="mt-5 grid min-h-[300px] place-items-center rounded-[24px] bg-rose-50 p-8 text-center">
              <div><Camera className="mx-auto h-10 w-10 text-rose-300"/><div className="mt-3 text-sm font-black text-rose-500">لسه ما رفعتش صور</div></div>
            </div>
          ) : (
            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {photos.map((photo)=> {
                const meta=statusMeta(photo.moderation_status);
                const StatusIcon=meta.Icon;
                return (
                  <article key={photo.id} className={`overflow-hidden rounded-[24px] border bg-white ${photo.is_primary?"border-amber-300 ring-2 ring-amber-100":"border-rose-100"}`}>
                    <div className="relative aspect-[4/5] bg-rose-50">
                      {photo.image_url ? <img src={photo.image_url} alt="صورة العضو" className="h-full w-full object-cover"/> : <div className="grid h-full place-items-center text-xs font-black text-rose-400">الصورة غير متاحة للعرض</div>}
                      {photo.is_primary&&<span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-amber-400 px-2.5 py-1 text-[9px] font-black text-amber-950 shadow"><Star className="h-3 w-3" fill="currentColor"/>الصورة الأساسية</span>}
                    </div>
                    <div className="p-3">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[9px] font-black ${meta.className}`}><StatusIcon className="h-3 w-3"/>{meta.label}</span>
                      {photo.moderation_status!=="approved"&&photo.moderation_reason&&<p className="mt-2 text-[10px] font-bold leading-5 text-rose-600">{photo.moderation_reason}</p>}
                      <div className="mt-3 flex gap-2">
                        {photo.moderation_status==="approved"&&!photo.is_primary&&<button disabled={workingId===photo.id} onClick={()=>void setPrimary(photo.id)} className="flex-1 rounded-xl bg-amber-50 px-2 py-2 text-[10px] font-black text-amber-800">اجعلها أساسية</button>}
                        <button disabled={workingId===photo.id} onClick={()=>void removePhoto(photo.id)} className="grid h-9 w-9 place-items-center rounded-xl bg-red-50 text-red-600"><Trash2 className="h-4 w-4"/></button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </MemberShell>
  );
}
