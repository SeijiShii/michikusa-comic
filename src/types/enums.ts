import { z } from "zod";

export const ComicStatus = z.enum(["draft", "saved"]);
export type ComicStatus = z.infer<typeof ComicStatus>;

export const PaymentKind = z.enum(["tip", "highres_export"]);
export type PaymentKind = z.infer<typeof PaymentKind>;

export const PaymentStatus = z.enum(["pending", "paid", "failed", "refunded"]);
export type PaymentStatus = z.infer<typeof PaymentStatus>;

export const AiProvider = z.enum(["openai_vision", "gemini_image"]);
export type AiProvider = z.infer<typeof AiProvider>;

export const FeedbackKind = z.enum(["reaction", "bug_report"]);
export type FeedbackKind = z.infer<typeof FeedbackKind>;

export const ReactionValue = z.enum(["like", "dislike"]);
export type ReactionValue = z.infer<typeof ReactionValue>;
