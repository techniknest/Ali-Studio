import { connectDB } from "@/lib/mongodb";
import Message from "@/models/Message";

export class MessageRepository {
  async find(query: Record<string, unknown>) {
    await connectDB();
    const messages = await Message.find(query)
      .sort({ createdAt: -1 })
      .lean();
    return JSON.parse(JSON.stringify(messages));
  }

  async count(query: Record<string, unknown>): Promise<number> {
    await connectDB();
    return Message.countDocuments(query);
  }

  async create(data: any) {
    await connectDB();
    const message = await Message.create(data);
    return JSON.parse(JSON.stringify(message));
  }

  async update(id: string, data: any) {
    await connectDB();
    const message = await Message.findByIdAndUpdate(id, data, { new: true }).lean();
    return message ? JSON.parse(JSON.stringify(message)) : null;
  }

  async delete(id: string): Promise<boolean> {
    await connectDB();
    const result = await Message.findByIdAndDelete(id);
    return result !== null;
  }
}

export const messageRepository = new MessageRepository();
