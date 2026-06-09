import { z } from "zod";
import { PaymentKind, FeedbackKind, ReactionValue } from "./enums.js";

export const MAX_PHOTOS_PER_COMIC = 4;

export const CreatePhotoInput = z.object({
  keys: z.array(z.string().min(1)).min(1).max(MAX_PHOTOS_PER_COMIC),
  caption: z.string().max(500).optional(),
});
export type CreatePhotoInput = z.infer<typeof CreatePhotoInput>;

export const GenerateComicInput = z.object({
  photoIds: z.array(z.string().uuid()).min(1).max(MAX_PHOTOS_PER_COMIC),
  caption: z.string().max(500).optional(),
});
export type GenerateComicInput = z.infer<typeof GenerateComicInput>;

export const UpdatePanelInput = z.object({
  speech: z.string().max(200).optional(),
});
export type UpdatePanelInput = z.infer<typeof UpdatePanelInput>;

export const CreatePaymentInput = z.object({
  kind: PaymentKind,
  amountJpy: z.number().int().min(100).max(100000),
  comicId: z.string().uuid().optional(),
});
export type CreatePaymentInput = z.infer<typeof CreatePaymentInput>;

export const SubmitFeedbackInput = z.object({
  kind: FeedbackKind,
  reaction: ReactionValue.optional(),
  body: z.string().max(2000).optional(),
  route: z.string().optional(),
});
export type SubmitFeedbackInput = z.infer<typeof SubmitFeedbackInput>;
