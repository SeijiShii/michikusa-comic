import { z } from "zod";
import { ComicStatus, PaymentKind, PaymentStatus, AiProvider, FeedbackKind, ReactionValue } from "./enums.js";

export const UserSchema = z.object({
  id: z.string().min(1),
  isGuest: z.boolean(),
  createdAt: z.string(),
});
export type User = z.infer<typeof UserSchema>;

export const PhotoSchema = z.object({
  id: z.string().uuid(),
  ownerId: z.string().min(1),
  r2Key: z.string().min(1),
  takenAt: z.string().optional(),
  lat: z.number().optional(),
  lng: z.number().optional(),
  area: z.string().optional(),
  caption: z.string().max(500).optional(),
  createdAt: z.string(),
});
export type Photo = z.infer<typeof PhotoSchema>;

export const ComicSchema = z.object({
  id: z.string().uuid(),
  ownerId: z.string().min(1),
  title: z.string().max(120).optional(),
  status: ComicStatus,
  area: z.string().optional(),
  sourcePhotoIds: z.array(z.string().uuid()),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type Comic = z.infer<typeof ComicSchema>;

export const BubbleSchema = z.object({
  x: z.number(), y: z.number(), w: z.number(), h: z.number(),
  tailDir: z.enum(["up", "down", "left", "right"]).optional(),
  text: z.string().max(200),
});
export const BubbleLayoutSchema = z.object({ bubbles: z.array(BubbleSchema) });
export type BubbleLayout = z.infer<typeof BubbleLayoutSchema>;

export const PanelSchema = z.object({
  id: z.string().uuid(),
  comicId: z.string().uuid(),
  order: z.number().int().min(1).max(4),
  imageR2Key: z.string().optional(),
  speech: z.string().max(200).optional(),
  bubbleLayout: BubbleLayoutSchema.optional(),
  stylePrompt: z.string().optional(),
});
export type Panel = z.infer<typeof PanelSchema>;

export const CollectionSchema = z.object({
  id: z.string().uuid(),
  ownerId: z.string().min(1),
  yearMonth: z.string().regex(/^\d{4}-\d{2}$/),
  comicIds: z.array(z.string().uuid()),
});
export type Collection = z.infer<typeof CollectionSchema>;

export const AiCostLogSchema = z.object({
  id: z.string().uuid(),
  ownerId: z.string().optional(),
  provider: AiProvider,
  metric: z.string(),
  quantity: z.number().nonnegative(),
  unitPriceVersion: z.string(),
  estimatedUsd: z.number().nullable(),
  createdAt: z.string(),
});
export type AiCostLog = z.infer<typeof AiCostLogSchema>;

export const PaymentSchema = z.object({
  id: z.string().uuid(),
  ownerId: z.string().min(1),
  kind: PaymentKind,
  status: PaymentStatus,
  amountJpy: z.number().int().positive(),
  comicId: z.string().uuid().optional(),
  stripeRef: z.string().min(1),
  createdAt: z.string(),
});
export type Payment = z.infer<typeof PaymentSchema>;

export const FeedbackSchema = z.object({
  id: z.string().uuid(),
  ownerId: z.string().optional(),
  kind: FeedbackKind,
  reaction: ReactionValue.optional(),
  body: z.string().max(2000).optional(),
  route: z.string().optional(),
  appVersion: z.string().optional(),
  ua: z.string().optional(),
  createdAt: z.string(),
});
export type Feedback = z.infer<typeof FeedbackSchema>;
