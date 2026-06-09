import { MAX_PHOTOS_PER_COMIC } from "../types/index.js";

const ALLOWED_MIME = new Set(["image/jpeg", "image/png", "image/webp", "image/heic"]);
const MAX_BYTES = 15 * 1024 * 1024; // 15MB

export interface FileLike { type: string; size: number; }
export interface ValidateResult { ok: boolean; error?: string; }

export function validateImageFile(file: FileLike): ValidateResult {
  if (!ALLOWED_MIME.has(file.type)) return { ok: false, error: "対応していない画像形式です" };
  if (file.size <= 0) return { ok: false, error: "ファイルが空です" };
  if (file.size > MAX_BYTES) return { ok: false, error: "画像サイズが大きすぎます（15MBまで）" };
  return { ok: true };
}

export function validatePhotoCount(n: number): ValidateResult {
  if (n < 1) return { ok: false, error: "写真を1枚以上えらんでください" };
  if (n > MAX_PHOTOS_PER_COMIC) return { ok: false, error: `写真は${MAX_PHOTOS_PER_COMIC}枚までです` };
  return { ok: true };
}
