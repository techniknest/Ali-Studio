"use server";

import { requireAuth } from "@/lib/auth-helpers";
import { connectDB } from "@/lib/mongodb";
import Review from "@/models/Review";
import { reviewSchema, publicReviewSchema } from "@/lib/validators/content";
import { revalidatePath } from "next/cache";

export async function getReviews(options?: {
  approvedOnly?: boolean;
  pendingOnly?: boolean;
  page?: number;
  limit?: number;
}) {
  try {
    await connectDB();
    const filter: Record<string, unknown> = {};
    if (options?.approvedOnly) filter.approved = true;
    if (options?.pendingOnly) filter.approved = false;

    const page = options?.page ?? 1;
    const limit = options?.limit ?? 12;
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      Review.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Review.countDocuments(filter),
    ]);

    return {
      items: JSON.parse(JSON.stringify(items)),
      total,
      pages: Math.ceil(total / limit),
    };
  } catch {
    return { items: [], total: 0, pages: 0 };
  }
}

export async function submitPublicReview(data: unknown) {
  const parsed = publicReviewSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0]?.message };
  }

  await connectDB();
  await Review.create({ ...parsed.data, approved: true });
  revalidatePath("/reviews");
  return {
    success: true,
    message: "Thank you! Your review has been published.",
  };
}

export async function createReview(data: unknown) {
  await requireAuth();
  const parsed = reviewSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0]?.message };
  }

  await connectDB();
  await Review.create(parsed.data);
  revalidatePath("/reviews");
  return { success: true };
}

export async function approveReview(id: string) {
  await requireAuth();
  await connectDB();
  await Review.findByIdAndUpdate(id, { approved: true });
  revalidatePath("/reviews");
  return { success: true };
}

export async function deleteReview(id: string) {
  await requireAuth();
  await connectDB();
  await Review.findByIdAndDelete(id);
  revalidatePath("/reviews");
  return { success: true };
}

export async function bulkApproveReviews(ids: string[]) {
  await requireAuth();
  await connectDB();
  await Review.updateMany({ _id: { $in: ids } }, { approved: true });
  revalidatePath("/reviews");
  return { success: true };
}

export async function bulkDeleteReviews(ids: string[]) {
  await requireAuth();
  await connectDB();
  await Review.deleteMany({ _id: { $in: ids } });
  revalidatePath("/reviews");
  return { success: true };
}
