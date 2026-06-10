import { teamRepository } from "@/repositories/team.repository";
import { NotFoundError } from "@/lib/errors/app-error";

export class TeamService {
  async getTeam(visibleOnly = false, homeOnly = false) {
    return teamRepository.findAll(visibleOnly, homeOnly);
  }

  async createMember(data: any) {
    const count = await teamRepository.count();
    const item = await teamRepository.create({ ...data, order: count });
    return item;
  }

  async updateMember(id: string, data: any) {
    const item = await teamRepository.update(id, data);
    if (!item) {
      throw new NotFoundError("Team member");
    }
    return item;
  }

  async deleteMember(id: string) {
    const success = await teamRepository.delete(id);
    if (!success) {
      throw new NotFoundError("Team member");
    }
    return true;
  }

  async reorderTeam(ids: string[]) {
    // Note: In a real enterprise app, we might do this transactionally
    await Promise.all(
      ids.map((id, index) => teamRepository.update(id, { order: index }))
    );
    return true;
  }
}

export const teamService = new TeamService();
