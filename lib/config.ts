import mongoose from "mongoose";
import ConfigModel from "@/models/Config";
import { decrypt } from "@/lib/encryption";

export type ConfigKey =
  | "MONGODB_URI"
  | "CLOUDINARY_CLOUD_NAME"
  | "CLOUDINARY_API_KEY"
  | "CLOUDINARY_API_SECRET"
  | "RESEND_API_KEY"
  | "RESEND_FROM_EMAIL"
  | "SMTP_USER"
  | "SMTP_PASS";

const ENV_MAP: Record<ConfigKey, string | undefined> = {
  MONGODB_URI: process.env.MONGODB_URI,
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
  RESEND_API_KEY: process.env.RESEND_API_KEY,
  RESEND_FROM_EMAIL: process.env.RESEND_FROM_EMAIL,
  SMTP_USER: process.env.SMTP_USER,
  SMTP_PASS: process.env.SMTP_PASS,
};

let memoryCache: Map<string, string> | null = null;

async function ensureDbConnectionForConfig(): Promise<boolean> {
  const uri = ENV_MAP.MONGODB_URI ?? process.env.MONGODB_URI;
  if (!uri) return false;
  if (mongoose.connection.readyState === 1) return true;
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    return true;
  } catch {
    return false;
  }
}

async function loadFromDb(): Promise<Map<string, string>> {
  const cache = new Map<string, string>();
  const connected = await ensureDbConnectionForConfig();
  if (!connected) return cache;
  try {
    const docs = await ConfigModel.find().lean();
    for (const doc of docs) {
      try {
        cache.set(doc.key, decrypt(doc.value));
      } catch {
        // skip invalid entries
      }
    }
  } catch {
    // DB not ready
  }
  return cache;
}

export async function getConfig(key: ConfigKey): Promise<string | undefined> {
  if (!memoryCache) {
    memoryCache = await loadFromDb();
  }
  const fromDb = memoryCache.get(key);
  if (fromDb) return fromDb;
  return ENV_MAP[key];
}

export async function getConfigRequired(key: ConfigKey): Promise<string> {
  const value = await getConfig(key);
  if (!value) throw new Error(`Configuration missing: ${key}`);
  return value;
}

export function clearConfigCache(): void {
  memoryCache = null;
}

export async function refreshConfigCache(): Promise<void> {
  memoryCache = await loadFromDb();
}

export async function isConfigComplete(): Promise<boolean> {
  const uri = await getConfig("MONGODB_URI");
  const cloud = await getConfig("CLOUDINARY_CLOUD_NAME");
  const cloudKey = await getConfig("CLOUDINARY_API_KEY");
  const cloudSecret = await getConfig("CLOUDINARY_API_SECRET");
  return Boolean(uri && cloud && cloudKey && cloudSecret);
}

export async function getMaskedConfigs(): Promise<
  Record<string, { masked: string; hasValue: boolean }>
> {
  const keys: ConfigKey[] = [
    "MONGODB_URI",
    "CLOUDINARY_CLOUD_NAME",
    "CLOUDINARY_API_KEY",
    "CLOUDINARY_API_SECRET",
    "RESEND_API_KEY",
    "RESEND_FROM_EMAIL",
    "SMTP_USER",
    "SMTP_PASS",
  ];
  const result: Record<string, { masked: string; hasValue: boolean }> = {};
  for (const key of keys) {
    const value = await getConfig(key);
    if (!value) {
      result[key] = { masked: "Not configured", hasValue: false };
    } else {
      const { maskSecret } = await import("@/lib/utils");
      result[key] = { masked: maskSecret(value), hasValue: true };
    }
  }
  return result;
}
