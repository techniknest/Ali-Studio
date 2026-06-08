"use server";

import { approveReview, deleteReview } from "@/actions/reviews.actions";
import { revalidatePath } from "next/cache";

export async function approveReviewAction(id: string) {
  await approveReview(id);
  revalidatePath("/admin/reviews");
}

export async function deleteReviewAction(id: string) {
  await deleteReview(id);
  revalidatePath("/admin/reviews");
}
