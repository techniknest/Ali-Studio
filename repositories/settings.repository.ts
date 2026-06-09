import { connectDB } from "@/lib/mongodb";
import Settings, { defaultSettings, ISettings } from "@/models/Settings";

export class SettingsRepository {
  async get(): Promise<ISettings | null> {
    await connectDB();
    let settings = await Settings.findOne().lean();
    if (!settings) {
      const created = await Settings.create(defaultSettings);
      settings = created.toObject();
    }
    return settings ? JSON.parse(JSON.stringify(settings)) : null;
  }

  async update(data: Partial<ISettings>): Promise<ISettings> {
    await connectDB();
    const settings = await Settings.findOneAndUpdate({}, data, {
      upsert: true,
      new: true,
    }).lean();
    return JSON.parse(JSON.stringify(settings));
  }
}

export const settingsRepository = new SettingsRepository();
