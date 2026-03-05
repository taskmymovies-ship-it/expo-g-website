import { Worker } from "bullmq";
import fs from "fs/promises";
import path from "path";
import { ObjectId } from "mongodb";
import { mediaDeleteQueue } from "../queues";
import { getRedis } from "../../db/redis";
import { getDb } from "../../db/mongo";
import { env } from "../../config/env";

const buildBunnyStorageHost = () => {
  const region = (env.bunnyStorageRegion || "").trim();
  return region ? `${region}.storage.bunnycdn.com` : "storage.bunnycdn.com";
};

const encodePathSegments = (value: string) =>
  value
    .split("/")
    .filter(Boolean)
    .map((segment) => encodeURIComponent(segment))
    .join("/");

const extractObjectKey = (value: string) => {
  if (!value) return "";
  if (value.startsWith("bunny://")) {
    return value.replace("bunny://", "").replace(/^\/+/, "");
  }
  if (value.startsWith("http://") || value.startsWith("https://")) {
    try {
      const url = new URL(value);
      return decodeURIComponent(url.pathname.replace(/^\/+/, ""));
    } catch {
      return "";
    }
  }
  return value.replace(/^\/+/, "");
};

const deleteFromBunny = async (objectKey: string) => {
  const zone = (env.bunnyStorageZone || "").trim();
  const password = (env.bunnyStoragePassword || "").trim();
  if (!zone || !password) {
    throw new Error("Bunny storage is not configured");
  }
  const host = buildBunnyStorageHost();
  const encodedZone = encodeURIComponent(zone);
  const encodedKey = encodePathSegments(objectKey);
  const url = `https://${host}/${encodedZone}/${encodedKey}`;
  const res = await fetch(url, {
    method: "DELETE",
    headers: { AccessKey: password },
  });
  if (!res.ok && res.status !== 404) {
    const text = await res.text().catch(() => "");
    throw new Error(`Bunny delete failed (${res.status}): ${text || res.statusText}`);
  }
};

export const mediaDeleteWorker = new Worker(
  mediaDeleteQueue.name,
  async (job) => {
    const { id, paths, driver } = job.data as { id?: string; paths: string[]; driver?: "local" | "bunny" };
    for (const filePath of paths ?? []) {
      const isUrl = filePath.startsWith("http://") || filePath.startsWith("https://") || filePath.startsWith("bunny://");
      const useBunny = driver === "bunny" && (isUrl || !path.isAbsolute(filePath));
      if (useBunny) {
        const key = extractObjectKey(filePath);
        if (!key) continue;
        try {
          await deleteFromBunny(key);
          job.log(`Deleted Bunny media object ${key}`);
        } catch (err: any) {
          throw err;
        }
      } else {
        const absolutePath = path.isAbsolute(filePath)
          ? filePath
          : path.resolve(env.mediaStoragePath, filePath);
        try {
          await fs.unlink(absolutePath);
          job.log(`Deleted media file ${absolutePath}`);
        } catch (err: any) {
          if (err && err.code === "ENOENT") {
            job.log(`Media file not found during delete: ${absolutePath}`);
            continue;
          }
          throw err;
        }
      }
    }

    if (id && ObjectId.isValid(id)) {
      const db = await getDb();
      await db.collection("media").updateOne({ _id: new ObjectId(id) }, { $set: { status: "deleted", deletedAt: new Date() } });
      job.log(`Media ${id} marked deleted`);
    }
  },
  { connection: getRedis() }
);
