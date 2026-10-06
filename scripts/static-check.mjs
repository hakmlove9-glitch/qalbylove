import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const dirs = ["app", "components", "lib", "hooks", "services", "types"];
const sourceExt = new Set([".ts", ".tsx", ".js", ".jsx"]);
const importPattern = /(?:from\s+|import\s*\()\s*["']([^"']+)["']/g;

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
}

function resolves(base) {
  const choices = [
    base, `${base}.ts`, `${base}.tsx`, `${base}.js`, `${base}.jsx`,
    path.join(base, "index.ts"), path.join(base, "index.tsx"), path.join(base, "index.js"), path.join(base, "index.jsx"),
  ];
  return choices.some(file => fs.existsSync(file));
}

const missing = [];
for (const dir of dirs) {
  for (const file of walk(path.join(root, dir))) {
    if (!sourceExt.has(path.extname(file))) continue;
    const source = fs.readFileSync(file, "utf8");
    for (const match of source.matchAll(importPattern)) {
      const spec = match[1];
      let base;
      if (spec.startsWith("@/")) base = path.join(root, spec.slice(2));
      else if (spec.startsWith(".")) base = path.resolve(path.dirname(file), spec);
      else continue;
      if (!resolves(base)) missing.push(`${path.relative(root, file)} -> ${spec}`);
    }
  }
}

if (missing.length) {
  console.error(`\n❌ Imports داخلية مكسورة: ${missing.length}`);
  missing.forEach(item => console.error(`- ${item}`));
  process.exit(1);
}
console.log("\n✅ كل الـimports الداخلية تشير إلى ملفات موجودة.\n");
