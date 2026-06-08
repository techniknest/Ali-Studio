"use server";

import { requireAuth } from "@/lib/auth-helpers";
import { connectDB } from "@/lib/mongodb";
import Portfolio from "@/models/Portfolio";
import { portfolioSchema } from "@/lib/validators/content";
import { revalidatePath } from "next/cache";

export async function getPortfolioItems(options?: {
  visibleOnly?: boolean;
  featuredOnly?: boolean;
  category?: string;
  page?: number;
  limit?: number;
}) {
  try {
    await connectDB();
    const filter: Record<string, unknown> = {};
    if (options?.visibleOnly) filter.visible = true;
    if (options?.featuredOnly) filter.featured = true;
    if (options?.category && options.category !== "All") {
      filter.category = options.category;
    }

    const page = options?.page ?? 1;
    const limit = options?.limit ?? 12;
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      Portfolio.find(filter).sort({ order: 1, createdAt: -1 }).skip(skip).limit(limit).lean(),
      Portfolio.countDocuments(filter),
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

export async function getPortfolioItem(id: string) {
  await requireAuth();
  await connectDB();
  const item = await Portfolio.findById(id).lean();
  return item ? JSON.parse(JSON.stringify(item)) : null;
}

export async function createPortfolioItem(data: unknown) {
  await requireAuth();
  const parsed = portfolioSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0]?.message };
  }

  await connectDB();
  const count = await Portfolio.countDocuments();
  const item = await Portfolio.create({ ...parsed.data, order: count });
  revalidatePath("/portfolio");
  revalidatePath("/");
  return { success: true, id: item._id.toString() };
}

export async function updatePortfolioItem(id: string, data: unknown) {
  await requireAuth();
  const parsed = portfolioSchema.partial().safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0]?.message };
  }

  await connectDB();
  await Portfolio.findByIdAndUpdate(id, parsed.data);
  revalidatePath("/portfolio");
  revalidatePath("/");
  return { success: true };
}

export async function deletePortfolioItem(id: string) {
  await requireAuth();
  await connectDB();
  await Portfolio.findByIdAndDelete(id);
  revalidatePath("/portfolio");
  revalidatePath("/");
  return { success: true };
}

export async function reorderPortfolioItems(ids: string[]) {
  await requireAuth();
  await connectDB();
  await Promise.all(
    ids.map((id, index) =>
      Portfolio.findByIdAndUpdate(id, { order: index })
    )
  );
  revalidatePath("/portfolio");
  return { success: true };
}

export async function bulkDeletePortfolio(ids: string[]) {
  await requireAuth();
  await connectDB();
  await Portfolio.deleteMany({ _id: { $in: ids } });
  revalidatePath("/portfolio");
  return { success: true };
}
