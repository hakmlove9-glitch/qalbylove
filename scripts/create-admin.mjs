import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const email = String(process.env.QALBYLOVE_ADMIN_EMAIL || "").trim().toLowerCase();
const password = String(process.env.QALBYLOVE_ADMIN_PASSWORD || "");
const username = String(
  process.env.QALBYLOVE_ADMIN_USERNAME || "qalbylove_admin",
).trim();

function fail(message) {
  console.error(`\n❌ ${message}\n`);
  process.exit(1);
}

if (!url || !serviceKey || !email || !password) {
  fail(
    "يلزم ضبط NEXT_PUBLIC_SUPABASE_URL وSUPABASE_SERVICE_ROLE_KEY وQALBYLOVE_ADMIN_EMAIL وQALBYLOVE_ADMIN_PASSWORD",
  );
}

if (!username) fail("اسم الإدارة الظاهر مطلوب.");

if (password.length < 12) {
  fail("استخدم كلمة مرور للإدارة لا تقل عن 12 حرفًا.");
}

const supabase = createClient(url, serviceKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

const { data: usernameOwner, error: usernameError } = await supabase
  .from("members")
  .select("id,username,email,role,is_admin")
  .ilike("username", username)
  .limit(1)
  .maybeSingle();

if (usernameError) fail(usernameError.message);

const passwordHash = await bcrypt.hash(password, 12);

let memberId = usernameOwner?.id || null;

if (!memberId) {
  /*
   * البريد في قلبي لوڤي مسموح أن يرتبط بأكثر من حساب،
   * لذلك لا نستخدمه كمفتاح فريد لإنشاء الإدارة.
   * نعتمد الاسم الظاهر الفريد فقط.
   */
  const { data, error } = await supabase
    .from("members")
    .insert({
      username,
      email,
      password_hash: passwordHash,
      is_admin: true,
      role: "super_admin",
      account_status: "active",
    })
    .select("id,username,email,role,is_admin")
    .single();

  if (error) fail(error.message);
  memberId = data.id;

  console.log("\n✅ تم إنشاء حساب الإدارة الرئيسي بنجاح.");
  console.log(`الاسم الظاهر: ${data.username}`);
  console.log(`البريد: ${data.email}`);
  console.log(`الصلاحية: ${data.role}`);
} else {
  const { data, error } = await supabase
    .from("members")
    .update({
      email,
      password_hash: passwordHash,
      is_admin: true,
      role: "super_admin",
      account_status: "active",
      updated_at: new Date().toISOString(),
    })
    .eq("id", memberId)
    .select("id,username,email,role,is_admin")
    .single();

  if (error) fail(error.message);

  console.log("\n✅ تم تحديث حساب الإدارة الرئيسي بنجاح.");
  console.log(`الاسم الظاهر: ${data.username}`);
  console.log(`البريد: ${data.email}`);
  console.log(`الصلاحية: ${data.role}`);
}

console.log("\n🔐 لا تحفظ كلمة مرور الإدارة داخل الكود أو Git.");
console.log("استخدم متغيرات البيئة فقط.\n");
