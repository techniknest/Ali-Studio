"use server";

import { requireAuth } from "@/lib/auth-helpers";
import { teamService } from "@/services/team.service";
import { ActionResponse, successResponse, errorResponse } from "@/lib/types/action-response";
import { revalidatePath } from "next/cache";

function revalidateTeam() {
  revalidatePath("/about");
  revalidatePath("/");
  revalidatePath("/admin/team");
}

export async function getTeam(visibleOnly = false, homeOnly = false): Promise<any[]> {
  try {
    return await teamService.getTeam(visibleOnly, homeOnly);
  } catch (err) {
    console.error("Failed to get team:", err);
    return [];
  }
}

export async function createTeamMember(data: any): Promise<ActionResponse> {
  try {
    await requireAuth();
    const item = await teamService.createMember(data) as any;
    revalidateTeam();
    return successResponse(undefined, item._id?.toString());
  } catch (err: any) {
    return errorResponse(err);
  }
}

export async function updateTeamMember(id: string, data: any): Promise<ActionResponse> {
  try {
    await requireAuth();
    await teamService.updateMember(id, data);
    revalidateTeam();
    return successResponse();
  } catch (err: any) {
    return errorResponse(err);
  }
}

export async function deleteTeamMember(id: string): Promise<ActionResponse> {
  try {
    await requireAuth();
    await teamService.deleteMember(id);
    revalidateTeam();
    return successResponse();
  } catch (err: any) {
    return errorResponse(err);
  }
}

export async function reorderTeam(ids: string[]): Promise<ActionResponse> {
  try {
    await requireAuth();
    await teamService.reorderTeam(ids);
    revalidateTeam();
    return successResponse();
  } catch (err: any) {
    return errorResponse(err);
  }
}
