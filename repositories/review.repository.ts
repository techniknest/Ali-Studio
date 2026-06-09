import { connectDB } from "@/lib/mongodb";
import Review from "@/models/Review";

export class ReviewRepository {
  async find(filter: Record<string, unknown>, skip: number, limit: number) {
    await connectDB();
    const items = await Review.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
    return JSON.parse(JSON.stringify(items));
  }

  async count(filter: Record<string, unknown>): Promise<number> {
    await connectDB();
    return Review.countDocuments(filter);
  }

  async create(data: any) {
    await connectDB();
    const item = await Review.create(data);
    return JSON.parse(JSON.stringify(item));
  }

  async update(id: string, data: any) {
    await connectDB();
    const item = await Review.findByIdAndUpdate(id, data, { new: true }).lean();
    return item ? JSON.parse(JSON.stringify(item)) : null;
  }

  async updateMany(ids: string[], data: any): Promise<boolean> {
    await connectDB();
    const result = await Review.updateMany({ _id: { $in: ids } }, data);
    return result.modifiedCount > 0;
  }

  async delete(id: string): Promise<boolean> {
    await connectDB();
    const result = await Review.findByIdAndDelete(id);
    return result !== null;
  }

  async deleteMany(ids: string[]): Promise<boolean> {
    await connectDB();
    const result = await Review.deleteMany({ _id: { $in: ids } });
    return result.deletedCount > 0;
  }
}

export const reviewRepository = new ReviewRepository();
