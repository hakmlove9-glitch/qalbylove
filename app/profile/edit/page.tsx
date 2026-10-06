"use client";

import { useEffect, useMemo, useState } from "react";
import { Camera, CheckCircle2, Heart, Save, ShieldCheck, Stethoscope, UserRound, Upload, Volume2 } from "lucide-react";
import MemberShell from "@/components/member/MemberShell";
import AdamHawaGuide from "@/components/member/AdamHawaGuide";
import VoiceIntroRecorder from "@/components/member/VoiceIntroRecorder";

const healthOptions = ["بصحة جيدة والحمد لله", "السكري", "ضغط الدم", "أمراض القلب", "حالة صحية أخرى"];
const traits = ["اجتماعي", "رومانسي", "مرح", "عائلي", "طموح", "هادئ"];
const interestList = ["القراءة", "السفر", "الرياضة", "الطبخ", "الفن", "التطوير", "العائلة", "العمل التطوعي"];
const marriageIntents = ["جاهز للزواج قريبًا", "خلال سنة تقريبًا", "أفضل التعارف الجاد أولًا"];

export default function EditProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [completionData, setCompletionData] = useState<any>({ percentage: 0, missing: [] });
  const [photoPreview, setPhotoPreview] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [aiLoading, setAiLoading] = useState<"" | "bio" | "partner">("");
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [aiTarget, setAiTarget] = useState<"bio" | "partner">("bio");

  useEffect(() => {
    Promise.all([
      fetch("/api/profile", { cache: "no-store" }).then((response) => response.json()),
      fetch("/api/profile/completion", { cache: "no-store" }).then((response) => response.json()),
    ])
      .then(([profileData, completionResponse]) => {
        const loaded = profileData.profile || null;
        setProfile(loaded);
        setCompletionData(completionResponse || { percentage: 0, missing: [] });
        const primary = loaded?.photos?.find((item:any) => item.is_primary)?.image_url || loaded?.photos?.[0]?.image_url || "";
        setPhotoPreview(primary);
      })
      .finally(() => setLoading(false));
  }, []);

  const completion = Number(completionData?.percentage || 0);

  const set = (key: string, value: unknown) => setProfile((old: any) => ({ ...old, [key]: value }));
  const toggle = (key: string, value: string) => set(key, (profile[key] || []).includes(value) ? profile[key].filter((item: string) => item !== value) : [...(profile[key] || []), value]);

  async function uploadPhoto(file: File) {
    setUploadingPhoto(true);
    setMessage("");
    try {
      const formData = new FormData();
      formData.append("image", file);
      const response = await fetch("/api/photos", { method: "POST", body: formData });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "تعذر رفع الصورة");
      setMessage("تم رفع الصورة بنجاح");
      const completionResponse = await fetch("/api/profile/completion", { cache: "no-store" }).then((r) => r.json());
      setCompletionData(completionResponse || { percentage: completion, missing: [] });
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "تعذر رفع الصورة");
    } finally {
      setUploadingPhoto(false);
    }
  }

  async function choosePhoto(file: File | null) {
    if (!file) return;
    if (!["image/jpeg","image/png","image/webp"].includes(file.type)) {
      setMessage("الصورة يجب أن تكون بصيغة JPG أو PNG أو WEBP.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setMessage("حجم الصورة يجب ألا يزيد عن 5 ميجابايت.");
      return;
    }
    const url = URL.createObjectURL(file);
    setPhotoPreview(url);
    setPhotoFile(file);
    await uploadPhoto(file);
  }

  async function askAssistant(target: "bio" | "partner") {
    setAiLoading(target);
    setAiTarget(target);
    setAiSuggestions([]);
    try {
      const response = await fetch("/api/assistant/bio-suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile, target }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "تعذر تجهيز الاقتراحات");
      setAiSuggestions(data.suggestions || []);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "تعذر تجهيز الاقتراحات");
    } finally {
      setAiLoading("");
    }
  }

  async function save() {
    setSaving(true);
    setMessage("");
    try {
      const response = await fetch("/api/profile", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(profile) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "تعذر الحفظ");
      setMessage("تم حفظ بياناتك بنجاح");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "تعذر الحفظ");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <MemberShell title="تعديل ملفك"><div className="rounded-3xl bg-white p-10 text-center font-black">جاري تحميل بياناتك...</div></MemberShell>;
  if (!profile) return <MemberShell title="تعديل ملفك"><div className="rounded-3xl bg-white p-10 text-center font-black">تعذر تحميل الملف.</div></MemberShell>;

  return (
    <MemberShell username={profile.username} title="تعديل ملفك" subtitle="كل بياناتك في مكان واحد، ومعاك تحكم كامل في الخصوصية وطريقة ظهور ملفك.">
      <div className="grid gap-5 xl:grid-cols-[1fr_300px]">
        <section className="space-y-5">
          <section className="rounded-[30px] border border-rose-100 bg-white p-6 text-center shadow-[0_18px_55px_rgba(80,18,45,.06)]">
            <div className="relative mx-auto h-36 w-36">
              <div className="h-36 w-36 overflow-hidden rounded-full bg-gradient-to-br from-rose-50 to-amber-50 ring-8 ring-rose-50 shadow-xl">
                {photoPreview ? (
                  <img src={photoPreview} alt="صورتك الشخصية" className="h-full w-full object-cover" />
                ) : (
                  <div className="grid h-full w-full place-items-center text-rose-300"><UserRound className="h-16 w-16" /></div>
                )}
              </div>
              <label className="absolute -bottom-1 -left-1 grid h-11 w-11 cursor-pointer place-items-center rounded-full bg-gradient-to-br from-rose-500 to-pink-600 text-white shadow-lg ring-4 ring-white" title="أضف صورتك">
                <Camera className="h-5 w-5" />
                <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={(event) => choosePhoto(event.target.files?.[0] || null)} />
              </label>
            </div>
            
            {uploadingPhoto && <div className="mt-3 text-xs font-black text-amber-600">جاري رفع الصورة...</div>}
            <h2 className="mt-4 text-2xl font-black text-[#5a0b31]">{profile.username || "عضو قلبي لوڤي"}</h2>
            
          </section>

          <Card title="البيانات الأساسية" icon={<UserRound className="h-5 w-5" />}>
            <Grid>
              <Field label="الاسم الظاهر للأعضاء" required><input className="input" value={profile.username || ""} onChange={(event) => set("username", event.target.value)} /></Field>
              <Field label="الاسم الحقيقي — سري"><input className="input" value={profile.full_name || ""} onChange={(event) => set("full_name", event.target.value)} /></Field>
              <Field label="العمر" required><input type="number" className="input" value={profile.age || ""} onChange={(event) => set("age", event.target.value)} /></Field>
              <Field label="المحافظة" required><input className="input" value={profile.governorate || ""} onChange={(event) => set("governorate", event.target.value)} /></Field>
              <Field label="المدينة / المركز" required><input className="input" value={profile.city || ""} onChange={(event) => set("city", event.target.value)} /></Field>
              <Field label="الحالة الاجتماعية" required><input className="input" value={profile.marital_status || ""} onChange={(event) => set("marital_status", event.target.value)} /></Field>
              <Field label="العمل"><input className="input" value={profile.job || ""} onChange={(event) => set("job", event.target.value)} /></Field>
              <Field label="نية الزواج" required><select className="input" value={profile.marriage_intent || ""} onChange={(event) => set("marriage_intent", event.target.value)}><option value="">اختر</option>{marriageIntents.map((item) => <option key={item}>{item}</option>)}</select></Field>
              <Field label="المؤهل الدراسي"><input className="input" value={profile.education || ""} onChange={(event) => set("education", event.target.value)} /></Field>
            </Grid>
          </Card>

          <Card title="صحتي ونمط حياتي" icon={<Stethoscope className="h-5 w-5" />}>
            <Grid>
              <Field label="الحالة الصحية" required><select className="input" value={profile.health_status || "بصحة جيدة والحمد لله"} onChange={(event) => set("health_status", event.target.value)}>{healthOptions.map((item) => <option key={item}>{item}</option>)}</select></Field>
              <Field label="خصوصية الحالة الصحية"><select className="input" value={profile.health_privacy || "members"} onChange={(event) => set("health_privacy", event.target.value)}><option value="members">تظهر للأعضاء المسجلين</option><option value="matches">للتوافقات فقط</option><option value="private">مخفية</option></select></Field>
              <Field label="التدخين"><select className="input" value={profile.smoking || ""} onChange={(event) => set("smoking", event.target.value)}><option value="">اختر</option><option>لا أدخن</option><option>أدخن</option><option>أقلعت عن التدخين</option></select></Field>
              <Field label="الطول"><input type="number" className="input" value={profile.height || ""} onChange={(event) => set("height", event.target.value)} /></Field>
            </Grid>
            <Field label="تفاصيل صحية إضافية"><textarea className="input min-h-24 py-3" value={profile.health_details || ""} onChange={(event) => set("health_details", event.target.value)} /></Field>
            <p className="mt-4 text-xs font-semibold leading-6 text-rose-500">أنت من يقرر من يرى هذه المعلومة. الحالة الصحية لا تُستخدم للحكم على العضو، وإنما للوضوح والتوافق الواقعي.</p>
          </Card>

          <Card title="تعريفك بصوتك" icon={<Volume2 className="h-5 w-5" />}>
            <VoiceIntroRecorder initialUrl={profile.voice_intro_url} />
          </Card>

          <Card title="شخصيتي واهتماماتي" icon={<Heart className="h-5 w-5" />}>
            <h4 className="font-black">صفاتي</h4>
            <div className="mt-3 flex flex-wrap gap-2">{traits.map((item) => <Chip key={item} active={(profile.personality_traits || []).includes(item)} onClick={() => toggle("personality_traits", item)}>{item}</Chip>)}</div>
            <h4 className="mt-6 font-black">اهتماماتي</h4>
            <div className="mt-3 flex flex-wrap gap-2">{interestList.map((item) => <Chip key={item} active={(profile.interests || []).includes(item)} onClick={() => toggle("interests", item)}>{item}</Chip>)}</div>
            <Field label="نبذة عني" required>
              <textarea className="input min-h-32 py-3" value={profile.bio || ""} onChange={(event) => set("bio", event.target.value)} />
              <button type="button" onClick={() => askAssistant("bio")} disabled={aiLoading==="bio"} className="mt-2 rounded-xl bg-rose-50 px-4 py-2 text-xs font-black text-rose-700">{aiLoading==="bio"?"آدم/حواء بيراجع بياناتك...":"خلي آدم/حواء يساعدك تكتب نبذة عنك"}</button>
            </Field>
            <Field label="الشريك المناسب" required>
              <textarea className="input min-h-32 py-3" value={profile.partner_specs || ""} onChange={(event) => set("partner_specs", event.target.value)} />
              <button type="button" onClick={() => askAssistant("partner")} disabled={aiLoading==="partner"} className="mt-2 rounded-xl bg-amber-50 px-4 py-2 text-xs font-black text-amber-800">{aiLoading==="partner"?"آدم/حواء بيجهز اقتراحات مناسبة...":"ساعدني أوصف شريك الحياة المناسب"}</button>
            </Field>
            {aiSuggestions.length>0&&<div className="mt-4 rounded-2xl border border-rose-100 bg-[#fffafc] p-4"><div className="mb-3 text-xs font-black text-[#5b0c31]">اختَر صياغة وعدّل عليها براحتك</div><div className="space-y-2">{aiSuggestions.map((item,index)=><button key={index} type="button" onClick={()=>{set(aiTarget==="bio"?"bio":"partner_specs",item);setAiSuggestions([])}} className="block w-full rounded-xl border border-rose-100 bg-white p-3 text-right text-xs font-bold leading-6 text-rose-600 hover:border-rose-300">{item}</button>)}</div></div>}
          </Card>

          {message && <div className="rounded-2xl border border-rose-100 bg-rose-50 p-4 text-sm font-black text-rose-700">{message}</div>}
          <button onClick={save} disabled={saving} className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-l from-[#be123c] to-[#e11d5f] font-black text-white shadow-lg shadow-rose-100"><Save className="h-5 w-5" />{saving ? "جاري الحفظ..." : "حفظ كل التعديلات"}</button>
        </section>
        <aside className="space-y-4">
          <div className="rounded-[28px] bg-[#3b0b1d] p-5 text-white"><div className="flex items-center justify-between"><span className="text-sm font-black">اكتمال الملف الحقيقي</span><span className="text-2xl font-black">{completion}%</span></div><div className="mt-4 h-2 overflow-hidden rounded-full bg-white/15"><div style={{ width: `${completion}%` }} className="h-full bg-rose-300" /></div><div className="mt-4 flex items-center gap-2 text-xs font-bold text-rose-100"><CheckCircle2 className="h-4 w-4" />الصورة والبيانات الأساسية جزء من النسبة.</div>{Array.isArray(completionData?.missing)&&completionData.missing.length>0&&<div className="mt-3 rounded-xl bg-white/10 p-3 text-[10px] font-bold leading-5 text-rose-50">الناقص: {completionData.missing.slice(0,5).join("، ")}</div>}</div>
          <AdamHawaGuide gender={profile.gender} completion={completion} />
        </aside>
      </div>
      <style jsx global>{`.input{width:100%;min-height:50px;border:1px solid #e2e8f0;border-radius:15px;background:#f8fafc;padding:0 14px;font-size:14px;font-weight:700;outline:none}.input:focus{border-color:#f9a8d4;background:#fff;box-shadow:0 0 0 3px rgba(244,114,182,.08)}`}</style>
    </MemberShell>
  );
}

function Card({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) { return <section className="rounded-[28px] border border-rose-100 bg-white p-5 shadow-[0_14px_35px_rgba(80,20,40,.05)] md:p-6"><div className="mb-5 flex items-center gap-2 text-lg font-black text-[#3b0b1d]">{icon}{title}</div>{children}</section>; }
function Grid({ children }: { children: React.ReactNode }) { return <div className="grid gap-4 md:grid-cols-2">{children}</div>; }
function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) { return <label className="mt-4 block"><span className="mb-2 block text-sm font-black">{label} {required && <b className="text-red-500">*</b>}</span>{children}</label>; }
function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) { return <button type="button" onClick={onClick} className={`rounded-full border px-4 py-2 text-xs font-black ${active ? "border-rose-500 bg-rose-600 text-white" : "border-rose-100 bg-rose-50 text-rose-700"}`}>{children}</button>; }
