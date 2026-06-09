import { connectDB } from "@/lib/mongodb";
import Service from "@/models/Service";

export class ServiceRepository {
  async findAll(visibleOnly = false) {
    await connectDB();
    const filter = visibleOnly ? { visible: true } : {};
    const items = await Service.find(filter).sort({ order: 1 }).lean();
    return JSON.parse(JSON.stringify(items));
  }

  async count(): Promise<number> {
    await connectDB();
    return Service.countDocuments();
  }

  async create(data: any) {
    await connectDB();
    const item = await Service.create(data);
    return JSON.parse(JSON.stringify(item));
  }

  async update(id: string, data: any) {
    await connectDB();
    const item = await Service.findByIdAndUpdate(id, data, { new: true }).lean();
    return item ? JSON.parse(JSON.stringify(item)) : null;
  }

  async delete(id: string): Promise<boolean> {
    await connectDB();
    const result = await Service.findByIdAndDelete(id);
    return result !== null;
  }
}

export const serviceRepository = new ServiceRepository();
