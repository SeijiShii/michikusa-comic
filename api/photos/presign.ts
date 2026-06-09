import { sessionFromReq, makeOwnerResolver } from "../_session.js";
import { presignPut } from "../../src/services/storage/r2.js";
import { photoKey } from "../../src/services/storage/keys.js";

// POST /api/photos/presign — 所有者キーの署名URL発行 (SEC-004)
export default async function handler(req: any, res: any) {
  if (req.method !== "POST") return res.status(405).json({ error: "method" });
  let ownerId;
  try { ownerId = await makeOwnerResolver(sessionFromReq(req)).requireOwner(); }
  catch { return res.status(401).json({ error: "認証が必要です" }); }
  const ext = (req.body?.ext as string) || "jpg";
  const key = photoKey(ownerId, crypto.randomUUID(), ext);
  const url = await presignPut(key);
  return res.status(200).json({ uploadUrl: url, key });
}
