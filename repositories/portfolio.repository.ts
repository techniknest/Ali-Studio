import { connectDB } from "@/lib/mongodb";
import Portfolio from "@/models/Portfolio";

export class PortfolioRepository {
  async find(filter: Record<string, unknown>, skip: number, limit: number) {
    await connectDB();
    const items = await Portfolio.find(filter)
      .sort({ order: 1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
    return JSON.parse(JSON.stringify(items));
  }

  async count(filter: Record<string, unknown>): Promise<number> {
    await connectDB();
    return Portfolio.countDocuments(filter);
  }

  async findById(id: string) {
    await connectDB();
    const item = await Portfolio.findById(id).lean();
    return item ? JSON.parse(JSON.stringify(item)) : null;
  }

  async create(data: any) {
    await connectDB();
    const item = await Portfolio.create(data);
    return JSON.parse(JSON.stringify(item));
  }

  async update(id: string, data: any) {
    await connectDB();
    const item = await Portfolio.findByIdAndUpdate(id, data, { new: true }).lean();
    return item ? JSON.parse(JSON.stringify(item)) : null;
  }

  async delete(id: string): Promise<boolean> {
    await connectDB();
    const result = await Portfolio.findByIdAndDelete(id);
    return result !== null;
  }

  async deleteMany(ids: string[]): Promise<boolean> {
    await connectDB();
    const result = await Portfolio.deleteMany({ _id: { $in: ids } });
    return result.deletedCount > 0;
  }
}

export const portfolioRepository = new PortfolioRepository();
