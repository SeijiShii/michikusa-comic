// Build Output API ビルダー: vite build (static) + api/* を esbuild bundle (.func) → .vercel/output
// O51 (拡張子なし/alias import 罠回避: 全 inline) / CF-013 / §3.1c 関数数ガード
import { execSync } from "node:child_process";
import { mkdirSync, cpSync, writeFileSync, rmSync, readdirSync, statSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";
import { build } from "esbuild";

const MAX_FUNCTIONS = Number(process.env.MAX_FUNCTIONS || 12);
const out = ".vercel/output";
const RAW_BODY_ROUTES = new Set(["stripe-webhook", "webhook"]); // 生body必須 (署名検証)

console.log("→ vite build (static)");
execSync("npx vite build", { stdio: "inherit" });
rmSync(out, { recursive: true, force: true });
mkdirSync(`${out}/static`, { recursive: true });
cpSync("dist", `${out}/static`, { recursive: true });

// api/*.ts を再帰列挙
function findApi(dir, base = dir) {
  const r = [];
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) r.push(...findApi(p, base));
    else if (/\.(ts|js|mjs)$/.test(e) && !e.startsWith("_")) r.push(relative(base, p).replace(/\.(ts|js|mjs)$/, ""));
  }
  return r;
}
let funcs = [];
try { funcs = findApi("api"); } catch { funcs = []; }

console.log(`→ api 関数: ${funcs.length} 個`);
if (funcs.length > MAX_FUNCTIONS) {
  console.error(`❌ 関数数 ${funcs.length} > 上限 ${MAX_FUNCTIONS} (Hobby)。統合 or プラン変更。`);
  process.exit(1);
}

const routes = [];
for (const rel of funcs) {
  const fdir = `${out}/functions/${rel}.func`;
  mkdirSync(fdir, { recursive: true });
  await build({
    entryPoints: [`api/${rel}.ts`],
    bundle: true, platform: "node", target: "node20", format: "esm",
    outfile: `${fdir}/index.mjs`,
    tsconfig: "tsconfig.json",
  });
  const rawBody = RAW_BODY_ROUTES.has(rel.split("/").pop());
  writeFileSync(`${fdir}/.vc-config.json`, JSON.stringify({
    runtime: "nodejs20.x", handler: "index.mjs", launcherType: "Nodejs",
    shouldAddHelpers: !rawBody,
  }, null, 2));
  routes.push({ src: `/api/${rel}`, dest: `/api/${rel}` });
}

writeFileSync(`${out}/config.json`, JSON.stringify({
  version: 3,
  routes: [...routes, { handle: "filesystem" }, { src: "/(.*)", dest: "/index.html" }],
}, null, 2));
console.log(`✅ Build Output 完了 (static + ${funcs.length} functions)`);
