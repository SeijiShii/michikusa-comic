import { S3Client, DeleteObjectsCommand, ListObjectsV2Command, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import type { OwnerId } from "../../types/index.js";

let _client: S3Client | null = null;
function client(): S3Client {
  if (_client) return _client;
  const acc = process.env.R2_ACCOUNT_ID, id = process.env.R2_ACCESS_KEY_ID, sec = process.env.R2_SECRET_ACCESS_KEY;
  if (!acc || !id || !sec) throw new Error("R2_* 未設定 (release で FILL)");
  _client = new S3Client({
    region: "auto",
    endpoint: `https://${acc}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId: id, secretAccessKey: sec },
  });
  return _client;
}
const BUCKET = () => process.env.R2_BUCKET || "michikusa-photos";

export async function presignPut(key: string, expiresIn = 600): Promise<string> {
  return getSignedUrl(client(), new PutObjectCommand({ Bucket: BUCKET(), Key: key }), { expiresIn });
}
// DSR: 所有者の全オブジェクト purge (ページネーション、SEC-001)
export async function purgeOwnerObjects(ownerId: OwnerId): Promise<void> {
  const c = client(), Bucket = BUCKET();
  for (const prefix of [`photos/${ownerId}/`, `panels/${ownerId}/`, `exports/${ownerId}/`]) {
    let token: string | undefined;
    do {
      const list = await c.send(new ListObjectsV2Command({ Bucket, Prefix: prefix, ContinuationToken: token }));
      const objs = (list.Contents ?? []).map((o) => ({ Key: o.Key! }));
      if (objs.length) await c.send(new DeleteObjectsCommand({ Bucket, Delete: { Objects: objs } }));
      token = list.IsTruncated ? list.NextContinuationToken : undefined;
    } while (token);
  }
}
