// Build Output API ビルダー: vite build (static) → .vercel/output (O51/CF-013, --prebuilt 用)
// api/* (Vercel Functions) 追加時は esbuild bundle + .func + functions routes を拡張。
import { execSync } from "node:child_process";
import { mkdirSync, cpSync, writeFileSync, rmSync } from "node:fs";
console.log("→ vite build");
execSync("npx vite build", { stdio: "inherit" });
const out = ".vercel/output";
rmSync(out, { recursive: true, force: true });
mkdirSync(`${out}/static`, { recursive: true });
cpSync("dist", `${out}/static`, { recursive: true });
writeFileSync(`${out}/config.json`, JSON.stringify({
  version: 3,
  routes: [{ handle: "filesystem" }, { src: "/(.*)", dest: "/index.html" }],
}, null, 2));
console.log("✅ Build Output 生成完了 (.vercel/output)");
