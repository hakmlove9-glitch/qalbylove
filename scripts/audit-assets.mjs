import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const root = process.cwd();
const publicDir = path.join(root, "public");
const sourceDirs = ["app", "components", "lib", "hooks", "services"];
const codeExt = new Set([".ts", ".tsx", ".js", ".jsx", ".css", ".json", ".md"]);
const imageExt = new Set([".png", ".jpg", ".jpeg", ".webp", ".svg", ".gif", ".avif", ".ico"]);
const assetPattern = /["'](\/(?:images|brand|avatars|mascots|flags|icons|favicon)[^"']*?\.(?:png|jpg|jpeg|webp|svg|gif|avif|ico))["']/gi;

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
}

const missing = [];
let refs = 0;
for (const sourceDir of sourceDirs) {
  for (const file of walk(path.join(root, sourceDir))) {
    if (!codeExt.has(path.extname(file).toLowerCase())) continue;
    const source = fs.readFileSync(file, "utf8");
    for (const match of source.matchAll(assetPattern)) {
      refs += 1;
      const asset = match[1].split("?")[0].split("#")[0];
      if (!fs.existsSync(path.join(publicDir, asset.replace(/^\//, "")))) {
        missing.push(`${path.relative(root, file)} -> ${asset}`);
      }
    }
  }
}

const hashes = new Map();
for (const file of walk(publicDir)) {
  if (!imageExt.has(path.extname(file).toLowerCase())) continue;
  const hash = crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
  const list = hashes.get(hash) || [];
  list.push(path.relative(publicDir, file));
  hashes.set(hash, list);
}
const duplicates = [...hashes.values()].filter(list => list.length > 1);

console.log(`\n🖼️ مراجع الصور: ${refs}`);
console.log(`✅ ملفات الصور الفعلية: ${[...hashes.values()].reduce((n, list) => n + list.length, 0)}`);
if (missing.length) {
  console.error(`❌ مراجع صور مفقودة: ${missing.length}`);
  missing.forEach(item => console.error(`- ${item}`));
}
if (duplicates.length) {
  console.error(`❌ مجموعات صور متطابقة: ${duplicates.length}`);
  duplicates.forEach(list => console.error(`- ${list.join(" | ")}`));
}
if (missing.length || duplicates.length) process.exit(1);
console.log("✅ لا توجد مراجع صور مكسورة ولا صور متطابقة مكررة.\n");
