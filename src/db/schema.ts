import { pgTable, text, integer, boolean, doublePrecision, timestamp, jsonb, uniqueIndex, index } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  isGuest: boolean("is_guest").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const photos = pgTable("photos", {
  id: text("id").primaryKey(),
  ownerId: text("owner_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  r2Key: text("r2_key").notNull(),
  takenAt: timestamp("taken_at", { withTimezone: true }),
  lat: doublePrecision("lat"),
  lng: doublePrecision("lng"),
  area: text("area"),
  caption: text("caption"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (t) => ({ ownerCreated: index("photos_owner_created").on(t.ownerId, t.createdAt) }));

export const comics = pgTable("comics", {
  id: text("id").primaryKey(),
  ownerId: text("owner_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  title: text("title"),
  status: text("status").notNull().default("draft"),
  area: text("area"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (t) => ({ ownerCreated: index("comics_owner_created").on(t.ownerId, t.createdAt) }));

export const panels = pgTable("panels", {
  id: text("id").primaryKey(),
  comicId: text("comic_id").notNull().references(() => comics.id, { onDelete: "cascade" }),
  order: integer("order").notNull(),
  imageR2Key: text("image_r2_key"),
  speech: text("speech"),
  bubbleLayout: jsonb("bubble_layout"),
  stylePrompt: text("style_prompt"),
}, (t) => ({ comicOrder: uniqueIndex("panels_comic_order").on(t.comicId, t.order) }));

export const aiCostLogs = pgTable("ai_cost_logs", {
  id: text("id").primaryKey(),
  ownerId: text("owner_id"),
  provider: text("provider").notNull(),
  metric: text("metric").notNull(),
  quantity: doublePrecision("quantity").notNull(),
  unitPriceVersion: text("unit_price_version").notNull(),
  estimatedUsd: doublePrecision("estimated_usd"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (t) => ({ created: index("ai_cost_created").on(t.createdAt) }));

export const payments = pgTable("payments", {
  id: text("id").primaryKey(),
  ownerId: text("owner_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  kind: text("kind").notNull(),
  status: text("status").notNull(),
  amountJpy: integer("amount_jpy").notNull(),
  comicId: text("comic_id"),
  stripeRef: text("stripe_ref").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (t) => ({ stripeUniq: uniqueIndex("payments_stripe_ref").on(t.stripeRef) }));

export const feedbacks = pgTable("feedbacks", {
  id: text("id").primaryKey(),
  ownerId: text("owner_id"),
  kind: text("kind").notNull(),
  reaction: text("reaction"),
  body: text("body"),
  route: text("route"),
  appVersion: text("app_version"),
  ua: text("ua"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});
