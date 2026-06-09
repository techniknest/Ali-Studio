"use server";

import { requireAuth } from "@/lib/auth-helpers";
import { messageService } from "@/services/message.service";
import { ActionResponse, successResponse, errorResponse } from "@/lib/types/action-response";
import { contactSchema } from "@/lib/validators/content";
import { revalidatePath } from "next/cache";

function revalidateMessages() {
  revalidatePath("/admin/messages");
}

export async function getMessages(filter?: "all" | "read" | "unread") {
  try {
    await requireAuth();
    return await messageService.getMessages(filter);
  } catch (err) {
    console.error("Failed to fetch messages:", err);
    return [];
  }
}

export async function getUnreadCount() {
  try {
    return await messageService.getUnreadCount();
  } catch {
    return 0;
  }
}

export async function markMessageRead(id: string): Promise<ActionResponse> {
  try {
    await requireAuth();
    await messageService.markMessageRead(id);
    revalidateMessages();
    return successResponse();
  } catch (err: any) {
    return errorResponse(err);
  }
}

export async function deleteMessage(id: string): Promise<ActionResponse> {
  try {
    await requireAuth();
    await messageService.deleteMessage(id);
    revalidateMessages();
    return successResponse();
  } catch (err: any) {
    return errorResponse(err);
  }
}

export async function submitContactForm(data: unknown): Promise<ActionResponse> {
  try {
    const parsed = contactSchema.safeParse(data);
    if (!parsed.success) {
      return errorResponse(parsed.error.errors[0]?.message || "Validation failed");
    }

    await messageService.submitContactForm(parsed.data);
    return successResponse();
  } catch (err: any) {
    return errorResponse(err);
  }
}
