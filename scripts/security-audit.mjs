import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const failures = [];
const forbiddenFiles = ["app/api/debug/database/route.ts"];
for (const file of forbiddenFiles) if (fs.existsSync(path.join(root, file))) failures.push(`مسار تشخيصي غير مسموح في الإنتاج: ${file}`);

const legacyRoutes = [
  "app/api/send/route.ts",
  "app/api/upload/route.ts",
  "app/api/payment/confirm/route.ts",
  "app/api/payments/approve/route.ts",
  "app/api/admin/users/route.ts",
];
for (const file of legacyRoutes) {
  const full = path.join(root, file);
  if (!fs.existsSync(full)) continue;
  const text = fs.readFileSync(full, "utf8");
  if (!text.includes("status: 410")) failures.push(`المسار القديم يجب أن يظل مقفولًا: ${file}`);
}

function walk(dir) {
  const out = [];
  for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
    if (["node_modules", ".next", ".git"].includes(item.name)) continue;
    const full = path.join(dir, item.name);
    if (item.isDirectory()) out.push(...walk(full)); else out.push(full);
  }
  return out;
}

for (const file of walk(root)) {
  const rel = path.relative(root, file).replaceAll("\\", "/");
  if (!/\.(ts|tsx|js|mjs)$/.test(rel)) continue;
  const text = fs.readFileSync(file, "utf8");
  if ((rel.startsWith("components/") || /app\/.*\/page\.tsx$/.test(rel)) && text.includes("SUPABASE_SERVICE_ROLE_KEY")) {
    failures.push(`مفتاح الخدمة مستخدم في كود واجهة: ${rel}`);
  }
}

if (failures.length) {
  console.error("\n❌ فحص الأمان الثابت فشل:");
  failures.forEach(x => console.error(`- ${x}`));
  process.exit(1);
}
console.log("✅ فحص الأمان الثابت: لا توجد مسارات تشخيصية مفتوحة أو مفاتيح خدمة في الواجهة، والمسارات القديمة الحساسة مقفولة.");
