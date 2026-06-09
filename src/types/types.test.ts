import { describe, it, expect } from "vitest";
import {
  ComicSchema, PhotoSchema, PanelSchema, PaymentSchema,
  CreatePhotoInput, GenerateComicInput, CreatePaymentInput, SubmitFeedbackInput,
  mkOwnerId, MAX_PHOTOS_PER_COMIC,
} from "./index.js";

const iso = "2026-06-09T10:00:00.000Z";
const uuid = "11111111-1111-4111-8111-111111111111";

describe("entities (正常系)", () => {
  it("N-1 ComicSchema.parse 有効", () => {
    const c = ComicSchema.parse({
      id: uuid, ownerId: "u1", status: "draft", sourcePhotoIds: [uuid],
      createdAt: iso, updatedAt: iso,
    });
    expect(c.status).toBe("draft");
  });
  it("N-2 PhotoSchema 位置あり/なし", () => {
    expect(PhotoSchema.parse({ id: uuid, ownerId: "u1", r2Key: "k", createdAt: iso }).lat).toBeUndefined();
    expect(PhotoSchema.parse({ id: uuid, ownerId: "u1", r2Key: "k", lat: 35.6, lng: 139.7, createdAt: iso }).lat).toBe(35.6);
  });
  it("N-3 PanelSchema order 1..4", () => {
    for (const o of [1, 2, 3, 4]) expect(PanelSchema.parse({ id: uuid, comicId: uuid, order: o }).order).toBe(o);
  });
  it("N-4 mkOwnerId branded", () => {
    expect(mkOwnerId("u1")).toBe("u1");
    expect(() => mkOwnerId("")).toThrow();
  });
});

describe("異常系", () => {
  it("E-1 Panel order 0/5 NG", () => {
    expect(PanelSchema.safeParse({ id: uuid, comicId: uuid, order: 0 }).success).toBe(false);
    expect(PanelSchema.safeParse({ id: uuid, comicId: uuid, order: 5 }).success).toBe(false);
  });
  it("E-2 Payment status 不正", () => {
    expect(PaymentSchema.safeParse({ id: uuid, ownerId: "u1", kind: "tip", status: "x", amountJpy: 100, stripeRef: "r", createdAt: iso }).success).toBe(false);
  });
  it("E-3 CreatePaymentInput 負/範囲外", () => {
    expect(CreatePaymentInput.safeParse({ kind: "tip", amountJpy: -1 }).success).toBe(false);
    expect(CreatePaymentInput.safeParse({ kind: "tip", amountJpy: 50 }).success).toBe(false);
  });
  it("E-4 SubmitFeedbackInput body 長超過", () => {
    expect(SubmitFeedbackInput.safeParse({ kind: "bug_report", body: "x".repeat(2001) }).success).toBe(false);
  });
  it("E-5 GenerateComicInput photoIds 空", () => {
    expect(GenerateComicInput.safeParse({ photoIds: [] }).success).toBe(false);
  });
});

describe("境界値", () => {
  it("B-1 CreatePhotoInput サイズ(枚数)上限/+1", () => {
    const keys = Array.from({ length: MAX_PHOTOS_PER_COMIC }, (_, i) => `k${i}`);
    expect(CreatePhotoInput.safeParse({ keys }).success).toBe(true);
    expect(CreatePhotoInput.safeParse({ keys: [...keys, "kX"] }).success).toBe(false);
  });
  it("B-2 caption 最大長/+1", () => {
    expect(CreatePhotoInput.safeParse({ keys: ["k"], caption: "x".repeat(500) }).success).toBe(true);
    expect(CreatePhotoInput.safeParse({ keys: ["k"], caption: "x".repeat(501) }).success).toBe(false);
  });
  it("B-3 GenerateComicInput photoIds 1/N/N+1", () => {
    const ids = Array.from({ length: MAX_PHOTOS_PER_COMIC }, () => uuid);
    expect(GenerateComicInput.safeParse({ photoIds: [uuid] }).success).toBe(true);
    expect(GenerateComicInput.safeParse({ photoIds: ids }).success).toBe(true);
    expect(GenerateComicInput.safeParse({ photoIds: [...ids, uuid] }).success).toBe(false);
  });
  it("B-4 Unicode caption", () => {
    expect(CreatePhotoInput.safeParse({ keys: ["k"], caption: "🐈‍⬛猫と散歩" }).success).toBe(true);
  });
});
