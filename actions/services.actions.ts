"use server";

import { requireAuth } from "@/lib/auth-helpers";
import { serviceService } from "@/services/service.service";
import { ActionResponse, successResponse, errorResponse } from "@/lib/types/action-response";
import { serviceSchema } from "@/lib/validators/content";
import { revalidatePath } from "next/cache";

function revalidateServices() {
  revalidatePath("/services");
  revalidatePath("/");
}

export async function getServices(visibleOnly = false) {
  try {
    return await serviceService.getServices(visibleOnly);
  } catch (err) {
    console.error("Failed to fetch services:", err);
    return [];
  }
}

export async function createService(data: unknown): Promise<ActionResponse> {
  try {
    await requireAuth();
    const parsed = serviceSchema.safeParse(data);
    if (!parsed.success) {
      return errorResponse(parsed.error.errors[0]?.message || "Validation failed");
    }

    const item = await serviceService.createService(parsed.data) as any;
    revalidateServices();
    return successResponse(undefined, item._id?.toString());
  } catch (err: any) {
    return errorResponse(err);
  }
}

export async function updateService(id: string, data: unknown): Promise<ActionResponse> {
  try {
    await requireAuth();
    const parsed = serviceSchema.partial().safeParse(data);
    if (!parsed.success) {
      return errorResponse(parsed.error.errors[0]?.message || "Validation failed");
    }

    await serviceService.updateService(id, parsed.data);
    revalidateServices();
    return successResponse();
  } catch (err: any) {
    return errorResponse(err);
  }
}

export async function deleteService(id: string): Promise<ActionResponse> {
  try {
    await requireAuth();
    await serviceService.deleteService(id);
    revalidateServices();
    return successResponse();
  } catch (err: any) {
    return errorResponse(err);
  }
}

export async function reorderServices(ids: string[]): Promise<ActionResponse> {
  try {
    await requireAuth();
    await serviceService.reorderServices(ids);
    revalidateServices();
    return successResponse();
  } catch (err: any) {
    return errorResponse(err);
  }
}
