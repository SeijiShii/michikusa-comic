import { describe, it, expect, beforeEach } from "vitest";
import { PGlite } from "@electric-sql/pglite";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ddl = readFileSync(join(dirname(fileURLToPath(import.meta.url)), "schema.sql"), "utf8");

describe("db schema (Postgres, pglite)", () => {
  let db: PGlite;
  beforeEach(async () => {
    db = new PGlite();
    await db.exec(ddl);
    await db.exec(`INSERT INTO users(id) VALUES ('u1'),('u2');`);
  });
  it("N-3 cascade: owner 削除で全データ消える (DSR/SEC-001)", async () => {
    await db.exec(`INSERT INTO comics(id,owner_id,status) VALUES ('c1','u1','saved');`);
    await db.exec(`INSERT INTO panels(id,comic_id,"order") VALUES ('p1','c1',1);`);
    await db.exec(`INSERT INTO photos(id,owner_id,r2_key) VALUES ('ph1','u1','k');`);
    await db.exec(`DELETE FROM users WHERE id='u1';`);
    const c = await db.query(`SELECT count(*)::int n FROM comics WHERE owner_id='u1'`);
    const p = await db.query(`SELECT count(*)::int n FROM panels WHERE comic_id='c1'`);
    const ph = await db.query(`SELECT count(*)::int n FROM photos WHERE owner_id='u1'`);
    expect((c.rows[0] as any).n).toBe(0);
    expect((p.rows[0] as any).n).toBe(0);
    expect((ph.rows[0] as any).n).toBe(0);
  });
  it("N: comic 削除で panel cascade", async () => {
    await db.exec(`INSERT INTO comics(id,owner_id,status) VALUES ('c2','u2','draft');`);
    await db.exec(`INSERT INTO panels(id,comic_id,"order") VALUES ('p2','c2',1);`);
    await db.exec(`DELETE FROM comics WHERE id='c2';`);
    const r = await db.query(`SELECT count(*)::int n FROM panels WHERE comic_id='c2'`);
    expect((r.rows[0] as any).n).toBe(0);
  });
  it("E-1 uniq(comic_id, order) 違反", async () => {
    await db.exec(`INSERT INTO comics(id,owner_id,status) VALUES ('c3','u1','draft');`);
    await db.exec(`INSERT INTO panels(id,comic_id,"order") VALUES ('p3','c3',1);`);
    await expect(db.exec(`INSERT INTO panels(id,comic_id,"order") VALUES ('p4','c3',1);`)).rejects.toThrow();
  });
  it("E-2 uniq(stripe_ref) 違反", async () => {
    await db.exec(`INSERT INTO payments(id,owner_id,kind,status,amount_jpy,stripe_ref) VALUES ('pay1','u1','tip','paid',100,'ref1');`);
    await expect(db.exec(`INSERT INTO payments(id,owner_id,kind,status,amount_jpy,stripe_ref) VALUES ('pay2','u1','tip','paid',100,'ref1');`)).rejects.toThrow();
  });
  it("E-3 FK: 親不在 panel", async () => {
    await expect(db.exec(`INSERT INTO panels(id,comic_id,"order") VALUES ('px','nope',1);`)).rejects.toThrow();
  });
});
