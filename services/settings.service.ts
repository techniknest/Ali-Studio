import { settingsRepository } from "@/repositories/settings.repository";

export class SettingsService {
  async getSettings() {
    return settingsRepository.get();
  }

  async updateSettings(data: any) {
    return settingsRepository.update(data);
  }
}

export const settingsService = new SettingsService();
