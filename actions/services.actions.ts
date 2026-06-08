"use server";

import { requireAuth } from "@/lib/auth-helpers";
import { connectDB } from "@/lib/mongodb";
import Service from "@/models/Service";
import { serviceSchema } from "@/lib/validators/content";
import { revalidatePath } from "next/cache";

export async function getServices(visibleOnly = false) {
  try {
    await connectDB();
    const filter = visibleOnly ? { visible: true } : {};
    const items = await Service.find(filter).sort({ order: 1 }).lean();
    return JSON.parse(JSON.stringify(items));
  } catch {
    return [];
  }
}

export async function createService(data: unknown) {
  await requireAuth();
  const parsed = serviceSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0]?.message };
  }

  await connectDB();
  const count = await Service.countDocuments();
  const item = await Service.create({ ...parsed.data, order: count });
  revalidatePath("/services");
  revalidatePath("/");
  return { success: true, id: item._id.toString() };
}

export async function updateService(id: string, data: unknown) {
  await requireAuth();
  const parsed = serviceSchema.partial().safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0]?.message };
  }

  await connectDB();
  await Service.findByIdAndUpdate(id, parsed.data);
  revalidatePath("/services");
  revalidatePath("/");
  return { success: true };
}

export async function deleteService(id: string) {
  await requireAuth();
  await connectDB();
  await Service.findByIdAndDelete(id);
  revalidatePath("/services");
  return { success: true };
}

export async function reorderServices(ids: string[]) {
  await requireAuth();
  await connectDB();
  await Promise.all(
    ids.map((id, index) => Service.findByIdAndUpdate(id, { order: index }))
  );
  revalidatePath("/services");
  return { success: true };
}
