import { sessionFromReq, makeOwnerResolver } from "../_session.js";
import { handleDeleteAllData, PurgeError } from "../../src/api-handlers/account.js";
import { accountDeps } from "../../src/repos/accountRepo.js";

// Vercel Node Function: POST /api/account/delete (DSR セルフ削除, withOwner)
export default async function handler(req: any, res: any) {
  if (req.method !== "POST") return res.status(405).json({ error: "method" });
  let ownerId;
  try { ownerId = await makeOwnerResolver(sessionFromReq(req)).requireOwner(); }
  catch { return res.status(401).json({ error: "認証が必要です" }); }
  try {
    const r = await handleDeleteAllData(accountDeps, ownerId);
    return res.status(200).json(r);
  } catch (e) {
    if (e instanceof PurgeError) return res.status(500).json({ error: e.message, stage: e.stage });
    throw e;
  }
}
