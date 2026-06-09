import { connectDB } from "@/lib/mongodb";
import Config from "@/models/Config";

export class ConfigRepository {
  async save(
    key: string,
    value: string,
    category: "mongodb" | "cloudinary" | "resend" | "smtp"
  ) {
    await connectDB();
    const config = await Config.findOneAndUpdate(
      { key },
      { key, value, category },
      { upsert: true, new: true }
    ).lean();
    return JSON.parse(JSON.stringify(config));
  }

  async count(): Promise<number> {
    await connectDB();
    return Config.countDocuments();
  }
}

export const configRepository = new ConfigRepository();
