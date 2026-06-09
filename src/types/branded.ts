import { z } from "zod";

// branded string types — 取り違え防止 (OwnerId は Clerk user id, ゲスト/認証共通)
export const OwnerId = z.string().min(1).brand<"OwnerId">();
export type OwnerId = z.infer<typeof OwnerId>;
export const mkOwnerId = (s: string): OwnerId => OwnerId.parse(s);

export const Iso8601 = z.string().datetime().brand<"Iso8601">();
export type Iso8601 = z.infer<typeof Iso8601>;
export const mkIso8601 = (s: string): Iso8601 => Iso8601.parse(s);
