import fs from "node:fs";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

function loadEnvFile(fileName) {
  const filePath = path.join(process.cwd(), fileName);
  if (!fs.existsSync(filePath)) return;

  const text = fs.readFileSync(filePath, "utf8");

  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;

    const index = line.indexOf("=");
    if (index <= 0) continue;

    const key = line.slice(0, index).trim();
    let value = line.slice(index + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (!process.env[key]) process.env[key] = value;
  }
}

// Node لا يقرأ .env.local تلقائيًا مثل Next.js.
loadEnvFile(".env.local");
loadEnvFile(".env");

const requiredEnv = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "SUPABASE_SERVICE_ROLE_KEY",
];

const missingEnv = requiredEnv.filter((name) => !process.env[name]);

if (missingEnv.length) {
  console.error("\n❌ متغيرات البيئة الناقصة:");
  for (const name of missingEnv) console.error(`- ${name}`);
  console.error("\nتأكد أنها موجودة داخل .env.local في جذر المشروع.\n");
  process.exit(1);
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  },
);

const checks = [
  ["members", "id"],
  ["member_details", "member_id"],
  ["member_settings", "member_id"],
  ["photos", "member_id"],
  ["messages", "id"],
  ["notifications", "id"],
  ["interests", "id"],
  ["favorites", "id"],
  ["blocks", "id"],
  ["matches", "id"],
  ["profile_views", "id"],
  ["reports", "id"],
  ["assistant_logs", "id"],
  ["moderation_violations", "id"],
  ["subscription_plans", "id"],
  ["subscription_codes", "id"],
  ["subscriptions", "id"],
  ["payments", "id"],
  ["site_settings", "key"],
];

let failed = 0;

console.log("\n🔎 فحص قاعدة بيانات قلبي لوڤي...\n");

for (const [table, column] of checks) {
  const { error } = await supabase
    .from(table)
    .select(column, { head: true, count: "exact" })
    .limit(1);

  if (error) {
    failed += 1;
    console.log(`❌ ${table}: ${error.message}`);
  } else {
    console.log(`✅ ${table}`);
  }
}

const expectedPlans = [
  ["شهر واحد", 99, 1],
  ["3 شهور", 199, 3],
  ["6 شهور", 399, 6],
  ["سنة كاملة", 699, 12],
];

const { data: plans, error: plansError } = await supabase
  .from("subscription_plans")
  .select("name,price,duration_months,tier_id,display_name,badge,is_active")
  .eq("is_active", true)
  .order("duration_months");

if (plansError) {
  failed += 1;
  console.log(`\n❌ تعذر قراءة الباقات: ${plansError.message}`);
} else {
  console.log("\n💎 فحص الباقات:");
  for (const [name, price, months] of expectedPlans) {
    const plan = plans?.find(
      (item) =>
        item.name === name &&
        Number(item.price) === price &&
        Number(item.duration_months) === months,
    );

    if (!plan) {
      failed += 1;
      console.log(`❌ ${name}: غير مطابقة`);
    } else {
      console.log(`✅ ${plan.display_name || name} — ${price} جنيه`);
    }
  }
}

const { data: paymentSettings, error: paymentError } = await supabase
  .from("site_settings")
  .select("value")
  .eq("key", "payment")
  .maybeSingle();

if (paymentError) {
  failed += 1;
  console.log(`\n❌ إعدادات الدفع: ${paymentError.message}`);
} else {
  const phone = String(paymentSettings?.value?.phone || "").trim();
  if (/^01\d{9}$/.test(phone)) {
    console.log("\n✅ رقم الدفع الرسمي مضبوط في إعدادات الموقع.");
  } else {
    failed += 1;
    console.log("\n❌ رقم الدفع غير مضبوط أو ليس رقم محمول مصري صالحًا.");
  }
}

const storageBuckets = [
  "member-photos",
  "payment-receipts",
  "voice-messages",
  "voice-intros",
  "voices",
];

const { data: buckets, error: bucketsError } =
  await supabase.storage.listBuckets();

if (bucketsError) {
  failed += 1;
  console.log(`\n❌ تعذر فحص Storage: ${bucketsError.message}`);
} else {
  console.log("\n🗂️ فحص Storage:");
  const names = new Set((buckets || []).map((bucket) => bucket.name));
  for (const name of storageBuckets) {
    if (names.has(name)) {
      console.log(`✅ ${name}`);
    } else {
      failed += 1;
      console.log(`❌ ${name}: غير موجود`);
    }
  }
}

if (failed > 0) {
  console.error(`\n❌ انتهى الفحص مع ${failed} مشكلة/مشاكل تحتاج مراجعة.\n`);
  process.exit(1);
}

console.log("\n✅ قاعدة البيانات والـStorage والإعدادات الأساسية متوافقة مع النسخة النهائية.\n");
