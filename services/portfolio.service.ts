import { portfolioRepository } from "@/repositories/portfolio.repository";
import { NotFoundError } from "@/lib/errors/app-error";

export class PortfolioService {
  async getPortfolioItems(options?: {
    visibleOnly?: boolean;
    featuredOnly?: boolean;
    category?: string;
    page?: number;
    limit?: number;
  }) {
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
      portfolioRepository.find(filter, skip, limit),
      portfolioRepository.count(filter),
    ]);

    return {
      items,
      total,
      pages: Math.ceil(total / limit),
    };
  }

  async getPortfolioItem(id: string) {
    const item = await portfolioRepository.findById(id);
    if (!item) return null;
    return item;
  }

  async createItem(data: any) {
    const count = await portfolioRepository.count({});
    const item = await portfolioRepository.create({ ...data, order: count });
    return item;
  }

  async updateItem(id: string, data: any) {
    const item = await portfolioRepository.update(id, data);
    if (!item) {
      throw new NotFoundError("Portfolio item");
    }
    return item;
  }

  async deleteItem(id: string) {
    const success = await portfolioRepository.delete(id);
    if (!success) {
      throw new NotFoundError("Portfolio item");
    }
    return true;
  }

  async reorderItems(ids: string[]) {
    await Promise.all(
      ids.map((id, index) => portfolioRepository.update(id, { order: index }))
    );
    return true;
  }

  async bulkDelete(ids: string[]) {
    return portfolioRepository.deleteMany(ids);
  }
}

export const portfolioService = new PortfolioService();
