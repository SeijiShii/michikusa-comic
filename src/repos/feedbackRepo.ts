import { eq } from "drizzle-orm";
import { getDb } from "../db/client.js";
import { feedbacks } from "../db/schema.js";
import type { FeedbackDeps } from "../api-handlers/feedback.js";

export function feedbackDeps(genId: () => string): FeedbackDeps {
  return {
    genId,
    async insert(row) {
      await getDb().insert(feedbacks).values({ id: genId(), createdAt: new Date().toISOString() as any, ...row } as any);
    },
  };
}
