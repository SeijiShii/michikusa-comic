import { SubmitFeedbackInput, type Feedback } from "../types/index.js";
import { scrubPII } from "../lib/privacy.js";

export interface FeedbackDeps {
  insert(row: Omit<Feedback, "id" | "createdAt">): Promise<void>;
  genId(): string;
}

// フィードバック受信 — 入力検証(SEC-005) + 受信時 scrub 再確認(SEC-002)
export async function handleSubmitFeedback(
  deps: FeedbackDeps, ownerId: string | undefined, raw: unknown,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const parsed = SubmitFeedbackInput.safeParse(raw);
  if (!parsed.success) return { ok: false, error: "入力が正しくありません" };
  const d = parsed.data;
  await deps.insert({
    ownerId,
    kind: d.kind,
    reaction: d.reaction,
    body: d.body ? scrubPII(d.body) : undefined, // 受信時も scrub (二重防御, SEC-002)
    route: d.route,
  });
  return { ok: true };
}
