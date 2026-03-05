import dotenv from "dotenv";
import path from "path";

dotenv.config();

const required = (value: string | undefined, key: string) => {
  if (!value) {
    throw new Error(`Missing env var: ${key}`);
  }
  return value;
};

const requiredIf = (condition: boolean, value: string | undefined, key: string) => {
  if (!condition) return value ?? "";
  if (!value) {
    throw new Error(`Missing env var: ${key}`);
  }
  return value;
};

const firstDefined = (keys: string[], requiredKey: string) => {
  for (const key of keys) {
    const val = process.env[key];
    if (val && val.length) return val;
  }
  throw new Error(`Missing env var: ${requiredKey} (checked ${keys.join(", ")})`);
};

export const env = {
  port: Number(process.env.APP_PORT ?? process.env.PORT ?? 4000),
  mongoUri: required(process.env.MONGO_URI, "MONGO_URI"),
  redisUrl: required(process.env.REDIS_URL, "REDIS_URL"),
  jwtSecret: firstDefined(["JWT_SECRET", "JWT_ACCESS_SECRET"], "JWT_SECRET/JWT_ACCESS_SECRET"),
  jwtRefreshSecret: firstDefined(["JWT_REFRESH_SECRET"], "JWT_REFRESH_SECRET"),
  jwtAccessTtl: process.env.JWT_ACCESS_TTL || "15d",
  jwtRefreshTtl: process.env.JWT_REFRESH_TTL || "30d",
  adminUser: process.env.USER_NAME ?? "admin",
  adminPassword: process.env.PASSWORD ?? "admin",
  smtpHost: required(process.env.SMTP_HOST, "SMTP_HOST"),
  smtpPort: Number(process.env.SMTP_PORT ?? 587),
  smtpSecure: (process.env.SMTP_SECURE ?? "false") === "true",
  smtpUser: required(process.env.SMTP_USER, "SMTP_USER"),
  smtpPass: required(process.env.SMTP_PASS, "SMTP_PASS"),
  emailFrom: process.env.EMAIL_FROM ?? process.env.SMTP_FROM ?? process.env.SMTP_USER ?? "no-reply@example.com",
  userAccessTtl: process.env.USER_ACCESS_TTL || "30d",
  mediaBaseUrl: firstDefined(["MEDIA_BASE_URL", "BUNNY_PULL_BASE_URL"], "MEDIA_BASE_URL/BUNNY_PULL_BASE_URL"),
  mediaStoragePath: process.env.MEDIA_STORAGE_PATH ?? path.resolve(process.cwd(), "storage", "media"),
  mediaMaxSizeMb: Number(process.env.MEDIA_MAX_SIZE_MB ?? 10),
  mediaAllowedTypes: (process.env.MEDIA_ALLOWED_TYPES ?? "image/jpeg,image/png,image/webp,image/avif")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean),
  mediaWebpQuality: Number(process.env.MEDIA_WEBP_QUALITY ?? 82),
  mediaThumbWidth: Number(process.env.MEDIA_THUMB_WIDTH ?? 480),
  mediaThumbHeight: Number(process.env.MEDIA_THUMB_HEIGHT ?? 320),
  mediaKeepOriginal: (process.env.MEDIA_KEEP_ORIGINAL ?? "false") === "true",
  mediaDriver: (process.env.MEDIA_DRIVER ?? "local").toLowerCase() === "bunny" ? "bunny" : "local",
  bunnyStorageZone: requiredIf(
    (process.env.MEDIA_DRIVER ?? "local").toLowerCase() === "bunny",
    process.env.BUNNY_STORAGE_ZONE,
    "BUNNY_STORAGE_ZONE"
  ),
  bunnyStoragePassword: requiredIf(
    (process.env.MEDIA_DRIVER ?? "local").toLowerCase() === "bunny",
    process.env.BUNNY_STORAGE_PASSWORD,
    "BUNNY_STORAGE_PASSWORD"
  ),
  bunnyStorageRegion: process.env.BUNNY_STORAGE_REGION ?? "",
  bunnyPullBaseUrl: process.env.BUNNY_PULL_BASE_URL ?? process.env.MEDIA_BASE_URL ?? "",
};
