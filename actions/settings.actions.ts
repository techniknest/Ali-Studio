"use server";

import { requireAuth } from "@/lib/auth-helpers";
import { connectDB } from "@/lib/mongodb";
import Settings, { defaultSettings, type ISettings } from "@/models/Settings";
import { settingsSchema } from "@/lib/validators/content";
import { revalidatePath } from "next/cache";

export async function getSettings(): Promise<ISettings | null> {
  try {
    await connectDB();
    let settings = await Settings.findOne().lean();
    if (!settings) {
      const created = await Settings.create(defaultSettings);
      settings = created.toObject();
    }
    return JSON.parse(JSON.stringify(settings)) as ISettings;
  } catch {
    return null;
  }
}

export async function updateSettings(data: Partial<ISettings>) {
  await requireAuth();
  const parsed = settingsSchema.partial().safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0]?.message };
  }

  await connectDB();
  await Settings.findOneAndUpdate({}, parsed.data, {
    upsert: true,
    new: true,
  });

  revalidatePath("/", "layout");
  return { success: true };
}
