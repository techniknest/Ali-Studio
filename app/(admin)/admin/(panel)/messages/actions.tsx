"use server";

import { markMessageRead, deleteMessage } from "@/actions/messages.actions";
import { revalidatePath } from "next/cache";

export async function markReadAction(id: string) {
  await markMessageRead(id);
  revalidatePath("/admin/messages");
}

export async function deleteMessageAction(id: string) {
  await deleteMessage(id);
  revalidatePath("/admin/messages");
}
