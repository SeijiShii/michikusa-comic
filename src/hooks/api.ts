// API fetch helper — UI から api/* Vercel Function を叩く (end-to-end 配線)
async function post(path: string, body: unknown): Promise<Response> {
  return fetch(path, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
}
export async function submitFeedback(payload: unknown): Promise<boolean> {
  const r = await post("/api/feedback", payload);
  return r.ok;
}
export async function deleteAllData(): Promise<boolean> {
  const r = await post("/api/account/delete", {});
  return r.ok;
}
export async function presignPhoto(ext: string): Promise<{ uploadUrl: string; key: string }> {
  const r = await post("/api/photos/presign", { ext });
  if (!r.ok) throw new Error("presign 失敗");
  return r.json();
}
export async function generateComic(photoIds: string[], caption?: string): Promise<unknown> {
  const r = await post("/api/compose/generate", { photoIds, caption });
  return r.json();
}
