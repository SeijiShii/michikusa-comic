import { describe, it, expect, vi } from "vitest";
import { handleDeleteAllData, PurgeError, type AccountDeps } from "./account.js";
import { mkOwnerId } from "../types/index.js";

describe("handleDeleteAllData (SEC-001 DSR)", () => {
  it("N: db cascade + R2 purge 両方を呼んで削除", async () => {
    const deps: AccountDeps = { deleteOwnerRows: vi.fn(async () => {}), purgeOwnerObjects: vi.fn(async () => {}) };
    const r = await handleDeleteAllData(deps, mkOwnerId("u1"));
    expect(r.ok).toBe(true);
    expect(deps.deleteOwnerRows).toHaveBeenCalledWith("u1");
    expect(deps.purgeOwnerObjects).toHaveBeenCalledWith("u1");
  });
  it("E: db 失敗→PurgeError(db), storage は呼ばない", async () => {
    const deps: AccountDeps = { deleteOwnerRows: vi.fn(async () => { throw new Error("x"); }), purgeOwnerObjects: vi.fn(async () => {}) };
    await expect(handleDeleteAllData(deps, mkOwnerId("u1"))).rejects.toMatchObject({ stage: "db" });
    expect(deps.purgeOwnerObjects).not.toHaveBeenCalled();
  });
  it("E: storage 失敗→PurgeError(storage)", async () => {
    const deps: AccountDeps = { deleteOwnerRows: vi.fn(async () => {}), purgeOwnerObjects: vi.fn(async () => { throw new Error("x"); }) };
    await expect(handleDeleteAllData(deps, mkOwnerId("u1"))).rejects.toBeInstanceOf(PurgeError);
  });
});
