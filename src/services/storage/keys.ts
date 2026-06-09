// R2 オブジェクトキー設計 — ownerId を必ず含め、所有権境界をパスで表現 (SEC-004)
import type { OwnerId } from "../../types/index.js";

export function photoKey(ownerId: OwnerId | string, uuid: string, ext: string): string {
  return `photos/${ownerId}/${uuid}.${ext.replace(/^\./, "")}`;
}
export function panelKey(ownerId: OwnerId | string, comicId: string, order: number): string {
  return `panels/${ownerId}/${comicId}/${order}.png`;
}
export function exportKey(ownerId: OwnerId | string, comicId: string, quality: "preview" | "high"): string {
  return `exports/${ownerId}/${comicId}/${quality}.png`;
}
export function ownerPrefix(ownerId: OwnerId | string): string {
  return `${ownerId}/`; // purgeOwner 用ではないが境界判定の基準
}
// 鍵が指定 owner の配下か (他人キーの署名URL発行を防ぐ、SEC-004)
export function isOwnerKey(key: string, ownerId: OwnerId | string): boolean {
  const m = key.match(/^(photos|panels|exports)\/([^/]+)\//);
  return m != null && m[2] === String(ownerId);
}
