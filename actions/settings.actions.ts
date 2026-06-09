"use server";

import { requireAuth } from "@/lib/auth-helpers";
import { settingsService } from "@/services/settings.service";
import { ActionResponse, successResponse, errorResponse } from "@/lib/types/action-response";
import { settingsSchema } from "@/lib/validators/content";
import { revalidatePath } from "next/cache";

export async function getSettings() {
  try {
    return await settingsService.getSettings();
  } catch (err) {
    console.error("Failed to fetch settings:", err);
    return null;
  }
}

export async function updateSettings(data: unknown): Promise<ActionResponse> {
  try {
    await requireAuth();
    const parsed = settingsSchema.partial().safeParse(data);
    if (!parsed.success) {
      return errorResponse(parsed.error.errors[0]?.message || "Validation failed");
    }

    await settingsService.updateSettings(parsed.data);
    revalidatePath("/", "layout");
    return successResponse();
  } catch (err: any) {
    return errorResponse(err);
  }
}
