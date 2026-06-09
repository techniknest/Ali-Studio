"use server";

import { requireAuth } from "@/lib/auth-helpers";
import { reviewService } from "@/services/review.service";
import { ActionResponse, successResponse, errorResponse } from "@/lib/types/action-response";
import { reviewSchema, publicReviewSchema } from "@/lib/validators/content";
import { revalidatePath } from "next/cache";

function revalidateReviews() {
  revalidatePath("/reviews");
  revalidatePath("/");
}

export async function getReviews(options?: {
  approvedOnly?: boolean;
  pendingOnly?: boolean;
  page?: number;
  limit?: number;
}) {
  try {
    return await reviewService.getReviews(options);
  } catch (err) {
    console.error("Failed to fetch reviews:", err);
    return { items: [], total: 0, pages: 0 };
  }
}

export async function submitPublicReview(data: unknown): Promise<ActionResponse & { message?: string }> {
  try {
    const parsed = publicReviewSchema.safeParse(data);
    if (!parsed.success) {
      return errorResponse(parsed.error.errors[0]?.message || "Validation failed");
    }

    await reviewService.submitPublicReview(parsed.data);
    revalidateReviews();
    return {
      success: true,
      message: "Thank you! Your review has been published.",
    };
  } catch (err: any) {
    return errorResponse(err);
  }
}

export async function createReview(data: unknown): Promise<ActionResponse> {
  try {
    await requireAuth();
    const parsed = reviewSchema.safeParse(data);
    if (!parsed.success) {
      return errorResponse(parsed.error.errors[0]?.message || "Validation failed");
    }

    const item = await reviewService.createReview(parsed.data) as any;
    revalidateReviews();
    return successResponse(undefined, item._id?.toString());
  } catch (err: any) {
    return errorResponse(err);
  }
}

export async function approveReview(id: string): Promise<ActionResponse> {
  try {
    await requireAuth();
    await reviewService.approveReview(id);
    revalidateReviews();
    return successResponse();
  } catch (err: any) {
    return errorResponse(err);
  }
}

export async function deleteReview(id: string): Promise<ActionResponse> {
  try {
    await requireAuth();
    await reviewService.deleteReview(id);
    revalidateReviews();
    return successResponse();
  } catch (err: any) {
    return errorResponse(err);
  }
}

export async function bulkApproveReviews(ids: string[]): Promise<ActionResponse> {
  try {
    await requireAuth();
    await reviewService.bulkApprove(ids);
    revalidateReviews();
    return successResponse();
  } catch (err: any) {
    return errorResponse(err);
  }
}

export async function bulkDeleteReviews(ids: string[]): Promise<ActionResponse> {
  try {
    await requireAuth();
    await reviewService.bulkDelete(ids);
    revalidateReviews();
    return successResponse();
  } catch (err: any) {
    return errorResponse(err);
  }
}
