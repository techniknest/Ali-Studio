"use server";

import { signOut } from "@/lib/auth";
import { requireAuth } from "@/lib/auth-helpers";
import { adminService } from "@/services/admin.service";
import { changeEmailSchema, changePasswordSchema } from "@/lib/validators/auth";
import { ActionResponse, successResponse, errorResponse } from "@/lib/types/action-response";

export async function changeAdminEmail(data: unknown): Promise<ActionResponse> {
  try {
    const session = await requireAuth();
    const parsed = changeEmailSchema.safeParse(data);
    if (!parsed.success) {
      return errorResponse(parsed.error.errors[0]?.message || "Validation failed");
    }

    await adminService.changeEmail(session.user.email, parsed.data);
    await signOut({ redirect: true, redirectTo: "/admin/login" });
    return successResponse();
  } catch (err: any) {
    return errorResponse(err);
  }
}

export async function requestPasswordChangeOtpAction(data: unknown): Promise<ActionResponse> {
  try {
    const session = await requireAuth();
    const parsed = changePasswordSchema.safeParse(data);
    if (!parsed.success) {
      return errorResponse(parsed.error.errors[0]?.message || "Validation failed");
    }

    await adminService.requestPasswordChangeOtp(session.user.email, parsed.data);
    return successResponse();
  } catch (err: any) {
    return errorResponse(err);
  }
}

export async function changeAdminPassword(data: unknown): Promise<ActionResponse> {
  try {
    const session = await requireAuth();
    const parsed = changePasswordSchema.safeParse(data);
    if (!parsed.success) {
      return errorResponse(parsed.error.errors[0]?.message || "Validation failed");
    }

    await adminService.changePassword(session.user.email, parsed.data);
    await signOut({ redirect: true, redirectTo: "/admin/login" });
    return successResponse();
  } catch (err: any) {
    return errorResponse(err);
  }
}
