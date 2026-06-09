import { sessionFromReq, makeOwnerResolver } from "./_session.js";
import { handleSubmitFeedback } from "../src/api-handlers/feedback.js";
import { feedbackDeps } from "../src/repos/feedbackRepo.js";

// Vercel Node Function: POST /api/feedback
export default async function handler(req: any, res: any) {
  if (req.method !== "POST") return res.status(405).json({ error: "method" });
  const owner = await makeOwnerResolver(sessionFromReq(req)).getOwnerId(); // ゲスト可
  const result = await handleSubmitFeedback(feedbackDeps(() => crypto.randomUUID()), owner ?? undefined, req.body);
  return res.status(result.ok ? 200 : 400).json(result);
}
