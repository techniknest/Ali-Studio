"use server";

import { requireAuth } from "@/lib/auth-helpers";
import { configService } from "@/services/config.service";
import { ActionResponse, successResponse, errorResponse } from "@/lib/types/action-response";
import {
  mongoConfigSchema,
  cloudinaryConfigSchema,
  smtpConfigSchema,
  studioInfoSchema,
} from "@/lib/validators/config";
import { auth } from "@/lib/auth";

export async function testMongoUri(uri: string) {
  try {
    await requireAuth();
    const parsed = mongoConfigSchema.safeParse({ mongodbUri: uri });
    if (!parsed.success) {
      return { success: false, error: parsed.error.errors[0]?.message };
    }
    return await configService.testMongoUri(uri);
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function saveMongoConfig(uri: string): Promise<ActionResponse> {
  try {
    await requireAuth();
    const parsed = mongoConfigSchema.safeParse({ mongodbUri: uri });
    if (!parsed.success) {
      return errorResponse(parsed.error.errors[0]?.message || "Validation failed");
    }

    await configService.saveMongoConfig(uri);
    return successResponse();
  } catch (err: any) {
    return errorResponse(err);
  }
}

export async function testCloudinaryConfig(data: {
  cloudName: string;
  apiKey: string;
  apiSecret: string;
}) {
  try {
    await requireAuth();
    const parsed = cloudinaryConfigSchema.safeParse(data);
    if (!parsed.success) {
      return { success: false, error: parsed.error.errors[0]?.message };
    }
    return await configService.testCloudinaryConfig(data);
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function saveCloudinaryConfig(data: {
  cloudName: string;
  apiKey: string;
  apiSecret: string;
}): Promise<ActionResponse> {
  try {
    await requireAuth();
    const parsed = cloudinaryConfigSchema.safeParse(data);
    if (!parsed.success) {
      return errorResponse(parsed.error.errors[0]?.message || "Validation failed");
    }

    await configService.saveCloudinaryConfig(data);
    return successResponse();
  } catch (err: any) {
    return errorResponse(err);
  }
}

export async function testSmtpConfig(data: { user: string; pass: string }) {
  try {
    await requireAuth();
    const parsed = smtpConfigSchema.safeParse(data);
    if (!parsed.success) {
      return { success: false, error: parsed.error.errors[0]?.message };
    }

    const session = await auth();
    const toEmail = session?.user?.email;
    if (!toEmail) return { success: false, error: "No admin email in session" };

    await configService.testSmtpConfig(data, toEmail);
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function saveSmtpConfig(data: { user: string; pass: string }): Promise<ActionResponse> {
  try {
    await requireAuth();
    const parsed = smtpConfigSchema.safeParse(data);
    if (!parsed.success) {
      return errorResponse(parsed.error.errors[0]?.message || "Validation failed");
    }

    const session = await auth();
    const toEmail = session?.user?.email;
    if (!toEmail) return errorResponse("No admin email in session");

    await configService.saveSmtpConfig(data, toEmail);
    return successResponse();
  } catch (err: any) {
    return errorResponse(err);
  }
}

export async function saveStudioInfo(data: unknown): Promise<ActionResponse> {
  try {
    await requireAuth();
    const parsed = studioInfoSchema.safeParse(data);
    if (!parsed.success) {
      return errorResponse(parsed.error.errors[0]?.message || "Validation failed");
    }

    await configService.saveStudioInfo(parsed.data);
    return successResponse();
  } catch (err: any) {
    return errorResponse(err);
  }
}

export async function getInfrastructureStatus() {
  try {
    await requireAuth();
    return await configService.getInfrastructureStatus();
  } catch {
    return { mongoStatus: false, cloudinaryStatus: false, emailStatus: false };
  }
}

export async function checkSetupRequired() {
  return configService.checkSetupRequired();
}
