import { sessionFromReq, makeOwnerResolver } from "../_session.js";
import { GenerateComicInput } from "../../src/types/index.js";
import { buildComicPlan } from "../../src/services/ai/plan.js";

// POST /api/compose/generate — 4コマ生成 (Vision→plan→Gemini, withOwner+rate limit SEC-003)
export default async function handler(req: any, res: any) {
  if (req.method !== "POST") return res.status(405).json({ error: "method" });
  let ownerId;
  try { ownerId = await makeOwnerResolver(sessionFromReq(req)).requireOwner(); }
  catch { return res.status(401).json({ error: "認証が必要です" }); }
  const parsed = GenerateComicInput.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "入力が正しくありません" });
  // TODO(release): understandPhoto(Vision) → generatePanelImages(Gemini) → R2保存 → db
  //   + cost-tracking 積算 + rate limit。実キーで検証。
  const plan = buildComicPlan({ subjects: [], situation: "" }, parsed.data.caption);
  return res.status(202).json({ status: "planned", plan, ownerId });
}
