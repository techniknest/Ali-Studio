import { reviewRepository } from "@/repositories/review.repository";
import { NotFoundError } from "@/lib/errors/app-error";

export class ReviewService {
  async getReviews(options?: {
    approvedOnly?: boolean;
    pendingOnly?: boolean;
    page?: number;
    limit?: number;
  }) {
    const filter: Record<string, unknown> = {};
    if (options?.approvedOnly) filter.approved = true;
    if (options?.pendingOnly) filter.approved = false;

    const page = options?.page ?? 1;
    const limit = options?.limit ?? 12;
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      reviewRepository.find(filter, skip, limit),
      reviewRepository.count(filter),
    ]);

    return {
      items,
      total,
      pages: Math.ceil(total / limit),
    };
  }

  async submitPublicReview(data: any) {
    return reviewRepository.create({ ...data, approved: true });
  }

  async createReview(data: any) {
    return reviewRepository.create(data);
  }

  async approveReview(id: string) {
    const item = await reviewRepository.update(id, { approved: true });
    if (!item) {
      throw new NotFoundError("Review");
    }
    return item;
  }

  async deleteReview(id: string) {
    const success = await reviewRepository.delete(id);
    if (!success) {
      throw new NotFoundError("Review");
    }
    return true;
  }

  async bulkApprove(ids: string[]) {
    return reviewRepository.updateMany(ids, { approved: true });
  }

  async bulkDelete(ids: string[]) {
    return reviewRepository.deleteMany(ids);
  }
}

export const reviewService = new ReviewService();
