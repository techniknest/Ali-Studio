"use server";

import { requireAuth } from "@/lib/auth-helpers";
import { portfolioService } from "@/services/portfolio.service";
import { ActionResponse, successResponse, errorResponse } from "@/lib/types/action-response";
import { portfolioSchema } from "@/lib/validators/content";
import { revalidatePath } from "next/cache";

function revalidatePortfolio() {
  revalidatePath("/portfolio");
  revalidatePath("/");
}

export async function getPortfolioItems(options?: {
  visibleOnly?: boolean;
  featuredOnly?: boolean;
  category?: string;
  page?: number;
  limit?: number;
}) {
  try {
    return await portfolioService.getPortfolioItems(options);
  } catch (err) {
    console.error("Failed to fetch portfolio:", err);
    return { items: [], total: 0, pages: 0 };
  }
}

export async function getPortfolioItem(id: string) {
  try {
    await requireAuth();
    return await portfolioService.getPortfolioItem(id);
  } catch (err) {
    return null;
  }
}

export async function createPortfolioItem(data: unknown): Promise<ActionResponse> {
  try {
    await requireAuth();
    const parsed = portfolioSchema.safeParse(data);
    if (!parsed.success) {
      return errorResponse(parsed.error.errors[0]?.message || "Validation failed");
    }

    const item = await portfolioService.createItem(parsed.data) as any;
    revalidatePortfolio();
    return successResponse(undefined, item._id?.toString());
  } catch (err: any) {
    return errorResponse(err);
  }
}

export async function updatePortfolioItem(id: string, data: unknown): Promise<ActionResponse> {
  try {
    await requireAuth();
    const parsed = portfolioSchema.partial().safeParse(data);
    if (!parsed.success) {
      return errorResponse(parsed.error.errors[0]?.message || "Validation failed");
    }

    await portfolioService.updateItem(id, parsed.data);
    revalidatePortfolio();
    return successResponse();
  } catch (err: any) {
    return errorResponse(err);
  }
}

export async function deletePortfolioItem(id: string): Promise<ActionResponse> {
  try {
    await requireAuth();
    await portfolioService.deleteItem(id);
    revalidatePortfolio();
    return successResponse();
  } catch (err: any) {
    return errorResponse(err);
  }
}

export async function reorderPortfolioItems(ids: string[]): Promise<ActionResponse> {
  try {
    await requireAuth();
    await portfolioService.reorderItems(ids);
    revalidatePortfolio();
    return successResponse();
  } catch (err: any) {
    return errorResponse(err);
  }
}

export async function bulkDeletePortfolio(ids: string[]): Promise<ActionResponse> {
  try {
    await requireAuth();
    await portfolioService.bulkDelete(ids);
    revalidatePortfolio();
    return successResponse();
  } catch (err: any) {
    return errorResponse(err);
  }
}
